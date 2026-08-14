const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '../data/i18n');
const esPath = path.join(i18nDir, 'es.json');
const enPath = path.join(i18nDir, 'en.json');
const ptPath = path.join(i18nDir, 'pt.json');

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], `${prefix}${key}.`));
    } else {
      keys.push(`${prefix}${key}`);
    }
  }
  return keys;
}

function countKeys(obj) {
    return getAllKeys(obj).length;
}

function compareKeys(source, target, targetName) {
  const sourceKeys = getAllKeys(source);
  const targetKeys = getAllKeys(target);

  const missing = sourceKeys.filter(k => !targetKeys.includes(k));
  const extra = targetKeys.filter(k => !sourceKeys.includes(k));

  let pass = true;
  if (missing.length > 0) {
    console.error(`❌ Faltan claves en ${targetName}:`, missing.slice(0, 10).join(', ') + (missing.length > 10 ? '...' : ''));
    pass = false;
  }
  if (extra.length > 0) {
    console.warn(`⚠️ Claves sobrantes en ${targetName}:`, extra.slice(0, 10).join(', ') + (extra.length > 10 ? '...' : ''));
  }
  return pass;
}

try {
  const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));
  
  let en = {}, pt = {};
  try { en = JSON.parse(fs.readFileSync(enPath, 'utf8')); } catch(e) { console.error('❌ Falta en.json'); }
  try { pt = JSON.parse(fs.readFileSync(ptPath, 'utf8')); } catch(e) { console.error('❌ Falta pt.json'); }

  console.log(`ES: ${countKeys(es)} keys`);
  console.log(`EN: ${countKeys(en)} keys`);
  console.log(`PT: ${countKeys(pt)} keys`);
  console.log('');

  const enPass = Object.keys(en).length > 0 ? compareKeys(es, en, 'EN') : false;
  const ptPass = Object.keys(pt).length > 0 ? compareKeys(es, pt, 'PT') : false;

  if (enPass && ptPass) {
    console.log('✅ i18n validation: PASS');
    process.exit(0);
  } else {
    console.error('❌ i18n validation: FAIL');
    process.exit(1);
  }

} catch (err) {
  console.error('Error leyendo archivos i18n:', err.message);
  process.exit(1);
}
