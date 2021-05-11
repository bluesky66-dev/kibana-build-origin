"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _testUtils = require("react-dom/test-utils");

var _jest = require("@kbn/test/jest");

var _pipelines_list = require("../../../public/application/sections/pipelines_list");

var _setup_environment = require("./setup_environment");

var _navigation = require("../../../public/application/services/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const testBedConfig = {
  memoryRouter: {
    initialEntries: [(0, _navigation.getListPath)()],
    componentRoutePath: _navigation.ROUTES.list
  },
  doMountAsync: true
};
const initTestBed = (0, _jest.registerTestBed)((0, _setup_environment.WithAppDependencies)(_pipelines_list.PipelinesList), testBedConfig);

const createActions = testBed => {
  /**
   * User Actions
   */
  const clickReloadButton = async () => {
    const {
      component,
      find
    } = testBed;
    await (0, _testUtils.act)(async () => {
      find('reloadButton').simulate('click');
    });
    component.update();
  };

  const clickPipelineAt = async index => {
    const {
      component,
      table,
      router
    } = testBed;
    const {
      rows
    } = table.getMetaData('pipelinesTable');
    const pipelineLink = (0, _jest.findTestSubject)(rows[index].reactWrapper, 'pipelineDetailsLink');
    await (0, _testUtils.act)(async () => {
      const {
        href
      } = pipelineLink.props();
      router.navigateTo(href);
    });
    component.update();
  };

  const clickActionMenu = pipelineName => {
    const {
      component
    } = testBed;
    (0, _testUtils.act)(() => {
      // When a table has > 2 actions, EUI displays an overflow menu with an id "<pipeline_name>-actions"
      component.find(`div[id="${pipelineName}-actions"] button`).simulate('click');
    });
    component.update();
  };

  const clickPipelineAction = (pipelineName, action) => {
    const actions = ['edit', 'clone', 'delete'];
    const {
      component
    } = testBed;
    clickActionMenu(pipelineName);
    (0, _testUtils.act)(() => {
      component.find('.euiContextMenuItem').at(actions.indexOf(action)).simulate('click');
    });
    component.update();
  };

  return {
    clickReloadButton,
    clickPipelineAt,
    clickPipelineAction,
    clickActionMenu
  };
};

const setup = async () => {
  const testBed = await initTestBed();
  return { ...testBed,
    actions: createActions(testBed)
  };
};

exports.setup = setup;