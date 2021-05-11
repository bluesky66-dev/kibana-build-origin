"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldsServiceProvider = fieldsServiceProvider;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _moment = require("moment");

var _parse_interval = require("../../../common/util/parse_interval");

var _fields_aggs_cache = require("./fields_aggs_cache");

var _validation_utils = require("../../../common/util/validation_utils");

var _datafeed_utils = require("../../../common/util/datafeed_utils");

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

/**
 * Service for carrying out queries to obtain data
 * specific to fields in Elasticsearch indices.
 */


function fieldsServiceProvider({
  asCurrentUser
}) {
  const fieldsAggsCache = (0, _fields_aggs_cache.initCardinalityFieldsCache)();
  /**
   * Caps the time range to the last 90 days if necessary
   */

  function getSafeTimeRange(earliestMs, latestMs) {
    const capOffsetMs = (0, _moment.duration)(3, 'months').asMilliseconds();
    const capRangeStart = latestMs - capOffsetMs;
    return {
      start: Math.max(earliestMs, capRangeStart),
      end: latestMs
    };
  }
  /**
   * Gets aggregatable fields.
   */


  async function getAggregatableFields(index, fieldNames, datafeedConfig) {
    const {
      body
    } = await asCurrentUser.fieldCaps({
      index,
      fields: fieldNames
    });
    const aggregatableFields = [];
    const datafeedAggregations = (0, _datafeed_utils.getDatafeedAggregations)(datafeedConfig);
    fieldNames.forEach(fieldName => {
      if (typeof (datafeedConfig === null || datafeedConfig === void 0 ? void 0 : datafeedConfig.script_fields) === 'object' && datafeedConfig.script_fields.hasOwnProperty(fieldName)) {
        aggregatableFields.push(fieldName);
      }

      if (typeof (datafeedConfig === null || datafeedConfig === void 0 ? void 0 : datafeedConfig.runtime_mappings) === 'object' && datafeedConfig.runtime_mappings.hasOwnProperty(fieldName)) {
        aggregatableFields.push(fieldName);
      }

      if (datafeedAggregations !== undefined && (0, _validation_utils.isValidAggregationField)(datafeedAggregations, fieldName)) {
        aggregatableFields.push(fieldName);
      }

      const fieldInfo = body.fields[fieldName];
      const typeKeys = fieldInfo !== undefined ? Object.keys(fieldInfo) : [];

      if (typeKeys.length > 0) {
        const fieldType = typeKeys[0];
        const isFieldAggregatable = fieldInfo[fieldType].aggregatable;

        if (isFieldAggregatable === true) {
          aggregatableFields.push(fieldName);
        }
      }
    });
    return aggregatableFields;
  } // Obtains the cardinality of one or more fields.
  // Returns an Object whose keys are the names of the fields,
  // with values equal to the cardinality of the field.
  // Any of the supplied fieldNames which are not aggregatable will
  // be omitted from the returned Object.


  async function getCardinalityOfFields(index, fieldNames, query, timeFieldName, earliestMs, latestMs, datafeedConfig) {
    var _fieldsAggsCache$getV;

    const aggregatableFields = await getAggregatableFields(index, fieldNames, datafeedConfig); // getAggregatableFields doesn't account for scripted or aggregated fields

    if (aggregatableFields.length === 0) {
      return {};
    }

    const {
      start,
      end
    } = getSafeTimeRange(earliestMs, latestMs);
    const cachedValues = (_fieldsAggsCache$getV = fieldsAggsCache.getValues(index, timeFieldName, start, end, 'overallCardinality', fieldNames)) !== null && _fieldsAggsCache$getV !== void 0 ? _fieldsAggsCache$getV : {}; // No need to perform aggregation over the cached fields

    const fieldsToAgg = aggregatableFields.filter(field => !cachedValues.hasOwnProperty(field));

    if (fieldsToAgg.length === 0) {
      return cachedValues;
    } // Build the criteria to use in the bool filter part of the request.
    // Add criteria for the time range and the datafeed config query.


    const mustCriteria = [{
      range: {
        [timeFieldName]: {
          gte: start,
          lte: end,
          format: 'epoch_millis'
        }
      }
    }];

    if (query) {
      mustCriteria.push(query);
    }

    const runtimeMappings = {};
    const aggs = fieldsToAgg.reduce((obj, field) => {
      if (typeof (datafeedConfig === null || datafeedConfig === void 0 ? void 0 : datafeedConfig.script_fields) === 'object' && datafeedConfig.script_fields.hasOwnProperty(field)) {
        obj[field] = {
          cardinality: {
            script: datafeedConfig.script_fields[field].script
          }
        };
      } else if (typeof (datafeedConfig === null || datafeedConfig === void 0 ? void 0 : datafeedConfig.runtime_mappings) === 'object' && datafeedConfig.runtime_mappings.hasOwnProperty(field)) {
        obj[field] = {
          cardinality: {
            field
          }
        };
        runtimeMappings.runtime_mappings = datafeedConfig.runtime_mappings;
      } else {
        obj[field] = {
          cardinality: {
            field
          }
        };
      }

      return obj;
    }, {});
    const body = {
      query: {
        bool: {
          must: mustCriteria
        }
      },
      size: 0,
      _source: {
        excludes: []
      },
      aggs,
      ...runtimeMappings
    };
    const {
      body: {
        aggregations
      }
    } = await asCurrentUser.search({
      index,
      body
    });

    if (!aggregations) {
      return {};
    }

    const aggResult = fieldsToAgg.reduce((obj, field) => {
      obj[field] = (aggregations[field] || {
        value: 0
      }).value;
      return obj;
    }, {});
    fieldsAggsCache.updateValues(index, timeFieldName, start, end, {
      overallCardinality: aggResult
    });
    return { ...cachedValues,
      ...aggResult
    };
  }
  /**
   * Gets time boundaries of the index data based on the provided time field.
   */


  async function getTimeFieldRange(index, timeFieldName, query) {
    const obj = {
      success: true,
      start: {
        epoch: 0,
        string: ''
      },
      end: {
        epoch: 0,
        string: ''
      }
    };
    const {
      body: {
        aggregations
      }
    } = await asCurrentUser.search({
      index,
      size: 0,
      body: { ...(query ? {
          query
        } : {}),
        aggs: {
          earliest: {
            min: {
              field: timeFieldName
            }
          },
          latest: {
            max: {
              field: timeFieldName
            }
          }
        }
      }
    });

    if (aggregations && aggregations.earliest && aggregations.latest) {
      obj.start.epoch = aggregations.earliest.value;
      obj.start.string = aggregations.earliest.value_as_string;
      obj.end.epoch = aggregations.latest.value;
      obj.end.string = aggregations.latest.value_as_string;
    }

    return obj;
  }
  /**
   * Caps provided time boundaries based on the interval
   */


  function getSafeTimeRangeForInterval(interval, earliestMs, latestMs) {
    const maxNumberOfBuckets = 1000;
    const end = latestMs;
    const intervalDuration = (0, _parse_interval.parseInterval)(interval);

    if (intervalDuration === null) {
      throw _boom.default.badRequest('Interval is invalid');
    }

    const start = Math.max(earliestMs, latestMs - maxNumberOfBuckets * intervalDuration.asMilliseconds());
    return {
      start,
      end
    };
  }
  /**
   * Retrieves max cardinalities for provided fields from date interval buckets
   * using max bucket pipeline aggregation.
   *
   * @param index
   * @param fieldNames - fields to perform cardinality aggregation on
   * @param query
   * @param timeFieldName
   * @param earliestMs
   * @param latestMs
   * @param interval - a fixed interval for the date histogram aggregation
   */


  async function getMaxBucketCardinalities(index, fieldNames, query, timeFieldName, earliestMs, latestMs, interval, datafeedConfig) {
    var _fieldsAggsCache$getV2;

    if (!interval) {
      throw _boom.default.badRequest('Interval is required to retrieve max bucket cardinalities.');
    }

    const aggregatableFields = await getAggregatableFields(index, fieldNames, datafeedConfig);

    if (aggregatableFields.length === 0) {
      return {};
    }

    const {
      start,
      end
    } = getSafeTimeRangeForInterval(interval, ...Object.values(getSafeTimeRange(earliestMs, latestMs)));
    const cachedValues = (_fieldsAggsCache$getV2 = fieldsAggsCache.getValues(index, timeFieldName, start, end, 'maxBucketCardinality', fieldNames)) !== null && _fieldsAggsCache$getV2 !== void 0 ? _fieldsAggsCache$getV2 : {}; // No need to perform aggregation over the cached fields

    const fieldsToAgg = aggregatableFields.filter(field => !cachedValues.hasOwnProperty(field));

    if (fieldsToAgg.length === 0) {
      return cachedValues;
    }

    const mustCriteria = [{
      range: {
        [timeFieldName]: {
          gte: start,
          lte: end,
          format: 'epoch_millis'
        }
      }
    }];

    if (query) {
      mustCriteria.push(query);
    }

    const dateHistogramAggKey = 'bucket_span_buckets';
    /**
     * Replace any non-word characters
     */

    const getSafeAggName = field => field.replace(/\W/g, '');

    const getMaxBucketAggKey = field => `max_bucket_${field}`;

    const fieldsCardinalityAggs = fieldsToAgg.reduce((obj, field) => {
      obj[getSafeAggName(field)] = {
        cardinality: {
          field
        }
      };
      return obj;
    }, {});
    const maxBucketCardinalitiesAggs = Object.keys(fieldsCardinalityAggs).reduce((acc, field) => {
      acc[getMaxBucketAggKey(field)] = {
        max_bucket: {
          buckets_path: `${dateHistogramAggKey}>${field}`
        }
      };
      return acc;
    }, {});
    const body = {
      query: {
        bool: {
          filter: mustCriteria
        }
      },
      size: 0,
      aggs: {
        [dateHistogramAggKey]: {
          date_histogram: {
            field: timeFieldName,
            fixed_interval: interval
          },
          aggs: fieldsCardinalityAggs
        },
        ...maxBucketCardinalitiesAggs
      }
    };
    const {
      body: {
        aggregations
      }
    } = await asCurrentUser.search({
      index,
      body
    });

    if (!aggregations) {
      return cachedValues;
    }

    const aggResult = fieldsToAgg.reduce((obj, field) => {
      var _value;

      obj[field] = (_value = (aggregations[getMaxBucketAggKey(field)] || {
        value: 0
      }).value) !== null && _value !== void 0 ? _value : 0;
      return obj;
    }, {});
    fieldsAggsCache.updateValues(index, timeFieldName, start, end, {
      maxBucketCardinality: aggResult
    });
    return { ...cachedValues,
      ...aggResult
    };
  }

  return {
    getCardinalityOfFields,
    getTimeFieldRange,
    getMaxBucketCardinalities
  };
}