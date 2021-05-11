"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLayerLists = getLayerLists;
exports.buildMapsIndexPatternsTelemetry = buildMapsIndexPatternsTelemetry;
exports.buildMapsSavedObjectsTelemetry = buildMapsSavedObjectsTelemetry;
exports.execTransformOverMultipleSavedObjectPages = execTransformOverMultipleSavedObjectPages;
exports.getMapsTelemetry = getMapsTelemetry;

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../common/constants");

var _kibana_server_services = require("../kibana_server_services");

var _references = require("././../../common/migrations/references");

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


function getUniqueLayerCounts(layerCountsList, mapsCount) {
  const uniqueLayerTypes = _lodash.default.uniq(_lodash.default.flatten(layerCountsList.map(lTypes => Object.keys(lTypes))));

  return uniqueLayerTypes.reduce((accu, type) => {
    const typeCounts = layerCountsList.reduce((tCountsAccu, tCounts) => {
      if (tCounts[type]) {
        tCountsAccu.push(tCounts[type]);
      }

      return tCountsAccu;
    }, []);

    const typeCountsSum = _lodash.default.sum(typeCounts);

    accu[type] = {
      min: typeCounts.length ? _lodash.default.min(typeCounts) : 0,
      max: typeCounts.length ? _lodash.default.max(typeCounts) : 0,
      avg: typeCountsSum ? typeCountsSum / mapsCount : 0
    };
    return accu;
  }, {});
}

function getEMSLayerCount(layerLists) {
  return layerLists.map(layerList => {
    const emsLayers = layerList.filter(layer => {
      return layer.sourceDescriptor !== null && layer.sourceDescriptor.type === _constants.SOURCE_TYPES.EMS_FILE && layer.sourceDescriptor.id;
    });
    const emsCountsById = (0, _lodash.default)(emsLayers).countBy(layer => {
      return layer.sourceDescriptor.id;
    });
    const layerTypeCount = emsCountsById.value();
    return layerTypeCount;
  });
}

async function isFieldGeoShape(indexPatternId, geoField) {
  if (!geoField || !indexPatternId) {
    return false;
  }

  const indexPatternsService = await (0, _kibana_server_services.getIndexPatternsService)();
  const indexPattern = await indexPatternsService.get(indexPatternId);

  if (!indexPattern) {
    return false;
  }

  return indexPattern.fields.some(fieldDescriptor => fieldDescriptor.name && fieldDescriptor.name === geoField);
}

async function isGeoShapeAggLayer(layer) {
  if (layer.sourceDescriptor === null) {
    return false;
  }

  if (layer.type !== _constants.LAYER_TYPE.VECTOR && layer.type !== _constants.LAYER_TYPE.BLENDED_VECTOR && layer.type !== _constants.LAYER_TYPE.HEATMAP) {
    return false;
  }

  const sourceDescriptor = layer.sourceDescriptor;

  if (sourceDescriptor.type === _constants.SOURCE_TYPES.ES_GEO_GRID) {
    return await isFieldGeoShape(sourceDescriptor.indexPatternId, sourceDescriptor.geoField);
  } else if (sourceDescriptor.type === _constants.SOURCE_TYPES.ES_SEARCH && sourceDescriptor.scalingType === _constants.SCALING_TYPES.CLUSTERS) {
    return await isFieldGeoShape(sourceDescriptor.indexPatternId, sourceDescriptor.geoField);
  } else {
    return false;
  }
}

async function getGeoShapeAggCount(layerLists) {
  const countsPerMap = await Promise.all(layerLists.map(async layerList => {
    const boolIsAggLayerArr = await Promise.all(layerList.map(async layerDescriptor => await isGeoShapeAggLayer(layerDescriptor)));
    return boolIsAggLayerArr.filter(x => x).length;
  }));
  return _lodash.default.sum(countsPerMap);
}

function getLayerLists(mapSavedObjects) {
  return mapSavedObjects.map(savedMapObject => {
    const layerList = savedMapObject.attributes && savedMapObject.attributes.layerListJSON ? JSON.parse(savedMapObject.attributes.layerListJSON) : [];
    return layerList;
  });
}

async function filterIndexPatternsByField(fields) {
  const indexPatternsService = await (0, _kibana_server_services.getIndexPatternsService)();
  const indexPatternIds = await indexPatternsService.getIds(true);
  let numIndexPatternsContainingField = 0;
  await Promise.all(indexPatternIds.map(async indexPatternId => {
    const indexPattern = await indexPatternsService.get(indexPatternId);
    const containsField = fields.some(field => indexPattern.fields.some(fieldDescriptor => fieldDescriptor.esTypes && fieldDescriptor.esTypes.includes(field)));

    if (containsField) {
      numIndexPatternsContainingField++;
    }
  }));
  return numIndexPatternsContainingField;
}

