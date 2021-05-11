"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostDetails = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../utils/build_query");

var _queryHost_details = require("./query.host_details.dsl");

var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const hostDetails = {
  buildDsl: options => (0, _queryHost_details.buildHostDetailsQuery)(options),
  parse: async (options, response) => {
    const aggregations = (0, _fp.get)('aggregations', response.rawResponse) || {};
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryHost_details.buildHostDetailsQuery)(options))]
    };
    const formattedHostItem = (0, _helpers.formatHostItem)(aggregations);
    return { ...response,
      inspect,
      hostDetails: formattedHostItem
    };
  }
};
exports.hostDetails = hostDetails;