"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkCreateMlSignals = exports.transformAnomalyFieldsToEcs = void 0;

var _fp = require("lodash/fp");

var _setValue = _interopRequireDefault(require("set-value"));

var _single_bulk_create = require("./single_bulk_create");

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


const transformAnomalyFieldsToEcs = anomaly => {
  const {
    by_field_name: entityName,
    by_field_value: entityValue,
    influencers,
    timestamp
  } = anomaly;
  let errantFields = (influencers !== null && influencers !== void 0 ? influencers : []).map(influencer => ({
    name: influencer.influencer_field_name,
    value: influencer.influencer_field_values
  }));

  if (entityName && entityValue) {
    errantFields = [...errantFields, {
      name: entityName,
      value: [entityValue]
    }];
  }

  const omitDottedFields = (0, _fp.omit)(errantFields.map(field => field.name));
  const setNestedFields = errantFields.map(field => _anomaly => (0, _setValue.default)(_anomaly, field.name, field.value));

  const setTimestamp = _anomaly => (0, _setValue.default)(_anomaly, '@timestamp', new Date(timestamp).toISOString());

  return (0, _fp.flow)(omitDottedFields, setNestedFields, setTimestamp)(anomaly);
};

exports.transformAnomalyFieldsToEcs = transformAnomalyFieldsToEcs;

const transformAnomalyResultsToEcs = results => {
  const transformedHits = results.hits.hits.map(({
    _source,
    ...rest
  }) => ({ ...rest,
    _source: transformAnomalyFieldsToEcs(_source)
  }));
  return { ...results,
    hits: { ...results.hits,
      hits: transformedHits
    }
  };
};

const bulkCreateMlSignals = async params => {
  const anomalyResults = params.someResult;
  const ecsResults = transformAnomalyResultsToEcs(anomalyResults);
  const buildRuleMessage = params.buildRuleMessage;
  return (0, _single_bulk_create.singleBulkCreate)({ ...params,
    filteredEvents: ecsResults,
    buildRuleMessage
  });
};

exports.bulkCreateMlSignals = bulkCreateMlSignals;