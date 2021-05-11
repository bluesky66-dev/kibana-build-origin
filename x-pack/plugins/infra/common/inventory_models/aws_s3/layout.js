"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layout = void 0;

var _react = _interopRequireDefault(require("react"));

var _i18n = require("@kbn/i18n");

var _section = require("../../../public/pages/metrics/metric_detail/components/section");

var _sub_section = require("../../../public/pages/metrics/metric_detail/components/sub_section");

var _chart_section_vis = require("../../../public/pages/metrics/metric_detail/components/chart_section_vis");

var _common = require("../../../../../../src/plugins/kibana_react/common");

var _layout_content = require("../../../public/pages/metrics/metric_detail/components/layout_content");

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
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


const Layout = (0, _common.withTheme)(({
  metrics,
  onChangeRangeTime,
  theme
}) => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_layout_content.LayoutContent, null, /*#__PURE__*/_react.default.createElement(_section.Section, {
  navLabel: "AWS S3",
  sectionLabel: _i18n.i18n.translate('xpack.infra.metricDetailPage.s3MetricsLayout.overviewSection.sectionLabel', {
    defaultMessage: 'Aws S3 Overview'
  }),
  metrics: metrics,
  onChangeRangeTime: onChangeRangeTime
}, /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "awsS3BucketSize",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.s3MetricsLayout.bucketSize.sectionLabel', {
    defaultMessage: 'Bucket Size'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  type: "bar",
  formatter: "bytes",
  seriesOverrides: {
    bytes: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.s3MetricsLayout.bucketSize.chartLabel', {
        defaultMessage: 'Total Bytes'
      })
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "awsS3NumberOfObjects",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.s3MetricsLayout.numberOfObjects.sectionLabel', {
    defaultMessage: 'Number of Objects'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  type: "bar",
  formatter: "abbreviatedNumber",
  seriesOverrides: {
    objects: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.s3MetricsLayout.numberOfObjects.chartLabel', {
        defaultMessage: 'Objects'
      })
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "awsS3TotalRequests",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.s3MetricsLayout.totalRequests.sectionLabel', {
    defaultMessage: 'Total Requests'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  type: "bar",
  formatter: "abbreviatedNumber",
  seriesOverrides: {
    total: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.s3MetricsLayout.totalRequests.chartLabel', {
        defaultMessage: 'Requests'
      })
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "awsS3DownloadBytes",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.s3MetricsLayout.downloadBytes.sectionLabel', {
    defaultMessage: 'Downloaded Bytes'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  type: "bar",
  formatter: "bytes",
  seriesOverrides: {
    bytes: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.s3MetricsLayout.downloadBytes.chartLabel', {
        defaultMessage: 'Bytes'
      })
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "awsS3UploadBytes",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.s3MetricsLayout.uploadBytes.sectionLabel', {
    defaultMessage: 'Uploaded Bytes'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  type: "bar",
  formatter: "bytes",
  seriesOverrides: {
    bytes: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.s3MetricsLayout.uploadBytes.chartLabel', {
        defaultMessage: 'Bytes'
      })
    }
  }
}))))));
exports.Layout = Layout;