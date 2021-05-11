"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDoubleEncodedPolicyEditPath = exports.getEncodedPolicyEditPath = exports.setup = void 0;

var _react = _interopRequireDefault(require("react"));

var _testUtils = require("react-dom/test-utils");

var _jest = require("@kbn/test/jest");

var _context = require("../../../../../../src/plugins/kibana_react/public/context");

var _breadcrumbs = require("../../../public/application/services/breadcrumbs.mock");

var _mocks = require("../../../../licensing/public/mocks");

var _app = require("../../../public/application/app");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const breadcrumbService = (0, _breadcrumbs.createBreadcrumbsMock)();

const AppWithContext = props => {
  return /*#__PURE__*/_react.default.createElement(_context.KibanaContextProvider, {
    services: {
      breadcrumbService,
      license: _mocks.licensingMock.createLicense()
    }
  }, /*#__PURE__*/_react.default.createElement(_app.App, props));
};

const getTestBedConfig = initialEntries => ({
  memoryRouter: {
    initialEntries
  },
  defaultProps: {
    getUrlForApp: () => {},
    navigateToApp: () => {}
  }
});

const initTestBed = initialEntries => (0, _jest.registerTestBed)(AppWithContext, getTestBedConfig(initialEntries))();

const setup = async initialEntries => {
  const testBed = await initTestBed(initialEntries);

  const clickPolicyNameLink = async () => {
    const {
      component,
      find
    } = testBed;
    await (0, _testUtils.act)(async () => {
      find('policyTablePolicyNameLink').simulate('click', {
        button: 0
      });
    });
    component.update();
  };

  const clickCreatePolicyButton = async () => {
    const {
      component,
      find
    } = testBed;
    await (0, _testUtils.act)(async () => {
      find('createPolicyButton').simulate('click', {
        button: 0
      });
    });
    component.update();
  };

  return { ...testBed,
    actions: {
      clickPolicyNameLink,
      clickCreatePolicyButton
    }
  };
};

exports.setup = setup;

const getEncodedPolicyEditPath = policyName => `/policies/edit/${encodeURIComponent(policyName)}`;

exports.getEncodedPolicyEditPath = getEncodedPolicyEditPath;

const getDoubleEncodedPolicyEditPath = policyName => encodeURI(getEncodedPolicyEditPath(policyName));

exports.getDoubleEncodedPolicyEditPath = getDoubleEncodedPolicyEditPath;