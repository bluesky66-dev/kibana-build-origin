"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postFilter = postFilter;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const API_VERSION = '7.8.0';
/**
 * Post Filter parsed results.
 * Updates api version of the endpoints.
 */

function postFilter(parsedFiles) {
  parsedFiles.forEach(parsedFile => {
    parsedFile.forEach(block => {
      block.local.version = API_VERSION;
    });
  });
}