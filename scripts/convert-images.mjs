import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\zahin\\.gemini\\antigravity-ide\\brain\\c911cbff-c966-4cd3-ac8a-9104c0688b7e';
const targetDir = path.resolve('public/images/defaults');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(brainDir);

const mapping = [
  { prefix: 'hero_cabin_', target: 'hero-cabin.webp', width: 960, height: 1280 },
  { prefix: 'showcase_reservations_', target: 'showcase-reservations.webp', width: 1600, height: 1200 },
  { prefix: 'showcase_housekeeping_', target: 'showcase-housekeeping.webp', width: 1600, height: 1200 },
  { prefix: 'showcase_operations_', target: 'showcase-operations.webp', width: 1600, height: 1200 },
  { prefix: 'showcase_analytics_', target: 'showcase-analytics.webp', width: 1600, height: 1200 },
  { prefix: 'avatar_sarah_', target: 'avatar-sarah.webp', width: 512, height: 512 },
  { prefix: 'avatar_james_', target: 'avatar-james.webp', width: 512, height: 512 },
  { prefix: 'avatar_david_', target: 'avatar-david.webp', width: 512, height: 512 },
  { prefix: 'avatar_emily_', target: 'avatar-emily.webp', width: 512, height: 512 },
  { prefix: 'avatar_daniel_', target: 'avatar-daniel.webp', width: 512, height: 512 },
  { prefix: 'avatar_sofia_', target: 'avatar-sofia.webp', width: 512, height: 512 },
  { prefix: 'avatar_alex_', target: 'avatar-alex.webp', width: 512, height: 512 },
];

async function convert() {
  for (const item of mapping) {
    const match = files.find(f => f.startsWith(item.prefix) && f.endsWith('.jpg'));
    if (!match) {
      console.warn(`No file found for prefix ${item.prefix}`);
      continue;
    }
    const sourcePath = path.join(brainDir, match);
    const destPath = path.join(targetDir, item.target);
    console.log(`Converting ${match} -> ${item.target} (${item.width}x${item.height})...`);
    await sharp(sourcePath)
      .resize(item.width, item.height, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(destPath);
    console.log(`Created: ${destPath}`);
  }
  console.log('All image conversions finished successfully.');
}

convert().catch(err => {
  console.error('Conversion failed:', err);
  process.exit(1);
});
