"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetTagsApi = initGetTagsApi;

var _utils = require("../../utils");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetTagsApi({
  caseService,
  router
}) {
  router.get({
    path: _constants.CASE_TAGS_URL,
    validate: {}
  }, async (context, request, response) => {
    try {
      const client = context.core.savedObjects.client;
      const tags = await caseService.getTags({
        client
      });
      return response.ok({
        body: tags
      });
    } catch (error) {
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}