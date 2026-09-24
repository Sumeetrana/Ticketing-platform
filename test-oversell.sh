#!/bin/bash
B=http://localhost:3001/api/v1

ID=$(curl -s -X POST $B/events -H "Content-Type: application/json" \
  -d '{"name":"Oversell Test","venue":"Arena","startsAt":"2027-06-01T19:00:00Z","capacity":10,"pricePerTicket":100}' \
  | python3 -c "import json,sys;print(json.load(sys.stdin)['id'])")

for i in $(seq 1 20); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST "$B/events/$ID/holds" \
    -H "Content-Type: application/json" -d '{"quantity":1}' &
done > /tmp/codes.txt
wait

echo "succeeded: $(grep -c 201 /tmp/codes.txt)"
echo "rejected:  $(grep -c 409 /tmp/codes.txt)"
curl -s "$B/events/$ID" | python3 -c "import json,sys;d=json.load(sys.stdin);print('capacity',d['capacity'],'reserved',d['reserved'])"