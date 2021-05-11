"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateDatafeedFrequencyDefaultSeconds = calculateDatafeedFrequencyDefaultSeconds;
exports.hasRuntimeMappings = hasRuntimeMappings;
exports.isTimeSeriesViewJob = isTimeSeriesViewJob;
exports.isTimeSeriesViewDetector = isTimeSeriesViewDetector;
exports.isMappableJob = isMappableJob;
exports.isSourceDataChartableForDetector = isSourceDataChartableForDetector;
exports.isModelPlotChartableForDetector = isModelPlotChartableForDetector;
exports.getSingleMetricViewerJobErrorMessage = getSingleMetricViewerJobErrorMessage;
exports.getPartitioningFieldNames = getPartitioningFieldNames;
exports.isModelPlotEnabled = isModelPlotEnabled;
exports.isJobVersionGte = isJobVersionGte;
exports.mlFunctionToESAggregation = mlFunctionToESAggregation;
exports.isJobIdValid = isJobIdValid;
exports.prefixDatafeedId = prefixDatafeedId;
exports.getSafeAggregationName = getSafeAggregationName;
exports.uniqWithIsEqual = uniqWithIsEqual;
exports.basicJobValidation = basicJobValidation;
exports.basicDatafeedValidation = basicDatafeedValidation;
exports.basicJobAndDatafeedValidation = basicJobAndDatafeedValidation;
exports.validateModelMemoryLimit = validateModelMemoryLimit;
exports.validateModelMemoryLimitUnits = validateModelMemoryLimitUnits;
exports.validateGroupNames = validateGroupNames;
exports.parseTimeIntervalForJob = parseTimeIntervalForJob;
exports.getEarliestDatafeedStartTime = getEarliestDatafeedStartTime;
exports.getLatestDataOrBucketTimestamp = getLatestDataOrBucketTimestamp;
exports.processCreatedBy = processCreatedBy;
exports.splitIndexPatternNames = splitIndexPatternNames;
exports.resolveBucketSpanInSeconds = resolveBucketSpanInSeconds;
exports.ML_DATA_PREVIEW_COUNT = exports.ML_MEDIAN_PERCENTS = void 0;

var _lodash = require("lodash");

var _gte = _interopRequireDefault(require("semver/functions/gte"));

var _moment = _interopRequireDefault(require("moment"));

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _i18n = require("@kbn/i18n");

var _validation = require("../constants/validation");

var _parse_interval = require("./parse_interval");

var _validators = require("./validators");

var _new_job = require("../constants/new_job");

var _aggregation_types = require("../constants/aggregation_types");

var _field_types = require("../constants/field_types");

var _datafeed_utils = require("./datafeed_utils");

var _validation_utils = require("./validation_utils");

var _object_utils = require("./object_utils");

var _guards = require("../types/guards");

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
// @ts-ignore
// work out the default frequency based on the bucket_span in seconds


function calculateDatafeedFrequencyDefaultSeconds(bucketSpanSeconds) {
  let freq = 3600;

  if (bucketSpanSeconds <= 120) {
    freq = 60;
  } else if (bucketSpanSeconds <= 1200) {
    freq = Math.floor(bucketSpanSeconds / 2);
  } else if (bucketSpanSeconds <= 43200) {
    freq = 600;
  }

  return freq;
}

function hasRuntimeMappings(job) {
  const hasDatafeed = (0, _object_utils.isPopulatedObject)(job.datafeed_config);

  if (hasDatafeed) {
    return (0, _object_utils.isPopulatedObject)(job.datafeed_config.runtime_mappings);
  }

  return false;
}

function isTimeSeriesViewJob(job) {
  return getSingleMetricViewerJobErrorMessage(job) === undefined;
} // Returns a flag to indicate whether the detector at the index in the specified job
// is suitable for viewing in the Time Series dashboard.


function isTimeSeriesViewDetector(job, detectorIndex) {
  return isSourceDataChartableForDetector(job, detectorIndex) || isModelPlotChartableForDetector(job, detectorIndex);
} // Returns a flag to indicate whether the specified job is suitable for embedded map viewing.


