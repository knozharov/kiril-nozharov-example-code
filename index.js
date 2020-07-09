const Utils = require('./utils');
const fs = require('fs');
const config = require('./config');

global.__basedir = __dirname;

(async function main() {
  console.time('Test-Task timer');

  try {
    const { archiveUrl, reuseArchive } = config;
    const archiveFilePath = Utils.fs.getOutputFilePath(archiveUrl, 'data');
    if (!reuseArchive || !fs.existsSync(archiveFilePath)) {
      await Utils.archive.downloadArchive(archiveUrl, archiveFilePath);
    }
    await Utils.archive.processArchive(archiveFilePath);
  } catch (error) {
    console.error(`Error while processing the archive: ${error}`);
    process.exit(-1);
  } finally {
    console.timeEnd('Test-Task timer');
  }

  console.log('Program finished successfully.');
  process.exit(0);
})();
