# Agent Hooks Audit

Date: 2026-05-24

Scope: local Claude and Codex agent hooks, skills, and plugins relevant to `/home/elric/Projects/benson-home-solutions`.

## Executive Summary

The project now has local Claude safety and memory hooks in `.claude/settings.local.json`. The hooks reuse the existing self-improving-agent scripts from `/home/elric/.codex/skills/self-improving-agent/hooks/` and do not enable any broad cached plugin hook stacks.

No global Claude or Codex settings were changed.

## Active Project

- Project: `/home/elric/Projects/benson-home-solutions`
- Project Claude config: `.claude/settings.json`
- Project Claude local config: `.claude/settings.local.json`
- Project docs added by this pass:
  - `docs/agent-hook-policy.md`
  - `docs/agent-hooks-audit.md`

## Claude Global Config

Global Claude config exists at `/home/elric/.claude/settings.json`.

Observed global behavior:

- Global `PreToolUse`, `PostToolUse`, `SessionStart`, and `SessionEnd` hooks already call the self-improving-agent hook scripts under `/home/elric/.codex/skills/self-improving-agent/hooks/`.
- Global plugins are broad and include development, MCP, memory, review, browser, and third-party service plugins.
- Global settings were inventoried only. They were not edited.

## Codex Global Config

Codex config exists at `/home/elric/.codex/config.toml`.

Observed Codex behavior:

- The workspace `/home/elric/Projects` is trusted.
- OpenAI-curated plugins are enabled for GitHub, Gmail, Hugging Face, Stripe, Vercel, Semrush, Streak, SignNow, Google Calendar, PitchBook, Coderabbit, Superpowers, Build Web Apps, Build iOS Apps, and Canva.
- MCP servers include OpenAI developer docs and Search Console. Some Google Workspace and analytics MCPs are intentionally disabled in comments.
- No Codex global hook edits were made.
- Credential-like config values were not copied into this report.

## Project Claude Config

`.claude/settings.json` enables these project plugins:

- `document-skills@anthropic-agent-skills`
- `claude-api@anthropic-agent-skills`
- `frontend-design@claude-plugins-official`

`.claude/settings.local.json` already contained command permissions for local development, Firebase, Google Cloud, DNS, git, browser/MCP tools, and selected web fetches.

Before this pass, `.claude/settings.local.json` did not contain a `hooks` block. It now wires project-local hooks for safety and memory.

## Project Hook Wiring Added

The project-local hooks now use:

- `PreToolUse` for `Bash`, `Edit`, and `Write`: `bash /home/elric/.codex/skills/self-improving-agent/hooks/pre-tool.sh`
- `PostToolUse` for `Bash`, `Edit`, and `Write`: `bash /home/elric/.codex/skills/self-improving-agent/hooks/post-bash.sh`
- `SessionStart`: `bash /home/elric/.codex/skills/self-improving-agent/hooks/session-start.sh`
- `SessionEnd`: `bash /home/elric/.codex/skills/self-improving-agent/hooks/session-end.sh`

The referenced scripts exist. `pre-tool.sh`, `post-bash.sh`, and `session-end.sh` are executable. `session-start.sh` exists and is invoked through `bash`, so executable mode is not required for this wiring.

## Available Skills

Claude global skills are installed under `/home/elric/.claude/skills/`. The inventory includes document, design, artifact, API, PDF, PPTX, XLSX, internal communications, canvas, brand, and skill-authoring skills.

Codex skills are installed under `/home/elric/.codex/skills/` and plugin-provided skill caches. The inventory includes development, review, documentation, security, frontend, backend, agent, workflow, media, marketing, and automation skills.

Project-local Claude agent state exists under `.claude/agents/` and `.claude/agent-memory/`; no project-local `.claude/skills` directory was found.

## Plugin Hook Inventory

Plugin hook files were inventoried but not enabled.

Key hook surfaces:

- `hookify@claude-plugins-official`: `PreToolUse`, `PostToolUse`, `Stop`, and `UserPromptSubmit` hooks that dispatch Python hook handlers.
- `remember@claude-plugins-official`: `SessionStart` and `PostToolUse` hooks for plugin-managed memory.
- `superpowers@claude-plugins-official`: `SessionStart` hook for superpowers session behavior.
- `ralph-loop@claude-plugins-official`: `Stop` hook for loop behavior.
- `codex@openai-codex`: `SessionStart`, `SessionEnd`, and `Stop` hooks, including a stop-time review gate.
- `everything-claude-code`: a large hook stack covering Bash preflight, write/edit warnings, governance capture, MCP health checks, session activity, quality gates, and continuous learning.

Reason for deferral: these plugin hooks add behavior beyond the requested lightweight safety/memory layer. Several include stop gates, quality checks, or broad dispatchers that should be reviewed separately before project activation.

## Gaps And Follow-Up

- The project now has safety/memory hook wiring, but hook behavior has only been smoke-tested directly, not through a full Claude interactive session.
- There is no project-local Codex hook mechanism configured in this pass.
- No lint, test, typecheck, deploy, or secret-scanning hooks were added. Those belong in a later quality-gate pass after the safety/memory layer is stable.
- Existing broad command permissions in `.claude/settings.local.json` remain unchanged.

## Validation

Validation commands run:

- `python3 -m json.tool .claude/settings.json`
- `python3 -m json.tool .claude/settings.local.json`
- Shell checks for each referenced hook script path.
- Direct hook smoke tests using `bash` for `session-start.sh`, `pre-tool.sh`, `post-bash.sh`, and `session-end.sh` with a temporary memory root.
- Read-only launcher checks: `fcc-claude --version` and `claude --version` both returned Claude Code `2.1.150`.
- `git status --short --untracked-files=all`

No tracked source files were intentionally changed.
