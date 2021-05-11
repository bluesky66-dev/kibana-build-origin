"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsExporter = void 0;

var _utils = require("@kbn/utils");

var _fetch_nested_dependencies = require("./fetch_nested_dependencies");

var _sort_objects = require("./sort_objects");

var _errors = require("./errors");

var _apply_export_transforms = require("./apply_export_transforms");

var _point_in_time_finder = require("./point_in_time_finder");

var _utils2 = require("./utils");

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var _savedObjectsClient = new WeakMap();

var _exportTransforms = new WeakMap();

var _exportSizeLimit = new WeakMap();

var _log = new WeakMap();

/**
 * @public
 */
class SavedObjectsExporter {
  constructor({
    savedObjectsClient,
    typeRegistry,
    exportSizeLimit,
    logger
  }) {
    _savedObjectsClient.set(this, {
      writable: true,
      value: void 0
    });

    _exportTransforms.set(this, {
      writable: true,
      value: void 0
    });

    _exportSizeLimit.set(this, {
      writable: true,
      value: void 0
    });

    _log.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _log, logger);

    _classPrivateFieldSet(this, _savedObjectsClient, savedObjectsClient);

    _classPrivateFieldSet(this, _exportSizeLimit, exportSizeLimit);

    _classPrivateFieldSet(this, _exportTransforms, typeRegistry.getAllTypes().reduce((transforms, type) => {
      var _type$management;

      if ((_type$management = type.management) !== null && _type$management !== void 0 && _type$management.onExport) {
        return { ...transforms,
          [type.name]: type.management.onExport
        };
      }

      return transforms;
    }, {}));
  }
  /**
   * Generates an export stream for given types.
   *
   * See the {@link SavedObjectsExportByTypeOptions | options} for more detailed information.
   *
   * @throws SavedObjectsExportError
   */


  async exportByTypes(options) {
    _classPrivateFieldGet(this, _log).debug(`Initiating export for types: [${options.types}]`);

    const objects = await this.fetchByTypes(options);
    return this.processObjects(objects, _utils2.byIdAscComparator, {
      request: options.request,
      includeReferencesDeep: options.includeReferencesDeep,
      excludeExportDetails: options.excludeExportDetails,
      namespace: options.namespace
    });
  }
  /**
   * Generates an export stream for given object references.
   *
   * See the {@link SavedObjectsExportByObjectOptions | options} for more detailed information.
   *
   * @throws SavedObjectsExportError
   */


  async exportByObjects(options) {
    _classPrivateFieldGet(this, _log).debug(`Initiating export of [${options.objects.length}] objects.`);

    if (options.objects.length > _classPrivateFieldGet(this, _exportSizeLimit)) {
      throw _errors.SavedObjectsExportError.exportSizeExceeded(_classPrivateFieldGet(this, _exportSizeLimit));
    }

    const objects = await this.fetchByObjects(options);
    const comparator = (0, _utils2.getPreservedOrderComparator)(objects);
    return this.processObjects(objects, comparator, {
      request: options.request,
      includeReferencesDeep: options.includeReferencesDeep,
      excludeExportDetails: options.excludeExportDetails,
      namespace: options.namespace
    });
  }

  async processObjects(savedObjects, sortFunction, {
    request,
    excludeExportDetails = false,
    includeReferencesDeep = false,
    namespace
  }) {
    _classPrivateFieldGet(this, _log).debug(`Processing [${savedObjects.length}] saved objects.`);

    let exportedObjects;
    let missingReferences = [];
    savedObjects = await (0, _apply_export_transforms.applyExportTransforms)({
      request,
      objects: savedObjects,
      transforms: _classPrivateFieldGet(this, _exportTransforms),
      sortFunction
    });

    if (includeReferencesDeep) {
      _classPrivateFieldGet(this, _log).debug(`Fetching saved objects references.`);

      const fetchResult = await (0, _fetch_nested_dependencies.fetchNestedDependencies)(savedObjects, _classPrivateFieldGet(this, _savedObjectsClient), namespace);
      exportedObjects = (0, _sort_objects.sortObjects)(fetchResult.objects);
      missingReferences = fetchResult.missingRefs;
    } else {
      exportedObjects = (0, _sort_objects.sortObjects)(savedObjects);
    } // redact attributes that should not be exported


    const redactedObjects = exportedObjects.map(({
      namespaces,
      ...object
    }) => object);
    const exportDetails = {
      exportedCount: exportedObjects.length,
      missingRefCount: missingReferences.length,
      missingReferences
    };

    _classPrivateFieldGet(this, _log).debug(`Exporting [${redactedObjects.length}] saved objects.`);

    return (0, _utils.createListStream)([...redactedObjects, ...(excludeExportDetails ? [] : [exportDetails])]);
  }

  async fetchByObjects({
    objects,
    namespace
  }) {
    const bulkGetResult = await _classPrivateFieldGet(this, _savedObjectsClient).bulkGet(objects, {
      namespace
    });
    const erroredObjects = bulkGetResult.saved_objects.filter(obj => !!obj.error);

    if (erroredObjects.length) {
      throw _errors.SavedObjectsExportError.objectFetchError(erroredObjects);
    }

    return bulkGetResult.saved_objects;
  }

  async fetchByTypes({
    types,
    namespace,
    hasReference,
    search
  }) {
    const findOptions = {
      type: types,
      hasReference,
      hasReferenceOperator: hasReference ? 'OR' : undefined,
      search,
      namespaces: namespace ? [namespace] : undefined
    };
    const finder = (0, _point_in_time_finder.createPointInTimeFinder)({
      findOptions,
      logger: _classPrivateFieldGet(this, _log),
      savedObjectsClient: _classPrivateFieldGet(this, _savedObjectsClient)
    });
    const hits = [];

    for await (const result of finder.find()) {
      hits.push(...result.saved_objects);

      if (hits.length > _classPrivateFieldGet(this, _exportSizeLimit)) {
        await finder.close();
        throw _errors.SavedObjectsExportError.exportSizeExceeded(_classPrivateFieldGet(this, _exportSizeLimit));
      }
    } // sorts server-side by _id, since it's only available in fielddata


    return hits // exclude the find-specific `score` property from the exported objects
    .map(({
      score,
      ...obj
    }) => obj).sort(_utils2.byIdAscComparator);
  }

}

exports.SavedObjectsExporter = SavedObjectsExporter;