function isMappableJob(job, detectorIndex) {
  let isMappable = false;
  const {
    detectors
  } = job.analysis_config;

  if (detectorIndex >= 0 && detectorIndex < detectors.length) {
    const dtr = detectors[detectorIndex];
    const functionName = dtr.function;
    isMappable = functionName === _aggregation_types.ML_JOB_AGGREGATION.LAT_LONG;
  }

  return isMappable;
} // Returns a flag to indicate whether the source data can be plotted in a time
// series chart for the specified detector.


function isSourceDataChartableForDetector(job, detectorIndex) {
  let isSourceDataChartable = false;
  const {
    detectors
  } = job.analysis_config;

  if (detectorIndex >= 0 && detectorIndex < detectors.length) {
    var _job$datafeed_config, _job$datafeed_config2;

    const dtr = detectors[detectorIndex];
    const functionName = dtr.function; // Check that the function maps to an ES aggregation,
    // and that the partitioning field isn't mlcategory
    // (since mlcategory is a derived field which won't exist in the source data).
    // Note that the 'function' field in a record contains what the user entered e.g. 'high_count',
    // whereas the 'function_description' field holds an ML-built display hint for function e.g. 'count'.

    isSourceDataChartable = mlFunctionToESAggregation(functionName) !== null && dtr.by_field_name !== _field_types.MLCATEGORY && dtr.partition_field_name !== _field_types.MLCATEGORY && dtr.over_field_name !== _field_types.MLCATEGORY; // If the datafeed uses script fields, we can only plot the time series if
    // model plot is enabled. Without model plot it will be very difficult or impossible
    // to invert to a reverse search of the underlying metric data.

    if (isSourceDataChartable === true && ((_job$datafeed_config = job.datafeed_config) === null || _job$datafeed_config === void 0 ? void 0 : _job$datafeed_config.script_fields) !== null && typeof ((_job$datafeed_config2 = job.datafeed_config) === null || _job$datafeed_config2 === void 0 ? void 0 : _job$datafeed_config2.script_fields) === 'object') {
      // Perform extra check to see if the detector is using a scripted field.
      const scriptFields = Object.keys(job.datafeed_config.script_fields);
      isSourceDataChartable = scriptFields.indexOf(dtr.partition_field_name) === -1 && scriptFields.indexOf(dtr.by_field_name) === -1 && scriptFields.indexOf(dtr.over_field_name) === -1;
    }

    const hasDatafeed = (0, _object_utils.isPopulatedObject)(job.datafeed_config);

    if (hasDatafeed) {
      // We cannot plot the source data for some specific aggregation configurations
      const aggs = (0, _datafeed_utils.getDatafeedAggregations)(job.datafeed_config);

      if (aggs !== undefined) {
        const aggBucketsName = (0, _datafeed_utils.getAggregationBucketsName)(aggs);

        if (aggBucketsName !== undefined) {
          var _getAggregations; // if fieldName is a aggregated field under nested terms using bucket_script


          const aggregations = (_getAggregations = (0, _datafeed_utils.getAggregations)(aggs[aggBucketsName])) !== null && _getAggregations !== void 0 ? _getAggregations : {};
          const foundField = (0, _validation_utils.findAggField)(aggregations, dtr.field_name, false);

          if ((foundField === null || foundField === void 0 ? void 0 : foundField.bucket_script) !== undefined) {
            return false;
          }
        }
      } // We also cannot plot the source data if they datafeed uses any field defined by runtime_mappings


      if (hasRuntimeMappings(job)) {
        return false;
      }
    }
  }

  return isSourceDataChartable;
} // Returns a flag to indicate whether model plot data can be plotted in a time
// series chart for the specified detector.


