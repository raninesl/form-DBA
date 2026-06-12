const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const dbType = args[0];

if (!dbType) {
  console.error('Veuillez spécifier le type de base de données: sqlite ou postgresql');
  process.exit(1);
}

let sourceSchema;
if (dbType === 'sqlite') {
  sourceSchema = 'schema.dev.prisma';
} else if (dbType === 'postgresql') {
  sourceSchema = 'schema.prod.prisma';
} else {
  console.error('Type de base de données invalide. Utilisez sqlite ou postgresql');
  process.exit(1);
}

const sourcePath = path.join(__dirname, '..', 'prisma', sourceSchema);
const targetPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

try {
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`✓ Schéma changé avec succès pour ${dbType}!`);
} catch (error) {
  console.error('Erreur lors du changement de schéma:', error);
  process.exit(1);
}
