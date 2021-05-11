"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modelsProvider = modelsProvider;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function modelsProvider(client) {
  return {
    /**
     * Retrieves the map of model ids and associated pipelines.
     * @param modelIds
     */
    async getModelsPipelines(modelIds) {
      const modelIdsMap = new Map(modelIds.map(id => [id, null]));
      const {
        body
      } = await client.asCurrentUser.ingest.getPipeline();

      for (const [pipelineName, pipelineDefinition] of Object.entries(body)) {
        const {
          processors
        } = pipelineDefinition;

        for (const processor of processors) {
          var _processor$inference;

          const id = (_processor$inference = processor.inference) === null || _processor$inference === void 0 ? void 0 : _processor$inference.model_id;

          if (modelIdsMap.has(id)) {
            const obj = modelIdsMap.get(id);

            if (obj === null) {
              modelIdsMap.set(id, {
                [pipelineName]: pipelineDefinition
              });
            } else {
              obj[pipelineName] = pipelineDefinition;
            }
          }
        }
      }

      return modelIdsMap;
    }

  };
}