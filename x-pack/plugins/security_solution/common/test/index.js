"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ROLES = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// For the source of these roles please consult the PR these were introduced https://github.com/elastic/kibana/pull/81866#issue-511165754

let ROLES;
exports.ROLES = ROLES;

(function (ROLES) {
  ROLES["reader"] = "reader";
  ROLES["t1_analyst"] = "t1_analyst";
  ROLES["t2_analyst"] = "t2_analyst";
  ROLES["hunter"] = "hunter";
  ROLES["rule_author"] = "rule_author";
  ROLES["soc_manager"] = "soc_manager";
  ROLES["platform_engineer"] = "platform_engineer";
  ROLES["detections_admin"] = "detections_admin";
})(ROLES || (exports.ROLES = ROLES = {}));