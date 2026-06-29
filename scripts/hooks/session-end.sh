#!/usr/bin/env bash
set -euo pipefail

mkdir -p .remember/logs
printf '%s session-end\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> .remember/logs/agent-sessions.log
