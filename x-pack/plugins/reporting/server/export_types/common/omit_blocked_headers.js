"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.omitBlockedHeaders = void 0;

var _lodash = require("lodash");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const omitBlockedHeaders = decryptedHeaders => {
  const filteredHeaders = (0, _lodash.omitBy)(decryptedHeaders, (_value, header) => header && (_constants.KBN_SCREENSHOT_HEADER_BLOCK_LIST.includes(header) || _constants.KBN_SCREENSHOT_HEADER_BLOCK_LIST_STARTS_WITH_PATTERN.some(pattern => header === null || header === void 0 ? void 0 : header.startsWith(pattern))));
  return filteredHeaders;
};

exports.omitBlockedHeaders = omitBlockedHeaders;