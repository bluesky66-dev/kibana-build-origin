"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildDocsScript = buildDocsScript;
exports.buildDocsArgs = buildDocsArgs;
exports.defaultDocsRepoPath = defaultDocsRepoPath;

var _path = require("path");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const kibanaDir = (0, _path.resolve)(__dirname, '..', '..');

function buildDocsScript(cmd) {
  return (0, _path.resolve)(process.cwd(), cmd.docrepo, 'build_docs');
}

function buildDocsArgs(cmd) {
  const docsIndexFile = (0, _path.resolve)(kibanaDir, 'docs', 'index.asciidoc');
  let args = ['--doc', docsIndexFile, '--chunk=1'];

  if (cmd.open) {
    args = [...args, '--open'];
  }

  return args;
}

function defaultDocsRepoPath() {
  return (0, _path.resolve)(kibanaDir, '..', 'docs');
}