"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataFrameAnalyticsRoutes = dataFrameAnalyticsRoutes;

var _error_wrapper = require("../client/error_wrapper");

var _analytics_audit_messages = require("../models/data_frame_analytics/analytics_audit_messages");

var _data_frame_analytics = require("../../common/constants/data_frame_analytics");

var _data_analytics_schema = require("./schemas/data_analytics_schema");

var _index_patterns = require("../models/data_frame_analytics/index_patterns");

var _analytics_manager = require("../models/data_frame_analytics/analytics_manager");

var _request_authorization = require("../lib/request_authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getIndexPatternId(context, patternName) {
  const iph = new _index_patterns.IndexPatternHandler(context.core.savedObjects.client);
  return iph.getIndexPatternId(patternName);
}

function deleteDestIndexPatternById(context, indexPatternId) {
  const iph = new _index_patterns.IndexPatternHandler(context.core.savedObjects.client);
  return iph.deleteIndexPatternById(indexPatternId);
}

function getAnalyticsMap(mlClient, client, idOptions) {
  const analytics = new _analytics_manager.AnalyticsManager(mlClient, client);
  return analytics.getAnalyticsMap(idOptions);
}

function getExtendedMap(mlClient, client, idOptions) {
  const analytics = new _analytics_manager.AnalyticsManager(mlClient, client);
  return analytics.extendAnalyticsMapForAnalyticsJob(idOptions);
}
/**
 * Routes for the data frame analytics
 */


