"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _jest = require("@kbn/test/jest");

var _policy_add = require("../../../public/application/sections/policy_add");

var _policy_form = require("./policy_form.helpers");

var _setup_environment = require("./setup_environment");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const testBedConfig = {
  memoryRouter: {
    initialEntries: ['/add_policy'],
    componentRoutePath: '/add_policy'
  },
  doMountAsync: true
};
const initTestBed = (0, _jest.registerTestBed)((0, _setup_environment.WithAppDependencies)(_policy_add.PolicyAdd), testBedConfig);

const setup = _policy_form.formSetup.bind(null, initTestBed);

exports.setup = setup;