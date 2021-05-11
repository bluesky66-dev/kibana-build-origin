"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enrichSignalThreatMatches = exports.buildMatchedIndicator = exports.groupAndMergeSignalMatches = void 0;

var _lodash = require("lodash");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getSignalId = signal => signal._id;

const groupAndMergeSignalMatches = signalHits => {
  const dedupedHitsMap = signalHits.reduce((acc, signalHit) => {
    const signalId = getSignalId(signalHit);
    const existingSignalHit = acc[signalId];

    if (existingSignalHit == null) {
      acc[signalId] = signalHit;
    } else {
      var _existingSignalHit$ma, _signalHit$matched_qu;

      const existingQueries = (_existingSignalHit$ma = existingSignalHit === null || existingSignalHit === void 0 ? void 0 : existingSignalHit.matched_queries) !== null && _existingSignalHit$ma !== void 0 ? _existingSignalHit$ma : [];
      const newQueries = (_signalHit$matched_qu = signalHit.matched_queries) !== null && _signalHit$matched_qu !== void 0 ? _signalHit$matched_qu : [];
      existingSignalHit.matched_queries = [...existingQueries, ...newQueries];
      acc[signalId] = existingSignalHit;
    }

    return acc;
  }, {});
  const dedupedHits = Object.values(dedupedHitsMap);
  return dedupedHits;
};

exports.groupAndMergeSignalMatches = groupAndMergeSignalMatches;

const buildMatchedIndicator = ({
  queries,
  threats,
  indicatorPath
}) => queries.map(query => {
  var _flat$;

  const matchedThreat = threats.find(threat => threat._id === query.id);
  const indicatorValue = (0, _lodash.get)(matchedThreat === null || matchedThreat === void 0 ? void 0 : matchedThreat._source, indicatorPath);
  const indicator = (_flat$ = [indicatorValue].flat()[0]) !== null && _flat$ !== void 0 ? _flat$ : {};

  if (!(0, _lodash.isObject)(indicator)) {
    throw new Error(`Expected indicator field to be an object, but found: ${indicator}`);
  }

  const atomic = (0, _lodash.get)(matchedThreat === null || matchedThreat === void 0 ? void 0 : matchedThreat._source, query.value);
  const type = (0, _lodash.get)(indicator, 'type');
  return { ...indicator,
    matched: {
      atomic,
      field: query.field,
      id: query.id,
      index: query.index,
      type
    }
  };
});

exports.buildMatchedIndicator = buildMatchedIndicator;

const enrichSignalThreatMatches = async (signals, getMatchedThreats, indicatorPath) => {
  const signalHits = signals.hits.hits;

  if (signalHits.length === 0) {
    return signals;
  }

  const uniqueHits = groupAndMergeSignalMatches(signalHits);
  const signalMatches = uniqueHits.map(signalHit => (0, _utils.extractNamedQueries)(signalHit));
  const matchedThreatIds = [...new Set(signalMatches.flat().map(({
    id
  }) => id))];
  const matchedThreats = await getMatchedThreats(matchedThreatIds);
  const matchedIndicators = signalMatches.map(queries => buildMatchedIndicator({
    indicatorPath,
    queries,
    threats: matchedThreats
  }));
  const enrichedSignals = uniqueHits.map((signalHit, i) => {
    var _get, _get2;

    const threat = (_get = (0, _lodash.get)(signalHit._source, 'threat')) !== null && _get !== void 0 ? _get : {};

    if (!(0, _lodash.isObject)(threat)) {
      throw new Error(`Expected threat field to be an object, but found: ${threat}`);
    } // We are not using INDICATOR_DESTINATION_PATH here because the code above
    // and below make assumptions about its current value, 'threat.indicator',
    // and making this code dynamic on an arbitrary path would introduce several
    // new issues.


    const existingIndicatorValue = (_get2 = (0, _lodash.get)(signalHit._source, 'threat.indicator')) !== null && _get2 !== void 0 ? _get2 : [];
    const existingIndicators = [existingIndicatorValue].flat(); // ensure indicators is an array

    return { ...signalHit,
      _source: { ...signalHit._source,
        threat: { ...threat,
          indicator: [...existingIndicators, ...matchedIndicators[i]]
        }
      }
    };
  });
  return { ...signals,
    hits: { ...signals.hits,
      hits: enrichedSignals,
      total: (0, _lodash.isObject)(signals.hits.total) ? { ...signals.hits.total,
        value: enrichedSignals.length
      } : enrichedSignals.length
    }
  };
};

exports.enrichSignalThreatMatches = enrichSignalThreatMatches;