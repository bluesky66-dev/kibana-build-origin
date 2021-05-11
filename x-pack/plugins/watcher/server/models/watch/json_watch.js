"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsonWatch = void 0;

var _lodash = require("lodash");

var _base_watch = require("./base_watch");

var _constants = require("../../../common/constants");

var _serialization = require("../../../common/lib/serialization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class JsonWatch extends _base_watch.BaseWatch {
  // This constructor should not be used directly.
  // JsonWatch objects should be instantiated using the
  // fromUpstreamJson and fromDownstreamJson static methods
  constructor(props) {
    super(props);
    this.watch = props.watch;
  }

  get watchJson() {
    return (0, _serialization.serializeJsonWatch)(this.name, this.watch);
  } // To Kibana


  get downstreamJson() {
    const result = (0, _lodash.merge)({}, super.downstreamJson, {
      watch: this.watch
    });
    return result;
  } // From Elasticsearch


  static fromUpstreamJson(json, options) {
    const baseProps = super.getPropsFromUpstreamJson(json, options);
    const watch = (0, _lodash.cloneDeep)(baseProps.watchJson);

    if ((0, _lodash.has)(watch, 'metadata.name')) {
      delete watch.metadata.name;
    }

    if ((0, _lodash.has)(watch, 'metadata.xpack')) {
      delete watch.metadata.xpack;
    }

    if ((0, _lodash.isEmpty)(watch.metadata)) {
      delete watch.metadata;
    }

    const props = (0, _lodash.merge)({}, baseProps, {
      type: _constants.WATCH_TYPES.JSON,
      watch
    });
    return new JsonWatch(props);
  } // From Kibana


  static fromDownstreamJson(json) {
    const props = (0, _lodash.merge)({}, super.getPropsFromDownstreamJson(json), {
      type: _constants.WATCH_TYPES.JSON,
      watch: json.watch
    });
    return new JsonWatch(props);
  }

}

exports.JsonWatch = JsonWatch;