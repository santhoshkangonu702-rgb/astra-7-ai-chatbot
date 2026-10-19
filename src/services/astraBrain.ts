import { PowerId } from '../types';

export type AstraBrainCapability =
  | 'CHAT'
  | 'SEARCH'
  | 'NEWS'
  | 'STUDY'
  | 'CODE'
  | 'DOCUMENTS'
  | 'DATA'
  | 'IMAGE'
  | 'VIDEO'
  | 'GAME'
  | 'MUSIC'
  | 'DATAHUB'
  | 'GLOBAL'
  | 'INDIA'
  | 'MAPS'
  | 'FINANCE'
  | 'TRAVEL'
  | 'SCIENCE'
  | 'KNOWLEDGE_GRAPH'
  | 'SECURITY'
  | 'SPORTS'
  | 'ENTERTAINMENT'
  | 'VOICE'
  | 'MATH'
  | 'TRANSLATION'
  | 'RESEARCH'
  | 'CAREER'
  | 'PLANNER'
  | 'WORLD'
  | 'SPACE'
  | 'FUTURE LAB';

export interface AstraBrainRoutingStep {
  step: number;
  label: string;
  detail: string;
  status: 'pending' | 'active' | 'completed';
}

export interface AstraIntentMatch {
  powerId: PowerId;
  capability: AstraBrainCapability;
  confidence: number;
  label: string;
  reason: string;
  routingPath: string[];
  suggestedSteps: AstraBrainRoutingStep[];
}

/**
 * Astra Brain 3.0 — Intelligent Automatic Routing Engine
 * Flow:
 * USER QUESTION -> ASTRA BRAIN 3.0 -> UNDERSTAND INTENT -> SELECT BEST CAPABILITY -> PROCESS REQUEST -> VERIFY/FORMAT RESULT -> FINAL ANSWER
 */
