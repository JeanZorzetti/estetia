#!/bin/sh
# Start supercronic in background
/usr/local/bin/supercronic /crontab &

# Keep container alive with a minimal HTTP server for EasyPanel health check
while true; do
  echo -e "HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nOK" | nc -l -p 8080 -q 1
done
