"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchSourceService = void 0;

var _ = require("./");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class SearchSourceService {
  setup() {}

  start(indexPatterns, dependencies) {
    return {
      /**
       * creates searchsource based on serialized search source fields
       */
      create: (0, _.createSearchSource)(indexPatterns, dependencies),

      /**
       * creates an enpty search source
       */
      createEmpty: () => {
        return new _.SearchSource({}, dependencies);
      }
    };
  }

  stop() {}

}

exports.SearchSourceService = SearchSourceService;