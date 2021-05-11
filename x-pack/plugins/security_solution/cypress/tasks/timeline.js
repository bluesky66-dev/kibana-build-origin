"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForEventsPanelToBeLoaded = exports.waitForTimelinesPanelToBeLoaded = exports.waitForTimelineChanges = exports.selectCase = exports.resetFields = exports.removeColumn = exports.dragAndDropIdToggleFieldToTimeline = exports.uncheckTimestampToggleField = exports.unpinFirstEvent = exports.populateTimeline = exports.pinFirstEvent = exports.openTimelineById = exports.openTimelineTemplateFromSettings = exports.openTimelineFromSettings = exports.openTimelineInspectButton = exports.openTimelineFieldsBrowser = exports.markAsFavorite = exports.expandFirstTimelineEventDetails = exports.executeTimelineKQL = exports.createNewTimelineTemplate = exports.createNewTimeline = exports.closeTimeline = exports.closeOpenTimelineModal = exports.checkIdToggleField = exports.attachTimelineToExistingCase = exports.attachTimelineToNewCase = exports.addNewCase = exports.addDataProvider = exports.addFilter = exports.addNotesToTimeline = exports.goToQueryTab = exports.getNotePreviewByNoteId = exports.goToNotesTab = exports.addNameAndDescriptionToTimeline = exports.addNameToTimeline = exports.addDescriptionToTimeline = exports.hostExistsQuery = void 0;

var _all_cases = require("../screens/all_cases");

var _timeline = require("../screens/timeline");

var _timelines = require("../screens/timelines");

