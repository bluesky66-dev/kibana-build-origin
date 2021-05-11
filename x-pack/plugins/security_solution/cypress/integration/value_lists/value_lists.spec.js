"use strict";

var _test = require("../../../common/test");

var _login = require("../../tasks/login");

var _navigation = require("../../urls/navigation");

var _alerts = require("../../tasks/alerts");

var _lists = require("../../tasks/lists");

var _lists2 = require("../../screens/lists");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('value lists', () => {
  describe('management modal', () => {
    beforeEach(() => {
      (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
      (0, _alerts.waitForAlertsPanelToBeLoaded)();
      (0, _alerts.waitForAlertsIndexToBeCreated)();
      (0, _lists.waitForListsIndexToBeCreated)();
      (0, _alerts.goToManageAlertsDetectionRules)();
      (0, _lists.waitForValueListsModalToBeLoaded)();
    });
    afterEach(() => {
      (0, _lists.deleteAllValueListsFromUI)();
    });
    it('can open and close the modal', () => {
      (0, _lists.openValueListsModal)();
      (0, _lists.closeValueListsModal)();
    });
    describe('create list types', () => {
      beforeEach(() => {
        (0, _lists.openValueListsModal)();
      });
      it('creates a "keyword" list from an uploaded file', () => {
        const listName = 'value_list.txt';
        (0, _lists.selectValueListType)('keyword');
        (0, _lists.selectValueListsFile)(listName);
        (0, _lists.uploadValueList)();
        cy.get(_lists2.VALUE_LISTS_TABLE).find(_lists2.VALUE_LISTS_ROW).should($row => {
          expect($row.text()).to.contain(listName);
          expect($row.text()).to.contain('Keywords');
        });
      });
      it('creates a "text" list from an uploaded file', () => {
        const listName = 'value_list.txt';
        (0, _lists.selectValueListType)('text');
        (0, _lists.selectValueListsFile)(listName);
        (0, _lists.uploadValueList)();
        cy.get(_lists2.VALUE_LISTS_TABLE).find(_lists2.VALUE_LISTS_ROW).should($row => {
          expect($row.text()).to.contain(listName);
          expect($row.text()).to.contain('Text');
        });
      });
      it('creates a "ip" list from an uploaded file', () => {
        const listName = 'ip_list.txt';
        (0, _lists.selectValueListType)('ip');
        (0, _lists.selectValueListsFile)(listName);
        (0, _lists.uploadValueList)();
        cy.get(_lists2.VALUE_LISTS_TABLE).find(_lists2.VALUE_LISTS_ROW).should($row => {
          expect($row.text()).to.contain(listName);
          expect($row.text()).to.contain('IP addresses');
        });
      });
      it('creates a "ip_range" list from an uploaded file', () => {
        const listName = 'cidr_list.txt';
        (0, _lists.selectValueListType)('ip_range');
        (0, _lists.selectValueListsFile)(listName);
        (0, _lists.uploadValueList)();
        cy.get(_lists2.VALUE_LISTS_TABLE).find(_lists2.VALUE_LISTS_ROW).should($row => {
          expect($row.text()).to.contain(listName);
          expect($row.text()).to.contain('IP ranges');
        });
      });
    });
    describe('delete list types', () => {
      it('deletes a "keyword" list from an uploaded file', () => {
        const listName = 'value_list.txt';
        (0, _lists.importValueList)(listName, 'keyword');
        (0, _lists.openValueListsModal)();
        (0, _lists.deleteValueListsFile)(listName);
        cy.get(_lists2.VALUE_LISTS_TABLE).find(_lists2.VALUE_LISTS_ROW).should($row => {
          expect($row.text()).not.to.contain(listName);
        });
      });
      it('deletes a "text" list from an uploaded file', () => {
        const listName = 'value_list.txt';
        (0, _lists.importValueList)(listName, 'text');
        (0, _lists.openValueListsModal)();
        (0, _lists.deleteValueListsFile)(listName);
        cy.get(_lists2.VALUE_LISTS_TABLE).find(_lists2.VALUE_LISTS_ROW).should($row => {
          expect($row.text()).not.to.contain(listName);
        });
      });
      it('deletes a "ip" from an uploaded file', () => {
        const listName = 'ip_list.txt';
        (0, _lists.importValueList)(listName, 'ip');
        (0, _lists.openValueListsModal)();
        (0, _lists.deleteValueListsFile)(listName);
        cy.get(_lists2.VALUE_LISTS_TABLE).find(_lists2.VALUE_LISTS_ROW).should($row => {
          expect($row.text()).not.to.contain(listName);
        });
      });
      it('deletes a "ip_range" from an uploaded file', () => {
        const listName = 'cidr_list.txt';
        (0, _lists.importValueList)(listName, 'ip_range', ['192.168.100.0']);
        (0, _lists.openValueListsModal)();
        (0, _lists.deleteValueListsFile)(listName);
        cy.get(_lists2.VALUE_LISTS_TABLE).find(_lists2.VALUE_LISTS_ROW).should($row => {
          expect($row.text()).not.to.contain(listName);
        });
      });
    });
    describe('export list types', () => {
      it('exports a "keyword" list from an uploaded file', () => {
        const listName = 'value_list.txt';
        cy.intercept('POST', `/api/lists/items/_export?list_id=${listName}`).as('exportList');
        (0, _lists.importValueList)('value_list.txt', 'keyword');
        (0, _lists.openValueListsModal)();
        (0, _lists.exportValueList)();
        cy.wait('@exportList').then(({
          response
        }) => {
          cy.fixture(listName).then(list => {
            const [lineOne, lineTwo] = list.split('\n');
            expect(response.body).to.contain(lineOne);
            expect(response.body).to.contain(lineTwo);
          });
        });
      });
      it('exports a "text" list from an uploaded file', () => {
        const listName = 'value_list.txt';
        cy.intercept('POST', `/api/lists/items/_export?list_id=${listName}`).as('exportList');
        (0, _lists.importValueList)(listName, 'text');
        (0, _lists.openValueListsModal)();
        (0, _lists.exportValueList)();
        cy.wait('@exportList').then(({
          response
        }) => {
          cy.fixture(listName).then(list => {
            const [lineOne, lineTwo] = list.split('\n');
            expect(response.body).to.contain(lineOne);
            expect(response.body).to.contain(lineTwo);
          });
        });
      });
      it('exports a "ip" list from an uploaded file', () => {
        const listName = 'ip_list.txt';
        cy.intercept('POST', `/api/lists/items/_export?list_id=${listName}`).as('exportList');
        (0, _lists.importValueList)(listName, 'ip');
        (0, _lists.openValueListsModal)();
        (0, _lists.exportValueList)();
        cy.wait('@exportList').then(({
          response
        }) => {
          cy.fixture(listName).then(list => {
            const [lineOne, lineTwo] = list.split('\n');
            expect(response.body).to.contain(lineOne);
            expect(response.body).to.contain(lineTwo);
          });
        });
      });
      it('exports a "ip_range" list from an uploaded file', () => {
        const listName = 'cidr_list.txt';
        cy.intercept('POST', `/api/lists/items/_export?list_id=${listName}`).as('exportList');
        (0, _lists.importValueList)(listName, 'ip_range', ['192.168.100.0']);
        (0, _lists.openValueListsModal)();
        (0, _lists.exportValueList)();
        cy.wait('@exportList').then(({
          response
        }) => {
          cy.fixture(listName).then(list => {
            const [lineOne] = list.split('\n');
            expect(response.body).to.contain(lineOne);
          });
        });
      });
    });
  });
  describe('user with restricted access role', () => {
    beforeEach(() => {
      (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL, _test.ROLES.t1_analyst);
      (0, _alerts.goToManageAlertsDetectionRules)();
    });
    afterEach(() => {
      (0, _login.deleteRoleAndUser)(_test.ROLES.t1_analyst);
    });
    it('Does not allow a t1 analyst user to upload a value list', () => {
      cy.get(_lists2.VALUE_LISTS_MODAL_ACTIVATOR).should('have.attr', 'disabled');
    });
  });
});