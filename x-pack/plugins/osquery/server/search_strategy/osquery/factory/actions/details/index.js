"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionDetails = void 0;

var _build_query = require("../../../../../../common/utils/build_query");

var _queryAction_details = require("./query.action_details.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const actionDetails = {
  buildDsl: options => {
    return (0, _queryAction_details.buildActionDetailsQuery)(options);
  },
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryAction_details.buildActionDetailsQuery)(options))]
    };
    return { ...response,
      inspect,
      actionDetails: response.rawResponse.hits.hits[0]
    };
  }
};
exports.actionDetails = actionDetails;