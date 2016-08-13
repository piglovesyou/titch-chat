const Path = require('path');

module.exports = {
  indentedSyntax: true,
  includePaths: [
    Path.resolve(__dirname, '../thirdparty/kickstart-lib-core/sass'),
    Path.resolve(__dirname, '../src/sass'),
  ],
};
