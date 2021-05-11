"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listCommand = listCommand;

var _utils = require("../../core/server/utils");

var _list = require("./list");

var _logger = require("../lib/logger");

var _log_warnings = require("../lib/log_warnings");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function processCommand() {
  const logger = new _logger.Logger();
  (0, _log_warnings.logWarnings)(logger);
  (0, _list.list)((0, _utils.fromRoot)('plugins'), logger);
}

function listCommand(program) {
  program.command('list').description('list installed plugins').action(processCommand);
}