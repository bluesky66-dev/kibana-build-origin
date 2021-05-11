"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeJsonWatch = serializeJsonWatch;

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function serializeJsonWatch(name, json) {
  // We don't want to overwrite any metadata provided by the consumer.
  const {
    metadata = {}
  } = json;
  (0, _saferLodashSet.set)(metadata, 'xpack.type', _constants.WATCH_TYPES.JSON);
  const serializedWatch = { ...json,
    metadata
  };

  if (name) {
    serializedWatch.metadata.name = name;
  }

  return serializedWatch;
}