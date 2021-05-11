"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettings = getUiSettings;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getUiSettings() {
  return {
    'visualization:tileMap:maxPrecision': {
      name: _i18n.i18n.translate('maps_legacy.advancedSettings.visualization.tileMap.maxPrecisionTitle', {
        defaultMessage: 'Maximum tile map precision'
      }),
      value: 7,
      description: _i18n.i18n.translate('maps_legacy.advancedSettings.visualization.tileMap.maxPrecisionText', {
        defaultMessage: 'The maximum geoHash precision displayed on tile maps: 7 is high, 10 is very high, 12 is the max. {cellDimensionsLink}',
        description: 'Part of composite text: maps_legacy.advancedSettings.visualization.tileMap.maxPrecisionText + ' + 'maps_legacy.advancedSettings.visualization.tileMap.maxPrecision.cellDimensionsLinkText',
        values: {
          cellDimensionsLink: `<a href="http://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-geohashgrid-aggregation.html#_cell_dimensions_at_the_equator"
            target="_blank" rel="noopener">` + _i18n.i18n.translate('maps_legacy.advancedSettings.visualization.tileMap.maxPrecision.cellDimensionsLinkText', {
            defaultMessage: 'Explanation of cell dimensions'
          }) + '</a>'
        }
      }),
      schema: _configSchema.schema.number(),
      category: ['visualization']
    },
    'visualization:tileMap:WMSdefaults': {
      name: _i18n.i18n.translate('maps_legacy.advancedSettings.visualization.tileMap.wmsDefaultsTitle', {
        defaultMessage: 'Default WMS properties'
      }),
      value: JSON.stringify({
        enabled: false,
        url: '',
        options: {
          version: '',
          layers: '',
          format: 'image/png',
          transparent: true,
          attribution: '',
          styles: ''
        }
      }, null, 2),
      type: 'json',
      description: _i18n.i18n.translate('maps_legacy.advancedSettings.visualization.tileMap.wmsDefaultsText', {
        defaultMessage: 'Default {propertiesLink} for the WMS map server support in the coordinate map',
        description: 'Part of composite text: maps_legacy.advancedSettings.visualization.tileMap.wmsDefaultsText + ' + 'maps_legacy.advancedSettings.visualization.tileMap.wmsDefaults.propertiesLinkText',
        values: {
          propertiesLink: '<a href="http://leafletjs.com/reference.html#tilelayer-wms" target="_blank" rel="noopener noreferrer">' + _i18n.i18n.translate('maps_legacy.advancedSettings.visualization.tileMap.wmsDefaults.propertiesLinkText', {
            defaultMessage: 'properties'
          }) + '</a>'
        }
      }),
      schema: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean(),
        url: _configSchema.schema.string(),
        options: _configSchema.schema.object({
          version: _configSchema.schema.string(),
          layers: _configSchema.schema.string(),
          format: _configSchema.schema.string(),
          transparent: _configSchema.schema.boolean(),
          attribution: _configSchema.schema.string(),
          styles: _configSchema.schema.string()
        })
      }),
      category: ['visualization']
    }
  };
}