"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsImporter = void 0;

var _import_saved_objects = require("./import_saved_objects");

var _resolve_import_errors = require("./resolve_import_errors");

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var _savedObjectsClient = new WeakMap();

var _typeRegistry = new WeakMap();

var _importSizeLimit = new WeakMap();

var _importHooks = new WeakMap();

/**
 * @public
 */
class SavedObjectsImporter {
  constructor({
    savedObjectsClient,
    typeRegistry,
    importSizeLimit
  }) {
    _savedObjectsClient.set(this, {
      writable: true,
      value: void 0
    });

    _typeRegistry.set(this, {
      writable: true,
      value: void 0
    });

    _importSizeLimit.set(this, {
      writable: true,
      value: void 0
    });

    _importHooks.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _savedObjectsClient, savedObjectsClient);

    _classPrivateFieldSet(this, _typeRegistry, typeRegistry);

    _classPrivateFieldSet(this, _importSizeLimit, importSizeLimit);

    _classPrivateFieldSet(this, _importHooks, typeRegistry.getAllTypes().reduce((hooks, type) => {
      var _type$management;

      if ((_type$management = type.management) !== null && _type$management !== void 0 && _type$management.onImport) {
        return { ...hooks,
          [type.name]: [type.management.onImport]
        };
      }

      return hooks;
    }, {}));
  }
  /**
   * Import saved objects from given stream. See the {@link SavedObjectsImportOptions | options} for more
   * detailed information.
   *
   * @throws SavedObjectsImportError
   */


  import({
    readStream,
    createNewCopies,
    namespace,
    overwrite
  }) {
    return (0, _import_saved_objects.importSavedObjectsFromStream)({
      readStream,
      createNewCopies,
      namespace,
      overwrite,
      objectLimit: _classPrivateFieldGet(this, _importSizeLimit),
      savedObjectsClient: _classPrivateFieldGet(this, _savedObjectsClient),
      typeRegistry: _classPrivateFieldGet(this, _typeRegistry),
      importHooks: _classPrivateFieldGet(this, _importHooks)
    });
  }
  /**
   * Resolve and return saved object import errors.
   * See the {@link SavedObjectsResolveImportErrorsOptions | options} for more detailed informations.
   *
   * @throws SavedObjectsImportError
   */


  resolveImportErrors({
    readStream,
    createNewCopies,
    namespace,
    retries
  }) {
    return (0, _resolve_import_errors.resolveSavedObjectsImportErrors)({
      readStream,
      createNewCopies,
      namespace,
      retries,
      objectLimit: _classPrivateFieldGet(this, _importSizeLimit),
      savedObjectsClient: _classPrivateFieldGet(this, _savedObjectsClient),
      typeRegistry: _classPrivateFieldGet(this, _typeRegistry),
      importHooks: _classPrivateFieldGet(this, _importHooks)
    });
  }

}

exports.SavedObjectsImporter = SavedObjectsImporter;