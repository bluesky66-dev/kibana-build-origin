"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _jest = require("@kbn/test/jest");

var _template_clone = require("../../../public/application/sections/template_clone");

var _helpers = require("../helpers");

var _template_form = require("./template_form.helpers");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const testBedConfig = {
  memoryRouter: {
    initialEntries: [`/clone_template/${_constants.TEMPLATE_NAME}`],
    componentRoutePath: `/clone_template/:name`
  },
  doMountAsync: true
};
const initTestBed = (0, _jest.registerTestBed)((0, _helpers.WithAppDependencies)(_template_clone.TemplateClone), testBedConfig);

const setup = _template_form.formSetup.bind(null, initTestBed);

exports.setup = setup;