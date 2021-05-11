"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clean = clean;

var _del = _interopRequireDefault(require("del"));

var _fs = require("fs");

var _path = require("path");

var _util = require("./util");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Delete any file in the `dir` that is not in the expectedPaths
 */


async function clean(dir, expectedPaths, logger) {
  let filenames;

  try {
    filenames = await (0, _fs.readdirSync)(dir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // directory doesn't exist, that's as clean as it gets
      return;
    }

    throw error;
  }

  await (0, _util.asyncMap)(filenames, async filename => {
    const path = (0, _path.resolve)(dir, filename);

    if (!expectedPaths.includes(path)) {
      logger.warning(`Deleting unexpected file ${path}`);
      await (0, _del.default)(path, {
        force: true
      });
    }
  });
}