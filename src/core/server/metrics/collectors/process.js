"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProcessMetricsCollector = void 0;

var _v = _interopRequireDefault(require("v8"));

var _hoek = require("@hapi/hoek");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ProcessMetricsCollector {
  async collect() {
    const heapStats = _v.default.getHeapStatistics();

    const memoryUsage = process.memoryUsage();
    const [eventLoopDelay] = await Promise.all([getEventLoopDelay()]);
    return {
      memory: {
        heap: {
          total_in_bytes: memoryUsage.heapTotal,
          used_in_bytes: memoryUsage.heapUsed,
          size_limit: heapStats.heap_size_limit
        },
        resident_set_size_in_bytes: memoryUsage.rss
      },
      pid: process.pid,
      event_loop_delay: eventLoopDelay,
      uptime_in_millis: process.uptime() * 1000
    };
  }

  reset() {}

}

exports.ProcessMetricsCollector = ProcessMetricsCollector;

const getEventLoopDelay = () => {
  const bench = new _hoek.Bench();
  return new Promise(resolve => {
    setImmediate(() => {
      return resolve(bench.elapsed());
    });
  });
};