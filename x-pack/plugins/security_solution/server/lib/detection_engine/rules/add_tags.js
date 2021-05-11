"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTags = void 0;

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const addTags = (tags, ruleId, immutable) => {
  return Array.from(new Set([...tags, `${_constants.INTERNAL_RULE_ID_KEY}:${ruleId}`, `${_constants.INTERNAL_IMMUTABLE_KEY}:${immutable}`]));
};

exports.addTags = addTags;