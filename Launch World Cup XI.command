#!/bin/bash
# Double-click this file to launch World Cup XI in your browser.
cd "$(dirname "$0")" || exit 1
PORT=8800
# Start the local server only if it isn't already running.
if ! curl -s -o /dev/null "http://localhost:$PORT/" 2>/dev/null; then
  nohup python3 -m http.server "$PORT" >/tmp/worldcup-xi.log 2>&1 &
  sleep 1
fi
# Open in the default browser.
open "http://localhost:$PORT/"
echo "World Cup XI is running at http://localhost:$PORT/"
echo "You can close this window."
