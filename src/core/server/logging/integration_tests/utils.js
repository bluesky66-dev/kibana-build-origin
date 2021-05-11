"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPlatformLogsFromMock = getPlatformLogsFromMock;
exports.getLegacyPlatformLogsFromMock = getLegacyPlatformLogsFromMock;
exports.getPlatformLogsFromFile = getPlatformLogsFromFile;
exports.getLegacyPlatformLogsFromFile = getLegacyPlatformLogsFromFile;

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const readFile = _util.default.promisify(_fs.default.readFile);

function replaceAllNumbers(input) {
  return input.replace(/\d/g, 'x');
}

function replaceTimestamp(input) {
  return input.replace(/\[(.*?)\]/, (full, key) => `[${replaceAllNumbers(key)}]`);
}

function stripColors(input) {
  return input.replace(/\u001b[^m]+m/g, '');
}

function normalizePlatformLogging(input) {
  return replaceTimestamp(input);
}

function normalizeLegacyPlatformLogging(input) {
  return replaceTimestamp(stripColors(input));
}

function getPlatformLogsFromMock(logMock) {
  return logMock.mock.calls.map(([message]) => message).map(normalizePlatformLogging);
}

function getLegacyPlatformLogsFromMock(stdoutMock) {
  return stdoutMock.mock.calls.map(([message]) => message).map(String).map(normalizeLegacyPlatformLogging);
}

async function getPlatformLogsFromFile(path) {
  const fileContent = await readFile(path, 'utf-8');
  return fileContent.split('\n').map(s => normalizePlatformLogging(s)).join('\n');
}

async function getLegacyPlatformLogsFromFile(path) {
  const fileContent = await readFile(path, 'utf-8');
  return fileContent.split('\n').map(s => normalizeLegacyPlatformLogging(s)).join('\n');
}