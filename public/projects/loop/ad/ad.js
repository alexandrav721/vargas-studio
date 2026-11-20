(() => {
  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // Signal chips
  const signalInput = document.getElementById("signal");
  document.querySelectorAll(".chip-btn[data-signal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".chip-btn[data-signal]").forEach((b) => {
        b.setAttribute("aria-pressed", "false");
      });
      btn.setAttribute("aria-pressed", "true");
      if (signalInput) signalInput.value = btn.dataset.signal || "Both";
    });
  });

  // UTM capture for source attribution
  const params = new URLSearchParams(location.search);
  const utmBits = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
    .map((k) => {
      const v = params.get(k);
      return v ? `${k}:${v}` : null;
    })
    .filter(Boolean);

  // Waitlist → same live Supabase project as celebrateloop.com
  // Anon key is public by design; RLS allows INSERT only (see waitlist.sql).
  const URL = "https://taodxvqcgszqkqhtwkqt.supabase.co/rest/v1/waitlist";
  const KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhb2R4dnFjZ3N6cWtxaHR3a3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NjE2MTYsImV4cCI6MjA5MzIzNzYxNn0.TLLLq6foAADXfNdSOYwj_PUQbdgrVxSJ4EjduUhG0Gw";

  const form = document.getElementById("waitlist-form");
  const msg = document.getElementById("waitlist-msg");
  const say = (text, kind) => {
    if (!msg) return;
    msg.textContent = text;
    msg.className = "msg" + (kind ? " " + kind : "");
  };

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = /** @type {HTMLInputElement} */ (form.email).value.trim();
    const signal = /** @type {HTMLInputElement} */ (form.signal).value || "Both";
    const company = /** @type {HTMLInputElement} */ (form.company).value;

    if (company) {
      say("You’re in — invite a friend when you’re ready.", "ok");
      form.reset();
      return;
    }
    if (!/^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(email)) {
      say("That email doesn’t look quite right.", "bad");
      form.email.focus();
      return;
    }

    const source = ["meta_ad", `signal:${signal}`, ...utmBits].join("|");

    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    say("One moment…");

    try {
      const r = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: KEY,
          Authorization: "Bearer " + KEY,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ email, source }),
      });
      // 201 created · 409 unique email → treat as success (no disclosure)
      if (r.ok || r.status === 409) {
        say("You’re in. Invite the friends you’d actually Loop with.", "ok");
        form.reset();
        if (signalInput) signalInput.value = "Both";
        document.querySelectorAll(".chip-btn[data-signal]").forEach((b) => {
          b.setAttribute("aria-pressed", b.dataset.signal === "Both" ? "true" : "false");
        });
      } else {
        say("Something hiccuped. Email hello@celebrateloop.com and we’ll add you.", "bad");
      }
    } catch {
      say("Network blip. Try again, or email hello@celebrateloop.com.", "bad");
    } finally {
      if (btn) btn.disabled = false;
    }
  });
})();
