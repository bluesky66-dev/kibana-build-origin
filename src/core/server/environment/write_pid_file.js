"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writePidFile = void 0;

var _fs = require("fs");

var _once = _interopRequireDefault(require("lodash/once"));

var _fs2 = require("./fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const writePidFile = async ({
  pidConfig,
  logger
}) => {
  const path = pidConfig.file;

  if (!path) {
    return;
  }

  const pid = String(process.pid);

  if (await (0, _fs2.exists)(path)) {
    const message = `pid file already exists at ${path}`;

    if (pidConfig.exclusive) {
      throw new Error(message);
    } else {
      logger.warn(message, {
        path,
        pid
      });
    }
  }

  await (0, _fs2.writeFile)(path, pid);
  logger.debug(`wrote pid file to ${path}`, {
    path,
    pid
  });
  const clean = (0, _once.default)(() => {
    (0, _fs.unlinkSync)(path);
  });
  process.once('exit', clean); // for "natural" exits

  process.once('SIGINT', () => {
    // for Ctrl-C exits
    clean(); // resend SIGINT

    process.kill(process.pid, 'SIGINT');
  });
};

exports.writePidFile = writePidFile;