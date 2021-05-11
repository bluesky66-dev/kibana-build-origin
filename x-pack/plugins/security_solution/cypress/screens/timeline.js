"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QUERY_TAB_BUTTON = exports.TIMELINE_EDIT_MODAL_SAVE_BUTTON = exports.TIMELINE_EDIT_MODAL_OPEN_BUTTON = exports.TOGGLE_TIMELINE_EXPAND_EVENT = exports.TIMESTAMP_TOGGLE_FIELD = exports.TIMESTAMP_HEADER_FIELD = exports.TIMELINE_TITLE_INPUT = exports.TIMELINE_TITLE = exports.TIMELINE_SETTINGS_ICON = exports.TIMELINE_QUERY = exports.TIMELINE_PANEL = exports.TIMELINE_INSPECT_BUTTON = exports.TIMELINE_FLYOUT_BODY = exports.TIMELINE_FLYOUT_HEADER = exports.TIMELINE_FLYOUT = exports.TIMELINE_FILTER_VALUE = exports.TIMELINE_FILTER_OPERATOR = exports.TIMELINE_TITLE_BY_ID = exports.TIMELINE_FILTER_FIELD = exports.TIMELINE_FILTER = exports.TIMELINE_FIELDS_BUTTON = exports.TIMELINE_DROPPED_DATA_PROVIDERS = exports.TIMELINE_DESCRIPTION_INPUT = exports.TIMELINE_DESCRIPTION = exports.TIMELINE_DATA_PROVIDERS_EMPTY = exports.SAVE_DATA_PROVIDER_BTN = exports.TIMELINE_DATA_PROVIDER_VALUE = exports.TIMELINE_DATA_PROVIDER_OPERATOR = exports.TIMELINE_DATA_PROVIDER_FIELD = exports.TIMELINE_ADD_FIELD_BUTTON = exports.TIMELINE_DATA_PROVIDERS_ACTION_MENU = exports.TIMELINE_DATA_PROVIDERS = exports.IS_DRAGGING_DATA_PROVIDERS = exports.TIMELINE_COLUMN_SPINNER = exports.TIMELINE_CHANGES_IN_PROGRESS = exports.STAR_ICON = exports.SERVER_SIDE_EVENT_COUNT = exports.PINNED_TAB_EVENTS_FOOTER = exports.PINNED_TAB_EVENTS_BODY = exports.PINNED_TAB_EVENTS_TABLE = exports.QUERY_TAB_EVENTS_FOOTER = exports.QUERY_TAB_EVENTS_BODY = exports.QUERY_TAB_EVENTS_TABLE = exports.SEARCH_OR_FILTER_CONTAINER = exports.SAVE_FILTER_BTN = exports.RESET_FIELDS = exports.REMOVE_COLUMN = exports.PROVIDER_BADGE = exports.PINNED_TAB_BUTTON = exports.PIN_EVENT = exports.OPEN_TIMELINE_TEMPLATE_ICON = exports.CLOSE_OPEN_TIMELINE_MODAL_BTN = exports.OPEN_TIMELINE_MODAL = exports.OPEN_TIMELINE_ICON = exports.NOTES_COUNT = exports.NOTES_TEXT = exports.NOTES_TAB_BUTTON = exports.NOTES_TEXT_AREA = exports.NOTE_CONTENT = exports.NOTE_BY_NOTE_ID = exports.NOTES = exports.UNLOCKED_ICON = exports.LOCKED_ICON = exports.ID_TOGGLE_FIELD = exports.ID_FIELD = exports.ID_HEADER_FIELD = exports.HEADERS_GROUP = exports.HEADER = exports.GRAPH_TAB_BUTTON = exports.FAVORITE_TIMELINE = exports.DRAGGABLE_HEADER = exports.CREATE_NEW_TIMELINE_TEMPLATE = exports.CREATE_NEW_TIMELINE = exports.COMBO_BOX = exports.CLOSE_TIMELINE_BTN = exports.CASE = exports.BULK_ACTIONS = exports.ATTACH_TIMELINE_TO_EXISTING_CASE_ICON = exports.ATTACH_TIMELINE_TO_NEW_CASE_ICON = exports.ATTACH_TIMELINE_TO_CASE_BUTTON = exports.ADD_FILTER = exports.ADD_NOTE_BUTTON = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ADD_NOTE_BUTTON = '[data-test-subj="add-note"]';
exports.ADD_NOTE_BUTTON = ADD_NOTE_BUTTON;
const ADD_FILTER = '[data-test-subj="timeline"] [data-test-subj="addFilter"]';
exports.ADD_FILTER = ADD_FILTER;
const ATTACH_TIMELINE_TO_CASE_BUTTON = '[data-test-subj="attach-timeline-case-button"]';
exports.ATTACH_TIMELINE_TO_CASE_BUTTON = ATTACH_TIMELINE_TO_CASE_BUTTON;
const ATTACH_TIMELINE_TO_NEW_CASE_ICON = '[data-test-subj="attach-timeline-new-case"]';
exports.ATTACH_TIMELINE_TO_NEW_CASE_ICON = ATTACH_TIMELINE_TO_NEW_CASE_ICON;
const ATTACH_TIMELINE_TO_EXISTING_CASE_ICON = '[data-test-subj="attach-timeline-existing-case"]';
exports.ATTACH_TIMELINE_TO_EXISTING_CASE_ICON = ATTACH_TIMELINE_TO_EXISTING_CASE_ICON;
const BULK_ACTIONS = '[data-test-subj="utility-bar-action-button"]';
exports.BULK_ACTIONS = BULK_ACTIONS;

