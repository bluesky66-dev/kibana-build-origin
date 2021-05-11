"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POLICY_EDIT = exports.POLICY_NAME = exports.REPOSITORY_EDIT = exports.REPOSITORY_NAME = void 0;

var _fixtures = require("../../../test/fixtures");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const REPOSITORY_NAME = 'my-test-repository';
exports.REPOSITORY_NAME = REPOSITORY_NAME;
const REPOSITORY_EDIT = (0, _fixtures.getRepository)({
  name: REPOSITORY_NAME
});
exports.REPOSITORY_EDIT = REPOSITORY_EDIT;
const POLICY_NAME = 'my-test-policy';
exports.POLICY_NAME = POLICY_NAME;
const POLICY_EDIT = (0, _fixtures.getPolicy)({
  name: POLICY_NAME,
  retention: {
    minCount: 1
  }
});
exports.POLICY_EDIT = POLICY_EDIT;