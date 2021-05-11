"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _jest = require("@kbn/test/jest");

var _page_content = require("../../public/application/components/page_content");

var _setup_environment = require("./setup_environment");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const testBedConfig = {
  doMountAsync: true
};

const setup = async overrides => {
  const initTestBed = (0, _jest.registerTestBed)((0, _setup_environment.WithAppDependencies)(_page_content.PageContent, overrides), testBedConfig);
  const testBed = await initTestBed();
  return testBed;
};

exports.setup = setup;