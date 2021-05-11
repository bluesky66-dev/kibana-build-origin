"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServerMetricsCollector = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ServerMetricsCollector {
  constructor(server) {
    this.server = server;

    _defineProperty(this, "requests", {
      disconnects: 0,
      total: 0,
      statusCodes: {}
    });

    _defineProperty(this, "responseTimes", {
      count: 0,
      total: 0,
      max: 0
    });

    this.server.ext('onRequest', (request, h) => {
      this.requests.total++;
      request.events.once('disconnect', () => {
        this.requests.disconnects++;
      });
      return h.continue;
    });
    this.server.events.on('response', request => {
      var _request$response;

      const statusCode = (_request$response = request.response) === null || _request$response === void 0 ? void 0 : _request$response.statusCode;

      if (statusCode) {
        if (!this.requests.statusCodes[statusCode]) {
          this.requests.statusCodes[statusCode] = 0;
        }

        this.requests.statusCodes[statusCode]++;
      }

      const duration = Date.now() - request.info.received;
      this.responseTimes.count++;
      this.responseTimes.total += duration;
      this.responseTimes.max = Math.max(this.responseTimes.max, duration);
    });
  }

  async collect() {
    const connections = await new Promise(resolve => {
      this.server.listener.getConnections((_, count) => {
        resolve(count);
      });
    });
    return {
      requests: this.requests,
      response_times: {
        avg_in_millis: this.responseTimes.total / Math.max(this.responseTimes.count, 1),
        max_in_millis: this.responseTimes.max
      },
      concurrent_connections: connections
    };
  }

  reset() {
    this.requests = {
      disconnects: 0,
      total: 0,
      statusCodes: {}
    };
    this.responseTimes = {
      count: 0,
      total: 0,
      max: 0
    };
  }

}

exports.ServerMetricsCollector = ServerMetricsCollector;