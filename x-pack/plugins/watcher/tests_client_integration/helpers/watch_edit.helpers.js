"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _jest = require("@kbn/test/jest");

var _watch_edit = require("../../public/application/sections/watch_edit/components/watch_edit");

var _navigation = require("../../public/application/lib/navigation");

var _constants = require("../../common/constants");

var _jest_constants = require("./jest_constants");

var _app_context = require("./app_context.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const testBedConfig = {
  memoryRouter: {
    onRouter: router => (0, _navigation.registerRouter)(router),
    initialEntries: [`${_constants.ROUTES.API_ROOT}/watches/watch/${_jest_constants.WATCH_ID}/edit`],
    componentRoutePath: `${_constants.ROUTES.API_ROOT}/watches/watch/:id/edit`
  },
  doMountAsync: true
};
const initTestBed = (0, _jest.registerTestBed)((0, _app_context.withAppContext)(_watch_edit.WatchEdit), testBedConfig);

const setup = async () => {
  const testBed = await initTestBed();
  /**
   * User Actions
   */

  const clickSubmitButton = () => {
    testBed.find('saveWatchButton').simulate('click');
  };

  return { ...testBed,
    actions: {
      clickSubmitButton
    }
  };
};

exports.setup = setup;