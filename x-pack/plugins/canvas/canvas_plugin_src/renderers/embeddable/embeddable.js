"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.embeddableRendererFactory = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _public = require("../../../../../../src/plugins/embeddable/public");

var _i18n = require("../../../i18n");

var _embeddable_input_to_expression = require("./embeddable_input_to_expression");

var _lib = require("../../../common/lib");

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
  embeddable: strings
} = _i18n.RendererStrings;
const embeddablesRegistry = {};

const renderEmbeddableFactory = (core, plugins) => {
  const I18nContext = core.i18n.Context;
  return (embeddableObject, domNode) => {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: _lib.CANVAS_EMBEDDABLE_CLASSNAME,
      style: {
        width: domNode.offsetWidth,
        height: domNode.offsetHeight,
        cursor: 'auto'
      }
    }, /*#__PURE__*/_react.default.createElement(I18nContext, null, /*#__PURE__*/_react.default.createElement(plugins.embeddable.EmbeddablePanel, {
      embeddable: embeddableObject
    })));
  };
};

const embeddableRendererFactory = (core, plugins) => {
  const renderEmbeddable = renderEmbeddableFactory(core, plugins);
  return () => ({
    name: 'embeddable',
    displayName: strings.getDisplayName(),
    help: strings.getHelpDescription(),
    reuseDomNode: true,
    render: async (domNode, {
      input,
      embeddableType
    }, handlers) => {
      const uniqueId = handlers.getElementId();

      if (!embeddablesRegistry[uniqueId]) {
        const factory = Array.from(plugins.embeddable.getEmbeddableFactories()).find(embeddableFactory => embeddableFactory.type === embeddableType);

        if (!factory) {
          handlers.done();
          throw new _public.EmbeddableFactoryNotFoundError(embeddableType);
        }

        const embeddablePromise = factory.createFromSavedObject(input.id, input).then(embeddable => {
          embeddablesRegistry[uniqueId] = embeddable;
          return embeddable;
        });
        embeddablesRegistry[uniqueId] = embeddablePromise;
        const embeddableObject = await (async () => embeddablePromise)();
        const palettes = await plugins.charts.palettes.getPalettes();
        embeddablesRegistry[uniqueId] = embeddableObject;

        _reactDom.default.unmountComponentAtNode(domNode);

        const subscription = embeddableObject.getInput$().subscribe(function (updatedInput) {
          const updatedExpression = (0, _embeddable_input_to_expression.embeddableInputToExpression)(updatedInput, embeddableType, palettes);

          if (updatedExpression) {
            handlers.onEmbeddableInputChange(updatedExpression);
          }
        });

        _reactDom.default.render(renderEmbeddable(embeddableObject, domNode), domNode, () => handlers.done());

        handlers.onResize(() => {
          _reactDom.default.render(renderEmbeddable(embeddableObject, domNode), domNode, () => handlers.done());
        });
        handlers.onDestroy(() => {
          subscription.unsubscribe();
          handlers.onEmbeddableDestroyed();
          delete embeddablesRegistry[uniqueId];
          return _reactDom.default.unmountComponentAtNode(domNode);
        });
      } else {
        const embeddable = embeddablesRegistry[uniqueId];

        if ('updateInput' in embeddable) {
          embeddable.updateInput(input);
          embeddable.reload();
        }
      }
    }
  });
};

exports.embeddableRendererFactory = embeddableRendererFactory;