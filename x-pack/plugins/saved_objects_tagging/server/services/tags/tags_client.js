"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TagsClient = void 0;

var _constants = require("../../../common/constants");

var _errors = require("./errors");

var _validate_tag = require("./validate_tag");

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

class TagsClient {
  constructor({
    client
  }) {
    _defineProperty(this, "soClient", void 0);

    _defineProperty(this, "type", _constants.tagSavedObjectTypeName);

    this.soClient = client;
  }

  async create(attributes) {
    const validation = (0, _validate_tag.validateTag)(attributes);

    if (!validation.valid) {
      throw new _errors.TagValidationError('Error validating tag attributes', validation);
    }

    const raw = await this.soClient.create(this.type, attributes);
    return (0, _utils.savedObjectToTag)(raw);
  }

  async update(id, attributes) {
    const validation = (0, _validate_tag.validateTag)(attributes);

    if (!validation.valid) {
      throw new _errors.TagValidationError('Error validating tag attributes', validation);
    }

    const raw = await this.soClient.update(this.type, id, attributes);
    return (0, _utils.savedObjectToTag)(raw); // all attributes are updated, this is not a partial
  }

  async get(id) {
    const raw = await this.soClient.get(this.type, id);
    return (0, _utils.savedObjectToTag)(raw);
  }

  async getAll() {
    const result = await this.soClient.find({
      type: this.type,
      perPage: 10000
    });
    return result.saved_objects.map(_utils.savedObjectToTag);
  }

  async delete(id) {
    // `removeReferencesTo` security check is the same as a `delete` operation's, so we can use the scoped client here.
    // If that was to change, we would need to use the internal client instead. A FTR test is ensuring
    // that this behave properly even with only 'tag' SO type write permission.
    await this.soClient.removeReferencesTo(this.type, id); // deleting the tag after reference removal in case of failure during the first call.

    await this.soClient.delete(this.type, id);
  }

}

exports.TagsClient = TagsClient;