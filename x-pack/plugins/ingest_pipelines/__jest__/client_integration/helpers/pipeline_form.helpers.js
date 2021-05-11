"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormActions = void 0;

var _testUtils = require("react-dom/test-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getFormActions = testBed => {
  const {
    find,
    form,
    component
  } = testBed; // User actions

  const clickSubmitButton = async () => {
    await (0, _testUtils.act)(async () => {
      find('submitButton').simulate('click');
    });
    component.update();
  };

  const clickShowRequestLink = async () => {
    await (0, _testUtils.act)(async () => {
      find('showRequestLink').simulate('click');
    });
    component.update();
  };

  const toggleVersionSwitch = () => {
    (0, _testUtils.act)(() => {
      form.toggleEuiSwitch('versionToggle');
    });
    component.update();
  };

  return {
    clickSubmitButton,
    clickShowRequestLink,
    toggleVersionSwitch
  };
};

exports.getFormActions = getFormActions;