"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildActions = buildActions;

var _lodash = require("lodash");

var _action = require("../../../models/action");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
watch.actions
 */


function buildActions(actions) {
  const result = {};
  (0, _lodash.forEach)(actions, action => {
    const actionModel = _action.Action.fromDownstreamJson(action);

    Object.assign(result, actionModel.upstreamJson);
  });
  return result;
}