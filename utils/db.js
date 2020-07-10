const db = require('../models');

async function createDbEntries(entries, ebookId, model, propFunc, ebookMapProp, ebookMapModel) {
  try {
    const savedEntryIds = await Promise.all(entries.map(async entry => {
      const [entryDb, created] = await model.findOrCreate({
        where: propFunc(entry),
        defaults: propFunc(entry)
      });
      return entryDb.id;
    }));

    const ebookMapEntries = savedEntryIds.map(entryId => ({ ebookId, [ebookMapProp]: entryId }));

    await ebookMapModel.bulkCreate(ebookMapEntries, { updateOnDuplicate: Object.keys(ebookMapModel.rawAttributes) });
  } catch (error) {
    console.error(`Error while creating entries in DB: ${error}`); 
  }
}

async function createSubjects(subjects, ebookId) {
  await createDbEntries(subjects, ebookId, db.Subject, (data) => ({ description: data.description }), 'subjectId', db.EbookSubjects);
}

async function createAuthors(authors, ebookId) {
  await createDbEntries(authors, ebookId, db.Author, (data) => ({ name: data.name }), 'authorId', db.EbookAuthors);
}

async function createLicenseRights(licenseRights, ebookId) {
  await createDbEntries(licenseRights, ebookId, db.LicenseRight, (data) => ({ description: data.description }), 'licenseRightId', db.EbookLicenseRights);
}

async function createEbook(data) {
  const [savedEbook, created] = await db.Ebook.findOrCreate({
    where: {
      pgId: data.id,
    },
    defaults: {
      pgId: data.id,
      title: data.title,
      publisher: data.publisher,
      datePublished: data.publicationDate,
      language: data.language
    }
  });

  if (!created) {
    console.log(`DB entry for ebook with pgId: ${savedEbook.pgId} | title: '${savedEbook.title}' already exists.`);
    return;
  }

  await createAuthors(data.authors, savedEbook.id);
  await createSubjects(data.subjects, savedEbook.id);
  await createLicenseRights(data.licenseRights, savedEbook.id);
  console.log(`Saved all info for ebook with pgId: ${savedEbook.pgId} | title: '${savedEbook.title}'`);
}

module.exports = {
  createEbook
};
