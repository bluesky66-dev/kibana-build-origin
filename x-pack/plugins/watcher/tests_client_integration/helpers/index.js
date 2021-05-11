"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "nextTick", {
  enumerable: true,
  get: function () {
    return _jest.nextTick;
  }
});
Object.defineProperty(exports, "getRandomString", {
  enumerable: true,
  get: function () {
    return _jest.getRandomString;
  }
});
Object.defineProperty(exports, "findTestSubject", {
  enumerable: true,
  get: function () {
    return _jest.findTestSubject;
  }
});
Object.defineProperty(exports, "TestBed", {
  enumerable: true,
  get: function () {
    return _jest.TestBed;
  }
});
Object.defineProperty(exports, "wrapBodyResponse", {
  enumerable: true,
  get: function () {
    return _body_response.wrapBodyResponse;
  }
});
Object.defineProperty(exports, "unwrapBodyResponse", {
  enumerable: true,
  get: function () {
    return _body_response.unwrapBodyResponse;
  }
});
Object.defineProperty(exports, "setupEnvironment", {
  enumerable: true,
  get: function () {
    return _setup_environment.setupEnvironment;
  }
});
exports.pageHelpers = void 0;

var _watch_list = require("./watch_list.helpers");

var _watch_status = require("./watch_status.helpers");

var _watch_create_json = require("./watch_create_json.helpers");

var _watch_create_threshold = require("./watch_create_threshold.helpers");

var _watch_edit = require("./watch_edit.helpers");

var _jest = require("@kbn/test/jest");

var _body_response = require("./body_response");

var _setup_environment = require("./setup_environment");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const pageHelpers = {
  watchList: {
    setup: _watch_list.setup
  },
  watchStatus: {
    setup: _watch_status.setup
  },
  watchCreateJson: {
    setup: _watch_create_json.setup
  },
  watchCreateThreshold: {
    setup: _watch_create_threshold.setup
  },
  watchEdit: {
    setup: _watch_edit.setup
  }
};
exports.pageHelpers = pageHelpers;