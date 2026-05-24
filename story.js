/* ====================================================================
   WATERGEN — Episode One: The Ecosystem
   STORY DATA
   --------------------------------------------------------------------
   Aligned to the group's deck: Almor & Berliner (2024), "The Role of the
   Ecosystem," using the MACRO / MESO / MICRO framework. The cast are
   Watergen's REAL executives (watergen.com/about-us/executive-team-board).
   You play as the CEO (Steve Elbaz's chair).

   Scenes are dramatized for education: Watergen and its executives are real;
   specific dialogue and moments are fictionalized.

   Node shape — see engine.js header.
   ==================================================================== */

const CHARACTERS = {
  // --- Real Watergen executive team (art = downloaded DiceBear avatars) ---
  yarden:  { name:"Yarden Gonen",        role:"CFO",                  img:"assets/characters/yarden.svg" },
  sharon:  { name:"Sharon Dulberg",      role:"CTO & VP Innovation",  img:"assets/characters/sharon.svg" },
  chen:    { name:"Chen Nechemia",       role:"VP R&D",               img:"assets/characters/chen.svg" },
  roni:    { name:"Roni Litinetsky",     role:"VP Sales",             img:"assets/characters/roni.svg" },
  michael: { name:"Dr. Michael Mirilashvili", role:"President",       img:"assets/characters/michael.svg" },

  // --- External ecosystem actors (representative, not Watergen staff) ---
  iia:     { name:"Israel Innovation Authority", role:"R&D Grants Program",
             art:{ skin:"#e6c4a2", hair:"short", hairColor:"#211a14", outfit:"blazer",  outfitColor:"#1b2740", accent:"#f0c873", glasses:true } },
  angel:   { name:"Private Angel Investor", role:"Early-stage money",
             art:{ skin:"#dcb892", hair:"bald",  hairColor:"#b9bcc0", outfit:"suit",    outfitColor:"#2a2326", accent:"#b08d2e", glasses:false } },
};

