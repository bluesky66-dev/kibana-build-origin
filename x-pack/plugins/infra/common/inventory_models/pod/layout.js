"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layout = void 0;

var _react = _interopRequireDefault(require("react"));

var _i18n = require("@kbn/i18n");

var _section = require("../../../public/pages/metrics/metric_detail/components/section");

var _sub_section = require("../../../public/pages/metrics/metric_detail/components/sub_section");

var _gauges_section_vis = require("../../../public/pages/metrics/metric_detail/components/gauges_section_vis");

var _chart_section_vis = require("../../../public/pages/metrics/metric_detail/components/chart_section_vis");

var _common = require("../../../../../../src/plugins/kibana_react/common");

var Nginx = _interopRequireWildcard(require("../shared/layouts/nginx"));

var _metadata_details = require("../../../public/pages/metrics/metric_detail/components/metadata_details");

var _layout_content = require("../../../public/pages/metrics/metric_detail/components/layout_content");

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
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


const Layout = (0, _common.withTheme)(({
  metrics,
  onChangeRangeTime,
  theme
}) => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_metadata_details.MetadataDetails, null), /*#__PURE__*/_react.default.createElement(_layout_content.LayoutContent, null, /*#__PURE__*/_react.default.createElement(_section.Section, {
  navLabel: _i18n.i18n.translate('xpack.infra.metricDetailPage.podMetricsLayout.layoutLabel', {
    defaultMessage: 'Pod'
  }),
  sectionLabel: _i18n.i18n.translate('xpack.infra.metricDetailPage.podMetricsLayout.overviewSection.sectionLabel', {
    defaultMessage: 'Pod Overview'
  }),
  metrics: metrics,
  onChangeRangeTime: onChangeRangeTime
}, /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "podOverview"
}, /*#__PURE__*/_react.default.createElement(_gauges_section_vis.GaugesSectionVis, {
  seriesOverrides: {
    cpu: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.podMetricsLayout.overviewSection.cpuUsageSeriesLabel', {
        defaultMessage: 'CPU Usage'
      }),
      color: theme.eui.euiColorFullShade,
      formatter: 'percent',
      gaugeMax: 1
    },
    memory: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.podMetricsLayout.overviewSection.memoryUsageSeriesLabel', {
        defaultMessage: 'Memory Usage'
      }),
      color: theme.eui.euiColorFullShade,
      formatter: 'percent',
      gaugeMax: 1
    },
    rx: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.podMetricsLayout.overviewSection.inboundRXSeriesLabel', {
        defaultMessage: 'Inbound (RX)'
      }),
      color: theme.eui.euiColorFullShade,
      formatter: 'bits',
      formatterTemplate: '{{value}}/s'
    },
    tx: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.podMetricsLayout.overviewSection.outboundTXSeriesLabel', {
        defaultMessage: 'Outbound (TX)'
      }),
      color: theme.eui.euiColorFullShade,
      formatter: 'bits',
      formatterTemplate: '{{value}}/s'
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "podCpuUsage",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.podMetricsLayout.cpuUsageSection.sectionLabel', {
    defaultMessage: 'CPU Usage'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  formatter: "percent",
  type: "area",
  seriesOverrides: {
    cpu: {
      color: theme.eui.euiColorVis1
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "podMemoryUsage",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.podMetricsLayout.memoryUsageSection.sectionLabel', {
    defaultMessage: 'Memory Usage'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  type: "area",
  formatter: "percent",
  seriesOverrides: {
    memory: {
      color: theme.eui.euiColorVis1
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "podNetworkTraffic",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.podMetricsLayout.networkTrafficSection.sectionLabel', {
    defaultMessage: 'Network Traffic'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  formatter: "bits",
  formatterTemplate: "{{value}}/s",
  type: "area",
  seriesOverrides: {
    rx: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.podMetricsLayout.networkTrafficSection.networkRxRateSeriesLabel', {
        defaultMessage: 'in'
      })
    },
    tx: {
      color: theme.eui.euiColorVis2,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.podMetricsLayout.networkTrafficSection.networkTxRateSeriesLabel', {
        defaultMessage: 'out'
      })
    }
  }
}))), /*#__PURE__*/_react.default.createElement(Nginx.Layout, {
  metrics: metrics,
  onChangeRangeTime: onChangeRangeTime
}))));
exports.Layout = Layout;