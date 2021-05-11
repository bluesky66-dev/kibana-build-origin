"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoreUsageStatsClient = exports.EXPORT_STATS_PREFIX = exports.RESOLVE_IMPORT_STATS_PREFIX = exports.IMPORT_STATS_PREFIX = exports.UPDATE_STATS_PREFIX = exports.RESOLVE_STATS_PREFIX = exports.GET_STATS_PREFIX = exports.FIND_STATS_PREFIX = exports.DELETE_STATS_PREFIX = exports.CREATE_STATS_PREFIX = exports.BULK_UPDATE_STATS_PREFIX = exports.BULK_GET_STATS_PREFIX = exports.BULK_CREATE_STATS_PREFIX = void 0;

var _constants = require("./constants");

var _utils = require("../saved_objects/service/lib/utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const BULK_CREATE_STATS_PREFIX = 'apiCalls.savedObjectsBulkCreate';
exports.BULK_CREATE_STATS_PREFIX = BULK_CREATE_STATS_PREFIX;
const BULK_GET_STATS_PREFIX = 'apiCalls.savedObjectsBulkGet';
exports.BULK_GET_STATS_PREFIX = BULK_GET_STATS_PREFIX;
const BULK_UPDATE_STATS_PREFIX = 'apiCalls.savedObjectsBulkUpdate';
exports.BULK_UPDATE_STATS_PREFIX = BULK_UPDATE_STATS_PREFIX;
const CREATE_STATS_PREFIX = 'apiCalls.savedObjectsCreate';
exports.CREATE_STATS_PREFIX = CREATE_STATS_PREFIX;
const DELETE_STATS_PREFIX = 'apiCalls.savedObjectsDelete';
exports.DELETE_STATS_PREFIX = DELETE_STATS_PREFIX;
const FIND_STATS_PREFIX = 'apiCalls.savedObjectsFind';
exports.FIND_STATS_PREFIX = FIND_STATS_PREFIX;
const GET_STATS_PREFIX = 'apiCalls.savedObjectsGet';
exports.GET_STATS_PREFIX = GET_STATS_PREFIX;
const RESOLVE_STATS_PREFIX = 'apiCalls.savedObjectsResolve';
exports.RESOLVE_STATS_PREFIX = RESOLVE_STATS_PREFIX;
const UPDATE_STATS_PREFIX = 'apiCalls.savedObjectsUpdate';
exports.UPDATE_STATS_PREFIX = UPDATE_STATS_PREFIX;
const IMPORT_STATS_PREFIX = 'apiCalls.savedObjectsImport';
exports.IMPORT_STATS_PREFIX = IMPORT_STATS_PREFIX;
const RESOLVE_IMPORT_STATS_PREFIX = 'apiCalls.savedObjectsResolveImportErrors';
exports.RESOLVE_IMPORT_STATS_PREFIX = RESOLVE_IMPORT_STATS_PREFIX;
const EXPORT_STATS_PREFIX = 'apiCalls.savedObjectsExport';
exports.EXPORT_STATS_PREFIX = EXPORT_STATS_PREFIX;
const ALL_COUNTER_FIELDS = [// Saved Objects Client APIs
...getFieldsForCounter(BULK_CREATE_STATS_PREFIX), ...getFieldsForCounter(BULK_GET_STATS_PREFIX), ...getFieldsForCounter(BULK_UPDATE_STATS_PREFIX), ...getFieldsForCounter(CREATE_STATS_PREFIX), ...getFieldsForCounter(DELETE_STATS_PREFIX), ...getFieldsForCounter(FIND_STATS_PREFIX), ...getFieldsForCounter(GET_STATS_PREFIX), ...getFieldsForCounter(RESOLVE_STATS_PREFIX), ...getFieldsForCounter(UPDATE_STATS_PREFIX), // Saved Objects Management APIs
...getFieldsForCounter(IMPORT_STATS_PREFIX), `${IMPORT_STATS_PREFIX}.createNewCopiesEnabled.yes`, `${IMPORT_STATS_PREFIX}.createNewCopiesEnabled.no`, `${IMPORT_STATS_PREFIX}.overwriteEnabled.yes`, `${IMPORT_STATS_PREFIX}.overwriteEnabled.no`, ...getFieldsForCounter(RESOLVE_IMPORT_STATS_PREFIX), `${RESOLVE_IMPORT_STATS_PREFIX}.createNewCopiesEnabled.yes`, `${RESOLVE_IMPORT_STATS_PREFIX}.createNewCopiesEnabled.no`, ...getFieldsForCounter(EXPORT_STATS_PREFIX), `${EXPORT_STATS_PREFIX}.allTypesSelected.yes`, `${EXPORT_STATS_PREFIX}.allTypesSelected.no`];
const SPACE_CONTEXT_REGEX = /^\/s\/([a-z0-9_\-]+)/;
/** @internal */

class CoreUsageStatsClient {
  constructor(debugLogger, basePath, repositoryPromise) {
    this.debugLogger = debugLogger;
    this.basePath = basePath;
    this.repositoryPromise = repositoryPromise;
  }

  async getUsageStats() {
    this.debugLogger('getUsageStats() called');
    let coreUsageStats = {};

    try {
      const repository = await this.repositoryPromise;
      const result = await repository.incrementCounter(_constants.CORE_USAGE_STATS_TYPE, _constants.CORE_USAGE_STATS_ID, ALL_COUNTER_FIELDS, {
        initialize: true
      } // set all counter fields to 0 if they don't exist
      );
      coreUsageStats = result.attributes;
    } catch (err) {// do nothing
    }

    return coreUsageStats;
  }

  async incrementSavedObjectsBulkCreate(options) {
    await this.updateUsageStats([], BULK_CREATE_STATS_PREFIX, options);
  }

  async incrementSavedObjectsBulkGet(options) {
    await this.updateUsageStats([], BULK_GET_STATS_PREFIX, options);
  }

  async incrementSavedObjectsBulkUpdate(options) {
    await this.updateUsageStats([], BULK_UPDATE_STATS_PREFIX, options);
  }

  async incrementSavedObjectsCreate(options) {
    await this.updateUsageStats([], CREATE_STATS_PREFIX, options);
  }

  async incrementSavedObjectsDelete(options) {
    await this.updateUsageStats([], DELETE_STATS_PREFIX, options);
  }

  async incrementSavedObjectsFind(options) {
    await this.updateUsageStats([], FIND_STATS_PREFIX, options);
  }

  async incrementSavedObjectsGet(options) {
    await this.updateUsageStats([], GET_STATS_PREFIX, options);
  }

  async incrementSavedObjectsResolve(options) {
    await this.updateUsageStats([], RESOLVE_STATS_PREFIX, options);
  }

  async incrementSavedObjectsUpdate(options) {
    await this.updateUsageStats([], UPDATE_STATS_PREFIX, options);
  }

  async incrementSavedObjectsImport(options) {
    const {
      createNewCopies,
      overwrite
    } = options;
    const counterFieldNames = [`createNewCopiesEnabled.${createNewCopies ? 'yes' : 'no'}`, `overwriteEnabled.${overwrite ? 'yes' : 'no'}`];
    await this.updateUsageStats(counterFieldNames, IMPORT_STATS_PREFIX, options);
  }

  async incrementSavedObjectsResolveImportErrors(options) {
    const {
      createNewCopies
    } = options;
    const counterFieldNames = [`createNewCopiesEnabled.${createNewCopies ? 'yes' : 'no'}`];
    await this.updateUsageStats(counterFieldNames, RESOLVE_IMPORT_STATS_PREFIX, options);
  }

  async incrementSavedObjectsExport(options) {
    const {
      types,
      supportedTypes
    } = options;
    const isAllTypesSelected = !!types && supportedTypes.every(x => types.includes(x));
    const counterFieldNames = [`allTypesSelected.${isAllTypesSelected ? 'yes' : 'no'}`];
    await this.updateUsageStats(counterFieldNames, EXPORT_STATS_PREFIX, options);
  }

  async updateUsageStats(counterFieldNames, prefix, {
    request
  }) {
    const options = {
      refresh: false
    };

    try {
      const repository = await this.repositoryPromise;
      const fields = this.getFieldsToIncrement(counterFieldNames, prefix, request);
      await repository.incrementCounter(_constants.CORE_USAGE_STATS_TYPE, _constants.CORE_USAGE_STATS_ID, fields, options);
    } catch (err) {// do nothing
    }
  }

  getIsDefaultNamespace(request) {
    const requestBasePath = this.basePath.get(request); // obtain the original request basePath, as it may have been modified by a request interceptor

    const pathToCheck = this.basePath.remove(requestBasePath); // remove the server basePath from the request basePath

    const matchResult = pathToCheck.match(SPACE_CONTEXT_REGEX); // Look for `/s/space-url-context` in the base path

    if (!matchResult || matchResult.length === 0) {
      return true;
    } // Ignoring first result, we only want the capture group result at index 1


    const [, spaceId] = matchResult;
    return spaceId === _utils.DEFAULT_NAMESPACE_STRING;
  }

  getFieldsToIncrement(counterFieldNames, prefix, request) {
    const isKibanaRequest = getIsKibanaRequest(request);
    const isDefaultNamespace = this.getIsDefaultNamespace(request);
    const namespaceField = isDefaultNamespace ? 'default' : 'custom';
    return ['total', `namespace.${namespaceField}.total`, `namespace.${namespaceField}.kibanaRequest.${isKibanaRequest ? 'yes' : 'no'}`, ...counterFieldNames].map(x => `${prefix}.${x}`);
  }

}

exports.CoreUsageStatsClient = CoreUsageStatsClient;

function getFieldsForCounter(prefix) {
  return ['total', 'namespace.default.total', 'namespace.default.kibanaRequest.yes', 'namespace.default.kibanaRequest.no', 'namespace.custom.total', 'namespace.custom.kibanaRequest.yes', 'namespace.custom.kibanaRequest.no'].map(x => `${prefix}.${x}`);
}

function getIsKibanaRequest({
  headers
}) {
  // The presence of these two request headers gives us a good indication that this is a first-party request from the Kibana client.
  // We can't be 100% certain, but this is a reasonable attempt.
  return headers && headers['kbn-version'] && headers.referer;
}