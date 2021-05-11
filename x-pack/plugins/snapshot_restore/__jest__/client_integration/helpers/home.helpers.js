"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _testUtils = require("react-dom/test-utils");

var _jest = require("@kbn/test/jest");

var _home = require("../../../public/application/sections/home/home");

var _constants = require("../../../public/application/constants");

var _setup_environment = require("./setup_environment");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const testBedConfig = {
  memoryRouter: {
    initialEntries: [`${_constants.BASE_PATH}/repositories`],
    componentRoutePath: `${_constants.BASE_PATH}/:section(repositories|snapshots)/:repositoryName?/:snapshotId*`
  },
  doMountAsync: true
};
const initTestBed = (0, _jest.registerTestBed)((0, _setup_environment.WithAppDependencies)(_home.SnapshotRestoreHome), testBedConfig);

const setup = async () => {
  const testBed = await initTestBed();
  const REPOSITORY_TABLE = 'repositoryTable';
  const SNAPSHOT_TABLE = 'snapshotTable';
  const {
    find,
    table,
    router,
    component
  } = testBed;
  /**
   * User Actions
   */

  const clickReloadButton = () => {
    find('reloadButton').simulate('click');
  };

  const selectRepositoryAt = index => {
    const {
      rows
    } = table.getMetaData(REPOSITORY_TABLE);
    const row = rows[index];
    const checkBox = row.reactWrapper.find('input').hostNodes();
    checkBox.simulate('change', {
      target: {
        checked: true
      }
    });
  };

  const clickRepositoryAt = async index => {
    const {
      rows
    } = table.getMetaData(REPOSITORY_TABLE);
    const repositoryLink = (0, _jest.findTestSubject)(rows[index].reactWrapper, 'repositoryLink');
    await (0, _testUtils.act)(async () => {
      const {
        href
      } = repositoryLink.props();
      router.navigateTo(href);
      await (0, _jest.delay)(10);
      component.update();
    });
  };

  const clickRepositoryActionAt = async (index, action) => {
    const {
      rows
    } = table.getMetaData('repositoryTable');
    const currentRow = rows[index];
    const lastColumn = currentRow.columns[currentRow.columns.length - 1].reactWrapper;
    const button = (0, _jest.findTestSubject)(lastColumn, `${action}RepositoryButton`);
    await (0, _testUtils.act)(async () => {
      button.simulate('click');
      component.update();
    });
  };

  const clickSnapshotAt = async index => {
    const {
      rows
    } = table.getMetaData(SNAPSHOT_TABLE);
    const snapshotLink = (0, _jest.findTestSubject)(rows[index].reactWrapper, 'snapshotLink');
    await (0, _testUtils.act)(async () => {
      const {
        href
      } = snapshotLink.props();
      router.navigateTo(href);
      await (0, _jest.delay)(100);
      component.update();
    });
  };

  const selectTab = tab => {
    const tabs = ['snapshots', 'repositories'];
    testBed.find(`${tab}_tab`).at(tabs.indexOf(tab)).simulate('click');
  };

  const selectSnapshotDetailTab = tab => {
    const tabs = ['summary', 'failedIndices'];
    testBed.find('snapshotDetail.tab').at(tabs.indexOf(tab)).simulate('click');
  };

  return { ...testBed,
    actions: {
      clickReloadButton,
      selectRepositoryAt,
      clickRepositoryAt,
      clickRepositoryActionAt,
      clickSnapshotAt,
      selectTab,
      selectSnapshotDetailTab
    }
  };
};

exports.setup = setup;