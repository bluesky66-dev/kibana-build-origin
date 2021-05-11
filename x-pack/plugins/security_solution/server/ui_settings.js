"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initUiSettings = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initUiSettings = uiSettings => {
  uiSettings.register({
    [_constants.DEFAULT_APP_REFRESH_INTERVAL]: {
      type: 'json',
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultRefreshIntervalLabel', {
        defaultMessage: 'Time filter refresh interval'
      }),
      value: `{
  "pause": ${_constants.DEFAULT_INTERVAL_PAUSE},
  "value": ${_constants.DEFAULT_INTERVAL_VALUE}
}`,
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultRefreshIntervalDescription', {
        defaultMessage: '<p>Default refresh interval for the Security time filter, in milliseconds.</p>'
      }),
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.object({
        value: _configSchema.schema.number(),
        pause: _configSchema.schema.boolean()
      })
    },
    [_constants.DEFAULT_APP_TIME_RANGE]: {
      type: 'json',
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultTimeRangeLabel', {
        defaultMessage: 'Time filter period'
      }),
      value: `{
  "from": "${_constants.DEFAULT_FROM}",
  "to": "${_constants.DEFAULT_TO}"
}`,
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultTimeRangeDescription', {
        defaultMessage: '<p>Default period of time in the Security time filter.</p>'
      }),
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.object({
        from: _configSchema.schema.string(),
        to: _configSchema.schema.string()
      })
    },
    [_constants.DEFAULT_INDEX_KEY]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultIndexLabel', {
        defaultMessage: 'Elasticsearch indices'
      }),
      sensitive: true,
      value: _constants.DEFAULT_INDEX_PATTERN,
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultIndexDescription', {
        defaultMessage: '<p>Comma-delimited list of Elasticsearch indices from which the Security app collects events.</p>'
      }),
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.arrayOf(_configSchema.schema.string())
    },
    [_constants.DEFAULT_ANOMALY_SCORE]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultAnomalyScoreLabel', {
        defaultMessage: 'Anomaly threshold'
      }),
      value: 50,
      type: 'number',
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultAnomalyScoreDescription', {
        defaultMessage: '<p>Value above which Machine Learning job anomalies are displayed in the Security app.</p><p>Valid values: 0 to 100.</p>'
      }),
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.number()
    },
    [_constants.ENABLE_NEWS_FEED_SETTING]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.enableNewsFeedLabel', {
        defaultMessage: 'News feed'
      }),
      value: true,
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.enableNewsFeedDescription', {
        defaultMessage: '<p>Enables the News feed</p>'
      }),
      type: 'boolean',
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.boolean()
    },
    [_constants.DEFAULT_RULES_TABLE_REFRESH_SETTING]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.rulesTableRefresh', {
        defaultMessage: 'Rules auto refresh'
      }),
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.rulesTableRefreshDescription', {
        defaultMessage: '<p>Enables auto refresh on the all rules and monitoring tables, in milliseconds</p>'
      }),
      type: 'json',
      value: `{
  "on": ${_constants.DEFAULT_RULE_REFRESH_INTERVAL_ON},
  "value": ${_constants.DEFAULT_RULE_REFRESH_INTERVAL_VALUE},
  "idleTimeout": ${_constants.DEFAULT_RULE_REFRESH_IDLE_VALUE}
}`,
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.object({
        idleTimeout: _configSchema.schema.number({
          min: 300000
        }),
        value: _configSchema.schema.number({
          min: 60000
        }),
        on: _configSchema.schema.boolean()
      })
    },
    [_constants.NEWS_FEED_URL_SETTING]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.newsFeedUrl', {
        defaultMessage: 'News feed URL'
      }),
      value: _constants.NEWS_FEED_URL_SETTING_DEFAULT,
      sensitive: true,
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.newsFeedUrlDescription', {
        defaultMessage: '<p>News feed content will be retrieved from this URL</p>'
      }),
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.string()
    },
    [_constants.IP_REPUTATION_LINKS_SETTING]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.ipReputationLinks', {
        defaultMessage: 'IP Reputation Links'
      }),
      value: _constants.IP_REPUTATION_LINKS_SETTING_DEFAULT,
      type: 'json',
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.ipReputationLinksDescription', {
        defaultMessage: 'Array of URL templates to build the list of reputation URLs to be displayed on the IP Details page.'
      }),
      sensitive: true,
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.arrayOf(_configSchema.schema.object({
        name: _configSchema.schema.string(),
        url_template: _configSchema.schema.string()
      }))
    }
  });
};

exports.initUiSettings = initUiSettings;