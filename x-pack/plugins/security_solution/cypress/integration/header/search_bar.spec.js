"use strict";

var _login = require("../../tasks/login");

var _search_bar = require("../../tasks/search_bar");

var _search_bar2 = require("../../screens/search_bar");

var _filter = require("../../objects/filter");

var _navigation = require("../../urls/navigation");

var _all_hosts = require("../../tasks/hosts/all_hosts");

var _common = require("../../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('SearchBar', () => {
  before(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
    (0, _all_hosts.waitForAllHostsToBeLoaded)();
  });
  it('adds correctly a filter to the global search bar', () => {
    (0, _search_bar.openAddFilterPopover)();
    (0, _search_bar.fillAddFilterForm)(_filter.hostIpFilter);
    cy.get(_search_bar2.GLOBAL_SEARCH_BAR_FILTER_ITEM).should('have.text', `${_filter.hostIpFilter.key}: ${_filter.hostIpFilter.value}`);
  });
});