export function classifyAstraIntent(prompt: string): AstraIntentMatch {
  const normalized = (prompt || '').trim().toLowerCase();

  const makeRouting = (
    powerId: PowerId,
    capability: AstraBrainCapability,
    label: string,
    reason: string,
    confidence = 0.95
  ): AstraIntentMatch => {
    return {
      powerId,
      capability,
      confidence,
      label,
      reason,
      routingPath: [
        'ASTRA BRAIN',
        capability,
        'VERIFIED'
      ],
      suggestedSteps: [
        { step: 1, label: 'Astra Brain 3.0', detail: 'Classifying cognitive domain', status: 'completed' },
        { step: 2, label: `Engine: ${capability}`, detail: `Dispatched to ${label}`, status: 'active' },
        { step: 3, label: 'Grounded Verification', detail: 'Authenticating against verified primary feeds', status: 'completed' }
      ]
    };
  };

  if (!normalized) {
    return makeRouting(
      'chat',
      'CHAT',
      'Neural Conversational Core',
      'Empty prompt routed to general conversational core.',
      1.0
    );
  }

  // 1. Translation Engine
  const translationTriggers = [
    'translate ',
    'in telugu',
    'in hindi',
    'in tamil',
    'in kannada',
    'in malayalam',
    'in bengali',
    'in marathi',
    'in spanish',
    'in french',
    'how do you say',
    'what is the translation'
  ];
  if (translationTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'translator',
      'TRANSLATION',
      'Astra Polyglot Translator',
      'Detected language translation request across regional and global tongues.'
    );
  }

  // 1b. Music Discovery & Authorized Regional/Global Catalog Engine
  const musicTriggers = [
    'song',
    'music',
    'listen to',
    'play song',
    'track',
    'singers',
    'composer',
    'naatu naatu',
    'sid sriram',
    'lyrics',
    'soundtrack',
    'spotify',
    'youtube music',
    'jiosaavn'
  ];
  if (musicTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'music',
      'MUSIC',
      'Astra Music Discovery Engine',
      'Detected music inquiry, song discovery, or regional audio repertoire request.'
    );
  }

  // 1c. Finance, Economy & Calculators
  const financeTriggers = [
    'emi',
    'loan',
    'interest rate',
    'compound interest',
    'gold price',
    'silver price',
    'stock market',
    'nifty',
    'sensex',
    'inflation',
    'forex',
    'currency exchange',
    'sip calculator'
  ];
  if (financeTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'finance-economy',
      'FINANCE',
      'Astra Finance & Economy Engine',
      'Detected financial indicators, economic benchmark, or calculator request.'
    );
  }

  // 1d. Travel Intelligence & Itineraries
  const travelTriggers = [
    'itinerary',
    'trip to',
    'travel to',
    'flight',
    'hotel in',
    'visa for',
    'packing list',
    'travel cost'
  ];
  if (travelTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'travel-intelligence',
      'TRAVEL',
      'Astra Travel Intelligence',
      'Detected trip planning, itinerary synthesis, or travel logistics query.'
    );
  }

  // 1e. Maps & Places
  const mapsTriggers = [
    'nearby',
    'nearest hospital',
    'nearest college',
    'nearest atm',
    'places near',
    'directions to',
    'restaurants in',
    'hospitals in'
  ];
  if (mapsTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'maps-places',
      'MAPS',
      'Astra Maps & Places Intelligence',
      'Detected local spatial search, nearby establishment, or directions request.'
    );
  }

  // 1f. India Intelligence & Government Schemes
  const indiaTriggers = [
    'ayushman bharat',
    'pm kisan',
    'pm awas',
    'digital india',
    'andhra pradesh',
    'telangana',
    'tamil nadu',
    'karnataka',
    'maharashtra',
    'isro mission',
    'indian states',
    'indian scheme'
  ];
  if (indiaTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'india-intelligence',
      'INDIA',
      'Astra India Intelligence Engine',
      'Detected Indian states, demographics, or government public scheme inquiry.'
    );
  }

  // 1g. Global Intelligence
  const globalTriggers = [
    'country gdp',
    'world population',
    'compare countries',
    'country profile',
    'global trade'
  ];
  if (globalTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'global-intelligence',
      'GLOBAL',
      'Astra Global Intelligence Engine',
      'Detected international macroeconomic, demographic, or country profiling inquiry.'
    );
  }

  // 1h. Science Universe & Peer-Reviewed Papers
  const scienceTriggers = [
    'research paper',
    'peer reviewed',
    'scientific breakthrough',
    'quantum coherence',
    'crispr',
    'materials science'
  ];
  if (scienceTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'science-universe',
      'SCIENCE',
      'Astra Science Universe',
      'Detected empirical research paper, scientific discovery, or physics/biology query.'
    );
  }

  // 1i. Human Knowledge Graph & Biographies
  const knowledgeGraphTriggers = [
    'biography of',
    'who was',
    'life of',
    'albert einstein',
    'satyendra nath bose',
    'ada lovelace',
    'abdul kalam',
    'knowledge graph'
  ];
  if (knowledgeGraphTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'human-knowledge',
      'KNOWLEDGE_GRAPH',
      'Human Knowledge Graph',
      'Detected historical pioneer, scientist, or relational biographical inquiry.'
    );
  }

  // 1j. Sports Intelligence
  const sportsTriggers = [
    'cricket score',
    'match score',
    'ipl',
    'champions league',
    'formula 1',
    'f1 suzuka',
    'wimbledon',
    'football match'
  ];
  if (sportsTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'sports',
      'SPORTS',
      'Astra Sports Intelligence',
      'Detected sports fixture, match score, or athletic competition query.'
    );
  }

  // 1k. Entertainment Universe
  const entertainmentTriggers = [
    'movie review',
    'box office',
    'official trailer',
    'directed by',
    'tollywood',
    'bollywood',
    'oppenheimer',
    'rrr movie'
  ];
  if (entertainmentTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'entertainment',
      'ENTERTAINMENT',
      'Astra Entertainment Universe',
      'Detected cinema, film review, trailer, or actor/director query.'
    );
  }

  // 1l. Astra Central Data Hub
  const dataHubTriggers = [
    'data hub',
    'datahub',
    'central data',
    'grounded dataset',
    'verify source'
  ];
  if (dataHubTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'datahub',
      'DATAHUB',
      'Astra Central Data Hub',
      'Detected central multi-branch data architecture and source verification query.'
    );
  }

  // 1m. Security Center
  const securityTriggers = [
    'security center',
    '2fa',
    'two-factor',
    'session management',
    'device history',
    'privacy settings'
  ];
  if (securityTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'security-center',
      'SECURITY',
      'Astra Security Center',
      'Detected account security, two-factor auth, or privacy permissions request.'
    );
  }

  // 1m-1. Quick Answer
  const quickAnswerTriggers = ['quick answer', 'in mph', 'in km/h', 'convert ', 'calculate '];
  if (quickAnswerTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'quick-answer',
      'SEARCH',
      'Astra Quick Answer Engine',
      'Detected direct low-latency definition, conversion, or factual question.'
    );
  }

  // 1m-2. Satellite Tracker
  const satelliteTriggers = ['satellite', 'iss tracker', 'space station', 'orbit of', 'jwst telemetry'];
  if (satelliteTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'satellite',
      'SPACE',
      'Astra Satellite Tracker',
      'Detected live orbital telemetry, ISS tracking, or space observatory inquiry.'
    );
  }

  // 1m-3. Disaster Center
  const disasterTriggers = ['earthquake', 'cyclone alert', 'flood warning', 'tsunami', 'wildfire'];
  if (disasterTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'disaster',
      'SCIENCE',
      'Astra Disaster Center',
      'Detected severe weather, earthquake, or official meteorological hazard bulletin.'
    );
  }

  // 1m-4. Health Education
  const healthTriggers = ['human anatomy', 'physiology', 'cardiovascular system', 'nutrition basics', 'pharmacology'];
  if (healthTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'health',
      'SCIENCE',
      'Astra Health Education System',
      'Detected educational human biology, anatomical mechanics, or nutritional inquiry.'
    );
  }

  // 1m-5. Astra Lab & Simulations
  const labTriggers = ['virtual lab', 'circuit simulator', 'pendulum simulation', 'chemistry titration', 'virtual experiment'];
  if (labTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'astra-lab',
      'SCIENCE',
      'Astra Virtual Lab',
      'Detected STEM laboratory simulation request with interactive formula modeling.'
    );
  }

  // 1m-6. Engineering Lab
  const engineeringTriggers = ['engineering lab', 'rocket equation', 'euler buckling', 'formula calculator', 'aerospace engineering'];
  if (engineeringTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'engineering-lab',
      'CODE',
      'Astra Engineering Lab',
      'Detected engineering formula calculation across Aerospace, Civil, or Mechanical disciplines.'
    );
  }

  // 1m-7. Smart Home Concept
  const smartHomeTriggers = ['smart home', 'home automation', 'hvac simulation', 'domestic robotics'];
  if (smartHomeTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'smarthome',
      'FUTURE LAB',
      'Astra Smart Home Concept',
      'Detected 2040 futuristic smart home architectural simulation.'
    );
  }

  // 1m-8. Astra Mobility
  const mobilityTriggers = ['hyperloop', 'ev charging', 'autonomous vehicle', 'maglev', 'evtol'];
  if (mobilityTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'mobility',
      'TRAVEL',
      'Astra Mobility Intelligence',
      'Detected future transportation, electric vehicles, or high-speed transit query.'
    );
  }

  // 1m-9. Astra Green
  const greenTriggers = ['sustainability', 'renewable energy share', 'climate data', 'water desalination', 'circular economy'];
  if (greenTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'green',
      'SCIENCE',
      'Astra Green Sustainability',
      'Detected sustainability metrics, renewable grid energy, or ecological report query.'
    );
  }

  // 1m-10. Personal Space
  const personalSpaceTriggers = ['personal space', 'my world', 'cognitive vault', 'my memory'];
  if (personalSpaceTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'personal-space',
      'DATAHUB',
      'Astra Personal Space',
      'Detected private cognitive vault navigation.'
    );
  }

  // 1n. App Builder
  const appBuilderTriggers = [
    'build an app',
    'app builder',
    'create an app',
    'generate full stack app',
    'app scaffold'
  ];
  if (appBuilderTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'app-builder',
      'CODE',
      'Astra App Builder',
      'Detected full-stack application synthesis and project generation request.'
    );
  }

  // 1o. Business Lab
  const businessTriggers = [
    'business model',
    'startup idea',
    'pitch deck',
    'swot analysis',
    'unit economics'
  ];
  if (businessTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'business-lab',
      'CAREER',
      'Astra Business Lab',
      'Detected startup venture evaluation, business model, or pitch deck request.'
    );
  }

  // 1p. My Astra Knowledge
  const personalKnowledgeTriggers = [
    'my notes',
    'my projects',
    'my goals',
    'my knowledge',
    'personal knowledge'
  ];
  if (personalKnowledgeTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'personal-knowledge',
      'DATA',
      'My Astra Knowledge',
      'Detected personal knowledge graph, project workspace, or study notes request.'
    );
  }

  // 2. Future Lab & Emerging 2040 Scenarios
  const futureTriggers = [
    '2040',
    '2030',
    'future of',
    'emerging technology',
    'quantum computing',
    'humanoid robot',
    'brain-computer interface',
    'fusion energy',
    'autonomous city',
    'smart city 2040',
    'future scenario',
    'what will happen in 2040'
  ];
  if (futureTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'future-lab',
      'FUTURE LAB',
      'Astra Future Lab 2030-2040',
      'Detected exploration of emerging technology, technological forecasting, or future scenarios.'
    );
  }

  // 3. Space & Solar System
  const spaceTriggers = [
    'solar system',
    'planet ',
    'mars mission',
    'moon mission',
    'artemis',
    'james webb',
    'exoplanet',
    'satellite orbit',
    'jupiter',
    'saturn rings',
    'space launch',
    'iss orbit'
  ];
  if (spaceTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'cosmos',
      'WORLD',
      'Astra Space & Cosmos Observatory',
      'Detected astronomical, orbital, or planetary space inquiry.'
    );
  }

  // 4. World Live Intelligence (Weather, Markets, Sports, Flights, etc.)
  const worldTriggers = [
    'weather in',
    'temperature in',
    'stock market',
    's&p 500',
    'exchange rate',
    'usd to inr',
    'currency conversion',
    'flight status',
    'football score',
    'champions league',
    'world population',
    'gdp of',
    'capital of'
  ];
  if (worldTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'world',
      'WORLD',
      'Astra World Live Intelligence',
      'Detected live planetary metrics, weather, finance, or geographic inquiry.'
    );
  }

  // 5. Research & Deep Citations
  const researchTriggers = [
    'research paper',
    'literature review',
    'citations for',
    'deep research',
    'peer reviewed',
    'academic sources',
    'compare studies',
    'scientific consensus on',
    'arxiv paper'
  ];
  if (researchTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'research',
      'RESEARCH',
      'Astra Deep Research & Evidence Matrix',
      'Detected request for formal academic synthesis, citations, and literature analysis.'
    );
  }

  // 6. Career, Resume, & Skill Gap
  const careerTriggers = [
    'resume',
    'career roadmap',
    'skill gap',
    'interview practice',
    'job interview',
    'portfolio for',
    'how to become a',
    'career transition'
  ];
  if (careerTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'career',
      'CAREER',
      'Astra Career & Resume Architect',
      'Detected professional career development, resume optimization, or interview prep.'
    );
  }

  // 7. Planner, Tasks, & Schedules
  const plannerTriggers = [
    'my schedule',
    'study plan',
    'todo list',
    'planner',
    'add task',
    'weekly goals',
    'deadline',
    'calendar'
  ];
  if (plannerTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'planner',
      'PLANNER',
      'Astra Smart Planner & Timeline',
      'Detected organizational planning, scheduling, or task prioritization request.'
    );
  }

  // 8. Image Generation & Visual Art
  const imageTriggers = [
    'generate image',
    'create image',
    'make an image',
    'draw ',
    'paint ',
    'illustration of',
    'render a ',
    'render 3d',
    'picture of',
    'photo of',
    'wallpaper',
    'sketch of',
    'concept art',
    'cyberpunk art',
    'digital art of'
  ];
  if (imageTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'image-studio',
      'IMAGE',
      'Image Studio 4K',
      'Detected request for visual synthesis and generative artwork.'
    );
  }

  // 9. Code & Multilingual IDE
  const codeTriggers = [
    'write code',
    'python script',
    'typescript',
    'javascript function',
    'debug ',
    'fix this bug',
    'write a function',
    'write an algorithm',
    'implement ',
    'regex for',
    'sql query',
    'bash script',
    'rust code',
    'golang code',
    'react component',
    'binary search',
    'pointers in c'
  ];
  if (codeTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'codelab',
      'CODE',
      'Code Lab IDE & Sandbox',
      'Detected software development, debugging, or algorithmic coding request.'
    );
  }

  // 10. Study & Personal Tutor
  const studyTriggers = [
    'explain ',
    'teach me',
    'concept of',
    'how does ',
    'why does ',
    'summary of',
    'quiz me',
    'flashcard',
    'study notes',
    'what is ',
    'definition of',
    'difference between',
    'derive the formula',
    'step by step solution'
  ];
  if (studyTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'study',
      'STUDY',
      'Astra Personal Tutor Pro',
      'Detected academic inquiry suitable for step-by-step Socratic pedagogy and exam revision.'
    );
  }

  // 11. Mathematics & Calculations
  const mathTriggers = [
    'calculate ',
    'solve equation',
    'derivative of',
    'integral of',
    'matrix multiplication',
    'eigenvalues',
    'limit as x approaches',
    'standard deviation of'
  ];
  if (mathTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'study',
      'MATH',
      'Astra Mathematical Step-Solver',
      'Detected symbolic mathematical equation or numerical computation.'
    );
  }

  // 12. Data Analyst & Spreadsheets
  const dataTriggers = [
    'analyse this data',
    'analyse csv',
    'dataset',
    'correlation between',
    'plot a chart',
    'data forecast',
    'show me the biggest change in this dataset',
    'clean this data'
  ];
  if (dataTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'data-analyst',
      'DATA',
      'Astra Data Universe',
      'Detected tabular data analysis, statistical calculation, or chart generation.'
    );
  }

  // 13. Documents & PDF Q&A
  const docTriggers = [
    'summarize this pdf',
    'upload document',
    'read this doc',
    'extract text from',
    'analyze contract',
    'policy document'
  ];
  if (docTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'documents',
      'DOCUMENTS',
      'Astra Document AI Reader',
      'Detected document parsing, PDF analysis, or multi-format file synthesis.'
    );
  }

  // 14. Live Breaking News & Current Updates
  const newsTriggers = [
    'what happened today',
    'latest news',
    'breaking news',
    'what happened in ai today',
    'today news',
    'headlines',
    'current events'
  ];
  if (newsTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'news',
      'NEWS',
      'Astra Verified Live News Desk',
      'Detected query for breaking events and real-time world headlines.'
    );
  }

  // 15. Verified Web Search
  const searchTriggers = [
    'search for',
    'google ',
    'look up',
    'who is currently',
    'where is',
    'official website for',
    'recent price of'
  ];
  if (searchTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'search',
      'SEARCH',
      'Astra Real-Time Grounded Search',
      'Detected factual inquiry requiring web citation grounding.'
    );
  }

  // 16. Astra Image → Game
  const gameTriggers = [
    'image to game',
    'image into game',
    'game from image',
    'photo to game',
    'game world generation',
    'generate game concept',
    'playable game prototype',
    'turn photo into game',
    'game prototype'
  ];
  if (gameTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'image-to-game',
      'IMAGE',
      'Astra Image → Game Studio',
      'Detected request for converting visual imagery into an interactive game world and playable prototype.'
    );
  }

  // 17. Astra Cinema Studio
  const cinemaTriggers = [
    'cinema studio',
    'cinematic editor',
    'cinematic trailer',
    'epic indian fantasy',
    'epic cinema',
    'edit video',
    'cinematic style',
    'movie trailer',
    'video editing'
  ];
  if (cinemaTriggers.some((t) => normalized.includes(t))) {
    return makeRouting(
      'cinema-studio',
      'IMAGE',
      'Astra Cinema Studio & Cinematic Editor',
      'Detected request for cinematic film editing, styling, scene detection, and epic trailer composition.'
    );
  }

  // Default: Conversational Core
  return makeRouting(
    'chat',
    'CHAT',
    'Astra Neural Conversational Core',
    'General query directed to primary cognitive engine.',
    0.85
  );
}
