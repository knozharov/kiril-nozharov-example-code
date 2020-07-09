require('dotenv').config();

const config = {
  archiveUrl: process.env.ARCHIVE_URL,
  reuseArchive: process.env.REUSE_ARCHIVE === 'true',
  dbUrl: process.env.DB_URL
};

module.exports = config;
