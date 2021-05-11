"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inspectSearchParams = inspectSearchParams;
exports.mockNow = mockNow;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function inspectSearchParams(fn, options = {}) {
  const spy = jest.fn().mockImplementation(async request => {
    return options.mockResponse ? options.mockResponse(request) : {
      hits: {
        hits: {
          total: {
            value: 0
          }
        }
      }
    };
  });
  let response;
  let error;
  const mockSetup = {
    start: 1528113600000,
    end: 1528977600000,
    apmEventClient: {
      search: spy
    },
    internalClient: {
      search: spy
    },
    config: new Proxy({}, {
      get: (_, key) => {
        switch (key) {
          default:
            return 'myIndex';

          case 'xpack.apm.metricsInterval':
            return 30;

          case 'xpack.apm.maxServiceEnvironments':
            return 100;

          case 'xpack.apm.maxServiceSelection':
            return 50;
        }
      }
    }),
    uiFilters: {},
    esFilter: [{
      term: {
        'service.environment': 'test'
      }
    }],
    indices: {
      /* eslint-disable @typescript-eslint/naming-convention */
      'apm_oss.sourcemapIndices': 'myIndex',
      'apm_oss.errorIndices': 'myIndex',
      'apm_oss.onboardingIndices': 'myIndex',
      'apm_oss.spanIndices': 'myIndex',
      'apm_oss.transactionIndices': 'myIndex',
      'apm_oss.metricsIndices': 'myIndex',

      /* eslint-enable @typescript-eslint/naming-convention */
      apmAgentConfigurationIndex: 'myIndex',
      apmCustomLinkIndex: 'myIndex'
    },
    dynamicIndexPattern: null
  };

  try {
    response = await fn(mockSetup);
  } catch (err) {
    error = err; // we're only extracting the search params
  }

  return {
    params: spy.mock.calls[0][0],
    response,
    error,
    spy,
    teardown: () => spy.mockClear()
  };
}

function mockNow(date) {
  const fakeNow = new Date(date).getTime();
  return jest.spyOn(Date, 'now').mockReturnValue(fakeNow);
}