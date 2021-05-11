"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callAsyncWithDebug = callAsyncWithDebug;
exports.getDebugTitle = exports.getDebugBody = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

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

/* eslint-disable no-console */


function formatObj(obj) {
  return JSON.stringify(obj, null, 2);
}

async function callAsyncWithDebug({
  cb,
  getDebugMessage,
  debug
}) {
  if (!debug) {
    return cb();
  }

  const startTime = process.hrtime();
  let res;
  let esError = null;

  try {
    res = await cb();
  } catch (e) {
    // catch error and throw after outputting debug info
    esError = e;
  }

  if (debug) {
    const highlightColor = esError ? 'bgRed' : 'inverse';
    const diff = process.hrtime(startTime);
    const duration = `${Math.round(diff[0] * 1000 + diff[1] / 1e6)}ms`;
    const {
      title,
      body
    } = getDebugMessage();
    console.log(_chalk.default.bold[highlightColor](`=== Debug: ${title} (${duration}) ===`));
    console.log(body);
    console.log(`\n`);
  }

  if (esError) {
    throw esError;
  }

  return res;
}

const getDebugBody = (params, operationName) => {
  if (operationName === 'search') {
    return `GET ${params.index}/_search\n${formatObj(params.body)}`;
  }

  return `${_chalk.default.bold('ES operation:')} ${operationName}\n${_chalk.default.bold('ES query:')}\n${formatObj(params)}`;
};

exports.getDebugBody = getDebugBody;

const getDebugTitle = request => `${request.route.method.toUpperCase()} ${request.route.path}`;

exports.getDebugTitle = getDebugTitle;