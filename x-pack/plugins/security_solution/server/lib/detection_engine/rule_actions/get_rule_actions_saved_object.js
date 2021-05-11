"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleActionsSavedObject = void 0;

var _saved_object_mappings = require("./saved_object_mappings");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getRuleActionsSavedObject = async ({
  ruleAlertId,
  savedObjectsClient
}) => {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    saved_objects
  } = await savedObjectsClient.find({
    type: _saved_object_mappings.ruleActionsSavedObjectType,
    perPage: 1,
    search: `${ruleAlertId}`,
    searchFields: ['ruleAlertId']
  });

  if (!saved_objects[0]) {
    return null;
  } else {
    return (0, _utils.getRuleActionsFromSavedObject)(saved_objects[0]);
  }
};

exports.getRuleActionsSavedObject = getRuleActionsSavedObject;