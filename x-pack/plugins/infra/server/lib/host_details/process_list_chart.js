"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProcessListChart = void 0;

var _lodash = require("lodash");

var _common = require("./common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getProcessListChart = async (search, {
  hostTerm,
  timefield,
  indexPattern,
  to,
  command
}) => {
  const body = {
    size: 0,
    query: {
      bool: {
        filter: [{
          range: {
            [timefield]: {
              gte: to - 60 * 1000,
              // 1 minute
              lte: to
            }
          }
        }, {
          term: hostTerm
        }]
      }
    },
    aggs: {
      process: {
        filter: {
          bool: {
            must: [{
              match: {
                [_common.CMDLINE_FIELD]: command
              }
            }]
          }
        },
        aggs: {
          filteredProc: {
            terms: {
              field: _common.CMDLINE_FIELD,
              size: 1
            },
            aggs: {
              timeseries: {
                date_histogram: {
                  field: timefield,
                  fixed_interval: '1m',
                  extended_bounds: {
                    min: to - 60 * 15 * 1000,
                    // 15 minutes,
                    max: to
                  }
                },
                aggs: {
                  cpu: {
                    avg: {
                      field: 'system.process.cpu.total.pct'
                    }
                  },
                  memory: {
                    avg: {
                      field: 'system.process.memory.rss.pct'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  try {
    const result = await search({
      body,
      index: indexPattern
    });
    const {
      buckets
    } = result.aggregations.process.filteredProc;
    const timeseries = (0, _lodash.first)(buckets.map(bucket => bucket.timeseries.buckets.reduce((tsResult, tsBucket) => {
      tsResult.cpu.rows.push({
        metric_0: tsBucket.cpu.value,
        timestamp: tsBucket.key
      });
      tsResult.memory.rows.push({
        metric_0: tsBucket.memory.value,
        timestamp: tsBucket.key
      });
      return tsResult;
    }, {
      cpu: {
        id: 'cpu',
        columns: TS_COLUMNS,
        rows: []
      },
      memory: {
        id: 'memory',
        columns: TS_COLUMNS,
        rows: []
      }
    })));
    return timeseries;
  } catch (e) {
    throw e;
  }
};

exports.getProcessListChart = getProcessListChart;
const TS_COLUMNS = [{
  name: 'timestamp',
  type: 'date'
}, {
  name: 'metric_0',
  type: 'number'
}];