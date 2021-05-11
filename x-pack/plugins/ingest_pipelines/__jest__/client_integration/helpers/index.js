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
Object.defineProperty(exports, "setupEnvironment", {
  enumerable: true,
  get: function () {
    return _setup_environment.setupEnvironment;
  }
});
exports.pageHelpers = void 0;

var _pipelines_list = require("./pipelines_list.helpers");

var _pipelines_create = require("./pipelines_create.helpers");

var _pipelines_clone = require("./pipelines_clone.helpers");

var _pipelines_edit = require("./pipelines_edit.helpers");

var _jest = require("@kbn/test/jest");

var _setup_environment = require("./setup_environment");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const pageHelpers = {
  pipelinesList: {
    setup: _pipelines_list.setup
  },
  pipelinesCreate: {
    setup: _pipelines_create.setup
  },
  pipelinesClone: {
    setup: _pipelines_clone.setup
  },
  pipelinesEdit: {
    setup: _pipelines_edit.setup
  }
};
exports.pageHelpers = pageHelpers;