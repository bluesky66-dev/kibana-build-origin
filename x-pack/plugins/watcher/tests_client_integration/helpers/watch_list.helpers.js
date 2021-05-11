"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _testUtils = require("react-dom/test-utils");

var _jest = require("@kbn/test/jest");

var _watch_list = require("../../public/application/sections/watch_list/components/watch_list");

var _constants = require("../../common/constants");

var _app_context = require("./app_context.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const testBedConfig = {
  memoryRouter: {
    initialEntries: [`${_constants.ROUTES.API_ROOT}/watches`]
  },
  doMountAsync: true
};
const initTestBed = (0, _jest.registerTestBed)((0, _app_context.withAppContext)(_watch_list.WatchList), testBedConfig);

const setup = async () => {
  const testBed = await initTestBed();
  /**
   * User Actions
   */

  const selectWatchAt = index => {
    const {
      rows
    } = testBed.table.getMetaData('watchesTable');
    const row = rows[index];
    const checkBox = row.reactWrapper.find('input').hostNodes();
    checkBox.simulate('change', {
      target: {
        checked: true
      }
    });
  };

  const clickWatchAt = async index => {
    const {
      rows
    } = testBed.table.getMetaData('watchesTable');
    const watchesLink = (0, _jest.findTestSubject)(rows[index].reactWrapper, 'watchesLink');
    await (0, _testUtils.act)(async () => {
      const {
        href
      } = watchesLink.props();
      testBed.router.navigateTo(href);
      await (0, _jest.nextTick)();
      testBed.component.update();
    });
  };

  const clickWatchActionAt = async (index, action) => {
    const {
      component,
      table
    } = testBed;
    const {
      rows
    } = table.getMetaData('watchesTable');
    const currentRow = rows[index];
    const lastColumn = currentRow.columns[currentRow.columns.length - 1].reactWrapper;
    const button = (0, _jest.findTestSubject)(lastColumn, `${action}WatchButton`);
    await (0, _testUtils.act)(async () => {
      button.simulate('click');
      component.update();
    });
  };

  const searchWatches = term => {
    const {
      find,
      component
    } = testBed;
    const searchInput = find('watchesTableContainer').find('.euiFieldSearch'); // Enter input into the search box
    // @ts-ignore

    searchInput.instance().value = term;
    searchInput.simulate('keyup', {
      key: 'Enter',
      keyCode: 13,
      which: 13
    });
    component.update();
  };

  const advanceTimeToTableRefresh = async () => {
    const {
      component
    } = testBed;
    await (0, _testUtils.act)(async () => {
      // Advance timers to simulate another request
      jest.advanceTimersByTime(_constants.REFRESH_INTERVALS.WATCH_LIST);
    });
    component.update();
  };

  return { ...testBed,
    actions: {
      selectWatchAt,
      clickWatchAt,
      clickWatchActionAt,
      searchWatches,
      advanceTimeToTableRefresh
    }
  };
};

exports.setup = setup;