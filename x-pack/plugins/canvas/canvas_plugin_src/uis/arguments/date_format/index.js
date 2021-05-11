"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dateFormatInitializer = void 0;

var _recompose = require("recompose");

var _moment = _interopRequireDefault(require("moment"));

var _date_format = require("./date_format");

var _template_from_react_component = require("../../../../public/lib/template_from_react_component");

var _i18n = require("../../../../i18n");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  DateFormat: strings
} = _i18n.ArgumentStrings;

const dateFormatInitializer = (core, plugins) => {
  const formatMap = {
    DEFAULT: core.uiSettings.get('dateFormat'),
    NANOS: core.uiSettings.get('dateNanosFormat'),
    ISO8601: '',
    LOCAL_LONG: 'LLLL',
    LOCAL_SHORT: 'LLL',
    LOCAL_DATE: 'l',
    LOCAL_TIME_WITH_SECONDS: 'LTS'
  };
  const dateFormats = Object.values(formatMap).map(format => ({
    value: format,
    text: _moment.default.utc((0, _moment.default)()).format(format)
  }));
  const DateFormatArgInput = (0, _recompose.compose)((0, _recompose.withProps)({
    dateFormats
  }))(_date_format.DateFormatArgInput);
  return () => ({
    name: 'dateFormat',
    displayName: strings.getDisplayName(),
    help: strings.getHelp(),
    simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(DateFormatArgInput)
  });
};

exports.dateFormatInitializer = dateFormatInitializer;