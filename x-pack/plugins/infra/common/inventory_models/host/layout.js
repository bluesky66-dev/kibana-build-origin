"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layout = void 0;

var _react = _interopRequireDefault(require("react"));

var _i18n = require("@kbn/i18n");

var _common = require("../../../../../../src/plugins/kibana_react/common");

var _section = require("../../../public/pages/metrics/metric_detail/components/section");

var _sub_section = require("../../../public/pages/metrics/metric_detail/components/sub_section");

var _gauges_section_vis = require("../../../public/pages/metrics/metric_detail/components/gauges_section_vis");

var _chart_section_vis = require("../../../public/pages/metrics/metric_detail/components/chart_section_vis");

var Aws = _interopRequireWildcard(require("../shared/layouts/aws"));

var Ngnix = _interopRequireWildcard(require("../shared/layouts/nginx"));

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
}) => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_metadata_details.MetadataDetails, {
  fields: ['host.hostname', 'host.os.name', 'host.os.kernel', 'host.containerized', 'cloud.provider', 'cloud.availability_zone', 'cloud.machine.type', 'cloud.project.id', 'cloud.instance.id', 'cloud.instance.name']
}), /*#__PURE__*/_react.default.createElement(_layout_content.LayoutContent, null, /*#__PURE__*/_react.default.createElement(_section.Section, {
  navLabel: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.layoutLabel', {
    defaultMessage: 'Host'
  }),
  sectionLabel: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.overviewSection.sectionLabel', {
    defaultMessage: 'Host Overview'
  }),
  metrics: metrics,
  onChangeRangeTime: onChangeRangeTime
}, /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "hostSystemOverview"
}, /*#__PURE__*/_react.default.createElement(_gauges_section_vis.GaugesSectionVis, {
  seriesOverrides: {
    cpu: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.overviewSection.cpuUsageSeriesLabel', {
        defaultMessage: 'CPU Usage'
      }),
      color: theme.eui.euiColorFullShade,
      formatter: 'percent',
      gaugeMax: 1
    },
    load: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.overviewSection.loadSeriesLabel', {
        defaultMessage: 'Load (5m)'
      }),
      color: theme.eui.euiColorFullShade
    },
    memory: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.overviewSection.memoryCapacitySeriesLabel', {
        defaultMessage: 'Memory Usage'
      }),
      color: theme.eui.euiColorFullShade,
      formatter: 'percent',
      gaugeMax: 1
    },
    rx: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.overviewSection.inboundRXSeriesLabel', {
        defaultMessage: 'Inbound (RX)'
      }),
      color: theme.eui.euiColorFullShade,
      formatter: 'bits',
      formatterTemplate: '{{value}}/s'
    },
    tx: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.overviewSection.outboundTXSeriesLabel', {
        defaultMessage: 'Outbound (TX)'
      }),
      color: theme.eui.euiColorFullShade,
      formatter: 'bits',
      formatterTemplate: '{{value}}/s'
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "hostCpuUsage",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.cpuUsageSection.sectionLabel', {
    defaultMessage: 'CPU Usage'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  stacked: true,
  type: "area",
  formatter: "percent",
  seriesOverrides: {
    user: {
      color: theme.eui.euiColorVis0
    },
    system: {
      color: theme.eui.euiColorVis2
    },
    steal: {
      color: theme.eui.euiColorVis9
    },
    irq: {
      color: theme.eui.euiColorVis4
    },
    softirq: {
      color: theme.eui.euiColorVis6
    },
    iowait: {
      color: theme.eui.euiColorVis7
    },
    nice: {
      color: theme.eui.euiColorVis5
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "hostLoad",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.loadSection.sectionLabel', {
    defaultMessage: 'Load'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  seriesOverrides: {
    load_1m: {
      color: theme.eui.euiColorVis0,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.loadSection.oneMinuteSeriesLabel', {
        defaultMessage: '1m'
      })
    },
    load_5m: {
      color: theme.eui.euiColorVis1,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.loadSection.fiveMinuteSeriesLabel', {
        defaultMessage: '5m'
      })
    },
    load_15m: {
      color: theme.eui.euiColorVis3,
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.loadSection.fifteenMinuteSeriesLabel', {
        defaultMessage: '15m'
      })
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "hostMemoryUsage",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.memoryUsageSection.sectionLabel', {
    defaultMessage: 'Memory Usage'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  stacked: true,
  formatter: "bytes",
  type: "area",
  seriesOverrides: {
    used: {
      color: theme.eui.euiColorVis2
    },
    free: {
      color: theme.eui.euiColorVis0
    },
    cache: {
      color: theme.eui.euiColorVis1
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "hostNetworkTraffic",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.hostMetricsLayout.networkTrafficSection.sectionLabel', {
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
}))), /*#__PURE__*/_react.default.createElement(_section.Section, {
  navLabel: "Kubernetes",
  sectionLabel: _i18n.i18n.translate('xpack.infra.metricDetailPage.kubernetesMetricsLayout.overviewSection.sectionLabel', {
    defaultMessage: 'Kubernetes Overview'
  }),
  metrics: metrics,
  onChangeRangeTime: onChangeRangeTime
}, /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "hostK8sOverview"
}, /*#__PURE__*/_react.default.createElement(_gauges_section_vis.GaugesSectionVis, {
  seriesOverrides: {
    cpucap: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.kubernetesMetricsLayout.overviewSection.cpuUsageSeriesLabel', {
        defaultMessage: 'CPU Capacity'
      }),
      color: 'secondary',
      formatter: 'percent',
      gaugeMax: 1
    },
    load: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.kubernetesMetricsLayout.overviewSection.loadSeriesLabel', {
        defaultMessage: 'Load (5m)'
      }),
      color: 'secondary'
    },
    memorycap: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.kubernetesMetricsLayout.overviewSection.memoryUsageSeriesLabel', {
        defaultMessage: 'Memory Capacity'
      }),
      color: 'secondary',
      formatter: 'percent',
      gaugeMax: 1
    },
    podcap: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.kubernetesMetricsLayout.overviewSection.podCapacitySeriesLabel', {
        defaultMessage: 'Pod Capacity'
      }),
      color: 'secondary',
      formatter: 'percent',
      gaugeMax: 1
    },
    diskcap: {
      name: _i18n.i18n.translate('xpack.infra.metricDetailPage.kubernetesMetricsLayout.overviewSection.diskCapacitySeriesLabel', {
        defaultMessage: 'Disk Capacity'
      }),
      color: 'secondary',
      formatter: 'percent',
      gaugeMax: 1
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "hostK8sCpuCap",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.kubernetesMetricsLayout.nodeCpuCapacitySection.sectionLabel', {
    defaultMessage: 'Node CPU Capacity'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  formatter: "abbreviatedNumber",
  seriesOverrides: {
    capacity: {
      color: theme.eui.euiColorVis2
    },
    used: {
      color: theme.eui.euiColorVis1,
      type: 'area'
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "hostK8sMemoryCap",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.kubernetesMetricsLayout.nodeMemoryCapacitySection.sectionLabel', {
    defaultMessage: 'Node Memory Capacity'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  formatter: "bytes",
  seriesOverrides: {
    capacity: {
      color: theme.eui.euiColorVis2
    },
    used: {
      color: theme.eui.euiColorVis1,
      type: 'area'
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "hostK8sDiskCap",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.kubernetesMetricsLayout.nodeDiskCapacitySection.sectionLabel', {
    defaultMessage: 'Node Disk Capacity'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  formatter: "bytes",
  seriesOverrides: {
    capacity: {
      color: theme.eui.euiColorVis2
    },
    used: {
      color: theme.eui.euiColorVis1,
      type: 'area'
    }
  }
})), /*#__PURE__*/_react.default.createElement(_sub_section.SubSection, {
  id: "hostK8sPodCap",
  label: _i18n.i18n.translate('xpack.infra.metricDetailPage.kubernetesMetricsLayout.nodePodCapacitySection.sectionLabel', {
    defaultMessage: 'Node Pod Capacity'
  })
}, /*#__PURE__*/_react.default.createElement(_chart_section_vis.ChartSectionVis, {
  formatter: "number",
  seriesOverrides: {
    capacity: {
      color: theme.eui.euiColorVis2
    },
    used: {
      color: theme.eui.euiColorVis1,
      type: 'area'
    }
  }
}))), /*#__PURE__*/_react.default.createElement(Aws.Layout, {
  metrics: metrics,
  onChangeRangeTime: onChangeRangeTime
}), /*#__PURE__*/_react.default.createElement(Ngnix.Layout, {
  metrics: metrics,
  onChangeRangeTime: onChangeRangeTime
}))));
exports.Layout = Layout;