function isModelPlotChartableForDetector(job, detectorIndex) {
  var _job$model_plot_confi, _job$model_plot_confi2;

  let isModelPlotChartable = false;
  const modelPlotEnabled = (_job$model_plot_confi = (_job$model_plot_confi2 = job.model_plot_config) === null || _job$model_plot_confi2 === void 0 ? void 0 : _job$model_plot_confi2.enabled) !== null && _job$model_plot_confi !== void 0 ? _job$model_plot_confi : false;
  const {
    detectors
  } = job.analysis_config;

  if (detectorIndex >= 0 && detectorIndex < detectors.length && modelPlotEnabled) {
    const dtr = detectors[detectorIndex];
    const functionName = dtr.function; // Model plot can be charted for any of the functions which map to ES aggregations
    // (except rare, for which no model plot results are generated),
    // plus varp and info_content functions.

    isModelPlotChartable = functionName !== _aggregation_types.ML_JOB_AGGREGATION.RARE && (mlFunctionToESAggregation(functionName) !== null || [_aggregation_types.ML_JOB_AGGREGATION.VARP, _aggregation_types.ML_JOB_AGGREGATION.HIGH_VARP, _aggregation_types.ML_JOB_AGGREGATION.LOW_VARP, _aggregation_types.ML_JOB_AGGREGATION.INFO_CONTENT, _aggregation_types.ML_JOB_AGGREGATION.HIGH_INFO_CONTENT, _aggregation_types.ML_JOB_AGGREGATION.LOW_INFO_CONTENT].includes(functionName));
  }

  return isModelPlotChartable;
} // Returns a reason to indicate why the job configuration is not supported
// if the result is undefined, that means the single metric job should be viewable


function getSingleMetricViewerJobErrorMessage(job) {
  var _job$model_plot_confi3; // if job has runtime mappings with no model plot


  if (hasRuntimeMappings(job) && !((_job$model_plot_confi3 = job.model_plot_config) !== null && _job$model_plot_confi3 !== void 0 && _job$model_plot_confi3.enabled)) {
    return _i18n.i18n.translate('xpack.ml.timeSeriesJob.jobWithRunTimeMessage', {
      defaultMessage: 'the datafeed contains runtime fields and model plot is disabled'
    });
  } // only allow jobs with at least one detector whose function corresponds to
  // an ES aggregation which can be viewed in the single metric view and which
  // doesn't use a scripted field which can be very difficult or impossible to
  // invert to a reverse search, or when model plot has been enabled.


  const isChartableTimeSeriesViewJob = job.analysis_config.detectors.some((detector, idx) => isTimeSeriesViewDetector(job, idx));

  if (isChartableTimeSeriesViewJob === false) {
    return _i18n.i18n.translate('xpack.ml.timeSeriesJob.notViewableTimeSeriesJobMessage', {
      defaultMessage: 'not a viewable time series job'
    });
  }
} // Returns the names of the partition, by, and over fields for the detector with the
// specified index from the supplied ML job configuration.


function getPartitioningFieldNames(job, detectorIndex) {
  const fieldNames = [];
  const detector = job.analysis_config.detectors[detectorIndex];

  if (typeof detector.partition_field_name === 'string') {
    fieldNames.push(detector.partition_field_name);
  }

  if (typeof detector.by_field_name === 'string') {
    fieldNames.push(detector.by_field_name);
  }

  if (typeof detector.over_field_name === 'string') {
    fieldNames.push(detector.over_field_name);
  }

  return fieldNames;
} // Returns a flag to indicate whether model plot has been enabled for a job.
// If model plot is enabled for a job with a terms filter (comma separated
// list of partition or by field names), performs additional checks that
// the supplied entities contains 'by' and 'partition' fields in the detector,
// if configured, whose values are in the configured model_plot_config terms,
// where entityFields is in the format [{fieldName:status, fieldValue:404}].


