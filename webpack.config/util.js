const glob = require('glob');
const path = require('path');

module.exports.getEntries = function (globPath) {
  let entries = {},
    basename,
    tmp,
    pathname;
  glob.sync(globPath).forEach((entry) => {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);
    pathname = tmp.splice(0, 1) + '/' + basename; // 输出 js 和 html 的路径
    entries[basename] = entry;
  });
  return entries;
}

