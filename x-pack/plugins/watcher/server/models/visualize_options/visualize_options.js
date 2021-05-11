"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisualizeOptions = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class VisualizeOptions {
  constructor(props) {
    this.rangeFrom = props.rangeFrom;
    this.rangeTo = props.rangeTo;
    this.interval = props.interval;
    this.timezone = props.timezone;
  } // generate ExecuteDetails object from kibana response


  static fromDownstreamJson(downstreamJson) {
    return new VisualizeOptions(downstreamJson);
  }

}

exports.VisualizeOptions = VisualizeOptions;