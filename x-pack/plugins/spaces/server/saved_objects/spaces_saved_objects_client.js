"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpacesSavedObjectsClient = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _server = require("../../../../../src/core/server");

var _constants = require("../../common/constants");

var _namespace = require("../lib/utils/namespace");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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

const coerceToArray = param => {
  if (Array.isArray(param)) {
    return param;
  }

  return [param];
};

const throwErrorIfNamespaceSpecified = options => {
  if (options.namespace) {
    throw new Error('Spaces currently determines the namespaces');
  }
};

class SpacesSavedObjectsClient {
  constructor(options) {
    _defineProperty(this, "client", void 0);

    _defineProperty(this, "spaceId", void 0);

    _defineProperty(this, "types", void 0);

    _defineProperty(this, "spacesClient", void 0);

    _defineProperty(this, "errors", void 0);

    const {
      baseClient,
      request,
      getSpacesService,
      typeRegistry
    } = options;
    const spacesService = getSpacesService();
    this.client = baseClient;
    this.spacesClient = spacesService.createSpacesClient(request);
    this.spaceId = spacesService.getSpaceId(request);
    this.types = typeRegistry.getAllTypes().map(t => t.name);
    this.errors = baseClient.errors;
  }
  /**
   * Check what conflicts will result when creating a given array of saved objects. This includes "unresolvable conflicts", which are
   * multi-namespace objects that exist in a different namespace; such conflicts cannot be resolved/overwritten.
   *
   * @param objects
   * @param options
   */


