"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateRoute = registerCreateRoute;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");

var _validate_schemas = require("./validate_schemas");

var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _validate_schemas.templateSchema;

const querySchema = _configSchema.schema.object({
  include_type_name: _configSchema.schema.maybe(_configSchema.schema.string())
});

function registerCreateRoute({
  router,
  license,
  lib
}) {
  router.post({
    path: (0, _index.addBasePath)('/index_templates'),
    validate: {
      body: bodySchema,
      query: querySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.dataManagement.client; // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      include_type_name
    } = req.query;
    const template = req.body;
    const {
      _kbnMeta: {
        isLegacy
      }
    } = template; // Check that template with the same name doesn't already exist

    const templateExists = await (0, _lib.doesTemplateExist)({
      name: template.name,
      callAsCurrentUser,
      isLegacy
    });

    if (templateExists) {
      return res.conflict({
        body: new Error(_i18n.i18n.translate('xpack.idxMgmt.createRoute.duplicateTemplateIdErrorMessage', {
          defaultMessage: "There is already a template with name '{name}'.",
          values: {
            name: template.name
          }
        }))
      });
    }

    try {
      // Otherwise create new index template
      const response = await (0, _lib.saveTemplate)({
        template,
        callAsCurrentUser,
        isLegacy,
        include_type_name
      });
      return res.ok({
        body: response
      });
    } catch (e) {
      if (lib.isEsError(e)) {
        const error = lib.parseEsError(e.response);
        return res.customError({
          statusCode: e.statusCode,
          body: {
            message: error.message,
            attributes: error
          }
        });
      } // Case: default


      return res.internalError({
        body: e
      });
    }
  }));
}