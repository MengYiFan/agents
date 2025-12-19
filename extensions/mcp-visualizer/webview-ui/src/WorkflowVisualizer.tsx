import { useEffect, useState } from 'react';
import { vscode } from '@/lib/vscode';
import { GitInfo, WorkflowState } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Check,
  AlertCircle,
  Play,
  GitCommit,
  RefreshCw,
  Link as LinkIcon,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WorkflowVisualizer({
  gitInfo,
  workflow,
  releaseBranches,
}: {
  gitInfo: GitInfo | null;
  workflow: WorkflowState | null;
  releaseBranches: string[];
}) {
  // UI State
  const [isCreating, setIsCreating] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 Form
  const [formData, setFormData] = useState({
    prdBrief: '',
    meegleId: '',
    prdLink: '',
    designLink: '',
    backendLink: '',
    frontendLink: '',
    baseBranch: 'master',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 5 Form
  const [selectedRelease, setSelectedRelease] = useState('');

  // Popup states
  const [showBlockedPopup, setShowBlockedPopup] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Track previous branch to detect changes
  const [prevBranch, setPrevBranch] = useState(gitInfo?.currentBranch);

  // Sync state with props
  useEffect(() => {
    if (gitInfo && workflow) {
      // If branch changed, recalculate step
      if (gitInfo.currentBranch !== prevBranch) {
        const steps = ['basic_info', 'development', 'testing', 'acceptance', 'release'];
        let lastCompleted = 0;
        steps.forEach((s, i) => {
          const stepData = workflow.steps?.[s];
          if (stepData?.status === 'completed') {
            lastCompleted = i + 1;
          }
        });

        // If we are on a dev branch, we might start at 2
        // const isDev = gitInfo.currentBranch.startsWith('feature/');

        let nextStep = lastCompleted + 1;
        if (nextStep > 5) nextStep = 5;

        setActiveStep(nextStep);
        setPrevBranch(gitInfo.currentBranch);
      }

      if (workflow.fields) {
        setFormData((prev) => ({ ...prev, ...workflow.fields }));
      }
    }
  }, [gitInfo?.currentBranch, workflow, prevBranch]); // Dependency logic

  // Handlers
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.meegleId) errors.meegleId = '请填写 Meege ID';
    if (!formData.prdBrief) errors.prdBrief = '请填写 Brief';
    if (!formData.prdLink) errors.prdLink = '请填写 PRD 链接';

    // Link validation (simple check)
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    if (formData.prdLink && !urlRegex.test(formData.prdLink)) {
      errors.prdLink = 'PRD 链接格式不正确';
    }
    if (formData.designLink && !urlRegex.test(formData.designLink)) {
      errors.designLink = '设计稿链接格式不正确';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      const missing = [];
      if (errors.meegleId) missing.push('Meege ID');
      if (errors.prdBrief) missing.push('Brief');
      if (errors.prdLink) missing.push('PRD Link');

      if (missing.length > 0) {
        return false;
      }
      return false; // Return false if any errors exist
    }
    return true;
  };

  const handleCreateBranch = () => {
    if (!validateStep1()) return;

    setIsSubmitting(true);
    vscode.postMessage({
      type: 'createDevBranch',
      baseBranch: formData.baseBranch,
      meegleId: formData.meegleId,
      prdBrief: formData.prdBrief,
    });

    // Timeout cleanup in case backend failssilently
    setTimeout(() => setIsSubmitting(false), 5000);
  };

  const handleStart = () => setIsCreating(true);

  const completeStage = (stageId: string) => {
    if (!gitInfo?.currentBranch) return;

    // Optimistic update
    const next = activeStep + 1;
    if (next <= 5) setActiveStep(next);

    vscode.postMessage({ type: 'completeStage', stageId, branch: gitInfo.currentBranch });
  };

  const isDevBranch = gitInfo?.currentBranch.startsWith('feature/');

  // View Logic
  if (!gitInfo)
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
        Loading Git Info...
      </div>
    );

  if (!isDevBranch && !isCreating) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold">研发流程可视化</h1>
        <p className="text-muted-foreground text-center max-w-md">
          当前不在开发分支。点击下方按钮开始新的研发周期。
        </p>
        <Button size="lg" onClick={handleStart}>
          <Play className="mr-2 h-4 w-4" />
          开始新的研发周期
        </Button>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
            {Object.keys(formErrors).length > 0 && (
              <div className="p-4 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5" />
                <div className="text-sm font-medium">
                  请修正以下错误：{Object.values(formErrors).join('、')}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Meege ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={formData.meegleId}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, meegleId: e.target.value }));
                    if (formErrors.meegleId) setFormErrors((p) => ({ ...p, meegleId: '' }));
                  }}
                  placeholder="请输入数字，如 869"
                  type="number"
                  disabled={isDevBranch}
                  className={formErrors.meegleId ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {formErrors.meegleId && (
                  <p className="text-red-500 text-xs mt-1 font-medium flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {formErrors.meegleId}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>
                  Brief <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={formData.prdBrief}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, prdBrief: e.target.value }));
                    if (formErrors.prdBrief) setFormErrors((p) => ({ ...p, prdBrief: '' }));
                  }}
                  placeholder="请输入简短描述，如 content-error-sweep"
                  disabled={isDevBranch}
                  className={formErrors.prdBrief ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {formErrors.prdBrief && (
                  <p className="text-red-500 text-xs mt-1 font-medium flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {formErrors.prdBrief}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                PRD 链接 <span className="text-destructive">*</span>
              </Label>
              <Input
                value={formData.prdLink}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, prdLink: e.target.value }));
                  if (formErrors.prdLink) setFormErrors((p) => ({ ...p, prdLink: '' }));
                }}
                placeholder="请输入有效 URL，如 https://..."
                disabled={isDevBranch}
                className={formErrors.prdLink ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {formErrors.prdLink && (
                <p className="text-red-500 text-xs mt-1 font-medium flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.prdLink}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>设计稿链接</Label>
              <Input
                value={formData.designLink}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, designLink: e.target.value }));
                  if (formErrors.designLink) setFormErrors((p) => ({ ...p, designLink: '' }));
                }}
                placeholder="请输入有效 URL (选填)"
                disabled={isDevBranch && workflow?.steps?.basic_info?.status === 'completed'}
                className={formErrors.designLink ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {formErrors.designLink && (
                <p className="text-red-500 text-xs mt-1 font-medium flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.designLink}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>后端方案</Label>
                <Input
                  value={formData.backendLink}
                  onChange={(e) => setFormData((p) => ({ ...p, backendLink: e.target.value }))}
                  placeholder="请输入链接 (选填)"
                />
              </div>
              <div className="space-y-2">
                <Label>前端方案</Label>
                <Input
                  value={formData.frontendLink}
                  onChange={(e) => setFormData((p) => ({ ...p, frontendLink: e.target.value }))}
                  placeholder="请输入链接 (选填)"
                />
              </div>
            </div>

            {!isDevBranch ? (
              <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Label>基准分支:</Label>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.baseBranch}
                    onChange={(e) => setFormData((p) => ({ ...p, baseBranch: e.target.value }))}
                  >
                    <option value="master">master</option>
                    <option value="main">main</option>
                    <option value={gitInfo.currentBranch}>当前 ({gitInfo.currentBranch})</option>
                  </select>
                </div>
                <Button onClick={handleCreateBranch} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  创建&生成开发分支
                </Button>
              </div>
            ) : (
              // If isDevBranch
              <div className="flex justify-end pt-4 border-t">
                {workflow?.steps?.basic_info?.status === 'completed' ? (
                  <Button onClick={() => setActiveStep(2)}>
                    下一步 <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      if (validateStep1()) {
                        completeStage('basic_info');
                      }
                    }}
                  >
                    保存 & 下一步
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      case 2: // Development
        return (
          <div className="max-w-2xl mx-auto space-y-6 text-center animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="flex flex-col items-center space-y-4 py-8">
              <div className="p-4 bg-muted rounded-lg border w-full max-w-md">
                <Label className="mb-2 block text-left">Current Branch</Label>
                <div className="flex items-center gap-2 font-mono text-sm">
                  <GitCommit className="h-4 w-4" />
                  {gitInfo.currentBranch}
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full max-w-md h-16 text-lg"
                onClick={() =>
                  vscode.postMessage({ type: 'executeInstruction', instructionId: 'commit' })
                }
              >
                <GitCommit className="mr-2 h-5 w-5" />
                提交代码 (yummy commit)
              </Button>
            </div>
            <div className="flex justify-end pt-8 border-t">
              {/* Only show "Submit & Next" if not completed, or handled by logic */}
              <Button onClick={() => completeStage('development')}>
                提交 & 下一步 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 3: // Testing
        return (
          <div className="max-w-2xl mx-auto space-y-6 text-center animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="flex flex-col items-center space-y-4 py-8">
              <Button
                variant="outline"
                size="lg"
                className="w-full max-w-md h-16 text-lg"
                onClick={() =>
                  vscode.postMessage({ type: 'executeInstruction', instructionId: 'commit' })
                }
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                测试修复 & 提交
              </Button>
            </div>
            <div className="flex justify-end pt-8 border-t">
              <Button onClick={() => completeStage('testing')}>
                提交 & 下一步 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 4: // Acceptance
        return (
          <div className="max-w-2xl mx-auto space-y-6 text-center animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="flex flex-col items-center space-y-4 py-8">
              <Button
                variant="outline"
                size="lg"
                className="w-full max-w-md h-16 text-lg"
                onClick={() =>
                  vscode.postMessage({ type: 'executeInstruction', instructionId: 'commit' })
                }
              >
                <Check className="mr-2 h-5 w-5" />
                验收修复 & 提交
              </Button>
            </div>
            <div className="flex justify-end pt-8 border-t">
              <Button onClick={() => completeStage('acceptance')}>
                提交 & 下一步 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 5: // Release
        return (
          <div className="max-w-2xl mx-auto space-y-6 text-center animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="space-y-4 text-left py-8 max-w-md mx-auto">
              <Label>选择 Release 分支</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedRelease}
                onChange={(e) => setSelectedRelease(e.target.value)}
              >
                <option value="">请选择...</option>
                {releaseBranches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end pt-8 border-t">
              <Button
                disabled={!selectedRelease}
                onClick={() => {
                  vscode.postMessage({
                    type: 'executeInstruction',
                    instructionId: 'merge_release',
                    data: { branch: selectedRelease },
                  });
                }}
              >
                <LinkIcon className="mr-2 h-4 w-4" /> 关联 & 合并
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Steps Indicator */}
      <div className="border-b bg-card/50 p-4">
        <div className="flex items-center justify-between space-x-2 overflow-x-auto no-scrollbar max-w-4xl mx-auto w-full">
          {['基本信息', '开发阶段', '测试阶段', '验收阶段', '上线阶段'].map((label, index) => {
            const step = index + 1;
            // Navigation Logic:
            // 1. Can click any step that is active, completed, or the immediate next one.
            // 2. Actually, usually limited to max(completed) + 1.
            // 3. User wants "Completed state highlight" and "Switch freely between completed and current".

            const stepKey = ['basic_info', 'development', 'testing', 'acceptance', 'release'][
              index
            ];
            const stepData = workflow?.steps?.[stepKey];
            const isCompleted = stepData?.status === 'completed';
            const isCurrent = activeStep === step;

            // Find the highest completed step index
            let maxCompletedStep = 0;
            const stepsOrder = ['basic_info', 'development', 'testing', 'acceptance', 'release'];
            for (let i = 0; i < stepsOrder.length; i++) {
              if (workflow?.steps?.[stepsOrder[i]]?.status === 'completed') {
                maxCompletedStep = i + 1;
              } else {
                break;
              }
            }

            // Allowed to navigate if:
            // - It is a previously completed step
            // - It is the current step
            // - It is the immediate next step after the last completed one (i.e. the "current" task)
            // So allowed range is [1 ... maxCompletedStep + 1]
            const isAllowed = step <= maxCompletedStep + 1;

            return (
              <div
                key={step}
                onClick={() => isAllowed && setActiveStep(step)}
                className={cn(
                  'flex flex-col md:flex-row items-center md:space-x-2 px-3 py-2 rounded-md transition-all cursor-pointer select-none',
                  isCurrent
                    ? 'bg-primary text-primary-foreground shadow-md scale-105'
                    : isCompleted
                      ? 'bg-green-500/10 text-green-700 border border-green-200'
                      : isAllowed
                        ? 'hover:bg-accent'
                        : 'text-muted-foreground opacity-50 cursor-not-allowed',
                )}
              >
                <div
                  className={cn(
                    'font-bold flex items-center justify-center w-6 h-6 rounded-full border border-current text-xs',
                    isCompleted && 'bg-green-500 text-white border-green-500',
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step}
                </div>
                <span className="whitespace-nowrap font-medium text-sm hidden sm:inline">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 scroll-smooth">{renderStepContent()}</div>

      {/* Dialogs */}
      {showBlockedPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBlockedPopup(false)}
          />
          <div className="z-50 bg-background p-6 rounded-lg shadow-xl w-[400px] border">
            <div className="flex items-center space-x-2 text-destructive mb-4">
              <AlertCircle />
              <h3 className="font-semibold">存在未提交代码</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              检测到当前分支 ({gitInfo.currentBranch}) 有未提交的更改。请选择处理方式：
            </p>
            <div className="flex flex-col space-y-2">
              <Button
                variant="secondary"
                onClick={() => {
                  vscode.postMessage({ type: 'stashAndCreate' });
                  setShowBlockedPopup(false);
                }}
              >
                Stash 暂存 (git stash)
              </Button>
              <Button variant="destructive" onClick={() => setShowClearConfirm(true)}>
                强制清除 (git reset --hard)
              </Button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowClearConfirm(false)}
          />
          <div className="z-50 bg-background p-6 rounded-lg shadow-xl w-[300px] border">
            <h3 className="font-semibold mb-2">确认清除？</h3>
            <p className="text-sm text-muted-foreground mb-4">
              此操作不可恢复，确定要放弃所有更改吗？
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setShowClearConfirm(false)}>
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  vscode.postMessage({ type: 'resetAndCreate' });
                  setShowClearConfirm(false);
                  setShowBlockedPopup(false);
                }}
              >
                确认清除
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
