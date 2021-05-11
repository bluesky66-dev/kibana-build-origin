"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractSearchStrategy = exports.toSanitizedFieldType = void 0;

var _server = require("../../../../../data/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const toSanitizedFieldType = fields => {
  return fields.filter(field => // Make sure to only include mapped fields, e.g. no index pattern runtime fields
  !field.runtimeField && field.aggregatable && !_server.indexPatterns.isNestedField(field)).map(field => {
    var _field$customLabel;

    return {
      name: field.name,
      label: (_field$customLabel = field.customLabel) !== null && _field$customLabel !== void 0 ? _field$customLabel : field.name,
      type: field.type
    };
  });
};

exports.toSanitizedFieldType = toSanitizedFieldType;

class AbstractSearchStrategy {
  async search(req, bodies, indexType) {
    const requests = [];
    bodies.forEach(body => {
      requests.push(req.requestContext.search.search({
        indexType,
        params: { ...body
        }
      }, req.payload.searchSession).toPromise());
    });
    return Promise.all(requests);
  }

  checkForViability(req, indexPattern) {
    throw new TypeError('Must override method');
  }

  async getFieldsForWildcard(req, indexPattern, capabilities, options) {
    const {
      indexPatternsFetcher
    } = req.pre;
    const indexPatternsService = await req.getIndexPatternsService();
    const kibanaIndexPattern = (await indexPatternsService.find(indexPattern)).find(index => index.title === indexPattern);
    return toSanitizedFieldType(kibanaIndexPattern ? kibanaIndexPattern.getNonScriptedFields() : await indexPatternsFetcher.getFieldsForWildcard({
      pattern: indexPattern,
      fieldCapsOptions: {
        allow_no_indices: true
      },
      metaFields: [],
      ...options
    }));
  }

}

exports.AbstractSearchStrategy = AbstractSearchStrategy;