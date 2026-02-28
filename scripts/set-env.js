const fs = require('fs');
const path = require('path');

const envDirectory = path.join(__dirname, '../src/environments');

// Create the directory if it doesn't exist
if (!fs.existsSync(envDirectory)) {
  fs.mkdirSync(envDirectory, { recursive: true });
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const envConfigFile = `export const environment = {
  production: false,
  supabaseUrl: "${supabaseUrl}",
  supabaseAnonKey: "${supabaseAnonKey}",
};
`;

const envConfigProdFile = `export const environment = {
  production: true,
  supabaseUrl: "${supabaseUrl}",
  supabaseAnonKey: "${supabaseAnonKey}",
};
`;

fs.writeFileSync(path.join(envDirectory, 'environment.ts'), envConfigFile);
fs.writeFileSync(path.join(envDirectory, 'environment.prod.ts'), envConfigProdFile);

console.log('Environment files generated successfully.');
