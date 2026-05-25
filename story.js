/* ====================================================================
   WATERGEN — Episode One: The Ecosystem
   STORY DATA  (simple, direct dialogue)
   --------------------------------------------------------------------
   Aligned to the group's deck: Almor & Berliner (2024), MACRO / MESO /
   MICRO. Cast are Watergen's REAL executives. You play the CEO.
   Scenes are dramatized for education.
   ==================================================================== */

const CHARACTERS = {
  yarden:  { name:"Yarden Gonen",        role:"CFO",                  img:"assets/characters/yarden.svg" },
  sharon:  { name:"Sharon Dulberg",      role:"CTO & VP Innovation",  img:"assets/characters/sharon.svg" },
  chen:    { name:"Chen Nechemia",       role:"VP R&D",               img:"assets/characters/chen.svg" },
  roni:    { name:"Roni Litinetsky",     role:"VP Sales",             img:"assets/characters/roni.svg" },
  michael: { name:"Dr. Michael Mirilashvili", role:"President",       img:"assets/characters/michael.svg" },
  iia:     { name:"Israel Innovation Authority", role:"R&D Grants Program",
             art:{ skin:"#e6c4a2", hair:"short", hairColor:"#211a14", outfit:"blazer", outfitColor:"#1b2740", accent:"#f0c873", glasses:true } },
  angel:   { name:"Private Angel Investor", role:"Early-stage money",
             art:{ skin:"#dcb892", hair:"bald", hairColor:"#b9bcc0", outfit:"suit", outfitColor:"#2a2326", accent:"#b08d2e", glasses:false } },
};