const STORY = {
  start: "open1",

  nodes: {

  /* ============== COLD OPEN — 2009 ============== */
  open1: { bg:"lab", npc:null, ceo:false, speaker:"",
    text:"Rishon LeZion, Israel. 2009. A rented industrial unit, past midnight. A machine you and your army-unit friends built is humming in the dark.",
    next:"open2" },

  open2: { bg:"lab", npc:null, ceo:false, speaker:"",
    text:"Then — a sound. Drip. Drip. The first liters of clean drinking water, pulled straight out of the desert air. The room goes silent, then erupts.",
    next:"open3" },

  open3: { bg:"lab", npc:"yarden", ceo:true,
    text:"Yarden, your CFO: \"It works. It actually works.\" Then the smile fades. \"…and our bank account is empty. A prototype isn't a company. We need money — and we need it before payroll.\"",
    next:"open4" },

  open4: { bg:"lab", npc:null, ceo:false, speaker:"",
    text:"You are the CEO of Watergen. The technology is real. Now you have to build everything around it — the funding, the team, the markets. None of it will be built in a vacuum.",
    next:"titlecard" },

  titlecard: { bg:"black", npc:null, ceo:false,
    titlecard:{ top:"WATERGEN", big:"THE ECOSYSTEM", sub:"Almor & Berliner (2024) · Macro · Meso · Micro" },
    next:"c1_1" },

  /* ============== CHAPTER 1 — MACRO: THE FIRST HALF-MILLION ============== */
  c1_1: { bg:"boardroom", npc:"yarden", ceo:true,
    chapter:{ kicker:"Chapter One · MACRO", title:"The First Half-Million" },
    text:"Yarden lays it out: \"We need $500K to scale R&D and prepare for international markets. I've got two very different ways to get it on the table.\"",
    next:"c1_2" },

  c1_2: { bg:"boardroom", npc:"yarden", ceo:true,
    text:"\"The macro question every Israeli founder faces in 2009: do we lean on the national ecosystem the state built — or do we just take private money and move fast?\"",
    timer:60, timeoutIndex:1,
    choices:[
      { text:"Apply for an Israel Innovation Authority R&D grant.",
        tag:"MACRO · Finance", effects:{capital:+10, network:+10, talent:+5},
        remember:"Yarden",
        result:"It takes 3–4 months and a mountain of paperwork — but the funding is non-dilutive. You keep 100% of your equity, and the grant plugs you into Technion labs and the IIA network.",
        lens:"Almor & Berliner: the IIA exists to be a risk-reduction mechanism for early-stage founders (Lach et al., 2008). Government R&D support generates 2.28–2.81× leverage — every $1 of grant pulls $1.28–1.81 of private investment. The MACRO ecosystem was built for exactly this moment, and it protects founder equity at the most vulnerable stage.",
        goto:"c1_end" },
      { text:"Take a private angel: $500K now for 25% equity.",
        tag:"MACRO · Finance", effects:{capital:+20, network:-5},
        remember:"Yarden",
        result:"The money hits the account in weeks and you start scaling immediately. But you've handed over a quarter of the company before you've even proven the market.",
        lens:"Angel funding is legitimate — Israel's Angels Law (2012) was designed to encourage it, and speed matters. But trading 25% pre-validation limits your leverage in every future round. Using only private money ignores the macro infrastructure the state built so founders DON'T have to trade equity for early survival.",
        goto:"c1_end" },
      { text:"Bootstrap on defense & consulting contracts instead.",
        tag:"MICRO · Grit", effects:{capital:+5, talent:-5, impact:-5},
        remember:"Yarden",
        result:"You keep the company and the IP — but the team burns months doing side work instead of building the product. Pure chutzpah, no ecosystem leverage. The runway is yours, and it's short.",
        lens:"Going it alone shows founder grit, but it leaves the entire macro ecosystem — grants, leverage, intermediaries — unused. Almor & Berliner's whole point: Israel's success was engineered to make this lonely path unnecessary.",
        goto:"c1_end" },
    ]},

  c1_end: { bg:"boardroom", npc:"yarden", ceo:true,
    text:"Yarden nods. \"Funding: handled. Now the harder part — a prototype needs builders. Sharon's been waiting to talk to you about the team.\"",
    next:"c2_1" },

  /* ============== CHAPTER 2 — MICRO: BUILDING THE CORE ============== */
  c2_1: { bg:"lab", npc:"sharon", ceo:true,
    chapter:{ kicker:"Chapter Two · MICRO", title:"Building the Core" },
    text:"Sharon Dulberg, your CTO: \"To hit the next milestone we scale engineering from 12 people to 40. We have budget for senior hires and two strong talent pipelines. This decision defines our DNA.\"",
    next:"c2_2" },

  c2_2: { bg:"lab", npc:"sharon", ceo:true,
    text:"\"Our core tech came out of IDF defense R&D in the first place. The question is whether we keep drinking from that well — or go global for talent from day one.\"",
    choices:[
      { text:"Hire from the IDF Unit 8200 alumni network.",
        tag:"MICRO · Human Capital", effects:{talent:+15, network:+10},
        remember:"Sharon",
        result:"They already know each other. Shared military problem-solving culture, deep trust, and security clearances that matter to government clients. The team gels in weeks, not quarters.",
        lens:"Almor & Berliner identify IDF service as a core MICRO-level human-capital pipeline. Honig et al. (2006): military-unit social capital — the trust and networks formed in service — significantly predicts new-venture success. Unit 8200 alumni share a culture and trust you can't manufacture quickly.",
        goto:"c2_end" },
      { text:"Recruit internationally — Germany, the Netherlands, the US.",
        tag:"MICRO / MESO · Talent", effects:{talent:+10, network:+5, impact:+5},
        remember:"Sharon",
        result:"You bring in diverse, world-class expertise and global networks — genuinely valuable for a company that will sell in 30+ countries. But integration is bumpy against Israel's fast, flat, argue-with-the-CEO culture.",
        lens:"International hiring suits a born-global venture. But Almor & Berliner warn the MICRO advantage — shared culture, IDF networks, local institutional knowledge — is hard to replicate. Imported hires can struggle to plug into the startup's flat, high-tempo culture at a critical scaling moment.",
        goto:"c2_end" },
      { text:"Blend it: an 8200 core, augmented with a few global stars.",
        tag:"MICRO + MESO", effects:{talent:+12, network:+8, impact:+5},
        remember:"Sharon",
        result:"You anchor the team in the trusted 8200 network, then layer in a handful of international experts where you genuinely lack the skill. Cohesion plus reach — at the cost of a more complex culture to manage.",
        lens:"The pragmatic read of Almor & Berliner: lead with the micro ecosystem's trust advantage, then import specific global capabilities you can't grow at home. Anchor locally, reach globally.",
        goto:"c2_end" },
    ]},

  c2_end: { bg:"lab", npc:"sharon", ceo:true,
    text:"Sharon grins. \"Good. We have money and a team. Now Roni's going to ruin your day with a fact about our home market.\"",
    next:"c3_1" },

  /* ============== CHAPTER 3 — MESO: NO HOME MARKET ============== */
  c3_1: { bg:"office", npc:"roni", ceo:true,
    chapter:{ kicker:"Chapter Three · MESO", title:"A Company With No Home" },
    text:"Roni Litinetsky, VP Sales: \"Here's the brutal truth — Israel has no water-shortage market. Nobody here is going to buy a machine that makes water from air. If we sell only at home, we die.\"",
    next:"c3_2" },

  c3_2: { bg:"office", npc:"roni", ceo:true,
    text:"\"But the ecosystem has an answer. The Israel Export Institute can open government doors in India — a country with a real water crisis. We could be born-global from day one. Or we play it safe.\"",
    choices:[
      { text:"Go born-global now — chase India's government via the Export Institute.",
        tag:"MESO · Born-global", effects:{network:+15, impact:+15, capital:+5},
        remember:"Roni",
        result:"You skip the home market entirely and fly to New Delhi. The Export Institute's introductions get you into rooms a small Israeli startup could never reach alone. The pipeline fills with national-scale deals.",
        lens:"Almor & Berliner's MESO level: born-global International New Ventures. When the domestic market is absent, ecosystem intermediaries (the Export Institute, IEI) substitute for it — opening foreign government channels so a tiny firm can sell to the world from day one.",
        goto:"c3_end" },
      { text:"Build a small domestic base first, then expand carefully.",
        tag:"MESO · Caution", effects:{capital:+5, network:-5, impact:-5},
        remember:"Roni",
        result:"You spend a year courting Israeli buyers who don't really need you. Revenue trickles. The window in India narrows while you perfect a market that was never going to be big enough.",
        lens:"Domestic-first is the default playbook — and it's the wrong one here. Almor & Berliner show Israel's ventures are deliberately born-global precisely because the home market can't sustain them. Ignoring that wastes the meso infrastructure built to send you abroad.",
        goto:"c3_end" },
      { text:"License the tech to a multinational for global distribution.",
        tag:"MESO · Dependency", effects:{capital:+15, network:-10, impact:-5},
        remember:"Roni",
        result:"Guaranteed revenue, instant reach — and you become a parts supplier to someone else's brand. You've traded the chance to be the hub for a cheque.",
        lens:"Licensing buys reach but creates dependency. You stop being a node others want to connect to. The meso advantage of a born-global INV is owning the global relationships, not renting them out.",
        goto:"c3_end" },
    ]},

  c3_end: { bg:"office", npc:"roni", ceo:true,
    text:"Roni's phone lights up. \"India wants a national pilot. This just got real — and expensive. President Mirilashvili wants to see you. It's time to scale.\"",
    next:"c4_1" },

  /* ============== CHAPTER 4 — MACRO+MESO: SCALING THE NETWORK ============== */
  c4_1: { bg:"ministry", npc:"michael", ceo:true,
    chapter:{ kicker:"Chapter Four · MACRO + MESO", title:"Going Big" },
    text:"Dr. Michael Mirilashvili, President: \"India is the proof. Now we scale. There's $30M+ of venture capital available — the kind of money Israel's Yozma-built VC industry made possible. And governments are calling: Nigeria, Brazil, the United States.\"",
    next:"c4_2" },

  c4_2: { bg:"ministry", npc:"michael", ceo:true,
    text:"\"But the biggest requests are humanitarian deployments — drought zones, disaster relief. Thin margins, real political risk. Do we chase pure growth, or do we lead with the mission?\"",
    choices:[
      { text:"Raise the $30M and pursue the government alliances AND humanitarian deployments.",
        tag:"MESO + MACRO · Scale", effects:{capital:+15, network:+15, impact:+15},
        remember:"Michael",
        result:"You take the smart capital and say yes to Nigeria, Brazil, the US — and to the drought-relief missions. Watergen becomes a name governments trust. The images of water flowing in disaster zones are worth more than any ad.",
        lens:"The Yozma-built VC industry (a MACRO achievement) funds a MESO move: strategic alliances with foreign governments. Pairing growth with humanitarian deployment builds legitimacy and social capital — intangible ecosystem assets that pure commercial logic can't buy.",
        goto:"c4_end" },
      { text:"Raise from a purely financial fund. Skip the messy, low-margin deployments.",
        tag:"MACRO · Capital only", effects:{capital:+20, impact:-10, network:-5},
        remember:"Michael",
        result:"The balance sheet looks fantastic. But you've passed on the missions that would have made Watergen mean something — and on the government relationships that come with them.",
        lens:"Capital without the ecosystem. Money alone doesn't open foreign government doors or earn legitimacy. Almor & Berliner stress that meso-level relationships and reputation are systemic conditions — not optional extras to growth.",
        goto:"c4_end" },
      { text:"Stay lean. Grow only on the revenue you already have.",
        tag:"MESO · Under-scale", effects:{capital:-5, network:-5, impact:0},
        remember:"Michael",
        result:"Disciplined and safe — and far too slow. While you protect the cap table, deeper-pocketed rivals start signing the national contracts you opened the door to.",
        lens:"Refusing to use the Yozma VC infrastructure leaves a born-global venture under-scaled. The ecosystem built the on-ramp to global growth; declining to take it cedes the market you created.",
        goto:"c4_end" },
    ]},

  c4_end: { bg:"ministry", npc:null, ceo:false, speaker:"",
    text:"Years pass. Watergen units now run on five continents. Then a number arrives that could end the story — or change what it means.",
    next:"c5_1" },

  /* ============== CHAPTER 5 — STRATEGIC: SCALE-UP vs EXIT ============== */
  c5_1: { bg:"press", npc:"michael", ceo:true,
    chapter:{ kicker:"Chapter Five · STRATEGIC", title:"Startup Nation, or Scale-Up Nation?" },
    text:"President Mirilashvili slides a term sheet across the table. \"A multinational wants to acquire us. The number is life-changing for everyone in this building. The board can cash out tomorrow. The question is whether we should.\"",
    timer:60, timeoutIndex:2,
    choices:[
      { text:"Reject the exit. Scale globally, build manufacturing & jobs, formalize the IDF talent pipeline.",
        tag:"STRATEGIC · Scale-Up (Rec 1+2)", effects:{talent:+10, network:+10, impact:+15, capital:-5},
        remember:"Michael",
        result:"You turn down the fortune. Watergen stays Israeli and independent — scaling manufacturing, hiring beyond the tech elite, and turning the Unit 8200 alumni network into a formal recruitment pipeline. You're building a company that outlasts an exit.",
        lens:"Almor & Berliner's core warning: Israel must move from Startup Nation to SCALE-UP Nation — only ~10% of the population benefits from startup exits. Resisting acquisition (Rec 1) and formalizing the IDF network as a strategic asset (Rec 2; Honig et al., 2006) creates durable jobs and an anchor firm for the whole ecosystem.",
        goto:"finale1" },
      { text:"Take the exit. Maximize the payout for everyone.",
        tag:"STRATEGIC · Classic exit", effects:{capital:+25, talent:-10, network:-10, impact:-15},
        remember:"Michael",
        result:"The wire lands. Founders and early employees are wealthy overnight — the classic Startup Nation ending. But the mission gets absorbed into a giant, the team scatters, and Israel loses a potential anchor firm.",
        lens:"The exit is the celebrated Israeli outcome — and exactly what Almor & Berliner critique. With only ~10% sharing in exit gains, a serial-exit culture builds wealth but not scaled institutions. The ecosystem that made you possible loses the anchor you could have become.",
        goto:"finale1" },
      { text:"Take strategic investment instead — keep control, keep scaling.",
        tag:"STRATEGIC · Hybrid", effects:{capital:+10, network:+10, impact:+10, talent:+5},
        remember:"Michael",
        result:"You decline the buyout but accept a strategic investor who shares the long-term vision. You de-risk without selling the soul of the company — and keep the option to become a true scale-up.",
        lens:"A middle path consistent with the Scale-Up argument: bring in capital and partners while retaining the independence to build manufacturing, jobs, and a lasting global brand rather than cashing out.",
        goto:"finale1" },
    ]},

  /* ============== FINALE ============== */
  finale1: { bg:"field", npc:null, ceo:false, speaker:"",
    text:"You stand at the edge of a dry riverbed in a country you'd never visited a decade ago, watching a Watergen array turn hot air into clean water for a village that had none.",
    next:"finale2" },

  finale2: { bg:"field", npc:null, ceo:false, speaker:"",
    text:"\"Entrepreneurial human capital doesn't emerge in a vacuum,\" Almor & Berliner wrote. \"It is built, layer by layer, through deliberate ecosystem policy — from national VC funds down to a soldier learning to code at 18.\" Time to see what you built.",
    next:"__evaluate__" },

  } // end nodes
};

