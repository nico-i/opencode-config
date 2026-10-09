# opencode-config

Opinionated, security-hardened global configuration for
[OpenCode 2](https://opencode.ai/v2). Optimized for three things:

1. **Lower token usage** — a cheap model for title generation and bounded
   compaction overhead.
2. **High-quality, fully-tested code** — plan → build → validation.
3. **Human-in-the-loop on the decisions that matter** — read-only start,
   a decision gate for irreversible changes, no auto-commit.

Global policies restrict providers and non-negotiable operations, while
ordered permissions control the normal agent experience.

## Layout

```
opencode.json                 v2 core config (models, permissions, agents, MCPs)
cli.json                      terminal settings; notifications on approval prompts
AGENTS.md                     engineering conventions the agent follows
scripts/
  verify.sh                   verify the native v2 config and policy declarations
  pull-skills.sh              update managed congstar skills
```

## Activate

OpenCode loads this directory automatically when it is located at
`~/.config/opencode`. Install OpenCode 2 on macOS with:

```sh
brew install anomalyco/tap/opencode-v2
```

OpenCode 1 and 2 use the same configuration location. Do not run OpenCode 1
against this native v2 configuration.

## Security model

The global configuration uses two native v2 controls:

| Control | Purpose |
| ------- | ------- |
| `experimental.policies` | Allows only GitHub Copilot and hard-denies sensitive shell/edit operations. Global policies override project policy and saved approvals. |
| `permissions` | Asks before arbitrary shell and web requests, allows routine inspection, and denies sensitive reads and commands. |

Policies apply after permissions and saved approvals. A policy denial therefore
cannot be bypassed by selecting **Allow always** or by project configuration.
Plugins still execute as the host user and are not a security sandbox; this setup
does not configure external plugins.

## Workflow

```
plan       → produce a plan
build      → implement to green
tests      → validate the affected behavior
```

See `AGENTS.md` for the engineering and delivery conventions.

## Notes

- The title agent uses `github-copilot/gpt-5.4-mini`; build and plan use
  `github-copilot/gpt-5.6-sol`.
- There is no automatic test-gate hook. Typechecking is enforced by
  directive: `AGENTS.md` requires the agent to run the project's
  typecheck (`tsc --noEmit` or equivalent) after editing source and
  resolve errors before the task is done.
- Docs MCPs are kept to reduce hallucinated APIs. No external plugins are
  configured.
- `cli.json` enables `attention` (desktop notification + sound). The
  ask-by-default permissions and `default_agent: plan` mean the agent
  blocks on approval often; without this nothing signals that it
  stopped and is waiting.
