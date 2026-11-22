/* Sample finds for the Restitch front door (play.html).
   Photos: Wikimedia Commons, credited below (sizes reduced to 720 px).
   `stats` is what RestitchEngine.statsFromPixels returned for each photo on 22 Nov 2026;
   play.js re-reads the pixels when the browser allows it and only falls back to these. */
window.RESTITCH_FINDS = [
  {
    id: "jean-jacket",
    name: "Jean jacket",
    file: "play/finds/jean-jacket.jpg",
    credit: { author: "NikosLikomitros", license: "CC0", source: "https://commons.wikimedia.org/wiki/File:Jean_jacket.jpg" },
    stats: { hex: "#74818f", brightness: 0.499, saturation: 0.108, hue: 211, aspectUsed: 1.121 }
  },
  {
    id: "maxi-dress",
    name: "1970s maxi dress",
    file: "play/finds/maxi-dress.jpg",
    credit: { author: "Smirkybec", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Vintage_1970s_dress.jpg" },
    stats: { hex: "#5d4a39", brightness: 0.302, saturation: 0.242, hue: 29, aspectUsed: 0.75 }
  },
  {
    id: "wool-sweater",
    name: "Wool sweater",
    file: "play/finds/wool-sweater.jpg",
    credit: { author: "Aslak Raanes", license: "CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Grey_knitted_sweater.jpg" },
    stats: { hex: "#989490", brightness: 0.583, saturation: 0.034, hue: 30, aspectUsed: 1.39 }
  },
  {
    id: "tent-dress",
    name: "Linen tent dress",
    file: "play/finds/tent-dress.jpg",
    credit: { author: "Bestvintage", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Tent_dress.jpg" },
    stats: { hex: "#c8ba9c", brightness: 0.731, saturation: 0.283, hue: 41, aspectUsed: 0.628 }
  }
];
