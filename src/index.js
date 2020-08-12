import fs from 'fs';

// Converts a key name into a suitable environment variable name.
function convertToEnvVarName(key) {
  return key.replace(/[^A-Za-z0-9 ]/g, '_').toUpperCase();
}

// Loads the skpr config into an object.
function load(path = '/etc/skpr/data/config.json') {
  const data = fs.readFileSync(path, 'utf-8');
  const config = JSON.parse(data);
  Object.keys(config).forEach((key) => {
    process.env[convertToEnvVarName(key)] = config[key];
  });
  return config;
}

export default load;
