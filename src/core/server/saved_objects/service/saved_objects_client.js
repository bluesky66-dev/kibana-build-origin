"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsClient = void 0;

var _errors = require("./lib/errors");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *
 * @public
 */
class SavedObjectsClient {
  /** @internal */
  constructor(repository) {
    _defineProperty(this, "errors", _errors.SavedObjectsErrorHelpers);

    _defineProperty(this, "_repository", void 0);

    this._repository = repository;
  }
  /**
   * Persists a SavedObject
   *
   * @param type
   * @param attributes
   * @param options
   */


  async create(type, attributes, options) {
    return await this._repository.create(type, attributes, options);
  }
  /**
   * Persists multiple documents batched together as a single request
   *
   * @param objects
   * @param options
   */


  async bulkCreate(objects, options) {
    return await this._repository.bulkCreate(objects, options);
  }
  /**
   * Check what conflicts will result when creating a given array of saved objects. This includes "unresolvable conflicts", which are
   * multi-namespace objects that exist in a different namespace; such conflicts cannot be resolved/overwritten.
   *
   * @param objects
   * @param options
   */


  async checkConflicts(objects = [], options = {}) {
    return await this._repository.checkConflicts(objects, options);
  }
  /**
   * Deletes a SavedObject
   *
   * @param type
   * @param id
   * @param options
   */


  async delete(type, id, options = {}) {
    return await this._repository.delete(type, id, options);
  }
  /**
   * Find all SavedObjects matching the search query
   *
   * @param options
   */


  async find(options) {
    return await this._repository.find(options);
  }
  /**
   * Returns an array of objects by id
   *
   * @param objects - an array of ids, or an array of objects containing id, type and optionally fields
   * @example
   *
   * bulkGet([
   *   { id: 'one', type: 'config' },
   *   { id: 'foo', type: 'index-pattern' }
   * ])
   */


  async bulkGet(objects = [], options = {}) {
    return await this._repository.bulkGet(objects, options);
  }
  /**
   * Retrieves a single object
   *
   * @param type - The type of SavedObject to retrieve
   * @param id - The ID of the SavedObject to retrieve
   * @param options
   */


  async get(type, id, options = {}) {
    return await this._repository.get(type, id, options);
  }
  /**
   * Resolves a single object, using any legacy URL alias if it exists
   *
   * @param type - The type of SavedObject to retrieve
   * @param id - The ID of the SavedObject to retrieve
   * @param options
   */


  async resolve(type, id, options = {}) {
    return await this._repository.resolve(type, id, options);
  }
  /**
   * Updates an SavedObject
   *
   * @param type
   * @param id
   * @param options
   */


  async update(type, id, attributes, options = {}) {
    return await this._repository.update(type, id, attributes, options);
  }
  /**
   * Adds namespaces to a SavedObject
   *
   * @param type
   * @param id
   * @param namespaces
   * @param options
   */


  async addToNamespaces(type, id, namespaces, options = {}) {
    return await this._repository.addToNamespaces(type, id, namespaces, options);
  }
  /**
   * Removes namespaces from a SavedObject
   *
   * @param type
   * @param id
   * @param namespaces
   * @param options
   */


  async deleteFromNamespaces(type, id, namespaces, options = {}) {
    return await this._repository.deleteFromNamespaces(type, id, namespaces, options);
  }
  /**
   * Bulk Updates multiple SavedObject at once
   *
   * @param objects
   */


  async bulkUpdate(objects, options) {
    return await this._repository.bulkUpdate(objects, options);
  }
  /**
   * Updates all objects containing a reference to the given {type, id} tuple to remove the said reference.
   */


  async removeReferencesTo(type, id, options) {
    return await this._repository.removeReferencesTo(type, id, options);
  }
  /**
   * Opens a Point In Time (PIT) against the indices for the specified Saved Object types.
   * The returned `id` can then be passed to {@link SavedObjectsClient.find} to search
   * against that PIT.
   */


  async openPointInTimeForType(type, options = {}) {
    return await this._repository.openPointInTimeForType(type, options);
  }
  /**
   * Closes a Point In Time (PIT) by ID. This simply proxies the request to ES via the
   * Elasticsearch client, and is included in the Saved Objects Client as a convenience
   * for consumers who are using {@link SavedObjectsClient.openPointInTimeForType}.
   */


  async closePointInTime(id, options) {
    return await this._repository.closePointInTime(id, options);
  }

}

exports.SavedObjectsClient = SavedObjectsClient;

_defineProperty(SavedObjectsClient, "errors", _errors.SavedObjectsErrorHelpers);