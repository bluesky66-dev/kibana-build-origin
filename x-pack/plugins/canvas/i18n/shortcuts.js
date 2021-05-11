"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShortcutStrings = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../common/lib/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ShortcutStrings = {
  getNamespaceDisplayNames: () => ({
    ELEMENT: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.namespace.elementDisplayName', {
      defaultMessage: 'Element controls'
    }),
    EXPRESSION: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.namespace.expressionDisplayName', {
      defaultMessage: 'Expression controls'
    }),
    EDITOR: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.namespace.editorDisplayName', {
      defaultMessage: 'Editor controls'
    }),
    PRESENTATION: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.namespace.presentationDisplayName', {
      defaultMessage: 'Presentation controls'
    })
  }),
  getShortcutHelp: () => ({
    CUT: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.cutShortcutHelpText', {
      defaultMessage: 'Cut'
    }),
    COPY: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.copyShortcutHelpText', {
      defaultMessage: 'Copy'
    }),
    PASTE: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.pasteShortcutHelpText', {
      defaultMessage: 'Paste'
    }),
    CLONE: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.cloneShortcutHelpText', {
      defaultMessage: 'Clone'
    }),
    DELETE: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.deleteShortcutHelpText', {
      defaultMessage: 'Delete'
    }),
    BRING_FORWARD: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.bringFowardShortcutHelpText', {
      defaultMessage: 'Bring forward'
    }),
    BRING_TO_FRONT: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.bringToFrontShortcutHelpText', {
      defaultMessage: 'Bring to front'
    }),
    SEND_BACKWARD: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.sendBackwardShortcutHelpText', {
      defaultMessage: 'Send backward'
    }),
    SEND_TO_BACK: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.sendToBackShortcutHelpText', {
      defaultMessage: 'Send to back'
    }),
    GROUP: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.groupShortcutHelpText', {
      defaultMessage: 'Group'
    }),
    UNGROUP: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.ungroupShortcutHelpText', {
      defaultMessage: 'Ungroup'
    }),
    SHIFT_UP: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.shiftUpShortcutHelpText', {
      defaultMessage: 'Shift up by {ELEMENT_SHIFT_OFFSET}px',
      values: {
        ELEMENT_SHIFT_OFFSET: _constants.ELEMENT_SHIFT_OFFSET
      }
    }),
    SHIFT_DOWN: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.shiftDownShortcutHelpText', {
      defaultMessage: 'Shift down by {ELEMENT_SHIFT_OFFSET}px',
      values: {
        ELEMENT_SHIFT_OFFSET: _constants.ELEMENT_SHIFT_OFFSET
      }
    }),
    SHIFT_LEFT: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.shiftLeftShortcutHelpText', {
      defaultMessage: 'Shift left by {ELEMENT_SHIFT_OFFSET}px',
      values: {
        ELEMENT_SHIFT_OFFSET: _constants.ELEMENT_SHIFT_OFFSET
      }
    }),
    SHIFT_RIGHT: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.shiftRightShortcutHelpText', {
      defaultMessage: 'Shift right by {ELEMENT_SHIFT_OFFSET}px',
      values: {
        ELEMENT_SHIFT_OFFSET: _constants.ELEMENT_SHIFT_OFFSET
      }
    }),
    NUDGE_UP: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.nudgeUpShortcutHelpText', {
      defaultMessage: 'Shift up by {ELEMENT_NUDGE_OFFSET}px',
      values: {
        ELEMENT_NUDGE_OFFSET: _constants.ELEMENT_NUDGE_OFFSET
      }
    }),
    NUDGE_DOWN: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.nudgeDownShortcutHelpText', {
      defaultMessage: 'Shift down by {ELEMENT_NUDGE_OFFSET}px',
      values: {
        ELEMENT_NUDGE_OFFSET: _constants.ELEMENT_NUDGE_OFFSET
      }
    }),
    NUDGE_LEFT: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.nudgeLeftShortcutHelpText', {
      defaultMessage: 'Shift left by {ELEMENT_NUDGE_OFFSET}px',
      values: {
        ELEMENT_NUDGE_OFFSET: _constants.ELEMENT_NUDGE_OFFSET
      }
    }),
    NUDGE_RIGHT: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.nudgeRightShortcutHelpText', {
      defaultMessage: 'Shift right by {ELEMENT_NUDGE_OFFSET}px',
      values: {
        ELEMENT_NUDGE_OFFSET: _constants.ELEMENT_NUDGE_OFFSET
      }
    }),
    RUN: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.runShortcutHelpText', {
      defaultMessage: 'Run whole expression'
    }),
    MULTISELECT: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.multiselectShortcutHelpText', {
      defaultMessage: 'Select multiple elements'
    }),
    RESIZE_FROM_CENTER: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.resizeFromCenterShortcutHelpText', {
      defaultMessage: 'Resize from center'
    }),
    IGNORE_SNAP: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.ignoreSnapShortcutHelpText', {
      defaultMessage: 'Move, resize, and rotate without snapping'
    }),
    SELECT_BEHIND: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.selectBehindShortcutHelpText', {
      defaultMessage: 'Select element below'
    }),
    UNDO: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.undoShortcutHelpText', {
      defaultMessage: 'Undo last action'
    }),
    REDO: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.redoShortcutHelpText', {
      defaultMessage: 'Redo last action'
    }),
    PREV: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.prevShortcutHelpText', {
      defaultMessage: 'Go to previous page'
    }),
    NEXT: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.nextShortcutHelpText', {
      defaultMessage: 'Go to next page'
    }),
    EDITING: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.editingShortcutHelpText', {
      defaultMessage: 'Toggle edit mode'
    }),
    GRID: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.gridShortcutHelpText', {
      defaultMessage: 'Show grid'
    }),
    REFRESH: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.ShortcutHelpText', {
      defaultMessage: 'Refresh workpad'
    }),
    ZOOM_IN: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.zoomInShortcutHelpText', {
      defaultMessage: 'Zoom in'
    }),
    ZOOM_OUT: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.zoomOutShortcutHelpText', {
      defaultMessage: 'Zoom out'
    }),
    ZOOM_RESET: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.zoomResetShortcutHelpText', {
      defaultMessage: 'Reset zoom to 100%'
    }),
    FULLSCREEN: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.fullscreenShortcutHelpText', {
      defaultMessage: 'Enter presentation mode'
    }),
    FULLSCREEN_EXIT: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.fullscreenExitShortcutHelpText', {
      defaultMessage: 'Exit presentation mode'
    }),
    PAGE_CYCLE_TOGGLE: _i18n.i18n.translate('xpack.canvas.keyboardShortcuts.pageCycleToggleShortcutHelpText', {
      defaultMessage: 'Toggle page cycling'
    })
  })
};
exports.ShortcutStrings = ShortcutStrings;