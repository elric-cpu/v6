# Agent Hook Policy

Date: 2026-05-24

Scope: `/home/elric/Projects/benson-home-solutions`

## Goals

- Keep safety and memory hooks project-local before changing global Claude or Codex defaults.
- Reuse the canonical self-improving-agent hooks under `/home/elric/.codex/skills/self-improving-agent/hooks/`.
- Keep hooks lightweight and non-blocking unless a tool action is clearly dangerous.
- Inventory cached plugin hooks before enabling them in this project.

## Safety Rules

- Do not run destructive commands unless the user explicitly asks for that exact operation.
- Treat `rm -rf`, forced git rewrites, credential edits, production deploys, and broad permission changes as high-risk actions.
- Do not place secret-shaped values in docs, tracked files, examples, reports, or durable memory.
- Redact credential material when documenting configs or command output.
- Prefer project-local hook behavior over global hook edits until this policy has been validated in normal work.

## Memory Rules

- Capture session start and session end events through the self-improving-agent memory hooks.
- Capture pre-tool and post-tool context for `Bash`, `Edit`, and `Write`.
- Keep memory hooks focused on context and safety observations. Do not add build, lint, test, deploy, or external-service automation to this hook layer.

## Current Project Wiring

`.claude/settings.local.json` wires:

- `SessionStart` to `/home/elric/.codex/skills/self-improving-agent/hooks/session-start.sh`
- `SessionEnd` to `/home/elric/.codex/skills/self-improving-agent/hooks/session-end.sh`
- `PreToolUse` for `Bash`, `Edit`, and `Write` to `/home/elric/.codex/skills/self-improving-agent/hooks/pre-tool.sh`
- `PostToolUse` for `Bash`, `Edit`, and `Write` to `/home/elric/.codex/skills/self-improving-agent/hooks/post-bash.sh`

## Deferred Hooks

Do not enable plugin-provided hooks from cached plugins automatically. `hookify`, `remember`, `superpowers`, `ralph-loop`, `openai-codex`, and `everything-claude-code` all have hook surfaces with broader behavior than this first safety/memory pass. Those hooks need separate review before project activation.
