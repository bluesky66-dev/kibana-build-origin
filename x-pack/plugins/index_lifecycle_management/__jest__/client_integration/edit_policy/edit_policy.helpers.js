"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _react = _interopRequireDefault(require("react"));

var _testUtils = require("react-dom/test-utils");

var _jest = require("@kbn/test/jest");

var _mocks = require("../../../../licensing/public/mocks");

var _edit_policy = require("../../../public/application/sections/edit_policy");

var _shared_imports = require("../../../public/shared_imports");

var _breadcrumbs = require("../../../public/application/services/breadcrumbs.mock");

var _constants = require("./constants");

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


window.scrollTo = jest.fn();
jest.mock('@elastic/eui', () => {
  const original = jest.requireActual('@elastic/eui');
  return { ...original,
    // Mocking EuiComboBox, as it utilizes "react-virtualized" for rendering search suggestions,
    // which does not produce a valid component wrapper
    EuiComboBox: props => /*#__PURE__*/_react.default.createElement("input", {
      "data-test-subj": props['data-test-subj'] || 'mockComboBox',
      "data-currentvalue": props.selectedOptions,
      onChange: async syntheticEvent => {
        props.onChange([syntheticEvent['0']]);
      }
    }),
    EuiIcon: 'eui-icon' // using custom react-svg icon causes issues, mocking for now.

  };
});

const getTestBedConfig = testBedConfigArgs => {
  return {
    memoryRouter: {
      initialEntries: [`/policies/edit/${_constants.POLICY_NAME}`],
      componentRoutePath: `/policies/edit/:policyName`
    },
    defaultProps: {
      getUrlForApp: () => {}
    },
    ...testBedConfigArgs
  };
};

const breadcrumbService = (0, _breadcrumbs.createBreadcrumbsMock)();

const MyComponent = ({
  appServicesContext,
  ...rest
}) => {
  return /*#__PURE__*/_react.default.createElement(_shared_imports.KibanaContextProvider, {
    services: {
      breadcrumbService,
      license: _mocks.licensingMock.createLicense({
        license: {
          type: 'enterprise'
        }
      }),
      ...appServicesContext
    }
  }, /*#__PURE__*/_react.default.createElement(_edit_policy.EditPolicy, rest));
};

const initTestBed = arg => {
  const {
    testBedConfig: testBedConfigArgs,
    ...rest
  } = arg || {};
  return (0, _jest.registerTestBed)(MyComponent, getTestBedConfig(testBedConfigArgs))(rest);
};

