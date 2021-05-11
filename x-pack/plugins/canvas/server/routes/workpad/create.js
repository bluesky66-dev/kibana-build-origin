"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeCreateWorkpadRoute = initializeCreateWorkpadRoute;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/lib/constants");

var _get_id = require("../../../common/lib/get_id");

var _workpad_schema = require("./workpad_schema");

var _ok_response = require("../ok_response");

var _catch_error_handler = require("../catch_error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const WorkpadFromTemplateSchema = _configSchema.schema.object({
  templateId: _configSchema.schema.string()
});

const createRequestBodySchema = _configSchema.schema.oneOf([_workpad_schema.WorkpadSchema, WorkpadFromTemplateSchema]);

function isCreateFromTemplate(maybeCreateFromTemplate) {
  return maybeCreateFromTemplate.templateId !== undefined;
}

function initializeCreateWorkpadRoute(deps) {
  const {
    router
  } = deps;
  router.post({
    path: `${_constants.API_ROUTE_WORKPAD}`,
    validate: {
      body: createRequestBodySchema
    },
    options: {
      body: {
        maxBytes: 26214400,
        accepts: ['application/json']
      }
    }
  }, (0, _catch_error_handler.catchErrorHandler)(async (context, request, response) => {
    let workpad = request.body;

    if (isCreateFromTemplate(request.body)) {
      const templateSavedObject = await context.core.savedObjects.client.get(_constants.TEMPLATE_TYPE, request.body.templateId);
      workpad = templateSavedObject.attributes.template;
    }

    const now = new Date().toISOString();
    const {
      id: maybeId,
      ...payload
    } = workpad;
    const id = maybeId ? maybeId : (0, _get_id.getId)('workpad');
    await context.core.savedObjects.client.create(_constants.CANVAS_TYPE, { ...payload,
      '@timestamp': now,
      '@created': now
    }, {
      id
    });
    return response.ok({
      body: { ..._ok_response.okResponse,
        id
      }
    });
  }));
}