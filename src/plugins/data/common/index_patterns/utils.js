"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findByTitle = findByTitle;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Returns an object matching a given title
 *
 * @param client {SavedObjectsClientCommon}
 * @param title {string}
 * @returns {Promise<SavedObject|undefined>}
 */
async function findByTitle(client, title) {
  if (title) {
    const savedObjects = await client.find({
      type: 'index-pattern',
      perPage: 10,
      search: `"${title}"`,
      searchFields: ['title'],
      fields: ['title']
    });
    return savedObjects.find(obj => obj.attributes.title.toLowerCase() === title.toLowerCase());
  }
}