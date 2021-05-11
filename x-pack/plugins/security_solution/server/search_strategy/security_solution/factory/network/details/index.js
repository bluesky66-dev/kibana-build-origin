"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.networkDetails = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../utils/build_query");

var _helpers = require("./helpers");

var _queryDetails_network = require("./query.details_network.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const networkDetails = {
  buildDsl: options => (0, _queryDetails_network.buildNetworkDetailsQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryDetails_network.buildNetworkDetailsQuery)(options))]
    };
    return { ...response,
      inspect,
      networkDetails: { ...(0, _helpers.getNetworkDetailsAgg)('source', (0, _fp.getOr)({}, 'aggregations.source', response.rawResponse)),
        ...(0, _helpers.getNetworkDetailsAgg)('destination', (0, _fp.getOr)({}, 'aggregations.destination', response.rawResponse)),
        ...(0, _helpers.getNetworkDetailsHostAgg)((0, _fp.getOr)({}, 'aggregations.host', response.rawResponse))
      }
    };
  }
};
exports.networkDetails = networkDetails;