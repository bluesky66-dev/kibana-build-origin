"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockBrowserDriverFactory = void 0;

var _moment = _interopRequireDefault(require("moment"));

var Rx = _interopRequireWildcard(require("rxjs"));

var _browsers = require("../browsers");

var contexts = _interopRequireWildcard(require("../lib/screenshots/constants"));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

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


const mockSelectors = {
  renderComplete: 'renderedSelector',
  itemsCountAttribute: 'itemsSelector',
  screenshot: 'screenshotSelector',
  timefilterDurationAttribute: 'timefilterDurationSelector',
  toastHeader: 'toastHeaderSelector'
};

const getMockElementsPositionAndAttributes = (title, description) => [{
  position: {
    boundingClientRect: {
      top: 0,
      left: 0,
      width: 800,
      height: 600
    },
    scroll: {
      x: 0,
      y: 0
    }
  },
  attributes: {
    title,
    description
  }
}];

const mockWaitForSelector = jest.fn();
mockWaitForSelector.mockImplementation(selectorArg => {
  const {
    renderComplete,
    itemsCountAttribute,
    toastHeader
  } = mockSelectors;

  if (selectorArg === `${renderComplete},[${itemsCountAttribute}]`) {
    return Promise.resolve(true);
  } else if (selectorArg === toastHeader) {
    return Rx.never().toPromise();
  }

  throw new Error(selectorArg);
});
const mockBrowserEvaluate = jest.fn();
mockBrowserEvaluate.mockImplementation(() => {
  const lastCallIndex = mockBrowserEvaluate.mock.calls.length - 1;
  const {
    context: mockCall
  } = mockBrowserEvaluate.mock.calls[lastCallIndex][1];

  if (mockCall === contexts.CONTEXT_SKIPTELEMETRY) {
    return Promise.resolve();
  }

  if (mockCall === contexts.CONTEXT_GETNUMBEROFITEMS) {
    return Promise.resolve(1);
  }

  if (mockCall === contexts.CONTEXT_GETBROWSERDIMENSIONS) {
    return Promise.resolve([600, 800]);
  }

  if (mockCall === contexts.CONTEXT_INJECTCSS) {
    return Promise.resolve();
  }

  if (mockCall === contexts.CONTEXT_WAITFORRENDER) {
    return Promise.resolve();
  }

  if (mockCall === contexts.CONTEXT_GETTIMERANGE) {
    return Promise.resolve('Default GetTimeRange Result');
  }

  if (mockCall === contexts.CONTEXT_ELEMENTATTRIBUTES) {
    return Promise.resolve(getMockElementsPositionAndAttributes('Default Mock Title', 'Default '));
  }

  throw new Error(mockCall);
});
const mockScreenshot = jest.fn();
mockScreenshot.mockImplementation(item => {
  return Promise.resolve(`allyourBase64`);
});

const getCreatePage = driver => jest.fn().mockImplementation(() => Rx.of({
  driver,
  exit$: Rx.never()
}));

const defaultOpts = {
  evaluate: mockBrowserEvaluate,
  waitForSelector: mockWaitForSelector,
  waitFor: jest.fn(),
  screenshot: mockScreenshot,
  open: jest.fn(),
  getCreatePage
};

const createMockBrowserDriverFactory = async (logger, opts = {}) => {
  const captureConfig = {
    timeouts: {
      openUrl: _moment.default.duration(60, 's'),
      waitForElements: _moment.default.duration(30, 's'),
      renderComplete: _moment.default.duration(30, 's')
    },
    browser: {
      type: 'chromium',
      chromium: {
        inspect: false,
        disableSandbox: false,
        proxy: {
          enabled: false,
          server: undefined,
          bypass: undefined
        }
      },
      autoDownload: false
    },
    networkPolicy: {
      enabled: true,
      rules: []
    },
    viewport: {
      width: 800,
      height: 600
    },
    loadDelay: _moment.default.duration(2, 's'),
    zoom: 2,
    maxAttempts: 1
  };
  const binaryPath = '/usr/local/share/common/secure/super_awesome_binary';

  const mockBrowserDriverFactory = _browsers.chromium.createDriverFactory(binaryPath, captureConfig, logger);

  const mockPage = {
    setViewport: () => {}
  };
  const mockBrowserDriver = new _browsers.HeadlessChromiumDriver(mockPage, {
    inspect: true,
    networkPolicy: captureConfig.networkPolicy
  }); // mock the driver methods as either default mocks or passed-in

  mockBrowserDriver.waitForSelector = opts.waitForSelector ? opts.waitForSelector : defaultOpts.waitForSelector; // prettier-ignore

  mockBrowserDriver.waitFor = opts.waitFor ? opts.waitFor : defaultOpts.waitFor;
  mockBrowserDriver.evaluate = opts.evaluate ? opts.evaluate : defaultOpts.evaluate;
  mockBrowserDriver.screenshot = opts.screenshot ? opts.screenshot : defaultOpts.screenshot;
  mockBrowserDriver.open = opts.open ? opts.open : defaultOpts.open;

  mockBrowserDriver.isPageOpen = () => true;

  mockBrowserDriverFactory.createPage = opts.getCreatePage ? opts.getCreatePage(mockBrowserDriver) : getCreatePage(mockBrowserDriver);
  return mockBrowserDriverFactory;
};

exports.createMockBrowserDriverFactory = createMockBrowserDriverFactory;