const CASE = id => {
  return `[data-test-subj="cases-table-row-${id}"]`;
};

exports.CASE = CASE;
const CLOSE_TIMELINE_BTN = '[data-test-subj="close-timeline"]';
exports.CLOSE_TIMELINE_BTN = CLOSE_TIMELINE_BTN;
const COMBO_BOX = '.euiComboBoxOption__content';
exports.COMBO_BOX = COMBO_BOX;
const CREATE_NEW_TIMELINE = '[data-test-subj="timeline-new"]';
exports.CREATE_NEW_TIMELINE = CREATE_NEW_TIMELINE;
const CREATE_NEW_TIMELINE_TEMPLATE = '[data-test-subj="template-timeline-new"]';
exports.CREATE_NEW_TIMELINE_TEMPLATE = CREATE_NEW_TIMELINE_TEMPLATE;
const DRAGGABLE_HEADER = '[data-test-subj="events-viewer-panel"] [data-test-subj="headers-group"] [data-test-subj="draggable-header"]';
exports.DRAGGABLE_HEADER = DRAGGABLE_HEADER;
const FAVORITE_TIMELINE = '[data-test-subj="timeline-favorite-filled-star"]';
exports.FAVORITE_TIMELINE = FAVORITE_TIMELINE;
const GRAPH_TAB_BUTTON = '[data-test-subj="timelineTabs-graph"]';
exports.GRAPH_TAB_BUTTON = GRAPH_TAB_BUTTON;
const HEADER = '[data-test-subj="header"]';
exports.HEADER = HEADER;
const HEADERS_GROUP = '[data-test-subj="events-viewer-panel"] [data-test-subj="headers-group"]';
exports.HEADERS_GROUP = HEADERS_GROUP;
const ID_HEADER_FIELD = '[data-test-subj="timeline"] [data-test-subj="header-text-_id"]';
exports.ID_HEADER_FIELD = ID_HEADER_FIELD;
const ID_FIELD = '[data-test-subj="timeline"] [data-test-subj="field-name-_id"]';
exports.ID_FIELD = ID_FIELD;
const ID_TOGGLE_FIELD = '[data-test-subj="toggle-field-_id"]';
exports.ID_TOGGLE_FIELD = ID_TOGGLE_FIELD;
const LOCKED_ICON = '[data-test-subj="timeline-date-picker-lock-button"]';
exports.LOCKED_ICON = LOCKED_ICON;
const UNLOCKED_ICON = '[data-test-subj="timeline-date-picker-unlock-button"]';
exports.UNLOCKED_ICON = UNLOCKED_ICON;
const NOTES = '[data-test-subj="note-card-body"]';
exports.NOTES = NOTES;

