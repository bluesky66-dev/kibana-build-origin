"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableAlertsRoute = enableAlertsRoute;

var _errors = require("../../../../lib/errors");

var _alerts = require("../../../../alerts");

var _constants = require("../../../../../common/constants");

var _verify_alerting_security = require("../../../../lib/elasticsearch/verify_alerting_security");

var _disable_watcher_cluster_alerts = require("../../../../lib/alerts/disable_watcher_cluster_alerts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


const DEFAULT_SERVER_LOG_NAME = 'Monitoring: Write to Kibana log';

function enableAlertsRoute(_server, npRoute) {
  npRoute.router.post({
    path: '/api/monitoring/v1/alerts/enable',
    validate: false
  }, async (context, request, response) => {
    try {
      var _context$alerting, _context$actions, _context$actions2;

      const alerts = _alerts.AlertsFactory.getAll();

      if (alerts.length) {
        const {
          isSufficientlySecure,
          hasPermanentEncryptionKey
        } = await _verify_alerting_security.AlertingSecurity.getSecurityHealth(context, npRoute.encryptedSavedObjects);

        if (!isSufficientlySecure || !hasPermanentEncryptionKey) {
          return response.ok({
            body: {
              isSufficientlySecure,
              hasPermanentEncryptionKey
            }
          });
        }
      }

      const alertsClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getAlertsClient();
      const actionsClient = (_context$actions = context.actions) === null || _context$actions === void 0 ? void 0 : _context$actions.getActionsClient();
      const types = (_context$actions2 = context.actions) === null || _context$actions2 === void 0 ? void 0 : _context$actions2.listTypes();

      if (!alertsClient || !actionsClient || !types) {
        return response.ok({
          body: undefined
        });
      } // Get or create the default log action


      let serverLogAction;
      const allActions = await actionsClient.getAll();

      for (const action of allActions) {
        if (action.name === DEFAULT_SERVER_LOG_NAME) {
          serverLogAction = action;
          break;
        }
      }

      if (!serverLogAction) {
        serverLogAction = await actionsClient.create({
          action: {
            name: DEFAULT_SERVER_LOG_NAME,
            actionTypeId: _constants.ALERT_ACTION_TYPE_LOG,
            config: {},
            secrets: {}
          }
        });
      }

      const actions = [{
        id: serverLogAction.id,
        config: {}
      }];
      let createdAlerts = [];
      const disabledWatcherClusterAlerts = await (0, _disable_watcher_cluster_alerts.disableWatcherClusterAlerts)(npRoute.cluster.asScoped(request).callAsCurrentUser, npRoute.logger);

      if (disabledWatcherClusterAlerts) {
        createdAlerts = await Promise.all(alerts.map(alert => alert.createIfDoesNotExist(alertsClient, actionsClient, actions)));
      }

      return response.ok({
        body: {
          createdAlerts,
          disabledWatcherClusterAlerts
        }
      });
    } catch (err) {
      throw (0, _errors.handleError)(err);
    }
  });
}