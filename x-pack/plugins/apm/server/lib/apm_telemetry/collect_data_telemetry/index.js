"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectDataTelemetry = collectDataTelemetry;

var _lodash = require("lodash");

var _tasks = require("./tasks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function collectDataTelemetry({
  search,
  indices,
  logger,
  indicesStats,
  transportRequest
}) {
  return _tasks.tasks.reduce((prev, task) => {
    return prev.then(async data => {
      logger.debug(`Executing APM telemetry task ${task.name}`);

      try {
        const time = process.hrtime();
        const next = await task.executor({
          search,
          indices,
          indicesStats,
          transportRequest
        });
        const took = process.hrtime(time);
        return (0, _lodash.merge)({}, data, next, {
          tasks: {
            [task.name]: {
              took: {
                ms: Math.round(took[0] * 1000 + took[1] / 1e6)
              }
            }
          }
        });
      } catch (err) {
        logger.warn(`Failed executing APM telemetry task ${task.name}`);
        logger.warn(err);
        return data;
      }
    });
  }, Promise.resolve({}));
}