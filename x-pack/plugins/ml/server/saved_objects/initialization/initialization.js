"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobSavedObjectsInitializationFactory = jobSavedObjectsInitializationFactory;

var _util = require("../util");

var _sync = require("../sync");

var _service = require("../service");

var _log = require("../../lib/log");

var _saved_objects = require("../../../common/types/saved_objects");

var _space_overrides = require("./space_overrides");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates initializeJobs function which is used to check whether
 * ml job saved objects exist and creates them if needed
 *
 * @param core: CoreStart
 */


function jobSavedObjectsInitializationFactory(core, security, spacesEnabled) {
  const client = core.elasticsearch.client;
  /**
   * Check whether ML saved objects exist.
   * If they don't, check to see whether ML jobs exist.
   * If jobs exist, but the saved objects do not, create the saved objects.
   *
   */

  async function initializeJobs() {
    try {
      const {
        getInternalSavedObjectsClient
      } = (0, _util.savedObjectClientsFactory)(() => core.savedObjects);
      const savedObjectsClient = getInternalSavedObjectsClient();

      if (savedObjectsClient === null) {
        _log.mlLog.error('Internal saved object client not initialized!');

        return;
      }

      if ((await _needsInitializing(savedObjectsClient)) === false) {
        // ml job saved objects have already been initialized
        return;
      }

      const jobSavedObjectService = (0, _service.jobSavedObjectServiceFactory)(savedObjectsClient, savedObjectsClient, spacesEnabled, security === null || security === void 0 ? void 0 : security.authz, () => Promise.resolve() // pretend isMlReady, to allow us to initialize the saved objects
      );

      _log.mlLog.info('Initializing job saved objects'); // create space overrides for specific jobs


      const jobSpaceOverrides = await (0, _space_overrides.createJobSpaceOverrides)(client); // initialize jobs

      const {
        initSavedObjects
      } = (0, _sync.syncSavedObjectsFactory)(client, jobSavedObjectService);
      const {
        jobs
      } = await initSavedObjects(false, jobSpaceOverrides);

      _log.mlLog.info(`${jobs.length} job saved objects initialized`);
    } catch (error) {
      _log.mlLog.error(`Error Initializing jobs ${JSON.stringify(error)}`);
    }
  }

  async function _needsInitializing(savedObjectsClient) {
    if (await _jobSavedObjectsExist(savedObjectsClient)) {
      // at least one ml saved object exists
      // this has been initialized before
      return false;
    }

    if (await _jobsExist()) {
      // some ml jobs exist, we need to create those saved objects
      return true;
    } // no ml jobs actually exist,
    // that's why there were no saved objects


    return false;
  }

  async function _jobSavedObjectsExist(savedObjectsClient) {
    const options = {
      type: _saved_objects.ML_SAVED_OBJECT_TYPE,
      perPage: 0,
      namespaces: ['*']
    };
    const {
      total
    } = await savedObjectsClient.find(options);
    return total > 0;
  }

  async function _jobsExist() {
    // it would be better to use a simple count search here
    // but the kibana user does not have access to .ml-config
    //
    // const { body } = await client.asInternalUser.count({
    //   index: '.ml-config',
    // });
    // return body.count > 0;
    const {
      body: adJobs
    } = await client.asInternalUser.ml.getJobs();
    const {
      body: dfaJobs
    } = await client.asInternalUser.ml.getDataFrameAnalytics();
    return adJobs.count > 0 || dfaJobs.count > 0;
  }

  return {
    initializeJobs
  };
}