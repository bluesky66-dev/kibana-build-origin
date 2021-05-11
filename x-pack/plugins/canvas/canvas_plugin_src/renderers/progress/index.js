"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.progress = void 0;

var _get_id = require("../../../public/lib/get_id");

var _i18n = require("../../../i18n");

var _shapes = require("./shapes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  progress: strings
} = _i18n.RendererStrings;

const progress = () => ({
  name: 'progress',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: true,

  render(domNode, config, handlers) {
    const {
      shape,
      value,
      max,
      valueColor,
      barColor,
      valueWeight,
      barWeight,
      label,
      font
    } = config;
    const percent = value / max;
    const shapeDef = _shapes.shapes[shape];
    const offset = Math.max(valueWeight, barWeight);

    if (shapeDef) {
      const parser = new DOMParser();
      const shapeSvg = parser.parseFromString(shapeDef, 'image/svg+xml').getElementsByTagName('svg').item(0);
      const initialViewBox = shapeSvg.getAttribute('viewBox').split(' ').map(v => parseInt(v, 10));
      let [minX, minY, width, height] = initialViewBox;

      if (shape !== 'horizontalBar') {
        minX -= offset / 2;
        width += offset;
      }

      if (shape === 'semicircle') {
        minY -= offset / 2;
        height += offset / 2;
      } else if (shape !== 'verticalBar') {
        minY -= offset / 2;
        height += offset;
      }

      shapeSvg.setAttribute('className', 'canvasProgress');
      const svgId = (0, _get_id.getId)('svg');
      shapeSvg.id = svgId;
      const bar = shapeSvg.getElementsByTagName('path').item(0);
      bar.setAttribute('className', 'canvasProgress__background');
      bar.setAttribute('fill', 'none');
      bar.setAttribute('stroke', barColor);
      bar.setAttribute('stroke-width', `${barWeight}px`);
      const valueSvg = bar.cloneNode(true);
      valueSvg.setAttribute('className', 'canvasProgress__value');
      valueSvg.setAttribute('stroke', valueColor);
      valueSvg.setAttribute('stroke-width', `${valueWeight}px`);
      const length = valueSvg.getTotalLength();
      const to = length * (1 - percent);
      valueSvg.setAttribute('stroke-dasharray', String(length));
      valueSvg.setAttribute('stroke-dashoffset', String(Math.max(0, to)));
      shapeSvg.appendChild(valueSvg);
      const text = shapeSvg.getElementsByTagName('text').item(0);

      if (label && text) {
        text.textContent = String(label);
        text.setAttribute('className', 'canvasProgress__label');

        if (shape === 'horizontalPill') {
          text.setAttribute('x', String(parseInt(text.getAttribute('x'), 10) + offset / 2));
        }

        if (shape === 'verticalPill') {
          text.setAttribute('y', String(parseInt(text.getAttribute('y'), 10) - offset / 2));
        }

        Object.assign(text.style, font.spec);
        shapeSvg.appendChild(text);
        domNode.appendChild(shapeSvg);
        const {
          width: labelWidth,
          height: labelHeight
        } = text.getBBox();

        if (shape === 'horizontalBar' || shape === 'horizontalPill') {
          text.setAttribute('x', String(parseInt(text.getAttribute('x'), 10)));
          width += labelWidth;
        }

        if (shape === 'verticalBar' || shape === 'verticalPill') {
          if (labelWidth > width) {
            minX = -labelWidth / 2;
            width = labelWidth;
          }

          minY -= labelHeight;
          height += labelHeight;
        }
      }

      shapeSvg.setAttribute('viewBox', [minX, minY, width, height].join(' '));
      shapeSvg.setAttribute('width', String(domNode.offsetWidth));
      shapeSvg.setAttribute('height', String(domNode.offsetHeight));

      if (domNode.firstChild) {
        domNode.removeChild(domNode.firstChild);
      }

      domNode.appendChild(shapeSvg);
      handlers.onResize(() => {
        shapeSvg.setAttribute('width', String(domNode.offsetWidth));
        shapeSvg.setAttribute('height', String(domNode.offsetHeight));
      });
    }

    handlers.done();
  }

});

exports.progress = progress;