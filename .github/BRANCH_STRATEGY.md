# Branch Strategy

This project uses a modified Gitflow workflow adapted for multi-agent development.

## Permanent Branches
- `main`: Production-ready code. Deploys to Vercel.
- `develop`: Integration branch. All features merge here first.

## Agent Branches
Each agent works on a dedicated long-lived feature branch or creates short-lived feature branches off these:
- `agent-a-data`: For Agent A (Data Services)
- `agent-b-tax`: For Agent B (Tax Logic)
- `agent-c-ui`: For Agent C (User Interface)

## Workflow
1. Agent checks out their branch (e.g., `git checkout agent-a-data`).
2. Changes are committed locally.
3. Feature is complete -> Open PR to `develop`.
4. Tests pass -> Merge to `develop`.
5. `develop` is stable -> Merge to `main`.

## Syncing
Agents should regularly pull `develop` into their agent branch to avoid massive merge conflicts.
```bash
git checkout agent-a-data
git pull origin develop
```