const STORY = {
  start: "open1",

  nodes: {

  /* ============== COLD OPEN — 2009 ============== */
  open1: { bg:"lab", npc:null, ceo:false, speaker:"",
    text:"Israel, 2009. A small workshop. You and a few army friends built a machine that makes water from air — and today, it finally works.",
    next:"open2" },

  open2: { bg:"lab", npc:null, ceo:false, speaker:"",
    text:"Drip. Drip. The first clean water, straight out of the air. Everyone cheers.",
    next:"open3" },

  open3: { bg:"lab", npc:"yarden", ceo:true,
    text:"Yarden, your CFO: \"It works! But the bank account is empty. A prototype isn't a company — we need money, fast.\"",
    next:"open4" },

  open4: { bg:"lab", npc:null, ceo:false, speaker:"",
    text:"You're the CEO of Watergen. The tech is real. Now you have to build everything around it.",
    next:"titlecard" },

  titlecard: { bg:"black", npc:null, ceo:false,
    titlecard:{ top:"WATERGEN", big:"THE ECOSYSTEM", sub:"Almor & Berliner (2024) · Macro · Meso · Micro" },
    next:"c1_1" },

  /* ============== CHAPTER 1 — MACRO: FUNDING ============== */
  c1_1: { bg:"boardroom", npc:"yarden", ceo:true,
    chapter:{ kicker:"Chapter One · MACRO", title:"The First Half-Million" },
    text:"Yarden: \"We need $500K to scale our R&D and reach foreign markets. There are two ways to get it.\"",
    next:"c1_2" },

  c1_2: { bg:"boardroom", npc:"yarden", ceo:true,
    text:"\"So — what's the best way to fund it?\"",
    timer:60, timeoutIndex:1,
    choices:[
      { text:"Apply for an Israel Innovation Authority R&D grant.",
        tag:"MACRO · Finance", effects:{capital:+10, network:+10, talent:+5},
        remember:"Yarden",
        result:"It takes a few months and lots of paperwork — but it's free money. You keep 100% of the company, and you're now connected to the Technion and the IIA network.",
        lens:"The IIA exists to de-risk early founders (Lach et al., 2008). Every $1 of grant pulls in roughly $1.3–1.8 of private money — and you keep your equity. The macro ecosystem was built for exactly this moment.",
        goto:"c1_end" },
      { text:"Take a private angel: $500K now for 25% equity.",
        tag:"MACRO · Finance", effects:{capital:+20, network:-5},
        remember:"Yarden",
        result:"The money lands in weeks and you start scaling now. But you gave away a quarter of the company before proving anything.",
        lens:"Angel money is legitimate (Israel's Angels Law, 2012) and fast. But giving up 25% this early weakens you in every future round — and it skips the state support built so founders don't have to.",
        goto:"c1_end" },
      { text:"Bootstrap on defense & consulting contracts instead.",
        tag:"MICRO · Grit", effects:{capital:+5, talent:-5, impact:-5},
        remember:"Yarden",
        result:"You keep the company and the IP, but the team spends months on side jobs instead of the product. All grit, no help — and the runway is short.",
        lens:"Going it alone shows grit, but it ignores the whole support system — grants, leverage, partners — that Israel built to make this lonely path unnecessary.",
        goto:"c1_end" },
    ]},

  c1_end: { bg:"boardroom", npc:"yarden", ceo:true,
    text:"Yarden: \"Funding — done. Now the hard part: a prototype needs builders. Sharon wants to talk team.\"",
    next:"c2_1" },

  /* ============== CHAPTER 2 — MICRO: TEAM ============== */
  c2_1: { bg:"lab", npc:"sharon", ceo:true,
    chapter:{ kicker:"Chapter Two · MICRO", title:"Building the Core" },
    text:"Sharon, your CTO: \"We need to grow engineering from 12 people to 40. We have the budget — and two ways to hire.\"",
    next:"c2_2" },

  c2_2: { bg:"lab", npc:"sharon", ceo:true,
    text:"\"Our tech came out of army R&D. Do we keep hiring from that network, or go global from day one?\"",
    choices:[
      { text:"Hire from the IDF Unit 8200 alumni network.",
        tag:"MICRO · Human Capital", effects:{talent:+15, network:+10},
        remember:"Sharon",
        result:"They already know each other — same army background, deep trust, security clearances for government clients. The team clicks in weeks.",
        lens:"Almor & Berliner: army service (e.g. Unit 8200) is a core talent pipeline. Honig et al. (2006): the trust and networks built in service strongly predict startup success — and you can't build that fast.",
        goto:"c2_end" },
      { text:"Recruit internationally — Germany, the Netherlands, the US.",
        tag:"MICRO / MESO · Talent", effects:{talent:+10, network:+5, impact:+5},
        remember:"Sharon",
        result:"You bring in world-class people and global contacts — great for selling abroad. But they take time to fit into Israel's fast, flat, blunt startup culture.",
        lens:"Global hiring suits a born-global company, but Almor & Berliner warn the local edge — shared culture, army networks, trust — is hard to copy. New hires can struggle to plug in at a key moment.",
        goto:"c2_end" },
      { text:"Blend it: an 8200 core, plus a few global stars.",
        tag:"MICRO + MESO", effects:{talent:+12, network:+8, impact:+5},
        remember:"Sharon",
        result:"You build a trusted local core, then add a few global experts where you need them. Strong team — just a more complex culture to manage.",
        lens:"The practical read of Almor & Berliner: anchor in the local trust network, then add the specific global skills you can't grow at home. Local roots, global reach.",
        goto:"c2_end" },
    ]},

  c2_end: { bg:"lab", npc:"sharon", ceo:true,
    text:"Sharon: \"Money and a team — done. Now Roni has bad news about our home market.\"",
    next:"c3_1" },

  /* ============== CHAPTER 3 — MESO: NO HOME MARKET ============== */
  c3_1: { bg:"office", npc:"roni", ceo:true,
    chapter:{ kicker:"Chapter Three · MESO", title:"A Company With No Home" },
    text:"Roni, VP Sales: \"Hard truth: Israel has no water-shortage market. Nobody here needs us. Sell only at home, and we die.\"",
    next:"c3_2" },

  c3_2: { bg:"office", npc:"roni", ceo:true,
    text:"\"But the Export Institute can open government doors in India — a country with a real water crisis. Do we go global now, or play it safe?\"",
    choices:[
      { text:"Go global now — chase India's government via the Export Institute.",
        tag:"MESO · Born-global", effects:{network:+15, impact:+15, capital:+5},
        remember:"Roni",
        result:"You skip the home market and fly to India. The Export Institute gets you into rooms a tiny startup could never reach alone. The pipeline fills with national-scale deals.",
        lens:"Almor & Berliner's meso level: 'born-global' startups. With no home market, ecosystem helpers (the Export Institute) open foreign government doors so a small firm can sell worldwide from day one.",
        goto:"c3_end" },
      { text:"Build a small home base first, then expand slowly.",
        tag:"MESO · Caution", effects:{capital:+5, network:-5, impact:-5},
        remember:"Roni",
        result:"You spend a year chasing Israeli buyers who don't really need you. Revenue trickles in while the window in India closes.",
        lens:"Home-first is the usual playbook — and it's wrong here. Israeli startups go born-global on purpose because the home market is too small. Ignoring that wastes the system built to send you abroad.",
        goto:"c3_end" },
      { text:"License the tech to a multinational for global reach.",
        tag:"MESO · Dependency", effects:{capital:+15, network:-10, impact:-5},
        remember:"Roni",
        result:"Guaranteed money and instant reach — but you become a parts supplier for someone else's brand, not the company everyone wants to work with.",
        lens:"Licensing buys reach but creates dependency. You stop being a hub others connect to. A born-global company should own its global relationships, not rent them out.",
        goto:"c3_end" },
    ]},

  c3_end: { bg:"office", npc:"roni", ceo:true,
    text:"Roni: \"India wants a national pilot. This just got big — and expensive. President Mirilashvili wants to see you.\"",
    next:"c4_1" },

  /* ============== CHAPTER 4 — MACRO+MESO: SCALING ============== */
  c4_1: { bg:"ministry", npc:"michael", ceo:true,
    chapter:{ kicker:"Chapter Four · MACRO + MESO", title:"Going Big" },
    text:"President Mirilashvili: \"India proved it. Now we scale. There's $30M+ in venture capital available — and governments are calling: Nigeria, Brazil, the US.\"",
    next:"c4_2" },

  c4_2: { bg:"ministry", npc:"michael", ceo:true,
    text:"\"The biggest requests are humanitarian — drought and disaster zones. Low margins, real risk. Do we chase pure growth, or lead with the mission?\"",
    choices:[
      { text:"Raise the $30M, take the government deals AND the relief missions.",
        tag:"MESO + MACRO · Scale", effects:{capital:+15, network:+15, impact:+15},
        remember:"Michael",
        result:"You take the smart money and say yes — to the governments and the relief missions. Watergen becomes a name governments trust, and water flowing in disaster zones is worth more than any ad.",
        lens:"Israel's VC industry (macro) funds a meso move: government alliances. Pairing growth with humanitarian work builds trust and reputation — ecosystem assets money can't buy.",
        goto:"c4_end" },
      { text:"Raise from a purely financial fund. Skip the messy missions.",
        tag:"MACRO · Capital only", effects:{capital:+20, impact:-10, network:-5},
        remember:"Michael",
        result:"The numbers look great. But you passed on the missions that would have given Watergen meaning — and on the government ties that came with them.",
        lens:"Money without the ecosystem. Cash alone doesn't open foreign government doors or earn trust. Relationships and reputation are part of the system, not optional extras.",
        goto:"c4_end" },
      { text:"Stay lean. Grow only on the revenue you have.",
        tag:"MESO · Under-scale", effects:{capital:-5, network:-5, impact:0},
        remember:"Michael",
        result:"Safe and disciplined — and far too slow. While you protect the company, bigger rivals start signing the national deals you opened the door to.",
        lens:"Refusing the VC on-ramp leaves a global company under-scaled. The ecosystem built the path to scale; skipping it hands the market to others.",
        goto:"c4_end" },
    ]},

  c4_end: { bg:"ministry", npc:null, ceo:false, speaker:"",
    text:"Years pass. Watergen runs on five continents. Then a number arrives that could end the story — or change what it means.",
    next:"c5_1" },

  /* ============== CHAPTER 5 — STRATEGIC: SCALE-UP vs EXIT ============== */
  c5_1: { bg:"press", npc:"michael", ceo:true,
    chapter:{ kicker:"Chapter Five · STRATEGIC", title:"Startup, or Scale-Up?" },
    text:"President Mirilashvili: \"A giant wants to buy us. The number would make everyone here rich overnight. We can sell tomorrow. The question is — should we?\"",
    timer:60, timeoutIndex:2,
    choices:[
      { text:"Reject the sale. Stay independent and scale globally.",
        tag:"STRATEGIC · Scale-Up", effects:{talent:+10, network:+10, impact:+15, capital:-5},
        remember:"Michael",
        result:"You turn down the fortune. Watergen stays Israeli and independent — building factories, hiring beyond the tech elite, turning the army network into a real recruiting pipeline. You're building something that lasts.",
        lens:"Almor & Berliner's key warning: Israel must go from Startup Nation to SCALE-UP Nation — only ~10% benefit from exits. Staying and growing creates lasting jobs and an anchor firm for the whole ecosystem.",
        goto:"finale1" },
      { text:"Take the sale. Make everyone rich.",
        tag:"STRATEGIC · Exit", effects:{capital:+25, talent:-10, network:-10, impact:-15},
        remember:"Michael",
        result:"The money lands. Founders and early staff are rich overnight — the classic Startup Nation ending. But the mission gets swallowed by a giant, the team scatters, and Israel loses an anchor firm.",
        lens:"The exit is the celebrated move — and exactly what Almor & Berliner critique. With only ~10% sharing the gains, serial exits build wealth but not lasting institutions. The ecosystem loses the anchor you could have been.",
        goto:"finale1" },
      { text:"Take a strategic investor instead — keep control, keep scaling.",
        tag:"STRATEGIC · Hybrid", effects:{capital:+10, network:+10, impact:+10, talent:+5},
        remember:"Michael",
        result:"You say no to the buyout but bring in a partner who shares the vision. You lower the risk without selling the soul of the company — and keep the option to become a true scale-up.",
        lens:"A middle path that fits the Scale-Up idea: bring in money and partners while keeping the independence to build factories, jobs, and a lasting global brand.",
        goto:"finale1" },
    ]},

  /* ============== FINALE ============== */
  finale1: { bg:"field", npc:null, ceo:false, speaker:"",
    text:"A year later. You stand at a dry riverbed in a country you'd never visited a decade ago, watching a Watergen machine turn hot air into clean water for a village that had none.",
    next:"finale2" },

  finale2: { bg:"field", npc:null, ceo:false, speaker:"",
    text:"\"Human capital doesn't appear from nowhere,\" Almor & Berliner wrote. \"It's built, layer by layer, by the ecosystem around it.\" Time to see what you built.",
    next:"__evaluate__" },

  } // end nodes
};

