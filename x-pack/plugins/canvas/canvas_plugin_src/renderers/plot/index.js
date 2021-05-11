"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plot = void 0;

require("jquery");

var _lodash = require("lodash");

var _i18n = require("../../../i18n");

var _size = require("./plugins/size");

var _text = require("./plugins/text");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// This bit of hackiness is required because this isn't part of the main kibana bundle
// @ts-expect-error Not going to convert
// @ts-expect-error Not going to convert


const {
  plot: strings
} = _i18n.RendererStrings;

const render = async (domNode, config, handlers) => {
  // TODO: OH NOES
  if (!(0, _lodash.includes)($.plot.plugins, _size.size)) {
    $.plot.plugins.push(_size.size);
  }

  if (!(0, _lodash.includes)($.plot.plugins, _text.text)) {
    $.plot.plugins.push(_text.text);
  }

  let plot;

  function draw() {
    if (domNode.clientHeight < 1 || domNode.clientWidth < 1) {
      return;
    }

    if (config.font) {
      const legendFormatter = label => {
        const labelSpan = document.createElement('span');
        Object.assign(labelSpan.style, config.font.spec);
        labelSpan.textContent = label;
        return labelSpan.outerHTML;
      };

      config.options.legend.labelFormatter = legendFormatter;
    }

    try {
      if (!plot) {
        plot = $.plot($(domNode), config.data, config.options);
      } else {
        plot.resize();
        plot.setupGrid();
        plot.draw();
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
};

const plot = () => ({
  name: 'plot',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: false,
  render
});

exports.plot = plot;