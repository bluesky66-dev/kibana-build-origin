"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Settings = exports.SettingsComponent = void 0;

var _react = _interopRequireWildcard(require("react"));

var _eui = require("@elastic/eui");

var _context = require("../../../context");

var _toolbar_settings = require("./toolbar_settings");

var _autoplay_settings = require("./autoplay_settings");

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
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The Settings Popover for Canvas Shareable Workpads.
 */


const SettingsComponent = ({
  refs
}) => {
  const [isPopoverOpen, setPopoverOpen] = (0, _react.useState)(false);

  const button = /*#__PURE__*/_react.default.createElement(_eui.EuiButtonIcon, {
    color: "ghost",
    iconType: "gear",
    "aria-label": "Settings",
    onClick: () => setPopoverOpen(!isPopoverOpen)
  });

  const flattenPanelTree = (tree, array = []) => {
    array.push(tree);

    if (tree.items) {
      tree.items.forEach(item => {
        if (item.panel) {
          flattenPanelTree(item.panel, array);
          item.panel = item.panel.id;
        }
      });
    }

    return array;
  };

  const panels = flattenPanelTree({
    id: 0,
    title: 'Settings',
    items: [{
      name: 'Auto Play',
      icon: 'play',
      panel: {
        id: 1,
        title: 'Auto Play',
        content: /*#__PURE__*/_react.default.createElement(_autoplay_settings.AutoplaySettings, null)
      }
    }, {
      name: 'Toolbar',
      icon: 'boxesHorizontal',
      panel: {
        id: 2,
        title: 'Toolbar',
        content: /*#__PURE__*/_react.default.createElement(_toolbar_settings.ToolbarSettings, {
          onSetAutohide: () => setPopoverOpen(false)
        })
      }
    }]
  });
  return /*#__PURE__*/_react.default.createElement(_eui.EuiFlexGroup, {
    alignItems: "flexEnd",
    justifyContent: "center",
    direction: "column",
    gutterSize: "none"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
    grow: false
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiPopover, {
    closePopover: () => setPopoverOpen(false),
    id: "settings",
    isOpen: isPopoverOpen,
    button: button,
    panelPaddingSize: "none",
    anchorPosition: "upRight",
    insert: refs.stage.current ? {
      sibling: refs.stage.current,
      position: 'after'
    } : undefined
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiContextMenu, {
    initialPanelId: 0,
    panels: panels
  }))));
};
/**
 * A store-connected container for the `Settings` component.
 */


exports.SettingsComponent = SettingsComponent;

const Settings = () => {
  const [{
    refs
  }] = (0, _context.useCanvasShareableState)();
  return /*#__PURE__*/_react.default.createElement(SettingsComponent, {
    refs: refs
  });
};

exports.Settings = Settings;