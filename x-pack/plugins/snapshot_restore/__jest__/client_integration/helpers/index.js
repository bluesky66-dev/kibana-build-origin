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
Object.defineProperty(exports, "delay", {
  enumerable: true,
  get: function () {
    return _jest.delay;
  }
});
Object.defineProperty(exports, "setupEnvironment", {
  enumerable: true,
  get: function () {
    return _setup_environment.setupEnvironment;
  }
});
exports.pageHelpers = void 0;

require("./mocks");

var _home = require("./home.helpers");

var _repository_add = require("./repository_add.helpers");

var _repository_edit = require("./repository_edit.helpers");

var _policy_add = require("./policy_add.helpers");

var _policy_edit = require("./policy_edit.helpers");

var _restore_snapshot = require("./restore_snapshot.helpers");

var _jest = require("@kbn/test/jest");

var _setup_environment = require("./setup_environment");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const pageHelpers = {
  home: {
    setup: _home.setup
  },
  repositoryAdd: {
    setup: _repository_add.setup
  },
  repositoryEdit: {
    setup: _repository_edit.setup
  },
  policyAdd: {
    setup: _policy_add.setup
  },
  policyEdit: {
    setup: _policy_edit.setup
  },
  restoreSnapshot: {
    setup: _restore_snapshot.setup
  }
};
exports.pageHelpers = pageHelpers;