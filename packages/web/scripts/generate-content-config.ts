#!/usr/bin/env bun
/**
 * Generates src/content/config.ts from public/admin/config.yml.
 * Run: bun run scripts/generate-content-config.ts
 */
import yaml from "js-yaml";
import { readFileSync, writeFileSync } from "fs";
import { dirname, basename } from "path";

// ======================= CMS CONFIG TYPES =======================

interface CmsField {
  name: string;
  label?: string;
  widget?: string;
  required?: boolean;
  options?: Array<string | { label: string; value: string }>;
  fields?: CmsField[];
  types?: CmsType[];
  value_type?: string;
}

interface CmsType {
  name: string;
  label?: string;
  fields?: CmsField[];
}

interface CmsCollectionFile {
  name: string;
  label?: string;
  file: string;
  fields: CmsField[];
}

interface CmsCollection {
  name: string;
  label?: string;
  folder?: string;
  files?: CmsCollectionFile[];
  fields?: CmsField[];
}

interface CmsConfig {
  _shared?: Record<string, CmsField[]>;
  collections: CmsCollection[];
}

// ======================= UTILITIES =======================

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function sharedKeyToSchemaName(key: string): string {
  return toPascalCase(key.replace(/_fields$/, "")) + "Schema";
}

// Map: field array → schema variable name (keyed by JSON.stringify for deep equality)
type SharedMap = Map<string, string>;

function buildSharedMap(shared: Record<string, CmsField[]>): SharedMap {
  const map: SharedMap = new Map();
  for (const [key, fields] of Object.entries(shared)) {
    map.set(JSON.stringify(fields), sharedKeyToSchemaName(key));
  }
  return map;
}

function lookupShared(fields: CmsField[], sharedMap: SharedMap): string | null {
  return sharedMap.get(JSON.stringify(fields)) ?? null;
}

// ======================= ZOD GENERATION =======================

function selectToEnum(options: Array<string | { label: string; value: string }>): string {
  const values = options.map((o) => (typeof o === "string" ? o : o.value));
  return `z.enum([${values.map((v) => `"${v}"`).join(", ")}])`;
}

function fieldToZodType(field: CmsField, sharedMap: SharedMap, depth: number): string {
  const widget = field.widget ?? "string";
  const pad = "  ".repeat(depth);

  switch (widget) {
    case "string":
    case "text":
    case "markdown":
    case "image":
    case "color":
      return "z.string()";

    case "boolean":
      return "z.boolean()";

    case "number":
      return field.value_type === "int" ? "z.number().int()" : "z.number()";

    case "select":
      return field.options?.length ? selectToEnum(field.options) : "z.string()";

    case "object": {
      if (!field.fields) return "z.record(z.unknown())";
      const shared = lookupShared(field.fields, sharedMap);
      if (shared) return shared;
      return `z.object({\n${renderFields(field.fields, sharedMap, depth + 1)}\n${pad}})`;
    }

    case "list": {
      if (field.types) return renderDiscriminatedUnion(field.types, sharedMap, depth);
      if (field.fields) {
        const shared = lookupShared(field.fields, sharedMap);
        if (shared) return `z.array(${shared})`;
        return `z.array(z.object({\n${renderFields(field.fields, sharedMap, depth + 1)}\n${pad}}))`;
      }
      return "z.array(z.unknown())";
    }

    default:
      return "z.unknown()";
  }
}

function renderField(field: CmsField, sharedMap: SharedMap, depth: number): string {
  const pad = "  ".repeat(depth);
  let type = fieldToZodType(field, sharedMap, depth);
  if (field.required === false) type += ".optional()";
  return `${pad}${field.name}: ${type}`;
}

function renderFields(fields: CmsField[], sharedMap: SharedMap, depth: number): string {
  return fields.map((f) => renderField(f, sharedMap, depth)).join(",\n");
}

function renderDiscriminatedUnion(types: CmsType[], sharedMap: SharedMap, depth: number): string {
  const pad = "  ".repeat(depth);
  const itemPad = "  ".repeat(depth + 1);
  const fieldPad = "  ".repeat(depth + 2);

  const variants = types.map((type) => {
    const fieldLines = (type.fields ?? [])
      .map((f) => {
        let t = fieldToZodType(f, sharedMap, depth + 2);
        if (f.required === false) t += ".optional()";
        return `${fieldPad}${f.name}: ${t}`;
      })
      .join(",\n");
    const typeLine = `${fieldPad}type: z.literal("${type.name}")`;
    const inner = fieldLines ? `${typeLine},\n${fieldLines}` : typeLine;
    return `${itemPad}z.object({\n${inner}\n${itemPad}})`;
  });

  return `z.discriminatedUnion("type", [\n${variants.join(",\n")}\n${pad}])`;
}

function renderObjectSchema(fields: CmsField[], sharedMap: SharedMap): string {
  return `z.object({\n${renderFields(fields, sharedMap, 1)}\n})`;
}

// ======================= LOADER GENERATION =======================

