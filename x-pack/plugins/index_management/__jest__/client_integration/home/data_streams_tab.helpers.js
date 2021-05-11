"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNonDataStreamIndex = exports.createDataStreamBackingIndex = exports.createDataStreamPayload = exports.setup = void 0;

var _testUtils = require("react-dom/test-utils");

var _eui = require("@elastic/eui");

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


const setup = async (overridingDependencies = {}) => {
  const testBedConfig = {
    store: () => (0, _store.indexManagementStore)(_helpers.services),
    memoryRouter: {
      initialEntries: [`/indices`],
      componentRoutePath: `/:section(indices|data_streams|templates)`
    },
    doMountAsync: true
  };
  const initTestBed = (0, _jest.registerTestBed)((0, _helpers.WithAppDependencies)(_home.IndexManagementHome, overridingDependencies), testBedConfig);
  const testBed = await initTestBed();
  /**
   * User Actions
   */

  const goToDataStreamsList = () => {
    testBed.find('data_streamsTab').simulate('click');
  };

  const findEmptyPromptIndexTemplateLink = () => {
    const {
      find
    } = testBed;
    const templateLink = find('dataStreamsEmptyPromptTemplateLink');
    return templateLink;
  };

  const clickEmptyPromptIndexTemplateLink = async () => {
    const {
      component,
      router
    } = testBed;
    await (0, _testUtils.act)(async () => {
      router.navigateTo(findEmptyPromptIndexTemplateLink().props().href);
    });
    component.update();
  };

  const clickIncludeStatsSwitch = () => {
    const {
      find
    } = testBed;
    find('includeStatsSwitch').simulate('click');
  };

  const toggleViewFilterAt = index => {
    const {
      find,
      component
    } = testBed;
    (0, _testUtils.act)(() => {
      find('viewButton').simulate('click');
    });
    component.update();
    (0, _testUtils.act)(() => {
      find('filterItem').at(index).simulate('click');
    });
    component.update();
  };

  const sortTableOnStorageSize = () => {
    const {
      find,
      component
    } = testBed;
    (0, _testUtils.act)(() => {
      find('tableHeaderCell_storageSizeBytes_3.tableHeaderSortButton').simulate('click');
    });
    component.update();
  };

  const clickReloadButton = () => {
    const {
      find
    } = testBed;
    find('reloadButton').simulate('click');
  };

  const findTestSubjectAt = (testSubject, index) => {
    const {
      table
    } = testBed;
    const {
      rows
    } = table.getMetaData('dataStreamTable');
    return (0, _jest.findTestSubject)(rows[index].reactWrapper, testSubject);
  };

  const clickIndicesAt = async index => {
    const {
      component,
      router
    } = testBed;
    const indicesLink = findTestSubjectAt('indicesLink', index);
    await (0, _testUtils.act)(async () => {
      router.navigateTo(indicesLink.props().href);
    });
    component.update();
  };

  const clickNameAt = async index => {
    const {
      component,
      router
    } = testBed;
    const nameLink = findTestSubjectAt('nameLink', index);
    await (0, _testUtils.act)(async () => {
      router.navigateTo(nameLink.props().href);
    });
    component.update();
  };

  const findDeleteActionAt = findTestSubjectAt.bind(null, 'deleteDataStream');

  const clickDeleteActionAt = index => {
    findDeleteActionAt(index).simulate('click');
  };

  const selectDataStream = (name, selected) => {
    const {
      form: {
        selectCheckBox
      }
    } = testBed;
    selectCheckBox(`checkboxSelectRow-${name}`, selected);
  };

  const findDeleteConfirmationModal = () => {
    const {
      find
    } = testBed;
    return find('deleteDataStreamsConfirmation');
  };

  const clickConfirmDelete = async () => {
    const modal = document.body.querySelector('[data-test-subj="deleteDataStreamsConfirmation"]');
    const confirmButton = modal.querySelector('[data-test-subj="confirmModalConfirmButton"]');
    await (0, _testUtils.act)(async () => {
      confirmButton.click();
    });
  };

  const clickDeleteDataStreamButton = () => {
    const {
      find
    } = testBed;
    find('deleteDataStreamButton').simulate('click');
  };

  const clickDetailPanelIndexTemplateLink = async () => {
    const {
      component,
      router,
      find
    } = testBed;
    const indexTemplateLink = find('indexTemplateLink');
    await (0, _testUtils.act)(async () => {
      router.navigateTo(indexTemplateLink.props().href);
    });
    component.update();
  };

  const findDetailPanel = () => {
    const {
      find
    } = testBed;
    return find('dataStreamDetailPanel');
  };

  const findDetailPanelTitle = () => {
    const {
      find
    } = testBed;
    return find('dataStreamDetailPanelTitle').text();
  };

  const findDetailPanelIlmPolicyLink = () => {
    const {
      find
    } = testBed;
    return find('ilmPolicyLink');
  };

  const findDetailPanelIndexTemplateLink = () => {
    const {
      find
    } = testBed;
    return find('indexTemplateLink');
  };

  const findDetailPanelIlmPolicyName = () => {
    const descriptionList = testBed.component.find(_eui.EuiDescriptionListDescription); // ilm policy is the last in the details list

    return descriptionList.last();
  };

  return { ...testBed,
    actions: {
      goToDataStreamsList,
      clickEmptyPromptIndexTemplateLink,
      clickIncludeStatsSwitch,
      toggleViewFilterAt,
      sortTableOnStorageSize,
      clickReloadButton,
      clickNameAt,
      clickIndicesAt,
      clickDeleteActionAt,
      selectDataStream,
      clickConfirmDelete,
      clickDeleteDataStreamButton,
      clickDetailPanelIndexTemplateLink
    },
    findDeleteActionAt,
    findDeleteConfirmationModal,
    findDetailPanel,
    findDetailPanelTitle,
    findEmptyPromptIndexTemplateLink,
    findDetailPanelIlmPolicyLink,
    findDetailPanelIlmPolicyName,
    findDetailPanelIndexTemplateLink
  };
};

exports.setup = setup;

const createDataStreamPayload = dataStream => ({
  name: 'my-data-stream',
  timeStampField: {
    name: '@timestamp'
  },
  indices: [{
    name: 'indexName',
    uuid: 'indexId'
  }],
  generation: 1,
  health: 'green',
  indexTemplateName: 'indexTemplate',
  storageSize: '1b',
  storageSizeBytes: 1,
  maxTimeStamp: 420,
  privileges: {
    delete_index: true
  },
  hidden: false,
  ...dataStream
});

exports.createDataStreamPayload = createDataStreamPayload;

const createDataStreamBackingIndex = (indexName, dataStreamName) => ({
  health: '',
  status: '',
  primary: '',
  replica: '',
  documents: '',
  documents_deleted: '',
  size: '',
  primary_size: '',
  name: indexName,
  data_stream: dataStreamName
});

exports.createDataStreamBackingIndex = createDataStreamBackingIndex;

const createNonDataStreamIndex = name => ({
  health: 'green',
  status: 'open',
  primary: 1,
  replica: 1,
  documents: 10000,
  documents_deleted: 100,
  size: '156kb',
  primary_size: '156kb',
  name
});

exports.createNonDataStreamIndex = createNonDataStreamIndex;