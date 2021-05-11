"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplateParameter = exports.isLegacyTemplate = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper to know if a template has the legacy format or not
 * legacy format will be supported up until 9.x but marked as deprecated from 7.8
 * new (composable) format is supported from 7.8
 */

const isLegacyTemplate = template => {
  return {}.hasOwnProperty.call(template, 'template') ? false : true;
};

exports.isLegacyTemplate = isLegacyTemplate;

const getTemplateParameter = (template, setting) => {
  var _template;

  return isLegacyTemplate(template) ? template[setting] : (_template = template.template) === null || _template === void 0 ? void 0 : _template[setting];
};

exports.getTemplateParameter = getTemplateParameter;