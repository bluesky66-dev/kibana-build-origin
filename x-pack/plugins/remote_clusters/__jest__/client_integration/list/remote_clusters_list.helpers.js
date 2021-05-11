"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _testUtils = require("react-dom/test-utils");

var _jest = require("@kbn/test/jest");

var _remote_cluster_list = require("../../../public/application/sections/remote_cluster_list");

var _store = require("../../../public/application/store");

var _routing = require("../../../public/application/services/routing");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const testBedConfig = {
  store: _store.createRemoteClustersStore,
  memoryRouter: {
    onRouter: router => (0, _routing.registerRouter)(router)
  }
};
const initTestBed = (0, _jest.registerTestBed)(_remote_cluster_list.RemoteClusterList, testBedConfig);

const setup = props => {
  const testBed = initTestBed(props);
  const EUI_TABLE = 'remoteClusterListTable'; // User actions

  const selectRemoteClusterAt = (index = 0) => {
    const {
      rows
    } = testBed.table.getMetaData(EUI_TABLE);
    const row = rows[index];
    const checkBox = row.reactWrapper.find('input').hostNodes();
    (0, _testUtils.act)(() => {
      checkBox.simulate('change', {
        target: {
          checked: true
        }
      });
    });
    testBed.component.update();
  };

  const clickBulkDeleteButton = () => {
    const {
      find,
      component
    } = testBed;
    (0, _testUtils.act)(() => {
      find('remoteClusterBulkDeleteButton').simulate('click');
    });
    component.update();
  };

  const clickRowActionButtonAt = (index = 0, action = 'delete') => {
    const {
      table,
      component
    } = testBed;
    const {
      rows
    } = table.getMetaData(EUI_TABLE);
    const indexLastColumn = rows[index].columns.length - 1;
    const tableCellActions = rows[index].columns[indexLastColumn].reactWrapper;
    let button;

    if (action === 'delete') {
      button = (0, _jest.findTestSubject)(tableCellActions, 'remoteClusterTableRowRemoveButton');
    } else if (action === 'edit') {
      button = (0, _jest.findTestSubject)(tableCellActions, 'remoteClusterTableRowEditButton');
    }

    if (!button) {
      throw new Error(`Button for action "${action}" not found.`);
    }

    (0, _testUtils.act)(() => {
      button.simulate('click');
    });
    component.update();
  };

  const clickConfirmModalDeleteRemoteCluster = () => {
    const {
      find,
      component
    } = testBed;
    const modal = find('remoteClustersDeleteConfirmModal');
    (0, _testUtils.act)(() => {
      (0, _jest.findTestSubject)(modal, 'confirmModalConfirmButton').simulate('click');
    });
    component.update();
  };

  const clickRemoteClusterAt = (index = 0) => {
    const {
      table,
      component
    } = testBed;
    const {
      rows
    } = table.getMetaData(EUI_TABLE);
    const remoteClusterLink = (0, _jest.findTestSubject)(rows[index].reactWrapper, 'remoteClustersTableListClusterLink');
    (0, _testUtils.act)(() => {
      remoteClusterLink.simulate('click');
    });
    component.update();
  };

  const clickPaginationNextButton = () => {
    const {
      find,
      component
    } = testBed;
    (0, _testUtils.act)(() => {
      find('remoteClusterListTable.pagination-button-next').simulate('click');
    });
    component.update();
  };

  return { ...testBed,
    actions: {
      selectRemoteClusterAt,
      clickBulkDeleteButton,
      clickRowActionButtonAt,
      clickConfirmModalDeleteRemoteCluster,
      clickRemoteClusterAt,
      clickPaginationNextButton
    }
  };
};

exports.setup = setup;