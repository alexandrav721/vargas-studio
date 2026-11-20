
(()=>{
  const signalInput=document.getElementById("signal");
  document.querySelectorAll(".chip-btn[data-signal]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".chip-btn[data-signal]").forEach(b=>b.setAttribute("aria-pressed","false"));
      btn.setAttribute("aria-pressed","true");
      if(signalInput) signalInput.value=btn.dataset.signal||"Both";
    });
  });
  const URL="https://taodxvqcgszqkqhtwkqt.supabase.co/rest/v1/waitlist";
  const KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhb2R4dnFjZ3N6cWtxaHR3a3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NjE2MTYsImV4cCI6MjA5MzIzNzYxNn0.TLLLq6foAADXfNdSOYwj_PUQbdgrVxSJ4EjduUhG0Gw";
  const form=document.getElementById("waitlist-form");
  const msg=document.getElementById("waitlist-msg");
  const say=(t,k)=>{if(!msg)return;msg.textContent=t;msg.className="msg"+(k?" "+k:"")};
  form?.addEventListener("submit",async e=>{
    e.preventDefault();
    const email=form.email.value.trim();
    const signal=form.signal.value||"Both";
    if(form.company?.value){say("You’re in — invite a friend when you’re ready.","ok");form.reset();return}
    if(!/^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(email)){say("That email doesn’t look quite right.","bad");return}
    const btn=form.querySelector('button[type="submit"]');
    if(btn) btn.disabled=true; say("One moment…");
    try{
      const r=await fetch(URL,{method:"POST",headers:{"Content-Type":"application/json",apikey:KEY,Authorization:"Bearer "+KEY,Prefer:"return=minimal"},body:JSON.stringify({email,source:["loop-friends-studio",`signal:${signal}`].join("|")})});
      if(r.ok||r.status===409){say("You’re in. Invite the friends you’d actually Loop with.","ok");form.reset()}
      else say("Something hiccuped. Email hello@celebrateloop.com.","bad");
    }catch{say("Network blip. Try again.","bad")}
    finally{if(btn) btn.disabled=false}
  });
})();
