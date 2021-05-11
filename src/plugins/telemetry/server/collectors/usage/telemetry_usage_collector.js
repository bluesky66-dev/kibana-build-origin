"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFileReadable = isFileReadable;
exports.readTelemetryFile = readTelemetryFile;
exports.createTelemetryUsageCollector = createTelemetryUsageCollector;
exports.registerTelemetryUsageCollector = registerTelemetryUsageCollector;
exports.MAX_FILE_SIZE = void 0;

var _fs = require("fs");

var _jsYaml = require("js-yaml");

var _path = require("path");

var _operators = require("rxjs/operators");

var _ensure_deep_object = require("./ensure_deep_object");

var _schema = require("./schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// look for telemetry.yml in the same places we expect kibana.yml

/**
 * The maximum file size before we ignore it (note: this limit is arbitrary).
 */
const MAX_FILE_SIZE = 10 * 1024; // 10 KB

/**
 * Determine if the supplied `path` is readable.
 *
 * @param path The possible path where a config file may exist.
 * @returns `true` if the file should be used.
 */

exports.MAX_FILE_SIZE = MAX_FILE_SIZE;

function isFileReadable(path) {
  try {
    (0, _fs.accessSync)(path, _fs.constants.R_OK); // ignore files above the limit

    const stats = (0, _fs.statSync)(path);
    return stats.size <= MAX_FILE_SIZE;
  } catch (e) {
    return false;
  }
}
/**
 * Load the `telemetry.yml` file, if it exists, and return its contents as
 * a JSON object.
 *
 * @param configPath The config file path.
 * @returns The unmodified JSON object if the file exists and is a valid YAML file.
 */


async function readTelemetryFile(configPath) {
  try {
    if (isFileReadable(configPath)) {
      const yaml = (0, _fs.readFileSync)(configPath);
      const data = (0, _jsYaml.safeLoad)(yaml.toString()); // don't bother returning empty objects

      if (Object.keys(data).length) {
        // ensure { "a.b": "value" } becomes { "a": { "b": "value" } }
        return (0, _ensure_deep_object.ensureDeepObject)(data);
      }
    }
  } catch (e) {// ignored
  }

  return undefined;
}

function createTelemetryUsageCollector(usageCollection, getConfigPathFn) {
  return usageCollection.makeUsageCollector({
    type: 'static_telemetry',
    isReady: () => true,
    fetch: async () => {
      const configPath = await getConfigPathFn();
      const telemetryPath = (0, _path.join)((0, _path.dirname)(configPath), 'telemetry.yml');
      return await readTelemetryFile(telemetryPath);
    },
    schema: _schema.staticTelemetrySchema
  });
}

function registerTelemetryUsageCollector(usageCollection, config$) {
  const collector = createTelemetryUsageCollector(usageCollection, async () => {
    const config = await config$.pipe((0, _operators.take)(1)).toPromise();
    return config.config;
  });
  usageCollection.registerCollector(collector);
}