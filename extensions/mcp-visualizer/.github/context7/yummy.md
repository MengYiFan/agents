# yummy

## Identity

- **Type**: Stateful CLI
- **Domain**: Git workflow automation
- **Binary**: `yummy` (alias: `ym`)
- **Side effects**: commits, branches, tags, pushes

---

## Use this when

- Repository follows **feature / bugfix / release / hotfix** flow
- Commit messages must follow **conventional commits**
- Branch names follow **team conventions**
- Feature / bugfix branches require **Meegle ID**
- AI is used for **assistance**, not authority

---

## Do NOT use this when

- Git plumbing or history rewriting is required
- Detached HEAD workflows
- Dry-run–only operations are expected
- Repository has no release branches

---

## Core rules for models

- All commands are **stateful**
- Commands may:
  - switch branches
  - create commits
  - push to remote

- AI output is optional
- Explicit flags override AI
- Commands are **not idempotent**

---

## Commands

### `yummy commit` (`ym cm`)

Generate and apply a commit message.

- Input: staged diff
- Default: 1 conventional commit message

Flags:

- `-a` stage tracked files
- `-g <n>` generate multiple messages (higher cost)
- `-x <files>` exclude files
- `-m <message>` bypass AI

Model guidance:

- Prefer `-m` when message is known
- Avoid `-g` unless user asks

---

### `yummy branch` (`ym bc`)

Create or delete branches.

Modes:

- `-b <name>` explicit branch
- `-d <desc>` AI-generated name
- `-D <branch>` force delete
- `--release` create release branch

Model guidance:

- Prefer `-b` over `-d`
- Treat `-D` as destructive

---

### `yummy feature-start` (`ym fs`)

Create feature branch linked to Meegle.

- **Required**: `--meegle-id <id>`
- Optional: `-d <desc>`

Guarantees:

- Branch name encodes Meegle ID
- Base branch is standardized

Model guidance:

- Never invent Meegle IDs
- Never omit `--meegle-id`

---

### `yummy feature-release` (`ym fr`)

Land current feature branch into a release branch.

- Detects current branch
- Requires clean working tree

Model guidance:

- Assume merge / MR context

---

### `yummy bug-fix` (`ym bf`)

Same as `feature-start`, but for bugfix lifecycle.

---

### `yummy hot-fix` (`ym hf`)

Start hotfix from production.

Hard constraints:

- Clean working tree
- Production branch enforced
- Auto push to remote

Model guidance:

- High-risk
- Suggest only on explicit intent

---

### `yummy release-start` (`ym rs`)

Create a new release branch.

- Optional: `-d <desc>`

---

### `yummy tag`

Create and push environment tags.

Flags:

- `--test`
- `--uat`
- `--stage`
- `--production`

Model guidance:

- Always assume remote push

---

### `yummy variant` (`ym vr`)

Generate variable / function names.

- Naming only
- No code mutation

---

## Configuration

### `yummy config`

Local CLI configuration.

Common keys:

- `model`: `sonnet` | `haiku` | `gpt-4o` | `gpt-4o-mini`
- `locale`: output language

Model guidance:

- Do not mutate config silently

---

## Sharp edges

- Branch auto-switching
- Remote pushes (`hot-fix`, `tag`)
- Higher AI cost with `-g`
- Dirty tree may block commands

---

## Model summary

- Treat as **workflow orchestrator**
- Prefer explicit flags
- Assume enterprise Git flow
- Never assume dry-run behavior
