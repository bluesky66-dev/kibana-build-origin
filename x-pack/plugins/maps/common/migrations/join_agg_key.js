"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateJoinAggKey = migrateJoinAggKey;

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../constants");

var _get_agg_key = require("../get_agg_key");

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


const GROUP_BY_DELIMITER = '_groupby_';

function getLegacyAggKey({
  aggType,
  aggFieldName,
  indexPatternTitle,
  termFieldName
}) {
  const metricKey = aggType !== _constants.AGG_TYPE.COUNT ? `${aggType}${_constants.AGG_DELIMITER}${aggFieldName}` : aggType;
  return `${_constants.JOIN_FIELD_NAME_PREFIX}${metricKey}${GROUP_BY_DELIMITER}${indexPatternTitle}.${termFieldName}`;
}

function parseLegacyAggKey(legacyAggKey) {
  const groupBySplit = legacyAggKey.substring(_constants.JOIN_FIELD_NAME_PREFIX.length).split(GROUP_BY_DELIMITER);
  const metricKey = groupBySplit[0];
  const metricKeySplit = metricKey.split(_constants.AGG_DELIMITER);
  return {
    aggType: metricKeySplit[0],
    aggFieldName: metricKeySplit.length === 2 ? metricKeySplit[1] : undefined
  };
}

function migrateJoinAggKey({
  attributes
}) {
  if (!attributes || !attributes.layerListJSON) {
    return attributes;
  }

  const layerList = JSON.parse(attributes.layerListJSON);
  layerList.forEach(layerDescriptor => {
    if (layerDescriptor.type === _constants.LAYER_TYPE.VECTOR || layerDescriptor.type === _constants.LAYER_TYPE.BLENDED_VECTOR) {
      const vectorLayerDescriptor = layerDescriptor;

      if (!vectorLayerDescriptor.style || !vectorLayerDescriptor.joins || vectorLayerDescriptor.joins.length === 0) {
        return;
      }

      const legacyJoinFields = new Map();
      vectorLayerDescriptor.joins.forEach(joinDescriptor => {
        _lodash.default.get(joinDescriptor, 'right.metrics', []).forEach(aggDescriptor => {
          const legacyAggKey = getLegacyAggKey({
            aggType: aggDescriptor.type,
            aggFieldName: 'field' in aggDescriptor ? aggDescriptor.field : undefined,
            indexPatternTitle: _lodash.default.get(joinDescriptor, 'right.indexPatternTitle', ''),
            termFieldName: _lodash.default.get(joinDescriptor, 'right.term', '')
          }); // The legacy getAggKey implemenation has a naming collision bug where
          // aggType, aggFieldName, indexPatternTitle, and termFieldName would result in the identical aggKey.
          // The VectorStyle implemenation used the first matching join descriptor
          // so, in the event of a name collision, the first join descriptor will be used here as well.

          if (!legacyJoinFields.has(legacyAggKey)) {
            legacyJoinFields.set(legacyAggKey, joinDescriptor);
          }
        });
      });
      Object.keys(vectorLayerDescriptor.style.properties).forEach(key => {
        const style = vectorLayerDescriptor.style.properties[key];

        if (_lodash.default.get(style, 'options.field.origin') === _constants.FIELD_ORIGIN.JOIN) {
          const joinDescriptor = legacyJoinFields.get(style.options.field.name);

          if (joinDescriptor) {
            const {
              aggType,
              aggFieldName
            } = parseLegacyAggKey(style.options.field.name); // Update legacy join agg key to new join agg key

            style.options.field.name = (0, _get_agg_key.getJoinAggKey)({
              aggType,
              aggFieldName,
              rightSourceId: joinDescriptor.right.id
            });
          }
        }
      });
    }
  });
  return { ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}