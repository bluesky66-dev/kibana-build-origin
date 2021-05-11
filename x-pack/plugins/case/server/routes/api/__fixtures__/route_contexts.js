"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRouteContext = void 0;

var _mocks = require("src/core/server/mocks");

var _client = require("../../../client");

var _services = require("../../../services");

var _fixtures__ = require("../__fixtures__");

var _mock_actions_client = require("./mock_actions_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createRouteContext = async (client, badAuth = false) => {
  const actionsMock = (0, _mock_actions_client.createActionsClient)();

  const log = _mocks.loggingSystemMock.create().get('case');

  const esClient = _mocks.elasticsearchServiceMock.createElasticsearchClient();

  const authc = badAuth ? _fixtures__.authenticationMock.createInvalid() : _fixtures__.authenticationMock.create();
  const caseService = new _services.CaseService(log, authc);
  const caseConfigureServicePlugin = new _services.CaseConfigureService(log);
  const connectorMappingsServicePlugin = new _services.ConnectorMappingsService(log);
  const caseUserActionsServicePlugin = new _services.CaseUserActionService(log);
  const caseConfigureService = await caseConfigureServicePlugin.setup();
  const userActionService = await caseUserActionsServicePlugin.setup();
  const alertsService = new _services.AlertService();
  const context = {
    core: {
      savedObjects: {
        client
      }
    },
    actions: {
      getActionsClient: () => actionsMock
    },
    case: {
      getCaseClient: () => caseClient
    }
  };
  const connectorMappingsService = await connectorMappingsServicePlugin.setup();
  const caseClient = (0, _client.createExternalCaseClient)({
    savedObjectsClient: client,
    user: authc.getCurrentUser(),
    caseService,
    caseConfigureService,
    connectorMappingsService,
    userActionService,
    alertsService,
    scopedClusterClient: esClient,
    logger: log
  });
  return {
    context,
    services: {
      userActionService
    }
  };
};

exports.createRouteContext = createRouteContext;