function dataFrameAnalyticsRoutes({
  router,
  mlLicense,
  routeGuard
}) {
  async function userCanDeleteIndex(client, destinationIndex) {
    if (!mlLicense.isSecurityEnabled()) {
      return true;
    }

    const {
      body
    } = await client.asCurrentUser.security.hasPrivileges({
      body: {
        index: [{
          names: [destinationIndex],
          // uses wildcard
          privileges: ['delete_index']
        }]
      }
    });
    return (body === null || body === void 0 ? void 0 : body.has_all_requested) === true;
  }
  /**
   * @apiGroup DataFrameAnalytics
   *
   * @api {get} /api/ml/data_frame/analytics Get analytics data
   * @apiName GetDataFrameAnalytics
   * @apiDescription Returns the list of data frame analytics jobs.
   *
   * @apiSuccess {Number} count
   * @apiSuccess {Object[]} data_frame_analytics
   */


  router.get({
    path: '/api/ml/data_frame/analytics',
    validate: false,
    options: {
      tags: ['access:ml:canGetDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    response
  }) => {
    try {
      const {
        body
      } = await mlClient.getDataFrameAnalytics({
        size: 1000
      });
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup DataFrameAnalytics
   *
   * @api {get} /api/ml/data_frame/analytics/:analyticsId Get analytics data by id
   * @apiName GetDataFrameAnalyticsById
   * @apiDescription Returns the data frame analytics job.
   *
   * @apiSchema (params) analyticsIdSchema
   */

  router.get({
    path: '/api/ml/data_frame/analytics/{analyticsId}',
    validate: {
      params: _data_analytics_schema.analyticsIdSchema,
      query: _data_analytics_schema.analyticsQuerySchema
    },
    options: {
      tags: ['access:ml:canGetDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        analyticsId
      } = request.params;
      const {
        excludeGenerated
      } = request.query;
      const {
        body
      } = await mlClient.getDataFrameAnalytics({
        id: analyticsId,
        ...(excludeGenerated ? {
          exclude_generated: true
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
   * @apiGroup DataFrameAnalytics
   *
   * @api {get} /api/ml/data_frame/analytics/_stats Get analytics stats
   * @apiName GetDataFrameAnalyticsStats
   * @apiDescription Returns data frame analytics jobs statistics.
   */

  router.get({
    path: '/api/ml/data_frame/analytics/_stats',
    validate: false,
    options: {
      tags: ['access:ml:canGetDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    response
  }) => {
    try {
      const {
        body
      } = await mlClient.getDataFrameAnalyticsStats({
        size: 1000
      });
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup DataFrameAnalytics
   *
   * @api {get} /api/ml/data_frame/analytics/:analyticsId/_stats Get stats for requested analytics job
   * @apiName GetDataFrameAnalyticsStatsById
   * @apiDescription Returns data frame analytics job statistics.
   *
   * @apiSchema (params) analyticsIdSchema
   */

  router.get({
    path: '/api/ml/data_frame/analytics/{analyticsId}/_stats',
    validate: {
      params: _data_analytics_schema.analyticsIdSchema
    },
    options: {
      tags: ['access:ml:canGetDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        analyticsId
      } = request.params;
      const {
        body
      } = await mlClient.getDataFrameAnalyticsStats({
        id: analyticsId
      });
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup DataFrameAnalytics
   *
   * @api {put} /api/ml/data_frame/analytics/:analyticsId Instantiate a data frame analytics job
   * @apiName UpdateDataFrameAnalytics
   * @apiDescription This API creates a data frame analytics job that performs an analysis
   *                 on the source index and stores the outcome in a destination index.
   *
   * @apiSchema (params) analyticsIdSchema
   * @apiSchema (body) dataAnalyticsJobConfigSchema
   */

  router.put({
    path: '/api/ml/data_frame/analytics/{analyticsId}',
    validate: {
      params: _data_analytics_schema.analyticsIdSchema,
      body: _data_analytics_schema.dataAnalyticsJobConfigSchema
    },
    options: {
      tags: ['access:ml:canCreateDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        analyticsId
      } = request.params;
      const {
        body
      } = await mlClient.putDataFrameAnalytics({
        id: analyticsId,
        body: request.body
      }, (0, _request_authorization.getAuthorizationHeader)(request));
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup DataFrameAnalytics
   *
   * @api {post} /api/ml/data_frame/_evaluate Evaluate the data frame analytics for an annotated index
   * @apiName EvaluateDataFrameAnalytics
   * @apiDescription Evaluates the data frame analytics for an annotated index.
   *
   * @apiSchema (body) dataAnalyticsEvaluateSchema
   */

  router.post({
    path: '/api/ml/data_frame/_evaluate',
    validate: {
      body: _data_analytics_schema.dataAnalyticsEvaluateSchema
    },
    options: {
      tags: ['access:ml:canGetDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        body
      } = await mlClient.evaluateDataFrame({
        body: request.body
      }, (0, _request_authorization.getAuthorizationHeader)(request));
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup DataFrameAnalytics
   *
   * @api {post} /api/ml/data_frame/_explain Explain a data frame analytics config
   * @apiName ExplainDataFrameAnalytics
   * @apiDescription This API provides explanations for a data frame analytics config
   *                 that either exists already or one that has not been created yet.
   *
   * @apiSchema (body) dataAnalyticsExplainSchema
   */

  router.post({
    path: '/api/ml/data_frame/analytics/_explain',
    validate: {
      body: _data_analytics_schema.dataAnalyticsExplainSchema
    },
    options: {
      tags: ['access:ml:canCreateDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        body
      } = await mlClient.explainDataFrameAnalytics({
        body: request.body
      }, (0, _request_authorization.getAuthorizationHeader)(request));
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup DataFrameAnalytics
   *
   * @api {delete} /api/ml/data_frame/analytics/:analyticsId Delete specified analytics job
   * @apiName DeleteDataFrameAnalytics
   * @apiDescription Deletes specified data frame analytics job.
   *
   * @apiSchema (params) analyticsIdSchema
   */

  router.delete({
    path: '/api/ml/data_frame/analytics/{analyticsId}',
    validate: {
      params: _data_analytics_schema.analyticsIdSchema,
      query: _data_analytics_schema.deleteDataFrameAnalyticsJobSchema
    },
    options: {
      tags: ['access:ml:canDeleteDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    client,
    request,
    response,
    context
  }) => {
    try {
      const {
        analyticsId
      } = request.params;
      const {
        deleteDestIndex,
        deleteDestIndexPattern
      } = request.query;
      let destinationIndex;
      const analyticsJobDeleted = {
        success: false
      };
      const destIndexDeleted = {
        success: false
      };
      const destIndexPatternDeleted = {
        success: false
      };

      try {
        // Check if analyticsId is valid and get destination index
        const {
          body
        } = await mlClient.getDataFrameAnalytics({
          id: analyticsId
        });

        if (Array.isArray(body.data_frame_analytics) && body.data_frame_analytics.length > 0) {
          destinationIndex = body.data_frame_analytics[0].dest.index;
        }
      } catch (e) {
        // exist early if the job doesn't exist
        return response.customError((0, _error_wrapper.wrapError)(e));
      }

      if (deleteDestIndex || deleteDestIndexPattern) {
        // If user checks box to delete the destinationIndex associated with the job
        if (destinationIndex && deleteDestIndex) {
          // Verify if user has privilege to delete the destination index
          const userCanDeleteDestIndex = await userCanDeleteIndex(client, destinationIndex); // If user does have privilege to delete the index, then delete the index

          if (userCanDeleteDestIndex) {
            try {
              await client.asCurrentUser.indices.delete({
                index: destinationIndex
              });
              destIndexDeleted.success = true;
            } catch ({
              body
            }) {
              destIndexDeleted.error = body;
            }
          } else {
            return response.forbidden();
          }
        } // Delete the index pattern if there's an index pattern that matches the name of dest index


        if (destinationIndex && deleteDestIndexPattern) {
          try {
            const indexPatternId = await getIndexPatternId(context, destinationIndex);

            if (indexPatternId) {
              await deleteDestIndexPatternById(context, indexPatternId);
            }

            destIndexPatternDeleted.success = true;
          } catch (deleteDestIndexPatternError) {
            destIndexPatternDeleted.error = deleteDestIndexPatternError;
          }
        }
      } // Grab the target index from the data frame analytics job id
      // Delete the data frame analytics


      try {
        await mlClient.deleteDataFrameAnalytics({
          id: analyticsId
        });
        analyticsJobDeleted.success = true;
      } catch ({
        body
      }) {
        analyticsJobDeleted.error = body;
      }

      const results = {
        analyticsJobDeleted,
        destIndexDeleted,
        destIndexPatternDeleted
      };
      return response.ok({
        body: results
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup DataFrameAnalytics
   *
   * @api {post} /api/ml/data_frame/analytics/:analyticsId/_start Start specified analytics job
   * @apiName StartDataFrameAnalyticsJob
   * @apiDescription Starts a data frame analytics job.
   *
   * @apiSchema (params) analyticsIdSchema
   */

  router.post({
    path: '/api/ml/data_frame/analytics/{analyticsId}/_start',
    validate: {
      params: _data_analytics_schema.analyticsIdSchema
    },
    options: {
      tags: ['access:ml:canStartStopDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        analyticsId
      } = request.params;
      const {
        body
      } = await mlClient.startDataFrameAnalytics({
        id: analyticsId
      });
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup DataFrameAnalytics
   *
   * @api {post} /api/ml/data_frame/analytics/:analyticsId/_stop Stop specified analytics job
   * @apiName StopsDataFrameAnalyticsJob
   * @apiDescription Stops a data frame analytics job.
   *
   * @apiSchema (params) analyticsIdSchema
   * @apiSchema (query) stopsDataFrameAnalyticsJobQuerySchema
   */

  router.post({
    path: '/api/ml/data_frame/analytics/{analyticsId}/_stop',
    validate: {
      params: _data_analytics_schema.analyticsIdSchema,
      query: _data_analytics_schema.stopsDataFrameAnalyticsJobQuerySchema
    },
    options: {
      tags: ['access:ml:canStartStopDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        body
      } = await mlClient.stopDataFrameAnalytics({
        id: request.params.analyticsId,
        force: request.query.force
      });
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup DataFrameAnalytics
   *
   * @api {post} /api/ml/data_frame/analytics/:analyticsId/_update Update specified analytics job
   * @apiName UpdateDataFrameAnalyticsJob
   * @apiDescription Updates a data frame analytics job.
   *
   * @apiSchema (params) analyticsIdSchema
   */

  router.post({
    path: '/api/ml/data_frame/analytics/{analyticsId}/_update',
    validate: {
      params: _data_analytics_schema.analyticsIdSchema,
      body: _data_analytics_schema.dataAnalyticsJobUpdateSchema
    },
    options: {
      tags: ['access:ml:canCreateDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        analyticsId
      } = request.params;
      const {
        body
      } = await mlClient.updateDataFrameAnalytics({
        id: analyticsId,
        body: request.body
      }, (0, _request_authorization.getAuthorizationHeader)(request));
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup DataFrameAnalytics
   *
   * @api {get} /api/ml/data_frame/analytics/:analyticsId/messages Get analytics job messages
   * @apiName GetDataFrameAnalyticsMessages
   * @apiDescription Returns the list of audit messages for data frame analytics jobs.
   *
   * @apiSchema (params) analyticsIdSchema
   */

  router.get({
    path: '/api/ml/data_frame/analytics/{analyticsId}/messages',
    validate: {
      params: _data_analytics_schema.analyticsIdSchema
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
        analyticsId
      } = request.params;
      const {
        getAnalyticsAuditMessages
      } = (0, _analytics_audit_messages.analyticsAuditMessagesProvider)(client);
      const results = await getAnalyticsAuditMessages(analyticsId);
      return response.ok({
        body: results
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup DataFrameAnalytics
   *
   * @api {post} /api/ml/data_frame/analytics/job_exists Check whether jobs exists in current or any space
   * @apiName JobExists
   * @apiDescription Checks if each of the jobs in the specified list of IDs exist.
   *                 If allSpaces is true, the check will look across all spaces.
   *
   * @apiSchema (params) analyticsIdSchema
   */

  router.post({
    path: '/api/ml/data_frame/analytics/jobs_exist',
    validate: {
      body: _data_analytics_schema.jobsExistSchema
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
        analyticsIds,
        allSpaces
      } = request.body;
      const results = {};

      for (const id of analyticsIds) {
        try {
          const {
            body
          } = allSpaces ? await client.asInternalUser.ml.getDataFrameAnalytics({
            id
          }) : await mlClient.getDataFrameAnalytics({
            id
          });
          results[id] = body.data_frame_analytics.length > 0;
        } catch (error) {
          if (error.statusCode !== 404) {
            throw error;
          }

          results[id] = false;
        }
      }

      return response.ok({
        body: {
          results
        }
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup DataFrameAnalytics
   *
   * @api {get} /api/ml/data_frame/analytics/map/:analyticsId Get objects leading up to analytics job
   * @apiName GetDataFrameAnalyticsIdMap
   * @apiDescription Returns map of objects leading up to analytics job.
   *
   * @apiParam {String} analyticsId Analytics ID.
   */

  router.get({
    path: '/api/ml/data_frame/analytics/map/{analyticsId}',
    validate: {
      params: _data_analytics_schema.analyticsIdSchema,
      query: _data_analytics_schema.analyticsMapQuerySchema
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    client,
    request,
    response
  }) => {
    try {
      var _request$query, _request$query2;

      const {
        analyticsId
      } = request.params;
      const treatAsRoot = (_request$query = request.query) === null || _request$query === void 0 ? void 0 : _request$query.treatAsRoot;
      const type = (_request$query2 = request.query) === null || _request$query2 === void 0 ? void 0 : _request$query2.type;
      let results;

      if (treatAsRoot === 'true' || treatAsRoot === true) {
        results = await getExtendedMap(mlClient, client, {
          analyticsId: type !== _data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX ? analyticsId : undefined,
          index: type === _data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX ? analyticsId : undefined
        });
      } else {
        results = await getAnalyticsMap(mlClient, client, {
          analyticsId: type !== _data_frame_analytics.JOB_MAP_NODE_TYPES.TRAINED_MODEL ? analyticsId : undefined,
          modelId: type === _data_frame_analytics.JOB_MAP_NODE_TYPES.TRAINED_MODEL ? analyticsId : undefined
        });
      }

      return response.ok({
        body: results
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}