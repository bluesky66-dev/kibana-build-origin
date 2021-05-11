"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeTemplate = serializeTemplate;
exports.deserializeTemplate = deserializeTemplate;
exports.deserializeTemplateList = deserializeTemplateList;
exports.serializeLegacyTemplate = serializeLegacyTemplate;
exports.deserializeLegacyTemplate = deserializeLegacyTemplate;
exports.deserializeLegacyTemplateList = deserializeLegacyTemplateList;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const hasEntries = (data = {}) => Object.entries(data).length > 0;

function serializeTemplate(templateDeserialized) {
  const {
    version,
    priority,
    indexPatterns,
    template,
    composedOf,
    dataStream,
    _meta
  } = templateDeserialized;
  return {
    version,
    priority,
    template,
    index_patterns: indexPatterns,
    data_stream: dataStream,
    composed_of: composedOf,
    _meta
  };
}

function deserializeTemplate(templateEs, cloudManagedTemplatePrefix) {
  var _settings$index;

  const {
    name,
    version,
    index_patterns: indexPatterns,
    template = {},
    priority,
    _meta,
    composed_of: composedOf,
    data_stream: dataStream
  } = templateEs;
  const {
    settings
  } = template;
  let type = 'default';

  if (Boolean(cloudManagedTemplatePrefix && name.startsWith(cloudManagedTemplatePrefix))) {
    type = 'cloudManaged';
  } else if (name.startsWith('.')) {
    type = 'system';
  } else if (Boolean((_meta === null || _meta === void 0 ? void 0 : _meta.managed) === true)) {
    type = 'managed';
  }

  const deserializedTemplate = {
    name,
    version,
    priority,
    indexPatterns: indexPatterns.sort(),
    template,
    ilmPolicy: settings === null || settings === void 0 ? void 0 : (_settings$index = settings.index) === null || _settings$index === void 0 ? void 0 : _settings$index.lifecycle,
    composedOf,
    dataStream,
    _meta,
    _kbnMeta: {
      type,
      hasDatastream: Boolean(dataStream)
    }
  };
  return deserializedTemplate;
}

function deserializeTemplateList(indexTemplates, cloudManagedTemplatePrefix) {
  return indexTemplates.map(({
    name,
    index_template: templateSerialized
  }) => {
    const {
      template: {
        mappings,
        settings,
        aliases
      } = {},
      ...deserializedTemplate
    } = deserializeTemplate({
      name,
      ...templateSerialized
    }, cloudManagedTemplatePrefix);
    return { ...deserializedTemplate,
      hasSettings: hasEntries(settings),
      hasAliases: hasEntries(aliases),
      hasMappings: hasEntries(mappings)
    };
  });
}
/**
 * ------------------------------------------
 * --------- LEGACY INDEX TEMPLATES ---------
 * ------------------------------------------
 */


function serializeLegacyTemplate(template) {
  const {
    version,
    order,
    indexPatterns,
    template: {
      settings,
      aliases,
      mappings
    } = {}
  } = template;
  return {
    version,
    order,
    index_patterns: indexPatterns,
    settings,
    aliases,
    mappings
  };
}

function deserializeLegacyTemplate(templateEs, cloudManagedTemplatePrefix) {
  const {
    settings,
    aliases,
    mappings,
    ...rest
  } = templateEs;
  const deserializedTemplate = deserializeTemplate({ ...rest,
    template: {
      aliases,
      settings,
      mappings
    }
  }, cloudManagedTemplatePrefix);
  return { ...deserializedTemplate,
    order: templateEs.order,
    _kbnMeta: { ...deserializedTemplate._kbnMeta,
      isLegacy: true
    }
  };
}

function deserializeLegacyTemplateList(indexTemplatesByName, cloudManagedTemplatePrefix) {
  return Object.entries(indexTemplatesByName).map(([name, templateSerialized]) => {
    const {
      template: {
        mappings,
        settings,
        aliases
      } = {},
      ...deserializedTemplate
    } = deserializeLegacyTemplate({
      name,
      ...templateSerialized
    }, cloudManagedTemplatePrefix);
    return { ...deserializedTemplate,
      hasSettings: hasEntries(settings),
      hasAliases: hasEntries(aliases),
      hasMappings: hasEntries(mappings)
    };
  });
}