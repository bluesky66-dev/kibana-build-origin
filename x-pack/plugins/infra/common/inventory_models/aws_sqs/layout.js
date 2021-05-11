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
  navLabel: "AWS SQS",
  sectionLabel: _i18n.i18n.translate('xpack.infra.metricDetailPage.sqsMetricsLayout.overviewSection.sectionLabel', {
    defaultMessage: 'Aws SQS Overview'
  }),
  metrics: metrics,
  onChangeRangeTime: onChangeRangeTime
}, /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "awsSQSMessagesVisible",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.sqsMetricsLayout.messagesVisible.sectionLabel', {
    defaultMessage: 'Messages Available'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  type: "bar",
  formatter: "abbreviatedNumber",
  seriesOverrides: {
    visible: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.sqsMetricsLayout.messagesVisible.chartLabel', {
        defaultMessage: 'Available'
      })
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "awsSQSMessagesDelayed",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.sqsMetricsLayout.messagesDelayed.sectionLabel', {
    defaultMessage: 'Messages Delayed'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  type: "bar",
  formatter: "abbreviatedNumber",
  seriesOverrides: {
    delayed: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.sqsMetricsLayout.messagesDelayed.chartLabel', {
        defaultMessage: 'Delayed'
      })
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "awsSQSMessagesSent",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.sqsMetricsLayout.messagesSent.sectionLabel', {
    defaultMessage: 'Messages Added'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  type: "bar",
  formatter: "abbreviatedNumber",
  seriesOverrides: {
    sent: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.sqsMetricsLayout.messagesSent.chartLabel', {
        defaultMessage: 'Added'
      })
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "awsSQSMessagesEmpty",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.sqsMetricsLayout.messagesEmpty.sectionLabel', {
    defaultMessage: 'Messages Empty'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  type: "bar",
  formatter: "abbreviatedNumber",
  seriesOverrides: {
    sent: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.sqsMetricsLayout.messagesEmpty.chartLabel', {
        defaultMessage: 'Empty'
      })
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "awsSQSOldestMessage",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.sqsMetricsLayout.oldestMessage.sectionLabel', {
    defaultMessage: 'Oldest Message'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  type: "bar",
  formatter: "abbreviatedNumber",
  seriesOverrides: {
    oldest: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.sqsMetricsLayout.oldestMessage.chartLabel', {
        defaultMessage: 'Age'
      })
    }
  }
}))))));
exports.Layout = Layout;