/* ============== ENDINGS ==============
   Picked by engine on final stats. First matching condition wins.        */
const ENDINGS = [
  { id:"scaleup",
    test:s => s.talent>=60 && s.capital>=55 && s.network>=60 && s.impact>=55,
    title:"The Scale-Up Nation",
    desc:"You used every layer of the ecosystem — macro capital, meso networks, micro talent — and refused the easy exit. Watergen becomes an anchor firm: thousands of jobs beyond the tech elite, water on five continents, and a Unit 8200 pipeline feeding the next generation. This is the company Almor & Berliner argue Israel needs more of: not just a startup that exited, but an institution that scaled." },

  { id:"hollow",
    test:s => s.capital>=60 && (s.network<45 || s.impact<45),
    title:"The Hollow Exit",
    desc:"On paper, a triumph — a headline acquisition, a fortune for the founders. But the mission dissolved into a multinational, the team scattered, and Israel lost an anchor firm it could have kept. The textbook Startup Nation ending, and exactly the pattern Almor & Berliner warn against: wealth for the ~10%, but no scaled institution left behind." },

  { id:"beloved",
    test:s => (s.network>=60 || s.impact>=60) && s.capital<45,
    title:"The Beloved Underdog",
    desc:"Governments trust you, communities bless your name, and your born-global mission is real. But undercapitalized, you watch deeper-pocketed rivals win the national contracts you opened the door to. You mastered the meso ecosystem and neglected the macro one — respected, mission-true, and one funding round short." },

  { id:"imported",
    test:s => s.talent<40,
    title:"The Imported Team",
    desc:"The capital was there and the markets were open, but you never leveraged the micro ecosystem — the IDF networks, the shared culture, the trust that can't be bought. Your team never quite gelled, the roadmap slipped, and the uniquely Israeli human-capital advantage that Honig et al. (2006) describe was left on the table." },

  { id:"lonestartup",
    test:s => s.network<40,
    title:"The Lone Startup",
    desc:"You built brilliant machines and trusted no one — no Export Institute doors, no government alliances, no investor networks. When global scale demanded relationships you didn't have, the ecosystem simply routed around you. The technology was real; the isolation was fatal." },

  { id:"survivor",
    test:s => true,
    title:"The Survivor",
    desc:"Watergen endures — neither soaring nor failing. Safe choices kept the lights on and split a few contracts. A solid company in a hard industry. But the ecosystem barely felt your presence, and the layer-by-layer advantage Almor & Berliner describe was only half-used." },
];