const NOTE_BY_NOTE_ID = noteId => `[data-test-subj="note-preview-${noteId}"] .euiMarkdownFormat`;

exports.NOTE_BY_NOTE_ID = NOTE_BY_NOTE_ID;

const NOTE_CONTENT = noteId => `${NOTE_BY_NOTE_ID(noteId)} p`;

exports.NOTE_CONTENT = NOTE_CONTENT;
const NOTES_TEXT_AREA = '[data-test-subj="add-a-note"] textarea';
exports.NOTES_TEXT_AREA = NOTES_TEXT_AREA;
const NOTES_TAB_BUTTON = '[data-test-subj="timelineTabs-notes"]';
exports.NOTES_TAB_BUTTON = NOTES_TAB_BUTTON;
const NOTES_TEXT = '.euiMarkdownFormat';
exports.NOTES_TEXT = NOTES_TEXT;
const NOTES_COUNT = '[data-test-subj="timeline-notes-count"]';
exports.NOTES_COUNT = NOTES_COUNT;
const OPEN_TIMELINE_ICON = '[data-test-subj="open-timeline-button"]';
exports.OPEN_TIMELINE_ICON = OPEN_TIMELINE_ICON;
const OPEN_TIMELINE_MODAL = '[data-test-subj="open-timeline-modal"]';
exports.OPEN_TIMELINE_MODAL = OPEN_TIMELINE_MODAL;
const CLOSE_OPEN_TIMELINE_MODAL_BTN = `${OPEN_TIMELINE_MODAL} > button`;
exports.CLOSE_OPEN_TIMELINE_MODAL_BTN = CLOSE_OPEN_TIMELINE_MODAL_BTN;
const OPEN_TIMELINE_TEMPLATE_ICON = '[data-test-subj="open-timeline-modal-body-filter-template"]';
exports.OPEN_TIMELINE_TEMPLATE_ICON = OPEN_TIMELINE_TEMPLATE_ICON;
const PIN_EVENT = '[data-test-subj="pin"]';
exports.PIN_EVENT = PIN_EVENT;
const PINNED_TAB_BUTTON = '[data-test-subj="timelineTabs-pinned"]';
exports.PINNED_TAB_BUTTON = PINNED_TAB_BUTTON;
const PROVIDER_BADGE = '[data-test-subj="providerBadge"]';
exports.PROVIDER_BADGE = PROVIDER_BADGE;
const REMOVE_COLUMN = '[data-test-subj="remove-column"]';
exports.REMOVE_COLUMN = REMOVE_COLUMN;
const RESET_FIELDS = '[data-test-subj="fields-browser-container"] [data-test-subj="reset-fields"]';
exports.RESET_FIELDS = RESET_FIELDS;
const SAVE_FILTER_BTN = '[data-test-subj="saveFilter"]';
exports.SAVE_FILTER_BTN = SAVE_FILTER_BTN;
const SEARCH_OR_FILTER_CONTAINER = '[data-test-subj="timeline-search-or-filter-search-container"]';
exports.SEARCH_OR_FILTER_CONTAINER = SEARCH_OR_FILTER_CONTAINER;
const QUERY_TAB_EVENTS_TABLE = '[data-test-subj="query-events-table"]';
exports.QUERY_TAB_EVENTS_TABLE = QUERY_TAB_EVENTS_TABLE;
const QUERY_TAB_EVENTS_BODY = '[data-test-subj="query-tab-flyout-body"]';
exports.QUERY_TAB_EVENTS_BODY = QUERY_TAB_EVENTS_BODY;
const QUERY_TAB_EVENTS_FOOTER = '[data-test-subj="query-tab-flyout-footer"]';
exports.QUERY_TAB_EVENTS_FOOTER = QUERY_TAB_EVENTS_FOOTER;
const PINNED_TAB_EVENTS_TABLE = '[data-test-subj="pinned-events-table"]';
exports.PINNED_TAB_EVENTS_TABLE = PINNED_TAB_EVENTS_TABLE;
const PINNED_TAB_EVENTS_BODY = '[data-test-subj="pinned-tab-flyout-body"]';
exports.PINNED_TAB_EVENTS_BODY = PINNED_TAB_EVENTS_BODY;
const PINNED_TAB_EVENTS_FOOTER = '[data-test-subj="pinned-tab-flyout-footer"]';
exports.PINNED_TAB_EVENTS_FOOTER = PINNED_TAB_EVENTS_FOOTER;
const SERVER_SIDE_EVENT_COUNT = '[data-test-subj="server-side-event-count"]';
exports.SERVER_SIDE_EVENT_COUNT = SERVER_SIDE_EVENT_COUNT;
const STAR_ICON = '[data-test-subj="timeline-favorite-empty-star"]';
exports.STAR_ICON = STAR_ICON;
const TIMELINE_CHANGES_IN_PROGRESS = '[data-test-subj="timeline"] .euiProgress';
exports.TIMELINE_CHANGES_IN_PROGRESS = TIMELINE_CHANGES_IN_PROGRESS;
const TIMELINE_COLUMN_SPINNER = '[data-test-subj="timeline-loading-spinner"]';
exports.TIMELINE_COLUMN_SPINNER = TIMELINE_COLUMN_SPINNER;
const IS_DRAGGING_DATA_PROVIDERS = '.is-dragging';
exports.IS_DRAGGING_DATA_PROVIDERS = IS_DRAGGING_DATA_PROVIDERS;
const TIMELINE_DATA_PROVIDERS = '[data-test-subj="dataProviders"]';
exports.TIMELINE_DATA_PROVIDERS = TIMELINE_DATA_PROVIDERS;
const TIMELINE_DATA_PROVIDERS_ACTION_MENU = '[data-test-subj="providerActions"]';
exports.TIMELINE_DATA_PROVIDERS_ACTION_MENU = TIMELINE_DATA_PROVIDERS_ACTION_MENU;
const TIMELINE_ADD_FIELD_BUTTON = '[data-test-subj="addField"]';
exports.TIMELINE_ADD_FIELD_BUTTON = TIMELINE_ADD_FIELD_BUTTON;
const TIMELINE_DATA_PROVIDER_FIELD = '[data-test-subj="field"]';
exports.TIMELINE_DATA_PROVIDER_FIELD = TIMELINE_DATA_PROVIDER_FIELD;
const TIMELINE_DATA_PROVIDER_OPERATOR = `[data-test-subj="operator"]`;
exports.TIMELINE_DATA_PROVIDER_OPERATOR = TIMELINE_DATA_PROVIDER_OPERATOR;
const TIMELINE_DATA_PROVIDER_VALUE = `[data-test-subj="value"]`;
exports.TIMELINE_DATA_PROVIDER_VALUE = TIMELINE_DATA_PROVIDER_VALUE;
const SAVE_DATA_PROVIDER_BTN = `[data-test-subj="save"]`;
exports.SAVE_DATA_PROVIDER_BTN = SAVE_DATA_PROVIDER_BTN;
const TIMELINE_DATA_PROVIDERS_EMPTY = '[data-test-subj="dataProviders"] [data-test-subj="empty"]';
exports.TIMELINE_DATA_PROVIDERS_EMPTY = TIMELINE_DATA_PROVIDERS_EMPTY;
const TIMELINE_DESCRIPTION = '[data-test-subj="timeline-description"]';
exports.TIMELINE_DESCRIPTION = TIMELINE_DESCRIPTION;
const TIMELINE_DESCRIPTION_INPUT = '[data-test-subj="save-timeline-description"]';
exports.TIMELINE_DESCRIPTION_INPUT = TIMELINE_DESCRIPTION_INPUT;
const TIMELINE_DROPPED_DATA_PROVIDERS = '[data-test-subj="providerContainer"]';
exports.TIMELINE_DROPPED_DATA_PROVIDERS = TIMELINE_DROPPED_DATA_PROVIDERS;
const TIMELINE_FIELDS_BUTTON = '[data-test-subj="timeline"] [data-test-subj="show-field-browser"]';
exports.TIMELINE_FIELDS_BUTTON = TIMELINE_FIELDS_BUTTON;

