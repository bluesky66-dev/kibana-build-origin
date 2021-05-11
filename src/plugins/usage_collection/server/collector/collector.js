"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Collector = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// Using Required to enforce all optional keys in the object

/**
 * The context for the `fetch` method: It includes the most commonly used clients in the collectors (ES and SO clients).
 * Both are scoped based on the request and the context:
 * - When users are requesting a sample of data, it is scoped to their role to avoid exposing data they shouldn't read
 * - When building the telemetry data payload to report to the remote cluster, the requests are scoped to the `kibana` internal user
 *
 * @remark Bear in mind when testing your collector that your user has the same privileges as the Kibana Internal user to ensure the expected data is sent to the remote cluster.
 */
class Collector {
  /**
   * @private Constructor of a Collector. It should be called via the CollectorSet factory methods: `makeStatsCollector` and `makeUsageCollector`
   * @param log {@link Logger}
   * @param collectorDefinition {@link CollectorOptions}
   */
  constructor(log, {
    type,
    init,
    fetch,
    isReady,
    extendFetchContext = {},
    ...options
  }) {
    this.log = log;

    _defineProperty(this, "extendFetchContext", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "init", void 0);

    _defineProperty(this, "fetch", void 0);

    _defineProperty(this, "isReady", void 0);

    if (type === undefined) {
      throw new Error('Collector must be instantiated with a options.type string property');
    }

    if (typeof init !== 'undefined' && typeof init !== 'function') {
      throw new Error('If init property is passed, Collector must be instantiated with a options.init as a function property');
    }

    if (typeof fetch !== 'function') {
      throw new Error('Collector must be instantiated with a options.fetch function property');
    }

    Object.assign(this, options); // spread in other properties and mutate "this"

    this.type = type;
    this.init = init;
    this.fetch = fetch;
    this.isReady = typeof isReady === 'function' ? isReady : () => true;
    this.extendFetchContext = extendFetchContext;
  }

}

exports.Collector = Collector;