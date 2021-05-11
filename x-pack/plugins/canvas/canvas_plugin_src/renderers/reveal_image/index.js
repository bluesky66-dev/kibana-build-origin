"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.revealImage = void 0;

var _elastic_outline = require("../../lib/elastic_outline");

var _url = require("../../../common/lib/url");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  revealImage: strings
} = _i18n.RendererStrings;

const revealImage = () => ({
  name: 'revealImage',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: true,

  render(domNode, config, handlers) {
    const aligner = document.createElement('div');
    const img = new Image(); // modify the top-level container class

    domNode.className = 'revealImage'; // set up the overlay image

    function onLoad() {
      setSize();
      finish();
    }

    img.onload = onLoad;
    img.className = 'revealImage__image';
    img.style.clipPath = getClipPath(config.percent, config.origin);
    img.style.setProperty('-webkit-clip-path', getClipPath(config.percent, config.origin));
    img.src = (0, _url.isValidUrl)(config.image) ? config.image : _elastic_outline.elasticOutline;
    handlers.onResize(onLoad); // set up the underlay, "empty" image

    aligner.className = 'revealImageAligner';
    aligner.appendChild(img);

    if ((0, _url.isValidUrl)(config.emptyImage)) {
      // only use empty image if one is provided
      aligner.style.backgroundImage = `url(${config.emptyImage})`;
    }

    function finish() {
      const firstChild = domNode.firstChild;

      if (firstChild) {
        domNode.replaceChild(aligner, firstChild);
      } else {
        domNode.appendChild(aligner);
      }

      handlers.done();
    }

    function getClipPath(percent, origin = 'bottom') {
      const directions = {
        bottom: 0,
        left: 1,
        top: 2,
        right: 3
      };
      const values = [0, 0, 0, 0];
      values[directions[origin]] = `${100 - percent * 100}%`;
      return `inset(${values.join(' ')})`;
    }

    function setSize() {
      const imgDimensions = {
        height: img.naturalHeight,
        width: img.naturalWidth,
        ratio: img.naturalHeight / img.naturalWidth
      };
      const domNodeDimensions = {
        height: domNode.clientHeight,
        width: domNode.clientWidth,
        ratio: domNode.clientHeight / domNode.clientWidth
      };

      if (imgDimensions.ratio > domNodeDimensions.ratio) {
        img.style.height = `${domNodeDimensions.height}px`;
        img.style.width = 'initial';
      } else {
        img.style.width = `${domNodeDimensions.width}px`;
        img.style.height = 'initial';
      }
    }
  }

});

exports.revealImage = revealImage;