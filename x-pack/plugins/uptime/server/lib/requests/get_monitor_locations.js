"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMonitorLocations = void 0;

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getMonitorLocations = async ({
  uptimeEsClient,
  monitorId,
  dateStart,
  dateEnd
}) => {
  var _result$aggregations$, _result$aggregations, _result$aggregations$2;

  const sortOptions = [{
    '@timestamp': {
      order: 'desc'
    }
  }];
  const params = {
    size: 0,
    query: {
      bool: {
        filter: [{
          term: {
            'monitor.id': monitorId
          }
        }, {
          exists: {
            field: 'summary'
          }
        }, {
          range: {
            '@timestamp': {
              gte: dateStart,
              lte: dateEnd
            }
          }
        }]
      }
    },
    aggs: {
      location: {
        terms: {
          field: 'observer.geo.name',
          missing: '__location_missing__'
        },
        aggs: {
          most_recent: {
            top_hits: {
              size: 1,
              sort: sortOptions,
              _source: ['monitor', 'summary', 'observer', '@timestamp']
            }
          },
          down_history: {
            sum: {
              field: 'summary.down',
              missing: 0
            }
          },
          up_history: {
            sum: {
              field: 'summary.up',
              missing: 0
            }
          }
        }
      }
    }
  };
  const {
    body: result
  } = await uptimeEsClient.search({
    body: params
  });
  const locations = (_result$aggregations$ = result === null || result === void 0 ? void 0 : (_result$aggregations = result.aggregations) === null || _result$aggregations === void 0 ? void 0 : (_result$aggregations$2 = _result$aggregations.location) === null || _result$aggregations$2 === void 0 ? void 0 : _result$aggregations$2.buckets) !== null && _result$aggregations$ !== void 0 ? _result$aggregations$ : [];

  const getGeo = locGeo => {
    if (locGeo) {
      const {
        name,
        location
      } = locGeo;
      const latLon = location === null || location === void 0 ? void 0 : location.trim().split(',');
      return {
        name,
        location: latLon ? {
          lat: latLon[0],
          lon: latLon[1]
        } : undefined
      };
    } else {
      return {
        name: _constants.UNNAMED_LOCATION
      };
    }
  };

  let totalUps = 0;
  let totalDowns = 0;
  const monLocs = []; // eslint-disable-next-line @typescript-eslint/naming-convention

  locations.forEach(({
    most_recent: mostRecent,
    up_history,
    down_history
  }) => {
    var _up_history$value, _down_history$value, _mostRecentLocation$o;

    const mostRecentLocation = mostRecent.hits.hits[0]._source;
    totalUps += up_history.value;
    totalDowns += down_history.value;
    const location = {
      up_history: (_up_history$value = up_history.value) !== null && _up_history$value !== void 0 ? _up_history$value : 0,
      down_history: (_down_history$value = down_history.value) !== null && _down_history$value !== void 0 ? _down_history$value : 0,
      summary: mostRecentLocation === null || mostRecentLocation === void 0 ? void 0 : mostRecentLocation.summary,
      geo: getGeo(mostRecentLocation === null || mostRecentLocation === void 0 ? void 0 : (_mostRecentLocation$o = mostRecentLocation.observer) === null || _mostRecentLocation$o === void 0 ? void 0 : _mostRecentLocation$o.geo),
      timestamp: mostRecentLocation['@timestamp']
    };
    monLocs.push(location);
  });
  return {
    monitorId,
    locations: monLocs,
    up_history: totalUps,
    down_history: totalDowns
  };
};

exports.getMonitorLocations = getMonitorLocations;