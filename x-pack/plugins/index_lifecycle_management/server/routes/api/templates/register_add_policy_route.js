"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAddPolicyRoute = registerAddPolicyRoute;

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getLegacyIndexTemplate(client, templateName) {
  const response = await client.indices.getTemplate({
    name: templateName
  });
  return response.body[templateName];
}

async function getIndexTemplate(client, templateName) {
  var _templates$find;

  const options = {
    // we allow 404 incase the user shutdown security in-between the check and now
    ignore: [404]
  };
  const response = await client.indices.getIndexTemplate({
    name: templateName
  }, options);
  const {
    index_templates: templates
  } = response.body;
  return templates === null || templates === void 0 ? void 0 : (_templates$find = templates.find(template => template.name === templateName)) === null || _templates$find === void 0 ? void 0 : _templates$find.index_template;
}

async function updateIndexTemplate(client, isLegacy, templateName, policyName, aliasName) {
  const settings = {
    index: {
      lifecycle: {
        name: policyName,
        rollover_alias: aliasName
      }
    }
  };
  const indexTemplate = isLegacy ? await getLegacyIndexTemplate(client, templateName) : await getIndexTemplate(client, templateName);

  if (!indexTemplate) {
    return false;
  }

  if (isLegacy) {
    (0, _lodash.merge)(indexTemplate, {
      settings
    });
  } else {
    (0, _lodash.merge)(indexTemplate, {
      template: {
        settings
      }
    });
  }

  if (isLegacy) {
    return client.indices.putTemplate({
      name: templateName,
      body: indexTemplate
    });
  }

  return client.indices.putIndexTemplate({
    name: templateName,
    body: indexTemplate
  });
}

const bodySchema = _configSchema.schema.object({
  templateName: _configSchema.schema.string(),
  policyName: _configSchema.schema.string(),
  aliasName: _configSchema.schema.maybe(_configSchema.schema.string())
});

const querySchema = _configSchema.schema.object({
  legacy: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('true'), _configSchema.schema.literal('false')]))
});

function registerAddPolicyRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.post({
    path: (0, _services.addBasePath)('/template'),
    validate: {
      body: bodySchema,
      query: querySchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const body = request.body;
    const {
      templateName,
      policyName,
      aliasName
    } = body;
    const isLegacy = request.query.legacy === 'true';

    try {
      const updatedTemplate = await updateIndexTemplate(context.core.elasticsearch.client.asCurrentUser, isLegacy, templateName, policyName, aliasName);

      if (!updatedTemplate) {
        return response.notFound({
          body: _i18n.i18n.translate('xpack.indexLifecycleMgmt.templateNotFoundMessage', {
            defaultMessage: `Template {name} not found.`,
            values: {
              name: templateName
            }
          })
        });
      }

      return response.ok();
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}