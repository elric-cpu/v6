#!/usr/bin/env bash
set -euo pipefail

mkdir -p .remember/logs
printf '%s post-tool %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "${CLAUDE_TOOL_NAME:-${CODEX_TOOL_NAME:-unknown}}" >> .remember/logs/agent-hooks.log
