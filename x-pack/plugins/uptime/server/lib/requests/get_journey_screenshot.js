"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJourneyScreenshot = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getJourneyScreenshot = async ({
  uptimeEsClient,
  checkGroup,
  stepIndex
}) => {
  var _result$hits, _result$aggregations, _stepHit$synthetics$b, _stepHit$synthetics, _stepHit$synthetics$s, _stepHit$synthetics2, _stepHit$synthetics2$, _result$hits2;

  const params = {
    track_total_hits: true,
    size: 0,
    query: {
      bool: {
        filter: [{
          term: {
            'monitor.check_group': checkGroup
          }
        }, {
          term: {
            'synthetics.type': 'step/screenshot'
          }
        }]
      }
    },
    aggs: {
      step: {
        filter: {
          term: {
            'synthetics.step.index': stepIndex
          }
        },
        aggs: {
          image: {
            top_hits: {
              size: 1,
              _source: ['synthetics.blob', 'synthetics.step.name']
            }
          }
        }
      }
    }
  };
  const {
    body: result
  } = await uptimeEsClient.search({
    body: params
  });

  if ((result === null || result === void 0 ? void 0 : (_result$hits = result.hits) === null || _result$hits === void 0 ? void 0 : _result$hits.total.value) < 1) {
    return null;
  }

  const stepHit = result === null || result === void 0 ? void 0 : (_result$aggregations = result.aggregations) === null || _result$aggregations === void 0 ? void 0 : _result$aggregations.step.image.hits.hits[0]._source;
  return {
    blob: (_stepHit$synthetics$b = (_stepHit$synthetics = stepHit.synthetics) === null || _stepHit$synthetics === void 0 ? void 0 : _stepHit$synthetics.blob) !== null && _stepHit$synthetics$b !== void 0 ? _stepHit$synthetics$b : null,
    stepName: (_stepHit$synthetics$s = stepHit === null || stepHit === void 0 ? void 0 : (_stepHit$synthetics2 = stepHit.synthetics) === null || _stepHit$synthetics2 === void 0 ? void 0 : (_stepHit$synthetics2$ = _stepHit$synthetics2.step) === null || _stepHit$synthetics2$ === void 0 ? void 0 : _stepHit$synthetics2$.name) !== null && _stepHit$synthetics$s !== void 0 ? _stepHit$synthetics$s : '',
    totalSteps: result === null || result === void 0 ? void 0 : (_result$hits2 = result.hits) === null || _result$hits2 === void 0 ? void 0 : _result$hits2.total.value
  };
};

exports.getJourneyScreenshot = getJourneyScreenshot;