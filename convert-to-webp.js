import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folders = ['public', 'public/compressed'];

folders.forEach(folder => {
  const fullPath = path.join(__dirname, folder);
  if (!fs.existsSync(fullPath)) return;
  const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.png'));
  files.forEach(file => {
    const inputPath = path.join(fullPath, file);
    const outputPath = inputPath.replace(/\.png$/, '.webp');
    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => console.log(`✅ Converted: ${file} -> ${path.basename(outputPath)}`))
      .catch(err => console.error(`❌ Error converting ${file}:`, err));
  });
});