"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateRoute = void 0;

var _i18n = require("@kbn/i18n");

var _lib = require("../../../../common/lib");

var _index = require("../index");

var _schema_validation = require("./schema_validation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerCreateRoute = ({
  router,
  license,
  lib: {
    isEsError
  }
}) => {
  router.post({
    path: (0, _index.addBasePath)('/component_templates'),
    validate: {
      body: _schema_validation.componentTemplateSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.dataManagement.client;
    const serializedComponentTemplate = (0, _lib.serializeComponentTemplate)(req.body);
    const {
      name
    } = req.body;

    try {
      // Check that a component template with the same name doesn't already exist
      const componentTemplateResponse = await callAsCurrentUser('dataManagement.getComponentTemplate', {
        name
      });
      const {
        component_templates: componentTemplates
      } = componentTemplateResponse;

      if (componentTemplates.length) {
        return res.conflict({
          body: new Error(_i18n.i18n.translate('xpack.idxMgmt.componentTemplates.createRoute.duplicateErrorMessage', {
            defaultMessage: "There is already a component template with name '{name}'.",
            values: {
              name
            }
          }))
        });
      }
    } catch (e) {// Silently swallow error
    }

    try {
      const response = await callAsCurrentUser('dataManagement.saveComponentTemplate', {
        name,
        body: serializedComponentTemplate
      });
      return res.ok({
        body: response
      });
    } catch (error) {
      if (isEsError(error)) {
        return res.customError({
          statusCode: error.statusCode,
          body: error
        });
      }

      return res.internalError({
        body: error
      });
    }
  }));
};

exports.registerCreateRoute = registerCreateRoute;