/* ============== ENDINGS ============== */
const ENDINGS = [
  { id:"scaleup",
    test:s => s.talent>=60 && s.capital>=55 && s.network>=60 && s.impact>=55,
    title:"The Scale-Up Nation",
    desc:"You used every layer of the ecosystem — macro money, meso networks, micro talent — and refused the easy exit. Watergen becomes an anchor firm: thousands of jobs, water on five continents, and an army-network pipeline feeding the next generation. This is what Almor & Berliner say Israel needs more of: not just a startup that sold, but a company that scaled." },

  { id:"hollow",
    test:s => s.capital>=60 && (s.network<45 || s.impact<45),
    title:"The Hollow Exit",
    desc:"On paper, a win — a huge sale and a fortune for the founders. But the mission vanished into a giant, the team scattered, and Israel lost an anchor firm. The classic Startup Nation ending — and exactly what Almor & Berliner warn against: wealth for a few, but nothing lasting left behind." },

  { id:"beloved",
    test:s => (s.network>=60 || s.impact>=60) && s.capital<45,
    title:"The Beloved Underdog",
    desc:"Everyone loves Watergen — governments, communities, founders. But without enough money, a richer rival wins the big contracts you opened the door to. You mastered the network but neglected the capital. Respected, mission-true, and one round short." },

  { id:"imported",
    test:s => s.talent<40,
    title:"The Imported Team",
    desc:"The money was there and the markets were open, but you never tapped the local talent network — the army ties, the shared culture, the trust you can't buy. The team never quite gelled and the edge faded (Honig et al., 2006)." },

  { id:"lonestartup",
    test:s => s.network<40,
    title:"The Lone Startup",
    desc:"You built great machines but trusted no one — no Export Institute, no government allies, no investor network. When global scale needed relationships you didn't have, the ecosystem just went around you. The tech was real; the isolation wasn't survivable." },

  { id:"survivor",
    test:s => true,
    title:"The Survivor",
    desc:"Watergen gets by — not soaring, not failing. Safe choices kept the lights on. A solid company in a hard field. But the ecosystem barely noticed you, and you used only half of the advantage Almor & Berliner describe." },
];