function isModelPlotEnabled(job, detectorIndex, entityFields) {
  var _job$model_plot_confi4, _job$model_plot_confi5; // Check if model_plot_config is enabled.


  let isEnabled = (_job$model_plot_confi4 = (_job$model_plot_confi5 = job.model_plot_config) === null || _job$model_plot_confi5 === void 0 ? void 0 : _job$model_plot_confi5.enabled) !== null && _job$model_plot_confi4 !== void 0 ? _job$model_plot_confi4 : false;

  if (isEnabled && entityFields !== undefined && entityFields.length > 0) {
    var _job$model_plot_confi6, _job$model_plot_confi7; // If terms filter is configured in model_plot_config, check supplied entities.


    const termsStr = (_job$model_plot_confi6 = (_job$model_plot_confi7 = job.model_plot_config) === null || _job$model_plot_confi7 === void 0 ? void 0 : _job$model_plot_confi7.terms) !== null && _job$model_plot_confi6 !== void 0 ? _job$model_plot_confi6 : '';

    if (termsStr !== '') {
      // NB. Do not currently support empty string values as being valid 'by' or
      // 'partition' field values even though this is supported on the back-end.
      // If supplied, check both the by and partition entities are in the terms.
      const detector = job.analysis_config.detectors[detectorIndex];
      const detectorHasPartitionField = detector.hasOwnProperty('partition_field_name');
      const detectorHasByField = detector.hasOwnProperty('by_field_name');
      const terms = termsStr.split(',');

      if (detectorHasPartitionField) {
        const partitionEntity = entityFields.find(entityField => entityField.fieldName === detector.partition_field_name);
        isEnabled = (partitionEntity === null || partitionEntity === void 0 ? void 0 : partitionEntity.fieldValue) !== undefined && terms.indexOf(String(partitionEntity.fieldValue)) !== -1;
      }

      if (isEnabled === true && detectorHasByField === true) {
        const byEntity = entityFields.find(entityField => entityField.fieldName === detector.by_field_name);
        isEnabled = (byEntity === null || byEntity === void 0 ? void 0 : byEntity.fieldValue) !== undefined && terms.indexOf(String(byEntity.fieldValue)) !== -1;
      }
    }
  }

  return isEnabled;
} // Returns whether the version of the job (the version number of the elastic stack that the job was
// created with) is greater than or equal to the supplied version (e.g. '6.1.0').


function isJobVersionGte(job, version) {
  var _job$job_version;

  const jobVersion = (_job$job_version = job.job_version) !== null && _job$job_version !== void 0 ? _job$job_version : '0.0.0';
  return (0, _gte.default)(jobVersion, version);
} // Takes an ML detector 'function' and returns the corresponding ES aggregation name
// for querying metric data. Returns null if there is no suitable ES aggregation.
// Note that the 'function' field in a record contains what the user entered e.g. 'high_count',
// whereas the 'function_description' field holds an ML-built display hint for function e.g. 'count'.


function mlFunctionToESAggregation(functionName) {
  if (functionName === _aggregation_types.ML_JOB_AGGREGATION.MEAN || functionName === _aggregation_types.ML_JOB_AGGREGATION.HIGH_MEAN || functionName === _aggregation_types.ML_JOB_AGGREGATION.LOW_MEAN || functionName === _aggregation_types.ML_JOB_AGGREGATION.METRIC) {
    return _aggregation_types.ES_AGGREGATION.AVG;
  }

  if (functionName === _aggregation_types.ML_JOB_AGGREGATION.SUM || functionName === _aggregation_types.ML_JOB_AGGREGATION.HIGH_SUM || functionName === _aggregation_types.ML_JOB_AGGREGATION.LOW_SUM || functionName === _aggregation_types.ML_JOB_AGGREGATION.NON_NULL_SUM || functionName === _aggregation_types.ML_JOB_AGGREGATION.LOW_NON_NULL_SUM || functionName === _aggregation_types.ML_JOB_AGGREGATION.HIGH_NON_NULL_SUM) {
    return _aggregation_types.ES_AGGREGATION.SUM;
  }

  if (functionName === _aggregation_types.ML_JOB_AGGREGATION.COUNT || functionName === _aggregation_types.ML_JOB_AGGREGATION.HIGH_COUNT || functionName === _aggregation_types.ML_JOB_AGGREGATION.LOW_COUNT || functionName === _aggregation_types.ML_JOB_AGGREGATION.NON_ZERO_COUNT || functionName === _aggregation_types.ML_JOB_AGGREGATION.LOW_NON_ZERO_COUNT || functionName === _aggregation_types.ML_JOB_AGGREGATION.HIGH_NON_ZERO_COUNT) {
    return _aggregation_types.ES_AGGREGATION.COUNT;
  }

  if (functionName === _aggregation_types.ML_JOB_AGGREGATION.DISTINCT_COUNT || functionName === _aggregation_types.ML_JOB_AGGREGATION.LOW_DISTINCT_COUNT || functionName === _aggregation_types.ML_JOB_AGGREGATION.HIGH_DISTINCT_COUNT) {
    return _aggregation_types.ES_AGGREGATION.CARDINALITY;
  }

  if (functionName === _aggregation_types.ML_JOB_AGGREGATION.MEDIAN || functionName === _aggregation_types.ML_JOB_AGGREGATION.HIGH_MEDIAN || functionName === _aggregation_types.ML_JOB_AGGREGATION.LOW_MEDIAN) {
    return _aggregation_types.ES_AGGREGATION.PERCENTILES;
  }

  if (functionName === _aggregation_types.ML_JOB_AGGREGATION.MIN || functionName === _aggregation_types.ML_JOB_AGGREGATION.MAX) {
    return functionName;
  }

  if (functionName === _aggregation_types.ML_JOB_AGGREGATION.RARE) {
    return _aggregation_types.ES_AGGREGATION.COUNT;
  } // Return null if ML function does not map to an ES aggregation.
  // i.e. median, low_median, high_median, freq_rare,
  // varp, low_varp, high_varp, time_of_day, time_of_week, lat_long,
  // info_content, low_info_content, high_info_content


  return null;
} // Job name must contain lowercase alphanumeric (a-z and 0-9), hyphens or underscores;
// it must also start and end with an alphanumeric character'


