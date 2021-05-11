"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFetchRoute = registerFetchRoute;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isReservedSystemTemplate(templateName, indexPatterns) {
  return templateName.startsWith('kibana_index_template') || templateName.startsWith('.') && indexPatterns.every(pattern => {
    return !pattern.includes('*');
  });
}

function filterLegacyTemplates(templates) {
  const formattedTemplates = [];
  const templateNames = Object.keys(templates);

  for (const templateName of templateNames) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      settings,
      index_patterns
    } = templates[templateName];

    if (isReservedSystemTemplate(templateName, index_patterns)) {
      continue;
    }

    const formattedTemplate = {
      settings,
      name: templateName
    };
    formattedTemplates.push(formattedTemplate);
  }

  return formattedTemplates;
}

function filterTemplates(templates, isLegacy) {
  if (isLegacy) {
    return filterLegacyTemplates(templates);
  }

  const {
    index_templates: indexTemplates
  } = templates;
  return indexTemplates.map(template => {
    var _template$index_templ;

    return {
      name: template.name,
      settings: (_template$index_templ = template.index_template.template) === null || _template$index_templ === void 0 ? void 0 : _template$index_templ.settings
    };
  });
}

async function fetchTemplates(client, isLegacy) {
  const options = {
    // we allow 404 incase the user shutdown security in-between the check and now
    ignore: [404]
  };
  const response = isLegacy ? await client.indices.getTemplate({}, options) : await client.indices.getIndexTemplate({}, options);
  return response.body;
}

const querySchema = _configSchema.schema.object({
  legacy: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('true'), _configSchema.schema.literal('false')]))
});

function registerFetchRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: (0, _services.addBasePath)('/templates'),
    validate: {
      query: querySchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const isLegacy = request.query.legacy === 'true';

    try {
      const templates = await fetchTemplates(context.core.elasticsearch.client.asCurrentUser, isLegacy);
      const okResponse = {
        body: filterTemplates(templates, isLegacy)
      };
      return response.ok(okResponse);
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}