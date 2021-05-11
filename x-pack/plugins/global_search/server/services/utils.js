"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRequestBasePath = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getRequestBasePath = (request, basePath) => {
  const requestBasePath = basePath.get(request);
  return {
    prepend: path => {
      return `${requestBasePath}/${path}`.replace(/\/{2,}/g, '/');
    }
  };
};

exports.getRequestBasePath = getRequestBasePath;