function isJobIdValid(jobId) {
  return /^[a-z0-9\-\_]+$/g.test(jobId) && !/^([_-].*)?(.*[_-])?$/g.test(jobId);
} // To get median data for jobs and charts we need to use Elasticsearch's
// percentiles aggregation. This setting is used with the `percents` field
// of the percentiles aggregation to get the correct data.


const ML_MEDIAN_PERCENTS = '50.0'; // The number of preview items to show up in
// the Advanced Job Configuration data/datafeed preview tab

exports.ML_MEDIAN_PERCENTS = ML_MEDIAN_PERCENTS;
const ML_DATA_PREVIEW_COUNT = 10; // add a prefix to a datafeed id before the "datafeed-" part of the name

exports.ML_DATA_PREVIEW_COUNT = ML_DATA_PREVIEW_COUNT;

function prefixDatafeedId(datafeedId, prefix) {
  return datafeedId.match(/^datafeed-/) ? datafeedId.replace(/^datafeed-/, `datafeed-${prefix}`) : `datafeed-${prefix}${datafeedId}`;
} // Returns a name which is safe to use in elasticsearch aggregations for the supplied
// field name. Aggregation names must be alpha-numeric and can only contain '_' and '-' characters,
// so if the supplied field names contains disallowed characters, the provided index
// identifier is used to return a safe 'dummy' name in the format 'field_index' e.g. field_0, field_1


function getSafeAggregationName(fieldName, index) {
  return fieldName.match(/^[a-zA-Z0-9-_.]+$/) ? fieldName : `field_${index}`;
}

function uniqWithIsEqual(arr) {
  return arr.reduce((dedupedArray, value) => {
    if (dedupedArray.filter(compareValue => (0, _lodash.isEqual)(compareValue, value)).length === 0) {
      dedupedArray.push(value);
    }

    return dedupedArray;
  }, []);
} // check job without manipulating UI and return a list of messages
// job and fields get passed as arguments and are not accessed as $scope.* via the outer scope
// because the plan is to move this function to the common code area so that it can be used on the server side too.


