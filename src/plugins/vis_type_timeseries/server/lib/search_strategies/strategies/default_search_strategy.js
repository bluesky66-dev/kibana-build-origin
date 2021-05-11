"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultSearchStrategy = void 0;

var _abstract_search_strategy = require("./abstract_search_strategy");

var _default_search_capabilities = require("../capabilities/default_search_capabilities");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class DefaultSearchStrategy extends _abstract_search_strategy.AbstractSearchStrategy {
  checkForViability(req) {
    return Promise.resolve({
      isViable: true,
      capabilities: new _default_search_capabilities.DefaultSearchCapabilities(req)
    });
  }

  async getFieldsForWildcard(req, indexPattern, capabilities) {
    return super.getFieldsForWildcard(req, indexPattern, capabilities);
  }

}

exports.DefaultSearchStrategy = DefaultSearchStrategy;