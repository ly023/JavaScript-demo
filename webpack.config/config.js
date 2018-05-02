const path = require('path');
const util = require('./util');

module.exports = {
  entries: util.getEntries(path.resolve(__dirname, '../src/views/**/*.js')),
  pages: util.getEntries(path.resolve(__dirname, '../src/views/**/*.html')),
  port: 8080,
}