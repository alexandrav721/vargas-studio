#!/bin/sh
# Publish AI Made EZ on its own address, https://ai-made-ez.pages.dev
# Copies the built site (run `npm run build` first), makes the home page open AI Made EZ,
# adds short links, and deploys to the Cloudflare Pages project "ai-made-ez".
set -e
cd "$(dirname "$0")/.."
OUT=.ai-made-ez-dist
rm -rf "$OUT" && mkdir "$OUT"
cp -R dist/. "$OUT"/
cat > "$OUT/index.html" <<'HTML'
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI Made EZ: free AI lessons in plain words</title>
<meta name="description" content="Free AI lessons, templates and tool reviews in plain words. No sign-up.">
<meta http-equiv="refresh" content="0;url=/projects/skill-quest/start/">
<link rel="canonical" href="/projects/skill-quest/start/">
<script>location.replace("/projects/skill-quest/start/" + location.search + location.hash);</script>
</head><body style="font:18px system-ui;padding:40px 18px;background:#FBFAF7;color:#151411">
<p><a href="/projects/skill-quest/start/" style="color:#C7391F;font-weight:700">Open AI Made EZ →</a></p></body></html>
HTML
cat >> "$OUT/_redirects" <<'R'
/start      /projects/skill-quest/start/        302
/lessons    /projects/skill-quest/school/       302
/templates  /projects/skill-quest/cheat-sheets/ 302
/planner    /projects/skill-quest/build-kit/    302
/tools      /projects/skill-quest/tools/        302
/news       /projects/skill-quest/keep-up/      302
/keep-up    /projects/skill-quest/keep-up/      302
/words      /projects/skill-quest/school/kitchen/glossary.html 302
/about      /projects/skill-quest/about/        302
R
~/Claude/celebrateloop-site/node_modules/.bin/wrangler pages deploy "$OUT" --project-name ai-made-ez --branch main --commit-dirty=true
