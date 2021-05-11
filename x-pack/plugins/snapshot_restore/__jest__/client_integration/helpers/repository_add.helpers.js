"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _jest = require("@kbn/test/jest");

var _repository_add = require("../../../public/application/sections/repository_add");

var _setup_environment = require("./setup_environment");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initTestBed = (0, _jest.registerTestBed)((0, _setup_environment.WithAppDependencies)(_repository_add.RepositoryAdd), {
  doMountAsync: true
});

const setup = async () => {
  const testBed = await initTestBed(); // User actions

  const clickNextButton = () => {
    testBed.find('nextButton').simulate('click');
  };

  const clickBackButton = () => {
    testBed.find('backButton').simulate('click');
  };

  const clickSubmitButton = () => {
    testBed.find('submitButton').simulate('click');
  };

  const selectRepositoryType = type => {
    const button = testBed.find(`${type}RepositoryType`).find('button');

    if (!button.length) {
      throw new Error(`Repository type "${type}" button not found.`);
    }

    button.simulate('click');
  };

  return { ...testBed,
    actions: {
      clickNextButton,
      clickBackButton,
      clickSubmitButton,
      selectRepositoryType
    }
  };
};

exports.setup = setup;