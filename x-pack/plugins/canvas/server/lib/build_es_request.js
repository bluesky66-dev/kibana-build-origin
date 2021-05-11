"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildESRequest = buildESRequest;

var _build_bool_array = require("./build_bool_array");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function buildESRequest(esRequest, canvasQuery) {
  if (canvasQuery.size) {
    esRequest = { ...esRequest,
      size: canvasQuery.size
    };
  }

  if (canvasQuery.and) {
    esRequest.body.query.bool.must = (0, _build_bool_array.buildBoolArray)(canvasQuery.and);
  }

  return esRequest;
}