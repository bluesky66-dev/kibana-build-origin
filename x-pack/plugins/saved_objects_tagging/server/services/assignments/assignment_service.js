"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssignmentService = void 0;

var _lodash = require("lodash");

var _assignments = require("../../../common/assignments");

var _references = require("../../../common/references");

var _constants = require("../../../common/constants");

var _get_updatable_types = require("./get_updatable_types");

var _errors = require("./errors");

var _utils = require("./utils");

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

class AssignmentService {
  constructor({
    client,
    typeRegistry,
    authorization,
    request
  }) {
    _defineProperty(this, "soClient", void 0);

    _defineProperty(this, "typeRegistry", void 0);

    _defineProperty(this, "authorization", void 0);

    _defineProperty(this, "request", void 0);

    this.soClient = client;
    this.typeRegistry = typeRegistry;
    this.authorization = authorization;
    this.request = request;
  }

  async findAssignableObjects({
    search,
    types,
    maxResults = 100
  }) {
    const searchedTypes = (types ? types.filter(type => _constants.taggableTypes.includes(type)) : _constants.taggableTypes).filter(type => this.typeRegistry.getType(type) !== undefined);
    const assignableTypes = await this.getAssignableTypes(searchedTypes); // if no provided type was assignable, return an empty list instead of throwing an error

    if (assignableTypes.length === 0) {
      return [];
    }

    const searchFields = (0, _lodash.uniq)(assignableTypes.map(name => {
      var _this$typeRegistry$ge;

      return (_this$typeRegistry$ge = this.typeRegistry.getType(name)) === null || _this$typeRegistry$ge === void 0 ? void 0 : _this$typeRegistry$ge.management.defaultSearchField;
    }));
    const findResponse = await this.soClient.find({
      page: 1,
      perPage: maxResults,
      search,
      type: assignableTypes,
      searchFields
    });
    return findResponse.saved_objects.map(object => (0, _utils.toAssignableObject)(object, this.typeRegistry.getType(object.type)));
  }

  async getAssignableTypes(types) {
    return (0, _get_updatable_types.getUpdatableSavedObjectTypes)({
      request: this.request,
      types: types !== null && types !== void 0 ? types : _constants.taggableTypes,
      authorization: this.authorization
    });
  }

  async updateTagAssignments({
    tags,
    assign,
    unassign
  }) {
    const updatedTypes = (0, _lodash.uniq)([...assign, ...unassign].map(({
      type
    }) => type));
    const untaggableTypes = (0, _lodash.difference)(updatedTypes, _constants.taggableTypes);

    if (untaggableTypes.length) {
      throw new _errors.AssignmentError(`Unsupported type [${untaggableTypes.join(', ')}]`, 400);
    }

    const assignableTypes = await this.getAssignableTypes();
    const forbiddenTypes = (0, _lodash.difference)(updatedTypes, assignableTypes);

    if (forbiddenTypes.length) {
      throw new _errors.AssignmentError(`Forbidden type [${forbiddenTypes.join(', ')}]`, 403);
    }

    const {
      saved_objects: objects
    } = await this.soClient.bulkGet([...assign.map(referenceToBulkGet), ...unassign.map(referenceToBulkGet)]); // if we failed to fetch any object, just halt and throw an error

    const firstObjWithError = objects.find(obj => !!obj.error);

    if (firstObjWithError) {
      const firstError = firstObjWithError.error;
      throw new _errors.AssignmentError(firstError.message, firstError.statusCode);
    }

    const toAssign = new Set(assign.map(_assignments.getKey));
    const toUnassign = new Set(unassign.map(_assignments.getKey));
    const updatedObjects = objects.map(object => {
      return {
        id: object.id,
        type: object.type,
        // partial update. this will not update any attribute
        attributes: {},
        references: (0, _references.updateTagReferences)({
          references: object.references,
          toAdd: toAssign.has((0, _assignments.getKey)(object)) ? tags : [],
          toRemove: toUnassign.has((0, _assignments.getKey)(object)) ? tags : []
        })
      };
    });
    await this.soClient.bulkUpdate(updatedObjects);
  }

}

exports.AssignmentService = AssignmentService;

const referenceToBulkGet = ({
  type,
  id
}) => ({
  type,
  id,
  // we only need `type`, `id` and `references` that are included by default.
  fields: []
});