"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GrokdebuggerRequest = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Model to capture Grokdebugger request with upstream (ES) helpers.
 */


class GrokdebuggerRequest {
  constructor(props) {
    this.rawEvent = (0, _lodash.get)(props, 'rawEvent', '');
    this.pattern = (0, _lodash.get)(props, 'pattern', '');
    this.customPatterns = (0, _lodash.get)(props, 'customPatterns', {});
  }

  get upstreamJSON() {
    return {
      pipeline: {
        description: 'this is a grokdebugger simulation',
        processors: [{
          grok: {
            field: 'rawEvent',
            pattern_definitions: this.customPatterns,
            patterns: [this.pattern.toString()]
          }
        }]
      },
      docs: [{
        _index: 'grokdebugger',
        _type: 'grokdebugger',
        _id: 'grokdebugger',
        _source: {
          rawEvent: this.rawEvent.toString()
        }
      }]
    };
  } // generate GrokdebuggerRequest object from kibana


  static fromDownstreamJSON(downstreamGrokdebuggerRequest) {
    const opts = {
      rawEvent: downstreamGrokdebuggerRequest.rawEvent,
      pattern: downstreamGrokdebuggerRequest.pattern,
      customPatterns: downstreamGrokdebuggerRequest.customPatterns
    };
    return new GrokdebuggerRequest(opts);
  }

}

exports.GrokdebuggerRequest = GrokdebuggerRequest;