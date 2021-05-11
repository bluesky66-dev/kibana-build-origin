"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProcessListAPIChartResponseRT = exports.ProcessListAPIChartQueryAggregationRT = exports.ProcessListAPIChartRequestRT = exports.ProcessListAPIResponseRT = exports.ProcessListAPIQueryAggregationRT = exports.ProcessListAPIRequestRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _metrics_api = require("../metrics_api");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const AggValueRT = rt.type({
  value: rt.number
});
const ProcessListAPIRequestRT = rt.type({
  hostTerm: rt.record(rt.string, rt.string),
  timefield: rt.string,
  indexPattern: rt.string,
  to: rt.number,
  sortBy: rt.type({
    name: rt.string,
    isAscending: rt.boolean
  }),
  searchFilter: rt.array(rt.record(rt.string, rt.record(rt.string, rt.unknown)))
});
exports.ProcessListAPIRequestRT = ProcessListAPIRequestRT;
const ProcessListAPIQueryAggregationRT = rt.type({
  summaryEvent: rt.type({
    summary: rt.type({
      hits: rt.type({
        hits: rt.array(rt.type({
          _source: rt.type({
            system: rt.type({
              process: rt.type({
                summary: rt.record(rt.string, rt.number)
              })
            })
          })
        }))
      })
    })
  }),
  processes: rt.type({
    filteredProcs: rt.type({
      buckets: rt.array(rt.type({
        key: rt.string,
        cpu: AggValueRT,
        memory: AggValueRT,
        startTime: rt.type({
          value_as_string: rt.string
        }),
        meta: rt.type({
          hits: rt.type({
            hits: rt.array(rt.type({
              _source: rt.type({
                process: rt.type({
                  pid: rt.number
                }),
                system: rt.type({
                  process: rt.type({
                    state: rt.string
                  })
                }),
                user: rt.type({
                  name: rt.string
                })
              })
            }))
          })
        })
      }))
    })
  })
});
exports.ProcessListAPIQueryAggregationRT = ProcessListAPIQueryAggregationRT;
const ProcessListAPIResponseRT = rt.type({
  processList: rt.array(rt.type({
    cpu: rt.number,
    memory: rt.number,
    startTime: rt.number,
    pid: rt.number,
    state: rt.string,
    user: rt.string,
    command: rt.string
  })),
  summary: rt.record(rt.string, rt.number)
});
exports.ProcessListAPIResponseRT = ProcessListAPIResponseRT;
const ProcessListAPIChartRequestRT = rt.type({
  hostTerm: rt.record(rt.string, rt.string),
  timefield: rt.string,
  indexPattern: rt.string,
  to: rt.number,
  command: rt.string
});
exports.ProcessListAPIChartRequestRT = ProcessListAPIChartRequestRT;
const ProcessListAPIChartQueryAggregationRT = rt.type({
  process: rt.type({
    filteredProc: rt.type({
      buckets: rt.array(rt.type({
        timeseries: rt.type({
          buckets: rt.array(rt.type({
            key: rt.number,
            memory: AggValueRT,
            cpu: AggValueRT
          }))
        })
      }))
    })
  })
});
exports.ProcessListAPIChartQueryAggregationRT = ProcessListAPIChartQueryAggregationRT;
const ProcessListAPIChartResponseRT = rt.type({
  cpu: _metrics_api.MetricsAPISeriesRT,
  memory: _metrics_api.MetricsAPISeriesRT
});
exports.ProcessListAPIChartResponseRT = ProcessListAPIChartResponseRT;