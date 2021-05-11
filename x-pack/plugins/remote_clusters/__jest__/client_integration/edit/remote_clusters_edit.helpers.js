"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = exports.REMOTE_CLUSTER_EDIT = exports.REMOTE_CLUSTER_EDIT_NAME = void 0;

var _jest = require("@kbn/test/jest");

var _remote_cluster_edit = require("../../../public/application/sections/remote_cluster_edit");

var _store = require("../../../public/application/store");

var _routing = require("../../../public/application/services/routing");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const REMOTE_CLUSTER_EDIT_NAME = 'new-york';
exports.REMOTE_CLUSTER_EDIT_NAME = REMOTE_CLUSTER_EDIT_NAME;
const REMOTE_CLUSTER_EDIT = {
  name: REMOTE_CLUSTER_EDIT_NAME,
  seeds: ['localhost:9400'],
  skipUnavailable: true
};
exports.REMOTE_CLUSTER_EDIT = REMOTE_CLUSTER_EDIT;
const testBedConfig = {
  store: _store.createRemoteClustersStore,
  memoryRouter: {
    onRouter: router => (0, _routing.registerRouter)(router),
    // The remote cluster name to edit is read from the router ":id" param
    // so we first set it in our initial entries
    initialEntries: [`/${REMOTE_CLUSTER_EDIT_NAME}`],
    // and then we declarae the :id param on the component route path
    componentRoutePath: '/:name'
  }
};
const setup = (0, _jest.registerTestBed)(_remote_cluster_edit.RemoteClusterEdit, testBedConfig);
exports.setup = setup;