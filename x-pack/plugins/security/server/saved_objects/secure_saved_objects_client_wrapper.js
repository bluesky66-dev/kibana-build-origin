"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SecureSavedObjectsClientWrapper = void 0;

var _server = require("../../../../../src/core/server");

var _constants = require("../../common/constants");

var _audit = require("../audit");

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

class SecureSavedObjectsClientWrapper {
  constructor({
    actions,
    legacyAuditLogger,
    auditLogger,
    baseClient,
    checkSavedObjectsPrivilegesAsCurrentUser,
    errors,
    getSpacesService
  }) {
    _defineProperty(this, "actions", void 0);

    _defineProperty(this, "legacyAuditLogger", void 0);

    _defineProperty(this, "auditLogger", void 0);

    _defineProperty(this, "baseClient", void 0);

    _defineProperty(this, "checkSavedObjectsPrivilegesAsCurrentUser", void 0);

    _defineProperty(this, "getSpacesService", void 0);

    _defineProperty(this, "errors", void 0);

    this.errors = errors;
    this.actions = actions;
    this.legacyAuditLogger = legacyAuditLogger;
    this.auditLogger = auditLogger;
    this.baseClient = baseClient;
    this.checkSavedObjectsPrivilegesAsCurrentUser = checkSavedObjectsPrivilegesAsCurrentUser;
    this.getSpacesService = getSpacesService;
  }