function basicJobValidation(job, fields, limits, skipMmlChecks = false) {
  const messages = [];
  let valid = true;

  if (job) {
    // Job details
    if ((0, _lodash.isEmpty)(job.job_id)) {
      messages.push({
        id: 'job_id_empty'
      });
      valid = false;
    } else if (isJobIdValid(job.job_id) === false) {
      messages.push({
        id: 'job_id_invalid'
      });
      valid = false;
    } else if ((0, _validators.maxLengthValidator)(_validation.JOB_ID_MAX_LENGTH)(job.job_id)) {
      messages.push({
        id: 'job_id_invalid_max_length',
        maxLength: _validation.JOB_ID_MAX_LENGTH
      });
      valid = false;
    } else {
      messages.push({
        id: 'job_id_valid'
      });
    } // group names


    const {
      messages: groupsMessages,
      valid: groupsValid
    } = validateGroupNames(job);
    messages.push(...groupsMessages);
    valid = valid && groupsValid; // Analysis Configuration

    if (job.analysis_config.categorization_filters) {
      let v = true;
      (0, _lodash.each)(job.analysis_config.categorization_filters, d => {
        try {
          new RegExp(d);
        } catch (e) {
          v = false;
        }

        if (job.analysis_config.categorization_field_name === undefined || job.analysis_config.categorization_field_name === '') {
          v = false;
        }

        if (d === '') {
          v = false;
        }
      });

      if (v) {
        messages.push({
          id: 'categorization_filters_valid'
        });
      } else {
        messages.push({
          id: 'categorization_filters_invalid'
        });
        valid = false;
      }
    }

    let categorizerDetectorMissingPartitionField = false;

    if (job.analysis_config.detectors.length === 0) {
      messages.push({
        id: 'detectors_empty'
      });
      valid = false;
    } else {
      let v = true;
      (0, _lodash.each)(job.analysis_config.detectors, d => {
        var _job$analysis_config$;

        if ((0, _lodash.isEmpty)(d.function)) {
          v = false;
        } // if detector has an ml category, check if the partition_field is missing


        const needToHavePartitionFieldName = ((_job$analysis_config$ = job.analysis_config.per_partition_categorization) === null || _job$analysis_config$ === void 0 ? void 0 : _job$analysis_config$.enabled) === true && (d.by_field_name === _field_types.MLCATEGORY || d.over_field_name === _field_types.MLCATEGORY);

        if (needToHavePartitionFieldName && d.partition_field_name === undefined) {
          categorizerDetectorMissingPartitionField = true;
        }
      });

      if (v) {
        messages.push({
          id: 'detectors_function_not_empty'
        });
      } else {
        messages.push({
          id: 'detectors_function_empty'
        });
        valid = false;
      }

      if (categorizerDetectorMissingPartitionField) {
        messages.push({
          id: 'categorizer_detector_missing_per_partition_field'
        });
        valid = false;
      }
    }

    if (job.analysis_config.detectors.length >= 2) {
      // check if the detectors with mlcategory might have different per_partition_field values
      // if per_partition_categorization is enabled
      if (job.analysis_config.per_partition_categorization !== undefined) {
        if (job.analysis_config.per_partition_categorization.enabled || job.analysis_config.per_partition_categorization.stop_on_warn && Array.isArray(job.analysis_config.detectors) && job.analysis_config.detectors.length >= 2) {
          const categorizationDetectors = job.analysis_config.detectors.filter(d => d.by_field_name === _field_types.MLCATEGORY || d.over_field_name === _field_types.MLCATEGORY || d.partition_field_name === _field_types.MLCATEGORY);
          const uniqPartitions = [...new Set(categorizationDetectors.map(d => d.partition_field_name).filter(name => name !== undefined))];

          if (uniqPartitions.length > 1) {
            valid = false;
            messages.push({
              id: 'categorizer_varying_per_partition_fields',
              fields: uniqPartitions.join(', ')
            });
          }
        }
      } // check for duplicate detectors
      // create an array of objects with a subset of the attributes
      // where we want to make sure they are not be the same across detectors


      const compareSubSet = job.analysis_config.detectors.map(d => (0, _lodash.pick)(d, ['function', 'field_name', 'by_field_name', 'over_field_name', 'partition_field_name']));
      const dedupedSubSet = uniqWithIsEqual(compareSubSet);

      if (compareSubSet.length !== dedupedSubSet.length) {
        messages.push({
          id: 'detectors_duplicates'
        });
        valid = false;
      }
    } // we skip this influencer test because the client side form check is ignoring it
    // and the server side tests have their own influencer test
    // TODO: clarify if this is still needed or can be deleted

    /*
    if (job.analysis_config.influencers &&
      job.analysis_config.influencers.length === 0) {
      messages.push({ id: 'influencers_low' });
      valid = false;
    } else {
      messages.push({ id: 'success_influencers' });
    }
    */


    if (job.analysis_config.bucket_span === '' || job.analysis_config.bucket_span === undefined) {
      messages.push({
        id: 'bucket_span_empty'
      });
      valid = false;
    } else {
      if (isValidTimeInterval(job.analysis_config.bucket_span)) {
        messages.push({
          id: 'bucket_span_valid',
          bucketSpan: job.analysis_config.bucket_span
        });
      } else {
        messages.push({
          id: 'bucket_span_invalid'
        });
        valid = false;
      }
    } // Datafeed


    if (typeof fields !== 'undefined') {
      const loadedFields = Object.keys(fields);

      if (loadedFields.length === 0) {
        messages.push({
          id: 'index_fields_invalid'
        });
        valid = false;
      } else {
        messages.push({
          id: 'index_fields_valid'
        });
      }
    }

    if (skipMmlChecks === false) {
      // model memory limit
      const mml = job.analysis_limits && job.analysis_limits.model_memory_limit;
      const {
        messages: mmlUnitMessages,
        valid: mmlUnitValid
      } = validateModelMemoryLimitUnits(mml);
      messages.push(...mmlUnitMessages);
      valid = valid && mmlUnitValid;

      if (mmlUnitValid) {
        // if mml is a valid format,
        // run the validation against max mml
        const {
          messages: mmlMessages,
          valid: mmlValid
        } = validateModelMemoryLimit(job, limits);
        messages.push(...mmlMessages);
        valid = valid && mmlValid;
      }
    }
  } else {
    valid = false;
  }

  return {
    messages,
    valid,
    contains: id => messages.some(m => id === m.id),
    find: id => messages.find(m => id === m.id)
  };
}

