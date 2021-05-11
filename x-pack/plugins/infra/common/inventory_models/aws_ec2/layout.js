"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layout = void 0;

var _react = _interopRequireDefault(require("react"));

var _i18n = require("@kbn/i18n");

var _section = require("../../../public/pages/metrics/metric_detail/components/section");

var _sub_section = require("../../../public/pages/metrics/metric_detail/components/sub_section");

var _layout_content = require("../../../public/pages/metrics/metric_detail/components/layout_content");

var _chart_section_vis = require("../../../public/pages/metrics/metric_detail/components/chart_section_vis");

var _common = require("../../../../../../src/plugins/kibana_react/common");

var _metadata_details = require("../../../public/pages/metrics/metric_detail/components/metadata_details");

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
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


const Layout = (0, _common.withTheme)(({
  metrics,
  theme,
  onChangeRangeTime
}) => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_metadata_details.MetadataDetails, {
  fields: ['cloud.instance.id', 'cloud.provider', 'cloud.availability_zone', 'cloud.machine.type', 'cloud.instance.name', 'cloud.project.id']
}), /*#__PURE__*/_react.default.createElement(_layout_content.LayoutContent, null, /*#__PURE__*/_react.default.createElement(_section.Section, {
  navLabel: "AWS EC2",
  sectionLabel: _i18n.i18n.translate('xpack.infra.metricDetailPage.ec2MetricsLayout.overviewSection.sectionLabel', {
    defaultMessage: 'Aws EC2 Overview'
  }),
  metrics: metrics,
  onChangeRangeTime: onChangeRangeTime
}, /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "awsEC2CpuUtilization",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.ec2MetricsLayout.cpuUsageSection.sectionLabel', {
    defaultMessage: 'CPU Usage'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  stacked: true,
  type: "area",
  formatter: "percent",
  seriesOverrides: {
    total: {
      color: theme.eui.euiColorVis1
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "awsEC2NetworkTraffic",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.ec2MetricsLayout.networkTrafficSection.sectionLabel', {
    defaultMessage: 'Network Traffic'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  formatter: "bits",
  formatterTemplate: "{{value}}/s",
  type: "area",
  seriesOverrides: {
    rx: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.networkTrafficSection.networkRxRateSeriesLabel', {
        defaultMessage: 'in'
      })
    },
    tx: {
      color: theme.eui.euiColorVis2,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.networkTrafficSection.networkTxRateSeriesLabel', {
        defaultMessage: 'out'
      })
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "awsEC2DiskIOBytes",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.ec2MetricsLayout.diskIOBytesSection.sectionLabel', {
    defaultMessage: 'Disk IO (Bytes)'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  formatter: "bytes",
  formatterTemplate: "{{value}}/s",
  type: "area",
  seriesOverrides: {
    write: {
      color: theme.eui.euiColorVis2,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.ec2MetricsLayout.diskIOBytesSection.writeLabel', {
        defaultMessage: 'writes'
      })
    },
    read: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.ec2MetricsLayout.diskIOBytesSection.readLabel', {
        defaultMessage: 'reads'
      })
    }
  }
}))))));
exports.Layout = Layout;