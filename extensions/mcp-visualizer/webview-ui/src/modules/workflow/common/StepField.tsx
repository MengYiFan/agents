import React from 'react';
import { Form, Input, Select, InputNumber } from 'antd';
import { IFieldDefinition } from '@/types/workflow';

interface StepFieldProps {
  field: IFieldDefinition;
}

/**
 * Renders a single form field based on the field definition.
 */
export const StepField: React.FC<StepFieldProps> = ({ field }) => {
  let inputNode;
  switch (field.type) {
    case 'select':
      inputNode = (
        <Select
          options={field.options?.map((o) => ({ label: o, value: o }))}
          placeholder={field.placeholder}
        />
      );
      break;
    case 'number':
      inputNode = <InputNumber style={{ width: '100%' }} placeholder={field.placeholder} />;
      break;
    case 'text':
    case 'string':
      inputNode = <Input placeholder={field.placeholder} />;
      break;
    case 'url':
      inputNode = <Input prefix="🔗" placeholder={field.placeholder || 'https://...'} />;
      break;
    default:
      inputNode = <Input placeholder={field.placeholder} />;
  }

  const rules: any[] = [];
  if (field.required) {
    rules.push({ required: true, message: `${field.label} is required` });
  }
  if (field.pattern) {
    rules.push({
      pattern: new RegExp(field.pattern),
      message: field.description || 'Format invalid',
    });
  }

  return (
    <Form.Item
      key={field.key}
      name={field.key}
      label={field.label}
      rules={rules}
      tooltip={field.description}
      initialValue={field.defaultValue || field.default}
    >
      {inputNode}
    </Form.Item>
  );
};
