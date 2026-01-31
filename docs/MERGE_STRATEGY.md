# Merge Strategy

Given 3 agents working in parallel, merge conflicts are expected but minimized by directory separation.

## Workflow
1. **Agent Work**: Commit changes to `agent-x-feature`.
2. **Pull Request**: Open PR to `develop`.
3. **CI Checks**: Ensure `npm test` passes.
4. **Merge**: Squash and merge to `develop`.
5. **Release**: Merge `develop` to `main`.

## Conflict Resolution
- If `src/types/tax.ts` is modified by multiple agents, discuss changes.
- UI changes (Agent C) should rarely conflict with Logic (Agent B) or Data (Agent A).