function basicDatafeedValidation(datafeed) {
  const messages = [];
  let valid = true;

  if (datafeed) {
    let queryDelayMessage = {
      id: 'query_delay_valid'
    };

    if (isValidTimeInterval(datafeed.query_delay) === false) {
      queryDelayMessage = {
        id: 'query_delay_invalid'
      };
      valid = false;
    }

    messages.push(queryDelayMessage);
    let frequencyMessage = {
      id: 'frequency_valid'
    };

    if (isValidTimeInterval(datafeed.frequency) === false) {
      frequencyMessage = {
        id: 'frequency_invalid'
      };
      valid = false;
    }

    messages.push(frequencyMessage);
  }

  return {
    messages,
    valid,
    contains: id => messages.some(m => id === m.id),
    find: id => messages.find(m => id === m.id)
  };
}

function basicJobAndDatafeedValidation(job, datafeed) {
  const messages = [];
  let valid = true;

  if (datafeed && job) {
    var _job$analysis_config;

    const datafeedAggregations = (0, _datafeed_utils.getDatafeedAggregations)(datafeed);

    if (datafeedAggregations !== undefined && !((_job$analysis_config = job.analysis_config) !== null && _job$analysis_config !== void 0 && _job$analysis_config.summary_count_field_name)) {
      valid = false;
      messages.push({
        id: 'missing_summary_count_field_name'
      });
    }
  }

  return {
    messages,
    valid,
    contains: id => messages.some(m => id === m.id),
    find: id => messages.find(m => id === m.id)
  };
}

function validateModelMemoryLimit(job, limits) {
  const messages = [];
  let valid = true; // model memory limit

  if (typeof job.analysis_limits !== 'undefined' && typeof job.analysis_limits.model_memory_limit !== 'undefined') {
    if (typeof limits === 'object' && typeof limits.max_model_memory_limit !== 'undefined') {
      const max = limits.max_model_memory_limit.toUpperCase();
      const mml = job.analysis_limits.model_memory_limit.toUpperCase(); // @ts-ignore

      const mmlBytes = (0, _numeral.default)(mml).value(); // @ts-ignore

      const maxBytes = (0, _numeral.default)(max).value();

      if (mmlBytes > maxBytes) {
        messages.push({
          id: 'model_memory_limit_invalid'
        });
        valid = false;
      } else {
        messages.push({
          id: 'model_memory_limit_valid'
        });
      }
    }
  }

  return {
    valid,
    messages,
    contains: id => messages.some(m => id === m.id),
    find: id => messages.find(m => id === m.id)
  };
}

function validateModelMemoryLimitUnits(modelMemoryLimit) {
  const messages = [];
  let valid = true;

  if (modelMemoryLimit !== undefined) {
    const mml = String(modelMemoryLimit).toUpperCase();
    const mmlSplit = mml.match(/\d+(\w+)$/);
    const unit = mmlSplit && mmlSplit.length === 2 ? mmlSplit[1] : null;

    if (unit === null || _validation.ALLOWED_DATA_UNITS.indexOf(unit) === -1) {
      messages.push({
        id: 'model_memory_limit_units_invalid'
      });
      valid = false;
    } else {
      messages.push({
        id: 'model_memory_limit_units_valid'
      });
    }
  }

  return {
    valid,
    messages,
    contains: id => messages.some(m => id === m.id),
    find: id => messages.find(m => id === m.id)
  };
}

