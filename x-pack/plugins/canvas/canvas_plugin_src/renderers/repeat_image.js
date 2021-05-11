"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.repeatImage = void 0;

var _jquery = _interopRequireDefault(require("jquery"));

var _lodash = require("lodash");

var _elastic_outline = require("../lib/elastic_outline");

var _url = require("../../common/lib/url");

var _i18n = require("../../i18n");

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


const {
  repeatImage: strings
} = _i18n.RendererStrings;
const {
  RepeatImage: errors
} = _i18n.ErrorStrings;

const repeatImage = () => ({
  name: 'repeatImage',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: true,

  render(domNode, config, handlers) {
    const settings = { ...config,
      image: (0, _url.isValidUrl)(config.image) ? config.image : _elastic_outline.elasticOutline,
      emptyImage: config.emptyImage || ''
    };
    const container = (0, _jquery.default)('<div class="repeatImage" style="pointer-events: none;">');

    function setSize(img) {
      if (img.naturalHeight > img.naturalWidth) {
        img.height = settings.size;
      } else {
        img.width = settings.size;
      }
    }

    function finish() {
      (0, _jquery.default)(domNode).append(container);
      handlers.done();
    }

    const img = new Image();

    img.onload = function () {
      setSize(img);

      if (settings.max && settings.count > settings.max) {
        settings.count = settings.max;
      }

      (0, _lodash.times)(settings.count, () => container.append((0, _jquery.default)(img).clone()));

      if ((0, _url.isValidUrl)(settings.emptyImage)) {
        if (settings.max == null) {
          throw new Error(errors.getMissingMaxArgumentErrorMessage());
        }

        const emptyImage = new Image();

        emptyImage.onload = function () {
          setSize(emptyImage);
          (0, _lodash.times)(settings.max - settings.count, () => container.append((0, _jquery.default)(emptyImage).clone()));
          finish();
        };

        emptyImage.src = settings.emptyImage;
      } else {
        finish();
      }
    };

    img.src = settings.image;
  }

});

exports.repeatImage = repeatImage;