"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiParams = exports.executorParams = exports.externalServiceMock = exports.serviceNowChoices = exports.serviceNowCommonFields = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const serviceNowCommonFields = [{
  column_label: 'Close notes',
  max_length: '4000',
  element: 'close_notes'
}, {
  column_label: 'Description',
  max_length: '4000',
  element: 'description'
}, {
  column_label: 'Short description',
  max_length: '160',
  element: 'short_description'
}, {
  column_label: 'Created by',
  max_length: '40',
  element: 'sys_created_by'
}, {
  column_label: 'Updated by',
  max_length: '40',
  element: 'sys_updated_by'
}];
exports.serviceNowCommonFields = serviceNowCommonFields;
const serviceNowChoices = [{
  dependent_value: '',
  label: '1 - Critical',
  value: '1',
  element: 'priority'
}, {
  dependent_value: '',
  label: '2 - High',
  value: '2',
  element: 'priority'
}, {
  dependent_value: '',
  label: '3 - Moderate',
  value: '3',
  element: 'priority'
}, {
  dependent_value: '',
  label: '4 - Low',
  value: '4',
  element: 'priority'
}, {
  dependent_value: '',
  label: '5 - Planning',
  value: '5',
  element: 'priority'
}];
exports.serviceNowChoices = serviceNowChoices;

const createMock = () => {
  const service = {
    getChoices: jest.fn().mockImplementation(() => Promise.resolve(serviceNowChoices)),
    getFields: jest.fn().mockImplementation(() => Promise.resolve(serviceNowCommonFields)),
    getIncident: jest.fn().mockImplementation(() => Promise.resolve({
      short_description: 'title from servicenow',
      description: 'description from servicenow'
    })),
    createIncident: jest.fn().mockImplementation(() => Promise.resolve({
      id: 'incident-1',
      title: 'INC01',
      pushedDate: '2020-03-10T12:24:20.000Z',
      url: 'https://instance.service-now.com/nav_to.do?uri=incident.do?sys_id=123'
    })),
    updateIncident: jest.fn().mockImplementation(() => Promise.resolve({
      id: 'incident-2',
      title: 'INC02',
      pushedDate: '2020-03-10T12:24:20.000Z',
      url: 'https://instance.service-now.com/nav_to.do?uri=incident.do?sys_id=123'
    })),
    findIncidents: jest.fn()
  };
  return service;
};

const externalServiceMock = {
  create: createMock
};
exports.externalServiceMock = externalServiceMock;
const executorParams = {
  incident: {
    externalId: 'incident-3',
    short_description: 'Incident title',
    description: 'Incident description',
    severity: '1',
    urgency: '2',
    impact: '3',
    category: 'software',
    subcategory: 'os'
  },
  comments: [{
    commentId: 'case-comment-1',
    comment: 'A comment'
  }, {
    commentId: 'case-comment-2',
    comment: 'Another comment'
  }]
};
exports.executorParams = executorParams;
const apiParams = executorParams;
exports.apiParams = apiParams;