"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortOrder = exports.CursorDirection = exports.FetchMonitorStatesQueryArgsType = exports.MonitorSummariesResultType = exports.MonitorSummaryType = exports.HistogramType = exports.HistogramPointType = exports.StateType = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _ping = require("../ping/ping");

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


const StateType = t.intersection([t.type({
  timestamp: t.string,
  url: t.partial({
    domain: t.string,
    full: t.string,
    path: t.string,
    port: t.number,
    scheme: t.string
  }),
  summaryPings: t.array(_ping.PingType),
  summary: t.partial({
    status: t.string,
    up: t.number,
    down: t.number
  }),
  monitor: t.intersection([t.partial({
    name: t.string
  }), t.type({
    type: t.string
  })])
}), t.partial({
  tls: t.partial({
    not_after: t.union([t.string, t.null]),
    not_before: t.union([t.string, t.null])
  }),
  observer: t.type({
    geo: t.type({
      name: t.array(t.string)
    })
  }),
  service: t.partial({
    name: t.string
  })
})]);
exports.StateType = StateType;
const HistogramPointType = t.type({
  timestamp: t.number,
  up: t.union([t.number, t.undefined]),
  down: t.union([t.number, t.undefined])
});
exports.HistogramPointType = HistogramPointType;
const HistogramType = t.type({
  points: t.array(HistogramPointType)
});
exports.HistogramType = HistogramType;
const MonitorSummaryType = t.intersection([t.type({
  monitor_id: t.string,
  state: StateType
}), t.partial({
  histogram: HistogramType,
  minInterval: t.number
})]);
exports.MonitorSummaryType = MonitorSummaryType;
const MonitorSummariesResultType = t.intersection([t.partial({
  totalSummaryCount: t.number
}), t.type({
  summaries: t.array(MonitorSummaryType),
  prevPagePagination: t.union([t.string, t.null]),
  nextPagePagination: t.union([t.string, t.null])
})]);
exports.MonitorSummariesResultType = MonitorSummariesResultType;
const FetchMonitorStatesQueryArgsType = t.intersection([t.partial({
  pagination: t.string,
  filters: t.string,
  statusFilter: t.string
}), t.type({
  dateRangeStart: t.string,
  dateRangeEnd: t.string,
  pageSize: t.number
})]);
exports.FetchMonitorStatesQueryArgsType = FetchMonitorStatesQueryArgsType;
let CursorDirection;
exports.CursorDirection = CursorDirection;

(function (CursorDirection) {
  CursorDirection["AFTER"] = "AFTER";
  CursorDirection["BEFORE"] = "BEFORE";
})(CursorDirection || (exports.CursorDirection = CursorDirection = {}));

let SortOrder;
exports.SortOrder = SortOrder;

(function (SortOrder) {
  SortOrder["ASC"] = "ASC";
  SortOrder["DESC"] = "DESC";
})(SortOrder || (exports.SortOrder = SortOrder = {}));