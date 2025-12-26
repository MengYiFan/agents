import { useState } from 'react';
import { App, FormInstance } from 'antd';
import { IActionDefinition, IStepDefinition } from '../../../types/workflow';
import { usePostMessage } from '../../../hooks/useVscodeMessage';

export function useWorkflowActions(form: FormInstance, currentStep: IStepDefinition) {
  const postMessage = usePostMessage();
  const { message } = App.useApp();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (action: IActionDefinition) => {
    try {
      const isFormStep = currentStep.type === 'form' || currentStep.type === 'release';

      // Validation Logic
      let shouldValidate = false;
      if (action.validation === 'all' || action.validation === 'required') {
        shouldValidate = true;
      }
      if (!action.validation && isFormStep && action.style === 'primary') {
        shouldValidate = true;
      }

      let formData = {};

      if (shouldValidate && isFormStep) {
        await form.validateFields();
        formData = form.getFieldsValue();
      } else if (isFormStep) {
        formData = form.getFieldsValue();
      }

      setLoadingAction(action.type);

      postMessage({
        type: 'executeAction',
        payload: {
          action,
          stepId: currentStep.id,
          data: formData,
        },
      });

      // Clear loading after timeout
      setTimeout(() => setLoadingAction(null), 8000);
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Please fix form errors before proceeding.');
      setLoadingAction(null);
    }
  };

  return {
    loadingAction,
    handleAction,
  };
}