function stripWebPrefix(path: string): string {
  return path.replace(/^packages\/web\//, "./");
}

function getLoader(collection: CmsCollection, all: CmsCollection[]): string {
  if (collection.folder) {
    const folder = collection.folder;
    const base = stripWebPrefix(folder);

    // Exclusions: files from file-based collections that live directly in this folder
    const exclusions = all.flatMap((other) => {
      if (other.name === collection.name || !other.files) return [];
      return other.files
        .filter((f) => dirname(f.file) === folder)
        .map((f) => `"!${basename(f.file)}"`);
    });

    // If another collection covers a subdirectory, don't recurse
    const hasSubdirs = all.some((other) => {
      if (other.name === collection.name) return false;
      if (other.folder) return other.folder.startsWith(folder + "/");
      return other.files?.some((f) => dirname(f.file).startsWith(folder + "/")) ?? false;
    });

    const glob = hasSubdirs ? "*.{yml,md}" : "**/*.{yml,md}";
    const pattern =
      exclusions.length > 0
        ? `[${[`"${glob}"`, ...exclusions].join(", ")}]`
        : `"${glob}"`;

    return `glob({ pattern: ${pattern}, base: "${base}" })`;
  }

  if (collection.files) {
    if (collection.files.length === 1) {
      const f = collection.files[0].file;
      return `glob({ pattern: "${basename(f)}", base: "${stripWebPrefix(dirname(f))}" })`;
    }
    const base = stripWebPrefix(dirname(collection.files[0].file));
    const patterns = collection.files.map((f) => `"${basename(f.file)}"`).join(", ");
    return `glob({ pattern: [${patterns}], base: "${base}" })`;
  }

  return `glob({ pattern: "**/*.{yml,md}", base: "./src/content/${collection.name}" })`;
}

// ======================= SCHEMA RESOLUTION =======================

interface CollectionEntry {
  astroName: string;
  schemaName: string;
  loader: string;
}

function resolveCollections(
  collections: CmsCollection[],
  sharedMap: SharedMap
): { entries: CollectionEntry[]; localSchemas: Map<string, { schemaName: string; fields: CmsField[] }> } {
  const entries: CollectionEntry[] = [];
  const localSchemas = new Map<string, { schemaName: string; fields: CmsField[] }>();
  const seen = new Set<string>();

  for (const col of collections) {
    const astroName = col.name.replace(/-/g, "_");
    const loader = getLoader(col, collections);

    let fields: CmsField[] | null = null;

    if (col.files) {
      // For a single-file collection, use that file's fields
      // For multi-file, all files should share the same schema (use first)
      fields = col.files[0].fields;
    } else if (col.fields) {
      fields = col.fields;
    }

    if (!fields) continue;

    // Check if fields match a shared schema
    let schemaName = lookupShared(fields, sharedMap);

    if (!schemaName) {
      // Generate a local schema name from the collection name
      schemaName = toPascalCase(astroName) + "Schema";
      if (!seen.has(schemaName)) {
        localSchemas.set(schemaName, { schemaName, fields });
        seen.add(schemaName);
      }
    }

    entries.push({ astroName, schemaName, loader });
  }

  return { entries, localSchemas };
}

// ======================= FILE GENERATION =======================

function generate(cmsConfig: CmsConfig): string {
  const shared = cmsConfig._shared ?? {};
  const sharedMap = buildSharedMap(shared);
  const { entries, localSchemas } = resolveCollections(cmsConfig.collections, sharedMap);

  const out: string[] = [];

  out.push("// AUTO-GENERATED from public/admin/config.yml");
  out.push("// Run: bun run scripts/generate-content-config.ts");
  out.push("");
  out.push('import { defineCollection, z } from "astro:content";');
  out.push('import { glob } from "astro/loaders";');
  out.push("");

  // Shared schemas
  if (Object.keys(shared).length > 0) {
    out.push("// ======================= SHARED SCHEMAS =======================");
    out.push("");
    for (const [key, fields] of Object.entries(shared)) {
      out.push(`export const ${sharedKeyToSchemaName(key)} = ${renderObjectSchema(fields, sharedMap)};`);
      out.push("");
    }
  }

  // Local (collection-specific) schemas
  if (localSchemas.size > 0) {
    out.push("// ======================= COLLECTION SCHEMAS =======================");
    out.push("");
    for (const { schemaName, fields } of localSchemas.values()) {
      out.push(`export const ${schemaName} = ${renderObjectSchema(fields, sharedMap)};`);
      out.push("");
    }
  }

  // Exported types
  out.push("// ======================= EXPORTED TYPES =======================");
  out.push("");

  const exportedSchemas = new Set<string>();

  for (const key of Object.keys(shared)) {
    const schemaName = sharedKeyToSchemaName(key);
    if (!exportedSchemas.has(schemaName)) {
      out.push(`export type ${schemaName.replace(/Schema$/, "")} = z.infer<typeof ${schemaName}>;`);
      exportedSchemas.add(schemaName);
    }
  }

  for (const { schemaName } of entries) {
    if (!exportedSchemas.has(schemaName)) {
      out.push(`export type ${schemaName.replace(/Schema$/, "")} = z.infer<typeof ${schemaName}>;`);
      exportedSchemas.add(schemaName);
    }
  }

  out.push("");

  // Astro collections
  out.push("// ======================= COLLECTIONS =======================");
  out.push("");
  out.push("export const collections = {");

  for (let i = 0; i < entries.length; i++) {
    const { astroName, schemaName, loader } = entries[i];
    const comma = i < entries.length - 1 ? "," : "";
    out.push(`  ${astroName}: defineCollection({`);
    out.push(`    loader: ${loader},`);
    out.push(`    schema: ${schemaName},`);
    out.push(`  })${comma}`);
  }

  out.push("};");
  out.push("");

  return out.join("\n");
}

// ======================= ENTRY POINT =======================

const configYmlPath = new URL("../public/admin/config.yml", import.meta.url).pathname;
const outputPath = new URL("../src/content/config.ts", import.meta.url).pathname;

const cmsConfig = yaml.load(readFileSync(configYmlPath, "utf-8")) as CmsConfig;
const output = generate(cmsConfig);
writeFileSync(outputPath, output);
console.log(`Generated ${outputPath}`);
