"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockHandlerArguments = mockHandlerArguments;
exports.mockResponseFactory = void 0;

var _lodash = require("lodash");

var _mocks = require("../../../../../src/core/server/mocks");

var _alerts_client = require("../alerts_client.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function mockHandlerArguments({
  alertsClient = _alerts_client.alertsClientMock.create(),
  listTypes: listTypesRes = [],
  esClient = _mocks.elasticsearchServiceMock.createLegacyClusterClient(),
  getFrameworkHealth
}, req, res) {
  const listTypes = jest.fn(() => listTypesRes);
  return [{
    core: {
      elasticsearch: {
        legacy: {
          client: esClient
        }
      }
    },
    alerting: {
      listTypes,

      getAlertsClient() {
        return alertsClient || _alerts_client.alertsClientMock.create();
      },

      getFrameworkHealth
    }
  }, req, mockResponseFactory(res)];
}

const mockResponseFactory = (resToMock = []) => {
  const factory = _mocks.httpServerMock.createResponseFactory();

  resToMock.forEach(key => {
    if (key in factory) {
      Object.defineProperty(factory, key, {
        value: jest.fn(_lodash.identity)
      });
    }
  });
  return factory;
};

exports.mockResponseFactory = mockResponseFactory;