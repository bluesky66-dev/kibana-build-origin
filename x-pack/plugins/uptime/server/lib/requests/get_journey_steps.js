"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJourneySteps = exports.formatSyntheticEvents = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const defaultEventTypes = ['step/end', 'stderr', 'cmd/status', 'step/screenshot'];

const formatSyntheticEvents = eventTypes => {
  if (!eventTypes) {
    return defaultEventTypes;
  } else {
    return Array.isArray(eventTypes) ? eventTypes : [eventTypes];
  }
};

exports.formatSyntheticEvents = formatSyntheticEvents;

const getJourneySteps = async ({
  uptimeEsClient,
  checkGroup,
  syntheticEventTypes
}) => {
  const params = {
    query: {
      bool: {
        filter: [{
          terms: {
            'synthetics.type': formatSyntheticEvents(syntheticEventTypes)
          }
        }, {
          term: {
            'monitor.check_group': checkGroup
          }
        }]
      }
    },
    sort: [{
      'synthetics.step.index': {
        order: 'asc'
      }
    }, {
      '@timestamp': {
        order: 'asc'
      }
    }],
    _source: {
      excludes: ['synthetics.blob']
    },
    size: 500
  };
  const {
    body: result
  } = await uptimeEsClient.search({
    body: params
  });
  const screenshotIndexes = result.hits.hits.filter(h => {
    var _synthetics;

    return ((_synthetics = (h === null || h === void 0 ? void 0 : h._source).synthetics) === null || _synthetics === void 0 ? void 0 : _synthetics.type) === 'step/screenshot';
  }).map(h => {
    var _synthetics2, _synthetics2$step;

    return (_synthetics2 = (h === null || h === void 0 ? void 0 : h._source).synthetics) === null || _synthetics2 === void 0 ? void 0 : (_synthetics2$step = _synthetics2.step) === null || _synthetics2$step === void 0 ? void 0 : _synthetics2$step.index;
  });
  return result.hits.hits.filter(h => {
    var _synthetics3;

    return ((_synthetics3 = (h === null || h === void 0 ? void 0 : h._source).synthetics) === null || _synthetics3 === void 0 ? void 0 : _synthetics3.type) !== 'step/screenshot';
  }).map(h => {
    const source = h._source;
    return { ...source,
      timestamp: source['@timestamp'],
      docId: h._id,
      synthetics: { ...source.synthetics,
        screenshotExists: screenshotIndexes.some(i => {
          var _source$synthetics, _source$synthetics$st;

          return i === ((_source$synthetics = source.synthetics) === null || _source$synthetics === void 0 ? void 0 : (_source$synthetics$st = _source$synthetics.step) === null || _source$synthetics$st === void 0 ? void 0 : _source$synthetics$st.index);
        })
      }
    };
  });
};

exports.getJourneySteps = getJourneySteps;