"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RendererStrings = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const RendererStrings = {
  advancedFilter: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.advancedFilter.displayName', {
      defaultMessage: 'Advanced filter'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.advancedFilter.helpDescription', {
      defaultMessage: 'Render a Canvas filter expression'
    })
  },
  debug: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.debug.displayName', {
      defaultMessage: 'Debug'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.debug.helpDescription', {
      defaultMessage: 'Render debug output as formatted {JSON}',
      values: {
        JSON: _constants.JSON
      }
    })
  },
  dropdownFilter: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.dropdownFilter.displayName', {
      defaultMessage: 'Dropdown filter'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.dropdownFilter.helpDescription', {
      defaultMessage: 'A dropdown from which you can select values for an "{exactly}" filter',
      values: {
        exactly: 'exactly'
      }
    })
  },
  embeddable: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.embeddable.displayName', {
      defaultMessage: 'Embeddable'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.embeddable.helpDescription', {
      defaultMessage: 'Renders an embeddable Saved Object from other parts of Kibana'
    })
  },
  error: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.error.displayName', {
      defaultMessage: 'Error information'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.error.helpDescription', {
      defaultMessage: 'Render error data in a way that is helpful to users'
    })
  },
  image: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.image.displayName', {
      defaultMessage: 'Image'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.image.helpDescription', {
      defaultMessage: 'Render an image'
    })
  },
  markdown: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.markdown.displayName', {
      defaultMessage: 'Markdown'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.markdown.helpDescription', {
      defaultMessage: 'Render {HTML} using {MARKDOWN} input',
      values: {
        HTML: _constants.HTML,
        MARKDOWN: _constants.MARKDOWN
      }
    })
  },
  metric: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.metric.displayName', {
      defaultMessage: 'Metric'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.metric.helpDescription', {
      defaultMessage: 'Render a number over a label'
    })
  },
  pie: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.pie.displayName', {
      defaultMessage: 'Pie chart'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.pie.helpDescription', {
      defaultMessage: 'Render a pie chart from data'
    })
  },
  plot: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.plot.displayName', {
      defaultMessage: 'Coordinate plot'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.plot.helpDescription', {
      defaultMessage: 'Render an XY plot from your data'
    })
  },
  progress: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.progress.displayName', {
      defaultMessage: 'Progress indicator'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.progress.helpDescription', {
      defaultMessage: 'Render a progress indicator that reveals a percentage of an element'
    })
  },
  repeatImage: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.repeatImage.displayName', {
      defaultMessage: 'Image repeat'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.repeatImage.helpDescription', {
      defaultMessage: 'Repeat an image a given number of times'
    })
  },
  revealImage: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.revealImage.displayName', {
      defaultMessage: 'Image reveal'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.revealImage.helpDescription', {
      defaultMessage: 'Reveal a percentage of an image to make a custom gauge-style chart'
    })
  },
  shape: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.shape.displayName', {
      defaultMessage: 'Shape'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.shape.helpDescription', {
      defaultMessage: 'Render a basic shape'
    })
  },
  table: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.table.displayName', {
      defaultMessage: 'Data table'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.table.helpDescription', {
      defaultMessage: 'Render tabular data as {HTML}',
      values: {
        HTML: _constants.HTML
      }
    })
  },
  text: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.text.displayName', {
      defaultMessage: 'Plain text'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.text.helpDescription', {
      defaultMessage: 'Render output as plain text'
    })
  },
  timeFilter: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.renderer.timeFilter.displayName', {
      defaultMessage: 'Time filter'
    }),
    getHelpDescription: () => _i18n.i18n.translate('xpack.canvas.renderer.timeFilter.helpDescription', {
      defaultMessage: 'Set a time window to filter your data'
    })
  }
};
exports.RendererStrings = RendererStrings;