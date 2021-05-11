"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPatternsApiServer = void 0;

var _lib = require("../../common/index_patterns/lib");

var _fetcher = require("./fetcher");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class IndexPatternsApiServer {
  constructor(elasticsearchClient) {
    _defineProperty(this, "esClient", void 0);

    this.esClient = elasticsearchClient;
  }

  async getFieldsForWildcard({
    pattern,
    metaFields,
    type,
    rollupIndex,
    allowNoIndex
  }) {
    const indexPatterns = new _fetcher.IndexPatternsFetcher(this.esClient, allowNoIndex);
    return await indexPatterns.getFieldsForWildcard({
      pattern,
      metaFields,
      type,
      rollupIndex
    }).catch(err => {
      if (err.output.payload.statusCode === 404 && err.output.payload.code === 'no_matching_indices') {
        throw new _lib.IndexPatternMissingIndices(pattern);
      } else {
        throw err;
      }
    });
  }

  async getFieldsForTimePattern(options) {
    const indexPatterns = new _fetcher.IndexPatternsFetcher(this.esClient);
    return await indexPatterns.getFieldsForTimePattern(options);
  }

}

exports.IndexPatternsApiServer = IndexPatternsApiServer;