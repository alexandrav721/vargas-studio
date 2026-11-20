/**
 * Scrollback — researched millennial nostalgia catalog
 * Generation: Millennials (born ~1981–1996)
 * Formative window modeled as ages ~12–22 → peak cultural years ~1993–2018,
 * focused here on the densest shared nostalgia band: 1995–2012.
 *
 * Sources informing this catalog (non-exhaustive):
 * - boyd & Ellison, "Social Network Sites" (JCMC, 2007)
 * - New Yorker, "Coming of Age at the Dawn of the Social Internet"
 * - CARI aesthetics (Y2K Futurism / McBling / related)
 * - Wikipedia / primary launch timelines (AIM 1997, LiveJournal 1999, MySpace 2003,
 *   Razr 2004, iPod 2001, Silly Bandz craze 2010–11, Tamagotchi 1996)
 * - Owl & Twig Vintage 2000s object chronology
 * - Frutiger Aero / Web 2.0 gloss historiography (CARI / aesthetics wiki)
 */

export const GENERATION = {
  id: "millennial",
  label: "Millennials",
  birthStart: 1981,
  birthEnd: 1996,
  blurb:
    "Born into the last analog childhood and the first always-online adolescence. Dial-up beep to iPhone glow.",
};

/** Peak cultural eras users can scrub into */
export const ERAS = [
  {
    id: "dialup",
    label: "Dial-up Dawn",
    years: [1995, 1999],
    subtitle: "Modem songs, personal homepages, and the buddy list",
    styleName: "Early Web / Pre-Y2K Chaos",
  },
  {
    id: "y2k",
    label: "Y2K Horizon",
    years: [2000, 2003],
    subtitle: "Chrome futures, translucent plastics, and first broadband",
    styleName: "Y2K Futurism",
  },
  {
    id: "myspace",
    label: "Profile Peak",
    years: [2004, 2007],
    subtitle: "Top 8 politics, glitter cursors, and flip-phone glam",
    styleName: "McBling × Web 2.0 Gloss",
  },
  {
    id: "tumblr",
    label: "Feed Years",
    years: [2008, 2012],
    subtitle: "Pocket internet, reblogs, and the end of the old web",
    styleName: "Indie Sleaze → Early Flat",
  },
];

/**
 * Map birth year → suggested formative years (approx. ages 14–20)
 * Clamped to the researched catalog window 1995–2012.
 */
export function formativeRange(birthYear) {
  const start = Math.max(1995, birthYear + 14);
  const end = Math.min(2012, birthYear + 20);
  return [start, Math.max(start, end)];
}

export function erasForYears(yearStart, yearEnd) {
  return ERAS.filter((era) => {
    const [s, e] = era.years;
    return s <= yearEnd && e >= yearStart;
  });
}

export function primaryEra(yearStart, yearEnd) {
  const mid = Math.round((yearStart + yearEnd) / 2);
  return (
    ERAS.find((era) => mid >= era.years[0] && mid <= era.years[1]) || ERAS[1]
  );
}

// Website + item catalogs live in src/data/catalog.json (compiled from deep research).

