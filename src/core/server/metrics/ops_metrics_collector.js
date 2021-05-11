"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpsMetricsCollector = void 0;

var _collectors = require("./collectors");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OpsMetricsCollector {
  constructor(server, opsOptions) {
    _defineProperty(this, "processCollector", void 0);

    _defineProperty(this, "osCollector", void 0);

    _defineProperty(this, "serverCollector", void 0);

    this.processCollector = new _collectors.ProcessMetricsCollector();
    this.osCollector = new _collectors.OsMetricsCollector(opsOptions);
    this.serverCollector = new _collectors.ServerMetricsCollector(server);
  }

  async collect() {
    const [process, os, server] = await Promise.all([this.processCollector.collect(), this.osCollector.collect(), this.serverCollector.collect()]);
    return {
      collected_at: new Date(),
      process,
      os,
      ...server
    };
  }

  reset() {
    this.processCollector.reset();
    this.osCollector.reset();
    this.serverCollector.reset();
  }

}

exports.OpsMetricsCollector = OpsMetricsCollector;