const setup = async arg => {
  const testBed = await initTestBed(arg);
  const {
    find,
    component,
    form,
    exists
  } = testBed;

  const createFormToggleAction = dataTestSubject => async checked => {
    await (0, _testUtils.act)(async () => {
      form.toggleEuiSwitch(dataTestSubject, checked);
    });
    component.update();
  };

  const createFormCheckboxAction = dataTestSubject => async checked => {
    await (0, _testUtils.act)(async () => {
      form.selectCheckBox(dataTestSubject, checked);
    });
    component.update();
  };

  function createFormSetValueAction(dataTestSubject) {
    return async value => {
      await (0, _testUtils.act)(async () => {
        form.setInputValue(dataTestSubject, value);
      });
      component.update();
    };
  }

  const setWaitForSnapshotPolicy = async snapshotPolicyName => {
    (0, _testUtils.act)(() => {
      find('snapshotPolicyCombobox').simulate('change', [{
        label: snapshotPolicyName
      }]);
    });
    component.update();
  };

  const savePolicy = async () => {
    await (0, _testUtils.act)(async () => {
      find('savePolicyButton').simulate('click');
    });
    component.update();
  };

  const toggleDefaultRollover = createFormToggleAction('useDefaultRolloverSwitch');
  const toggleRollover = createFormToggleAction('rolloverSwitch');

  const setMaxSize = async (value, units) => {
    await (0, _testUtils.act)(async () => {
      find('hot-selectedMaxSizeStored').simulate('change', {
        target: {
          value
        }
      });

      if (units) {
        find('hot-selectedMaxSizeStoredUnits.select').simulate('change', {
          target: {
            value: units
          }
        });
      }
    });
    component.update();
  };

  const setMaxDocs = createFormSetValueAction('hot-selectedMaxDocuments');

  const setMaxAge = async (value, units) => {
    await (0, _testUtils.act)(async () => {
      find('hot-selectedMaxAge').simulate('change', {
        target: {
          value
        }
      });

      if (units) {
        find('hot-selectedMaxAgeUnits.select').simulate('change', {
          target: {
            value: units
          }
        });
      }
    });
    component.update();
  };

  const createForceMergeActions = phase => {
    const toggleSelector = `${phase}-forceMergeSwitch`;
    return {
      forceMergeFieldExists: () => exists(toggleSelector),
      toggleForceMerge: createFormToggleAction(toggleSelector),
      setForcemergeSegmentsCount: createFormSetValueAction(`${phase}-selectedForceMergeSegments`),
      setBestCompression: createFormCheckboxAction(`${phase}-bestCompression`)
    };
  };

  const createIndexPriorityActions = phase => {
    const toggleSelector = `${phase}-indexPrioritySwitch`;
    return {
      indexPriorityExists: () => exists(toggleSelector),
      toggleIndexPriority: createFormToggleAction(toggleSelector),
      setIndexPriority: createFormSetValueAction(`${phase}-indexPriority`)
    };
  };

  const enable = phase => createFormToggleAction(`enablePhaseSwitch-${phase}`);

  const createMinAgeActions = phase => {
    return {
      hasMinAgeInput: () => exists(`${phase}-selectedMinimumAge`),
      setMinAgeValue: createFormSetValueAction(`${phase}-selectedMinimumAge`),
      setMinAgeUnits: createFormSetValueAction(`${phase}-selectedMinimumAgeUnits`),
      hasRolloverTipOnMinAge: () => exists(`${phase}-rolloverMinAgeInputIconTip`)
    };
  };

  const setReplicas = phase => async value => {
    if (!exists(`${phase}-selectedReplicaCount`)) {
      await createFormToggleAction(`${phase}-setReplicasSwitch`)(true);
    }

    await createFormSetValueAction(`${phase}-selectedReplicaCount`)(value);
  };

  const createShrinkActions = phase => {
    const toggleSelector = `${phase}-shrinkSwitch`;
    return {
      shrinkExists: () => exists(toggleSelector),
      toggleShrink: createFormToggleAction(toggleSelector),
      setShrink: createFormSetValueAction(`${phase}-primaryShardCount`)
    };
  };

  const setFreeze = createFormToggleAction('freezeSwitch');

  const freezeExists = () => exists('freezeSwitch');

  const createReadonlyActions = phase => {
    const toggleSelector = `${phase}-readonlySwitch`;
    return {
      readonlyExists: () => exists(toggleSelector),
      toggleReadonly: createFormToggleAction(toggleSelector)
    };
  };

  const createSearchableSnapshotActions = phase => {
    const fieldSelector = `searchableSnapshotField-${phase}`;
    const licenseCalloutSelector = `${fieldSelector}.searchableSnapshotDisabledDueToLicense`;
    const toggleSelector = `${fieldSelector}.searchableSnapshotToggle`;
    const toggleSearchableSnapshot = createFormToggleAction(toggleSelector);
    return {
      searchableSnapshotDisabled: () => exists(licenseCalloutSelector) && find(licenseCalloutSelector).props().disabled === true,
      searchableSnapshotsExists: () => exists(fieldSelector),
      findSearchableSnapshotToggle: () => find(toggleSelector),
      searchableSnapshotDisabledDueToLicense: () => exists(`${fieldSelector}.searchableSnapshotDisabledDueToLicense`),
      toggleSearchableSnapshot,
      setSearchableSnapshot: async value => {
        if (!exists(`searchableSnapshotField-${phase}.searchableSnapshotCombobox`)) {
          await toggleSearchableSnapshot(true);
        }

        (0, _testUtils.act)(() => {
          find(`searchableSnapshotField-${phase}.searchableSnapshotCombobox`).simulate('change', [{
            label: value
          }]);
        });
        component.update();
      }
    };
  };

  const createToggleDeletePhaseActions = () => {
    const enablePhase = async () => {
      await (0, _testUtils.act)(async () => {
        find('enableDeletePhaseButton').simulate('click');
      });
      component.update();
    };

    const disablePhase = async () => {
      await (0, _testUtils.act)(async () => {
        find('disableDeletePhaseButton').simulate('click');
      });
      component.update();
    };

    return {
      enablePhase,
      disablePhase
    };
  };

  const hasRolloverSettingRequiredCallout = () => exists('rolloverSettingsRequired');

  const createNodeAllocationActions = phase => {
    const controlsSelector = `${phase}-dataTierAllocationControls`;
    const dataTierSelector = `${controlsSelector}.dataTierSelect`;
    const nodeAttrsSelector = `${phase}-selectedNodeAttrs`;
    return {
      hasDataTierAllocationControls: () => exists(controlsSelector),
      openNodeAttributesSection: async () => {
        await (0, _testUtils.act)(async () => {
          find(dataTierSelector).simulate('click');
        });
        component.update();
      },
      hasNodeAttributesSelect: () => exists(nodeAttrsSelector),
      getNodeAttributesSelectOptions: () => find(nodeAttrsSelector).find('option'),
      setDataAllocation: async value => {
        (0, _testUtils.act)(() => {
          find(dataTierSelector).simulate('click');
        });
        component.update();
        await (0, _testUtils.act)(async () => {
          switch (value) {
            case 'node_roles':
              find(`${controlsSelector}.defaultDataAllocationOption`).simulate('click');
              break;

            case 'node_attrs':
              find(`${controlsSelector}.customDataAllocationOption`).simulate('click');
              break;

            default:
              find(`${controlsSelector}.noneDataAllocationOption`).simulate('click');
          }
        });
        component.update();
      },
      setSelectedNodeAttribute: createFormSetValueAction(nodeAttrsSelector),
      hasNoNodeAttrsWarning: () => exists('noNodeAttributesWarning'),
      hasDefaultAllocationWarning: () => exists('defaultAllocationWarning'),
      hasDefaultAllocationNotice: () => exists('defaultAllocationNotice'),
      hasNodeDetailsFlyout: () => exists(`${phase}-viewNodeDetailsFlyoutButton`),
      openNodeDetailsFlyout: async () => {
        await (0, _testUtils.act)(async () => {
          find(`${phase}-viewNodeDetailsFlyoutButton`).simulate('click');
        });
        component.update();
      }
    };
  };

  const expectErrorMessages = expectedMessages => {
    const errorMessages = component.find('.euiFormErrorText');
    expect(errorMessages.length).toBe(expectedMessages.length);
    expectedMessages.forEach(expectedErrorMessage => {
      let foundErrorMessage;

      for (let i = 0; i < errorMessages.length; i++) {
        if (errorMessages.at(i).text() === expectedErrorMessage) {
          foundErrorMessage = true;
        }
      }

      expect(foundErrorMessage).toBe(true);
    });
  };
  /*
   * For new we rely on a setTimeout to ensure that error messages have time to populate
   * the form object before we look at the form object. See:
   * x-pack/plugins/index_lifecycle_management/public/application/sections/edit_policy/form/form_errors_context.tsx
   * for where this logic lives.
   */


  const runTimers = () => {
    (0, _testUtils.act)(() => {
      jest.runAllTimers();
    });
    component.update();
  };

  return { ...testBed,
    runTimers,
    actions: {
      saveAsNewPolicy: createFormToggleAction('saveAsNewSwitch'),
      setPolicyName: createFormSetValueAction('policyNameField'),
      setWaitForSnapshotPolicy,
      savePolicy,
      hasGlobalErrorCallout: () => exists('policyFormErrorsCallout'),
      expectErrorMessages,
      timeline: {
        hasHotPhase: () => exists('ilmTimelineHotPhase'),
        hasWarmPhase: () => exists('ilmTimelineWarmPhase'),
        hasColdPhase: () => exists('ilmTimelineColdPhase'),
        hasDeletePhase: () => exists('ilmTimelineDeletePhase')
      },
      hot: {
        setMaxSize,
        setMaxDocs,
        setMaxAge,
        toggleRollover,
        toggleDefaultRollover,
        hasRolloverSettingRequiredCallout,
        hasErrorIndicator: () => exists('phaseErrorIndicator-hot'),
        ...createForceMergeActions('hot'),
        ...createIndexPriorityActions('hot'),
        ...createShrinkActions('hot'),
        ...createReadonlyActions('hot'),
        ...createSearchableSnapshotActions('hot')
      },
      warm: {
        enable: enable('warm'),
        ...createMinAgeActions('warm'),
        setReplicas: setReplicas('warm'),
        hasErrorIndicator: () => exists('phaseErrorIndicator-warm'),
        ...createShrinkActions('warm'),
        ...createForceMergeActions('warm'),
        ...createReadonlyActions('warm'),
        ...createIndexPriorityActions('warm'),
        ...createNodeAllocationActions('warm')
      },
      cold: {
        enable: enable('cold'),
        ...createMinAgeActions('cold'),
        setReplicas: setReplicas('cold'),
        setFreeze,
        freezeExists,
        hasErrorIndicator: () => exists('phaseErrorIndicator-cold'),
        ...createIndexPriorityActions('cold'),
        ...createSearchableSnapshotActions('cold'),
        ...createNodeAllocationActions('cold')
      },
      delete: {
        isShown: () => exists('delete-phaseContent'),
        ...createToggleDeletePhaseActions(),
        ...createMinAgeActions('delete')
      }
    }
  };
};

exports.setup = setup;