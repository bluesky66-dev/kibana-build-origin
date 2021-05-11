"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statusCheckAlertFactory = exports.getStatusMessage = exports.getMonitorSummary = exports.formatFilterString = exports.generateFilterDSL = exports.hasFilters = exports.getUniqueIdsByLoc = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _mustache = _interopRequireDefault(require("mustache"));

var _server2 = require("../../../../../../src/plugins/data/server");

var _alerts = require("../../../common/constants/alerts");

var _common = require("./common");

var _translations = require("./translations");

var _lib = require("../../../common/lib");

var _constants = require("../../../common/constants");

var _uptime_alert_wrapper = require("./uptime_alert_wrapper");

var _translations2 = require("../../../common/translations");

var _get_index_pattern = require("../requests/get_index_pattern");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getMonIdByLoc = (monitorId, location) => {
  return monitorId + '-' + location;
};

const uniqueDownMonitorIds = items => items.reduce((acc, {
  monitorId,
  location
}) => acc.add(getMonIdByLoc(monitorId, location)), new Set());

const uniqueAvailMonitorIds = items => items.reduce((acc, {
  monitorId,
  location
}) => acc.add(getMonIdByLoc(monitorId, location)), new Set());

const getUniqueIdsByLoc = (downMonitorsByLocation, availabilityResults) => {
  const uniqueDownsIdsByLoc = uniqueDownMonitorIds(downMonitorsByLocation);
  const uniqueAvailIdsByLoc = uniqueAvailMonitorIds(availabilityResults);
  return new Set([...uniqueDownsIdsByLoc, ...uniqueAvailIdsByLoc]);
};

exports.getUniqueIdsByLoc = getUniqueIdsByLoc;

const hasFilters = filters => {
  if (!filters) return false;

  for (const list of Object.values(filters)) {
    if (list.length > 0) {
      return true;
    }
  }

  return false;
};

exports.hasFilters = hasFilters;

const generateFilterDSL = async (getIndexPattern, filters, search) => {
  const filtersExist = hasFilters(filters);
  if (!filtersExist && !search) return undefined;
  let filterString = '';

  if (filtersExist) {
    filterString = (0, _lib.stringifyKueries)(new Map(Object.entries(filters !== null && filters !== void 0 ? filters : {})));
  }

  const combinedString = (0, _lib.combineFiltersAndUserSearch)(filterString, search);
  return _server2.esKuery.toElasticsearchQuery(_server2.esKuery.fromKueryExpression(combinedString !== null && combinedString !== void 0 ? combinedString : ''), await getIndexPattern());
};

exports.generateFilterDSL = generateFilterDSL;

const formatFilterString = async (uptimeEsClient, filters, search, libs) => await generateFilterDSL(() => {
  var _libs$requests, _libs$requests2;

  return libs !== null && libs !== void 0 && (_libs$requests = libs.requests) !== null && _libs$requests !== void 0 && _libs$requests.getIndexPattern ? libs === null || libs === void 0 ? void 0 : (_libs$requests2 = libs.requests) === null || _libs$requests2 === void 0 ? void 0 : _libs$requests2.getIndexPattern({
    uptimeEsClient
  }) : (0, _get_index_pattern.getUptimeIndexPattern)({
    uptimeEsClient
  });
}, filters, search);

exports.formatFilterString = formatFilterString;

const getMonitorSummary = monitorInfo => {
  var _monitorInfo$url, _monitorInfo$monitor, _monitorInfo$monitor$, _monitorInfo$monitor2, _monitorInfo$monitor3, _monitorInfo$monitor4, _monitorInfo$error, _monitorInfo$observer, _monitorInfo$observer2, _monitorInfo$observer3, _monitorInfo$agent;

  return {
    monitorUrl: (_monitorInfo$url = monitorInfo.url) === null || _monitorInfo$url === void 0 ? void 0 : _monitorInfo$url.full,
    monitorId: (_monitorInfo$monitor = monitorInfo.monitor) === null || _monitorInfo$monitor === void 0 ? void 0 : _monitorInfo$monitor.id,
    monitorName: (_monitorInfo$monitor$ = (_monitorInfo$monitor2 = monitorInfo.monitor) === null || _monitorInfo$monitor2 === void 0 ? void 0 : _monitorInfo$monitor2.name) !== null && _monitorInfo$monitor$ !== void 0 ? _monitorInfo$monitor$ : (_monitorInfo$monitor3 = monitorInfo.monitor) === null || _monitorInfo$monitor3 === void 0 ? void 0 : _monitorInfo$monitor3.id,
    monitorType: (_monitorInfo$monitor4 = monitorInfo.monitor) === null || _monitorInfo$monitor4 === void 0 ? void 0 : _monitorInfo$monitor4.type,
    latestErrorMessage: (_monitorInfo$error = monitorInfo.error) === null || _monitorInfo$error === void 0 ? void 0 : _monitorInfo$error.message,
    observerLocation: (_monitorInfo$observer = (_monitorInfo$observer2 = monitorInfo.observer) === null || _monitorInfo$observer2 === void 0 ? void 0 : (_monitorInfo$observer3 = _monitorInfo$observer2.geo) === null || _monitorInfo$observer3 === void 0 ? void 0 : _monitorInfo$observer3.name) !== null && _monitorInfo$observer !== void 0 ? _monitorInfo$observer : _constants.UNNAMED_LOCATION,
    observerHostname: (_monitorInfo$agent = monitorInfo.agent) === null || _monitorInfo$agent === void 0 ? void 0 : _monitorInfo$agent.name
  };
};

