"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deserializeComponentTemplate = deserializeComponentTemplate;
exports.deserializeComponentTemplateList = deserializeComponentTemplateList;
exports.serializeComponentTemplate = serializeComponentTemplate;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const hasEntries = (data = {}) => Object.entries(data).length > 0;
/**
 * Normalize a list of component templates to a map where each key
 * is a component template name, and the value is an array of index templates name using it
 *
 * @example
 *
 {
   "comp-1": [
     "template-1",
     "template-2"
   ],
   "comp2": [
     "template-1",
     "template-2"
   ]
 }
 *
 * @param indexTemplatesEs List of component templates
 */


const getIndexTemplatesToUsedBy = indexTemplatesEs => {
  return indexTemplatesEs.reduce((acc, item) => {
    if (item.index_template.composed_of) {
      item.index_template.composed_of.forEach(component => {
        acc[component] = acc[component] ? [...acc[component], item.name] : [item.name];
      });
    }

    return acc;
  }, {});
};

function deserializeComponentTemplate(componentTemplateEs, indexTemplatesEs) {
  const {
    name,
    component_template: componentTemplate
  } = componentTemplateEs;
  const {
    template,
    _meta,
    version
  } = componentTemplate;
  const indexTemplatesToUsedBy = getIndexTemplatesToUsedBy(indexTemplatesEs);
  const deserializedComponentTemplate = {
    name,
    template,
    version,
    _meta,
    _kbnMeta: {
      usedBy: indexTemplatesToUsedBy[name] || [],
      isManaged: Boolean((_meta === null || _meta === void 0 ? void 0 : _meta.managed) === true)
    }
  };
  return deserializedComponentTemplate;
}

function deserializeComponentTemplateList(componentTemplateEs, indexTemplatesEs) {
  const {
    name,
    component_template: componentTemplate
  } = componentTemplateEs;
  const {
    template,
    _meta
  } = componentTemplate;
  const indexTemplatesToUsedBy = getIndexTemplatesToUsedBy(indexTemplatesEs);
  const componentTemplateListItem = {
    name,
    usedBy: indexTemplatesToUsedBy[name] || [],
    isManaged: Boolean((_meta === null || _meta === void 0 ? void 0 : _meta.managed) === true),
    hasSettings: hasEntries(template.settings),
    hasMappings: hasEntries(template.mappings),
    hasAliases: hasEntries(template.aliases)
  };
  return componentTemplateListItem;
}

function serializeComponentTemplate(componentTemplateDeserialized) {
  const {
    version,
    template,
    _meta
  } = componentTemplateDeserialized;
  return {
    version,
    template,
    _meta
  };
}