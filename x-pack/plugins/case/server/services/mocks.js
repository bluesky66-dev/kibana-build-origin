"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlertServiceMock = exports.createUserActionServiceMock = exports.connectorMappingsServiceMock = exports.createConfigureServiceMock = exports.createCaseServiceMock = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createCaseServiceMock = () => ({
  createSubCase: jest.fn(),
  deleteCase: jest.fn(),
  deleteComment: jest.fn(),
  deleteSubCase: jest.fn(),
  findCases: jest.fn(),
  findSubCases: jest.fn(),
  findSubCasesByCaseId: jest.fn(),
  getAllCaseComments: jest.fn(),
  getAllSubCaseComments: jest.fn(),
  getCase: jest.fn(),
  getCases: jest.fn(),
  getComment: jest.fn(),
  getMostRecentSubCase: jest.fn(),
  getSubCase: jest.fn(),
  getSubCases: jest.fn(),
  getTags: jest.fn(),
  getReporters: jest.fn(),
  getUser: jest.fn(),
  postNewCase: jest.fn(),
  postNewComment: jest.fn(),
  patchCase: jest.fn(),
  patchCases: jest.fn(),
  patchComment: jest.fn(),
  patchComments: jest.fn(),
  patchSubCase: jest.fn(),
  patchSubCases: jest.fn(),
  findSubCaseStatusStats: jest.fn(),
  getCommentsByAssociation: jest.fn(),
  getCaseCommentStats: jest.fn(),
  findSubCasesGroupByCase: jest.fn(),
  findCaseStatusStats: jest.fn(),
  findCasesGroupedByID: jest.fn()
});

exports.createCaseServiceMock = createCaseServiceMock;

const createConfigureServiceMock = () => ({
  delete: jest.fn(),
  get: jest.fn(),
  find: jest.fn(),
  patch: jest.fn(),
  post: jest.fn()
});

exports.createConfigureServiceMock = createConfigureServiceMock;

const connectorMappingsServiceMock = () => ({
  find: jest.fn(),
  post: jest.fn()
});

exports.connectorMappingsServiceMock = connectorMappingsServiceMock;

const createUserActionServiceMock = () => ({
  getUserActions: jest.fn(),
  postUserActions: jest.fn()
});

exports.createUserActionServiceMock = createUserActionServiceMock;

const createAlertServiceMock = () => ({
  updateAlertsStatus: jest.fn(),
  getAlerts: jest.fn()
});

exports.createAlertServiceMock = createAlertServiceMock;