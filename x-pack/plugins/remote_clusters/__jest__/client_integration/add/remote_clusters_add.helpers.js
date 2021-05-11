"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _testUtils = require("react-dom/test-utils");

var _jest = require("@kbn/test/jest");

var _remote_cluster_add = require("../../../public/application/sections/remote_cluster_add");

var _store = require("../../../public/application/store");

var _routing = require("../../../public/application/services/routing");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const testBedConfig = {
  store: _store.createRemoteClustersStore,
  memoryRouter: {
    onRouter: router => (0, _routing.registerRouter)(router)
  }
};
const initTestBed = (0, _jest.registerTestBed)(_remote_cluster_add.RemoteClusterAdd, testBedConfig);

const setup = props => {
  const testBed = initTestBed(props); // User actions

  const clickSaveForm = async () => {
    await (0, _testUtils.act)(async () => {
      testBed.find('remoteClusterFormSaveButton').simulate('click');
    });
    testBed.component.update();
  };

  return { ...testBed,
    actions: {
      clickSaveForm
    }
  };
};

exports.setup = setup;