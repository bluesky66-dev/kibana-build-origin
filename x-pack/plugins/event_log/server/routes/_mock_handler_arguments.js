"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockHandlerArguments = mockHandlerArguments;
exports.fakeEvent = fakeEvent;
exports.mockResponseFactory = void 0;

var _lodash = require("lodash");

var _mocks = require("src/core/server/mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function mockHandlerArguments(eventLogClient, req, res) {
  return [{
    eventLog: {
      getEventLogClient() {
        return eventLogClient;
      }

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

function fakeEvent(overrides = {}) {
  return (0, _lodash.merge)({
    event: {
      provider: 'actions',
      action: 'execute',
      start: '2020-03-30T14:55:47.054Z',
      end: '2020-03-30T14:55:47.055Z',
      duration: 1000000
    },
    kibana: {
      saved_objects: [{
        namespace: 'default',
        type: 'action',
        id: '968f1b82-0414-4a10-becc-56b6473e4a29'
      }],
      server_uuid: '5b2de169-2785-441b-ae8c-186a1936b17d'
    },
    message: 'action executed: .server-log:968f1b82-0414-4a10-becc-56b6473e4a29: logger',
    '@timestamp': '2020-03-30T14:55:47.055Z',
    ecs: {
      version: '1.3.1'
    }
  }, overrides);
}