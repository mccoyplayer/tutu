import { FieldConfig, FormConfig } from '@tutim/types';
import { useForm } from '@tutim/headless';
import React from 'react';
import { useWizardContext } from './use-wizard';

const getStepConfig = (config: FormConfig, step: number): FieldConfig[] => {
  const { wizard } = config;
  const { steps } = wizard || {};
  if (!steps) return [];
  const stepConfig = steps[step];
  const fields = stepConfig.fields
    .map((key) => config.fields.find((field) => field.key === key))
    .filter(Boolean) as FieldConfig[];
  return fields;
};

const getStepValues = (config: FormConfig, step: number, values: Record<string, any>): Record<string, any> => {
  const fields = getStepConfig(config, step);
  const stepValues = fields.reduce((acc, field) => {
    const { key } = field;
    const value = values[key];
    return { ...acc, [key]: value };
  }, {});
  return stepValues;
};

const layout = { submit: { display: false } };
const meta = { title: undefined };

export const useStep = () => {
  const { config, currentStep, wizardValues, goToStep, onStepSubmit } = useWizardContext();

  const fields = getStepConfig(config, currentStep);
  const initialValues = getStepValues(config, currentStep, wizardValues);
  const stepConfig = {
    ...config,
    fields,
    layout: { ...config.layout, ...layout },
    meta: { ...config.meta, ...meta },
  };

  const form = useForm(stepConfig);

  React.useEffect(() => {
    form.reset(initialValues);
  }, [currentStep]);

  const isLastStep = currentStep + 1 === config?.wizard?.steps.length;
  const goBack = () => {
    if (form.formState.isValid) {
      onStepSubmit(form.getValues(), false);
    }
    goToStep(currentStep - 1);
  };
  const goNext = () => {
    if (form.formState.isValid) {
      onStepSubmit(form.getValues(), isLastStep);
    }
    goToStep(currentStep + 1);
  };

  return { form, goBack, goNext, isLastStep };
};
