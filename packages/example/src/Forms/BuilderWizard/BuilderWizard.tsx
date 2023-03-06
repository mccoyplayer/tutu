import React from 'react';
import { FormConfig } from '@tutim/types';
import { Wizard } from '@tutim/fields';
import builderSchema from './builder-config.json';
import { schemaTranform } from './utils';

const builderConfig: FormConfig = {
  fields: schemaTranform(builderSchema.schema as any),
  meta: {
    title: 'Builder Wizard',
    steps: builderSchema.form.steps,
  },
};

export const BuilderWizard = (): JSX.Element => {
  return <Wizard onSubmit={console.log} config={builderConfig} />;
};
