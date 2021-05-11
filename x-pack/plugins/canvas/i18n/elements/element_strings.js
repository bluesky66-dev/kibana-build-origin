"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElementStrings = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This function will return a dictionary of strings, organized by Canvas
 * Element specification.  This function requires that `i18nProvider` be
 * properly initialized.
 */


const getElementStrings = () => ({
  areaChart: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.areaChartDisplayName', {
      defaultMessage: 'Area'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.areaChartHelpText', {
      defaultMessage: 'A line chart with a filled body'
    })
  },
  bubbleChart: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.bubbleChartDisplayName', {
      defaultMessage: 'Bubble'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.bubbleChartHelpText', {
      defaultMessage: 'A customizable bubble chart'
    })
  },
  debug: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.debugDisplayName', {
      defaultMessage: 'Debug data'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.debugHelpText', {
      defaultMessage: 'Just dumps the configuration of the element'
    })
  },
  dropdownFilter: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.dropdownFilterDisplayName', {
      defaultMessage: 'Dropdown select'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.dropdownFilterHelpText', {
      defaultMessage: 'A dropdown from which you can select values for an "exactly" filter'
    })
  },
  filterDebug: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.filterDebugDisplayName', {
      defaultMessage: 'Debug filters'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.filterDebugHelpText', {
      defaultMessage: 'Shows the underlying global filters in a workpad'
    })
  },
  horizontalBarChart: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.horizontalBarChartDisplayName', {
      defaultMessage: 'Horizontal bar'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.horizontalBarChartHelpText', {
      defaultMessage: 'A customizable horizontal bar chart'
    })
  },
  horizontalProgressBar: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.horizontalProgressBarDisplayName', {
      defaultMessage: 'Horizontal bar'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.horizontalProgressBarHelpText', {
      defaultMessage: 'Displays progress as a portion of a horizontal bar'
    })
  },
  horizontalProgressPill: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.horizontalProgressPillDisplayName', {
      defaultMessage: 'Horizontal pill'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.horizontalProgressPillHelpText', {
      defaultMessage: 'Displays progress as a portion of a horizontal pill'
    })
  },
  image: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.imageDisplayName', {
      defaultMessage: 'Image'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.imageHelpText', {
      defaultMessage: 'A static image'
    })
  },
  lineChart: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.lineChartDisplayName', {
      defaultMessage: 'Line'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.lineChartHelpText', {
      defaultMessage: 'A customizable line chart'
    })
  },
  markdown: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.markdownDisplayName', {
      defaultMessage: 'Text'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.markdownHelpText', {
      defaultMessage: 'Add text using Markdown'
    })
  },
  metric: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.metricDisplayName', {
      defaultMessage: 'Metric'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.metricHelpText', {
      defaultMessage: 'A number with a label'
    })
  },
  pie: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.pieDisplayName', {
      defaultMessage: 'Pie'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.pieHelpText', {
      defaultMessage: 'Pie chart'
    })
  },
  plot: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.plotDisplayName', {
      defaultMessage: 'Coordinate plot'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.plotHelpText', {
      defaultMessage: 'Mixed line, bar or dot charts'
    })
  },
  progressGauge: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.progressGaugeDisplayName', {
      defaultMessage: 'Gauge'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.progressGaugeHelpText', {
      defaultMessage: 'Displays progress as a portion of a gauge'
    })
  },
  progressSemicircle: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.progressSemicircleDisplayName', {
      defaultMessage: 'Semicircle'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.progressSemicircleHelpText', {
      defaultMessage: 'Displays progress as a portion of a semicircle'
    })
  },
  progressWheel: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.progressWheelDisplayName', {
      defaultMessage: 'Wheel'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.progressWheelHelpText', {
      defaultMessage: 'Displays progress as a portion of a wheel'
    })
  },
  repeatImage: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.repeatImageDisplayName', {
      defaultMessage: 'Image repeat'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.repeatImageHelpText', {
      defaultMessage: 'Repeats an image N times'
    })
  },
  revealImage: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.revealImageDisplayName', {
      defaultMessage: 'Image reveal'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.revealImageHelpText', {
      defaultMessage: 'Reveals a percentage of an image'
    })
  },
  shape: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.shapeDisplayName', {
      defaultMessage: 'Shape'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.shapeHelpText', {
      defaultMessage: 'A customizable shape'
    })
  },
  table: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.tableDisplayName', {
      defaultMessage: 'Data table'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.tableHelpText', {
      defaultMessage: 'A scrollable grid for displaying data in a tabular format'
    })
  },
  timeFilter: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.timeFilterDisplayName', {
      defaultMessage: 'Time filter'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.timeFilterHelpText', {
      defaultMessage: 'Set a time window'
    })
  },
  verticalBarChart: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.verticalBarChartDisplayName', {
      defaultMessage: 'Vertical bar'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.verticalBarChartHelpText', {
      defaultMessage: 'A customizable vertical bar chart'
    })
  },
  verticalProgressBar: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.verticalProgressBarDisplayName', {
      defaultMessage: 'Vertical bar'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.verticalProgressBarHelpText', {
      defaultMessage: 'Displays progress as a portion of a vertical bar'
    })
  },
  verticalProgressPill: {
    displayName: _i18n.i18n.translate('xpack.canvas.elements.verticalProgressPillDisplayName', {
      defaultMessage: 'Vertical pill'
    }),
    help: _i18n.i18n.translate('xpack.canvas.elements.verticalProgressPillHelpText', {
      defaultMessage: 'Displays progress as a portion of a vertical pill'
    })
  }
});

exports.getElementStrings = getElementStrings;