"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticsearchIndexFieldAdapter = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class ElasticsearchIndexFieldAdapter {
  // Deprecated until we delete all the code
  async getIndexFields(request, indices) {
    return Promise.resolve(['deprecated']);
  }

}

exports.ElasticsearchIndexFieldAdapter = ElasticsearchIndexFieldAdapter;