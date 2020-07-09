const Axios = require('axios').default;
const Fs = require('fs');
const Unzipper = require('Unzipper');
const TarStream = require('tar-stream');
const FsUtils = require('./fs');
const MetadataUtils = require('./metadata');
const DbUtils = require('./db');

async function downloadArchive(url, outputFilePath) {
  try {
    console.log(`Downloading archive...`);

    const response = await Axios.get(url, { responseType: 'stream' });
    await FsUtils.ensureFilePath(outputFilePath);
    const fsWriter = Fs.createWriteStream(outputFilePath);

    return new Promise((resolve, reject) => {
      response.data.pipe(fsWriter);
      let error = null;
      fsWriter.on('error', _error => {
        error = _error;
        fsWriter.close();
        reject(_error);
      });
      fsWriter.on('close', () => {
        if (!error) {
          resolve();
        }
      });
    });
  } catch (error) {
    throw error;
  }
}

async function processArchive(archiveFilePath) {
  const zip = Fs.createReadStream(archiveFilePath).pipe(Unzipper.Parse({ forceStream: true }));
  const extract = TarStream.extract()
  extract.on('entry', (header, stream, next) => {
    let chunks = [];

    stream.on('data', (chunk) => {
      chunks.push(...chunk);
    })
    stream.on('end', async () => {
      try {
        const eBookRdf = Buffer.from(chunks).toString('utf8');
        const metadata = await MetadataUtils.processEBookRdf(eBookRdf, header);
        await DbUtils.createEbook(metadata);
      } catch (error) {
        console.error(`Error while processing file entry: ${header.name}: ${error}`);
      } finally {
        next();
      }
    });

    stream.resume();
  });
  extract.on('finish', () => {
    console.log('done');
  });

  for await (const entry of zip) {
    console.log('file: ', entry.path);

    if (entry.path.endsWith('.tar')) {
      entry.pipe(extract);
    }
  }
}

module.exports = {
  downloadArchive,
  processArchive
};