export const STYLES = {
  dialup: {
    name: "Late-90s Cyber / Proto-Y2K",
    years: "1995–1999",
    summary:
      "Dot-com bubble chrome before Aqua went mainstream: Win95/98 bevels, GeoCities GIF chaos, rave neon, and CRT dark grounds. Fashion still carried butterfly clips, frosted tips, and boy-band gloss—not yet McBling rhinestones.",
    palette: ["#0A0A0A", "#B8FF00", "#0066FF", "#C0C5CE", "#FF00AA"],
    typography: [
      "Impact / Arial Black banner headlines",
      "Comic Sans on personal/kid pages",
      "Times / Verdana system defaults",
      "Bank Gothic / Eurostile Extended on tech & rave print",
    ],
    motifs: [
      "Under Construction GIFs + visitor counters",
      "Tiled starfield / brick backgrounds",
      "Beveled gray Windows buttons",
      "Flash splash + Skip Intro",
      "Early liquid-metal logos & lens flares",
    ],
    fashion: [
      "Butterfly clips, chokers, frosted tips",
      "JNCO / cargo / windbreakers",
      "Spice Girls / Britney schoolgirl-pop shine",
      "Late-’99 Matrix-adjacent black leather theatrical looks",
    ],
    tokens: [
      "2px outset bevel buttons on #d4d0c8",
      "Starfield void + neon accent",
      "Chrome silver wordmark gradients",
      "GIF-tile repeating surfaces",
      "Hit-counter LED monospace strip",
    ],
    musicVisual:
      "TRL packaging gloss, Spice Girls / *NSYNC jewel cases, Prodigy rave flyers, Matrix green-code cyber.",
    pairings: {
      websites: ["GeoCities", "ICQ"],
      items: ["Tamagotchi", "Mix CDs / CD binders"],
    },
  },
  y2k: {
    name: "Peak Y2K Chrome / Aqua",
    years: "2000–2003",
    summary:
      "Millennium futurism distinct from later McBling: Bondi translucent plastics, Mac OS X Aqua gel, XP Luna chrome, orbs and blobs. Synthetic ice-blue optimism—not nature-sky Frutiger Aero and not rhinestone lifestyle UI yet.",
    palette: ["#1E90C6", "#7FDBFF", "#D9DEE7", "#FF69B4", "#FFFFFF"],
    typography: [
      "Eurostile / Microgramma / Bank Gothic e-business logos",
      "Chrome-bevelled italic display wordmarks",
      "Myriad / Lucida Grande (Mac OS X humanist clean)",
      "XP Tahoma / Franklin Gothic in Luna chrome",
    ],
    motifs: [
      "Aqua gel pills + traffic-light window chrome",
      "Orb / blobject navigation",
      "Translucent candy plastic metaphors",
      "Lens flares on Flash ads",
      "iPod white silhouette industrial design",
    ],
    fashion: [
      "Metallic fabrics, jelly shoes, tiny shades",
      "Low-rise beginnings + gloss lips",
      "Britney / Destiny’s Child shine stagewear",
      "Early Paris Hilton trucker-hat transition (~2002–03)",
    ],
    tokens: [
      "Aqua gel CTA with top specular highlight",
      "Frosted translucent panels",
      "Silver→cyan chrome gradients",
      "Circular orb nav with radial gloss",
      "XP Luna titlebar blue gradient cue",
    ],
    musicVisual:
      "Missy Elliott futurist costumes, Britney/*NSYNC video gloss, early Apple silhouette iPod ads, Matrix Reloaded chrome hangover.",
    pairings: {
      websites: ["Neopets", "Homestar Runner"],
      items: ["Nokia 3310", "Windows XP “Bliss” wallpaper"],
    },
  },
  myspace: {
    name: "McBling × Web 2.0 Gloss",
    years: "2004–2007",
    summary:
      "Two parallel systems: McBling’s juicy-pink rhinestone maximalism (Paris, Juicy, Von Dutch) and corporate Web 2.0 gloss / early Frutiger Aero (reflections, sky-water glass). MySpace mashed both into glitter HTML.",
    palette: ["#FF1493", "#FFD700", "#111111", "#F5F0E6", "#6600CC"],
    typography: [
      "Flourishy scripts + outlined glitter captions",
      "Blackletter-with-grunge (Ed Hardy adjacent)",
      "Lucida / Helvetica Rounded on glossy Web 2.0 sites",
      "MySpace custom CSS font chaos",
    ],
    motifs: [
      "Rhinestones, hearts, Blingee stamps, sparkle cursors",
      "Web 2.0 download-button reflections",
      "Early Aero glass / aurora stock",
      "Autoplay profile song players",
      "Zebra / leopard print accents",
    ],
    fashion: [
      "Juicy velour + Von Dutch trucker hats",
      "Bedazzled flip phones & oversized shades",
      "Low-rise, Hollister/A&F cologne-cloud mall look",
      "Mean Girls / Simple Life plastic-pink hierarchy",
    ],
    tokens: [
      "Hot pink + pavé gold metallics",
      "Gloss blue download buttons with specular bar",
      "Glitter particle overlays",
      "MySpace purple module headers",
      "Aero-glass translucent panels",
    ],
    musicVisual:
      "Gwen Stefani Harajuku crossover, High School Musical saturation, MySpace emo/scene parallel, Perez Hilton tabloid pink.",
    pairings: {
      websites: ["MySpace", "YTMND"],
      items: ["Motorola RAZR V3", "Webkinz plush + adoption code"],
    },
  },
  tumblr: {
    name: "Indie Sleaze → Early Tumblr Soft-Grunge",
    years: "2008–2012",
    summary:
      "Anti-McBling rawness: Cobrasnake flash photography, American Apparel, thrift, then Tumblr pale/soft-grunge collage. Late skeuomorphism peaks on phones while Metro/early flat appears at the band’s edge.",
    palette: ["#0D0D0D", "#FF2D95", "#C8FF00", "#C4A4A4", "#C4A035"],
    typography: [
      "Bloghaus condensed neon all-caps",
      "Helvetica/Arial ironic-clean blogs",
      "Thin Tumblr captions + collaged serifs",
      "Metro/Segoe-like tile type at 2012 edge",
    ],
    motifs: [
      "Harsh on-camera flash + film grain",
      "Polaroid / Instax white frames",
      "GIF sets, reblog chains, Ask boxes",
      "iOS linen/leather skeuomorphism fading",
      "Windows 8 Metro flat tiles arriving",
    ],
    fashion: [
      "American Apparel + thrift mashups",
      "Skinny jeans, deep V, shutter shades, kohl",
      "Alexa Chung / Sky Ferreira It-girl thrift",
      "2010–12 soft grunge: chokers, fishnets, pastel blogs",
    ],
    tokens: [
      "Flash vignette + contrast bump",
      "Neon #FF2D95 on near-black blocks",
      "Dusty-rose Tumblr soft panels",
      "Polaroid stack with slight rotate",
      "4–8% grain overlay; flat metro tiles",
    ],
    musicVisual:
      "Bloghaus neon (Justice/Digitalism), Strokes hangover cool, Lana→Tumblr sadcore, Cobrasnake party docs, early Instagram filters.",
    pairings: {
      websites: ["Tumblr", "Formspring"],
      items: ["Silly Bandz", "Early App Store iPhones (3G / 3GS / 4)"],
    },
  },
};

export const RESEARCH_NOTES = [
  {
    title: "Generation window",
    body: "Millennials commonly dated ~1981–1996 (Pew). Formative digital years cluster later than birth years—so Scrollback maps birth year → roughly ages 14–20 within 1995–2012.",
  },
  {
    title: "Websites as places",
    body: "Scholarship (boyd & Ellison, JCMC 2007) and first-person histories (New Yorker on AIM → LiveJournal → MySpace) treat early SNSes as hangouts with norms—not just tools.",
  },
  {
    title: "Style ≠ one 'Y2K'",
    body: "CARI separates Y2K Futurism (chrome/translucent optimism) from McBling (~2000–08 rhinestone maximalism) and Frutiger Aero (glossy eco-tech UI). Indie sleaze (~2006–12) answers McBling with thrift + flash photography. Each style board lists pairing sites/objects that embodied that lane.",
  },
  {
    title: "Object dates matter",
    body: "Launch ≠ cultural peak. Silly Bandz sold late 2008 but craze peaked 2010–11; Razr launched 2004 and dominated US sales 2005–07; Tamagotchi 1996 with a 2004 Connection revival; Webkinz April 2005; YTMND community peak mid-2000s; iPod announced Oct 2001.",
  },
];
