"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEsFilter = getEsFilter;

var _config = require("../../rum_client/ui_filters/local_ui_filters/config");

var _server = require("../../../../../../../src/plugins/data/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getEsFilter(uiFilters) {
  const {
    kuery,
    environment,
    ...localFilterValues
  } = uiFilters;

  const mappedFilters = _config.localUIFilterNames.filter(name => name in localFilterValues).map(filterName => {
    const field = _config.localUIFilters[filterName];
    const value = localFilterValues[filterName];
    return {
      terms: {
        [field.fieldName]: value
      }
    };
  });

  const esFilters = [...getKueryUiFilterES(uiFilters.kuery), ...mappedFilters];
  return esFilters;
}

function getKueryUiFilterES(kuery) {
  if (!kuery) {
    return [];
  }

  const ast = _server.esKuery.fromKueryExpression(kuery);

  return [_server.esKuery.toElasticsearchQuery(ast)];
}