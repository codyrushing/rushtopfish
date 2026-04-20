import sharp from 'sharp';

const url = 'https://picsum.photos/id/200/1920/1280.webp';
const response = await fetch(url);
console.log('fetch status:', response.status);
const buffer = Buffer.from(await response.arrayBuffer());
console.log('buffer size:', buffer.length);
const result = await sharp(buffer)
  .webp()
  .resize(1280, 853, { fit: 'cover', position: 'center' })
  .toBuffer();
console.log('success, output size:', result.length);
