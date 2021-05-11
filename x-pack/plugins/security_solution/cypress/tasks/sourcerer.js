"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clickOutOfSourcererTimeline = exports.isNotCustomRadio = exports.isCustomRadio = exports.clickTimelineRadio = exports.unsetSourcererOption = exports.setSourcererOption = exports.resetSourcerer = exports.deselectSourcererOptions = exports.deselectSourcererOption = exports.selectSourcererOption = exports.isSourcererOptions = exports.isNotSourcererSelection = exports.isHostsStatValue = exports.isSourcererSelection = exports.clickOutOfSelector = exports.openAdvancedSettings = exports.openTimelineSourcerer = exports.openSourcerer = void 0;

var _sourcerer = require("../screens/sourcerer");

var _timeline = require("../screens/timeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const openSourcerer = sourcererScope => {
  if (sourcererScope != null && sourcererScope === 'timeline') {
    return openTimelineSourcerer();
  }

  cy.get(_sourcerer.SOURCERER_TRIGGER).should('be.enabled');
  cy.get(_sourcerer.SOURCERER_TRIGGER).should('be.visible');
  cy.get(_sourcerer.SOURCERER_TRIGGER).click();
};

exports.openSourcerer = openSourcerer;

const openTimelineSourcerer = () => {
  cy.get(_sourcerer.SOURCERER_TIMELINE.trigger).should('be.enabled');
  cy.get(_sourcerer.SOURCERER_TIMELINE.trigger).should('be.visible');
  cy.get(_sourcerer.SOURCERER_TIMELINE.trigger).click();
  cy.get(_sourcerer.SOURCERER_TIMELINE.advancedSettings).should($div => {
    if ($div.text() === 'Show Advanced') {
      $div.click();
    }

    expect(true).to.eq(true);
  });
};

exports.openTimelineSourcerer = openTimelineSourcerer;

const openAdvancedSettings = () => {};

exports.openAdvancedSettings = openAdvancedSettings;

const clickOutOfSelector = () => {
  return cy.get(_sourcerer.SOURCERER_POPOVER_TITLE).first().click();
};

exports.clickOutOfSelector = clickOutOfSelector;

const getScopedSelectors = sourcererScope => sourcererScope != null && sourcererScope === 'timeline' ? {
  input: _sourcerer.SOURCERER_TIMELINE.sourcererInput,
  options: _sourcerer.SOURCERER_TIMELINE.sourcererOptions
} : {
  input: _sourcerer.SOURCERER_INPUT,
  options: _sourcerer.SOURCERER_OPTIONS
};

const isSourcererSelection = (patternName, sourcererScope) => {
  const {
    input
  } = getScopedSelectors(sourcererScope);
  return cy.get(input).find(`span[title="${patternName}"]`).should('exist');
};

exports.isSourcererSelection = isSourcererSelection;

const isHostsStatValue = value => {
  return cy.get(_sourcerer.HOSTS_STAT).first().should('have.text', value);
};

exports.isHostsStatValue = isHostsStatValue;

const isNotSourcererSelection = (patternName, sourcererScope) => {
  const {
    input
  } = getScopedSelectors(sourcererScope);
  return cy.get(input).find(`span[title="${patternName}"]`).should('not.exist');
};

exports.isNotSourcererSelection = isNotSourcererSelection;

const isSourcererOptions = (patternNames, sourcererScope) => {
  const {
    input,
    options
  } = getScopedSelectors(sourcererScope);
  cy.get(input).click();
  return patternNames.every(patternName => {
    return cy.get(options).find(`button.euiFilterSelectItem[title="${patternName}"]`).its('length').should('eq', 1);
  });
};

exports.isSourcererOptions = isSourcererOptions;

const selectSourcererOption = (patternName, sourcererScope) => {
  const {
    input,
    options
  } = getScopedSelectors(sourcererScope);
  cy.get(input).click();
  cy.get(options).find(`button.euiFilterSelectItem[title="${patternName}"]`).click();
  clickOutOfSelector();
  return cy.get(_sourcerer.SOURCERER_SAVE_BUTTON).click({
    force: true
  });
};

exports.selectSourcererOption = selectSourcererOption;

const deselectSourcererOption = (patternName, sourcererScope) => {
  const {
    input
  } = getScopedSelectors(sourcererScope);
  cy.get(input).find(`span[title="${patternName}"] button`).click();
  clickOutOfSelector();
  return cy.get(_sourcerer.SOURCERER_SAVE_BUTTON).click({
    force: true
  });
};

exports.deselectSourcererOption = deselectSourcererOption;

const deselectSourcererOptions = (patternNames, sourcererScope) => {
  const {
    input
  } = getScopedSelectors(sourcererScope);
  patternNames.forEach(patternName => cy.get(input).find(`span[title="${patternName}"] button`).click());
  clickOutOfSelector();
  return cy.get(_sourcerer.SOURCERER_SAVE_BUTTON).click({
    force: true
  });
};

exports.deselectSourcererOptions = deselectSourcererOptions;

const resetSourcerer = () => {
  cy.get(_sourcerer.SOURCERER_RESET_BUTTON).click();
  clickOutOfSelector();
  return cy.get(_sourcerer.SOURCERER_SAVE_BUTTON).click({
    force: true
  });
};

exports.resetSourcerer = resetSourcerer;

const setSourcererOption = (patternName, sourcererScope) => {
  openSourcerer(sourcererScope);
  isNotSourcererSelection(patternName, sourcererScope);
  selectSourcererOption(patternName, sourcererScope);
};

exports.setSourcererOption = setSourcererOption;

const unsetSourcererOption = (patternName, sourcererScope) => {
  openSourcerer(sourcererScope);
  isSourcererSelection(patternName, sourcererScope);
  deselectSourcererOption(patternName, sourcererScope);
};

exports.unsetSourcererOption = unsetSourcererOption;

const clickTimelineRadio = radioName => {
  let theRadio = _sourcerer.SOURCERER_TIMELINE.radioAll;

  if (radioName === 'alert') {
    theRadio = _sourcerer.SOURCERER_TIMELINE.radioAlert;
  }

  if (radioName === 'raw') {
    theRadio = _sourcerer.SOURCERER_TIMELINE.radioRaw;
  }

  return cy.get(theRadio).first().click();
};

exports.clickTimelineRadio = clickTimelineRadio;

const isCustomRadio = () => {
  return cy.get(_sourcerer.SOURCERER_TIMELINE.radioCustom).should('be.enabled');
};

exports.isCustomRadio = isCustomRadio;

const isNotCustomRadio = () => {
  return cy.get(_sourcerer.SOURCERER_TIMELINE.radioCustom).should('be.disabled');
};

exports.isNotCustomRadio = isNotCustomRadio;

const clickOutOfSourcererTimeline = () => cy.get(_timeline.TIMELINE_TITLE).first().click();

exports.clickOutOfSourcererTimeline = clickOutOfSourcererTimeline;