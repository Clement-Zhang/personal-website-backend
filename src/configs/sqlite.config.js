const db = require('better-sqlite3')('dating.sqlite', { verbose: console.log });
const vectorlite = require('vectorlite');
db.loadExtension(vectorlite.vectorlitePath());

module.exports = db;
