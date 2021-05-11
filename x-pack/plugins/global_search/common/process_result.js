"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processProviderResult = void 0;

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Convert a {@link GlobalSearchProviderResult | provider result}
 * to a {@link GlobalSearchResult | service result}
 */


const processProviderResult = (result, basePath) => {
  return { ...result,
    url: (0, _utils.convertResultUrl)(result.url, basePath)
  };
};

exports.processProviderResult = processProviderResult;