exports.getMonitorSummary = getMonitorSummary;

const generateMessageForOlderVersions = fields => {
  const messageTemplate = _translations2.MonitorStatusTranslations.defaultActionMessage; // Monitor {{state.monitorName}} with url {{{state.monitorUrl}}} is {{state.statusMessage}} from
  // {{state.observerLocation}}. The latest error message is {{{state.latestErrorMessage}}}

  return _mustache.default.render(messageTemplate, {
    state: { ...fields
    }
  });
};

const getStatusMessage = (downMonInfo, availMonInfo, availability) => {
  let statusMessage = '';

  if (downMonInfo) {
    statusMessage = _translations.DOWN_LABEL;
  }

  let availabilityMessage = '';

  if (availMonInfo) {
    availabilityMessage = _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus.actionVariables.availabilityMessage', {
      defaultMessage: 'below threshold with {availabilityRatio}% availability expected is {expectedAvailability}%',
      values: {
        availabilityRatio: (availMonInfo.availabilityRatio * 100).toFixed(2),
        expectedAvailability: availability === null || availability === void 0 ? void 0 : availability.threshold
      }
    });
  }

  if (availMonInfo && downMonInfo) {
    return _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus.actionVariables.downAndAvailabilityMessage', {
      defaultMessage: '{statusMessage} and also {availabilityMessage}',
      values: {
        statusMessage,
        availabilityMessage
      }
    });
  }

  return statusMessage + availabilityMessage;
};

exports.getStatusMessage = getStatusMessage;

const getInstanceId = (monitorInfo, monIdByLoc) => {
  var _monitorInfo$url2;

  const normalizeText = txt => {
    // replace url and name special characters with -
    return txt.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
  };

  const urlText = normalizeText(((_monitorInfo$url2 = monitorInfo.url) === null || _monitorInfo$url2 === void 0 ? void 0 : _monitorInfo$url2.full) || '');
  const monName = normalizeText(monitorInfo.monitor.name || '');

  if (monName) {
    return `${monName}_${urlText}_${monIdByLoc}`;
  }

  return `${urlText}_${monIdByLoc}`;
};