function validateGroupNames(job) {
  const {
    groups = []
  } = job;
  const errorMessages = [...(groups.some(group => !isJobIdValid(group)) ? [{
    id: 'job_group_id_invalid'
  }] : []), ...(groups.some(group => (0, _validators.maxLengthValidator)(_validation.JOB_ID_MAX_LENGTH)(group)) ? [{
    id: 'job_group_id_invalid_max_length'
  }] : [])];
  const valid = errorMessages.length === 0;
  const messages = valid && groups.length ? [{
    id: 'job_group_id_valid'
  }] : errorMessages;
  return {
    valid,
    messages,
    contains: id => messages.some(m => id === m.id),
    find: id => messages.find(m => id === m.id)
  };
}
/**
 * Parses the supplied string to a time interval suitable for use in an ML anomaly
 * detection job or datafeed.
 * @param value the string to parse
 * @return {Duration} the parsed interval, or null if it does not represent a valid
 * time interval.
 */


function parseTimeIntervalForJob(value) {
  if (value === undefined) {
    return null;
  } // Must be a valid interval, greater than zero,
  // and if specified in ms must be a multiple of 1000ms.


  const interval = (0, _parse_interval.parseInterval)(value, true);
  return interval !== null && interval.asMilliseconds() !== 0 && interval.milliseconds() === 0 ? interval : null;
} // Checks that the value for a field which represents a time interval,
// such as a job bucket span or datafeed query delay, is valid.


function isValidTimeInterval(value) {
  if (value === undefined) {
    return true;
  }

  return parseTimeIntervalForJob(value) !== null;
} // The earliest start time for the datafeed should be the max(latest_record_timestamp, latest_bucket.timestamp + bucket_span).


function getEarliestDatafeedStartTime(latestRecordTimestamp, latestBucketTimestamp, bucketSpan) {
  if (latestRecordTimestamp !== undefined && latestBucketTimestamp !== undefined) {
    // if bucket span is available (e.g. 15m) add it to the latest bucket timestamp in ms
    const adjustedBucketStartTime = bucketSpan ? (0, _moment.default)(latestBucketTimestamp).add(bucketSpan).valueOf() : latestBucketTimestamp;
    return Math.max(latestRecordTimestamp, adjustedBucketStartTime);
  } else {
    return latestRecordTimestamp !== undefined ? latestRecordTimestamp : latestBucketTimestamp;
  }
} // Returns the latest of the last source data and last processed bucket timestamp,
// as used for example in setting the end time of results views for cases where
// anomalies might have been raised after the point at which data ingest has stopped.


function getLatestDataOrBucketTimestamp(latestDataTimestamp, latestBucketTimestamp) {
  if (latestDataTimestamp !== undefined && latestBucketTimestamp !== undefined) {
    return Math.max(latestDataTimestamp, latestBucketTimestamp);
  } else {
    return latestDataTimestamp !== undefined ? latestDataTimestamp : latestBucketTimestamp;
  }
}
/**
 * If created_by is set in the job's custom_settings, remove it in case
 * it was created by a job wizard as the rules cannot currently be edited
 * in the job wizards and so would be lost in a clone.
 */


function processCreatedBy(customSettings) {
  if (Object.values(_new_job.CREATED_BY_LABEL).includes(customSettings.created_by)) {
    delete customSettings.created_by;
  }
}

function splitIndexPatternNames(indexPatternName) {
  return indexPatternName.includes(',') ? indexPatternName.split(',').map(i => i.trim()) : [indexPatternName];
}
/**
 * Resolves the longest bucket span from the list.
 * @param bucketSpans Collection of bucket spans
 */


function resolveBucketSpanInSeconds(bucketSpans) {
  return Math.max(...bucketSpans.map(b => (0, _parse_interval.parseInterval)(b)).filter(_guards.isDefined).map(v => v.asSeconds()));
}