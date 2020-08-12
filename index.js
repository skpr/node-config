import fs from 'fs'

// Loads the skpr config into and object.
function skprConfig(path = '/etc/skpr/data/config.json') {
    let data = fs.readFileSync(path, 'utf-8')
    let skprConfig = JSON.parse(data)
    for (const [key, value] of Object.entries(skprConfig)) {
        process.env[convertToEnvVarName(key)] = value
    }
    return skprConfig
}

// Converts a key name into a suitable environment variable name.
function convertToEnvVarName(key) {
    return key.replace(/[^A-Za-z0-9 ]/g, '_').toUpperCase()
}

export {skprConfig};
