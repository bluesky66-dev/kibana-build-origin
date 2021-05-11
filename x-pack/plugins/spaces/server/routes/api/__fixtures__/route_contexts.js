"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockRouteContextWithInvalidLicense = exports.mockRouteContext = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const mockRouteContext = {
  licensing: {
    license: {
      check: jest.fn().mockReturnValue({
        state: 'valid'
      })
    }
  }
};
exports.mockRouteContext = mockRouteContext;
const mockRouteContextWithInvalidLicense = {
  licensing: {
    license: {
      check: jest.fn().mockReturnValue({
        state: 'invalid',
        message: 'License is invalid for spaces'
      })
    }
  }
};
exports.mockRouteContextWithInvalidLicense = mockRouteContextWithInvalidLicense;