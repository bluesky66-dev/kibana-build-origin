"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPatternHandler = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class IndexPatternHandler {
  constructor(savedObjectsClient) {
    this.savedObjectsClient = savedObjectsClient;
  } // returns a id based on an index pattern name


  async getIndexPatternId(indexName) {
    const response = await this.savedObjectsClient.find({
      type: 'index-pattern',
      perPage: 10,
      search: `"${indexName}"`,
      searchFields: ['title'],
      fields: ['title']
    });
    const ip = response.saved_objects.find(obj => obj.attributes.title.toLowerCase() === indexName.toLowerCase());
    return ip === null || ip === void 0 ? void 0 : ip.id;
  }

  async deleteIndexPatternById(indexId) {
    return await this.savedObjectsClient.delete('index-pattern', indexId);
  }

}

exports.IndexPatternHandler = IndexPatternHandler;