"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trainedModelsRoutes = trainedModelsRoutes;

var _error_wrapper = require("../client/error_wrapper");

var _inference_schema = require("./schemas/inference_schema");

var _data_frame_analytics = require("../models/data_frame_analytics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function trainedModelsRoutes({
  router,
  routeGuard
}) {
  /**
   * @apiGroup TrainedModels
   *
   * @api {get} /api/ml/trained_models/:modelId Get info of a trained inference model
   * @apiName GetTrainedModel
   * @apiDescription Retrieves configuration information for a trained model.
   */
  router.get({
    path: '/api/ml/trained_models/{modelId?}',
    validate: {
      params: _inference_schema.optionalModelIdSchema,
      query: _inference_schema.getInferenceQuerySchema
    },
    options: {
      tags: ['access:ml:canGetDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        modelId
      } = request.params;
      const {
        with_pipelines: withPipelines,
        ...query
      } = request.query;
      const {
        body
      } = await mlClient.getTrainedModels({
        size: 1000,
        ...query,
        ...(modelId ? {
          model_id: modelId
        } : {})
      });
      const result = body.trained_model_configs;

      try {
        if (withPipelines) {
          const pipelinesResponse = await (0, _data_frame_analytics.modelsProvider)(client).getModelsPipelines(result.map(({
            model_id: id
          }) => id));

          for (const model of result) {
            model.pipelines = pipelinesResponse.get(model.model_id);
          }
        }
      } catch (e) {
        // the user might not have required permissions to fetch pipelines
        // eslint-disable-next-line no-console
        console.log(e);
      }

      return response.ok({
        body: result
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup TrainedModels
   *
   * @api {get} /api/ml/trained_models/:modelId/_stats Get stats of a trained model
   * @apiName GetTrainedModelStats
   * @apiDescription Retrieves usage information for trained models.
   */

  router.get({
    path: '/api/ml/trained_models/{modelId}/_stats',
    validate: {
      params: _inference_schema.modelIdSchema
    },
    options: {
      tags: ['access:ml:canGetDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        modelId
      } = request.params;
      const {
        body
      } = await mlClient.getTrainedModelsStats({ ...(modelId ? {
          model_id: modelId
        } : {})
      });
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup TrainedModels
   *
   * @api {get} /api/ml/trained_models/:modelId/pipelines Get trained model pipelines
   * @apiName GetTrainedModelPipelines
   * @apiDescription Retrieves pipelines associated with a trained model
   */

  router.get({
    path: '/api/ml/trained_models/{modelId}/pipelines',
    validate: {
      params: _inference_schema.modelIdSchema
    },
    options: {
      tags: ['access:ml:canGetDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response
  }) => {
    try {
      const {
        modelId
      } = request.params;
      const result = await (0, _data_frame_analytics.modelsProvider)(client).getModelsPipelines(modelId.split(','));
      return response.ok({
        body: [...result].map(([id, pipelines]) => ({
          model_id: id,
          pipelines
        }))
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup TrainedModels
   *
   * @api {delete} /api/ml/trained_models/:modelId Delete a trained model
   * @apiName DeleteTrainedModel
   * @apiDescription Deletes an existing trained model that is currently not referenced by an ingest pipeline.
   */

  router.delete({
    path: '/api/ml/trained_models/{modelId}',
    validate: {
      params: _inference_schema.modelIdSchema
    },
    options: {
      tags: ['access:ml:canDeleteDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        modelId
      } = request.params;
      const {
        body
      } = await mlClient.deleteTrainedModel({
        model_id: modelId
      });
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}