"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeParams = exports.initParams = void 0;

var _agg = require("./param_types/agg");

var _field = require("./param_types/field");

var _optioned = require("./param_types/optioned");

var _string = require("./param_types/string");

var _json = require("./param_types/json");

var _base = require("./param_types/base");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const paramTypeMap = {
  field: _field.FieldParamType,
  optioned: _optioned.OptionedParamType,
  string: _string.StringParamType,
  json: _json.JsonParamType,
  agg: _agg.AggParamType,
  _default: _base.BaseParamType
};

const initParams = params => params.map(config => {
  const Class = paramTypeMap[config.type] || paramTypeMap._default;
  return new Class(config);
});
/**
 * Reads an aggConfigs
 *
 * @method write
 * @param  {AggConfig} aggConfig
 *         the AggConfig object who's type owns these aggParams and contains the param values for our param defs
 * @param  {object} [locals]
 *         an array of locals that will be available to the write function (can be used to enhance
 *         the quality of things like date_histogram's "auto" interval)
 * @return {object} output
 *         output of the write calls, reduced into a single object. A `params: {}` property is exposed on the
 *         output object which is used to create the agg dsl for the search request. All other properties
 *         are dependent on the AggParam#write methods which should be studied for each AggType.
 */


exports.initParams = initParams;

const writeParams = (params = [], aggConfig, aggs, locals) => {
  const output = {
    params: {}
  };
  locals = locals || {};
  params.forEach(param => {
    if (param.write) {
      param.write(aggConfig, output, aggs, locals);
    } else {
      if (param && param.name) {
        output.params[param.name] = aggConfig.params[param.name];
      }
    }
  });
  return output;
};

exports.writeParams = writeParams;