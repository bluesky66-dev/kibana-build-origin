"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTransformsRoutes = registerTransformsRoutes;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");

var _common = require("../../../common/api_schemas/common");

var _delete_transforms = require("../../../common/api_schemas/delete_transforms");

var _start_transforms = require("../../../common/api_schemas/start_transforms");

var _stop_transforms = require("../../../common/api_schemas/stop_transforms");

var _update_transforms = require("../../../common/api_schemas/update_transforms");

var _transforms = require("../../../common/api_schemas/transforms");

var _index = require("../index");

var _error_utils = require("./error_utils");

var _transforms_audit_messages = require("./transforms_audit_messages");

var _transforms_nodes = require("./transforms_nodes");

var _transform = require("../../../common/types/transform");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


var TRANSFORM_ACTIONS;

(function (TRANSFORM_ACTIONS) {
  TRANSFORM_ACTIONS["STOP"] = "stop";
  TRANSFORM_ACTIONS["START"] = "start";
  TRANSFORM_ACTIONS["DELETE"] = "delete";
})(TRANSFORM_ACTIONS || (TRANSFORM_ACTIONS = {}));

function registerTransformsRoutes(routeDependencies) {
  const {
    router,
    license
  } = routeDependencies;
  /**
   * @apiGroup Transforms
   *
   * @api {get} /api/transform/transforms Get transforms
   * @apiName GetTransforms
   * @apiDescription Returns transforms
   *
   * @apiSchema (params) jobAuditMessagesJobIdSchema
   * @apiSchema (query) jobAuditMessagesQuerySchema
   */

  router.get({
    path: (0, _index.addBasePath)('transforms'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    try {
      const {
        body
      } = await ctx.core.elasticsearch.client.asCurrentUser.transform.getTransform({
        size: 1000,
        ...req.params
      });
      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));
  /**
   * @apiGroup Transforms
   *
   * @api {get} /api/transform/transforms/:transformId Get transform
   * @apiName GetTransform
   * @apiDescription Returns a single transform
   *
   * @apiSchema (params) transformIdParamSchema
   */

  router.get({
    path: (0, _index.addBasePath)('transforms/{transformId}'),
    validate: {
      params: _common.transformIdParamSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      transformId
    } = req.params;

    try {
      const {
        body
      } = await ctx.core.elasticsearch.client.asCurrentUser.transform.getTransform({
        transform_id: transformId
      });
      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));
  /**
   * @apiGroup Transforms
   *
   * @api {get} /api/transform/transforms/_stats Get transforms stats
   * @apiName GetTransformsStats
   * @apiDescription Returns transforms stats
   */

  router.get({
    path: (0, _index.addBasePath)('transforms/_stats'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    try {
      const {
        body
      } = await ctx.core.elasticsearch.client.asCurrentUser.transform.getTransformStats({
        size: 1000,
        transform_id: '_all'
      });
      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));
  /**
   * @apiGroup Transforms
   *
   * @api {get} /api/transform/transforms/:transformId/_stats Get transform stats
   * @apiName GetTransformStats
   * @apiDescription Returns stats for a single transform
   *
   * @apiSchema (params) transformIdParamSchema
   */

  router.get({
    path: (0, _index.addBasePath)('transforms/{transformId}/_stats'),
    validate: {
      params: _common.transformIdParamSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      transformId
    } = req.params;

    try {
      const {
        body
      } = await ctx.core.elasticsearch.client.asCurrentUser.transform.getTransformStats({
        transform_id: transformId
      });
      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));
  /**
   * @apiGroup Transforms
   *
   * @api {put} /api/transform/transforms/:transformId Put transform
   * @apiName PutTransform
   * @apiDescription Creates a transform
   *
   * @apiSchema (params) transformIdParamSchema
   * @apiSchema (body) putTransformsRequestSchema
   */

  router.put({
    path: (0, _index.addBasePath)('transforms/{transformId}'),
    validate: {
      params: _common.transformIdParamSchema,
      body: _transforms.putTransformsRequestSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      transformId
    } = req.params;
    const response = {
      transformsCreated: [],
      errors: []
    };
    await ctx.core.elasticsearch.client.asCurrentUser.transform.putTransform({
      body: req.body,
      transform_id: transformId
    }).then(() => {
      response.transformsCreated.push({
        transform: transformId
      });
    }).catch(e => response.errors.push({
      id: transformId,
      error: (0, _error_utils.wrapEsError)(e)
    }));
    return res.ok({
      body: response
    });
  }));
  /**
   * @apiGroup Transforms
   *
   * @api {post} /api/transform/transforms/:transformId/_update Post transform update
   * @apiName PostTransformUpdate
   * @apiDescription Updates a transform
   *
   * @apiSchema (params) transformIdParamSchema
   * @apiSchema (body) postTransformsUpdateRequestSchema
   */

  router.post({
    path: (0, _index.addBasePath)('transforms/{transformId}/_update'),
    validate: {
      params: _common.transformIdParamSchema,
      body: _update_transforms.postTransformsUpdateRequestSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      transformId
    } = req.params;

    try {
      const {
        body
      } = await ctx.core.elasticsearch.client.asCurrentUser.transform.updateTransform({
        body: req.body,
        transform_id: transformId
      });
      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)(e));
    }
  }));
  /**
   * @apiGroup Transforms
   *
   * @api {post} /api/transform/delete_transforms Post delete transforms
   * @apiName DeleteTransforms
   * @apiDescription Deletes transforms
   *
   * @apiSchema (body) deleteTransformsRequestSchema
   */

  router.post({
    path: (0, _index.addBasePath)('delete_transforms'),
    validate: {
      body: _delete_transforms.deleteTransformsRequestSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    try {
      const body = await deleteTransforms(req.body, ctx, res);

      if (body && body.status) {
        if (body.status === 404) {
          return res.notFound();
        }

        if (body.status === 403) {
          return res.forbidden();
        }
      }

      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));
  /**
   * @apiGroup Transforms
   *
   * @api {post} /api/transform/transforms/_preview Preview transform
   * @apiName PreviewTransform
   * @apiDescription Previews transform
   *
   * @apiSchema (body) postTransformsPreviewRequestSchema
   */

  router.post({
    path: (0, _index.addBasePath)('transforms/_preview'),
    validate: {
      body: _transforms.postTransformsPreviewRequestSchema
    }
  }, license.guardApiRoute(previewTransformHandler));
  /**
   * @apiGroup Transforms
   *
   * @api {post} /api/transform/start_transforms Start transforms
   * @apiName PostStartTransforms
   * @apiDescription Starts transform
   *
   * @apiSchema (body) startTransformsRequestSchema
   */

  router.post({
    path: (0, _index.addBasePath)('start_transforms'),
    validate: {
      body: _start_transforms.startTransformsRequestSchema
    }
  }, license.guardApiRoute(startTransformsHandler));
  /**
   * @apiGroup Transforms
   *
   * @api {post} /api/transform/stop_transforms Stop transforms
   * @apiName PostStopTransforms
   * @apiDescription Stops transform
   *
   * @apiSchema (body) stopTransformsRequestSchema
   */

  router.post({
    path: (0, _index.addBasePath)('stop_transforms'),
    validate: {
      body: _stop_transforms.stopTransformsRequestSchema
    }
  }, license.guardApiRoute(stopTransformsHandler));
  /**
   * @apiGroup Transforms
   *
   * @api {post} /api/transform/es_search Transform ES Search Proxy
   * @apiName PostTransformEsSearchProxy
   * @apiDescription ES Search Proxy
   *
   * @apiSchema (body) any
   */

  router.post({
    path: (0, _index.addBasePath)('es_search'),
    validate: {
      body: _configSchema.schema.maybe(_configSchema.schema.any())
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    try {
      const {
        body
      } = await ctx.core.elasticsearch.client.asCurrentUser.search(req.body);
      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));
  (0, _transforms_audit_messages.registerTransformsAuditMessagesRoutes)(routeDependencies);
  (0, _transforms_nodes.registerTransformNodesRoutes)(routeDependencies);
}

async function getIndexPatternId(indexName, savedObjectsClient) {
  const response = await savedObjectsClient.find({
    type: 'index-pattern',
    perPage: 1,
    search: `"${indexName}"`,
    searchFields: ['title'],
    fields: ['title']
  });
  const ip = response.saved_objects.find(obj => obj.attributes.title === indexName);
  return ip === null || ip === void 0 ? void 0 : ip.id;
}

async function deleteDestIndexPatternById(indexPatternId, savedObjectsClient) {
  return await savedObjectsClient.delete('index-pattern', indexPatternId);
}

async function deleteTransforms(reqBody, ctx, response) {
  const {
    transformsInfo
  } = reqBody; // Cast possible undefineds as booleans

  const deleteDestIndex = !!reqBody.deleteDestIndex;
  const deleteDestIndexPattern = !!reqBody.deleteDestIndexPattern;
  const shouldForceDelete = !!reqBody.forceDelete;
  const results = {};

  for (const transformInfo of transformsInfo) {
    let destinationIndex;
    const transformDeleted = {
      success: false
    };
    const destIndexDeleted = {
      success: false
    };
    const destIndexPatternDeleted = {
      success: false
    };
    const transformId = transformInfo.id; // force delete only if the transform has failed

    let needToForceDelete = false;

    try {
      if (transformInfo.state === _constants.TRANSFORM_STATE.FAILED) {
        needToForceDelete = true;
      } // Grab destination index info to delete


      try {
        const {
          body
        } = await ctx.core.elasticsearch.client.asCurrentUser.transform.getTransform({
          transform_id: transformId
        });
        const transformConfig = body.transforms[0];
        destinationIndex = Array.isArray(transformConfig.dest.index) ? transformConfig.dest.index[0] : transformConfig.dest.index;
      } catch (getTransformConfigError) {
        transformDeleted.error = getTransformConfigError.meta.body.error;
        results[transformId] = {
          transformDeleted,
          destIndexDeleted,
          destIndexPatternDeleted,
          destinationIndex
        }; // No need to perform further delete attempts

        continue;
      } // If user checks box to delete the destinationIndex associated with the job


      if (destinationIndex && deleteDestIndex) {
        try {
          // If user does have privilege to delete the index, then delete the index
          // if no permission then return 403 forbidden
          await ctx.core.elasticsearch.client.asCurrentUser.indices.delete({
            index: destinationIndex
          });
          destIndexDeleted.success = true;
        } catch (deleteIndexError) {
          destIndexDeleted.error = deleteIndexError.meta.body.error;
        }
      } // Delete the index pattern if there's an index pattern that matches the name of dest index


      if (destinationIndex && deleteDestIndexPattern) {
        try {
          const indexPatternId = await getIndexPatternId(destinationIndex, ctx.core.savedObjects.client);

          if (indexPatternId) {
            await deleteDestIndexPatternById(indexPatternId, ctx.core.savedObjects.client);
            destIndexPatternDeleted.success = true;
          }
        } catch (deleteDestIndexPatternError) {
          destIndexPatternDeleted.error = deleteDestIndexPatternError.meta.body.error;
        }
      }

      try {
        await ctx.core.elasticsearch.client.asCurrentUser.transform.deleteTransform({
          transform_id: transformId,
          force: shouldForceDelete && needToForceDelete
        });
        transformDeleted.success = true;
      } catch (deleteTransformJobError) {
        transformDeleted.error = deleteTransformJobError.meta.body.error;

        if (deleteTransformJobError.statusCode === 403) {
          return response.forbidden();
        }
      }

      results[transformId] = {
        transformDeleted,
        destIndexDeleted,
        destIndexPatternDeleted,
        destinationIndex
      };
    } catch (e) {
      if ((0, _error_utils.isRequestTimeout)(e)) {
        return (0, _error_utils.fillResultsWithTimeouts)({
          results,
          id: transformInfo.id,
          items: transformsInfo,
          action: TRANSFORM_ACTIONS.DELETE
        });
      }

      results[transformId] = {
        transformDeleted: {
          success: false,
          error: e.meta.body.error
        }
      };
    }
  }

  return results;
}

const previewTransformHandler = async (ctx, req, res) => {
  try {
    const reqBody = req.body;
    const {
      body
    } = await ctx.core.elasticsearch.client.asCurrentUser.transform.previewTransform({
      body: reqBody
    });

    if ((0, _transform.isLatestTransform)(reqBody)) {
      // for the latest transform mappings properties have to be retrieved from the source
      const fieldCapsResponse = await ctx.core.elasticsearch.client.asCurrentUser.fieldCaps({
        index: reqBody.source.index,
        fields: '*',
        include_unmapped: false
      });
      const fieldNamesSet = new Set(Object.keys(fieldCapsResponse.body.fields));
      const fields = Object.entries(fieldCapsResponse.body.fields).reduce((acc, [fieldName, fieldCaps]) => {
        const fieldDefinition = Object.values(fieldCaps)[0];
        const isMetaField = fieldDefinition.type.startsWith('_') || fieldName === '_doc_count';
        const isKeywordDuplicate = fieldName.endsWith('.keyword') && fieldNamesSet.has(fieldName.split('.keyword')[0]);

        if (isMetaField || isKeywordDuplicate) {
          return acc;
        }

        acc[fieldName] = { ...fieldDefinition
        };
        return acc;
      }, {});
      body.generated_dest_index.mappings.properties = fields;
    }

    return res.ok({
      body
    });
  } catch (e) {
    return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
  }
};

const startTransformsHandler = async (ctx, req, res) => {
  const transformsInfo = req.body;

  try {
    const body = await startTransforms(transformsInfo, ctx.core.elasticsearch.client.asCurrentUser);
    return res.ok({
      body
    });
  } catch (e) {
    return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
  }
};

async function startTransforms(transformsInfo, esClient) {
  const results = {};

  for (const transformInfo of transformsInfo) {
    const transformId = transformInfo.id;

    try {
      await esClient.transform.startTransform({
        transform_id: transformId
      });
      results[transformId] = {
        success: true
      };
    } catch (e) {
      if ((0, _error_utils.isRequestTimeout)(e)) {
        return (0, _error_utils.fillResultsWithTimeouts)({
          results,
          id: transformId,
          items: transformsInfo,
          action: TRANSFORM_ACTIONS.START
        });
      }

      results[transformId] = {
        success: false,
        error: e.meta.body.error
      };
    }
  }

  return results;
}

const stopTransformsHandler = async (ctx, req, res) => {
  const transformsInfo = req.body;

  try {
    return res.ok({
      body: await stopTransforms(transformsInfo, ctx.core.elasticsearch.client.asCurrentUser)
    });
  } catch (e) {
    return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
  }
};

async function stopTransforms(transformsInfo, esClient) {
  const results = {};

  for (const transformInfo of transformsInfo) {
    const transformId = transformInfo.id;

    try {
      await esClient.transform.stopTransform({
        transform_id: transformId,
        force: transformInfo.state !== undefined ? transformInfo.state === _constants.TRANSFORM_STATE.FAILED : false,
        wait_for_completion: true
      });
      results[transformId] = {
        success: true
      };
    } catch (e) {
      if ((0, _error_utils.isRequestTimeout)(e)) {
        return (0, _error_utils.fillResultsWithTimeouts)({
          results,
          id: transformId,
          items: transformsInfo,
          action: TRANSFORM_ACTIONS.STOP
        });
      }

      results[transformId] = {
        success: false,
        error: e.meta.body.error
      };
    }
  }

  return results;
}