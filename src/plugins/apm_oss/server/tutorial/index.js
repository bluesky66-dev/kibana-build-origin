"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tutorialProvider = void 0;

var _i18n = require("@kbn/i18n");

var _on_prem = require("./envs/on_prem");

var _index_pattern = _interopRequireDefault(require("./index_pattern.json"));

var _server = require("../../../../../src/plugins/home/server");

var _index_pattern_constants = require("../../common/index_pattern_constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const apmIntro = _i18n.i18n.translate('apmOss.tutorial.introduction', {
  defaultMessage: 'Collect in-depth performance metrics and errors from inside your applications.'
});

const moduleName = 'apm';

const tutorialProvider = ({
  indexPatternTitle,
  indices
}) => () => {
  const savedObjects = [{ ..._index_pattern.default,
    id: _index_pattern_constants.APM_STATIC_INDEX_PATTERN_ID,
    attributes: { ..._index_pattern.default.attributes,
      title: indexPatternTitle
    }
  }];
  const artifacts = {
    dashboards: [{
      id: '8d3ed660-7828-11e7-8c47-65b845b5cfb3',
      linkLabel: _i18n.i18n.translate('apmOss.tutorial.specProvider.artifacts.dashboards.linkLabel', {
        defaultMessage: 'APM dashboard'
      }),
      isOverview: true
    }]
  };
  return {
    id: 'apm',
    name: _i18n.i18n.translate('apmOss.tutorial.specProvider.name', {
      defaultMessage: 'APM'
    }),
    moduleName,
    category: _server.TutorialsCategory.OTHER,
    shortDescription: apmIntro,
    longDescription: _i18n.i18n.translate('apmOss.tutorial.specProvider.longDescription', {
      defaultMessage: 'Application Performance Monitoring (APM) collects in-depth \
performance metrics and errors from inside your application. \
It allows you to monitor the performance of thousands of applications in real time. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.base_url}guide/en/apm/get-started/{config.docs.version}/index.html'
      }
    }),
    euiIconType: 'apmApp',
    artifacts,
    onPrem: (0, _on_prem.onPremInstructions)(indices),
    previewImagePath: '/plugins/apmOss/assets/apm.png',
    savedObjects,
    savedObjectsInstallMsg: _i18n.i18n.translate('apmOss.tutorial.specProvider.savedObjectsInstallMsg', {
      defaultMessage: 'An APM index pattern is required for some features in the APM UI.'
    })
  };
};

exports.tutorialProvider = tutorialProvider;