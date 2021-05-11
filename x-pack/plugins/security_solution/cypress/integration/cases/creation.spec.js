"use strict";

var _case = require("../../objects/case");

var _alerts_detection_rules = require("../../screens/alerts_detection_rules");

var _all_cases = require("../../screens/all_cases");

var _case_details = require("../../screens/case_details");

var _timeline = require("../../screens/timeline");

var _all_cases2 = require("../../tasks/all_cases");

var _timelines = require("../../tasks/api_calls/timelines");

var _case_details2 = require("../../tasks/case_details");

var _common = require("../../tasks/common");

var _create_new_case = require("../../tasks/create_new_case");

var _login = require("../../tasks/login");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Cases', () => {
  beforeEach(() => {
    (0, _common.cleanKibana)();
    (0, _timelines.createTimeline)(_case.case1.timeline).then(response => cy.wrap({ ..._case.case1,
      timeline: { ..._case.case1.timeline,
        id: response.body.data.persistTimeline.timeline.savedObjectId
      }
    }).as('mycase'));
  });
  it('Creates a new case with timeline and opens the timeline', function () {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.CASES_URL);
    (0, _all_cases2.goToCreateNewCase)();
    (0, _create_new_case.fillCasesMandatoryfields)(this.mycase);
    (0, _create_new_case.attachTimeline)(this.mycase);
    (0, _create_new_case.createCase)();
    (0, _create_new_case.backToCases)();
    (0, _create_new_case.filterStatusOpen)();
    cy.get(_all_cases.ALL_CASES_PAGE_TITLE).should('have.text', 'Cases');
    cy.get(_all_cases.ALL_CASES_OPEN_CASES_STATS).should('have.text', 'Open cases1');
    cy.get(_all_cases.ALL_CASES_CLOSED_CASES_STATS).should('have.text', 'Closed cases0');
    cy.get(_all_cases.ALL_CASES_IN_PROGRESS_CASES_STATS).should('have.text', 'In progress cases0');
    cy.get(_all_cases.ALL_CASES_OPEN_CASES_COUNT).should('have.text', 'Open (1)');
    cy.get(_all_cases.ALL_CASES_REPORTERS_COUNT).should('have.text', 'Reporter1');
    cy.get(_all_cases.ALL_CASES_TAGS_COUNT).should('have.text', 'Tags2');
    cy.get(_all_cases.ALL_CASES_NAME).should('have.text', this.mycase.name);
    cy.get(_all_cases.ALL_CASES_REPORTER).should('have.text', this.mycase.reporter);
    this.mycase.tags.forEach((tag, index) => {
      cy.get((0, _all_cases.ALL_CASES_TAGS)(index)).should('have.text', tag);
    });
    cy.get(_all_cases.ALL_CASES_COMMENTS_COUNT).should('have.text', '0');
    cy.get(_all_cases.ALL_CASES_OPENED_ON).should('include.text', 'ago');
    cy.get(_all_cases.ALL_CASES_SERVICE_NOW_INCIDENT).should('have.text', 'Not pushed');
    cy.get(_alerts_detection_rules.COLLAPSED_ACTION_BTN).click();
    cy.get(_all_cases.ALL_CASES_DELETE_ACTION).should('exist');
    cy.get(_all_cases.ALL_CASES_CLOSE_ACTION).should('exist');
    (0, _all_cases2.goToCaseDetails)();
    const expectedTags = this.mycase.tags.join('');
    cy.get(_case_details.CASE_DETAILS_PAGE_TITLE).should('have.text', this.mycase.name);
    cy.get(_case_details.CASE_DETAILS_STATUS).should('have.text', 'Open');
    cy.get(_case_details.CASE_DETAILS_USER_ACTION_DESCRIPTION_USERNAME).should('have.text', this.mycase.reporter);
    cy.get(_case_details.CASE_DETAILS_USER_ACTION_DESCRIPTION_EVENT).should('have.text', 'added description');
    cy.get(_case_details.CASE_DETAILS_DESCRIPTION).should('have.text', `${this.mycase.description} ${this.mycase.timeline.title}`);
    cy.get(_case_details.CASE_DETAILS_USERNAMES).eq(_case_details.REPORTER).should('have.text', this.mycase.reporter);
    cy.get(_case_details.CASE_DETAILS_USERNAMES).eq(_case_details.PARTICIPANTS).should('have.text', this.mycase.reporter);
    cy.get(_case_details.CASE_DETAILS_TAGS).should('have.text', expectedTags); // cy.get(CASE_DETAILS_PUSH_TO_EXTERNAL_SERVICE_BTN).should('have.attr', 'disabled');

    (0, _case_details2.openCaseTimeline)();
    cy.get(_timeline.TIMELINE_TITLE).contains(this.mycase.timeline.title);
    cy.get(_timeline.TIMELINE_DESCRIPTION).contains(this.mycase.timeline.description);
    cy.get(_timeline.TIMELINE_QUERY).should('have.text', this.mycase.timeline.query);
  });
});