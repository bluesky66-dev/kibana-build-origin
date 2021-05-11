"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _testUtils = require("react-dom/test-utils");

var _jest = require("@kbn/test/jest");

var _template_list = require("../../../public/application/sections/home/template_list");

var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const testBedConfig = {
  memoryRouter: {
    initialEntries: [`/templates`],
    componentRoutePath: `/templates/:templateName?`
  },
  doMountAsync: true
};
const initTestBed = (0, _jest.registerTestBed)((0, _helpers.WithAppDependencies)(_template_list.TemplateList), testBedConfig);

const createActions = testBed => {
  /**
   * Additional helpers
   */
  const findAction = action => {
    const actions = ['edit', 'clone', 'delete'];
    const {
      component
    } = testBed;
    return component.find('.euiContextMenuItem').at(actions.indexOf(action));
  };
  /**
   * User Actions
   */


  const selectDetailsTab = async tab => {
    const tabs = ['summary', 'settings', 'mappings', 'aliases', 'preview'];
    await (0, _testUtils.act)(async () => {
      testBed.find('templateDetails.tab').at(tabs.indexOf(tab)).simulate('click');
    });
    testBed.component.update();
  };

  const clickReloadButton = () => {
    const {
      find
    } = testBed;
    find('reloadButton').simulate('click');
  };

  const clickActionMenu = templateName => {
    const {
      component
    } = testBed; // When a table has > 2 actions, EUI displays an overflow menu with an id "<template_name>-actions"
    // The template name may contain a period (.) so we use bracket syntax for selector

    (0, _testUtils.act)(() => {
      component.find(`div[id="${templateName}-actions"] button`).simulate('click');
    });
    component.update();
  };

  const clickTemplateAction = (templateName, action) => {
    const actions = ['edit', 'clone', 'delete'];
    const {
      component
    } = testBed;
    clickActionMenu(templateName);
    (0, _testUtils.act)(() => {
      component.find('.euiContextMenuItem').at(actions.indexOf(action)).simulate('click');
    });
    component.update();
  };

  const clickTemplateAt = async (index, isLegacy = false) => {
    const {
      component,
      table,
      router
    } = testBed;
    const {
      rows
    } = table.getMetaData(isLegacy ? 'legacyTemplateTable' : 'templateTable');
    const templateLink = (0, _jest.findTestSubject)(rows[index].reactWrapper, 'templateDetailsLink');
    const {
      href
    } = templateLink.props();
    await (0, _testUtils.act)(async () => {
      router.navigateTo(href);
    });
    component.update();
  };

  const clickCloseDetailsButton = () => {
    const {
      find
    } = testBed;
    find('closeDetailsButton').simulate('click');
  };

  const toggleViewItem = view => {
    const {
      find,
      component
    } = testBed;
    const views = ['managed', 'cloudManaged', 'system']; // First open the pop over

    (0, _testUtils.act)(() => {
      find('viewButton').simulate('click');
    });
    component.update(); // Then click on a filter item

    (0, _testUtils.act)(() => {
      find('filterList.filterItem').at(views.indexOf(view)).simulate('click');
    });
    component.update();
  };

  return {
    findAction,
    actions: {
      selectDetailsTab,
      clickReloadButton,
      clickTemplateAction,
      clickTemplateAt,
      clickCloseDetailsButton,
      clickActionMenu,
      toggleViewItem
    }
  };
};

const setup = async () => {
  const testBed = await initTestBed();
  return { ...testBed,
    ...createActions(testBed)
  };
};

exports.setup = setup;