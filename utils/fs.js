const Fs = require('fs');
const Path = require('path');

function getOutputFilePath(url, outputDir) {
  const archiveName = url.substring(url.lastIndexOf('/') + 1);
  return Path.resolve(__basedir, outputDir, archiveName);
}

async function ensureFilePath(filePath) {
  const parentDir = Path.dirname(filePath);

  return Fs.exists(parentDir, exists => {
    if (!exists) {
      console.log(`Creating dir: ${parentDir}...`);
      Fs.mkdir(parentDir, { recursive: true }, err => {
        if (err) {
          throw err;
        }
      });
    }
  });
}

module.exports = {
  getOutputFilePath,
  ensureFilePath
}