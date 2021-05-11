"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsClientServerToCommon = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class SavedObjectsClientServerToCommon {
  constructor(savedObjectClient) {
    _defineProperty(this, "savedObjectClient", void 0);

    this.savedObjectClient = savedObjectClient;
  }

  async find(options) {
    const result = await this.savedObjectClient.find(options);
    return result.saved_objects;
  }

  async get(type, id) {
    return await this.savedObjectClient.get(type, id);
  }

  async update(type, id, attributes, options) {
    return await this.savedObjectClient.update(type, id, attributes, options);
  }

  async create(type, attributes, options) {
    return await this.savedObjectClient.create(type, attributes, options);
  }

  delete(type, id) {
    return this.savedObjectClient.delete(type, id);
  }

}

exports.SavedObjectsClientServerToCommon = SavedObjectsClientServerToCommon;