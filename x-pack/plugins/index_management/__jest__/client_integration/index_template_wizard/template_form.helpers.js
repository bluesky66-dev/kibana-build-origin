"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formSetup = void 0;

var _testUtils = require("react-dom/test-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const formSetup = async initTestBed => {
  const testBed = await initTestBed(); // User actions

  const clickNextButton = () => {
    testBed.find('nextButton').simulate('click');
  };

  const clickBackButton = () => {
    testBed.find('backButton').simulate('click');
  };

  const clickEditButtonAtField = index => {
    testBed.find('editFieldButton').at(index).simulate('click');
  };

  const clickEditFieldUpdateButton = () => {
    testBed.find('editFieldUpdateButton').simulate('click');
  };

  const deleteMappingsFieldAt = index => {
    testBed.find('removeFieldButton').at(index).simulate('click');
    testBed.find('confirmModalConfirmButton').simulate('click');
  };

  const clickCancelCreateFieldButton = () => {
    testBed.find('createFieldForm.cancelButton').simulate('click');
  }; // Step component templates actions


  const componentTemplates = {
    getComponentTemplatesInList() {
      const {
        find
      } = testBed;
      return find('componentTemplatesList.item.name').map(wrapper => wrapper.text());
    },

    getComponentTemplatesSelected() {
      const {
        find
      } = testBed;
      return find('componentTemplatesSelection.item.name').map(wrapper => wrapper.text());
    },

    showFilters() {
      const {
        find,
        component
      } = testBed;
      (0, _testUtils.act)(() => {
        find('componentTemplates.filterButton').simulate('click');
      });
      component.update();
    },

    async selectFilter(filter) {
      const {
        find,
        component
      } = testBed;
      const filters = ['settings', 'mappings', 'aliases'];
      const index = filters.indexOf(filter);
      await (0, _testUtils.act)(async () => {
        find('filterList.filterItem').at(index).simulate('click');
      });
      component.update();
    },

    async selectComponentAt(index) {
      const {
        find,
        component
      } = testBed;
      await (0, _testUtils.act)(async () => {
        find('componentTemplatesList.item.action-plusInCircle').at(index).simulate('click');
      });
      component.update();
    },

    async unSelectComponentAt(index) {
      const {
        find,
        component
      } = testBed;
      await (0, _testUtils.act)(async () => {
        find('componentTemplatesSelection.item.action-minusInCircle').at(index).simulate('click');
      });
      component.update();
    }

  }; // Step Mappings actions

  const mappings = {
    async addField(name, type) {
      const {
        find,
        form,
        component
      } = testBed;
      await (0, _testUtils.act)(async () => {
        form.setInputValue('nameParameterInput', name);
        find('createFieldForm.mockComboBox').simulate('change', [{
          label: type,
          value: type
        }]);
      });
      await (0, _testUtils.act)(async () => {
        find('createFieldForm.addButton').simulate('click');
      });
      component.update();
    }

  }; // Step Review actions

  const review = {
    async selectTab(tab) {
      const tabs = ['summary', 'preview', 'request'];
      await (0, _testUtils.act)(async () => {
        testBed.find('summaryTabContent').find('.euiTab').at(tabs.indexOf(tab)).simulate('click');
      });
      testBed.component.update();
    }

  };

  const completeStepOne = async ({
    name,
    indexPatterns,
    order,
    priority,
    version
  } = {}) => {
    const {
      component,
      form,
      find
    } = testBed;

    if (name) {
      (0, _testUtils.act)(() => {
        form.setInputValue('nameField.input', name);
      });
    }

    if (indexPatterns) {
      const indexPatternsFormatted = indexPatterns.map(pattern => ({
        label: pattern,
        value: pattern
      }));
      (0, _testUtils.act)(() => {
        find('mockComboBox').simulate('change', indexPatternsFormatted); // Using mocked EuiComboBox
      });
    }

    await (0, _testUtils.act)(async () => {
      if (order) {
        form.setInputValue('orderField.input', JSON.stringify(order));
      }

      if (priority) {
        form.setInputValue('priorityField.input', JSON.stringify(priority));
      }

      if (version) {
        form.setInputValue('versionField.input', JSON.stringify(version));
      }

      clickNextButton();
    });
    component.update();
  };

  const completeStepTwo = async componentName => {
    const {
      find,
      component
    } = testBed;

    if (componentName) {
      // Find the index of the template in the list
      const allComponents = find('componentTemplatesList.item.name').map(wrapper => wrapper.text());
      const index = allComponents.indexOf(componentName);

      if (index < 0) {
        throw new Error(`Could not find component "${componentName}" in the list ${JSON.stringify(allComponents)}`);
      }

      await componentTemplates.selectComponentAt(index);
    }

    await (0, _testUtils.act)(async () => {
      clickNextButton();
    });
    component.update();
  };

  const completeStepThree = async settings => {
    const {
      find,
      component
    } = testBed;
    await (0, _testUtils.act)(async () => {
      if (settings) {
        find('mockCodeEditor').simulate('change', {
          jsonString: settings
        }); // Using mocked EuiCodeEditor
      }
    });
    await (0, _testUtils.act)(async () => {
      clickNextButton();
    });
    component.update();
  };

  const completeStepFour = async mappingFields => {
    const {
      component
    } = testBed;

    if (mappingFields) {
      for (const field of mappingFields) {
        const {
          name,
          type
        } = field;
        await mappings.addField(name, type);
      }
    }

    await (0, _testUtils.act)(async () => {
      clickNextButton();
    });
    component.update();
  };

  const completeStepFive = async aliases => {
    const {
      find,
      component
    } = testBed;

    if (aliases) {
      await (0, _testUtils.act)(async () => {
        find('mockCodeEditor').simulate('change', {
          jsonString: aliases
        }); // Using mocked EuiCodeEditor
      });
      component.update();
    }

    await (0, _testUtils.act)(async () => {
      clickNextButton();
    });
    component.update();
  };

  return { ...testBed,
    actions: {
      clickNextButton,
      clickBackButton,
      clickEditButtonAtField,
      clickEditFieldUpdateButton,
      deleteMappingsFieldAt,
      clickCancelCreateFieldButton,
      completeStepOne,
      completeStepTwo,
      completeStepThree,
      completeStepFour,
      completeStepFive,
      componentTemplates,
      mappings,
      review
    }
  };
};

exports.formSetup = formSetup;