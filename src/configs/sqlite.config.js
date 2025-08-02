const db = require('better-sqlite3')('ama.sqlite', { verbose: console.log });
const vectorlite = require('vectorlite');
db.loadExtension(vectorlite.vectorlitePath());

module.exports = db;
