"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDeleteCasesApi = initDeleteCasesApi;

var _configSchema = require("@kbn/config-schema");

var _helpers = require("../../../services/user_actions/helpers");

var _utils = require("../utils");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initDeleteCasesApi({
  caseService,
  router,
  userActionService,
  logger
}) {
  router.delete({
    path: _constants.CASES_URL,
    validate: {
      query: _configSchema.schema.object({
        ids: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    try {
      const client = context.core.savedObjects.client;
      await Promise.all(request.query.ids.map(id => caseService.deleteCase({
        client,
        id
      })));
      const comments = await Promise.all(request.query.ids.map(id => caseService.getAllCaseComments({
        client,
        id
      })));

      if (comments.some(c => c.saved_objects.length > 0)) {
        await Promise.all(comments.map(c => Promise.all(c.saved_objects.map(({
          id
        }) => caseService.deleteComment({
          client,
          commentId: id
        })))));
      } // eslint-disable-next-line @typescript-eslint/naming-convention


      const {
        username,
        full_name,
        email
      } = await caseService.getUser({
        request
      });
      const deleteDate = new Date().toISOString();
      await userActionService.postUserActions({
        client,
        actions: request.query.ids.map(id => (0, _helpers.buildCaseUserActionItem)({
          action: 'create',
          actionAt: deleteDate,
          actionBy: {
            username,
            full_name,
            email
          },
          caseId: id,
          fields: ['comment', 'description', 'status', 'tags', 'title', 'sub_case']
        }))
      });
      return response.noContent();
    } catch (error) {
      logger.error(`Failed to delete cases in route ids: ${JSON.stringify(request.query.ids)}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}