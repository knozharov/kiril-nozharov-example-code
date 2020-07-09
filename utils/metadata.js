const Xml2js = require('xml2js');

function isValidArrayNode(arrNode) {
  return arrNode && Array.isArray(arrNode) && arrNode.length > 0;
}

function getMetaEntry(metaObj, prop) {
  if (isValidArrayNode(metaObj)) {
    return prop ? metaObj[0][prop] : metaObj[0];
  }

  return null;
}

function getMetaSubjects(subjectsNode) {
  if (!isValidArrayNode(subjectsNode)) {
    return [];
  }

  return subjectsNode.reduce((subjects, subjectNode) => {
    const valueNode = getMetaEntry(subjectNode['rdf:Description'], 'rdf:value');
    const description = getMetaEntry(valueNode);
    subjects.push({ description });
    return subjects;
  }, []);
}

function getMetaLanguage(rootNode) {
  const descrNode = getMetaEntry(rootNode['dcterms:language'], 'rdf:Description');
  const valueNode = getMetaEntry(descrNode, 'rdf:value');
  const lang = getMetaEntry(valueNode, '_');
  return lang;
}

function getMetaAuthors(authorsNode) {
  if (!isValidArrayNode(authorsNode)) {
    return [];
  }

  return authorsNode.reduce((authors, authorNode) => {
    const agentNode = getMetaEntry(authorNode['pgterms:agent']);
    const name = getMetaEntry(agentNode['pgterms:name']);
    authors.push({ name });
    return authors;
  }, []);
}

function getMetaLicenseRights(licenseRightsNode) {
  if (!isValidArrayNode(licenseRightsNode)) {
    return [];
  }

  return licenseRightsNode.map(description => ({ description }));
}

function getEbookMetadata(rdf, header) {
  const rootNode = rdf['rdf:RDF'];
  const pgTermsEbookNode = rootNode['pgterms:ebook'];
  
  if (!pgTermsEbookNode || pgTermsEbookNode.length === 0) {
    return null;
  }
  const pgTermsEbook = pgTermsEbookNode[0];

  const bookIdRegex = /^(?:.*\/pg)(?<id>\d+)(?:.*$)/;
  const groups = header.name.match(bookIdRegex).groups;
  if (!groups.id) {
    console.error(`Failed to parse file entry: ${header.name}`);
    return null;
  }
  
  const id = parseInt(groups.id);
  const title = getMetaEntry(pgTermsEbook['dcterms:title']);
  const authors = getMetaAuthors(pgTermsEbook['dcterms:creator']);
  const publisher = getMetaEntry(pgTermsEbook['dcterms:publisher']);
  const publicationDate = Date.parse(getMetaEntry(pgTermsEbook['dcterms:issued'], '_'));
  const language = getMetaLanguage(pgTermsEbook);
  const subjects = getMetaSubjects(pgTermsEbook['dcterms:subject']);
  const licenseRights = getMetaLicenseRights(pgTermsEbook['dcterms:rights']);
  
  return {
    id,
    title,
    authors,
    publisher,
    publicationDate,
    language,
    subjects,
    licenseRights
  };
}

function processEBookRdf(rdf, header) {
  return new Promise((resolve, reject) => {
    Xml2js.parseString(rdf, (err, res) => {
      if (err) {
        reject(err);
      } else {
        const metadata = getEbookMetadata(res, header);
        resolve(metadata);
      }
    });
  })
}

module.exports = {
  processEBookRdf
}
