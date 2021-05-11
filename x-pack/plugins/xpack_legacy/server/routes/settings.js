"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSettingsRoute = registerSettingsRoute;

var _i18n = require("@kbn/i18n");

var _operators = require("rxjs/operators");

var _server = require("../../../../../src/core/server");

var _constants = require("../../../monitoring/common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SNAPSHOT_REGEX = /-snapshot/i;

function registerSettingsRoute({
  router,
  usageCollection,
  overallStatus$,
  config
}) {
  router.get({
    path: '/api/settings',
    validate: false
  }, async (context, req, res) => {
    var _await$settingsCollec;

    const {
      callAsCurrentUser
    } = context.core.elasticsearch.legacy.client;
    const collectorFetchContext = {
      callCluster: callAsCurrentUser,
      esClient: context.core.elasticsearch.client.asCurrentUser,
      soClient: context.core.savedObjects.client
    };
    const settingsCollector = usageCollection.getCollectorByType(_constants.KIBANA_SETTINGS_TYPE);

    if (!settingsCollector) {
      return res.internalError();
    }

    const settings = (_await$settingsCollec = await settingsCollector.fetch(collectorFetchContext)) !== null && _await$settingsCollec !== void 0 ? _await$settingsCollec : settingsCollector.getEmailValueStructure(null);
    const {
      body
    } = await collectorFetchContext.esClient.info({
      filter_path: 'cluster_uuid'
    });
    const uuid = body.cluster_uuid;
    const overallStatus = await overallStatus$.pipe((0, _operators.first)()).toPromise();
    const kibana = {
      uuid: config.uuid,
      name: config.server.name,
      index: config.kibanaIndex,
      host: config.server.hostname,
      port: config.server.port,
      locale: _i18n.i18n.getLocale(),
      transport_address: `${config.server.hostname}:${config.server.port}`,
      version: config.kibanaVersion.replace(SNAPSHOT_REGEX, ''),
      snapshot: SNAPSHOT_REGEX.test(config.kibanaVersion),
      status: ServiceStatusToLegacyState[overallStatus.level.toString()]
    };
    return res.ok({
      body: {
        cluster_uuid: uuid,
        settings: { ...settings,
          kibana
        }
      }
    });
  });
}

const ServiceStatusToLegacyState = {
  [_server.ServiceStatusLevels.critical.toString()]: 'red',
  [_server.ServiceStatusLevels.unavailable.toString()]: 'red',
  [_server.ServiceStatusLevels.degraded.toString()]: 'yellow',
  [_server.ServiceStatusLevels.available.toString()]: 'green'
};