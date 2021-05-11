"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJobFnFactory = void 0;

var _boom = require("@hapi/boom");

var _lodash = require("lodash");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createJobFnFactory = function createJobFactoryFn(reporting, parentLogger) {
  const logger = parentLogger.clone([_constants.CSV_FROM_SAVEDOBJECT_JOB_TYPE, 'create-job']);
  return async function createJob(jobParams, context, req) {
    const {
      savedObjectType,
      savedObjectId
    } = jobParams;
    const panel = await Promise.resolve().then(() => context.core.savedObjects.client.get(savedObjectType, savedObjectId)).then(async savedObject => {
      const {
        attributes,
        references
      } = savedObject;
      const {
        kibanaSavedObjectMeta: kibanaSavedObjectMetaJSON
      } = attributes;
      const {
        timerange
      } = req.body;

      if (!kibanaSavedObjectMetaJSON) {
        throw new Error('Could not parse saved object data!');
      }

      const kibanaSavedObjectMeta = { ...kibanaSavedObjectMetaJSON,
        searchSource: JSON.parse(kibanaSavedObjectMetaJSON.searchSourceJSON)
      };
      const {
        visState: visStateJSON
      } = attributes;

      if (visStateJSON) {
        throw (0, _boom.notImplemented)('Visualization types are not yet implemented');
      } // saved search type


      const {
        searchSource
      } = kibanaSavedObjectMeta;

      if (!searchSource || !references) {
        throw new Error('The saved search object is missing configuration fields!');
      }

      const indexPatternMeta = references.find(ref => ref.type === 'index-pattern');

      if (!indexPatternMeta) {
        throw new Error('Could not find index pattern for the saved search!');
      }

      return {
        attributes: { ...attributes,
          kibanaSavedObjectMeta: {
            searchSource
          }
        },
        indexPatternSavedObjectId: indexPatternMeta.id,
        timerange
      };
    }).catch(err => {
      const boomErr = err;

      if (boomErr.isBoom) {
        throw err;
      }

      const errPayload = (0, _lodash.get)(err, 'output.payload', {
        statusCode: 0
      });

      if (errPayload.statusCode === 404) {
        throw (0, _boom.notFound)(errPayload.message);
      }

      logger.error(err);
      throw new Error(`Unable to create a job from saved object data! Error: ${err}`);
    });
    return { ...jobParams,
      panel
    };
  };
};

exports.createJobFnFactory = createJobFnFactory;