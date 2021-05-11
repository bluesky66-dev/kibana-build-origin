"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexPatterns = getIndexPatterns;

var _ccs_utils = require("../ccs_utils");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getIndexPatterns(server, additionalPatterns = {}, ccs = '*') {
  const config = server.config();
  const esIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_ELASTICSEARCH, ccs);
  const kbnIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_KIBANA, ccs);
  const lsIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_LOGSTASH, ccs);
  const beatsIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_BEATS, ccs);
  const apmIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_BEATS, ccs);
  const alertsIndex = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_ALERTS, ccs);
  const indexPatterns = {
    esIndexPattern,
    kbnIndexPattern,
    lsIndexPattern,
    beatsIndexPattern,
    apmIndexPattern,
    alertsIndex,
    ...Object.keys(additionalPatterns).reduce((accum, varName) => {
      return { ...accum,
        [varName]: (0, _ccs_utils.prefixIndexPattern)(config, additionalPatterns[varName], ccs)
      };
    }, {})
  };
  return indexPatterns;
}