  async checkConflicts(objects = [], options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.checkConflicts(objects, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }
  /**
   * Persists an object
   *
   * @param {string} type
   * @param {object} attributes
   * @param {object} [options={}]
   * @property {string} [options.id] - force id on creation, not recommended
   * @property {boolean} [options.overwrite=false]
   * @property {string} [options.namespace]
   * @returns {promise} - { id, type, version, attributes }
   */


  async create(type, attributes = {}, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.create(type, attributes, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }
  /**
   * Creates multiple documents at once
   *
   * @param {array} objects - [{ type, id, attributes }]
   * @param {object} [options={}]
   * @property {boolean} [options.overwrite=false] - overwrites existing documents
   * @property {string} [options.namespace]
   * @returns {promise} - { saved_objects: [{ id, type, version, attributes, error: { message } }]}
   */


  async bulkCreate(objects, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.bulkCreate(objects, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }
  /**
   * Deletes an object
   *
   * @param {string} type
   * @param {string} id
   * @param {object} [options={}]
   * @property {string} [options.namespace]
   * @returns {promise}
   */


  async delete(type, id, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.delete(type, id, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }
  /**
   * @param {object} [options={}]
   * @property {(string|Array<string>)} [options.type]
   * @property {string} [options.search]
   * @property {string} [options.defaultSearchOperator]
   * @property {Array<string>} [options.searchFields] - see Elasticsearch Simple Query String
   *                                        Query field argument for more information
   * @property {integer} [options.page=1]
   * @property {integer} [options.perPage=20]
   * @property {string} [options.sortField]
   * @property {string} [options.sortOrder]
   * @property {Array<string>} [options.fields]
   * @property {string} [options.namespaces]
   * @property {object} [options.hasReference] - { type, id }
   * @returns {promise} - { saved_objects: [{ id, type, version, attributes }], total, per_page, page }
   */


  async find(options) {
    throwErrorIfNamespaceSpecified(options);
    let namespaces = options.namespaces;

    if (namespaces) {
      try {
        const availableSpaces = await this.spacesClient.getAll({
          purpose: 'findSavedObjects'
        });

        if (namespaces.includes(_constants.ALL_SPACES_ID)) {
          namespaces = availableSpaces.map(space => space.id);
        } else {
          namespaces = namespaces.filter(namespace => availableSpaces.some(space => space.id === namespace));
        }

        if (namespaces.length === 0) {
          // return empty response, since the user is unauthorized in this space (or these spaces), but we don't return forbidden errors for `find` operations
          return _server.SavedObjectsUtils.createEmptyFindResponse(options);
        }
      } catch (err) {
        if (_boom.default.isBoom(err) && err.output.payload.statusCode === 403) {
          // return empty response, since the user is unauthorized in any space, but we don't return forbidden errors for `find` operations
          return _server.SavedObjectsUtils.createEmptyFindResponse(options);
        }

        throw err;
      }
    } else {
      namespaces = [this.spaceId];
    }

    return await this.client.find({ ...options,
      type: (options.type ? coerceToArray(options.type) : this.types).filter(type => type !== 'space'),
      namespaces
    });
  }
  /**
   * Returns an array of objects by id
   *
   * @param {array} objects - an array ids, or an array of objects containing id and optionally type
   * @param {object} [options={}]
   * @property {string} [options.namespace]
   * @returns {promise} - { saved_objects: [{ id, type, version, attributes }] }
   * @example
   *
   * bulkGet([
   *   { id: 'one', type: 'config' },
   *   { id: 'foo', type: 'index-pattern' }
   * ])
   */


  async bulkGet(objects = [], options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.bulkGet(objects, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }
  /**
   * Gets a single object
   *
   * @param {string} type
   * @param {string} id
   * @param {object} [options={}]
   * @property {string} [options.namespace]
   * @returns {promise} - { id, type, version, attributes }
   */


  async get(type, id, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.get(type, id, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }
  /**
   * Resolves a single object, using any legacy URL alias if it exists
   *
   * @param type - The type of SavedObject to retrieve
   * @param id - The ID of the SavedObject to retrieve
   * @param {object} [options={}]
   * @property {string} [options.namespace]
   * @returns {promise} - { saved_object, outcome }
   */


  async resolve(type, id, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.resolve(type, id, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }
  /**
   * Updates an object
   *
   * @param {string} type
   * @param {string} id
   * @param {object} [options={}]
   * @property {string} options.version - ensures version matches that of persisted object
   * @property {string} [options.namespace]
   * @returns {promise}
   */


  async update(type, id, attributes, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.update(type, id, attributes, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
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
    throwErrorIfNamespaceSpecified(options);
    return await this.client.addToNamespaces(type, id, namespaces, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
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
    throwErrorIfNamespaceSpecified(options);
    return await this.client.deleteFromNamespaces(type, id, namespaces, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }
  /**
   * Updates an array of objects by id
   *
   * @param {array} objects - an array ids, or an array of objects containing id, type, attributes and optionally version, references and namespace
   * @returns {promise} - { saved_objects: [{ id, type, version, attributes }] }
   * @example
   *
   * bulkUpdate([
   *   { id: 'one', type: 'config', attributes: { title: 'My new title'}, version: 'd7rhfk47d=' },
   *   { id: 'foo', type: 'index-pattern', attributes: {} }
   * ])
   */


  async bulkUpdate(objects = [], options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.bulkUpdate(objects, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }
  /**
   * Remove outward references to given object.
   *
   * @param type
   * @param id
   * @param options
   */


  async removeReferencesTo(type, id, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.removeReferencesTo(type, id, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }
  /**
   * Opens a Point In Time (PIT) against the indices for the specified Saved Object types.
   * The returned `id` can then be passed to `SavedObjects.find` to search against that PIT.
   *
   * @param {string|Array<string>} type
   * @param {object} [options] - {@link SavedObjectsOpenPointInTimeOptions}
   * @property {string} [options.keepAlive]
   * @property {string} [options.preference]
   * @returns {promise} - { id: string }
   */


  async openPointInTimeForType(type, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.openPointInTimeForType(type, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }
  /**
   * Closes a Point In Time (PIT) by ID. This simply proxies the request to ES
   * via the Elasticsearch client, and is included in the Saved Objects Client
   * as a convenience for consumers who are using `openPointInTimeForType`.
   *
   * @param {string} id - ID returned from `openPointInTimeForType`
   * @param {object} [options] - {@link SavedObjectsClosePointInTimeOptions}
   * @returns {promise} - { succeeded: boolean; num_freed: number }
   */


  async closePointInTime(id, options = {}) {
    throwErrorIfNamespaceSpecified(options);
    return await this.client.closePointInTime(id, { ...options,
      namespace: (0, _namespace.spaceIdToNamespace)(this.spaceId)
    });
  }

}

exports.SpacesSavedObjectsClient = SpacesSavedObjectsClient;