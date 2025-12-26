import type { LifecycleStage } from '../../../types';
import type { DiagramText } from '../../../shared/localization/i18n';

const BRANCH_LANES = [
  { key: 'feature', y: 200 },
  { key: 'main', y: 280 },
  { key: 'release', y: 360 },
  { key: 'hotfix', y: 440 },
  { key: 'tags', y: 520 },
];

const BRANCH_NODES = [
  { x: 200, y: 200, branch: 'feature/REQ-XXXX', labelKey: 'featurePlan' },
  { x: 380, y: 200, branch: 'feature/REQ-XXXX', labelKey: 'featureBuild' },
  { x: 560, y: 280, branch: 'master', labelKey: 'mainSync' },
  { x: 780, y: 360, branch: 'release/vX.Y.Z', labelKey: 'releasePrep' },
  { x: 940, y: 360, branch: 'release/vX.Y.Z', labelKey: 'releaseVerify' },
  { x: 820, y: 440, branch: 'hotfix/BUG-XXXX', labelKey: 'hotfix' },
  { x: 1100, y: 520, branch: 'tags/vX.Y.Z', labelKey: 'production' },
];

export function renderStageNodes(stages: LifecycleStage[]): string {
  const startX = 120;
  const gap = 150;
  return stages
    .map((stage, index) => {
      const x = startX + index * gap;
      return `
        <g class="stage-node" data-stage="${stage.id}" transform="translate(${x}, 60)">
          <rect x="-60" y="-30" width="120" height="60" rx="12" ry="12" fill="var(--vscode-sideBar-background)" stroke="var(--vscode-editorWidget-border)" />
          <text x="0" y="5" text-anchor="middle" fill="var(--vscode-foreground)" font-size="14">${stage.name}</text>
        </g>
      `;
    })
    .join('\n');
}

export function renderBranchLanes(diagramText: DiagramText): string {
  return BRANCH_LANES.map((lane) => {
    const label = diagramText.lanes[lane.key as keyof DiagramText['lanes']] ?? lane.key;
    return `
      <g>
        <line x1="80" y1="${lane.y}" x2="1120" y2="${lane.y}" stroke="var(--vscode-editorWidget-border)" stroke-dasharray="6 4"/>
        <text x="40" y="${lane.y + 6}" font-size="12" fill="var(--vscode-descriptionForeground)" text-anchor="end">${label}</text>
      </g>
    `;
  }).join('\n');
}

export function renderBranchNodes(diagramText: DiagramText): string {
  return BRANCH_NODES.map((node) => {
    const label = diagramText.nodes[node.labelKey as keyof DiagramText['nodes']] ?? node.labelKey;
    return `
      <g class="branch-node" data-branch="${node.branch}" transform="translate(${node.x}, ${node.y})">
        <ellipse cx="0" cy="0" rx="55" ry="28" fill="var(--vscode-sideBar-background)" stroke="var(--vscode-editorWidget-border)" />
        <text x="0" y="5" text-anchor="middle" fill="var(--vscode-foreground)" font-size="12">${label}</text>
      </g>
    `;
  }).join('\n');
}
