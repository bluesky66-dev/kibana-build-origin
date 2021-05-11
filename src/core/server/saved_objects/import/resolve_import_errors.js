"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveSavedObjectsImportErrors = resolveSavedObjectsImportErrors;

var _lib = require("./lib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Resolve and return saved object import errors.
 * See the {@link SavedObjectsResolveImportErrorsOptions | options} for more detailed informations.
 *
 * @public
 */
async function resolveSavedObjectsImportErrors({
  readStream,
  objectLimit,
  retries,
  savedObjectsClient,
  typeRegistry,
  importHooks,
  namespace,
  createNewCopies
}) {
  // throw a BadRequest error if we see invalid retries
  (0, _lib.validateRetries)(retries);
  let successCount = 0;
  let errorAccumulator = [];
  let importIdMap = new Map();
  const supportedTypes = typeRegistry.getImportableAndExportableTypes().map(type => type.name);
  const filter = (0, _lib.createObjectsFilter)(retries); // Get the objects to resolve errors

  const {
    errors: collectorErrors,
    collectedObjects: objectsToResolve
  } = await (0, _lib.collectSavedObjects)({
    readStream,
    objectLimit,
    filter,
    supportedTypes
  });
  errorAccumulator = [...errorAccumulator, ...collectorErrors]; // Create a map of references to replace for each object to avoid iterating through
  // retries for every object to resolve

  const retriesReferencesMap = new Map();

  for (const retry of retries) {
    const map = {};

    for (const {
      type,
      from,
      to
    } of retry.replaceReferences) {
      map[`${type}:${from}`] = to;
    }

    retriesReferencesMap.set(`${retry.type}:${retry.id}`, map);
  } // Replace references


  for (const savedObject of objectsToResolve) {
    const refMap = retriesReferencesMap.get(`${savedObject.type}:${savedObject.id}`);

    if (!refMap) {
      continue;
    }

    for (const reference of savedObject.references || []) {
      if (refMap[`${reference.type}:${reference.id}`]) {
        reference.id = refMap[`${reference.type}:${reference.id}`];
      }
    }
  } // Validate references


  const validateReferencesResult = await (0, _lib.validateReferences)(objectsToResolve, savedObjectsClient, namespace, retries);
  errorAccumulator = [...errorAccumulator, ...validateReferencesResult];

  if (createNewCopies) {
    // In case any missing reference errors were resolved, ensure that we regenerate those object IDs as well
    // This is because a retry to resolve a missing reference error may not necessarily specify a destinationId
    importIdMap = (0, _lib.regenerateIds)(objectsToResolve);
  } // Check single-namespace objects for conflicts in this namespace, and check multi-namespace objects for conflicts across all namespaces


  const checkConflictsParams = {
    objects: objectsToResolve,
    savedObjectsClient,
    namespace,
    retries,
    createNewCopies
  };
  const checkConflictsResult = await (0, _lib.checkConflicts)(checkConflictsParams);
  errorAccumulator = [...errorAccumulator, ...checkConflictsResult.errors]; // Check multi-namespace object types for regular conflicts and ambiguous conflicts

  const getImportIdMapForRetriesParams = {
    objects: checkConflictsResult.filteredObjects,
    retries,
    createNewCopies
  };
  const importIdMapForRetries = (0, _lib.getImportIdMapForRetries)(getImportIdMapForRetriesParams);
  importIdMap = new Map([...importIdMap, ...importIdMapForRetries, ...checkConflictsResult.importIdMap // this importIdMap takes precedence over the others
  ]); // Bulk create in two batches, overwrites and non-overwrites

  let successResults = [];
  let successObjects = [];
  const accumulatedErrors = [...errorAccumulator];

  const bulkCreateObjects = async (objects, overwrite) => {
    const createSavedObjectsParams = {
      objects,
      accumulatedErrors,
      savedObjectsClient,
      importIdMap,
      namespace,
      overwrite
    };
    const {
      createdObjects,
      errors: bulkCreateErrors
    } = await (0, _lib.createSavedObjects)(createSavedObjectsParams);
    successObjects = [...successObjects, ...createdObjects];
    errorAccumulator = [...errorAccumulator, ...bulkCreateErrors];
    successCount += createdObjects.length;
    successResults = [...successResults, ...createdObjects.map(createdObject => {
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
      return {
        type,
        id,
        meta,
        ...(overwrite && {
          overwrite
        }),
        ...(destinationId && {
          destinationId
        }),
        ...(destinationId && !originId && !createNewCopies && {
          createNewCopy: true
        })
      };
    })];
  };

  const {
    objectsToOverwrite,
    objectsToNotOverwrite
  } = (0, _lib.splitOverwrites)(objectsToResolve, retries);
  await bulkCreateObjects(objectsToOverwrite, true);
  await bulkCreateObjects(objectsToNotOverwrite);
  const errorResults = errorAccumulator.map(error => {
    var _typeRegistry$getType5, _typeRegistry$getType6;

    const icon = (_typeRegistry$getType5 = typeRegistry.getType(error.type)) === null || _typeRegistry$getType5 === void 0 ? void 0 : (_typeRegistry$getType6 = _typeRegistry$getType5.management) === null || _typeRegistry$getType6 === void 0 ? void 0 : _typeRegistry$getType6.icon;
    const attemptedOverwrite = retries.some(({
      type,
      id,
      overwrite
    }) => type === error.type && id === error.id && overwrite);
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
    objects: successObjects,
    importHooks
  });
  return {
    successCount,
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