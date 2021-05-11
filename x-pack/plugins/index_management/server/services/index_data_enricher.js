"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexDataEnricher = void 0;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class IndexDataEnricher {
  constructor() {
    _defineProperty(this, "_enrichers", []);

    _defineProperty(this, "enrichIndices", async (indices, callAsCurrentUser) => {
      let enrichedIndices = indices;

      for (let i = 0; i < this.enrichers.length; i++) {
        const dataEnricher = this.enrichers[i];

        try {
          const dataEnricherResponse = await dataEnricher(enrichedIndices, callAsCurrentUser);
          enrichedIndices = dataEnricherResponse;
        } catch (e) {// silently swallow enricher response errors
        }
      }

      return enrichedIndices;
    });
  }

  add(enricher) {
    this._enrichers.push(enricher);
  }

  get enrichers() {
    return this._enrichers;
  }

}

exports.IndexDataEnricher = IndexDataEnricher;