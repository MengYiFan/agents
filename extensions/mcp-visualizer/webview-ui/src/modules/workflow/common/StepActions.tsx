import React from 'react';
import { Button, Space } from 'antd';
import {
  RocketOutlined,
  GithubOutlined,
  CheckCircleOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import { IActionDefinition, IStepDefinition } from '@/types/workflow';

interface StepActionsProps {
  actions?: IActionDefinition[]; // Some steps might override actions via props, or we use from stepDef
  currentStep?: IStepDefinition; // Fallback if actions not passed directly
  loadingAction: string | null;
  onAction: (action: IActionDefinition) => void;
  block?: boolean; // Whether buttons should be full width
}

/**
 * Renders the list of action buttons for a workflow step.
 */
export const StepActions: React.FC<StepActionsProps> = ({
  actions,
  currentStep,
  loadingAction,
  onAction,
  block = false,
}) => {
  const targetActions = actions || currentStep?.actions || [];

  if (!targetActions.length) return null;

  const getActionProps = (action: IActionDefinition) => {
    let btnType: any = 'default';
    let danger = false;

    // Map config styles to AntD Button props
    if (action.style === 'primary') btnType = 'primary';
    else if (action.style === 'danger') {
      btnType = 'primary';
      danger = true;
    } else if (action.style === 'ghost') btnType = 'text';
    else if (action.style === 'link') btnType = 'link';

    // Icons
    let icon = undefined;
    if (action.type === 'GitCommit') icon = <CheckCircleOutlined />;
    else if (action.type === 'Transition') icon = <RocketOutlined />;
    else if (action.type === 'CreateBranch') icon = <BranchesOutlined />;
    else if (action.type === 'MergeAndPush') icon = <GithubOutlined />;

    return {
      type: btnType,
      danger,
      icon,
      onClick: () => onAction(action),
      loading: loadingAction === action.type,
      disabled: loadingAction !== null,
    };
  };

  return (
    <Space
      style={{ width: block ? '100%' : 'auto', justifyContent: block ? 'flex-end' : 'flex-start' }}
    >
      {targetActions.map((action, idx) => {
        const props = getActionProps(action);
        return (
          <Button key={idx} {...props} block={block}>
            {action.label}
          </Button>
        );
      })}
    </Space>
  );
};