async function buildMapsIndexPatternsTelemetry(layerLists) {
  const indexPatternsWithGeoField = await filterIndexPatternsByField([_constants.ES_GEO_FIELD_TYPE.GEO_POINT, _constants.ES_GEO_FIELD_TYPE.GEO_SHAPE]);
  const indexPatternsWithGeoPointField = await filterIndexPatternsByField([_constants.ES_GEO_FIELD_TYPE.GEO_POINT]);
  const indexPatternsWithGeoShapeField = await filterIndexPatternsByField([_constants.ES_GEO_FIELD_TYPE.GEO_SHAPE]); // Tracks whether user uses Gold+ only functionality

  const geoShapeAggLayersCount = await getGeoShapeAggCount(layerLists);
  return {
    indexPatternsWithGeoFieldCount: indexPatternsWithGeoField,
    indexPatternsWithGeoPointFieldCount: indexPatternsWithGeoPointField,
    indexPatternsWithGeoShapeFieldCount: indexPatternsWithGeoShapeField,
    geoShapeAggLayersCount
  };
}

function buildMapsSavedObjectsTelemetry(layerLists) {
  const mapsCount = layerLists.length;
  const dataSourcesCount = layerLists.map(layerList => {
    // todo: not every source-descriptor has an id
    // @ts-ignore
    const sourceIdList = layerList.map(layer => layer.sourceDescriptor.id);
    return _lodash.default.uniq(sourceIdList).length;
  });
  const layersCount = layerLists.map(lList => lList.length);
  const layerTypesCount = layerLists.map(lList => _lodash.default.countBy(lList, 'type')); // Count of EMS Vector layers used

  const emsLayersCount = getEMSLayerCount(layerLists);

  const dataSourcesCountSum = _lodash.default.sum(dataSourcesCount);

  const layersCountSum = _lodash.default.sum(layersCount);

  return {
    // Total count of maps
    mapsTotalCount: mapsCount,
    // Time of capture
    timeCaptured: new Date().toISOString(),
    attributesPerMap: {
      // Count of data sources per map
      dataSourcesCount: {
        min: dataSourcesCount.length ? _lodash.default.min(dataSourcesCount) : 0,
        max: dataSourcesCount.length ? _lodash.default.max(dataSourcesCount) : 0,
        avg: dataSourcesCountSum ? layersCountSum / mapsCount : 0
      },
      // Total count of layers per map
      layersCount: {
        min: layersCount.length ? _lodash.default.min(layersCount) : 0,
        max: layersCount.length ? _lodash.default.max(layersCount) : 0,
        avg: layersCountSum ? layersCountSum / mapsCount : 0
      },
      // Count of layers by type
      layerTypesCount: { ...getUniqueLayerCounts(layerTypesCount, mapsCount)
      },
      // Count of layer by EMS region
      emsVectorLayersCount: { ...getUniqueLayerCounts(emsLayersCount, mapsCount)
      }
    }
  };
}

async function execTransformOverMultipleSavedObjectPages(savedObjectType, transform) {
  const savedObjectsClient = (0, _kibana_server_services.getInternalRepository)();
  let currentPage = 1; // Seed values

  let page = 0;
  let perPage = 0;
  let total = 0;
  let savedObjects = [];

  do {
    const savedObjectsFindResult = await savedObjectsClient.find({
      type: savedObjectType,
      page: currentPage++
    });
    ({
      page,
      per_page: perPage,
      saved_objects: savedObjects,
      total
    } = savedObjectsFindResult);
    transform(savedObjects);
  } while (page * perPage < total);
}

async function getMapsTelemetry(config) {
  // Get layer descriptors for Maps saved objects. This is not set up
  // to be done incrementally (i.e. - per page) but minimally we at least
  // build a list of small footprint objects
  const layerLists = [];
  await execTransformOverMultipleSavedObjectPages(_constants.MAP_SAVED_OBJECT_TYPE, savedObjects => {
    const savedObjectsWithIndexPatternIds = savedObjects.map(savedObject => {
      return { ...savedObject,
        ...(0, _references.injectReferences)(savedObject)
      };
    });
    return layerLists.push(...getLayerLists(savedObjectsWithIndexPatternIds));
  });
  const savedObjectsTelemetry = buildMapsSavedObjectsTelemetry(layerLists); // Incrementally harvest index pattern saved objects telemetry

  const indexPatternsTelemetry = await buildMapsIndexPatternsTelemetry(layerLists);
  return {
    settings: {
      showMapVisualizationTypes: config.showMapVisualizationTypes
    },
    ...indexPatternsTelemetry,
    ...savedObjectsTelemetry
  };
}