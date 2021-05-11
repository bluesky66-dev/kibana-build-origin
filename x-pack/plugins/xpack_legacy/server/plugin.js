"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XpackLegacyPlugin = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _settings = require("./routes/settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class XpackLegacyPlugin {
  constructor(initContext) {
    this.initContext = initContext;
  }

  setup(core, {
    usageCollection
  }) {
    const router = core.http.createRouter();
    const globalConfig = this.initContext.config.legacy.get();
    const serverInfo = core.http.getServerInfo();
    (0, _settings.registerSettingsRoute)({
      router,
      usageCollection,
      overallStatus$: core.status.overall$,
      config: {
        kibanaIndex: globalConfig.kibana.index,
        kibanaVersion: this.initContext.env.packageInfo.version,
        uuid: this.initContext.env.instanceUuid,
        server: serverInfo
      }
    });
    core.uiSettings.register({
      'xPack:defaultAdminEmail': {
        name: _i18n.i18n.translate('xpack.main.uiSettings.adminEmailTitle', {
          defaultMessage: 'Admin email'
        }),
        description: _i18n.i18n.translate('xpack.main.uiSettings.adminEmailDescription', {
          defaultMessage: 'Recipient email address for X-Pack admin operations, such as Cluster Alert email notifications from Monitoring.'
        }),
        deprecation: {
          message: _i18n.i18n.translate('xpack.main.uiSettings.adminEmailDeprecation', {
            defaultMessage: 'This setting is deprecated and will not be supported in Kibana 8.0. Please configure `monitoring.cluster_alerts.email_notifications.email_address` in your kibana.yml settings.'
          }),
          docLinksKey: 'kibanaGeneralSettings'
        },
        sensitive: true,
        type: 'string',
        value: null,
        schema: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.string()))
      }
    });
  }

  start(core) {}

  stop() {}

}

exports.XpackLegacyPlugin = XpackLegacyPlugin;