const statusCheckAlertFactory = (_server, libs) => (0, _uptime_alert_wrapper.uptimeAlertWrapper)({
  id: 'xpack.uptime.alerts.monitorStatus',
  name: _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus', {
    defaultMessage: 'Uptime monitor status'
  }),
  validate: {
    params: _configSchema.schema.object({
      availability: _configSchema.schema.maybe(_configSchema.schema.object({
        range: _configSchema.schema.number(),
        rangeUnit: _configSchema.schema.string(),
        threshold: _configSchema.schema.string()
      })),
      filters: _configSchema.schema.maybe(_configSchema.schema.oneOf([// deprecated
      _configSchema.schema.object({
        'monitor.type': _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        'observer.geo.name': _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        tags: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        'url.port': _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
      }), _configSchema.schema.string()])),
      // deprecated
      locations: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
      numTimes: _configSchema.schema.number(),
      search: _configSchema.schema.maybe(_configSchema.schema.string()),
      shouldCheckStatus: _configSchema.schema.boolean(),
      shouldCheckAvailability: _configSchema.schema.boolean(),
      timerangeCount: _configSchema.schema.maybe(_configSchema.schema.number()),
      timerangeUnit: _configSchema.schema.maybe(_configSchema.schema.string()),
      // deprecated
      timerange: _configSchema.schema.maybe(_configSchema.schema.object({
        from: _configSchema.schema.string(),
        to: _configSchema.schema.string()
      })),
      version: _configSchema.schema.maybe(_configSchema.schema.number()),
      isAutoGenerated: _configSchema.schema.maybe(_configSchema.schema.boolean())
    })
  },
  defaultActionGroupId: _alerts.MONITOR_STATUS.id,
  actionGroups: [{
    id: _alerts.MONITOR_STATUS.id,
    name: _alerts.MONITOR_STATUS.name
  }],
  actionVariables: {
    context: [{
      name: 'message',
      description: _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus.actionVariables.context.message.description', {
        defaultMessage: 'A generated message summarizing the currently down monitors'
      })
    }, {
      name: 'downMonitorsWithGeo',
      description: _i18n.i18n.translate('xpack.uptime.alerts.monitorStatus.actionVariables.context.downMonitorsWithGeo.description', {
        defaultMessage: 'A generated summary that shows some or all of the monitors detected as "down" by the alert'
      })
    }],
    state: [..._translations.commonMonitorStateI18, ..._translations.commonStateTranslations]
  },
  minimumLicenseRequired: 'basic',

  async executor({
    options: {
      params: rawParams,
      state,
      services: {
        alertInstanceFactory
      }
    },
    dynamicSettings,
    uptimeEsClient
  }) {
    const {
      filters,
      search,
      numTimes,
      timerangeCount,
      timerangeUnit,
      availability,
      shouldCheckAvailability,
      shouldCheckStatus,
      isAutoGenerated,
      timerange: oldVersionTimeRange
    } = rawParams;
    const filterString = await formatFilterString(uptimeEsClient, filters, search, libs);
    const timerange = oldVersionTimeRange || {
      from: isAutoGenerated ? state.lastCheckedAt : `now-${String(timerangeCount) + timerangeUnit}`,
      to: 'now'
    };
    let downMonitorsByLocation = []; // if oldVersionTimeRange present means it's 7.7 format and
    // after that shouldCheckStatus should be explicitly false

    if (!(!oldVersionTimeRange && shouldCheckStatus === false)) {
      downMonitorsByLocation = await libs.requests.getMonitorStatus({
        uptimeEsClient,
        timerange,
        numTimes,
        locations: [],
        filters: filterString
      });
    }

    if (isAutoGenerated) {
      for (const monitorLoc of downMonitorsByLocation) {
        const monitorInfo = monitorLoc.monitorInfo;
        const alertInstance = alertInstanceFactory(getInstanceId(monitorInfo, monitorLoc.location));
        const monitorSummary = getMonitorSummary(monitorInfo);
        const statusMessage = getStatusMessage(monitorInfo);
        alertInstance.replaceState({ ...state,
          ...monitorSummary,
          statusMessage,
          ...(0, _common.updateState)(state, true)
        });
        alertInstance.scheduleActions(_alerts.MONITOR_STATUS.id);
      }

      return (0, _common.updateState)(state, downMonitorsByLocation.length > 0);
    }

    let availabilityResults = [];

    if (shouldCheckAvailability) {
      availabilityResults = await libs.requests.getMonitorAvailability({
        uptimeEsClient,
        ...availability,
        filters: JSON.stringify(filterString) || undefined
      });
    }

    const mergedIdsByLoc = getUniqueIdsByLoc(downMonitorsByLocation, availabilityResults);
    mergedIdsByLoc.forEach(monIdByLoc => {
      var _downMonitorsByLocati;

      const availMonInfo = availabilityResults.find(({
        monitorId,
        location
      }) => getMonIdByLoc(monitorId, location) === monIdByLoc);
      const downMonInfo = (_downMonitorsByLocati = downMonitorsByLocation.find(({
        monitorId,
        location
      }) => getMonIdByLoc(monitorId, location) === monIdByLoc)) === null || _downMonitorsByLocati === void 0 ? void 0 : _downMonitorsByLocati.monitorInfo;
      const monitorInfo = downMonInfo || (availMonInfo === null || availMonInfo === void 0 ? void 0 : availMonInfo.monitorInfo);
      const monitorSummary = getMonitorSummary(monitorInfo);
      const statusMessage = getStatusMessage(downMonInfo, availMonInfo, availability);
      const alertInstance = alertInstanceFactory(getInstanceId(monitorInfo, monIdByLoc));
      alertInstance.replaceState({ ...(0, _common.updateState)(state, true),
        ...monitorSummary,
        statusMessage
      });
      alertInstance.scheduleActions(_alerts.MONITOR_STATUS.id, {
        message: generateMessageForOlderVersions({ ...monitorSummary,
          statusMessage
        })
      });
    });
    return (0, _common.updateState)(state, downMonitorsByLocation.length > 0);
  }

});

exports.statusCheckAlertFactory = statusCheckAlertFactory;