"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pie = void 0;

require("jquery");

var _lodash = require("lodash");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// This bit of hackiness is required because this isn't part of the main kibana bundle


const {
  pie: strings
} = _i18n.RendererStrings;

const pie = () => ({
  name: 'pie',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: false,
  render: async (domNode, config, handlers) => {
    config.options.legend.labelBoxBorderColor = 'transparent';

    if (config.font) {
      const labelFormatter = (label, slice) => {
        // font color defaults to slice color if not specified
        const fontSpec = { ...config.font.spec,
          color: config.font.spec.color || slice.color
        };
        const labelDiv = document.createElement('div');
        Object.assign(labelDiv.style, fontSpec);
        const labelSpan = new DOMParser().parseFromString(label, 'text/html').body.firstChild;
        const lineBreak = document.createElement('br');
        const percentText = document.createTextNode(`${Math.round(slice.percent)}%`);

        if (labelSpan) {
          labelDiv.appendChild(labelSpan);
        }

        labelDiv.appendChild(lineBreak);
        labelDiv.appendChild(percentText);
        return labelDiv.outerHTML;
      }; // @ts-ignore ignoring missing propery


      config.options.series.pie.label.formatter = labelFormatter;

      const legendFormatter = label => {
        const labelSpan = document.createElement('span');
        Object.assign(labelSpan.style, config.font.spec);
        labelSpan.textContent = label;
        return labelSpan.outerHTML;
      }; // @ts-ignore ignoring missing propery


      config.options.legend.labelFormatter = legendFormatter;
    }

    let plot;

    function draw() {
      if (domNode.clientHeight < 1 || domNode.clientWidth < 1) {
        return;
      }

      try {
        $(domNode).empty();

        if (!config.data || !config.data.length) {
          $(domNode).empty();
        } else {
          // Casting config.options to any here as the flot typings do not appear to be accurate.
          // For example, it does not have colors as a valid option.
          plot = $.plot($(domNode), config.data, config.options);
        }
      } catch (e) {// Nope
      }
    }

    function destroy() {
      if (plot) {
        plot.shutdown();
      }
    }

    handlers.onDestroy(destroy);
    handlers.onResize((0, _lodash.debounce)(draw, 40, {
      maxWait: 40
    })); // 1000 / 40 = 25fps

    draw();
    return handlers.done();
  }
});

exports.pie = pie;