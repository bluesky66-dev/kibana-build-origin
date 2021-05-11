"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.axisConfig = void 0;

var _template_from_react_component = require("../../../../public/lib/template_from_react_component");

var _simple_template = require("./simple_template");

var _extended_template = require("./extended_template");

var _i18n = require("../../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  AxisConfig: strings
} = _i18n.ArgumentStrings;

const axisConfig = () => ({
  name: 'axisConfig',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(_simple_template.SimpleTemplate),
  template: (0, _template_from_react_component.templateFromReactComponent)(_extended_template.ExtendedTemplate)
});

exports.axisConfig = axisConfig;