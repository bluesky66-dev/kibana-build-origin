"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _testUtils = require("react-dom/test-utils");

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
    initialEntries: [`/indices?includeHiddenIndices=true`],
    componentRoutePath: `/:section(indices|data_streams)`
  },
  doMountAsync: true
};

const setup = async (overridingDependencies = {}) => {
  const initTestBed = (0, _jest.registerTestBed)((0, _helpers.WithAppDependencies)(_home.IndexManagementHome, overridingDependencies), testBedConfig);
  const testBed = await initTestBed();
  /**
   * User Actions
   */

  const clickIncludeHiddenIndicesToggle = () => {
    const {
      find
    } = testBed;
    find('indexTableIncludeHiddenIndicesToggle').simulate('click');
  };

  const getIncludeHiddenIndicesToggleStatus = () => {
    const {
      find
    } = testBed;
    const props = find('indexTableIncludeHiddenIndicesToggle').props();
    return Boolean(props['aria-checked']);
  };

  const selectIndexDetailsTab = async tab => {
    const indexDetailsTabs = ['settings', 'mappings', 'stats', 'edit_settings'];
    const {
      find,
      component
    } = testBed;
    await (0, _testUtils.act)(async () => {
      find('detailPanelTab').at(indexDetailsTabs.indexOf(tab)).simulate('click');
    });
    component.update();
  };

  const clickDataStreamAt = async index => {
    const {
      component,
      table,
      router
    } = testBed;
    const {
      rows
    } = table.getMetaData('indexTable');
    const dataStreamLink = (0, _jest.findTestSubject)(rows[index].reactWrapper, 'dataStreamLink');
    await (0, _testUtils.act)(async () => {
      router.navigateTo(dataStreamLink.props().href);
    });
    component.update();
  };

  const findDataStreamDetailPanel = () => {
    const {
      find
    } = testBed;
    return find('dataStreamDetailPanel');
  };

  const findDataStreamDetailPanelTitle = () => {
    const {
      find
    } = testBed;
    return find('dataStreamDetailPanelTitle').text();
  };

  return { ...testBed,
    actions: {
      selectIndexDetailsTab,
      getIncludeHiddenIndicesToggleStatus,
      clickIncludeHiddenIndicesToggle,
      clickDataStreamAt
    },
    findDataStreamDetailPanel,
    findDataStreamDetailPanelTitle
  };
};

exports.setup = setup;