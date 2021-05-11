"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RollupSearchStrategy = void 0;

var _abstract_search_strategy = require("./abstract_search_strategy");

var _rollup_search_capabilities = require("../capabilities/rollup_search_capabilities");

var _server = require("../../../../../data/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getRollupIndices = rollupData => Object.keys(rollupData);

const isIndexPatternContainsWildcard = indexPattern => indexPattern.includes('*');

const isIndexPatternValid = indexPattern => indexPattern && typeof indexPattern === 'string' && !isIndexPatternContainsWildcard(indexPattern);

class RollupSearchStrategy extends _abstract_search_strategy.AbstractSearchStrategy {
  async search(req, bodies) {
    return super.search(req, bodies, 'rollup');
  }

  async getRollupData(req, indexPattern) {
    return req.requestContext.core.elasticsearch.client.asCurrentUser.rollup.getRollupIndexCaps({
      index: indexPattern
    }).then(data => data.body).catch(() => Promise.resolve({}));
  }

  async checkForViability(req, indexPattern) {
    let isViable = false;
    let capabilities = null;

    if (isIndexPatternValid(indexPattern)) {
      const rollupData = await this.getRollupData(req, indexPattern);
      const rollupIndices = getRollupIndices(rollupData);
      isViable = rollupIndices.length === 1;

      if (isViable) {
        const [rollupIndex] = rollupIndices;
        const fieldsCapabilities = (0, _server.getCapabilitiesForRollupIndices)(rollupData);
        capabilities = new _rollup_search_capabilities.RollupSearchCapabilities(req, fieldsCapabilities, rollupIndex);
      }
    }

    return {
      isViable,
      capabilities
    };
  }

  async getFieldsForWildcard(req, indexPattern, capabilities) {
    return super.getFieldsForWildcard(req, indexPattern, capabilities, {
      type: 'rollup',
      rollupIndex: indexPattern
    });
  }

}

exports.RollupSearchStrategy = RollupSearchStrategy;