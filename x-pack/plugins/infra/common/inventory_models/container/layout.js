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

var _layout_content = require("../../../public/pages/metrics/metric_detail/components/layout_content");

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
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


const Layout = (0, _common.withTheme)(({
  metrics,
  onChangeRangeTime,
  theme
}) => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_metadata_details.MetadataDetails, null), /*#__PURE__*/_react.default.createElement(_layout_content.LayoutContent, null, /*#__PURE__*/_react.default.createElement(_section.Section, {
  navLabel: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.layoutLabel', {
    defaultMessage: 'Container'
  }),
  sectionLabel: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.overviewSection.sectionLabel', {
    defaultMessage: 'Container Overview'
  }),
  metrics: metrics,
  onChangeRangeTime: onChangeRangeTime
}, /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "containerOverview"
}, /*#__PURE__*/_react.default.createElement(_gauges_section_vis.GaugesSectionVis, {
  seriesOverrides: {
    cpu: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.overviewSection.cpuUsageSeriesLabel', {
        defaultMessage: 'CPU Usage'
      }),
      color: theme.eui.euiColorFullShade,
      formatter: 'percent',
      gaugeMax: 1
    },
    memory: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.overviewSection.memoryUsageSeriesLabel', {
        defaultMessage: 'Memory Usage'
      }),
      color: theme.eui.euiColorFullShade,
      formatter: 'percent',
      gaugeMax: 1
    },
    rx: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.overviewSection.inboundRXSeriesLabel', {
        defaultMessage: 'Inbound (RX)'
      }),
      color: theme.eui.euiColorFullShade,
      formatter: 'bits',
      formatterTemplate: '{{value}}/s'
    },
    tx: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.overviewSection.outboundTXSeriesLabel', {
        defaultMessage: 'Outbound (TX)'
      }),
      color: theme.eui.euiColorFullShade,
      formatter: 'bits',
      formatterTemplate: '{{value}}/s'
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "containerCpuUsage",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.cpuUsageSection.sectionLabel', {
    defaultMessage: 'CPU Usage'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  stacked: true,
  type: "area",
  formatter: "percent",
  seriesOverrides: {
    cpu: {
      color: theme.eui.euiColorVis1
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "containerMemory",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.memoryUsageSection.sectionLabel', {
    defaultMessage: 'Memory Usage'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  stacked: true,
  type: "area",
  formatter: "percent",
  seriesOverrides: {
    memory: {
      color: theme.eui.euiColorVis1
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "containerNetworkTraffic",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.networkTrafficSection.sectionLabel', {
    defaultMessage: 'Network Traffic'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  formatter: "bits",
  formatterTemplate: "{{value}}/s",
  type: "area",
  seriesOverrides: {
    rx: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.networkTrafficSection.networkRxRateSeriesLabel', {
        defaultMessage: 'in'
      })
    },
    tx: {
      color: theme.eui.euiColorVis2,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.networkTrafficSection.networkTxRateSeriesLabel', {
        defaultMessage: 'out'
      })
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "containerDiskIOOps",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.diskIoOpsSection.sectionLabel', {
    defaultMessage: 'Disk IO (Ops)'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  type: "area",
  formatterTemplate: "{{value}}/s",
  formatter: "number",
  seriesOverrides: {
    read: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.diskIoOpsSection.readRateSeriesLabel', {
        defaultMessage: 'reads'
      })
    },
    write: {
      color: theme.eui.euiColorVis2,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.diskIoOpsSection.writeRateSeriesLabel', {
        defaultMessage: 'writes'
      })
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "containerDiskIOBytes",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.diskIoBytesSection.sectionLabel', {
    defaultMessage: 'Disk IO (Bytes)'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  type: "area",
  formatter: "bytes",
  formatterTemplate: "{{value}}/s",
  seriesOverrides: {
    read: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.diskIoBytesSection.readRateSeriesLabel', {
        defaultMessage: 'reads'
      })
    },
    write: {
      color: theme.eui.euiColorVis2,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.containerMetricsLayout.diskIoBytesSection.writeRateSeriesLabel', {
        defaultMessage: 'writes'
      })
    }
  }
}))))));
exports.Layout = Layout;