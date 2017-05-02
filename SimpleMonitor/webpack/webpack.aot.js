var { AotPlugin } = require('@ngtools/webpack');

function getAotPlugin() {  

  let aotPlugin = new AotPlugin({
    tsConfigPath: './ClientApp/tsconfig.json',
    skipCodeGeneration: false
  });

  aotPlugin._compilerHost._resolve = function (pathToResolve) {
    var path1 = require("path");
    pathToResolve = aotPlugin._compilerHost._normalizePath(pathToResolve);
    if (pathToResolve[0] === '.') {
      return aotPlugin._compilerHost._normalizePath(path1.join(aotPlugin._compilerHost.getCurrentDirectory(), pathToResolve));
    }
    else if (pathToResolve[0] === '/' || pathToResolve.match(/^\w:\//)) {
      return pathToResolve;
    }
    else {
      return aotPlugin._compilerHost._normalizePath(path1.join(aotPlugin._compilerHost._basePath, pathToResolve));
    }
  };

  return aotPlugin;
}

module.exports = {
  getAotPlugin: getAotPlugin
};