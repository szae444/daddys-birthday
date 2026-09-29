/* ------------------------------------------------------------------
   ✏️  EDIT THIS FILE TO PERSONALISE THE SITE
   Everything Dad sees — names, dates, photos, your letter, jokes —
   lives here. You never need to touch the components.

   PHOTOS: drop your pictures into the  Photos/  folder (next to this
   project's README) and refer to them below by file name, e.g. "beach.jpg".
   Pictures you don't list still appear at the end of the scrapbook.
------------------------------------------------------------------- */

export const dad = {
  /** What you call him — used in headlines */
  name: "Dad",
  /** His birthday. Year is used for the age counter & stats. */
  birthDate: "1981-09-30",
  /** Your name (signs the letter and footer) */
  from: "Your kid",
  /** The photo on the cover of "The Dad Issue" */
  coverPhoto: "IMG_5014.dng",
  coverCaption: "the legend & co-star",
};

/** "Then & Now" slider — drag to wipe between an old photo and a new one.
    `focus` = which part of the photo to centre on (x% y%), `zoom` = how far to zoom in. */
export const thenAndNow = {
  then: { src: "IMG_8027.jpg", label: "Then", focus: "50% 50%", zoom: 1 },
  now: { src: "IMG_5013.dng", label: "Now · 2026", focus: "42% 36%", zoom: 2.6 },
  caption: "Same smiles. More adventures.",
};

/** Background music — streamed from YouTube (starts when the envelope opens).
    To change the song, paste the new video's ID (the part after youtu.be/ or v=).
    If YouTube can't load, the site falls back to a music-box "Happy Birthday". */
export const music = {
  youtubeId: "m-fNVB-fAjk",
  title: "Your Universe",
  artist: "Rico Blanco",
  startAt: 0, // seconds into the video to start from
  volume: 70, // 0–100
};

/** Scrolling titles in the ticker band */
export const titles = [
  "Chief Grill Officer",
  "World's Okayest Golfer",
  "Thermostat Guardian",
  "Fixer of All Things",
  "Professional Dad-Joke Teller",
  "Keeper of the Remote",
  "Best Hug Supplier",
  "Road-Trip Captain",
];

/** Your letter. Each string is a paragraph. */
export const letter = {
  greeting: "Dear Dad,",
  paragraphs: [
    "This is where my message to you goes. I'm going to write something here that actually says everything I never say out loud.",
    "For now, just know this whole website was made for you — every page, every silly button, every photo. Scroll slowly. Click everything.",
    "Happy birthday. I love you.",
  ],
  signOff: "Always your kid,",
};

/** The scrapbook wall. Add as many as you like. */
export const photos: { src: string; caption: string; year?: string }[] = [
  { src: "IMG_8028.jpg", caption: "that smile never changed", year: "throwback" },
  { src: "IMG_8025.jpg", caption: "someone wasn't in the mood", year: "throwback" },
  { src: "IMG_2656.jpeg", caption: "pine forest crew", year: "Feb 2026" },
  { src: "IMG_2662.jpeg", caption: "feet up, zero worries", year: "Feb 2026" },
  { src: "IMG_2700.jpeg", caption: "peak silliness", year: "Feb 2026" },
  { src: "IMG_5015.dng", caption: "sea breeze & sunshine", year: "May 2026" },
];

/** "Through the years" timeline */
export const timeline: { year: string; title: string; note: string; photo?: string }[] = [
  { year: "1981", title: "A legend is born", note: "The world gets its future favourite dad." },
  { year: "Then", title: "Became my dad", note: "Movie nights, big grins, and the best promotion he ever got.", photo: "IMG_8026.jpg" },
  { year: "Later", title: "Couch buddies", note: "A little superhero, and the real one sitting right behind him.", photo: "IMG_5336.jpg" },
  { year: "2026", title: "Above the clouds", note: "New places, same Dad. The adventures just keep coming.", photo: "IMG_2683.jpeg" },
  { year: "45", title: "Still the best", note: "Forty-five years in, and somehow getting better." },
];

/** Reasons deck — one card each */
export const reasons = [
  "You always show up. Always.",
  "Your laugh at your own jokes before the punchline.",
  "You taught me how to fix things — and when to ask for help.",
  "You make the best breakfast on weekends.",
  "You never let me feel alone.",
  "The way you drive with one hand on the wheel like a movie star.",
  "You believed in me before I did.",
  "Your hugs fix about 90% of problems.",
  "You work so hard and never complain.",
  "You're my first call when anything happens.",
];

/** Scratch-off gift coupons */
export const coupons = [
  { title: "One Free Car Wash", fine: "Valid any sunny Saturday. Soap included." },
  { title: "Dinner — My Treat", fine: "Your pick. Yes, even that steak place." },
  { title: "Full Control of the Remote", fine: "24 hours. No complaints. No channel judgment." },
];

/** Dad jokes for the joke machine */
export const jokes: [string, string][] = [
  ["Why don't eggs tell jokes?", "They'd crack each other up."],
  ["I'm reading a book about anti-gravity.", "It's impossible to put down."],
  ["What do you call a fake noodle?", "An impasta."],
  ["Why did the scarecrow win an award?", "He was outstanding in his field."],
  ["I used to hate facial hair…", "but then it grew on me."],
  ["What do you call a factory that makes okay products?", "A satisfactory."],
  ["Why can't a bicycle stand on its own?", "It's two tired."],
  ["How does a penguin build its house?", "Igloos it together."],
  ["I only know 25 letters of the alphabet.", "I don't know y."],
  ["What did the ocean say to the beach?", "Nothing, it just waved."],
  ["Did you hear about the restaurant on the moon?", "Great food, no atmosphere."],
  ["Why do dads take an extra pair of socks when golfing?", "In case they get a hole in one."],
];

/** Hidden messages inside the balloons */
export const balloonNotes = [
  "Best dad ever. Official.",
  "Thank you for everything.",
  "You're not old, you're vintage.",
  "Still taller than me? We'll see.",
  "I got my good looks from you.",
  "Proud to be your kid.",
  "Another year cooler.",
  "Love you to the moon.",
];

/** Notes already pinned to the wish wall (others can add more) */
export const wishes = [
  { name: "Mom", text: "Happy birthday, my love. Still my favourite person." },
  { name: "The dog", text: "Woof. (Translation: more walks please.)" },
];

/** Number of candles on the cake */
export const candleCount = 6;