var _common = require("../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const hostExistsQuery = 'host.name: *';
exports.hostExistsQuery = hostExistsQuery;

const addDescriptionToTimeline = description => {
  cy.get(_timeline.TIMELINE_EDIT_MODAL_OPEN_BUTTON).first().click();
  cy.get(_timeline.TIMELINE_DESCRIPTION_INPUT).type(description);
  cy.get(_timeline.TIMELINE_DESCRIPTION_INPUT).invoke('val').should('equal', description);
  cy.get(_timeline.TIMELINE_EDIT_MODAL_SAVE_BUTTON).click();
  cy.get(_timeline.TIMELINE_TITLE_INPUT).should('not.exist');
};

exports.addDescriptionToTimeline = addDescriptionToTimeline;

const addNameToTimeline = name => {
  cy.get(_timeline.TIMELINE_EDIT_MODAL_OPEN_BUTTON).first().click();
  cy.get(_timeline.TIMELINE_TITLE_INPUT).type(`${name}{enter}`);
  cy.get(_timeline.TIMELINE_TITLE_INPUT).should('have.attr', 'value', name);
  cy.get(_timeline.TIMELINE_EDIT_MODAL_SAVE_BUTTON).click();
  cy.get(_timeline.TIMELINE_TITLE_INPUT).should('not.exist');
};

exports.addNameToTimeline = addNameToTimeline;

const addNameAndDescriptionToTimeline = timeline => {
  cy.get(_timeline.TIMELINE_EDIT_MODAL_OPEN_BUTTON).first().click();
  cy.get(_timeline.TIMELINE_TITLE_INPUT).type(`${timeline.title}{enter}`);
  cy.get(_timeline.TIMELINE_TITLE_INPUT).should('have.attr', 'value', timeline.title);
  cy.get(_timeline.TIMELINE_DESCRIPTION_INPUT).type(timeline.description);
  cy.get(_timeline.TIMELINE_DESCRIPTION_INPUT).invoke('val').should('equal', timeline.description);
  cy.get(_timeline.TIMELINE_EDIT_MODAL_SAVE_BUTTON).click();
  cy.get(_timeline.TIMELINE_TITLE_INPUT).should('not.exist');
};

exports.addNameAndDescriptionToTimeline = addNameAndDescriptionToTimeline;

const goToNotesTab = () => {
  return cy.get(_timeline.NOTES_TAB_BUTTON).click({
    force: true
  });
};

exports.goToNotesTab = goToNotesTab;

const getNotePreviewByNoteId = noteId => {
  return cy.get(`[data-test-subj="note-preview-${noteId}"]`);
};

exports.getNotePreviewByNoteId = getNotePreviewByNoteId;

const goToQueryTab = () => {
  cy.get(_timeline.QUERY_TAB_BUTTON).click({
    force: true
  });
};

exports.goToQueryTab = goToQueryTab;

const addNotesToTimeline = notes => {
  goToNotesTab();
  cy.get(_timeline.NOTES_TEXT_AREA).type(notes);
  cy.get(_timeline.ADD_NOTE_BUTTON).click({
    force: true
  });
  cy.get(_timeline.QUERY_TAB_BUTTON).click();
};

exports.addNotesToTimeline = addNotesToTimeline;

const addFilter = filter => {
  cy.get(_timeline.ADD_FILTER).click();
  cy.get(_timeline.TIMELINE_FILTER_FIELD).type(`${filter.field}{downarrow}{enter}`);
  cy.get(_timeline.TIMELINE_FILTER_OPERATOR).type(filter.operator);
  cy.get(_timeline.COMBO_BOX).contains(filter.operator).click();

  if (filter.operator !== 'exists') {
    cy.get(_timeline.TIMELINE_FILTER_VALUE).type(`${filter.value}{enter}`);
  }

  cy.get(_timeline.SAVE_FILTER_BTN).click();
};

exports.addFilter = addFilter;

const addDataProvider = filter => {
  cy.get(_timeline.TIMELINE_ADD_FIELD_BUTTON).click();
  cy.get(_timeline.TIMELINE_DATA_PROVIDER_FIELD).type(`${filter.field}{downarrow}{enter}`);
  cy.get(_timeline.TIMELINE_DATA_PROVIDER_OPERATOR).type(filter.operator);
  cy.get(_timeline.COMBO_BOX).contains(filter.operator).click();

  if (filter.operator !== 'exists') {
    cy.get(_timeline.TIMELINE_DATA_PROVIDER_VALUE).type(`${filter.value}{enter}`);
  }

  return cy.get(_timeline.SAVE_DATA_PROVIDER_BTN).click();
};

exports.addDataProvider = addDataProvider;

const addNewCase = () => {
  cy.get(_all_cases.ALL_CASES_CREATE_NEW_CASE_TABLE_BTN).click();
};

exports.addNewCase = addNewCase;

const attachTimelineToNewCase = () => {
  cy.get(_timeline.ATTACH_TIMELINE_TO_CASE_BUTTON).click({
    force: true
  });
  cy.get(_timeline.ATTACH_TIMELINE_TO_NEW_CASE_ICON).click({
    force: true
  });
};

exports.attachTimelineToNewCase = attachTimelineToNewCase;

const attachTimelineToExistingCase = () => {
  cy.get(_timeline.ATTACH_TIMELINE_TO_CASE_BUTTON).click({
    force: true
  });
  cy.get(_timeline.ATTACH_TIMELINE_TO_EXISTING_CASE_ICON).click({
    force: true
  });
};

exports.attachTimelineToExistingCase = attachTimelineToExistingCase;

const checkIdToggleField = () => {
  cy.get(_timeline.ID_HEADER_FIELD).should('not.exist');
  cy.get(_timeline.ID_TOGGLE_FIELD).check({
    force: true
  });
};

exports.checkIdToggleField = checkIdToggleField;

const closeOpenTimelineModal = () => {
  cy.get(_timeline.CLOSE_OPEN_TIMELINE_MODAL_BTN).click({
    force: true
  });
};

exports.closeOpenTimelineModal = closeOpenTimelineModal;

const closeTimeline = () => {
  cy.get(_timeline.CLOSE_TIMELINE_BTN).filter(':visible').click({
    force: true
  });
};

exports.closeTimeline = closeTimeline;

const createNewTimeline = () => {
  cy.get(_timeline.TIMELINE_SETTINGS_ICON).filter(':visible').click({
    force: true
  });
  cy.get(_timeline.CREATE_NEW_TIMELINE).click();
};

exports.createNewTimeline = createNewTimeline;

const createNewTimelineTemplate = () => {
  cy.get(_timeline.TIMELINE_SETTINGS_ICON).filter(':visible').click({
    force: true
  });
  cy.get(_timeline.CREATE_NEW_TIMELINE_TEMPLATE).click();
};

exports.createNewTimelineTemplate = createNewTimelineTemplate;

const executeTimelineKQL = query => {
  cy.get(`${_timeline.SEARCH_OR_FILTER_CONTAINER} textarea`).type(`${query} {enter}`);
};

exports.executeTimelineKQL = executeTimelineKQL;

const expandFirstTimelineEventDetails = () => {
  cy.get(_timeline.TOGGLE_TIMELINE_EXPAND_EVENT).first().click({
    force: true
  });
};

exports.expandFirstTimelineEventDetails = expandFirstTimelineEventDetails;

const markAsFavorite = () => {
  cy.get(_timeline.STAR_ICON).click();
};

exports.markAsFavorite = markAsFavorite;

const openTimelineFieldsBrowser = () => {
  cy.get(_timeline.TIMELINE_FIELDS_BUTTON).first().click({
    force: true
  });
};

exports.openTimelineFieldsBrowser = openTimelineFieldsBrowser;

const openTimelineInspectButton = () => {
  cy.get(_timeline.TIMELINE_INSPECT_BUTTON).should('not.be.disabled');
  cy.get(_timeline.TIMELINE_INSPECT_BUTTON).trigger('click', {
    force: true
  });
};

exports.openTimelineInspectButton = openTimelineInspectButton;

const openTimelineFromSettings = () => {
  const click = $el => cy.wrap($el).click();

  cy.get(_timeline.TIMELINE_SETTINGS_ICON).filter(':visible').pipe(click);
  cy.get(_timeline.OPEN_TIMELINE_ICON).pipe(click);
};

exports.openTimelineFromSettings = openTimelineFromSettings;

const openTimelineTemplateFromSettings = id => {
  openTimelineFromSettings();
  cy.get(_timeline.OPEN_TIMELINE_TEMPLATE_ICON).click({
    force: true
  });
  cy.get((0, _timeline.TIMELINE_TITLE_BY_ID)(id)).click({
    force: true
  });
};

exports.openTimelineTemplateFromSettings = openTimelineTemplateFromSettings;

const openTimelineById = timelineId => {
  return cy.get((0, _timeline.TIMELINE_TITLE_BY_ID)(timelineId)).click({
    force: true
  });
};

exports.openTimelineById = openTimelineById;

const pinFirstEvent = () => {
  cy.get(_timeline.PIN_EVENT).first().click({
    force: true
  });
};

exports.pinFirstEvent = pinFirstEvent;

const populateTimeline = () => {
  executeTimelineKQL(hostExistsQuery);
  cy.get(_timeline.SERVER_SIDE_EVENT_COUNT).should('not.have.text', '0');
};

exports.populateTimeline = populateTimeline;

const unpinFirstEvent = () => {
  cy.get(_timeline.PIN_EVENT).first().click({
    force: true
  });
};

exports.unpinFirstEvent = unpinFirstEvent;

const uncheckTimestampToggleField = () => {
  cy.get(_timeline.TIMESTAMP_TOGGLE_FIELD).should('exist');
  cy.get(_timeline.TIMESTAMP_TOGGLE_FIELD).uncheck({
    force: true
  });
};

exports.uncheckTimestampToggleField = uncheckTimestampToggleField;

const dragAndDropIdToggleFieldToTimeline = () => {
  cy.get(_timeline.ID_HEADER_FIELD).should('not.exist');
  cy.get(_timeline.ID_FIELD).then(field => (0, _common.drag)(field));
  cy.get(`[data-test-subj="timeline"] [data-test-subj="headers-group"]`).first().then(headersDropArea => (0, _common.drop)(headersDropArea));
};

exports.dragAndDropIdToggleFieldToTimeline = dragAndDropIdToggleFieldToTimeline;

const removeColumn = column => {
  cy.get(_timeline.DRAGGABLE_HEADER).eq(column).within(() => {
    cy.get(_timeline.REMOVE_COLUMN).click({
      force: true
    });
  });
};

exports.removeColumn = removeColumn;

const resetFields = () => {
  cy.get(_timeline.RESET_FIELDS).click({
    force: true
  });
};

exports.resetFields = resetFields;

const selectCase = caseId => {
  cy.get((0, _timeline.CASE)(caseId)).click();
};

exports.selectCase = selectCase;

const waitForTimelineChanges = () => {
  cy.get(_timeline.TIMELINE_CHANGES_IN_PROGRESS).should('exist');
  cy.get(_timeline.TIMELINE_CHANGES_IN_PROGRESS).should('not.exist');
};

exports.waitForTimelineChanges = waitForTimelineChanges;

const waitForTimelinesPanelToBeLoaded = () => {
  cy.get(_timelines.TIMELINES_TABLE).should('exist');
};

exports.waitForTimelinesPanelToBeLoaded = waitForTimelinesPanelToBeLoaded;

const waitForEventsPanelToBeLoaded = () => {
  cy.get(_timeline.QUERY_TAB_BUTTON).find('.euiBadge').should('exist');
};

exports.waitForEventsPanelToBeLoaded = waitForEventsPanelToBeLoaded;