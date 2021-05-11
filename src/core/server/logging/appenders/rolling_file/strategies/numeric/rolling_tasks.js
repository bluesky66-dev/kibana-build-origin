"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rollCurrentFile = exports.rollPreviousFilesInOrder = exports.deleteFiles = exports.getOrderedRolledFiles = exports.shouldSkipRollout = void 0;

var _path = require("path");

var _promises = require("fs/promises");

var _pattern_matcher = require("./pattern_matcher");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const shouldSkipRollout = async ({
  logFilePath
}) => {
  // in case of time-interval triggering policy, we can have an entire
  // interval without any log event. In that case, the log file is not even
  // present, and we should not perform the rollout
  try {
    await (0, _promises.access)(logFilePath);
    return false;
  } catch (e) {
    return true;
  }
};
/**
 * Returns the rolled file basenames, from the most recent to the oldest.
 */


exports.shouldSkipRollout = shouldSkipRollout;

const getOrderedRolledFiles = async ({
  logFileBaseName,
  logFileFolder,
  pattern
}) => {
  const matcher = (0, _pattern_matcher.getFileNameMatcher)(logFileBaseName, pattern);
  const dirContent = await (0, _promises.readdir)(logFileFolder);
  return dirContent.map(fileName => ({
    fileName,
    index: matcher(fileName)
  })).filter(({
    index
  }) => index !== undefined).sort((a, b) => a.index - b.index).map(({
    fileName
  }) => fileName);
};

exports.getOrderedRolledFiles = getOrderedRolledFiles;

const deleteFiles = async ({
  logFileFolder,
  filesToDelete
}) => {
  await Promise.all(filesToDelete.map(fileToDelete => (0, _promises.unlink)((0, _path.join)(logFileFolder, fileToDelete))));
};

exports.deleteFiles = deleteFiles;

const rollPreviousFilesInOrder = async ({
  filesToRoll,
  logFileFolder,
  logFileBaseName,
  pattern
}) => {
  for (let i = filesToRoll.length - 1; i >= 0; i--) {
    const oldFileName = filesToRoll[i];
    const newFileName = (0, _pattern_matcher.getRollingFileName)(logFileBaseName, pattern, i + 2);
    await (0, _promises.rename)((0, _path.join)(logFileFolder, oldFileName), (0, _path.join)(logFileFolder, newFileName));
  }
};

exports.rollPreviousFilesInOrder = rollPreviousFilesInOrder;

const rollCurrentFile = async ({
  logFileFolder,
  logFileBaseName,
  pattern
}) => {
  const rolledBaseName = (0, _pattern_matcher.getRollingFileName)(logFileBaseName, pattern, 1);
  await (0, _promises.rename)((0, _path.join)(logFileFolder, logFileBaseName), (0, _path.join)(logFileFolder, rolledBaseName));
};

exports.rollCurrentFile = rollCurrentFile;