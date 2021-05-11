"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _lodash = _interopRequireDefault(require("lodash"));

var _glob = _interopRequireDefault(require("glob"));

var _path = _interopRequireDefault(require("path"));

var _process_function_definition = _interopRequireDefault(require("./process_function_definition"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function _default(directory) {
  function getTuple(directory, name) {
    return [name, require('../' + directory + '/' + name)]; // eslint-disable-line import/no-dynamic-require
  } // Get a list of all files and use the filename as the object key


  const files = _lodash.default.map(_glob.default.sync(_path.default.resolve(__dirname, '../' + directory + '/*.js')).filter(filename => !filename.includes('.test')), function (file) {
    const name = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.'));
    return getTuple(directory, name);
  }); // Get a list of all directories with an index.js, use the directory name as the key in the object


  const directories = _lodash.default.chain(_glob.default.sync(_path.default.resolve(__dirname, '../' + directory + '/*/index.js'))).map(function (file) {
    const parts = file.split('/');
    const name = parts[parts.length - 2];
    return getTuple(directory, name);
  }).value();

  const functions = _lodash.default.fromPairs(files.concat(directories));

  _lodash.default.each(functions, function (func) {
    _lodash.default.assign(functions, (0, _process_function_definition.default)(func));
  });

  return functions;
}

module.exports = exports.default;