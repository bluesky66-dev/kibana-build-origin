"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _jest = require("@kbn/test/jest");

var _home = require("../../../public/application/sections/home");

var _store = require("../../../public/application/store");

var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const testBedConfig = {
  store: () => (0, _store.indexManagementStore)(_helpers.services),
  memoryRouter: {
    initialEntries: [`/indices?includeHidden=true`],
    componentRoutePath: `/:section(indices|templates)`
  },
  doMountAsync: true
};
const initTestBed = (0, _jest.registerTestBed)((0, _helpers.WithAppDependencies)(_home.IndexManagementHome), testBedConfig);

const setup = async () => {
  const testBed = await initTestBed();
  /**
   * User Actions
   */

  const selectHomeTab = tab => {
    testBed.find(tab).simulate('click');
  };

  return { ...testBed,
    actions: {
      selectHomeTab
    }
  };
};

exports.setup = setup;