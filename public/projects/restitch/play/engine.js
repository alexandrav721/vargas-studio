/* Generated from src/flip-engine.ts with esbuild for the static front door (play.html). Do not edit by hand: rebuild with: npx esbuild src/flip-engine.ts --bundle --format=iife --global-name=RestitchEngine --target=es2019 --outfile=public/projects/restitch/play/engine.js */
"use strict";
var RestitchEngine = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/flip-engine.ts
  var flip_engine_exports = {};
  __export(flip_engine_exports, {
    CLOSET_KEY: () => CLOSET_KEY,
    EMPTY_MEASUREMENTS: () => EMPTY_MEASUREMENTS,
    MEASURE_FIELDS: () => MEASURE_FIELDS,
    MEASURE_KEY: () => MEASURE_KEY,
    RECIPES: () => RECIPES,
    analyzeOntoCanvas: () => analyzeOntoCanvas,
    describeGarment: () => describeGarment,
    familyOf: () => familyOf,
    hueBand: () => hueBand,
    loadCloset: () => loadCloset,
    loadMeasurements: () => loadMeasurements,
    paintDataUrl: () => paintDataUrl,
    recipesFor: () => recipesFor,
    saveCloset: () => saveCloset,
    saveMeasurements: () => saveMeasurements,
    statsFromPixels: () => statsFromPixels,
    stepsFor: () => stepsFor
  });
  var EMPTY_MEASUREMENTS = {
    bust: "",
    waist: "",
    hip: "",
    shoulder: "",
    backWaist: "",
    height: ""
  };
  var MEASURE_FIELDS = [
    { id: "bust", label: "Full bust" },
    { id: "waist", label: "Waist" },
    { id: "hip", label: "Hip" },
    { id: "shoulder", label: "Shoulder to shoulder" },
    { id: "backWaist", label: "Back waist length" },
    { id: "height", label: "Height" }
  ];
  var MEASURE_KEY = "restitch.measurements.v1";
  var CLOSET_KEY = "restitch.closet.v1";
  var hem = "https://en.wikipedia.org/wiki/Hem_(sewing)";
  var running = "https://en.wikipedia.org/wiki/Running_stitch";
  var backstitch = "https://en.wikipedia.org/wiki/Backstitch";
  var blind = "https://en.wikipedia.org/wiki/Blind_stitch";
  var whip = "https://en.wikipedia.org/wiki/Whipstitch";
  var french = "https://en.wikipedia.org/wiki/French_seam";
  var dart = "https://en.wikipedia.org/wiki/Dart_(sewing)";
  var sashiko = "https://en.wikipedia.org/wiki/Sashiko";
  var pleat = "https://en.wikipedia.org/wiki/Pleat";
  var seam = "https://en.wikipedia.org/wiki/Seam_(sewing)";
  var bartack = "https://en.wikipedia.org/wiki/Bar_tack";
  function clothChecklist(extra) {
    return [
      ...extra,
      {
        label: "The edge you will change, measured on the cloth with your tape"
      }
    ];
  }
  var RECIPES = [
    {
      id: "wide-cool-snaps",
      title: "Snap-roll the cuffs of a wide cool cloth",
      method: "no-sew",
      difficulty: "beginner",
      skills: ["beginner"],
      families: ["wide-layer"],
      hues: ["cool"],
      notions: ["Four sew-on snaps or snap tape you can clamp", "A safety pin for the trial"],
      checklist: clothChecklist([
        { label: "Wrist or ankle, wherever the roll will sit", measureId: "waist" },
        { label: "Shoulder width, so the roll does not pull the neck", measureId: "shoulder" }
      ]),
      steps: {
        beginner: [
          {
            text: "Roll each short end twice so the raw edge is hidden. Finger-press the roll."
          },
          {
            text: "Wrap one rolled end where it feels snug. Your typed waist is a reminder of your tape, not a cut length from the photo."
          },
          {
            text: "Clamp a snap at the overlap. Tug. Add a second snap if the cloth is heavy. No stitch yet.",
            href: seam,
            linkLabel: "What a seam is, when you are ready to stitch"
          }
        ]
      }
    },
    {
      id: "wide-warm-knot",
      title: "Knot a warm-cloth sash from the long ends",
      method: "no-sew",
      difficulty: "beginner",
      skills: ["beginner"],
      families: ["wide-layer"],
      hues: ["warm", "neutral", "green"],
      notions: ["Nothing, or one safety pin if the knot slips"],
      checklist: clothChecklist([
        { label: "Waist, where you want the knot", measureId: "waist" },
        { label: "Hip, if the sash will sit lower", measureId: "hip" }
      ]),
      steps: {
        beginner: [
          {
            text: "Fold the cloth in half along its length. The fold is the top of the sash."
          },
          {
            text: "Stand in front of a mirror and tie the ends where your body wants them. Do not cut to a centimeter you did not tape."
          },
          {
            text: "If the knot crawls, pin through the knot once, then decide later whether it deserves a stitch."
          }
        ]
      }
    },
    {
      id: "wide-fringe-hand",
      title: "Hand-fringe a short edge",
      method: "hand",
      difficulty: "beginner",
      skills: ["beginner", "intermediate"],
      families: ["wide-layer"],
      hues: ["any"],
      notions: ["Hand needle", "All-purpose thread", "A comb or blunt pin to pull threads"],
      checklist: clothChecklist([
        { label: "How far onto your body the fringe may fall", measureId: "height" }
      ]),
      steps: {
        beginner: [
          {
            text: "Choose the short edge that can lose a few threads. Mark that choice with a pin, not a guessed number."
          },
          {
            text: "Pull one thread at a time until you like the fringe. Stop while the cloth still feels sound.",
            href: whip,
            linkLabel: "Whipstitch, if you want to lock the last thread"
          },
          {
            text: "Shake it. If threads run too far, take two whipstitches across the top of the fringe."
          }
        ],
        intermediate: [
          {
            text: "Stay the fringe line with a short running stitch before you pull threads, so the cloth has a stop.",
            href: running,
            linkLabel: "Running stitch"
          },
          {
            text: "Pull weft threads up to that stitch. Keep the fringe depth even by eye, then check it with a tape on the cloth."
          },
          {
            text: "Whip the stay line. Press the fringe with a cloth between the iron and the threads."
          }
        ]
      }
    },
    {
      id: "wide-channel",
      title: "Stitch a tie channel on the long edge",
      method: "machine",
      difficulty: "intermediate",
      skills: ["intermediate"],
      families: ["wide-layer"],
      hues: ["any"],
      notions: ["Machine thread", "A cord or spare strip longer than the edge", "Safety pin"],
      checklist: clothChecklist([
        { label: "Waist the channel must pass", measureId: "waist" },
        { label: "Hip, if you will step into it", measureId: "hip" }
      ]),
      steps: {
        intermediate: [
          {
            text: "Fold the long edge over a finger-width, then again. Press. The fold size is your choice on this cloth, not a readout from the picture.",
            href: hem,
            linkLabel: "How a hem fold is built"
          },
          {
            text: "Stitch the inner fold, leaving both ends open. Backstitch the start and the stop.",
            href: backstitch,
            linkLabel: "Backstitch"
          },
          {
            text: "Feed the tie through with a safety pin. Cinch to the waist you typed, then knot the tie. Try it on before you cut the tie ends."
          }
        ]
      }
    },
    {
      id: "wide-bartack",
      title: "Bar-tack the points that take the pull",
      method: "hand",
      difficulty: "intermediate",
      skills: ["intermediate"],
      families: ["wide-layer"],
      hues: ["cool", "neutral"],
      notions: ["Heavy thread or topstitch thread", "Hand needle", "Thimble"],
      checklist: clothChecklist([
        { label: "Shoulder, if a strap crosses it", measureId: "shoulder" },
        { label: "Waist, if the tack sits at a tie", measureId: "waist" }
      ]),
      steps: {
        intermediate: [
          {
            text: "Put the piece on and pinch the spot that strains. Mark it with a pin while you are wearing it."
          },
          {
            text: "Work a dense bar of stitches across that spot, about as wide as the strain, which you measure on the cloth.",
            href: bartack,
            linkLabel: "Bar tack"
          },
          {
            text: "Wear it again. Add a second bar only where the first one still gaps."
          }
        ]
      }
    },
    {
      id: "wide-peplum",
      title: "Box-pleat one end into a peplum",
      method: "machine",
      difficulty: "advanced",
      skills: ["advanced"],
      families: ["wide-layer"],
      hues: ["any"],
      notions: ["Machine thread", "Pins", "Iron"],
      checklist: clothChecklist([
        { label: "Waist the pleated edge must meet", measureId: "waist" },
        { label: "Hip underneath the peplum", measureId: "hip" },
        { label: "Back waist length, so the peplum starts at your waist", measureId: "backWaist" }
      ]),
      steps: {
        advanced: [
          {
            text: "Tape the edge that will sit at your waist. Write that cloth measurement down. Compare it with the waist you typed. The difference is the amount to pleat away."
          },
          {
            text: "Divide that extra into even box pleats. Mark the folds on the cloth. Do not lift pleat depth off the photo.",
            href: pleat,
            linkLabel: "Box and knife pleats"
          },
          {
            text: "Stitch across the top of the pleats in the direction they lie. Press. Baste the peplum to a waist stay only after you have tried it over the hip you typed.",
            href: seam,
            linkLabel: "Seam"
          }
        ]
      }
    },
    {
      id: "wide-hand-roll",
      title: "Pick a rolled hem along the long edge",
      method: "hand",
      difficulty: "advanced",
      skills: ["advanced"],
      families: ["wide-layer"],
      hues: ["any"],
      notions: ["Fine needle", "Silk or polyester thread", "Iron"],
      checklist: clothChecklist([
        { label: "Height, as a sense of where the edge lands", measureId: "height" }
      ]),
      steps: {
        advanced: [
          {
            text: "Roll the edge between damp fingers until the raw thread disappears. Press the roll.",
            href: hem,
            linkLabel: "Hem"
          },
          {
            text: "Pick the roll with a fine slipstitch, catching a thread of the body and a thread of the roll. Keep the stitch off the right side.",
            href: blind,
            linkLabel: "Blind stitch"
          },
          {
            text: "Press from the wrong side. If the roll buckles, you took too deep a bite \u2014 pick that span out and redo it."
          }
        ]
      }
    },
    {
      id: "column-warm-tie",
      title: "Tie the shoulders and keep the column",
      method: "no-sew",
      difficulty: "beginner",
      skills: ["beginner"],
      families: ["column"],
      hues: ["warm", "neutral", "green"],
      notions: ["Two safety pins", "Optional ribbon if the cloth edge is too thick to knot"],
      checklist: clothChecklist([
        { label: "Shoulder to shoulder", measureId: "shoulder" },
        { label: "Full bust, so the ties do not gap", measureId: "bust" },
        { label: "Back waist length", measureId: "backWaist" }
      ]),
      steps: {
        beginner: [
          {
            text: "Hold the top corners at your shoulders. If they overlap your shoulder points, those overlaps are the ties."
          },
          {
            text: "Knot or pin each shoulder. Look at the bust you typed only as a check that the front still closes. The photo does not know that number."
          },
          {
            text: "Walk. If a tie drifts, add a pin under the knot."
          }
        ]
      }
    },
    {
      id: "column-cool-drape",
      title: "Pin a one-shoulder drape on cool cloth",
      method: "no-sew",
      difficulty: "beginner",
      skills: ["beginner"],
      families: ["column"],
      hues: ["cool"],
      notions: ["A brooch or two safety pins"],
      checklist: clothChecklist([
        { label: "Shoulder that will carry the pin", measureId: "shoulder" },
        { label: "Full bust", measureId: "bust" }
      ]),
      steps: {
        beginner: [
          {
            text: "Drape the column over one shoulder. Let the rest fall straight."
          },
          {
            text: "Pin where the cloth crosses itself, above the bust. Check in a mirror that you can lift your arm."
          },
          {
            text: "Leave the hem alone until you have worn it. A pin is the whole flip for now."
          }
        ]
      }
    },
    {
      id: "column-blind-hem",
      title: "Shorten the column with a hand hem",
      method: "hand",
      difficulty: "beginner",
      skills: ["beginner", "intermediate"],
      families: ["column"],
      hues: ["any"],
      notions: ["Hand needle", "Matching thread", "Pins", "Iron"],
      checklist: clothChecklist([
        { label: "Height", measureId: "height" },
        { label: "Back waist length, so you can find the hem from your own waist", measureId: "backWaist" },
        { label: "Where you want the new hem on your leg \u2014 decide on your body" }
      ]),
      steps: {
        beginner: [
          {
            text: "Put the piece on. Fold the hem up until you like where it lands. Pin that fold while you are wearing it."
          },
          {
            text: "Take it off. Measure the fold on the cloth if you want a note for yourself. Do not copy a length out of the photo."
          },
          {
            text: "Sew the fold with a simple running stitch. Knot at each side seam.",
            href: running,
            linkLabel: "Running stitch"
          }
        ],
        intermediate: [
          {
            text: "Mark the hem on your body, then transfer that line to the cloth with pins. Measure the allowance you want and write it down from the tape."
          },
          {
            text: "Turn and press a double fold. Blind-stitch so the thread barely shows on the outside.",
            href: blind,
            linkLabel: "Blind stitch"
          },
          {
            text: "Press. Try it on over the height you typed and fix any dip before you call it done."
          }
        ]
      }
    },
    {
      id: "column-vent",
      title: "Open a walking vent in the column",
      method: "machine",
      difficulty: "intermediate",
      skills: ["intermediate"],
      families: ["column"],
      hues: ["any"],
      notions: ["Machine thread", "Seam ripper", "Iron"],
      checklist: clothChecklist([
        { label: "Hip, so the vent starts below the widest part", measureId: "hip" },
        { label: "Back waist length", measureId: "backWaist" },
        { label: "How far you need to walk \u2014 test in the piece" }
      ]),
      steps: {
        intermediate: [
          {
            text: "Put it on and mark where a step pulls. That mark is the top of the vent. Measure from the hem up to the mark on the cloth."
          },
          {
            text: "Rip the center or side only up to that mark. Press the opened edges flat.",
            href: seam,
            linkLabel: "Seam"
          },
          {
            text: "Stitch across the top of the vent to stop the rip, then hem the two opened edges.",
            href: hem,
            linkLabel: "Hem"
          }
        ]
      }
    },
    {
      id: "column-stay",
      title: "Set a waist stay into the column",
      method: "machine",
      difficulty: "advanced",
      skills: ["advanced"],
      families: ["column"],
      hues: ["any"],
      notions: ["Grossgrain or twill tape", "Machine thread", "Hook and bar"],
      checklist: clothChecklist([
        { label: "Waist", measureId: "waist" },
        { label: "Back waist length, to place the stay", measureId: "backWaist" },
        { label: "Full bust, so the stay does not ride up", measureId: "bust" }
      ]),
      steps: {
        advanced: [
          {
            text: "Cut the tape to the waist you typed, plus overlap for a hook. The photo cannot supply this length."
          },
          {
            text: "Pin the tape at the waist you find with your back-waist measurement, on the inside. Try it on. Move the tape until it sits."
          },
          {
            text: "Stitch the tape along both edges, stopping short of a closure. Sew the hook and bar by hand. The column hangs from the stay, not from the shoulders alone.",
            href: seam,
            linkLabel: "Seam"
          }
        ]
      }
    },
    {
      id: "column-pick-facing",
      title: "Pick a neckline facing back down by hand",
      method: "hand",
      difficulty: "advanced",
      skills: ["advanced"],
      families: ["column"],
      hues: ["any"],
      notions: ["Fine needle", "Thread", "A scrap for a new facing if the old one is tired"],
      checklist: clothChecklist([
        { label: "Shoulder to shoulder", measureId: "shoulder" },
        { label: "Full bust", measureId: "bust" }
      ]),
      steps: {
        advanced: [
          {
            text: "Turn the facing out and press the neckline edge. If the facing is shorter than the neck opening you measure on the cloth, cut a new one from scrap and seam it.",
            href: french,
            linkLabel: "French seam, for a clean facing join"
          },
          {
            text: "Understitch by hand: pick the facing to the seam allowance, not to the outside."
          },
          {
            text: "Tack the facing at the shoulders only. Check the bust you typed by trying it on \u2014 a tight neck is a fitting problem, not a number from the picture."
          }
        ]
      }
    },
    {
      id: "knit-warm-knot",
      title: "Knot the hem of a warm, light top",
      method: "no-sew",
      difficulty: "beginner",
      skills: ["beginner"],
      families: ["square-knit"],
      hues: ["warm", "green"],
      notions: ["None"],
      checklist: clothChecklist([
        { label: "Waist or the place you want the knot", measureId: "waist" },
        { label: "Full bust, so you leave enough cloth above the knot", measureId: "bust" }
      ]),
      steps: {
        beginner: [
          {
            text: "Put the top on. Gather the front hem in one hand."
          },
          {
            text: "Tie a single knot. It should sit where you pointed on your body, not at a length copied from the photo."
          },
          {
            text: "If the knot feels bulky, twist the cloth once before the knot instead of cutting."
          }
        ]
      }
    },
    {
      id: "knit-cool-flash",
      title: "Pin a shoulder flash on a cool top",
      method: "no-sew",
      difficulty: "beginner",
      skills: ["beginner"],
      families: ["square-knit"],
      hues: ["cool", "neutral"],
      notions: ["Safety pins", "A contrast scrap, optional"],
      checklist: clothChecklist([
        { label: "Shoulder to shoulder", measureId: "shoulder" }
      ]),
      steps: {
        beginner: [
          {
            text: "Fold a small scrap, or the hem of a sock you already mean to mend. Pin it at one shoulder."
          },
          {
            text: "Check both shoulders in a mirror. The flash is decoration. It does not change the fit."
          },
          {
            text: "When you like the place, leave the pins or replace them with a few hand stitches later."
          }
        ]
      }
    },
    {
      id: "knit-gather",
      title: "Gather the neck by hand",
      method: "hand",
      difficulty: "beginner",
      skills: ["beginner", "intermediate"],
      families: ["square-knit"],
      hues: ["any"],
      notions: ["Hand needle", "Strong thread", "A point turner or chopstick"],
      checklist: clothChecklist([
        { label: "Shoulder to shoulder", measureId: "shoulder" },
        { label: "Full bust", measureId: "bust" },
        { label: "The neckline as it sits on you now" }
      ]),
      steps: {
        beginner: [
          {
            text: "Thread a needle double. Weave a running stitch around the neckline, leaving a long tail.",
            href: running,
            linkLabel: "Running stitch"
          },
          {
            text: "Put it on and pull the thread until the neck sits where you want. Knot the tails."
          },
          {
            text: "Spread the gathers with your fingers. If it feels tight at the bust you typed, let the thread back out."
          }
        ],
        intermediate: [
          {
            text: "Sew two rows of running stitch inside the neckline, one a presser-foot width below the other.",
            href: running,
            linkLabel: "Running stitch"
          },
          {
            text: "Pull both threads up. Measure the finished neck opening on your body before you knot."
          },
          {
            text: "Stitch a narrow binding over the gathers if the edge will be worn against skin. Try it over the bust you typed."
          }
        ]
      }
    },
    {
      id: "knit-boat",
      title: "Open the neckline toward a boat neck",
      method: "machine",
      difficulty: "intermediate",
      skills: ["intermediate"],
      families: ["square-knit"],
      hues: ["any"],
      notions: ["Machine thread", "Bias strip or the cut-off neck scrap", "Iron"],
      checklist: clothChecklist([
        { label: "Shoulder to shoulder", measureId: "shoulder" },
        { label: "Full bust", measureId: "bust" },
        { label: "How wide a neck you want \u2014 mark it on your body first" }
      ]),
      steps: {
        intermediate: [
          {
            text: "Mark the new neckline with pins while the top is on you. Measure that curve on the cloth after you take it off."
          },
          {
            text: "Cut outside the mark, leaving a seam allowance you choose and write down. Bind the edge with bias.",
            href: "https://en.wikipedia.org/wiki/Bias_tape",
            linkLabel: "Bias tape"
          },
          {
            text: "Stitch the binding down. Try it on. The bust you typed tells you whether the opening gapes \u2014 the photo does not."
          }
        ]
      }
    },
    {
      id: "knit-dart",
      title: "Shape the shoulder with a dart",
      method: "machine",
      difficulty: "advanced",
      skills: ["advanced"],
      families: ["square-knit"],
      hues: ["any"],
      notions: ["Machine thread", "Tailor's chalk", "Iron"],
      checklist: clothChecklist([
        { label: "Shoulder to shoulder", measureId: "shoulder" },
        { label: "Full bust", measureId: "bust" },
        { label: "Back waist length", measureId: "backWaist" }
      ]),
      steps: {
        advanced: [
          {
            text: "Pinch out the extra at the shoulder while wearing the top. Mark both legs of the pinch. Measure the intake on the cloth.",
            href: dart,
            linkLabel: "Dart"
          },
          {
            text: "The intake is whatever you pinched, not a standard cup from the picture. Stitch from the wide end to a point. Press the dart toward the neck."
          },
          {
            text: "Compare the result with the bust and shoulder you typed. A second dart belongs only where the cloth still stands away from you."
          }
        ]
      }
    },
    {
      id: "knit-hand-stay",
      title: "Stay the shoulder seam by hand",
      method: "hand",
      difficulty: "advanced",
      skills: ["advanced"],
      families: ["square-knit"],
      hues: ["any"],
      notions: ["Tape", "Fine needle", "Thread"],
      checklist: clothChecklist([
        { label: "Shoulder to shoulder", measureId: "shoulder" }
      ]),
      steps: {
        advanced: [
          {
            text: "Cut tape to the shoulder length you measure on the cloth, then check it against the shoulder you typed."
          },
          {
            text: "Pick the tape along the inside of the shoulder seam so the seam cannot grow.",
            href: backstitch,
            linkLabel: "Backstitch"
          },
          {
            text: "Press. The tape does the work. The stitches only hold it."
          }
        ]
      }
    },
    {
      id: "dark-roll",
      title: "Roll the cuff and leave it unstitched",
      method: "no-sew",
      difficulty: "beginner",
      skills: ["beginner"],
      families: ["dark-structured"],
      hues: ["any"],
      notions: ["None, or sleeve garters if the roll will not stay"],
      checklist: clothChecklist([
        { label: "Where the cuff should meet your arm \u2014 decide on your body" },
        { label: "Shoulder, if the sleeve starts to pull", measureId: "shoulder" }
      ]),
      steps: {
        beginner: [
          {
            text: "Roll the sleeve twice. The dark cloth usually stays if the roll is wide enough to grip."
          },
          {
            text: "Stop when the roll clears your wrist as you bend it. No number from the photo."
          },
          {
            text: "If it drops, a garter or a later bartack is the upgrade. Today is the roll."
          }
        ]
      }
    },
    {
      id: "dark-sashiko",
      title: "Sashiko the thin spot",
      method: "hand",
      difficulty: "intermediate",
      skills: ["intermediate"],
      families: ["dark-structured"],
      hues: ["any"],
      notions: ["Sashiko or perle thread", "Long needle", "A hoop if you have one"],
      checklist: clothChecklist([
        { label: "The worn patch, measured on the cloth" },
        { label: "Hip or bust, wherever that patch sits", measureId: "hip" }
      ]),
      steps: {
        intermediate: [
          {
            text: "Outline the thin area with chalk on the cloth. Measure it so you know how much thread to cut. Add a margin you choose."
          },
          {
            text: "Run even stitches in rows across the patch. Keep the rows parallel by eye, then check with a tape.",
            href: sashiko,
            linkLabel: "Sashiko"
          },
          {
            text: "Tie off on the inside. The mend is the design."
          }
        ]
      }
    },
    {
      id: "dark-bartack-hand",
      title: "Hand-bar the pocket mouths",
      method: "hand",
      difficulty: "beginner",
      skills: ["beginner"],
      families: ["dark-structured"],
      hues: ["any"],
      notions: ["Heavy thread", "Needle", "Thimble"],
      checklist: clothChecklist([
        { label: "Hip, if the pocket sits there", measureId: "hip" }
      ]),
      steps: {
        beginner: [
          {
            text: "Find the corner of a pocket that is already pulling."
          },
          {
            text: "Sew a short stack of stitches across that corner. Knot on the inside.",
            href: bartack,
            linkLabel: "Bar tack"
          },
          {
            text: "Do the matching pocket even if it looks fine."
          }
        ]
      }
    },
    {
      id: "dark-nip",
      title: "Nip the waist of a boxy dark piece",
      method: "machine",
      difficulty: "advanced",
      skills: ["advanced"],
      families: ["dark-structured"],
      hues: ["any"],
      notions: ["Machine thread", "Chalk", "Iron", "Seam ripper"],
      checklist: clothChecklist([
        { label: "Waist", measureId: "waist" },
        { label: "Full bust, so you do not nip above the bust", measureId: "bust" },
        { label: "Hip", measureId: "hip" }
      ]),
      steps: {
        advanced: [
          {
            text: "Tape the garment flat at the waist and write that number down. Subtract the waist you typed. Half of the difference is what each side can give up, and only if the hip you typed still fits below."
          },
          {
            text: "Pinch that amount at each side seam while wearing it. If the cloth buckles at the bust, the nip is too high \u2014 move it."
          },
          {
            text: "Stitch the new side seam, press it open, and bartack the top and bottom of the nip so it cannot split.",
            href: french,
            linkLabel: "French seam, if the cloth frays"
          }
        ]
      }
    },
    {
      id: "dark-machine-hem",
      title: "Machine a new hem on the dark piece",
      method: "machine",
      difficulty: "intermediate",
      skills: ["intermediate"],
      families: ["dark-structured"],
      hues: ["any"],
      notions: ["Machine thread", "Iron"],
      checklist: clothChecklist([
        { label: "Height", measureId: "height" },
        { label: "Where the hem should stop \u2014 mark it on your body" }
      ]),
      steps: {
        intermediate: [
          {
            text: "Mark the hem in the mirror. Measure the turn-up on the cloth after you take it off."
          },
          {
            text: "Press a double fold. Topstitch from the wrong side if the cloth is thick, catching both layers.",
            href: hem,
            linkLabel: "Hem"
          },
          {
            text: "Try it with the height you typed in mind \u2014 you are checking the person, not the picture."
          }
        ]
      }
    },
    {
      id: "soft-belt",
      title: "Belt it and call that the flip",
      method: "no-sew",
      difficulty: "beginner",
      skills: ["beginner"],
      families: ["soft-mid"],
      hues: ["any"],
      notions: ["A belt you already own"],
      checklist: clothChecklist([
        { label: "Waist", measureId: "waist" },
        { label: "Hip, if the belt wants to sit lower", measureId: "hip" }
      ]),
      steps: {
        beginner: [
          {
            text: "Put the garment on and belt it at the waist you typed, or wherever the cloth looks calm."
          },
          {
            text: "Blouse the extra above the belt with your hands. Do not cut."
          },
          {
            text: "If you reach for scissors, stop and save the project first. The belt is a finished no-sew flip."
          }
        ]
      }
    },
    {
      id: "soft-side-hand",
      title: "Take the side seams in by hand",
      method: "hand",
      difficulty: "intermediate",
      skills: ["intermediate"],
      families: ["soft-mid"],
      hues: ["any"],
      notions: ["Needle", "Thread", "Pins"],
      checklist: clothChecklist([
        { label: "Waist", measureId: "waist" },
        { label: "Full bust", measureId: "bust" },
        { label: "Hip", measureId: "hip" }
      ]),
      steps: {
        intermediate: [
          {
            text: "Turn the garment inside out and put it on, or pin it on a body double you trust. Pinch each side until the waist you typed is close and the bust and hip you typed still fit."
          },
          {
            text: "Mark the pinches. Measure them on the cloth so both sides match."
          },
          {
            text: "Backstitch the new seam. Press. Wear it before you trim anything.",
            href: backstitch,
            linkLabel: "Backstitch"
          }
        ]
      }
    },
    {
      id: "soft-hem-machine",
      title: "Machine a clean hem and stop there",
      method: "machine",
      difficulty: "intermediate",
      skills: ["intermediate"],
      families: ["soft-mid"],
      hues: ["any"],
      notions: ["Machine thread", "Iron"],
      checklist: clothChecklist([
        { label: "Height", measureId: "height" },
        { label: "Back waist length", measureId: "backWaist" }
      ]),
      steps: {
        intermediate: [
          {
            text: "Decide the hem on your body. Pin, then measure the fold on the cloth."
          },
          {
            text: "Press a double hem and stitch it. Backstitch the join.",
            href: hem,
            linkLabel: "Hem"
          },
          {
            text: "That is the flip. A new silhouette can be a later project."
          }
        ]
      }
    },
    {
      id: "soft-gore",
      title: "Add a side gore so the hip fits",
      method: "machine",
      difficulty: "advanced",
      skills: ["advanced"],
      families: ["soft-mid"],
      hues: ["any"],
      notions: ["A matching or contrast scrap", "Machine thread", "Iron"],
      checklist: clothChecklist([
        { label: "Hip", measureId: "hip" },
        { label: "Waist", measureId: "waist" },
        { label: "The flat hip width of the garment, taped on the cloth" }
      ]),
      steps: {
        advanced: [
          {
            text: "Tape the garment's hip flat and double it. Compare with the hip you typed. The gap is what the gores must add. If you have not typed a hip, tape yourself before you cut the scrap."
          },
          {
            text: "Cut two triangles from scrap. The base of each triangle is half the gap, which you just measured, plus seam allowance you choose. This is not a photo measurement."
          },
          {
            text: "Open the side seams below the waist and sew a gore into each. Press. Check the waist you typed still closes.",
            href: seam,
            linkLabel: "Seam"
          }
        ]
      }
    },
    {
      id: "soft-pick-hem",
      title: "Pick the hem by hand",
      method: "hand",
      difficulty: "advanced",
      skills: ["advanced"],
      families: ["soft-mid"],
      hues: ["any"],
      notions: ["Fine needle", "Matching thread"],
      checklist: clothChecklist([
        { label: "Height", measureId: "height" }
      ]),
      steps: {
        advanced: [
          {
            text: "Fold the hem to a line you marked on your body. Press."
          },
          {
            text: "Blind-stitch. Catch one thread of the outside.",
            href: blind,
            linkLabel: "Blind stitch"
          },
          {
            text: "Press again. The stitch line should disappear at arm's length."
          }
        ]
      }
    }
  ];
  function rgbToHsl(r, g, b) {
    const R = r / 255;
    const G = g / 255;
    const B = b / 255;
    const max = Math.max(R, G, B);
    const min = Math.min(R, G, B);
    const lightness = (max + min) / 2;
    const delta = max - min;
    if (delta === 0) return { hue: 0, saturation: 0, lightness };
    const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    let hue = 0;
    if (max === R) hue = (G - B) / delta % 6;
    else if (max === G) hue = (B - R) / delta + 2;
    else hue = (R - G) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
    return { hue, saturation, lightness };
  }
  function luminance(r, g, b) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }
  function toHex(r, g, b) {
    const part = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
    return `#${part(r)}${part(g)}${part(b)}`;
  }
  function hueBand(hue, saturation) {
    if (saturation < 0.12) return "neutral";
    if (hue < 45 || hue >= 330) return "warm";
    if (hue < 170) return "green";
    return "cool";
  }
  function familyOf(stats) {
    if (stats.aspectUsed >= 1.28) return "wide-layer";
    if (stats.aspectUsed <= 0.82) return "column";
    if (stats.brightness < 0.36 && stats.saturation < 0.48) return "dark-structured";
    if (stats.saturation >= 0.28 || stats.brightness >= 0.68) return "square-knit";
    return "soft-mid";
  }
  function clothGuess(stats, hue) {
    if (stats.brightness < 0.32 && hue === "cool" && stats.saturation < 0.55) {
      return "Visual guess: denim or a dense cool twill. Brightness is low and the hue is cool. This is not a fiber test.";
    }
    if (stats.brightness < 0.34) {
      return "Visual guess: a heavy or dark cloth. The frame is dark. This is not a fiber test.";
    }
    if (stats.brightness > 0.72 && (hue === "warm" || hue === "neutral")) {
      return "Visual guess: washed cotton or linen. The frame is light and warm or neutral. This is not a fiber test.";
    }
    if (stats.saturation > 0.45) {
      return "Visual guess: a clearly dyed cloth. Saturation is high. This is not a print read and not a fiber test.";
    }
    return "Visual guess: a midweight woven or a stable knit. Nothing in the pixels proves the fiber.";
  }
  function describeGarment(stats) {
    const family = familyOf(stats);
    const hue = hueBand(stats.hue, stats.saturation);
    const silhouette = {
      "wide-layer": "a wide, short layer \u2014 something laid out as a sash, wrap, jacket, or cropped piece",
      column: "a long column \u2014 dress, duster, robe, or another full-length piece",
      "dark-structured": "a dark, boxy piece \u2014 jacket, heavy shirt, or vest",
      "square-knit": "a near-square top \u2014 tee, tank, or light blouse",
      "soft-mid": "an everyday piece with no strong wide or long cue"
    }[family];
    const aspectNote = stats.subjectAspect == null ? `file aspect ${stats.fileAspect.toFixed(2)}` : `subject box ${stats.subjectAspect.toFixed(2)} inside a file at ${stats.fileAspect.toFixed(2)}`;
    return {
      family,
      hue,
      silhouette,
      clothGuess: clothGuess(stats, hue),
      headline: `Reads as ${silhouette}.`,
      detail: `From this file: average ${stats.hex}, brightness ${Math.round(stats.brightness * 100)}%, ${aspectNote}. Hue band ${hue}. Frame average ${stats.frameHex}.`
    };
  }
  function recipesFor(stats, skill) {
    const family = familyOf(stats);
    const hue = hueBand(stats.hue, stats.saturation);
    const pool = RECIPES.filter((recipe) => recipe.families.includes(family));
    const score = (recipe) => {
      let value = 0;
      if (recipe.hues.includes(hue)) value += recipe.hues.includes("any") ? 4 : 12;
      else if (!recipe.hues.includes("any")) value -= 8;
      if (recipe.skills.includes(skill)) value += 8;
      if (recipe.difficulty === skill) value += 5;
      if (skill === "beginner" && recipe.difficulty === "advanced") value -= 3;
      return value;
    };
    const methods = skill === "beginner" ? ["no-sew", "hand", "machine"] : skill === "intermediate" ? ["hand", "machine", "no-sew"] : ["machine", "hand", "no-sew"];
    const picked = [];
    for (const method of methods) {
      const options = pool.filter((recipe) => recipe.method === method).sort((a, b) => score(b) - score(a) || a.id.localeCompare(b.id));
      if (options[0]) picked.push(options[0]);
    }
    return picked;
  }
  function stepForSkill(step, skill, writtenForSkill) {
    if (writtenForSkill) return step;
    if (skill === "beginner") {
      return {
        ...step,
        text: `Keep this simple. ${step.text} If the cloth fights you, stop and pin again.`
      };
    }
    if (skill === "advanced") {
      return {
        ...step,
        text: `${step.text} Press along the grain the cloth already has. Do not cut a new pattern piece to get there.`
      };
    }
    return { ...step, text: `Use the cloth that is already in the garment. ${step.text}` };
  }
  function stepsFor(recipe, skill) {
    var _a, _b, _c;
    const writtenForSkill = Boolean(recipe.steps[skill]);
    const base = (_c = (_b = (_a = recipe.steps[skill]) != null ? _a : recipe.steps[recipe.difficulty]) != null ? _b : Object.values(recipe.steps)[0]) != null ? _c : [];
    return base.map((step) => stepForSkill(step, skill, writtenForSkill));
  }
  async function analyzeOntoCanvas(file, canvas) {
    const bitmap = await createImageBitmap(file);
    const maxEdge = 360;
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      bitmap.close();
      throw new Error("Canvas is not available.");
    }
    context.clearRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const pixels = context.getImageData(0, 0, width, height).data;
    return statsFromPixels(file.name, width, height, pixels);
  }
  function statsFromPixels(fileName, width, height, pixels) {
    let frameR = 0;
    let frameG = 0;
    let frameB = 0;
    let frameN = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 16) continue;
      frameR += pixels[i];
      frameG += pixels[i + 1];
      frameB += pixels[i + 2];
      frameN += 1;
    }
    if (frameN === 0) {
      throw new Error("That image has no visible pixels.");
    }
    frameR /= frameN;
    frameG /= frameN;
    frameB /= frameN;
    const cornerAt = (x, y) => {
      const clampedX = Math.max(0, Math.min(width - 1, x));
      const clampedY = Math.max(0, Math.min(height - 1, y));
      const index = (clampedY * width + clampedX) * 4;
      return [pixels[index], pixels[index + 1], pixels[index + 2]];
    };
    const corners = [
      cornerAt(2, 2),
      cornerAt(width - 3, 2),
      cornerAt(2, height - 3),
      cornerAt(width - 3, height - 3)
    ];
    const cornerR = corners.reduce((sum, c) => sum + c[0], 0) / corners.length;
    const cornerG = corners.reduce((sum, c) => sum + c[1], 0) / corners.length;
    const cornerB = corners.reduce((sum, c) => sum + c[2], 0) / corners.length;
    let subjectR = 0;
    let subjectG = 0;
    let subjectB = 0;
    let subjectN = 0;
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = (y * width + x) * 4;
        if (pixels[index + 3] < 16) continue;
        const distance = Math.hypot(
          pixels[index] - cornerR,
          pixels[index + 1] - cornerG,
          pixels[index + 2] - cornerB
        );
        if (distance < 28) continue;
        subjectR += pixels[index];
        subjectG += pixels[index + 1];
        subjectB += pixels[index + 2];
        subjectN += 1;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
    const fill = subjectN / frameN;
    const subjectBox = fill > 0.08 && fill < 0.97 && maxX > minX && maxY > minY ? {
      aspect: (maxX - minX + 1) / (maxY - minY + 1),
      r: subjectR / subjectN,
      g: subjectG / subjectN,
      b: subjectB / subjectN
    } : null;
    const used = subjectBox != null ? subjectBox : { r: frameR, g: frameG, b: frameB };
    const hsl = rgbToHsl(used.r, used.g, used.b);
    const fileAspect = width / height;
    return {
      fileName,
      width,
      height,
      fileAspect,
      subjectAspect: subjectBox ? subjectBox.aspect : null,
      aspectUsed: subjectBox ? subjectBox.aspect : fileAspect,
      hex: toHex(used.r, used.g, used.b),
      frameHex: toHex(frameR, frameG, frameB),
      brightness: luminance(used.r, used.g, used.b),
      saturation: hsl.saturation,
      hue: hsl.hue,
      pixelCount: frameN
    };
  }
  function loadMeasurements() {
    try {
      const raw = localStorage.getItem(MEASURE_KEY);
      if (!raw) return { ...EMPTY_MEASUREMENTS };
      const parsed = JSON.parse(raw);
      return { ...EMPTY_MEASUREMENTS, ...parsed };
    } catch {
      return { ...EMPTY_MEASUREMENTS };
    }
  }
  function saveMeasurements(measurements) {
    localStorage.setItem(MEASURE_KEY, JSON.stringify(measurements));
  }
  function loadCloset() {
    try {
      const raw = localStorage.getItem(CLOSET_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  function saveCloset(projects) {
    localStorage.setItem(CLOSET_KEY, JSON.stringify(projects));
  }
  function paintDataUrl(canvas, url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Canvas is not available."));
          return;
        }
        context.drawImage(image, 0, 0);
        resolve();
      };
      image.onerror = () => reject(new Error("Could not redraw the saved photo."));
      image.src = url;
    });
  }
  return __toCommonJS(flip_engine_exports);
})();
