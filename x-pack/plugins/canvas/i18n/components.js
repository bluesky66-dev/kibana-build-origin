"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ComponentStrings = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ComponentStrings = {
  AddEmbeddableFlyout: {
    getNoItemsText: () => _i18n.i18n.translate('xpack.canvas.embedObject.noMatchingObjectsMessage', {
      defaultMessage: 'No matching objects found.'
    }),
    getTitleText: () => _i18n.i18n.translate('xpack.canvas.embedObject.titleText', {
      defaultMessage: 'Add from Kibana'
    })
  },
  AdvancedFilter: {
    getApplyButtonLabel: () => _i18n.i18n.translate('xpack.canvas.renderer.advancedFilter.applyButtonLabel', {
      defaultMessage: 'Apply',
      description: 'This refers to applying the filter to the Canvas workpad'
    }),
    getInputPlaceholder: () => _i18n.i18n.translate('xpack.canvas.renderer.advancedFilter.inputPlaceholder', {
      defaultMessage: 'Enter filter expression'
    })
  },
  App: {
    getLoadErrorMessage: error => _i18n.i18n.translate('xpack.canvas.app.loadErrorMessage', {
      defaultMessage: 'Message: {error}',
      values: {
        error
      }
    }),
    getLoadErrorTitle: () => _i18n.i18n.translate('xpack.canvas.app.loadErrorTitle', {
      defaultMessage: 'Canvas failed to load'
    }),
    getLoadingMessage: () => _i18n.i18n.translate('xpack.canvas.app.loadingMessage', {
      defaultMessage: 'Canvas is loading'
    })
  },
  ArgAddPopover: {
    getAddAriaLabel: () => _i18n.i18n.translate('xpack.canvas.argAddPopover.addAriaLabel', {
      defaultMessage: 'Add argument'
    })
  },
  ArgFormAdvancedFailure: {
    getApplyButtonLabel: () => _i18n.i18n.translate('xpack.canvas.argFormAdvancedFailure.applyButtonLabel', {
      defaultMessage: 'Apply'
    }),
    getResetButtonLabel: () => _i18n.i18n.translate('xpack.canvas.argFormAdvancedFailure.resetButtonLabel', {
      defaultMessage: 'Reset'
    }),
    getRowErrorMessage: () => _i18n.i18n.translate('xpack.canvas.argFormAdvancedFailure.rowErrorMessage', {
      defaultMessage: 'Invalid Expression'
    })
  },
  ArgFormArgSimpleForm: {
    getRemoveAriaLabel: () => _i18n.i18n.translate('xpack.canvas.argFormArgSimpleForm.removeAriaLabel', {
      defaultMessage: 'Remove'
    }),
    getRequiredTooltip: () => _i18n.i18n.translate('xpack.canvas.argFormArgSimpleForm.requiredTooltip', {
      defaultMessage: 'This argument is required, you should specify a value.'
    })
  },
  ArgFormPendingArgValue: {
    getLoadingMessage: () => _i18n.i18n.translate('xpack.canvas.argFormPendingArgValue.loadingMessage', {
      defaultMessage: 'Loading'
    })
  },
  ArgFormSimpleFailure: {
    getFailureTooltip: () => _i18n.i18n.translate('xpack.canvas.argFormSimpleFailure.failureTooltip', {
      defaultMessage: 'The interface for this argument could not parse the value, so a fallback input is being used'
    })
  },
  Asset: {
    getCopyAssetTooltip: () => _i18n.i18n.translate('xpack.canvas.asset.copyAssetTooltip', {
      defaultMessage: 'Copy id to clipboard'
    }),
    getCreateImageTooltip: () => _i18n.i18n.translate('xpack.canvas.asset.createImageTooltip', {
      defaultMessage: 'Create image element'
    }),
    getDeleteAssetTooltip: () => _i18n.i18n.translate('xpack.canvas.asset.deleteAssetTooltip', {
      defaultMessage: 'Delete'
    }),
    getDownloadAssetTooltip: () => _i18n.i18n.translate('xpack.canvas.asset.downloadAssetTooltip', {
      defaultMessage: 'Download'
    }),
    getThumbnailAltText: () => _i18n.i18n.translate('xpack.canvas.asset.thumbnailAltText', {
      defaultMessage: 'Asset thumbnail'
    }),
    getConfirmModalButtonLabel: () => _i18n.i18n.translate('xpack.canvas.asset.confirmModalButtonLabel', {
      defaultMessage: 'Remove'
    }),
    getConfirmModalMessageText: () => _i18n.i18n.translate('xpack.canvas.asset.confirmModalDetail', {
      defaultMessage: 'Are you sure you want to remove this asset?'
    }),
    getConfirmModalTitle: () => _i18n.i18n.translate('xpack.canvas.asset.confirmModalTitle', {
      defaultMessage: 'Remove Asset'
    })
  },
  AssetManager: {
    getButtonLabel: () => _i18n.i18n.translate('xpack.canvas.assetManager.manageButtonLabel', {
      defaultMessage: 'Manage assets'
    }),
    getDescription: () => _i18n.i18n.translate('xpack.canvas.assetModal.modalDescription', {
      defaultMessage: 'Below are the image assets in this workpad. Any assets that are currently in use cannot be determined at this time. To reclaim space, delete assets.'
    }),
    getEmptyAssetsDescription: () => _i18n.i18n.translate('xpack.canvas.assetModal.emptyAssetsDescription', {
      defaultMessage: 'Import your assets to get started'
    }),
    getFilePickerPromptText: () => _i18n.i18n.translate('xpack.canvas.assetModal.filePickerPromptText', {
      defaultMessage: 'Select or drag and drop images'
    }),
    getLoadingText: () => _i18n.i18n.translate('xpack.canvas.assetModal.loadingText', {
      defaultMessage: 'Uploading images'
    }),
    getModalCloseButtonLabel: () => _i18n.i18n.translate('xpack.canvas.assetModal.modalCloseButtonLabel', {
      defaultMessage: 'Close'
    }),
    getModalTitle: () => _i18n.i18n.translate('xpack.canvas.assetModal.modalTitle', {
      defaultMessage: 'Manage workpad assets'
    }),
    getSpaceUsedText: percentageUsed => _i18n.i18n.translate('xpack.canvas.assetModal.spacedUsedText', {
      defaultMessage: '{percentageUsed}% space used',
      values: {
        percentageUsed
      }
    }),
    getCopyAssetMessage: id => _i18n.i18n.translate('xpack.canvas.assetModal.copyAssetMessage', {
      defaultMessage: `Copied '{id}' to clipboard`,
      values: {
        id
      }
    })
  },
  AssetPicker: {
    getAssetAltText: () => _i18n.i18n.translate('xpack.canvas.assetpicker.assetAltText', {
      defaultMessage: 'Asset thumbnail'
    })
  },
  ColorManager: {
    getAddAriaLabel: () => _i18n.i18n.translate('xpack.canvas.colorManager.addAriaLabel', {
      defaultMessage: 'Add Color'
    }),
    getCodePlaceholder: () => _i18n.i18n.translate('xpack.canvas.colorManager.codePlaceholder', {
      defaultMessage: 'Color code'
    }),
    getRemoveAriaLabel: () => _i18n.i18n.translate('xpack.canvas.colorManager.removeAriaLabel', {
      defaultMessage: 'Remove Color'
    })
  },
  CustomElementModal: {
    getCancelButtonLabel: () => _i18n.i18n.translate('xpack.canvas.customElementModal.cancelButtonLabel', {
      defaultMessage: 'Cancel'
    }),
    getCharactersRemainingDescription: numberOfRemainingCharacter => _i18n.i18n.translate('xpack.canvas.customElementModal.remainingCharactersDescription', {
      defaultMessage: '{numberOfRemainingCharacter} characters remaining',
      values: {
        numberOfRemainingCharacter
      }
    }),
    getDescriptionInputLabel: () => _i18n.i18n.translate('xpack.canvas.customElementModal.descriptionInputLabel', {
      defaultMessage: 'Description'
    }),
    getElementPreviewTitle: () => _i18n.i18n.translate('xpack.canvas.customElementModal.elementPreviewTitle', {
      defaultMessage: 'Element preview'
    }),
    getImageFilePickerPlaceholder: () => _i18n.i18n.translate('xpack.canvas.customElementModal.imageFilePickerPlaceholder', {
      defaultMessage: 'Select or drag and drop an image'
    }),
    getImageInputDescription: () => _i18n.i18n.translate('xpack.canvas.customElementModal.imageInputDescription', {
      defaultMessage: 'Take a screenshot of your element and upload it here. This can also be done after saving.'
    }),
    getImageInputLabel: () => _i18n.i18n.translate('xpack.canvas.customElementModal.imageInputLabel', {
      defaultMessage: 'Thumbnail image'
    }),
    getNameInputLabel: () => _i18n.i18n.translate('xpack.canvas.customElementModal.nameInputLabel', {
      defaultMessage: 'Name'
    }),
    getSaveButtonLabel: () => _i18n.i18n.translate('xpack.canvas.customElementModal.saveButtonLabel', {
      defaultMessage: 'Save'
    })
  },
  DatasourceDatasourceComponent: {
    getChangeButtonLabel: () => _i18n.i18n.translate('xpack.canvas.datasourceDatasourceComponent.changeButtonLabel', {
      defaultMessage: 'Change element data source'
    }),
    getExpressionArgDescription: () => _i18n.i18n.translate('xpack.canvas.datasourceDatasourceComponent.expressionArgDescription', {
      defaultMessage: 'The datasource has an argument controlled by an expression. Use the expression editor to modify the datasource.'
    }),
    getPreviewButtonLabel: () => _i18n.i18n.translate('xpack.canvas.datasourceDatasourceComponent.previewButtonLabel', {
      defaultMessage: 'Preview data'
    }),
    getSaveButtonLabel: () => _i18n.i18n.translate('xpack.canvas.datasourceDatasourceComponent.saveButtonLabel', {
      defaultMessage: 'Save'
    })
  },
  DatasourceDatasourcePreview: {
    getEmptyFirstLineDescription: () => _i18n.i18n.translate('xpack.canvas.datasourceDatasourcePreview.emptyFirstLineDescription', {
      defaultMessage: "We couldn't find any documents matching your search criteria."
    }),
    getEmptySecondLineDescription: () => _i18n.i18n.translate('xpack.canvas.datasourceDatasourcePreview.emptySecondLineDescription', {
      defaultMessage: 'Check your datasource settings and try again.'
    }),
    getEmptyTitle: () => _i18n.i18n.translate('xpack.canvas.datasourceDatasourcePreview.emptyTitle', {
      defaultMessage: 'No documents found'
    }),
    getModalTitle: () => _i18n.i18n.translate('xpack.canvas.datasourceDatasourcePreview.modalTitle', {
      defaultMessage: 'Datasource preview'
    })
  },
  DatasourceNoDatasource: {
    getPanelDescription: () => _i18n.i18n.translate('xpack.canvas.datasourceNoDatasource.panelDescription', {
      defaultMessage: "This element does not have an attached data source. This is usually because the element is an image or other static asset. If that's not the case you might want to check your expression to make sure it is not malformed."
    }),
    getPanelTitle: () => _i18n.i18n.translate('xpack.canvas.datasourceNoDatasource.panelTitle', {
      defaultMessage: 'No data source present'
    })
  },
  DropdownFilter: {
    getMatchAllOptionLabel: () => _i18n.i18n.translate('xpack.canvas.renderer.dropdownFilter.matchAllOptionLabel', {
      defaultMessage: 'ANY',
      description: 'The dropdown filter option to match any value in the field.'
    })
  },
  ElementConfig: {
    getFailedLabel: () => _i18n.i18n.translate('xpack.canvas.elementConfig.failedLabel', {
      defaultMessage: 'Failed',
      description: 'The label for the total number of elements in a workpad that have thrown an error or failed to load'
    }),
    getLoadedLabel: () => _i18n.i18n.translate('xpack.canvas.elementConfig.loadedLabel', {
      defaultMessage: 'Loaded',
      description: 'The label for the number of elements in a workpad that have loaded'
    }),
    getProgressLabel: () => _i18n.i18n.translate('xpack.canvas.elementConfig.progressLabel', {
      defaultMessage: 'Progress',
      description: 'The label for the percentage of elements that have finished loading'
    }),
    getTitle: () => _i18n.i18n.translate('xpack.canvas.elementConfig.title', {
      defaultMessage: 'Element status',
      description: '"Elements" refers to the individual text, images, or visualizations that you can add to a Canvas workpad'
    }),
    getTotalLabel: () => _i18n.i18n.translate('xpack.canvas.elementConfig.totalLabel', {
      defaultMessage: 'Total',
      description: 'The label for the total number of elements in a workpad'
    })
  },
  ElementControls: {
    getDeleteAriaLabel: () => _i18n.i18n.translate('xpack.canvas.elementControls.deleteAriaLabel', {
      defaultMessage: 'Delete element'
    }),
    getDeleteTooltip: () => _i18n.i18n.translate('xpack.canvas.elementControls.deleteToolTip', {
      defaultMessage: 'Delete'
    }),
    getEditAriaLabel: () => _i18n.i18n.translate('xpack.canvas.elementControls.editAriaLabel', {
      defaultMessage: 'Edit element'
    }),
    getEditTooltip: () => _i18n.i18n.translate('xpack.canvas.elementControls.editToolTip', {
      defaultMessage: 'Edit'
    })
  },
  ElementSettings: {
    getDataTabLabel: () => _i18n.i18n.translate('xpack.canvas.elementSettings.dataTabLabel', {
      defaultMessage: 'Data',
      description: 'This tab contains the settings for the data (i.e. Elasticsearch query) used as ' + 'the source for a Canvas element'
    }),
    getDisplayTabLabel: () => _i18n.i18n.translate('xpack.canvas.elementSettings.displayTabLabel', {
      defaultMessage: 'Display',
      description: 'This tab contains the settings for how data is displayed in a Canvas element'
    })
  },
  Error: {
    getDescription: () => _i18n.i18n.translate('xpack.canvas.errorComponent.description', {
      defaultMessage: 'Expression failed with the message:'
    }),
    getTitle: () => _i18n.i18n.translate('xpack.canvas.errorComponent.title', {
      defaultMessage: 'Whoops! Expression failed'
    })
  },
  Expression: {
    getCancelButtonLabel: () => _i18n.i18n.translate('xpack.canvas.expression.cancelButtonLabel', {
      defaultMessage: 'Cancel'
    }),
    getCloseButtonLabel: () => _i18n.i18n.translate('xpack.canvas.expression.closeButtonLabel', {
      defaultMessage: 'Close'
    }),
    getLearnLinkText: () => _i18n.i18n.translate('xpack.canvas.expression.learnLinkText', {
      defaultMessage: 'Learn expression syntax'
    }),
    getMaximizeButtonLabel: () => _i18n.i18n.translate('xpack.canvas.expression.maximizeButtonLabel', {
      defaultMessage: 'Maximize editor'
    }),
    getMinimizeButtonLabel: () => _i18n.i18n.translate('xpack.canvas.expression.minimizeButtonLabel', {
      defaultMessage: 'Minimize Editor'
    }),
    getRunButtonLabel: () => _i18n.i18n.translate('xpack.canvas.expression.runButtonLabel', {
      defaultMessage: 'Run'
    }),
    getRunTooltip: () => _i18n.i18n.translate('xpack.canvas.expression.runTooltip', {
      defaultMessage: 'Run the expression'
    })
  },
  ExpressionElementNotSelected: {
    getCloseButtonLabel: () => _i18n.i18n.translate('xpack.canvas.expressionElementNotSelected.closeButtonLabel', {
      defaultMessage: 'Close'
    }),
    getSelectDescription: () => _i18n.i18n.translate('xpack.canvas.expressionElementNotSelected.selectDescription', {
      defaultMessage: 'Select an element to show expression input'
    })
  },
  ExpressionInput: {
    getArgReferenceAliasesDetail: aliases => _i18n.i18n.translate('xpack.canvas.expressionInput.argReferenceAliasesDetail', {
      defaultMessage: '{BOLD_MD_TOKEN}Aliases{BOLD_MD_TOKEN}: {aliases}',
      values: {
        BOLD_MD_TOKEN: _constants.BOLD_MD_TOKEN,
        aliases
      }
    }),
    getArgReferenceDefaultDetail: defaultVal => _i18n.i18n.translate('xpack.canvas.expressionInput.argReferenceDefaultDetail', {
      defaultMessage: '{BOLD_MD_TOKEN}Default{BOLD_MD_TOKEN}: {defaultVal}',
      values: {
        BOLD_MD_TOKEN: _constants.BOLD_MD_TOKEN,
        defaultVal
      }
    }),
    getArgReferenceRequiredDetail: required => _i18n.i18n.translate('xpack.canvas.expressionInput.argReferenceRequiredDetail', {
      defaultMessage: '{BOLD_MD_TOKEN}Required{BOLD_MD_TOKEN}: {required}',
      values: {
        BOLD_MD_TOKEN: _constants.BOLD_MD_TOKEN,
        required
      }
    }),
    getArgReferenceTypesDetail: types => _i18n.i18n.translate('xpack.canvas.expressionInput.argReferenceTypesDetail', {
      defaultMessage: '{BOLD_MD_TOKEN}Types{BOLD_MD_TOKEN}: {types}',
      values: {
        BOLD_MD_TOKEN: _constants.BOLD_MD_TOKEN,
        types
      }
    }),
    getFunctionReferenceAcceptsDetail: acceptTypes => _i18n.i18n.translate('xpack.canvas.expressionInput.functionReferenceAccepts', {
      defaultMessage: '{BOLD_MD_TOKEN}Accepts{BOLD_MD_TOKEN}: {acceptTypes}',
      values: {
        BOLD_MD_TOKEN: _constants.BOLD_MD_TOKEN,
        acceptTypes
      }
    }),
    getFunctionReferenceReturnsDetail: returnType => _i18n.i18n.translate('xpack.canvas.expressionInput.functionReferenceReturns', {
      defaultMessage: '{BOLD_MD_TOKEN}Returns{BOLD_MD_TOKEN}: {returnType}',
      values: {
        BOLD_MD_TOKEN: _constants.BOLD_MD_TOKEN,
        returnType
      }
    })
  },
  FunctionFormContextError: {
    getContextErrorMessage: errorMessage => _i18n.i18n.translate('xpack.canvas.functionForm.contextError', {
      defaultMessage: 'ERROR: {errorMessage}',
      values: {
        errorMessage
      }
    })
  },
  FunctionFormFunctionUnknown: {
    getUnknownArgumentTypeErrorMessage: expressionType => _i18n.i18n.translate('xpack.canvas.functionForm.functionUnknown.unknownArgumentTypeError', {
      defaultMessage: 'Unknown expression type "{expressionType}"',
      values: {
        expressionType
      }
    })
  },
  GroupSettings: {
    getSaveGroupDescription: () => _i18n.i18n.translate('xpack.canvas.groupSettings.saveGroupDescription', {
      defaultMessage: 'Save this group as a new element to re-use it throughout your workpad.'
    }),
    getUngroupDescription: () => _i18n.i18n.translate('xpack.canvas.groupSettings.ungroupDescription', {
      defaultMessage: 'Ungroup ({uKey}) to edit individual element settings.',
      values: {
        uKey: 'U'
      }
    })
  },
  HelpMenu: {
    getDocumentationLinkLabel: () => _i18n.i18n.translate('xpack.canvas.helpMenu.documentationLinkLabel', {
      defaultMessage: '{CANVAS} documentation',
      values: {
        CANVAS: _constants.CANVAS
      }
    }),
    getHelpMenuDescription: () => _i18n.i18n.translate('xpack.canvas.helpMenu.description', {
      defaultMessage: 'For {CANVAS} specific information',
      values: {
        CANVAS: _constants.CANVAS
      }
    }),
    getKeyboardShortcutsLinkLabel: () => _i18n.i18n.translate('xpack.canvas.helpMenu.keyboardShortcutsLinkLabel', {
      defaultMessage: 'Keyboard shortcuts'
    })
  },
  KeyboardShortcutsDoc: {
    getFlyoutCloseButtonAriaLabel: () => _i18n.i18n.translate('xpack.canvas.keyboardShortcutsDoc.flyout.closeButtonAriaLabel', {
      defaultMessage: 'Closes keyboard shortcuts reference'
    }),
    getShortcutSeparator: () => _i18n.i18n.translate('xpack.canvas.keyboardShortcutsDoc.shortcutListSeparator', {
      defaultMessage: 'or',
      description: 'Separates which keyboard shortcuts can be used for a single action. Example: "{shortcut1} or {shortcut2} or {shortcut3}"'
    }),
    getTitle: () => _i18n.i18n.translate('xpack.canvas.keyboardShortcutsDoc.flyoutHeaderTitle', {
      defaultMessage: 'Keyboard shortcuts'
    })
  },
  Link: {
    getErrorMessage: message => _i18n.i18n.translate('xpack.canvas.link.errorMessage', {
      defaultMessage: 'LINK ERROR: {message}',
      values: {
        message
      }
    })
  },
  MultiElementSettings: {
    getMultipleElementsActionsDescription: () => _i18n.i18n.translate('xpack.canvas.groupSettings.multipleElementsActionsDescription', {
      defaultMessage: 'Deselect these elements to edit their individual settings, press ({gKey}) to group them, or save this selection as a new ' + 'element to re-use it throughout your workpad.',
      values: {
        gKey: 'G'
      }
    }),
    getMultipleElementsDescription: () => _i18n.i18n.translate('xpack.canvas.groupSettings.multipleElementsDescription', {
      defaultMessage: 'Multiple elements are currently selected.'
    })
  },
  PageConfig: {
    getBackgroundColorDescription: () => _i18n.i18n.translate('xpack.canvas.pageConfig.backgroundColorDescription', {
      defaultMessage: 'Accepts HEX, RGB or HTML color names'
    }),
    getBackgroundColorLabel: () => _i18n.i18n.translate('xpack.canvas.pageConfig.backgroundColorLabel', {
      defaultMessage: 'Background'
    }),
    getNoTransitionDropDownOptionLabel: () => _i18n.i18n.translate('xpack.canvas.pageConfig.transitions.noneDropDownOptionLabel', {
      defaultMessage: 'None',
      description: 'This is the option the user should choose if they do not want any page transition (i.e. fade in, fade out, etc) to ' + 'be applied to the current page.'
    }),
    getTitle: () => _i18n.i18n.translate('xpack.canvas.pageConfig.title', {
      defaultMessage: 'Page settings'
    }),
    getTransitionLabel: () => _i18n.i18n.translate('xpack.canvas.pageConfig.transitionLabel', {
      defaultMessage: 'Transition',
      description: 'This refers to the transition effect, such as fade in or rotate,  applied to a page in presentation mode.'
    }),
    getTransitionPreviewLabel: () => _i18n.i18n.translate('xpack.canvas.pageConfig.transitionPreviewLabel', {
      defaultMessage: 'Preview',
      description: 'This is the label for a preview of the transition effect selected.'
    })
  },
  PageManager: {
    getPageNumberAriaLabel: pageNumber => _i18n.i18n.translate('xpack.canvas.pageManager.pageNumberAriaLabel', {
      defaultMessage: 'Load page number {pageNumber}',
      values: {
        pageNumber
      }
    }),
    getAddPageTooltip: () => _i18n.i18n.translate('xpack.canvas.pageManager.addPageTooltip', {
      defaultMessage: 'Add a new page to this workpad'
    }),
    getConfirmRemoveTitle: () => _i18n.i18n.translate('xpack.canvas.pageManager.confirmRemoveTitle', {
      defaultMessage: 'Remove Page'
    }),
    getConfirmRemoveDescription: () => _i18n.i18n.translate('xpack.canvas.pageManager.confirmRemoveDescription', {
      defaultMessage: 'Are you sure you want to remove this page?'
    }),
    getConfirmRemoveButtonLabel: () => _i18n.i18n.translate('xpack.canvas.pageManager.removeButtonLabel', {
      defaultMessage: 'Remove'
    })
  },
  PagePreviewPageControls: {
    getClonePageAriaLabel: () => _i18n.i18n.translate('xpack.canvas.pagePreviewPageControls.clonePageAriaLabel', {
      defaultMessage: 'Clone page'
    }),
    getClonePageTooltip: () => _i18n.i18n.translate('xpack.canvas.pagePreviewPageControls.clonePageTooltip', {
      defaultMessage: 'Clone'
    }),
    getDeletePageAriaLabel: () => _i18n.i18n.translate('xpack.canvas.pagePreviewPageControls.deletePageAriaLabel', {
      defaultMessage: 'Delete page'
    }),
    getDeletePageTooltip: () => _i18n.i18n.translate('xpack.canvas.pagePreviewPageControls.deletePageTooltip', {
      defaultMessage: 'Delete'
    })
  },
  PalettePicker: {
    getEmptyPaletteLabel: () => _i18n.i18n.translate('xpack.canvas.palettePicker.emptyPaletteLabel', {
      defaultMessage: 'None'
    }),
    getNoPaletteFoundErrorTitle: () => _i18n.i18n.translate('xpack.canvas.palettePicker.noPaletteFoundErrorTitle', {
      defaultMessage: 'Color palette not found'
    })
  },
  SavedElementsModal: {
    getAddNewElementDescription: () => _i18n.i18n.translate('xpack.canvas.savedElementsModal.addNewElementDescription', {
      defaultMessage: 'Group and save workpad elements to create new elements'
    }),
    getAddNewElementTitle: () => _i18n.i18n.translate('xpack.canvas.savedElementsModal.addNewElementTitle', {
      defaultMessage: 'Add new elements'
    }),
    getCancelButtonLabel: () => _i18n.i18n.translate('xpack.canvas.savedElementsModal.cancelButtonLabel', {
      defaultMessage: 'Cancel'
    }),
    getDeleteButtonLabel: () => _i18n.i18n.translate('xpack.canvas.savedElementsModal.deleteButtonLabel', {
      defaultMessage: 'Delete'
    }),
    getDeleteElementDescription: () => _i18n.i18n.translate('xpack.canvas.savedElementsModal.deleteElementDescription', {
      defaultMessage: 'Are you sure you want to delete this element?'
    }),
    getDeleteElementTitle: elementName => _i18n.i18n.translate('xpack.canvas.savedElementsModal.deleteElementTitle', {
      defaultMessage: `Delete element '{elementName}'?`,
      values: {
        elementName
      }
    }),
    getEditElementTitle: () => _i18n.i18n.translate('xpack.canvas.savedElementsModal.editElementTitle', {
      defaultMessage: 'Edit element'
    }),
    getElementsTitle: () => _i18n.i18n.translate('xpack.canvas.savedElementsModal.elementsTitle', {
      defaultMessage: 'Elements',
      description: 'Title for the "Elements" tab when adding a new element'
    }),
    getFindElementPlaceholder: () => _i18n.i18n.translate('xpack.canvas.savedElementsModal.findElementPlaceholder', {
      defaultMessage: 'Find element'
    }),
    getModalTitle: () => _i18n.i18n.translate('xpack.canvas.savedElementsModal.modalTitle', {
      defaultMessage: 'My elements'
    }),
    getMyElementsTitle: () => _i18n.i18n.translate('xpack.canvas.savedElementsModal.myElementsTitle', {
      defaultMessage: 'My elements',
      description: 'Title for the "My elements" tab when adding a new element'
    }),
    getSavedElementsModalCloseButtonLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeader.addElementModalCloseButtonLabel', {
      defaultMessage: 'Close'
    })
  },
  ShareWebsiteFlyout: {
    getRuntimeStepTitle: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.downloadRuntimeTitle', {
      defaultMessage: 'Download runtime'
    }),
    getSnippentsStepTitle: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.addSnippetsTitle', {
      defaultMessage: 'Add snippets to website'
    }),
    getStepsDescription: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.description', {
      defaultMessage: 'Follow these steps to share a static version of this workpad on an external website. It will be a visual snapshot of the current workpad, and will not have access to live data.'
    }),
    getTitle: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.flyoutTitle', {
      defaultMessage: 'Share on a website'
    }),
    getUnsupportedRendererWarning: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.unsupportedRendererWarning', {
      defaultMessage: 'This workpad contains render functions that are not supported by the {CANVAS} Shareable Workpad Runtime. These elements will not be rendered:',
      values: {
        CANVAS: _constants.CANVAS
      }
    }),
    getWorkpadStepTitle: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.downloadWorkpadTitle', {
      defaultMessage: 'Download workpad'
    })
  },
  ShareWebsiteRuntimeStep: {
    getDownloadLabel: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.runtimeStep.downloadLabel', {
      defaultMessage: 'Download runtime'
    }),
    getStepDescription: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.runtimeStep.description', {
      defaultMessage: 'In order to render a Shareable Workpad, you also need to include the {CANVAS} Shareable Workpad Runtime. You can skip this step if the runtime is already included on your website.',
      values: {
        CANVAS: _constants.CANVAS
      }
    })
  },
  ShareWebsiteSnippetsStep: {
    getAutoplayParameterDescription: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.autoplayParameterDescription', {
      defaultMessage: 'Should the runtime automatically move through the pages of the workpad?'
    }),
    getCallRuntimeLabel: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.callRuntimeLabel', {
      defaultMessage: 'Call Runtime'
    }),
    getHeightParameterDescription: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.heightParameterDescription', {
      defaultMessage: 'The height of the Workpad. Defaults to the Workpad height.'
    }),
    getIncludeRuntimeLabel: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.includeRuntimeLabel', {
      defaultMessage: 'Include Runtime'
    }),
    getIntervalParameterDescription: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.intervalParameterDescription', {
      defaultMessage: 'The interval upon which the pages will advance in time format, (e.g. {twoSeconds}, {oneMinute})',
      values: {
        twoSeconds: '2s',
        oneMinute: '1m'
      }
    }),
    getPageParameterDescription: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.pageParameterDescription', {
      defaultMessage: 'The page to display. Defaults to the page specified by the Workpad.'
    }),
    getParametersDescription: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.parametersDescription', {
      defaultMessage: 'There are a number of inline parameters to configure the Shareable Workpad.'
    }),
    getParametersTitle: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.parametersLabel', {
      defaultMessage: 'Parameters'
    }),
    getPlaceholderLabel: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.placeholderLabel', {
      defaultMessage: 'Placeholder'
    }),
    getRequiredLabel: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.requiredLabel', {
      defaultMessage: 'required'
    }),
    getShareableParameterDescription: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.shareableParameterDescription', {
      defaultMessage: 'The type of shareable. In this case, a {CANVAS} Workpad.',
      values: {
        CANVAS: _constants.CANVAS
      }
    }),
    getSnippetsStepDescription: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.description', {
      defaultMessage: 'The Workpad is placed within the {HTML} of the site by using an {HTML} placeholder. Parameters for the runtime are included inline. See the full list of parameters below. You can include more than one workpad on the page.',
      values: {
        HTML: _constants.HTML
      }
    }),
    getToolbarParameterDescription: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.toolbarParameterDescription', {
      defaultMessage: 'Should the toolbar be hidden?'
    }),
    getUrlParameterDescription: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.urlParameterDescription', {
      defaultMessage: 'The {URL} of the Shareable Workpad {JSON} file.',
      values: {
        URL: _constants.URL,
        JSON: _constants.JSON
      }
    }),
    getWidthParameterDescription: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.snippetsStep.widthParameterDescription', {
      defaultMessage: 'The width of the Workpad. Defaults to the Workpad width.'
    })
  },
  ShareWebsiteWorkpadStep: {
    getDownloadLabel: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.workpadStep.downloadLabel', {
      defaultMessage: 'Download workpad'
    }),
    getStepDescription: () => _i18n.i18n.translate('xpack.canvas.shareWebsiteFlyout.workpadStep.description', {
      defaultMessage: 'The workpad will be exported as a single {JSON} file for sharing in another site.',
      values: {
        JSON: _constants.JSON
      }
    })
  },
  SidebarContent: {
    getGroupedElementSidebarTitle: () => _i18n.i18n.translate('xpack.canvas.sidebarContent.groupedElementSidebarTitle', {
      defaultMessage: 'Grouped element',
      description: 'The title displayed when a grouped element is selected. "elements" refer to the different visualizations, images, ' + 'text, etc that can be added in a Canvas workpad. These elements can be grouped into a larger "grouped element" ' + 'that contains multiple individual elements.'
    }),
    getMultiElementSidebarTitle: () => _i18n.i18n.translate('xpack.canvas.sidebarContent.multiElementSidebarTitle', {
      defaultMessage: 'Multiple elements',
      description: 'The title displayed when multiple elements are selected. "elements" refer to the different visualizations, images, ' + 'text, etc that can be added in a Canvas workpad.'
    }),
    getSingleElementSidebarTitle: () => _i18n.i18n.translate('xpack.canvas.sidebarContent.singleElementSidebarTitle', {
      defaultMessage: 'Selected element',
      description: 'The title displayed when a single element are selected. "element" refer to the different visualizations, images, ' + 'text, etc that can be added in a Canvas workpad.'
    })
  },
  SidebarHeader: {
    getBringForwardAriaLabel: () => _i18n.i18n.translate('xpack.canvas.sidebarHeader.bringForwardArialLabel', {
      defaultMessage: 'Move element up one layer'
    }),
    getBringToFrontAriaLabel: () => _i18n.i18n.translate('xpack.canvas.sidebarHeader.bringToFrontArialLabel', {
      defaultMessage: 'Move element to top layer'
    }),
    getSendBackwardAriaLabel: () => _i18n.i18n.translate('xpack.canvas.sidebarHeader.sendBackwardArialLabel', {
      defaultMessage: 'Move element down one layer'
    }),
    getSendToBackAriaLabel: () => _i18n.i18n.translate('xpack.canvas.sidebarHeader.sendToBackArialLabel', {
      defaultMessage: 'Move element to bottom layer'
    })
  },
  TextStylePicker: {
    getAlignCenterOption: () => _i18n.i18n.translate('xpack.canvas.textStylePicker.alignCenterOption', {
      defaultMessage: 'Align center'
    }),
    getAlignLeftOption: () => _i18n.i18n.translate('xpack.canvas.textStylePicker.alignLeftOption', {
      defaultMessage: 'Align left'
    }),
    getAlignRightOption: () => _i18n.i18n.translate('xpack.canvas.textStylePicker.alignRightOption', {
      defaultMessage: 'Align right'
    }),
    getAlignmentOptionsControlLegend: () => _i18n.i18n.translate('xpack.canvas.textStylePicker.alignmentOptionsControl', {
      defaultMessage: 'Alignment options'
    }),
    getFontColorLabel: () => _i18n.i18n.translate('xpack.canvas.textStylePicker.fontColorLabel', {
      defaultMessage: 'Font Color'
    }),
    getStyleBoldOption: () => _i18n.i18n.translate('xpack.canvas.textStylePicker.styleBoldOption', {
      defaultMessage: 'Bold'
    }),
    getStyleItalicOption: () => _i18n.i18n.translate('xpack.canvas.textStylePicker.styleItalicOption', {
      defaultMessage: 'Italic'
    }),
    getStyleUnderlineOption: () => _i18n.i18n.translate('xpack.canvas.textStylePicker.styleUnderlineOption', {
      defaultMessage: 'Underline'
    }),
    getStyleOptionsControlLegend: () => _i18n.i18n.translate('xpack.canvas.textStylePicker.styleOptionsControl', {
      defaultMessage: 'Style options'
    })
  },
  TimePicker: {
    getApplyButtonLabel: () => _i18n.i18n.translate('xpack.canvas.timePicker.applyButtonLabel', {
      defaultMessage: 'Apply'
    })
  },
  Toolbar: {
    getEditorButtonLabel: () => _i18n.i18n.translate('xpack.canvas.toolbar.editorButtonLabel', {
      defaultMessage: 'Expression editor'
    }),
    getNextPageAriaLabel: () => _i18n.i18n.translate('xpack.canvas.toolbar.nextPageAriaLabel', {
      defaultMessage: 'Next Page'
    }),
    getPageButtonLabel: (pageNum, totalPages) => _i18n.i18n.translate('xpack.canvas.toolbar.pageButtonLabel', {
      defaultMessage: 'Page {pageNum}{rest}',
      values: {
        pageNum,
        rest: totalPages > 1 ? ` of ${totalPages}` : ''
      }
    }),
    getPreviousPageAriaLabel: () => _i18n.i18n.translate('xpack.canvas.toolbar.previousPageAriaLabel', {
      defaultMessage: 'Previous Page'
    }),
    getWorkpadManagerCloseButtonLabel: () => _i18n.i18n.translate('xpack.canvas.toolbar.workpadManagerCloseButtonLabel', {
      defaultMessage: 'Close'
    }),
    getErrorMessage: message => _i18n.i18n.translate('xpack.canvas.toolbar.errorMessage', {
      defaultMessage: 'TOOLBAR ERROR: {message}',
      values: {
        message
      }
    })
  },
  ToolbarTray: {
    getCloseTrayAriaLabel: () => _i18n.i18n.translate('xpack.canvas.toolbarTray.closeTrayAriaLabel', {
      defaultMessage: 'Close tray'
    })
  },
  VarConfig: {
    getAddButtonLabel: () => _i18n.i18n.translate('xpack.canvas.varConfig.addButtonLabel', {
      defaultMessage: 'Add a variable'
    }),
    getAddTooltipLabel: () => _i18n.i18n.translate('xpack.canvas.varConfig.addTooltipLabel', {
      defaultMessage: 'Add a variable'
    }),
    getCopyActionButtonLabel: () => _i18n.i18n.translate('xpack.canvas.varConfig.copyActionButtonLabel', {
      defaultMessage: 'Copy snippet'
    }),
    getCopyActionTooltipLabel: () => _i18n.i18n.translate('xpack.canvas.varConfig.copyActionTooltipLabel', {
      defaultMessage: 'Copy variable syntax to clipboard'
    }),
    getCopyNotificationDescription: () => _i18n.i18n.translate('xpack.canvas.varConfig.copyNotificationDescription', {
      defaultMessage: 'Variable syntax copied to clipboard'
    }),
    getDeleteActionButtonLabel: () => _i18n.i18n.translate('xpack.canvas.varConfig.deleteActionButtonLabel', {
      defaultMessage: 'Delete variable'
    }),
    getDeleteNotificationDescription: () => _i18n.i18n.translate('xpack.canvas.varConfig.deleteNotificationDescription', {
      defaultMessage: 'Variable successfully deleted'
    }),
    getEditActionButtonLabel: () => _i18n.i18n.translate('xpack.canvas.varConfig.editActionButtonLabel', {
      defaultMessage: 'Edit variable'
    }),
    getEmptyDescription: () => _i18n.i18n.translate('xpack.canvas.varConfig.emptyDescription', {
      defaultMessage: 'This workpad has no variables currently. You may add variables to store and edit common values. These variables can then be used in elements or within the expression editor.'
    }),
    getTableNameLabel: () => _i18n.i18n.translate('xpack.canvas.varConfig.tableNameLabel', {
      defaultMessage: 'Name'
    }),
    getTableTypeLabel: () => _i18n.i18n.translate('xpack.canvas.varConfig.tableTypeLabel', {
      defaultMessage: 'Type'
    }),
    getTableValueLabel: () => _i18n.i18n.translate('xpack.canvas.varConfig.tableValueLabel', {
      defaultMessage: 'Value'
    }),
    getTitle: () => _i18n.i18n.translate('xpack.canvas.varConfig.titleLabel', {
      defaultMessage: 'Variables'
    }),
    getTitleTooltip: () => _i18n.i18n.translate('xpack.canvas.varConfig.titleTooltip', {
      defaultMessage: 'Add variables to store and edit common values'
    })
  },
  VarConfigDeleteVar: {
    getCancelButtonLabel: () => _i18n.i18n.translate('xpack.canvas.varConfigDeleteVar.cancelButtonLabel', {
      defaultMessage: 'Cancel'
    }),
    getDeleteButtonLabel: () => _i18n.i18n.translate('xpack.canvas.varConfigDeleteVar.deleteButtonLabel', {
      defaultMessage: 'Delete variable'
    }),
    getTitle: () => _i18n.i18n.translate('xpack.canvas.varConfigDeleteVar.titleLabel', {
      defaultMessage: 'Delete variable?'
    }),
    getWarningDescription: () => _i18n.i18n.translate('xpack.canvas.varConfigDeleteVar.warningDescription', {
      defaultMessage: 'Deleting this variable may adversely affect the workpad. Are you sure you wish to continue?'
    })
  },
  VarConfigEditVar: {
    getAddTitle: () => _i18n.i18n.translate('xpack.canvas.varConfigEditVar.addTitleLabel', {
      defaultMessage: 'Add variable'
    }),
    getCancelButtonLabel: () => _i18n.i18n.translate('xpack.canvas.varConfigEditVar.cancelButtonLabel', {
      defaultMessage: 'Cancel'
    }),
    getDuplicateNameError: () => _i18n.i18n.translate('xpack.canvas.varConfigEditVar.duplicateNameError', {
      defaultMessage: 'Variable name already in use'
    }),
    getEditTitle: () => _i18n.i18n.translate('xpack.canvas.varConfigEditVar.editTitleLabel', {
      defaultMessage: 'Edit variable'
    }),
    getEditWarning: () => _i18n.i18n.translate('xpack.canvas.varConfigEditVar.editWarning', {
      defaultMessage: 'Editing a variable in use may adversely affect your workpad'
    }),
    getNameFieldLabel: () => _i18n.i18n.translate('xpack.canvas.varConfigEditVar.nameFieldLabel', {
      defaultMessage: 'Name'
    }),
    getSaveButtonLabel: () => _i18n.i18n.translate('xpack.canvas.varConfigEditVar.saveButtonLabel', {
      defaultMessage: 'Save changes'
    }),
    getTypeBooleanLabel: () => _i18n.i18n.translate('xpack.canvas.varConfigEditVar.typeBooleanLabel', {
      defaultMessage: 'Boolean'
    }),
    getTypeFieldLabel: () => _i18n.i18n.translate('xpack.canvas.varConfigEditVar.typeFieldLabel', {
      defaultMessage: 'Type'
    }),
    getTypeNumberLabel: () => _i18n.i18n.translate('xpack.canvas.varConfigEditVar.typeNumberLabel', {
      defaultMessage: 'Number'
    }),
    getTypeStringLabel: () => _i18n.i18n.translate('xpack.canvas.varConfigEditVar.typeStringLabel', {
      defaultMessage: 'String'
    }),
    getValueFieldLabel: () => _i18n.i18n.translate('xpack.canvas.varConfigEditVar.valueFieldLabel', {
      defaultMessage: 'Value'
    })
  },
  VarConfigVarValueField: {
    getBooleanOptionsLegend: () => _i18n.i18n.translate('xpack.canvas.varConfigVarValueField.booleanOptionsLegend', {
      defaultMessage: 'Boolean value'
    }),
    getFalseOption: () => _i18n.i18n.translate('xpack.canvas.varConfigVarValueField.falseOption', {
      defaultMessage: 'False'
    }),
    getTrueOption: () => _i18n.i18n.translate('xpack.canvas.varConfigVarValueField.trueOption', {
      defaultMessage: 'True'
    })
  },
  WorkpadConfig: {
    getApplyStylesheetButtonLabel: () => _i18n.i18n.translate('xpack.canvas.workpadConfig.applyStylesheetButtonLabel', {
      defaultMessage: `Apply stylesheet`,
      description: '"stylesheet" refers to the collection of CSS style rules entered by the user.'
    }),
    getBackgroundColorLabel: () => _i18n.i18n.translate('xpack.canvas.workpadConfig.backgroundColorLabel', {
      defaultMessage: 'Background color'
    }),
    getFlipDimensionAriaLabel: () => _i18n.i18n.translate('xpack.canvas.workpadConfig.swapDimensionsAriaLabel', {
      defaultMessage: `Swap the page's width and height`
    }),
    getFlipDimensionTooltip: () => _i18n.i18n.translate('xpack.canvas.workpadConfig.swapDimensionsTooltip', {
      defaultMessage: 'Swap the width and height'
    }),
    getGlobalCSSLabel: () => _i18n.i18n.translate('xpack.canvas.workpadConfig.globalCSSLabel', {
      defaultMessage: `Global CSS overrides`
    }),
    getGlobalCSSTooltip: () => _i18n.i18n.translate('xpack.canvas.workpadConfig.globalCSSTooltip', {
      defaultMessage: `Apply styles to all pages in this workpad`
    }),
    getNameLabel: () => _i18n.i18n.translate('xpack.canvas.workpadConfig.nameLabel', {
      defaultMessage: 'Name'
    }),
    getPageHeightLabel: () => _i18n.i18n.translate('xpack.canvas.workpadConfig.heightLabel', {
      defaultMessage: 'Height'
    }),
    getPageSizeBadgeAriaLabel: sizeName => _i18n.i18n.translate('xpack.canvas.workpadConfig.pageSizeBadgeAriaLabel', {
      defaultMessage: `Preset page size: {sizeName}`,
      values: {
        sizeName
      }
    }),
    getPageSizeBadgeOnClickAriaLabel: sizeName => _i18n.i18n.translate('xpack.canvas.workpadConfig.pageSizeBadgeOnClickAriaLabel', {
      defaultMessage: `Set page size to {sizeName}`,
      values: {
        sizeName
      }
    }),
    getPageWidthLabel: () => _i18n.i18n.translate('xpack.canvas.workpadConfig.widthLabel', {
      defaultMessage: 'Width'
    }),
    getTitle: () => _i18n.i18n.translate('xpack.canvas.workpadConfig.title', {
      defaultMessage: 'Workpad settings'
    }),
    getUSLetterButtonLabel: () => _i18n.i18n.translate('xpack.canvas.workpadConfig.USLetterButtonLabel', {
      defaultMessage: 'US Letter',
      description: 'This is referring to the dimensions of U.S. standard letter paper.'
    })
  },
  WorkpadCreate: {
    getWorkpadCreateButtonLabel: () => _i18n.i18n.translate('xpack.canvas.workpadCreate.createButtonLabel', {
      defaultMessage: 'Create workpad'
    })
  },
  WorkpadHeader: {
    getAddElementButtonLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeader.addElementButtonLabel', {
      defaultMessage: 'Add element'
    }),
    getFullScreenButtonAriaLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeader.fullscreenButtonAriaLabel', {
      defaultMessage: 'View fullscreen'
    }),
    getFullScreenTooltip: () => _i18n.i18n.translate('xpack.canvas.workpadHeader.fullscreenTooltip', {
      defaultMessage: 'Enter fullscreen mode'
    }),
    getHideEditControlTooltip: () => _i18n.i18n.translate('xpack.canvas.workpadHeader.hideEditControlTooltip', {
      defaultMessage: 'Hide editing controls'
    }),
    getNoWritePermissionTooltipText: () => _i18n.i18n.translate('xpack.canvas.workpadHeader.noWritePermissionTooltip', {
      defaultMessage: "You don't have permission to edit this workpad"
    }),
    getShowEditControlTooltip: () => _i18n.i18n.translate('xpack.canvas.workpadHeader.showEditControlTooltip', {
      defaultMessage: 'Show editing controls'
    })
  },
  WorkpadHeaderAutoRefreshControls: {
    getDisableTooltip: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderAutoRefreshControls.disableTooltip', {
      defaultMessage: 'Disable auto-refresh'
    }),
    getIntervalFormLabelText: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderAutoRefreshControls.intervalFormLabel', {
      defaultMessage: 'Change auto-refresh interval'
    }),
    getRefreshListDurationManualText: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderAutoRefreshControls.refreshListDurationManualText', {
      defaultMessage: 'Manually'
    }),
    getRefreshListTitle: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderAutoRefreshControls.refreshListTitle', {
      defaultMessage: 'Refresh elements'
    })
  },
  WorkpadHeaderCustomInterval: {
    getButtonLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderCustomInterval.confirmButtonLabel', {
      defaultMessage: 'Set'
    }),
    getFormDescription: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderCustomInterval.formDescription', {
      defaultMessage: 'Use shorthand notation, like {secondsExample}, {minutesExample}, or {hoursExample}',
      values: {
        secondsExample: '30s',
        minutesExample: '10m',
        hoursExample: '1h'
      }
    }),
    getFormLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderCustomInterval.formLabel', {
      defaultMessage: 'Set a custom interval'
    })
  },
  WorkpadHeaderEditMenu: {
    getAlignmentMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.alignmentMenuItemLabel', {
      defaultMessage: 'Alignment',
      description: 'This refers to the vertical (i.e. left, center, right) and horizontal (i.e. top, middle, bottom) ' + 'alignment options of the selected elements'
    }),
    getBottomAlignMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.bottomAlignMenuItemLabel', {
      defaultMessage: 'Bottom'
    }),
    getCenterAlignMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.centerAlignMenuItemLabel', {
      defaultMessage: 'Center',
      description: 'This refers to alignment centered horizontally.'
    }),
    getCreateElementModalTitle: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.createElementModalTitle', {
      defaultMessage: 'Create new element'
    }),
    getDistributionMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.distributionMenutItemLabel', {
      defaultMessage: 'Distribution',
      description: 'This refers to the options to evenly spacing the selected elements horizontall or vertically.'
    }),
    getEditMenuButtonLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.editMenuButtonLabel', {
      defaultMessage: 'Edit'
    }),
    getEditMenuLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.editMenuLabel', {
      defaultMessage: 'Edit options'
    }),
    getGroupMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.groupMenuItemLabel', {
      defaultMessage: 'Group',
      description: 'This refers to grouping multiple selected elements.'
    }),
    getHorizontalDistributionMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.horizontalDistributionMenutItemLabel', {
      defaultMessage: 'Horizontal'
    }),
    getLeftAlignMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.leftAlignMenuItemLabel', {
      defaultMessage: 'Left'
    }),
    getMiddleAlignMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.middleAlignMenuItemLabel', {
      defaultMessage: 'Middle',
      description: 'This refers to alignment centered vertically.'
    }),
    getOrderMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.orderMenuItemLabel', {
      defaultMessage: 'Order',
      description: 'Refers to the order of the elements displayed on the page from front to back'
    }),
    getRedoMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.redoMenuItemLabel', {
      defaultMessage: 'Redo'
    }),
    getRightAlignMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.rightAlignMenuItemLabel', {
      defaultMessage: 'Right'
    }),
    getSaveElementMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.savedElementMenuItemLabel', {
      defaultMessage: 'Save as new element'
    }),
    getTopAlignMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.topAlignMenuItemLabel', {
      defaultMessage: 'Top'
    }),
    getUndoMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.undoMenuItemLabel', {
      defaultMessage: 'Undo'
    }),
    getUngroupMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.ungroupMenuItemLabel', {
      defaultMessage: 'Ungroup',
      description: 'This refers to ungrouping a grouped element'
    }),
    getVerticalDistributionMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderEditMenu.verticalDistributionMenutItemLabel', {
      defaultMessage: 'Vertical'
    })
  },
  WorkpadHeaderElementMenu: {
    getAssetsMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderElementMenu.manageAssetsMenuItemLabel', {
      defaultMessage: 'Manage assets'
    }),
    getChartMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderElementMenu.chartMenuItemLabel', {
      defaultMessage: 'Chart'
    }),
    getElementMenuButtonLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderElementMenu.elementMenuButtonLabel', {
      defaultMessage: 'Add element'
    }),
    getElementMenuLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderElementMenu.elementMenuLabel', {
      defaultMessage: 'Add an element'
    }),
    getEmbedObjectMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderElementMenu.embedObjectMenuItemLabel', {
      defaultMessage: 'Add from Kibana'
    }),
    getFilterMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderElementMenu.filterMenuItemLabel', {
      defaultMessage: 'Filter'
    }),
    getImageMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderElementMenu.imageMenuItemLabel', {
      defaultMessage: 'Image'
    }),
    getMyElementsMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderElementMenu.myElementsMenuItemLabel', {
      defaultMessage: 'My elements'
    }),
    getOtherMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderElementMenu.otherMenuItemLabel', {
      defaultMessage: 'Other'
    }),
    getProgressMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderElementMenu.progressMenuItemLabel', {
      defaultMessage: 'Progress'
    }),
    getShapeMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderElementMenu.shapeMenuItemLabel', {
      defaultMessage: 'Shape'
    }),
    getTextMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderElementMenu.textMenuItemLabel', {
      defaultMessage: 'Text'
    })
  },
  WorkpadHeaderKioskControls: {
    getCycleFormLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderKioskControl.cycleFormLabel', {
      defaultMessage: 'Change cycling interval'
    }),
    getCycleToggleSwitch: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderKioskControl.cycleToggleSwitch', {
      defaultMessage: 'Cycle slides automatically'
    }),
    getTitle: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderKioskControl.controlTitle', {
      defaultMessage: 'Cycle fullscreen pages'
    })
  },
  WorkpadHeaderRefreshControlSettings: {
    getRefreshAriaLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderRefreshControlSettings.refreshAriaLabel', {
      defaultMessage: 'Refresh Elements'
    }),
    getRefreshTooltip: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderRefreshControlSettings.refreshTooltip', {
      defaultMessage: 'Refresh data'
    })
  },
  WorkpadHeaderShareMenu: {
    getCopyPDFMessage: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.copyPDFMessage', {
      defaultMessage: 'The {PDF} generation {URL} was copied to your clipboard.',
      values: {
        PDF: _constants.PDF,
        URL: _constants.URL
      }
    }),
    getCopyReportingConfigMessage: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.copyReportingConfigMessage', {
      defaultMessage: 'Copied reporting configuration to clipboard'
    }),
    getCopyShareConfigMessage: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.copyShareConfigMessage', {
      defaultMessage: 'Copied share markup to clipboard'
    }),
    getExportPDFErrorTitle: workpadName => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.exportPDFErrorMessage', {
      defaultMessage: "Failed to create {PDF} for '{workpadName}'",
      values: {
        PDF: _constants.PDF,
        workpadName
      }
    }),
    getExportPDFMessage: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.exportPDFMessage', {
      defaultMessage: 'Exporting {PDF}. You can track the progress in Management.',
      values: {
        PDF: _constants.PDF
      }
    }),
    getExportPDFTitle: workpadName => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.exportPDFTitle', {
      defaultMessage: "{PDF} export of workpad '{workpadName}'",
      values: {
        PDF: _constants.PDF,
        workpadName
      }
    }),
    getPDFFullPageLayoutHelpText: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.FullPageLayoutHelpText', {
      defaultMessage: 'Remove borders and footer logo'
    }),
    getPDFFullPageLayoutLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.FullPageLayoutLabel', {
      defaultMessage: 'Full page layout'
    }),
    getPDFPanelAdvancedOptionsLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.pdfPanelAdvancedOptionsLabel', {
      defaultMessage: 'Advanced options'
    }),
    getPDFPanelCopyAriaLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.pdfPanelCopyAriaLabel', {
      defaultMessage: 'Alternatively, you can generate a {PDF} from a script or with Watcher by using this {URL}. Press Enter to copy the {URL} to clipboard.',
      values: {
        PDF: _constants.PDF,
        URL: _constants.URL
      }
    }),
    getPDFPanelCopyButtonLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.pdfPanelCopyButtonLabel', {
      defaultMessage: 'Copy {POST} {URL}',
      values: {
        POST: _constants.POST,
        URL: _constants.URL
      }
    }),
    getPDFPanelCopyDescription: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.pdfPanelCopyDescription', {
      defaultMessage: 'Alternatively, copy this {POST} {URL} to call generation from outside {KIBANA} or from Watcher.',
      values: {
        POST: _constants.POST,
        KIBANA: _constants.KIBANA,
        URL: _constants.URL
      }
    }),
    getPDFPanelGenerateButtonLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.pdfPanelGenerateButtonLabel', {
      defaultMessage: 'Generate {PDF}',
      values: {
        PDF: _constants.PDF
      }
    }),
    getPDFPanelGenerateDescription: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.pdfPanelGenerateDescription', {
      defaultMessage: '{PDF}s can take a minute or two to generate based on the size of your workpad.',
      values: {
        PDF: _constants.PDF
      }
    }),
    getPDFPanelOptionsLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.pdfPanelOptionsLabel', {
      defaultMessage: 'Options'
    }),
    getShareableZipErrorTitle: workpadName => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.shareWebsiteErrorTitle', {
      defaultMessage: "Failed to create {ZIP} file for '{workpadName}'. The workpad may be too large. You'll need to download the files separately.",
      values: {
        ZIP: _constants.ZIP,
        workpadName
      }
    }),
    getShareDownloadJSONTitle: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.shareDownloadJSONTitle', {
      defaultMessage: 'Download as {JSON}',
      values: {
        JSON: _constants.JSON
      }
    }),
    getShareDownloadPDFTitle: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.shareDownloadPDFTitle', {
      defaultMessage: '{PDF} reports',
      values: {
        PDF: _constants.PDF
      }
    }),
    getShareMenuButtonLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.shareMenuButtonLabel', {
      defaultMessage: 'Share'
    }),
    getShareWebsiteTitle: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.shareWebsiteTitle', {
      defaultMessage: 'Share on a website'
    }),
    getShareWorkpadMessage: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.shareWorkpadMessage', {
      defaultMessage: 'Share this workpad'
    }),
    getUnknownExportErrorMessage: type => _i18n.i18n.translate('xpack.canvas.workpadHeaderShareMenu.unknownExportErrorMessage', {
      defaultMessage: 'Unknown export type: {type}',
      values: {
        type
      }
    })
  },
  WorkpadHeaderViewMenu: {
    getAutoplayOffMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.autoplayOffMenuItemLabel', {
      defaultMessage: 'Turn autoplay off'
    }),
    getAutoplayOnMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.autoplayOnMenuItemLabel', {
      defaultMessage: 'Turn autoplay on'
    }),
    getAutoplaySettingsMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.autoplaySettingsMenuItemLabel', {
      defaultMessage: 'Autoplay settings'
    }),
    getFullscreenMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.fullscreenMenuLabel', {
      defaultMessage: 'Enter fullscreen mode'
    }),
    getHideEditModeLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.hideEditModeLabel', {
      defaultMessage: 'Hide editing controls'
    }),
    getRefreshMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.refreshMenuItemLabel', {
      defaultMessage: 'Refresh data'
    }),
    getRefreshSettingsMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.refreshSettingsMenuItemLabel', {
      defaultMessage: 'Auto refresh settings'
    }),
    getShowEditModeLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.showEditModeLabel', {
      defaultMessage: 'Show editing controls'
    }),
    getViewMenuButtonLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.viewMenuButtonLabel', {
      defaultMessage: 'View'
    }),
    getViewMenuLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.viewMenuLabel', {
      defaultMessage: 'View options'
    }),
    getZoomControlsAriaLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.zoomControlsAriaLabel', {
      defaultMessage: 'Zoom controls'
    }),
    getZoomControlsTooltip: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.zoomControlsTooltip', {
      defaultMessage: 'Zoom controls'
    }),
    getZoomFitToWindowText: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.zoomFitToWindowText', {
      defaultMessage: 'Fit to window'
    }),
    getZoomInText: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.zoomInText', {
      defaultMessage: 'Zoom in'
    }),
    getZoomMenuItemLabel: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.zoomMenuItemLabel', {
      defaultMessage: 'Zoom'
    }),
    getZoomOutText: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.zoomOutText', {
      defaultMessage: 'Zoom out'
    }),
    getZoomPanelTitle: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.zoomPanelTitle', {
      defaultMessage: 'Zoom'
    }),
    getZoomPercentage: scale => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.zoomResetText', {
      defaultMessage: '{scalePercentage}%',
      values: {
        scalePercentage: scale * 100
      }
    }),
    getZoomResetText: () => _i18n.i18n.translate('xpack.canvas.workpadHeaderViewMenu.zoomPrecentageValue', {
      defaultMessage: 'Reset'
    })
  },
  WorkpadLoader: {
    getClonedWorkpadName: workpadName => _i18n.i18n.translate('xpack.canvas.workpadLoader.clonedWorkpadName', {
      defaultMessage: 'Copy of {workpadName}',
      values: {
        workpadName
      },
      description: 'This suffix is added to the end of the name of a cloned workpad to indicate that this ' + 'new workpad is a copy of the original workpad. Example: "Copy of Sales Pitch"'
    }),
    getCloneToolTip: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.cloneTooltip', {
      defaultMessage: 'Clone workpad'
    }),
    getCreateWorkpadLoadingDescription: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.createWorkpadLoadingDescription', {
      defaultMessage: 'Creating workpad...',
      description: 'This message appears while the user is waiting for a new workpad to be created'
    }),
    getDeleteButtonAriaLabel: numberOfWorkpads => _i18n.i18n.translate('xpack.canvas.workpadLoader.deleteButtonAriaLabel', {
      defaultMessage: 'Delete {numberOfWorkpads} workpads',
      values: {
        numberOfWorkpads
      }
    }),
    getDeleteButtonLabel: numberOfWorkpads => _i18n.i18n.translate('xpack.canvas.workpadLoader.deleteButtonLabel', {
      defaultMessage: 'Delete ({numberOfWorkpads})',
      values: {
        numberOfWorkpads
      }
    }),
    getDeleteModalConfirmButtonLabel: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.deleteModalConfirmButtonLabel', {
      defaultMessage: 'Delete'
    }),
    getDeleteModalDescription: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.deleteModalDescription', {
      defaultMessage: `You can't recover deleted workpads.`
    }),
    getDeleteMultipleWorkpadModalTitle: numberOfWorkpads => _i18n.i18n.translate('xpack.canvas.workpadLoader.deleteMultipleWorkpadsModalTitle', {
      defaultMessage: 'Delete {numberOfWorkpads} workpads?',
      values: {
        numberOfWorkpads
      }
    }),
    getDeleteSingleWorkpadModalTitle: workpadName => _i18n.i18n.translate('xpack.canvas.workpadLoader.deleteSingleWorkpadModalTitle', {
      defaultMessage: `Delete workpad '{workpadName}'?`,
      values: {
        workpadName
      }
    }),
    getEmptyPromptGettingStartedDescription: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.emptyPromptGettingStartedDescription', {
      defaultMessage: 'Create a new workpad, start from a template, or import a workpad {JSON} file by dropping it here.',
      values: {
        JSON: _constants.JSON
      }
    }),
    getEmptyPromptNewUserDescription: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.emptyPromptNewUserDescription', {
      defaultMessage: 'New to {CANVAS}?',
      values: {
        CANVAS: _constants.CANVAS
      }
    }),
    getEmptyPromptTitle: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.emptyPromptTitle', {
      defaultMessage: 'Add your first workpad'
    }),
    getExportButtonAriaLabel: numberOfWorkpads => _i18n.i18n.translate('xpack.canvas.workpadLoader.exportButtonAriaLabel', {
      defaultMessage: 'Export {numberOfWorkpads} workpads',
      values: {
        numberOfWorkpads
      }
    }),
    getExportButtonLabel: numberOfWorkpads => _i18n.i18n.translate('xpack.canvas.workpadLoader.exportButtonLabel', {
      defaultMessage: 'Export ({numberOfWorkpads})',
      values: {
        numberOfWorkpads
      }
    }),
    getExportToolTip: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.exportTooltip', {
      defaultMessage: 'Export workpad'
    }),
    getFetchLoadingDescription: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.fetchLoadingDescription', {
      defaultMessage: 'Fetching workpads...',
      description: 'This message appears while the user is waiting for their list of workpads to load'
    }),
    getFilePickerPlaceholder: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.filePickerPlaceholder', {
      defaultMessage: 'Import workpad {JSON} file',
      values: {
        JSON: _constants.JSON
      }
    }),
    getLoadWorkpadArialLabel: workpadName => _i18n.i18n.translate('xpack.canvas.workpadLoader.loadWorkpadArialLabel', {
      defaultMessage: `Load workpad '{workpadName}'`,
      values: {
        workpadName
      }
    }),
    getNoPermissionToCloneToolTip: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.noPermissionToCloneToolTip', {
      defaultMessage: `You don't have permission to clone workpads`
    }),
    getNoPermissionToCreateToolTip: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.noPermissionToCreateToolTip', {
      defaultMessage: `You don't have permission to create workpads`
    }),
    getNoPermissionToDeleteToolTip: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.noPermissionToDeleteToolTip', {
      defaultMessage: `You don't have permission to delete workpads`
    }),
    getNoPermissionToUploadToolTip: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.noPermissionToUploadToolTip', {
      defaultMessage: `You don't have permission to upload workpads`
    }),
    getSampleDataLinkLabel: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.sampleDataLinkLabel', {
      defaultMessage: 'Add your first workpad'
    }),
    getTableCreatedColumnTitle: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.table.createdColumnTitle', {
      defaultMessage: 'Created',
      description: 'This column in the table contains the date/time the workpad was created.'
    }),
    getTableNameColumnTitle: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.table.nameColumnTitle', {
      defaultMessage: 'Workpad name'
    }),
    getTableUpdatedColumnTitle: () => _i18n.i18n.translate('xpack.canvas.workpadLoader.table.updatedColumnTitle', {
      defaultMessage: 'Updated',
      description: 'This column in the table contains the date/time the workpad was last updated.'
    })
  },
  WorkpadManager: {
    getModalTitle: () => _i18n.i18n.translate('xpack.canvas.workpadManager.modalTitle', {
      defaultMessage: '{CANVAS} workpads',
      values: {
        CANVAS: _constants.CANVAS
      }
    }),
    getMyWorkpadsTabLabel: () => _i18n.i18n.translate('xpack.canvas.workpadManager.myWorkpadsTabLabel', {
      defaultMessage: 'My workpads'
    }),
    getWorkpadTemplatesTabLabel: () => _i18n.i18n.translate('xpack.canvas.workpadManager.workpadTemplatesTabLabel', {
      defaultMessage: 'Templates',
      description: 'The label for the tab that displays a list of designed workpad templates.'
    })
  },
  WorkpadSearch: {
    getWorkpadSearchPlaceholder: () => _i18n.i18n.translate('xpack.canvas.workpadSearch.searchPlaceholder', {
      defaultMessage: 'Find workpad'
    })
  },
  WorkpadTemplates: {
    getCloneTemplateLinkAriaLabel: templateName => _i18n.i18n.translate('xpack.canvas.workpadTemplate.cloneTemplateLinkAriaLabel', {
      defaultMessage: `Clone workpad template '{templateName}'`,
      values: {
        templateName
      }
    }),
    getTableDescriptionColumnTitle: () => _i18n.i18n.translate('xpack.canvas.workpadTemplates.table.descriptionColumnTitle', {
      defaultMessage: 'Description'
    }),
    getTableNameColumnTitle: () => _i18n.i18n.translate('xpack.canvas.workpadTemplates.table.nameColumnTitle', {
      defaultMessage: 'Template name'
    }),
    getTableTagsColumnTitle: () => _i18n.i18n.translate('xpack.canvas.workpadTemplates.table.tagsColumnTitle', {
      defaultMessage: 'Tags',
      description: 'This column contains relevant tags that indicate what type of template ' + 'is displayed. For example: "report", "presentation", etc.'
    }),
    getTemplateSearchPlaceholder: () => _i18n.i18n.translate('xpack.canvas.workpadTemplate.searchPlaceholder', {
      defaultMessage: 'Find template'
    }),
    getCreatingTemplateLabel: templateName => _i18n.i18n.translate('xpack.canvas.workpadTemplate.creatingTemplateLabel', {
      defaultMessage: `Creating from template '{templateName}'`,
      values: {
        templateName
      }
    })
  }
};
exports.ComponentStrings = ComponentStrings;