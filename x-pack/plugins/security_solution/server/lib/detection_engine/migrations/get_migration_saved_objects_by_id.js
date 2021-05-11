"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrationSavedObjectsById = void 0;

var _Either = require("fp-ts/lib/Either");

var _pipeable = require("fp-ts/lib/pipeable");

var _validate = require("../../../../common/validate");

var _saved_objects_client = require("./saved_objects_client");

var _saved_objects_schema = require("./saved_objects_schema");

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

class MigrationResponseError extends Error {
  constructor(message, statusCode) {
    super(message);

    _defineProperty(this, "statusCode", void 0);

    this.statusCode = statusCode;
  }

}
/**
 * Retrieves a list of migrations SOs by their ID
 *
 * @param soClient An {@link SavedObjectsClientContract}
 * @param ids IDs of the migration SOs
 *
 * @returns a list of {@link SignalsMigrationSO[]}
 *
 * @throws if client returns an error
 */


const getMigrationSavedObjectsById = async ({
  ids,
  soClient
}) => {
  var _migrations$find;

  const client = (0, _saved_objects_client.signalsMigrationSOClient)(soClient);
  const objects = ids.map(id => ({
    id
  }));
  const {
    saved_objects: migrations
  } = await client.bulkGet(objects);
  const error = (_migrations$find = migrations.find(migration => migration.error)) === null || _migrations$find === void 0 ? void 0 : _migrations$find.error;

  if (error) {
    throw new MigrationResponseError(error.message, error.statusCode);
  }

  return (0, _pipeable.pipe)(migrations, ms => (0, _validate.validateEither)(_saved_objects_schema.signalsMigrationSOs, ms), (0, _Either.fold)(e => Promise.reject(e), a => Promise.resolve(a)));
};

exports.getMigrationSavedObjectsById = getMigrationSavedObjectsById;