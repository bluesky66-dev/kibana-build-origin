"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importSavedObjectsFromStream = importSavedObjectsFromStream;

var _lib = require("./lib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Import saved objects from given stream. See the {@link SavedObjectsImportOptions | options} for more
 * detailed information.
 *
 * @public
 */
async function importSavedObjectsFromStream({
  readStream,
  objectLimit,
  overwrite,
  createNewCopies,
  savedObjectsClient,
  typeRegistry,
  importHooks,
  namespace
}) {
  let errorAccumulator = [];
  const supportedTypes = typeRegistry.getImportableAndExportableTypes().map(type => type.name); // Get the objects to import

  const collectSavedObjectsResult = await (0, _lib.collectSavedObjects)({
    readStream,
    objectLimit,
    supportedTypes
  });
  errorAccumulator = [...errorAccumulator, ...collectSavedObjectsResult.errors];
  /** Map of all IDs for objects that we are attempting to import; each value is empty by default */

  let importIdMap = collectSavedObjectsResult.importIdMap;
  let pendingOverwrites = new Set(); // Validate references

  const validateReferencesResult = await (0, _lib.validateReferences)(collectSavedObjectsResult.collectedObjects, savedObjectsClient, namespace);
  errorAccumulator = [...errorAccumulator, ...validateReferencesResult];

  if (createNewCopies) {
    importIdMap = (0, _lib.regenerateIds)(collectSavedObjectsResult.collectedObjects);
  } else {
    // Check single-namespace objects for conflicts in this namespace, and check multi-namespace objects for conflicts across all namespaces
    const checkConflictsParams = {
      objects: collectSavedObjectsResult.collectedObjects,
      savedObjectsClient,
      namespace,
      ignoreRegularConflicts: overwrite
    };
    const checkConflictsResult = await (0, _lib.checkConflicts)(checkConflictsParams);
    errorAccumulator = [...errorAccumulator, ...checkConflictsResult.errors];
    importIdMap = new Map([...importIdMap, ...checkConflictsResult.importIdMap]);
    pendingOverwrites = checkConflictsResult.pendingOverwrites; // Check multi-namespace object types for origin conflicts in this namespace

    const checkOriginConflictsParams = {
      objects: checkConflictsResult.filteredObjects,
      savedObjectsClient,
      typeRegistry,
      namespace,
      ignoreRegularConflicts: overwrite,
      importIdMap
    };
    const checkOriginConflictsResult = await (0, _lib.checkOriginConflicts)(checkOriginConflictsParams);
    errorAccumulator = [...errorAccumulator, ...checkOriginConflictsResult.errors];
    importIdMap = new Map([...importIdMap, ...checkOriginConflictsResult.importIdMap]);
    pendingOverwrites = new Set([...pendingOverwrites, ...checkOriginConflictsResult.pendingOverwrites]);
  } // Create objects in bulk


  const createSavedObjectsParams = {
    objects: collectSavedObjectsResult.collectedObjects,
    accumulatedErrors: errorAccumulator,
    savedObjectsClient,
    importIdMap,
    overwrite,
    namespace
  };
  const createSavedObjectsResult = await (0, _lib.createSavedObjects)(createSavedObjectsParams);
  errorAccumulator = [...errorAccumulator, ...createSavedObjectsResult.errors];
  const successResults = createSavedObjectsResult.createdObjects.map(createdObject => {
    var _typeRegistry$getType, _typeRegistry$getType2, _typeRegistry$getType3, _typeRegistry$getType4;

    const {
      type,
      id,
      destinationId,
      originId
    } = createdObject;
    const getTitle = (_typeRegistry$getType = typeRegistry.getType(type)) === null || _typeRegistry$getType === void 0 ? void 0 : (_typeRegistry$getType2 = _typeRegistry$getType.management) === null || _typeRegistry$getType2 === void 0 ? void 0 : _typeRegistry$getType2.getTitle;
    const meta = {
      title: getTitle ? getTitle(createdObject) : createdObject.attributes.title,
      icon: (_typeRegistry$getType3 = typeRegistry.getType(type)) === null || _typeRegistry$getType3 === void 0 ? void 0 : (_typeRegistry$getType4 = _typeRegistry$getType3.management) === null || _typeRegistry$getType4 === void 0 ? void 0 : _typeRegistry$getType4.icon
    };
    const attemptedOverwrite = pendingOverwrites.has(`${type}:${id}`);
    return {
      type,
      id,
      meta,
      ...(attemptedOverwrite && {
        overwrite: true
      }),
      ...(destinationId && {
        destinationId
      }),
      ...(destinationId && !originId && !createNewCopies && {
        createNewCopy: true
      })
    };
  });
  const errorResults = errorAccumulator.map(error => {
    var _typeRegistry$getType5, _typeRegistry$getType6;

    const icon = (_typeRegistry$getType5 = typeRegistry.getType(error.type)) === null || _typeRegistry$getType5 === void 0 ? void 0 : (_typeRegistry$getType6 = _typeRegistry$getType5.management) === null || _typeRegistry$getType6 === void 0 ? void 0 : _typeRegistry$getType6.icon;
    const attemptedOverwrite = pendingOverwrites.has(`${error.type}:${error.id}`);
    return { ...error,
      meta: { ...error.meta,
        icon
      },
      ...(attemptedOverwrite && {
        overwrite: true
      })
    };
  });
  const warnings = await (0, _lib.executeImportHooks)({
    objects: createSavedObjectsResult.createdObjects,
    importHooks
  });
  return {
    successCount: createSavedObjectsResult.createdObjects.length,
    success: errorAccumulator.length === 0,
    warnings,
    ...(successResults.length && {
      successResults
    }),
    ...(errorResults.length && {
      errors: errorResults
    })
  };
}