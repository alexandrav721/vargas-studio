#!/bin/bash
B=http://127.0.0.1:8792/api/wl; O="Origin: http://127.0.0.1:8792"; J="content-type: application/json"; D=$(mktemp -d); pass=0; fail=0
check() { if [ "$2" = "$3" ]; then echo "PASS $1"; pass=$((pass+1)); else echo "FAIL $1 (got $2, want $3)"; fail=$((fail+1)); fi; }
code() { curl -s -o $D/out -w "%{http_code}" "$@"; }
curl -s --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null $B/algo
R=$RANDOM$RANDOM; curl -s -c $D/u -H "$O" -H "$J" -X POST $B/signup -d '{"email":"feeds'$R'@test.local","password":"long-password-123","name":"F"}' -o /dev/null
check "signed out -> 401" "$(code $B/feeds-in)" 401
check "list is on" "$(curl -s -b $D/u $B/feeds-in | grep -o '"configured":true')" '"configured":true'
check "http link rejected" "$(code -b $D/u -H "$O" -H "$J" -X POST $B/feeds-in -d '{"kind":"luma","url":"http://example.com/a.ics"}')" 400
check "IP link rejected" "$(code -b $D/u -H "$O" -H "$J" -X POST $B/feeds-in -d '{"kind":"luma","url":"https://10.0.0.1/a.ics"}')" 400
check "not a calendar rejected" "$(code -b $D/u -H "$O" -H "$J" -X POST $B/feeds-in -d '{"kind":"calendar","url":"http://127.0.0.1:8793/bad.txt"}')" 400
grep -o '"error":"[^"]*"' $D/out
check "add luma" "$(code -b $D/u -H "$O" -H "$J" -X POST $B/feeds-in -d '{"kind":"luma","url":"http://127.0.0.1:8793/luma.ics"}')" 201
check "add partiful" "$(code -b $D/u -H "$O" -H "$J" -X POST $B/feeds-in -d '{"kind":"partiful","url":"http://127.0.0.1:8793/partiful.ics"}')" 201
check "link never returned" "$(grep -c '8793' $D/out)" 0
curl -s -b $D/u "$B/feeds-in/events?from=2026-11-23T05:00:00Z&to=2026-12-07T05:00:00Z" > $D/ev
check "4 events (cancelled dropped)" "$(grep -o '"title"' $D/ev | wc -l | tr -d ' ')" 4
check "luma NY time right" "$(grep -o '"title":"Founders Coffee, Brooklyn","start":"[^"]*"' $D/ev)" '"title":"Founders Coffee, Brooklyn","start":"2026-11-28T00:00:00.000Z"'
check "all-day kept" "$(grep -o '"title":"Friendsgiving","start":"[^"]*","end":"[^"]*","all_day":true' $D/ev | wc -l | tr -d ' ')" 1
check "source tagged" "$(grep -o '"source":"partiful"' $D/ev | wc -l | tr -d ' ')" 2
check "other user can't see" "$(curl -s "$B/feeds-in/events?from=2026-11-23T05:00:00Z&to=2026-12-07T05:00:00Z" -o /dev/null -w '%{http_code}')" 401
FID=$(curl -s -b $D/u $B/feeds-in | grep -o '"id":"[^"]*","kind":"partiful"' | head -1 | cut -d'"' -f4)
check "remove partiful" "$(code -b $D/u -H "$O" -H "$J" -X POST $B/feeds-in/$FID/remove -d '{}')" 200
curl -s -b $D/u "$B/feeds-in/events?from=2026-11-23T05:00:00Z&to=2026-12-07T05:00:00Z" > $D/ev
check "partiful gone" "$(grep -c partiful $D/ev)" 0
echo "passed $pass, failed $fail"
