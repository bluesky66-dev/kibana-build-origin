"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SOURCERER_TIMELINE_ADVANCED = exports.SOURCERER_TIMELINE = exports.HOSTS_STAT = exports.SOURCERER_POPOVER_TITLE = exports.SOURCERER_RESET_BUTTON = exports.SOURCERER_SAVE_BUTTON = exports.SOURCERER_OPTIONS = exports.SOURCERER_INPUT = exports.SOURCERER_TRIGGER = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SOURCERER_TRIGGER = '[data-test-subj="sourcerer-trigger"]';
exports.SOURCERER_TRIGGER = SOURCERER_TRIGGER;
const SOURCERER_INPUT = '[data-test-subj="indexPattern-switcher"] [data-test-subj="comboBoxInput"]';
exports.SOURCERER_INPUT = SOURCERER_INPUT;
const SOURCERER_OPTIONS = '[data-test-subj="comboBoxOptionsList indexPattern-switcher-optionsList"]';
exports.SOURCERER_OPTIONS = SOURCERER_OPTIONS;
const SOURCERER_SAVE_BUTTON = 'button[data-test-subj="add-index"]';
exports.SOURCERER_SAVE_BUTTON = SOURCERER_SAVE_BUTTON;
const SOURCERER_RESET_BUTTON = 'button[data-test-subj="sourcerer-reset"]';
exports.SOURCERER_RESET_BUTTON = SOURCERER_RESET_BUTTON;
const SOURCERER_POPOVER_TITLE = '.euiPopoverTitle';
exports.SOURCERER_POPOVER_TITLE = SOURCERER_POPOVER_TITLE;
const HOSTS_STAT = '[data-test-subj="stat-hosts"] [data-test-subj="stat-title"]';
exports.HOSTS_STAT = HOSTS_STAT;
const SOURCERER_TIMELINE = {
  trigger: '[data-test-subj="sourcerer-timeline-trigger"]',
  advancedSettings: '[data-test-subj="advanced-settings"]',
  sourcerer: '[data-test-subj="timeline-sourcerer"]',
  sourcererInput: '[data-test-subj="timeline-sourcerer"] [data-test-subj="comboBoxInput"]',
  sourcererOptions: '[data-test-subj="comboBoxOptionsList timeline-sourcerer-optionsList"]',
  radioRaw: '[data-test-subj="timeline-sourcerer-radio"] label.euiRadio__label[for="raw"]',
  radioAlert: '[data-test-subj="timeline-sourcerer-radio"] label.euiRadio__label[for="alert"]',
  radioAll: '[data-test-subj="timeline-sourcerer-radio"] label.euiRadio__label[for="all"]',
  radioCustom: '[data-test-subj="timeline-sourcerer-radio"] input.euiRadio__input[id="custom"]',
  radioCustomLabel: '[data-test-subj="timeline-sourcerer-radio"] label.euiRadio__label[for="custom"]'
};
exports.SOURCERER_TIMELINE = SOURCERER_TIMELINE;
const SOURCERER_TIMELINE_ADVANCED = '[data-test-subj="advanced-settings"]';
exports.SOURCERER_TIMELINE_ADVANCED = SOURCERER_TIMELINE_ADVANCED;