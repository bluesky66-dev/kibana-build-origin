"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAppTitle = getAppTitle;
exports.getMapEmbeddableDisplayName = getMapEmbeddableDisplayName;
exports.getDataSourceLabel = getDataSourceLabel;
exports.getUrlLabel = getUrlLabel;
exports.getEsSpatialRelationLabel = getEsSpatialRelationLabel;

var _i18n = require("@kbn/i18n");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getAppTitle() {
  return _i18n.i18n.translate('xpack.maps.appTitle', {
    defaultMessage: 'Maps'
  });
}

function getMapEmbeddableDisplayName() {
  return _i18n.i18n.translate('xpack.maps.embeddableDisplayName', {
    defaultMessage: 'map'
  });
}

function getDataSourceLabel() {
  return _i18n.i18n.translate('xpack.maps.source.dataSourceLabel', {
    defaultMessage: 'Data source'
  });
}

function getUrlLabel() {
  return _i18n.i18n.translate('xpack.maps.source.urlLabel', {
    defaultMessage: 'Url'
  });
}

function getEsSpatialRelationLabel(spatialRelation) {
  switch (spatialRelation) {
    case _constants.ES_SPATIAL_RELATIONS.INTERSECTS:
      return _i18n.i18n.translate('xpack.maps.common.esSpatialRelation.intersectsLabel', {
        defaultMessage: 'intersects'
      });

    case _constants.ES_SPATIAL_RELATIONS.DISJOINT:
      return _i18n.i18n.translate('xpack.maps.common.esSpatialRelation.disjointLabel', {
        defaultMessage: 'disjoint'
      });

    case _constants.ES_SPATIAL_RELATIONS.WITHIN:
      return _i18n.i18n.translate('xpack.maps.common.esSpatialRelation.withinLabel', {
        defaultMessage: 'within'
      });
    // @ts-ignore

    case _constants.ES_SPATIAL_RELATIONS.CONTAINS:
      return _i18n.i18n.translate('xpack.maps.common.esSpatialRelation.containsLabel', {
        defaultMessage: 'contains'
      });

    default:
      return spatialRelation;
  }
}