"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUptimeIndexPattern = void 0;

var _server = require("../../../../../../src/plugins/data/server");

var _saved_objects = require("../saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getUptimeIndexPattern = async ({
  uptimeEsClient
}) => {
  const indexPatternsFetcher = new _server.IndexPatternsFetcher(uptimeEsClient.baseESClient);
  const dynamicSettings = await _saved_objects.savedObjectsAdapter.getUptimeDynamicSettings(uptimeEsClient.getSavedObjectsClient()); // Since `getDynamicIndexPattern` is called in setup_request (and thus by every endpoint)
  // and since `getFieldsForWildcard` will throw if the specified indices don't exist,
  // we have to catch errors here to avoid all endpoints returning 500 for users without APM data
  // (would be a bad first time experience)

  try {
    const fields = await indexPatternsFetcher.getFieldsForWildcard({
      pattern: dynamicSettings.heartbeatIndices
    });
    return {
      fields,
      title: dynamicSettings.heartbeatIndices
    };
  } catch (e) {
    var _e$output;

    const notExists = ((_e$output = e.output) === null || _e$output === void 0 ? void 0 : _e$output.statusCode) === 404;

    if (notExists) {
      // eslint-disable-next-line no-console
      console.error(`Could not get dynamic index pattern because indices "${dynamicSettings.heartbeatIndices}" don't exist`);
      return;
    } // re-throw


    throw e;
  }
};

exports.getUptimeIndexPattern = getUptimeIndexPattern;