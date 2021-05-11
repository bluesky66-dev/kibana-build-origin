"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAllValueListsFromUI = exports.importValueList = exports.checkListItemData = exports.uploadListItemData = exports.deleteValueList = exports.deleteValueLists = exports.exportValueList = exports.uploadValueList = exports.selectValueListType = exports.deleteValueListsFile = exports.selectValueListsFile = exports.closeValueListsModal = exports.openValueListsModal = exports.waitForValueListsModalToBeLoaded = exports.waitForListsIndexToBeCreated = void 0;

var _lists = require("../screens/lists");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const waitForListsIndexToBeCreated = () => {
  cy.request({
    url: '/api/lists/index',
    retryOnStatusCodeFailure: true
  }).then(response => {
    if (response.status !== 200) {
      cy.wait(7500);
    }
  });
};

exports.waitForListsIndexToBeCreated = waitForListsIndexToBeCreated;

const waitForValueListsModalToBeLoaded = () => {
  cy.get(_lists.VALUE_LISTS_MODAL_ACTIVATOR).should('exist');
  cy.get(_lists.VALUE_LISTS_MODAL_ACTIVATOR).should('not.be.disabled');
};

exports.waitForValueListsModalToBeLoaded = waitForValueListsModalToBeLoaded;

const openValueListsModal = () => {
  return cy.get(_lists.VALUE_LISTS_MODAL_ACTIVATOR).click();
};

exports.openValueListsModal = openValueListsModal;

const closeValueListsModal = () => {
  return cy.get(_lists.VALUE_LIST_CLOSE_BUTTON).click();
};

exports.closeValueListsModal = closeValueListsModal;

const selectValueListsFile = file => {
  return cy.get(_lists.VALUE_LIST_FILE_PICKER).attachFile(file).trigger('change', {
    force: true
  });
};

exports.selectValueListsFile = selectValueListsFile;

const deleteValueListsFile = file => {
  return cy.get((0, _lists.VALUE_LIST_DELETE_BUTTON)(file)).click();
};

exports.deleteValueListsFile = deleteValueListsFile;

const selectValueListType = type => {
  return cy.get(_lists.VALUE_LIST_TYPE_SELECTOR).select(type);
};

exports.selectValueListType = selectValueListType;

const uploadValueList = () => {
  return cy.get(_lists.VALUE_LIST_FILE_UPLOAD_BUTTON).click();
};

exports.uploadValueList = uploadValueList;

const exportValueList = () => {
  return cy.get(_lists.VALUE_LIST_EXPORT_BUTTON).click();
};
/**
 * Given an array of value lists this will delete them all using Cypress Request and the lists REST API
 * Ref: https://www.elastic.co/guide/en/security/current/lists-api-delete-container.html
 */


exports.exportValueList = exportValueList;

const deleteValueLists = lists => {
  return lists.map(list => deleteValueList(list));
};
/**
 * Given a single value list this will delete it using Cypress Request and lists REST API
 * Ref: https://www.elastic.co/guide/en/security/current/lists-api-delete-container.html
 */


exports.deleteValueLists = deleteValueLists;

const deleteValueList = list => {
  return cy.request({
    method: 'DELETE',
    url: `api/lists?id=${list}`,
    headers: {
      'kbn-xsrf': 'delete-lists'
    }
  });
};
/**
 * Uploads list items using Cypress Request and lists REST API.
 *
 * This also will remove any upload data such as empty strings that can happen from the fixture
 * due to extra lines being added from formatters such as prettier.
 * @param file The file name to import
 * @param type The type of the file import such as ip/keyword/text etc...
 * @param data The contents of the file
 * @param testSuggestions The type of test to use rather than the fixture file which is useful for ranges
 * Ref: https://www.elastic.co/guide/en/security/current/lists-api-import-list-items.html
 */


exports.deleteValueList = deleteValueList;

const uploadListItemData = (file, type, data) => {
  const removedEmptyLines = data.split('\n').filter(line => line.trim() !== '').join('\n');
  return cy.request({
    method: 'POST',
    url: `api/lists/items/_import?type=${type}`,
    encoding: 'binary',
    headers: {
      'kbn-xsrf': 'upload-value-lists',
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryJLrRH89J8QVArZyv'
    },
    body: `------WebKitFormBoundaryJLrRH89J8QVArZyv\nContent-Disposition: form-data; name="file"; filename="${file}"\n\n${removedEmptyLines}`
  });
};
/**
 * Checks a single value list file against a data set to ensure it has been uploaded.
 *
 * You can optionally pass in an array of test suggestions which will be useful for if you are
 * using a range such as a CIDR range and need to ensure that test range has been added to the
 * list but you cannot run an explicit test against that range.
 *
 * This also will remove any upload data such as empty strings that can happen from the fixture
 * due to extra lines being added from formatters.
 * @param file The file that was imported
 * @param data The contents to check unless testSuggestions is given.
 * @param type The type of the file import such as ip/keyword/text etc...
 * @param testSuggestions The type of test to use rather than the fixture file which is useful for ranges
 * Ref: https://www.elastic.co/guide/en/security/current/lists-api-import-list-items.html
 */


exports.uploadListItemData = uploadListItemData;

const checkListItemData = (file, data, testSuggestions) => {
  const importCheckLines = testSuggestions == null ? data.split('\n').filter(line => line.trim() !== '') : testSuggestions;
  return cy.wrap(importCheckLines).each(line => {
    return cy.request({
      retryOnStatusCodeFailure: true,
      method: 'GET',
      url: `api/lists/items?list_id=${file}&value=${line}`
    }).then(resp => {
      expect(resp.status).to.eq(200);
    });
  });
};
/**
 * Imports a single value list file this using Cypress Request and lists REST API. After it
 * imports the data, it will re-check and ensure that the data is there before continuing to
 * get us more deterministic.
 *
 * You can optionally pass in an array of test suggestions which will be useful for if you are
 * using a range such as a CIDR range and need to ensure that test range has been added to the
 * list but you cannot run an explicit test against that range.
 *
 * This also will remove any upload data such as empty strings that can happen from the fixture
 * due to extra lines being added from formatters.
 * @param file The file to import
 * @param type The type of the file import such as ip/keyword/text etc...
 * @param testSuggestions The type of test to use rather than the fixture file which is useful for ranges
 * Ref: https://www.elastic.co/guide/en/security/current/lists-api-import-list-items.html
 */


exports.checkListItemData = checkListItemData;

const importValueList = (file, type, testSuggestions = undefined) => {
  return cy.fixture(file).then(data => uploadListItemData(file, type, data)).fixture(file).then(data => checkListItemData(file, data, testSuggestions));
};
/**
 * If you are on the value lists from the UI, this will loop over all the HTML elements
 * that have action-delete-value-list-${list_name} and delete all of those value lists
 * using Cypress Request and the lists REST API.
 * If the UI does not contain any value based lists this will not fail. If the UI does
 * contain value based lists but the backend does not return a success on DELETE then this
 * will cause errors.
 * Ref: https://www.elastic.co/guide/en/security/current/lists-api-delete-container.html
 */


exports.importValueList = importValueList;

const deleteAllValueListsFromUI = () => {
  const lists = Cypress.$(_lists.VALUE_LIST_FILES).toArray().reduce((accum, $el) => {
    const attribute = $el.getAttribute('data-test-subj');

    if (attribute != null) {
      const list = attribute.substr('data-test-subj-value-list'.length);
      return [...accum, list];
    } else {
      return accum;
    }
  }, []);
  return deleteValueLists(lists);
};

exports.deleteAllValueListsFromUI = deleteAllValueListsFromUI;