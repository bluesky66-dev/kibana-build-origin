"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createActionsClient = void 0;

var _server = require("src/core/server");

var _mocks = require("../../../../../actions/server/mocks");

var _request_responses = require("../__mocks__/request_responses");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createActionsClient = () => {
  const actionsMock = _mocks.actionsClientMock.create();

  actionsMock.getAll.mockImplementation(() => Promise.resolve((0, _request_responses.getActions)()));
  actionsMock.listTypes.mockImplementation(() => Promise.resolve((0, _request_responses.getActionTypes)()));
  actionsMock.get.mockImplementation(({
    id
  }) => {
    const actions = (0, _request_responses.getActions)();
    const action = actions.find(a => a.id === id);

    if (action) {
      return Promise.resolve(action);
    } else {
      return Promise.reject(_server.SavedObjectsErrorHelpers.createGenericNotFoundError('action', id));
    }
  });
  actionsMock.execute.mockImplementation(({
    actionId
  }) => Promise.resolve((0, _request_responses.getActionExecuteResults)(actionId)));
  return actionsMock;
};

exports.createActionsClient = createActionsClient;