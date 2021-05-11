"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMapsUsageCollector = registerMapsUsageCollector;

var _maps_telemetry = require("../maps_telemetry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerMapsUsageCollector(usageCollection, config) {
  if (!usageCollection) {
    return;
  }

  const mapsUsageCollector = usageCollection.makeUsageCollector({
    type: 'maps',
    isReady: () => true,
    fetch: async () => await (0, _maps_telemetry.getMapsTelemetry)(config),
    schema: {
      settings: {
        showMapVisualizationTypes: {
          type: 'boolean'
        }
      },
      indexPatternsWithGeoFieldCount: {
        type: 'long'
      },
      indexPatternsWithGeoPointFieldCount: {
        type: 'long'
      },
      indexPatternsWithGeoShapeFieldCount: {
        type: 'long'
      },
      geoShapeAggLayersCount: {
        type: 'long'
      },
      mapsTotalCount: {
        type: 'long'
      },
      timeCaptured: {
        type: 'date'
      },
      attributesPerMap: {
        dataSourcesCount: {
          min: {
            type: 'long'
          },
          max: {
            type: 'long'
          },
          avg: {
            type: 'float'
          }
        },
        layersCount: {
          min: {
            type: 'long'
          },
          max: {
            type: 'long'
          },
          avg: {
            type: 'float'
          }
        },
        // TODO: Find out all the possible values for DYNAMIC_KEY or reformat into an array
        layerTypesCount: {
          DYNAMIC_KEY: {
            min: {
              type: 'long'
            },
            max: {
              type: 'long'
            },
            avg: {
              type: 'float'
            }
          }
        },
        emsVectorLayersCount: {
          DYNAMIC_KEY: {
            min: {
              type: 'long'
            },
            max: {
              type: 'long'
            },
            avg: {
              type: 'float'
            }
          }
        }
      }
    }
  });
  usageCollection.registerCollector(mapsUsageCollector);
}