"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberFormatInitializer = void 0;

var _recompose = require("recompose");

var _number_format = require("./number_format");

var _template_from_react_component = require("../../../../public/lib/template_from_react_component");

var _i18n = require("../../../../i18n");

var _public = require("../../../../../../../src/plugins/data/public");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  NumberFormat: strings
} = _i18n.ArgumentStrings;

const numberFormatInitializer = (core, plugins) => {
  const formatMap = {
    NUMBER: core.uiSettings.get(_public.UI_SETTINGS.FORMAT_NUMBER_DEFAULT_PATTERN),
    PERCENT: core.uiSettings.get(_public.UI_SETTINGS.FORMAT_PERCENT_DEFAULT_PATTERN),
    CURRENCY: core.uiSettings.get(_public.UI_SETTINGS.FORMAT_CURRENCY_DEFAULT_PATTERN),
    DURATION: '00:00:00',
    BYTES: core.uiSettings.get(_public.UI_SETTINGS.FORMAT_BYTES_DEFAULT_PATTERN)
  };
  const numberFormats = [{
    value: formatMap.NUMBER,
    text: strings.getFormatNumber()
  }, {
    value: formatMap.PERCENT,
    text: strings.getFormatPercent()
  }, {
    value: formatMap.CURRENCY,
    text: strings.getFormatCurrency()
  }, {
    value: formatMap.DURATION,
    text: strings.getFormatDuration()
  }, {
    value: formatMap.BYTES,
    text: strings.getFormatBytes()
  }];
  const NumberFormatArgInput = (0, _recompose.compose)((0, _recompose.withProps)({
    numberFormats
  }))(_number_format.NumberFormatArgInput);
  return () => ({
    name: 'numberFormat',
    displayName: strings.getDisplayName(),
    help: strings.getHelp(),
    simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(NumberFormatArgInput)
  });
};

exports.numberFormatInitializer = numberFormatInitializer;