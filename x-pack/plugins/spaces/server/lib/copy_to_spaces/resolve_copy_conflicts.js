"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveCopySavedObjectsToSpacesConflictsFactory = resolveCopySavedObjectsToSpacesConflictsFactory;

var _namespace = require("../utils/namespace");

var _create_empty_failure_response = require("./lib/create_empty_failure_response");

var _read_stream_to_completion = require("./lib/read_stream_to_completion");

var _readable_stream_from_array = require("./lib/readable_stream_from_array");

var _saved_objects_client_opts = require("./lib/saved_objects_client_opts");

var _get_ineligible_types = require("./lib/get_ineligible_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function resolveCopySavedObjectsToSpacesConflictsFactory(savedObjects, request) {
  const {
    getTypeRegistry,
    getScopedClient,
    createExporter,
    createImporter
  } = savedObjects;
  const savedObjectsClient = getScopedClient(request, _saved_objects_client_opts.COPY_TO_SPACES_SAVED_OBJECTS_CLIENT_OPTS);
  const savedObjectsExporter = createExporter(savedObjectsClient);
  const savedObjectsImporter = createImporter(savedObjectsClient);

  const exportRequestedObjects = async (sourceSpaceId, options) => {
    const objectStream = await savedObjectsExporter.exportByObjects({
      request,
      namespace: (0, _namespace.spaceIdToNamespace)(sourceSpaceId),
      includeReferencesDeep: options.includeReferences,
      excludeExportDetails: true,
      objects: options.objects
    });
    return (0, _read_stream_to_completion.readStreamToCompletion)(objectStream);
  };

  const resolveConflictsForSpace = async (spaceId, objectsStream, retries, createNewCopies) => {
    try {
      const importResponse = await savedObjectsImporter.resolveImportErrors({
        namespace: (0, _namespace.spaceIdToNamespace)(spaceId),
        readStream: objectsStream,
        retries,
        createNewCopies
      });
      return {
        success: importResponse.success,
        successCount: importResponse.successCount,
        successResults: importResponse.successResults,
        errors: importResponse.errors
      };
    } catch (error) {
      return (0, _create_empty_failure_response.createEmptyFailureResponse)([error]);
    }
  };

  const resolveCopySavedObjectsToSpacesConflicts = async (sourceSpaceId, options) => {
    const response = {};
    const exportedSavedObjects = await exportRequestedObjects(sourceSpaceId, {
      includeReferences: options.includeReferences,
      objects: options.objects
    });
    const ineligibleTypes = (0, _get_ineligible_types.getIneligibleTypes)(getTypeRegistry());
    const filteredObjects = exportedSavedObjects.filter(({
      type
    }) => !ineligibleTypes.includes(type));

    for (const entry of Object.entries(options.retries)) {
      const [spaceId, entryRetries] = entry;
      const retries = entryRetries.map(retry => ({ ...retry,
        replaceReferences: []
      }));
      response[spaceId] = await resolveConflictsForSpace(spaceId, (0, _readable_stream_from_array.createReadableStreamFromArray)(filteredObjects), retries, options.createNewCopies);
    }

    return response;
  };

  return resolveCopySavedObjectsToSpacesConflicts;
}