"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStats = void 0;

var _hjson = require("hjson");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isVegaType(attributes) {
  var _attributes$params;

  return attributes && attributes.type === 'vega' && ((_attributes$params = attributes.params) === null || _attributes$params === void 0 ? void 0 : _attributes$params.spec);
}

const checkVegaSchemaType = (schemaURL, type) => schemaURL.includes(`//vega.github.io/schema/${type}/`);

const getDefaultVegaVisualizations = home => {
  var _home$sampleData$getS;

  const titles = [];
  const sampleDataSets = (_home$sampleData$getS = home === null || home === void 0 ? void 0 : home.sampleData.getSampleDatasets()) !== null && _home$sampleData$getS !== void 0 ? _home$sampleData$getS : [];
  sampleDataSets.forEach(sampleDataSet => sampleDataSet.savedObjects.forEach(savedObject => {
    try {
      if (savedObject.type === 'visualization') {
        var _savedObject$attribut;

        const visState = JSON.parse((_savedObject$attribut = savedObject.attributes) === null || _savedObject$attribut === void 0 ? void 0 : _savedObject$attribut.visState);

        if (isVegaType(visState)) {
          titles.push(visState.title);
        }
      }
    } catch (e) {// Let it go, visState is invalid and we'll don't need to handle it
    }
  }));
  return titles;
};

const getStats = async (esClient, index, {
  home
}) => {
  var _esResponse$hits$hits, _esResponse$hits, _esResponse$hits$hits2;

  let shouldPublishTelemetry = false;
  const vegaUsage = {
    vega_lib_specs_total: 0,
    vega_lite_lib_specs_total: 0,
    vega_use_map_total: 0
  };
  const searchParams = {
    size: 10000,
    index,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._id', 'hits.hits._source.visualization'],
    body: {
      query: {
        bool: {
          filter: {
            term: {
              type: 'visualization'
            }
          }
        }
      }
    }
  };
  const {
    body: esResponse
  } = await esClient.search(searchParams);
  const size = (_esResponse$hits$hits = esResponse === null || esResponse === void 0 ? void 0 : (_esResponse$hits = esResponse.hits) === null || _esResponse$hits === void 0 ? void 0 : (_esResponse$hits$hits2 = _esResponse$hits.hits) === null || _esResponse$hits$hits2 === void 0 ? void 0 : _esResponse$hits$hits2.length) !== null && _esResponse$hits$hits !== void 0 ? _esResponse$hits$hits : 0;

  if (!size) {
    return;
  } // we want to exclude the Vega Sample Data visualizations from the stats
  // in order to have more accurate results


  const excludedFromStatsVisualizations = getDefaultVegaVisualizations(home);

  for (const hit of esResponse.hits.hits) {
    var _hit$_source, _visualization$visSta;

    const visualization = (_hit$_source = hit._source) === null || _hit$_source === void 0 ? void 0 : _hit$_source.visualization;
    const visState = JSON.parse((_visualization$visSta = visualization === null || visualization === void 0 ? void 0 : visualization.visState) !== null && _visualization$visSta !== void 0 ? _visualization$visSta : '{}');

    if (isVegaType(visState) && !excludedFromStatsVisualizations.includes(visState.title)) {
      try {
        const spec = (0, _hjson.parse)(visState.params.spec, {
          legacyRoot: false
        });

        if (spec) {
          var _spec$config, _spec$config$kibana;

          shouldPublishTelemetry = true;

          if (checkVegaSchemaType(spec.$schema, 'vega')) {
            vegaUsage.vega_lib_specs_total++;
          }

          if (checkVegaSchemaType(spec.$schema, 'vega-lite')) {
            vegaUsage.vega_lite_lib_specs_total++;
          }

          if (((_spec$config = spec.config) === null || _spec$config === void 0 ? void 0 : (_spec$config$kibana = _spec$config.kibana) === null || _spec$config$kibana === void 0 ? void 0 : _spec$config$kibana.type) === 'map') {
            vegaUsage.vega_use_map_total++;
          }
        }
      } catch (e) {// Let it go, the data is invalid and we'll don't need to handle it
      }
    }
  }

  return shouldPublishTelemetry ? vegaUsage : undefined;
};

exports.getStats = getStats;