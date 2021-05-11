"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GrokdebuggerResponse = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This model captures the grok debugger response from upstream to be passed to
 * the view
 */


class GrokdebuggerResponse {
  constructor(props) {
    this.structuredEvent = (0, _lodash.get)(props, 'structuredEvent', {});
    this.error = (0, _lodash.get)(props, 'error', {});
  } // generate GrokdebuggerResponse object from elasticsearch response


  static fromUpstreamJSON(upstreamGrokdebuggerResponse) {
    const docs = (0, _lodash.get)(upstreamGrokdebuggerResponse, 'docs');
    const error = docs[0].error;

    if (!(0, _lodash.isEmpty)(error)) {
      const opts = {
        error: _i18n.i18n.translate('xpack.grokDebugger.patternsErrorMessage', {
          defaultMessage: 'Provided {grokLogParsingTool} patterns do not match data in the input',
          values: {
            grokLogParsingTool: 'Grok'
          }
        })
      };
      return new GrokdebuggerResponse(opts);
    }

    const structuredEvent = (0, _lodash.omit)((0, _lodash.get)(docs, '0.doc._source'), 'rawEvent');
    const opts = {
      structuredEvent
    };
    return new GrokdebuggerResponse(opts);
  }

}

exports.GrokdebuggerResponse = GrokdebuggerResponse;