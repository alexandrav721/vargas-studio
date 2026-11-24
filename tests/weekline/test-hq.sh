#!/bin/bash
# Tests the Weekline team console routes against a local pages dev server.
B=http://127.0.0.1:8792/api/wl
O="Origin: http://127.0.0.1:8792"
J="content-type: application/json"
D=$(mktemp -d)
pass=0; fail=0
check() { if [ "$2" = "$3" ]; then echo "PASS $1"; pass=$((pass+1)); else echo "FAIL $1 (got $2, want $3)"; fail=$((fail+1)); fi; }
code() { curl -s -o $D/out -w "%{http_code}" "$@"; }
curl -s --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null $B/algo
R=$RANDOM
signup() { curl -s -c $D/$1 -H "$O" -H "$J" -X POST $B/signup -d "{\"email\":\"$2\",\"password\":\"long-password-123\",\"name\":\"$1\"}" -o /dev/null -w "%{http_code}"; }
signup owner owner@test.local >/dev/null; curl -s -c $D/owner -H "$O" -H "$J" -X POST $B/signin -d '{"email":"owner@test.local","password":"long-password-123"}' -o /dev/null
echo "admin signup: $(signup admin admin$R@test.local)"
echo "guest signup: $(signup guest guest$R@test.local)"

check "public algo is version 1" "$(curl -s $B/algo | grep -o '"version":[0-9]*' | head -1)" '"version":1'
check "no sign-in -> 401 on state" "$(code $B/hq/state)" 401
check "guest -> 403 on state" "$(code -b $D/guest $B/hq/state)" 403
check "guest -> 403 on propose" "$(code -b $D/guest -H "$O" -H "$J" -X POST $B/hq/proposals -d '{"kind":"note","title":"x"}')" 403
check "guest -> 403 on stats" "$(code -b $D/guest $B/hq/stats)" 403
check "owner role from OWNER_EMAILS" "$(curl -s -b $D/owner $B/hq/me | grep -o '"role":"[a-z]*"')" '"role":"owner"'
check "owner adds admin" "$(code -b $D/owner -H "$O" -H "$J" -X POST $B/hq/team -d '{"email":"admin'$R'@test.local","role":"admin"}')" 200
check "admin can see state" "$(code -b $D/admin $B/hq/state)" 200
check "admin can't add team" "$(code -b $D/admin -H "$O" -H "$J" -X POST $B/hq/team -d '{"email":"guest'$R'@test.local"}')" 403
check "bad setting rejected" "$(code -b $D/admin -H "$O" -H "$J" -X POST $B/hq/proposals -d '{"kind":"algo","title":"t","change":[{"path":"fit.nope","to":2}]}')" 400
check "divide-by-zero rejected" "$(code -b $D/admin -H "$O" -H "$J" -X POST $B/hq/proposals -d '{"kind":"algo","title":"t","change":[{"path":"fit.minutesPerPoint","to":0}]}')" 400
check "admin proposes" "$(code -b $D/admin -H "$O" -H "$J" -X POST $B/hq/proposals -d '{"kind":"algo","title":"Friends count more","why":"People go when friends go","change":[{"path":"fit.friends","to":3}]}')" 201
PID=$(grep -o '"id":"[^"]*","kind":"algo"' $D/out | head -1 | cut -d'"' -f4)
check "admin can't approve" "$(code -b $D/admin -H "$O" -H "$J" -X POST $B/hq/proposals/$PID/approve -d '{}')" 403
check "still version 1 before approval" "$(curl -s $B/algo | grep -o '"friends":[0-9]*')" '"friends":2'
check "owner approves" "$(code -b $D/owner -H "$O" -H "$J" -X POST $B/hq/proposals/$PID/approve -d '{"note":"yes"}')" 200
check "live is new version" "$(curl -s -H 'cache-control: no-cache' $B/algo | grep -o '"friends":[0-9]*')" '"friends":3'
check "approve twice -> 409" "$(code -b $D/owner -H "$O" -H "$J" -X POST $B/hq/proposals/$PID/approve -d '{}')" 409
check "owner restores v1" "$(code -b $D/owner -H "$O" -H "$J" -X POST $B/hq/algo/1/restore -d '{}')" 200
check "live back to friends 2" "$(curl -s $B/algo | grep -o '"friends":[0-9]*')" '"friends":2'
check "note proposal" "$(code -b $D/admin -H "$O" -H "$J" -X POST $B/hq/proposals -d '{"kind":"note","title":"Say crew, not group","why":"Users said so"}')" 201
NID=$(grep -o '"id":"[^"]*","kind":"note"' $D/out | head -1 | cut -d'"' -f4)
check "owner declines note" "$(code -b $D/owner -H "$O" -H "$J" -X POST $B/hq/proposals/$NID/decline -d '{"note":"not now"}')" 200
check "stats for admin" "$(code -b $D/admin $B/hq/stats)" 200
check "wrong origin blocked" "$(code -b $D/owner -H 'Origin: https://evil.example' -H "$J" -X POST $B/hq/proposals -d '{}')" 403
echo "passed $pass, failed $fail"
