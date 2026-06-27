#!/usr/bin/env bash
set -euo pipefail

max_attempts=3
attempt=1

while true; do
    echo "Running changeset version, attempt ${attempt}/${max_attempts}"

    if pnpm run version-packages; then
        exit 0
    fi

    status=$?

    if ! git diff --quiet; then
        echo "changeset version left working tree changes after a failed attempt; aborting retry"
        git diff --stat
        exit "${status}"
    fi

    if [ "${attempt}" -ge "${max_attempts}" ]; then
        exit "${status}"
    fi

    sleep_seconds=$((attempt * 10))
    echo "changeset version failed, retrying in ${sleep_seconds}s"
    sleep "${sleep_seconds}"

    attempt=$((attempt + 1))
done
