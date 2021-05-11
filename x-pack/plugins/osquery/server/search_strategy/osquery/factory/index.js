"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.osqueryFactory = void 0;

var _osquery = require("../../../../common/search_strategy/osquery");

var _actions = require("./actions");

var _agents = require("./agents");

var _results = require("./results");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const osqueryFactory = {
  [_osquery.OsqueryQueries.actions]: _actions.allActions,
  [_osquery.OsqueryQueries.actionDetails]: _actions.actionDetails,
  [_osquery.OsqueryQueries.actionResults]: _actions.actionResults,
  [_osquery.OsqueryQueries.agents]: _agents.allAgents,
  [_osquery.OsqueryQueries.results]: _results.allResults
};
exports.osqueryFactory = osqueryFactory;