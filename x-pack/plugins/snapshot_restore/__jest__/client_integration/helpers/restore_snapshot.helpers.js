"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _testUtils = require("react-dom/test-utils");

var _jest = require("@kbn/test/jest");

var _restore_snapshot = require("../../../public/application/sections/restore_snapshot");

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
const initTestBed = (0, _jest.registerTestBed)((0, _setup_environment.WithAppDependencies)(_restore_snapshot.RestoreSnapshot), testBedConfig);

const setupActions = testBed => {
  const {
    find,
    component,
    form,
    exists
  } = testBed;
  return {
    findDataStreamCallout() {
      return find('dataStreamWarningCallOut');
    },

    canGoToADifferentStep() {
      const canGoNext = find('restoreSnapshotsForm.nextButton').props().disabled !== true;
      const canGoPrevious = exists('restoreSnapshotsForm.backButton') ? find('restoreSnapshotsForm.nextButton').props().disabled !== true : true;
      return canGoNext && canGoPrevious;
    },

    toggleModifyIndexSettings() {
      (0, _testUtils.act)(() => {
        form.toggleEuiSwitch('modifyIndexSettingsSwitch');
      });
      component.update();
    },

    toggleGlobalState() {
      (0, _testUtils.act)(() => {
        form.toggleEuiSwitch('includeGlobalStateSwitch');
      });
      component.update();
    },

    toggleIncludeAliases() {
      (0, _testUtils.act)(() => {
        form.toggleEuiSwitch('includeAliasesSwitch');
      });
      component.update();
    },

    goToStep(step) {
      while (--step > 0) {
        find('nextButton').simulate('click');
      }

      component.update();
    },

    async clickRestore() {
      await (0, _testUtils.act)(async () => {
        find('restoreButton').simulate('click');
      });
      component.update();
    }

  };
};

const setup = async () => {
  const testBed = await initTestBed();
  return { ...testBed,
    actions: setupActions(testBed)
  };
};

exports.setup = setup;