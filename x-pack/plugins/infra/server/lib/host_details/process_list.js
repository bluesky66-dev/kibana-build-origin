"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProcessList = void 0;

var _common = require("./common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const TOP_N = 10;

const getProcessList = async (search, {
  hostTerm,
  timefield,
  indexPattern,
  to,
  sortBy,
  searchFilter
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
      summaryEvent: {
        filter: {
          term: {
            'event.dataset': 'system.process.summary'
          }
        },
        aggs: {
          summary: {
            top_hits: {
              size: 1,
              sort: [{
                [timefield]: {
                  order: 'desc'
                }
              }],
              _source: ['system.process.summary']
            }
          }
        }
      },
      processes: {
        filter: {
          bool: {
            must: searchFilter !== null && searchFilter !== void 0 ? searchFilter : [{
              match_all: {}
            }]
          }
        },
        aggs: {
          filteredProcs: {
            terms: {
              field: _common.CMDLINE_FIELD,
              size: TOP_N,
              order: {
                [sortBy.name]: sortBy.isAscending ? 'asc' : 'desc'
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
              },
              startTime: {
                max: {
                  field: 'system.process.cpu.start_time'
                }
              },
              meta: {
                top_hits: {
                  size: 1,
                  sort: [{
                    [timefield]: {
                      order: 'desc'
                    }
                  }],
                  _source: ['system.process.state', 'user.name', 'process.pid']
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
      buckets: processListBuckets
    } = result.aggregations.processes.filteredProcs;
    const processList = processListBuckets.map(bucket => {
      const meta = bucket.meta.hits.hits[0]._source;
      return {
        cpu: bucket.cpu.value,
        memory: bucket.memory.value,
        startTime: Date.parse(bucket.startTime.value_as_string),
        pid: meta.process.pid,
        state: meta.system.process.state,
        user: meta.user.name,
        command: bucket.key
      };
    });
    let summary = {};

    if (result.aggregations.summaryEvent.summary.hits.hits.length) {
      summary = result.aggregations.summaryEvent.summary.hits.hits[0]._source.system.process.summary;
    }

    return {
      processList,
      summary
    };
  } catch (e) {
    throw e;
  }
};

exports.getProcessList = getProcessList;