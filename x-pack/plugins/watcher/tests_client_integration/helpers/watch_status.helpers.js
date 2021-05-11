"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _testUtils = require("react-dom/test-utils");

var _jest = require("@kbn/test/jest");

var _watch_status = require("../../public/application/sections/watch_status/components/watch_status");

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
    initialEntries: [`${_constants.ROUTES.API_ROOT}/watches/watch/${_jest_constants.WATCH_ID}/status`],
    componentRoutePath: `${_constants.ROUTES.API_ROOT}/watches/watch/:id/status`
  },
  doMountAsync: true
};
const initTestBed = (0, _jest.registerTestBed)((0, _app_context.withAppContext)(_watch_status.WatchStatus), testBedConfig);

const setup = async () => {
  const testBed = await initTestBed();
  /**
   * User Actions
   */

  const selectTab = tab => {
    const tabs = ['execution history', 'action statuses'];
    testBed.find('tab').at(tabs.indexOf(tab)).simulate('click');
  };

  const clickToggleActivationButton = async () => {
    const {
      component
    } = testBed;
    const button = testBed.find('toggleWatchActivationButton');
    await (0, _testUtils.act)(async () => {
      button.simulate('click');
      component.update();
    });
  };

  const clickAcknowledgeButton = async index => {
    const {
      component,
      table
    } = testBed;
    const {
      rows
    } = table.getMetaData('watchActionStatusTable');
    const currentRow = rows[index];
    const lastColumn = currentRow.columns[currentRow.columns.length - 1].reactWrapper;
    const button = (0, _jest.findTestSubject)(lastColumn, 'acknowledgeWatchButton');
    await (0, _testUtils.act)(async () => {
      button.simulate('click');
      component.update();
    });
  };

  const clickDeleteWatchButton = async () => {
    const {
      component
    } = testBed;
    const button = testBed.find('deleteWatchButton');
    await (0, _testUtils.act)(async () => {
      button.simulate('click');
      component.update();
    });
  };

  const clickWatchExecutionAt = async (index, tableCellText) => {
    const {
      component,
      table
    } = testBed;
    const {
      rows
    } = table.getMetaData('watchHistoryTable');
    const currentRow = rows[index];
    const firstColumn = currentRow.columns[0].reactWrapper;
    const button = (0, _jest.findTestSubject)(firstColumn, `watchStartTimeColumn-${tableCellText}`);
    await (0, _testUtils.act)(async () => {
      button.simulate('click');
      await (0, _jest.delay)(100);
      component.update();
    });
  };

  return { ...testBed,
    actions: {
      selectTab,
      clickToggleActivationButton,
      clickAcknowledgeButton,
      clickDeleteWatchButton,
      clickWatchExecutionAt
    }
  };
};

exports.setup = setup;