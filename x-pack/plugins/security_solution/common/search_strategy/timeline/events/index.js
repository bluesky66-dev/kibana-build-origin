"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  TimelineEventsQueries: true
};
exports.TimelineEventsQueries = void 0;

var _all = require("./all");

Object.keys(_all).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _all[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _all[key];
    }
  });
});

var _details = require("./details");

Object.keys(_details).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _details[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _details[key];
    }
  });
});

var _last_event_time = require("./last_event_time");

Object.keys(_last_event_time).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _last_event_time[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _last_event_time[key];
    }
  });
});

var _eql = require("./eql");

Object.keys(_eql).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _eql[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _eql[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let TimelineEventsQueries;
exports.TimelineEventsQueries = TimelineEventsQueries;

(function (TimelineEventsQueries) {
  TimelineEventsQueries["all"] = "eventsAll";
  TimelineEventsQueries["details"] = "eventsDetails";
  TimelineEventsQueries["kpi"] = "eventsKpi";
  TimelineEventsQueries["lastEventTime"] = "eventsLastEventTime";
})(TimelineEventsQueries || (exports.TimelineEventsQueries = TimelineEventsQueries = {}));