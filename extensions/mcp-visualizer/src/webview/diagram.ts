import { LifecycleStage } from '../types';

const BRANCH_LANES = [
  { name: 'feature/*', y: 200 },
  { name: 'master', y: 280 },
  { name: 'uat', y: 360 },
  { name: 'stage', y: 440 },
  { name: 'production', y: 520 },
];

const BRANCH_NODES = [
  { x: 200, y: 200, branch: 'feature/REQ-XXXX', label: '需求分支' },
  { x: 400, y: 200, branch: 'feature/REQ-XXXX', label: '开发中' },
  { x: 600, y: 280, branch: 'master', label: '同步主干' },
  { x: 750, y: 360, branch: 'uat/release', label: 'UAT' },
  { x: 900, y: 440, branch: 'stage/release', label: 'STAGE' },
  { x: 1050, y: 520, branch: 'production/release', label: '生产' },
  { x: 600, y: 200, branch: 'release/vX.Y.Z', label: '提测分支' },
  { x: 850, y: 200, branch: 'hotfix/BUG-XXXX', label: '热修复' },
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

export function renderBranchLanes(): string {
  return BRANCH_LANES.map(
    (lane) => `
      <g>
        <line x1="80" y1="${lane.y}" x2="1120" y2="${lane.y}" stroke="var(--vscode-editorWidget-border)" stroke-dasharray="6 4" />
        <text x="40" y="${lane.y + 6}" font-size="12" fill="var(--vscode-descriptionForeground)" text-anchor="end">${lane.name}</text>
      </g>
    `,
  ).join('\n');
}

export function renderBranchNodes(): string {
  return BRANCH_NODES.map(
    (node) => `
      <g class="branch-node" data-branch="${node.branch}" transform="translate(${node.x}, ${node.y})">
        <ellipse cx="0" cy="0" rx="55" ry="28" fill="var(--vscode-sideBar-background)" stroke="var(--vscode-editorWidget-border)" />
        <text x="0" y="5" text-anchor="middle" fill="var(--vscode-foreground)" font-size="12">${node.label}</text>
      </g>
    `,
  ).join('\n');
}
