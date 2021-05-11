"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMonitorDetails = void 0;

var _status_check = require("../alerts/status_check");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getMonitorAlerts = async ({
  uptimeEsClient,
  alertsClient,
  monitorId
}) => {
  const options = {
    page: 1,
    perPage: 500,
    filter: 'alert.attributes.alertTypeId:(xpack.uptime.alerts.monitorStatus)',
    defaultSearchOperator: 'AND',
    sortField: 'name.keyword'
  };
  const {
    data
  } = await alertsClient.find({
    options
  });
  const monitorAlerts = [];

  for (let i = 0; i < data.length; i++) {
    var _currAlert$params$sea;

    const currAlert = data[i];

    if ((_currAlert$params$sea = currAlert.params.search) !== null && _currAlert$params$sea !== void 0 && _currAlert$params$sea.includes(monitorId)) {
      monitorAlerts.push(currAlert);
      continue;
    }

    const esParams = {
      query: {
        bool: {
          filter: [{
            term: {
              'monitor.id': monitorId
            }
          }]
        }
      },
      size: 0,
      aggs: {
        monitors: {
          terms: {
            field: 'monitor.id',
            size: 1000
          }
        }
      }
    };
    const parsedFilters = await (0, _status_check.formatFilterString)(uptimeEsClient, currAlert.params.filters, currAlert.params.search);
    esParams.query.bool = Object.assign({}, esParams.query.bool, parsedFilters === null || parsedFilters === void 0 ? void 0 : parsedFilters.bool);
    const {
      body: result
    } = await uptimeEsClient.search({
      body: esParams
    });

    if (result.hits.total.value > 0) {
      monitorAlerts.push(currAlert);
    }
  }

  return monitorAlerts;
};

const getMonitorDetails = async ({
  uptimeEsClient,
  monitorId,
  dateStart,
  dateEnd,
  alertsClient
}) => {
  var _result$hits$hits$;

  const queryFilters = [{
    range: {
      '@timestamp': {
        gte: dateStart,
        lte: dateEnd
      }
    }
  }, {
    term: {
      'monitor.id': monitorId
    }
  }];
  const params = {
    size: 1,
    _source: ['error', '@timestamp'],
    query: {
      bool: {
        must: [{
          exists: {
            field: 'error'
          }
        }],
        filter: queryFilters
      }
    },
    sort: [{
      '@timestamp': {
        order: 'desc'
      }
    }]
  };
  const {
    body: result
  } = await uptimeEsClient.search({
    body: params
  });
  const data = (_result$hits$hits$ = result.hits.hits[0]) === null || _result$hits$hits$ === void 0 ? void 0 : _result$hits$hits$._source;
  const errorTimestamp = data === null || data === void 0 ? void 0 : data['@timestamp'];
  const monAlerts = await getMonitorAlerts({
    uptimeEsClient,
    alertsClient,
    monitorId
  });
  return {
    monitorId,
    error: data === null || data === void 0 ? void 0 : data.error,
    timestamp: errorTimestamp,
    alerts: monAlerts
  };
};

exports.getMonitorDetails = getMonitorDetails;