const TIMELINE_FILTER = filter => `[data-test-subj="filter filter-enabled filter-key-${filter.field} filter-value-${filter.value} filter-unpinned"]`;

exports.TIMELINE_FILTER = TIMELINE_FILTER;
const TIMELINE_FILTER_FIELD = '[data-test-subj="filterFieldSuggestionList"]';
exports.TIMELINE_FILTER_FIELD = TIMELINE_FILTER_FIELD;

const TIMELINE_TITLE_BY_ID = id => `[data-test-subj="title-${id}"]`;

exports.TIMELINE_TITLE_BY_ID = TIMELINE_TITLE_BY_ID;
const TIMELINE_FILTER_OPERATOR = '[data-test-subj="filterOperatorList"]';
exports.TIMELINE_FILTER_OPERATOR = TIMELINE_FILTER_OPERATOR;
const TIMELINE_FILTER_VALUE = '[data-test-subj="filterParamsComboBox phraseParamsComboxBox"]';
exports.TIMELINE_FILTER_VALUE = TIMELINE_FILTER_VALUE;
const TIMELINE_FLYOUT = '[data-test-subj="eui-flyout"]';
exports.TIMELINE_FLYOUT = TIMELINE_FLYOUT;
const TIMELINE_FLYOUT_HEADER = '[data-test-subj="query-tab-flyout-header"]';
exports.TIMELINE_FLYOUT_HEADER = TIMELINE_FLYOUT_HEADER;
const TIMELINE_FLYOUT_BODY = '[data-test-subj="query-tab-flyout-body"]';
exports.TIMELINE_FLYOUT_BODY = TIMELINE_FLYOUT_BODY;
const TIMELINE_INSPECT_BUTTON = `${TIMELINE_FLYOUT} [data-test-subj="inspect-icon-button"]`;
exports.TIMELINE_INSPECT_BUTTON = TIMELINE_INSPECT_BUTTON;
const TIMELINE_PANEL = `[data-test-subj="timeline-flyout-header-panel"]`;
exports.TIMELINE_PANEL = TIMELINE_PANEL;
const TIMELINE_QUERY = '[data-test-subj="timelineQueryInput"]';
exports.TIMELINE_QUERY = TIMELINE_QUERY;
const TIMELINE_SETTINGS_ICON = '[data-test-subj="settings-plus-in-circle"]';
exports.TIMELINE_SETTINGS_ICON = TIMELINE_SETTINGS_ICON;
const TIMELINE_TITLE = '[data-test-subj="timeline-title"]';
exports.TIMELINE_TITLE = TIMELINE_TITLE;
const TIMELINE_TITLE_INPUT = '[data-test-subj="save-timeline-title"]';
exports.TIMELINE_TITLE_INPUT = TIMELINE_TITLE_INPUT;
const TIMESTAMP_HEADER_FIELD = '[data-test-subj="header-text-@timestamp"]';
exports.TIMESTAMP_HEADER_FIELD = TIMESTAMP_HEADER_FIELD;
const TIMESTAMP_TOGGLE_FIELD = '[data-test-subj="toggle-field-@timestamp"]';
exports.TIMESTAMP_TOGGLE_FIELD = TIMESTAMP_TOGGLE_FIELD;
const TOGGLE_TIMELINE_EXPAND_EVENT = '[data-test-subj="expand-event"]';
exports.TOGGLE_TIMELINE_EXPAND_EVENT = TOGGLE_TIMELINE_EXPAND_EVENT;
const TIMELINE_EDIT_MODAL_OPEN_BUTTON = '[data-test-subj="save-timeline-button-icon"]';
exports.TIMELINE_EDIT_MODAL_OPEN_BUTTON = TIMELINE_EDIT_MODAL_OPEN_BUTTON;
const TIMELINE_EDIT_MODAL_SAVE_BUTTON = '[data-test-subj="save-button"]';
exports.TIMELINE_EDIT_MODAL_SAVE_BUTTON = TIMELINE_EDIT_MODAL_SAVE_BUTTON;
const QUERY_TAB_BUTTON = '[data-test-subj="timelineTabs-query"]';
exports.QUERY_TAB_BUTTON = QUERY_TAB_BUTTON;