  async create(type, attributes = {}, options = {}) {
    var _options$id;

    const optionsWithId = { ...options,
      id: (_options$id = options.id) !== null && _options$id !== void 0 ? _options$id : _server.SavedObjectsUtils.generateId()
    };
    const namespaces = [optionsWithId.namespace, ...(optionsWithId.initialNamespaces || [])];

    try {
      const args = {
        type,
        attributes,
        options: optionsWithId
      };
      await this.ensureAuthorized(type, 'create', namespaces, {
        args
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.CREATE,
        savedObject: {
          type,
          id: optionsWithId.id
        },
        error
      }));
      throw error;
    }

    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.CREATE,
      outcome: _audit.EventOutcome.UNKNOWN,
      savedObject: {
        type,
        id: optionsWithId.id
      }
    }));
    const savedObject = await this.baseClient.create(type, attributes, optionsWithId);
    return await this.redactSavedObjectNamespaces(savedObject, namespaces);
  }

  async checkConflicts(objects = [], options = {}) {
    const args = {
      objects,
      options
    };
    const types = this.getUniqueObjectTypes(objects);
    await this.ensureAuthorized(types, 'bulk_create', options.namespace, {
      args,
      auditAction: 'checkConflicts'
    });
    const response = await this.baseClient.checkConflicts(objects, options);
    return response;
  }

  async bulkCreate(objects, options = {}) {
    const objectsWithId = objects.map(obj => {
      var _obj$id;

      return { ...obj,
        id: (_obj$id = obj.id) !== null && _obj$id !== void 0 ? _obj$id : _server.SavedObjectsUtils.generateId()
      };
    });
    const namespaces = objectsWithId.reduce((acc, {
      initialNamespaces = []
    }) => acc.concat(initialNamespaces), [options.namespace]);

    try {
      const args = {
        objects: objectsWithId,
        options
      };
      await this.ensureAuthorized(this.getUniqueObjectTypes(objectsWithId), 'bulk_create', namespaces, {
        args
      });
    } catch (error) {
      objectsWithId.forEach(({
        type,
        id
      }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.CREATE,
        savedObject: {
          type,
          id
        },
        error
      })));
      throw error;
    }

    objectsWithId.forEach(({
      type,
      id
    }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.CREATE,
      outcome: _audit.EventOutcome.UNKNOWN,
      savedObject: {
        type,
        id
      }
    })));
    const response = await this.baseClient.bulkCreate(objectsWithId, options);
    return await this.redactSavedObjectsNamespaces(response, namespaces);
  }

  async delete(type, id, options = {}) {
    try {
      const args = {
        type,
        id,
        options
      };
      await this.ensureAuthorized(type, 'delete', options.namespace, {
        args
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.DELETE,
        savedObject: {
          type,
          id
        },
        error
      }));
      throw error;
    }

    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.DELETE,
      outcome: _audit.EventOutcome.UNKNOWN,
      savedObject: {
        type,
        id
      }
    }));
    return await this.baseClient.delete(type, id, options);
  }

  async find(options) {
    var _options$namespaces;

    if (this.getSpacesService() == null && Array.isArray(options.namespaces) && options.namespaces.length > 0) {
      throw this.errors.createBadRequestError(`_find across namespaces is not permitted when the Spaces plugin is disabled.`);
    }

    if (options.pit && Array.isArray(options.namespaces) && options.namespaces.length > 1) {
      throw this.errors.createBadRequestError('_find across namespaces is not permitted when using the `pit` option.');
    }

    const args = {
      options
    };
    const {
      status,
      typeMap
    } = await this.ensureAuthorized(options.type, 'find', options.namespaces, {
      args,
      requireFullAuthorization: false
    });

    if (status === 'unauthorized') {
      // return empty response
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.FIND,
        error: new Error(status)
      }));
      return _server.SavedObjectsUtils.createEmptyFindResponse(options);
    }

    const typeToNamespacesMap = Array.from(typeMap).reduce((acc, [type, {
      authorizedSpaces,
      isGloballyAuthorized
    }]) => isGloballyAuthorized ? acc.set(type, options.namespaces) : acc.set(type, authorizedSpaces), new Map());
    const response = await this.baseClient.find({ ...options,
      typeToNamespacesMap: undefined,
      // if the user is fully authorized, use `undefined` as the typeToNamespacesMap to prevent privilege escalation
      ...(status === 'partially_authorized' && {
        typeToNamespacesMap,
        type: '',
        namespaces: []
      }) // the repository requires that `type` and `namespaces` must be empty if `typeToNamespacesMap` is defined

    });
    response.saved_objects.forEach(({
      type,
      id
    }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.FIND,
      savedObject: {
        type,
        id
      }
    })));
    return await this.redactSavedObjectsNamespaces(response, (_options$namespaces = options.namespaces) !== null && _options$namespaces !== void 0 ? _options$namespaces : [undefined]);
  }

  async bulkGet(objects = [], options = {}) {
    try {
      const args = {
        objects,
        options
      };
      await this.ensureAuthorized(this.getUniqueObjectTypes(objects), 'bulk_get', options.namespace, {
        args
      });
    } catch (error) {
      objects.forEach(({
        type,
        id
      }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.GET,
        savedObject: {
          type,
          id
        },
        error
      })));
      throw error;
    }

    const response = await this.baseClient.bulkGet(objects, options);
    response.saved_objects.forEach(({
      error,
      type,
      id
    }) => {
      if (!error) {
        this.auditLogger.log((0, _audit.savedObjectEvent)({
          action: _audit.SavedObjectAction.GET,
          savedObject: {
            type,
            id
          }
        }));
      }
    });
    return await this.redactSavedObjectsNamespaces(response, [options.namespace]);
  }

  async get(type, id, options = {}) {
    try {
      const args = {
        type,
        id,
        options
      };
      await this.ensureAuthorized(type, 'get', options.namespace, {
        args
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.GET,
        savedObject: {
          type,
          id
        },
        error
      }));
      throw error;
    }

    const savedObject = await this.baseClient.get(type, id, options);
    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.GET,
      savedObject: {
        type,
        id
      }
    }));
    return await this.redactSavedObjectNamespaces(savedObject, [options.namespace]);
  }

  async resolve(type, id, options = {}) {
    try {
      const args = {
        type,
        id,
        options
      };
      await this.ensureAuthorized(type, 'get', options.namespace, {
        args,
        auditAction: 'resolve'
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.RESOLVE,
        savedObject: {
          type,
          id
        },
        error
      }));
      throw error;
    }

    const resolveResult = await this.baseClient.resolve(type, id, options);
    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.RESOLVE,
      savedObject: {
        type,
        id: resolveResult.saved_object.id
      }
    }));
    return { ...resolveResult,
      saved_object: await this.redactSavedObjectNamespaces(resolveResult.saved_object, [options.namespace])
    };
  }

  async update(type, id, attributes, options = {}) {
    try {
      const args = {
        type,
        id,
        attributes,
        options
      };
      await this.ensureAuthorized(type, 'update', options.namespace, {
        args
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.UPDATE,
        savedObject: {
          type,
          id
        },
        error
      }));
      throw error;
    }

    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.UPDATE,
      outcome: _audit.EventOutcome.UNKNOWN,
      savedObject: {
        type,
        id
      }
    }));
    const savedObject = await this.baseClient.update(type, id, attributes, options);
    return await this.redactSavedObjectNamespaces(savedObject, [options.namespace]);
  }

  async addToNamespaces(type, id, namespaces, options = {}) {
    const {
      namespace
    } = options;

    try {
      const args = {
        type,
        id,
        namespaces,
        options
      }; // To share an object, the user must have the "share_to_space" permission in each of the destination namespaces.

      await this.ensureAuthorized(type, 'share_to_space', namespaces, {
        args,
        auditAction: 'addToNamespacesCreate'
      }); // To share an object, the user must also have the "share_to_space" permission in one or more of the source namespaces. Because the
      // `addToNamespaces` operation is scoped to the current namespace, we can just check if the user has the "share_to_space" permission in
      // the current namespace. If the user has permission, but the saved object doesn't exist in this namespace, the base client operation
      // will result in a 404 error.

      await this.ensureAuthorized(type, 'share_to_space', namespace, {
        args,
        auditAction: 'addToNamespacesUpdate'
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.ADD_TO_SPACES,
        savedObject: {
          type,
          id
        },
        addToSpaces: namespaces,
        error
      }));
      throw error;
    }

    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.ADD_TO_SPACES,
      outcome: _audit.EventOutcome.UNKNOWN,
      savedObject: {
        type,
        id
      },
      addToSpaces: namespaces
    }));
    const response = await this.baseClient.addToNamespaces(type, id, namespaces, options);
    return await this.redactSavedObjectNamespaces(response, [namespace, ...namespaces]);
  }

  async deleteFromNamespaces(type, id, namespaces, options = {}) {
    try {
      const args = {
        type,
        id,
        namespaces,
        options
      }; // To un-share an object, the user must have the "share_to_space" permission in each of the target namespaces.

      await this.ensureAuthorized(type, 'share_to_space', namespaces, {
        args,
        auditAction: 'deleteFromNamespaces'
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.DELETE_FROM_SPACES,
        savedObject: {
          type,
          id
        },
        deleteFromSpaces: namespaces,
        error
      }));
      throw error;
    }

    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.DELETE_FROM_SPACES,
      outcome: _audit.EventOutcome.UNKNOWN,
      savedObject: {
        type,
        id
      },
      deleteFromSpaces: namespaces
    }));
    const response = await this.baseClient.deleteFromNamespaces(type, id, namespaces, options);
    return await this.redactSavedObjectNamespaces(response, namespaces);
  }

  async bulkUpdate(objects = [], options = {}) {
    const objectNamespaces = objects // The repository treats an `undefined` object namespace is treated as the absence of a namespace, falling back to options.namespace;
    // in this case, filter it out here so we don't accidentally check for privileges in the Default space when we shouldn't be doing so.
    .filter(({
      namespace
    }) => namespace !== undefined).map(({
      namespace
    }) => namespace);
    const namespaces = [options === null || options === void 0 ? void 0 : options.namespace, ...objectNamespaces];

    try {
      const args = {
        objects,
        options
      };
      await this.ensureAuthorized(this.getUniqueObjectTypes(objects), 'bulk_update', namespaces, {
        args
      });
    } catch (error) {
      objects.forEach(({
        type,
        id
      }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.UPDATE,
        savedObject: {
          type,
          id
        },
        error
      })));
      throw error;
    }

    objects.forEach(({
      type,
      id
    }) => this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.UPDATE,
      outcome: _audit.EventOutcome.UNKNOWN,
      savedObject: {
        type,
        id
      }
    })));
    const response = await this.baseClient.bulkUpdate(objects, options);
    return await this.redactSavedObjectsNamespaces(response, namespaces);
  }

  async removeReferencesTo(type, id, options = {}) {
    try {
      const args = {
        type,
        id,
        options
      };
      await this.ensureAuthorized(type, 'delete', options.namespace, {
        args,
        auditAction: 'removeReferences'
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.REMOVE_REFERENCES,
        savedObject: {
          type,
          id
        },
        error
      }));
      throw error;
    }

    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.REMOVE_REFERENCES,
      savedObject: {
        type,
        id
      },
      outcome: _audit.EventOutcome.UNKNOWN
    }));
    return await this.baseClient.removeReferencesTo(type, id, options);
  }

  async openPointInTimeForType(type, options) {
    try {
      const args = {
        type,
        options
      };
      await this.ensureAuthorized(type, 'open_point_in_time', options === null || options === void 0 ? void 0 : options.namespace, {
        args,
        // Partial authorization is acceptable in this case because this method is only designed
        // to be used with `find`, which already allows for partial authorization.
        requireFullAuthorization: false
      });
    } catch (error) {
      this.auditLogger.log((0, _audit.savedObjectEvent)({
        action: _audit.SavedObjectAction.OPEN_POINT_IN_TIME,
        error
      }));
      throw error;
    }

    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.OPEN_POINT_IN_TIME,
      outcome: _audit.EventOutcome.UNKNOWN
    }));
    return await this.baseClient.openPointInTimeForType(type, options);
  }

  async closePointInTime(id, options) {
    // We are intentionally omitting a call to `ensureAuthorized` here, because `closePointInTime`
    // doesn't take in `types`, which are required to perform authorization. As there is no way
    // to know what index/indices a PIT was created against, we have no practical means of
    // authorizing users. We've decided we are okay with this because:
    //   (a) Elasticsearch only requires `read` privileges on an index in order to open/close
    //       a PIT against it, and;
    //   (b) By the time a user is accessing this service, they are already authenticated
    //       to Kibana, which is our closest equivalent to Elasticsearch's `read`.
    this.auditLogger.log((0, _audit.savedObjectEvent)({
      action: _audit.SavedObjectAction.CLOSE_POINT_IN_TIME,
      outcome: _audit.EventOutcome.UNKNOWN
    }));
    return await this.baseClient.closePointInTime(id, options);
  }

  async checkPrivileges(actions, namespaceOrNamespaces) {
    try {
      return await this.checkSavedObjectsPrivilegesAsCurrentUser(actions, namespaceOrNamespaces);
    } catch (error) {
      throw this.errors.decorateGeneralError(error, error.body && error.body.reason);
    }
  }

  async ensureAuthorized(typeOrTypes, action, namespaceOrNamespaces, options = {}) {
    const {
      args,
      auditAction = action,
      requireFullAuthorization = true
    } = options;
    const types = Array.isArray(typeOrTypes) ? typeOrTypes : [typeOrTypes];
    const actionsToTypesMap = new Map(types.map(type => [this.actions.savedObject.get(type, action), type]));
    const actions = Array.from(actionsToTypesMap.keys());
    const result = await this.checkPrivileges(actions, namespaceOrNamespaces);
    const {
      hasAllRequested,
      username,
      privileges
    } = result;
    const spaceIds = uniq(privileges.kibana.map(({
      resource
    }) => resource).filter(x => x !== undefined)).sort();
    const missingPrivileges = this.getMissingPrivileges(privileges);
    const typeMap = privileges.kibana.reduce((acc, {
      resource,
      privilege,
      authorized
    }) => {
      var _acc$get;

      if (!authorized) {
        return acc;
      }

      const type = actionsToTypesMap.get(privilege); // always defined

      const value = (_acc$get = acc.get(type)) !== null && _acc$get !== void 0 ? _acc$get : {
        authorizedSpaces: []
      };

      if (resource === undefined) {
        return acc.set(type, { ...value,
          isGloballyAuthorized: true
        });
      }

      const authorizedSpaces = value.authorizedSpaces.concat(resource);
      return acc.set(type, { ...value,
        authorizedSpaces
      });
    }, new Map());

    const logAuthorizationFailure = () => {
      this.legacyAuditLogger.savedObjectsAuthorizationFailure(username, auditAction, types, spaceIds, missingPrivileges, args);
    };

    const logAuthorizationSuccess = (typeArray, spaceIdArray) => {
      this.legacyAuditLogger.savedObjectsAuthorizationSuccess(username, auditAction, typeArray, spaceIdArray, args);
    };

    if (hasAllRequested) {
      logAuthorizationSuccess(types, spaceIds);
      return {
        typeMap,
        status: 'fully_authorized'
      };
    } else if (!requireFullAuthorization) {
      const isPartiallyAuthorized = privileges.kibana.some(({
        authorized
      }) => authorized);

      if (isPartiallyAuthorized) {
        for (const [type, {
          isGloballyAuthorized,
          authorizedSpaces
        }] of typeMap.entries()) {
          // generate an individual audit record for each authorized type
          logAuthorizationSuccess([type], isGloballyAuthorized ? spaceIds : authorizedSpaces);
        }

        return {
          typeMap,
          status: 'partially_authorized'
        };
      } else {
        logAuthorizationFailure();
        return {
          typeMap,
          status: 'unauthorized'
        };
      }
    } else {
      logAuthorizationFailure();
      const targetTypes = uniq(missingPrivileges.map(({
        privilege
      }) => actionsToTypesMap.get(privilege)).sort()).join(',');
      const msg = `Unable to ${action} ${targetTypes}`;
      throw this.errors.decorateForbiddenError(new Error(msg));
    }
  }

  getMissingPrivileges(privileges) {
    return privileges.kibana.filter(({
      authorized
    }) => !authorized).map(({
      resource,
      privilege
    }) => ({
      spaceId: resource,
      privilege
    }));
  }

  getUniqueObjectTypes(objects) {
    return uniq(objects.map(o => o.type));
  }

  async getNamespacesPrivilegeMap(namespaces, previouslyAuthorizedSpaceIds) {
    const namespacesToCheck = namespaces.filter(namespace => !previouslyAuthorizedSpaceIds.includes(namespace));
    const initialPrivilegeMap = previouslyAuthorizedSpaceIds.reduce((acc, spaceId) => acc.set(spaceId, true), new Map());

    if (namespacesToCheck.length === 0) {
      return initialPrivilegeMap;
    }

    const action = this.actions.login;
    const checkPrivilegesResult = await this.checkPrivileges(action, namespacesToCheck); // check if the user can log into each namespace

    const map = checkPrivilegesResult.privileges.kibana.reduce((acc, {
      resource,
      authorized
    }) => {
      // there should never be a case where more than one privilege is returned for a given space
      // if there is, fail-safe (authorized + unauthorized = unauthorized)
      if (resource && (!authorized || !acc.has(resource))) {
        acc.set(resource, authorized);
      }

      return acc;
    }, initialPrivilegeMap);
    return map;
  }

  redactAndSortNamespaces(spaceIds, privilegeMap) {
    return spaceIds.map(x => x === _constants.ALL_SPACES_ID || privilegeMap.get(x) ? x : _constants.UNKNOWN_SPACE).sort(namespaceComparator);
  }

  async redactSavedObjectNamespaces(savedObject, previouslyAuthorizedNamespaces) {
    if (this.getSpacesService() === undefined || savedObject.namespaces == null || savedObject.namespaces.length === 0) {
      return savedObject;
    }

    const previouslyAuthorizedSpaceIds = previouslyAuthorizedNamespaces.map(x => this.getSpacesService().namespaceToSpaceId(x)); // all users can see the "all spaces" ID, and we don't need to recheck authorization for any namespaces that we just checked earlier

    const namespaces = savedObject.namespaces.filter(x => x !== _constants.ALL_SPACES_ID && !previouslyAuthorizedSpaceIds.includes(x));
    const privilegeMap = await this.getNamespacesPrivilegeMap(namespaces, previouslyAuthorizedSpaceIds);
    return { ...savedObject,
      namespaces: this.redactAndSortNamespaces(savedObject.namespaces, privilegeMap)
    };
  }

  async redactSavedObjectsNamespaces(response, previouslyAuthorizedNamespaces) {
    if (this.getSpacesService() === undefined) {
      return response;
    }

    const previouslyAuthorizedSpaceIds = previouslyAuthorizedNamespaces.map(x => this.getSpacesService().namespaceToSpaceId(x));
    const {
      saved_objects: savedObjects
    } = response; // all users can see the "all spaces" ID, and we don't need to recheck authorization for any namespaces that we just checked earlier

    const namespaces = uniq(savedObjects.flatMap(savedObject => savedObject.namespaces || [])).filter(x => x !== _constants.ALL_SPACES_ID && !previouslyAuthorizedSpaceIds.includes(x));
    const privilegeMap = await this.getNamespacesPrivilegeMap(namespaces, previouslyAuthorizedSpaceIds);
    return { ...response,
      saved_objects: savedObjects.map(savedObject => ({ ...savedObject,
        namespaces: savedObject.namespaces && this.redactAndSortNamespaces(savedObject.namespaces, privilegeMap)
      }))
    };
  }

}
/**
 * Returns all unique elements of an array.
 */


exports.SecureSavedObjectsClientWrapper = SecureSavedObjectsClientWrapper;

function uniq(arr) {
  return Array.from(new Set(arr));
}
/**
 * Utility function to sort potentially redacted namespaces.
 * Sorts in a case-insensitive manner, and ensures that redacted namespaces ('?') always show up at the end of the array.
 */


function namespaceComparator(a, b) {
  const A = a.toUpperCase();
  const B = b.toUpperCase();

  if (A === _constants.UNKNOWN_SPACE && B !== _constants.UNKNOWN_SPACE) {
    return 1;
  } else if (A !== _constants.UNKNOWN_SPACE && B === _constants.UNKNOWN_SPACE) {
    return -1;
  }

  return A > B ? 1 : A < B ? -1 : 0;
}