"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matrixHistogramFactory = exports.matrixHistogram = void 0;

var _fp = require("lodash/fp");

var _security_solution = require("../../../../../common/search_strategy/security_solution");

var _build_query = require("../../../../utils/build_query");

var _helpers = require("./helpers");

var _alerts = require("./alerts");

var _anomalies = require("./anomalies");

var _authentications = require("./authentications");

var _dns = require("./dns");

var _events = require("./events");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const matrixHistogramConfig = {
  [_security_solution.MatrixHistogramType.alerts]: _alerts.alertsMatrixHistogramConfig,
  [_security_solution.MatrixHistogramType.anomalies]: _anomalies.anomaliesMatrixHistogramConfig,
  [_security_solution.MatrixHistogramType.authentications]: _authentications.authenticationsMatrixHistogramConfig,
  [_security_solution.MatrixHistogramType.dns]: _dns.dnsMatrixHistogramConfig,
  [_security_solution.MatrixHistogramType.events]: _events.eventsMatrixHistogramConfig
};
const matrixHistogram = {
  buildDsl: options => {
    const myConfig = (0, _fp.getOr)(null, options.histogramType, matrixHistogramConfig);

    if (myConfig == null) {
      throw new Error(`This histogram type ${options.histogramType} is unknown to the server side`);
    }

    return myConfig.buildDsl(options);
  },
  parse: async (options, response) => {
    var _myConfig$parser;

    const myConfig = (0, _fp.getOr)(null, options.histogramType, matrixHistogramConfig);

    if (myConfig == null) {
      throw new Error(`This histogram type ${options.histogramType} is unknown to the server side`);
    }

    const totalCount = response.rawResponse.hits.total || 0;
    const matrixHistogramData = (0, _fp.getOr)([], myConfig.aggName, response.rawResponse);
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)(myConfig.buildDsl(options))]
    };
    const dataParser = (_myConfig$parser = myConfig.parser) !== null && _myConfig$parser !== void 0 ? _myConfig$parser : _helpers.getGenericData;
    return { ...response,
      inspect,
      matrixHistogramData: dataParser(matrixHistogramData, myConfig.parseKey),
      totalCount
    };
  }
};
exports.matrixHistogram = matrixHistogram;
const matrixHistogramFactory = {
  [_security_solution.MatrixHistogramQuery]: matrixHistogram
};
exports.matrixHistogramFactory = matrixHistogramFactory;