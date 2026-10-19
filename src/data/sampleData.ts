import { UserProfile, Flashcard, QuizQuestion, SearchCitation, UserCollection, FlashcardDeck, QuizDeck, AIAgent, SatelliteData, PlanetData, SpaceMission } from '../types';

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-student-01',
    name: 'Alex Rivera',
    email: 'alex.rivera@student.astra7.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'student',
    tier: 'pro',
    createdAt: '2025-01-15T09:00:00Z',
    preferences: {
      language: 'English',
      theme: 'light',
      accentColor: 'purple',
      animations: true,
      soundEffects: true,
      notifications: true,
      hapticFeedback: true,
      speechVoice: 'Zephyr'
    }
  },
  {
    id: 'user-creator-02',
    name: 'Maya Patel',
    email: 'maya@creativestudio.ai',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    role: 'creator',
    tier: 'pro',
    createdAt: '2025-02-10T14:30:00Z',
    preferences: {
      language: 'English',
      theme: 'light',
      accentColor: 'blue',
      animations: true,
      soundEffects: true,
      notifications: true,
      hapticFeedback: true,
      speechVoice: 'Kore'
    }
  },
  {
    id: 'user-dev-03',
    name: 'David Kim',
    email: 'david.kim@codecraft.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'developer',
    tier: 'pro',
    createdAt: '2025-01-01T00:00:00Z',
    preferences: {
      language: 'English',
      theme: 'light',
      accentColor: 'pink',
      animations: true,
      soundEffects: false,
      notifications: true,
      hapticFeedback: false,
      speechVoice: 'Puck'
    }
  }
];

export const INITIAL_USER_COLLECTIONS: UserCollection[] = [
  {
    id: 'col-bronze-age',
    userId: 'user-historian-01',
    name: 'Bronze Age Masterpieces',
    description: 'Crucial surviving metalwork and monuments across the Mediterranean and Near East from 3000 to 1000 BCE.',
    objectIds: ['obj-tutankhamun-mask', 'obj-code-of-hammurabi', 'obj-dancing-girl-mohenjodaro', 'obj-mask-of-agamemnon', 'obj-priams-treasure-diadem'],
    createdAt: '2025-02-01T12:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    color: '#D4AF37'
  },
  {
    id: 'col-lost-wonders',
    userId: 'user-historian-01',
    name: 'Lost & Destroyed World Heritage',
    description: 'Documented artifacts and structures whose physical form has been lost or destroyed through conflict or disasters.',
    objectIds: ['obj-colossus-of-rhodes', 'obj-amber-room-panels', 'obj-ark-of-the-covenant'],
    createdAt: '2025-02-10T15:00:00Z',
    updatedAt: '2026-02-28T08:00:00Z',
    color: '#E06D53'
  }
];

export const SAMPLE_SCHOLAR_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    front: 'What is the primary significance of the Rosetta Stone?',
    back: 'It provided the key to deciphering ancient Egyptian hieroglyphs because it contained the identical decree carved in Hieroglyphs, Demotic, and Ancient Greek.',
    hint: 'Discovered in 1799 near Rashid, deciphered by Champollion in 1822.',
    category: 'Archaeology & Epigraphy',
    difficulty: 'beginner'
  },
  {
    id: 'fc-2',
    front: 'Explain the mechanism and significance of the Antikythera Mechanism.',
    back: 'It is a Hellenistic geared analog computer (c. 150–100 BCE) with over 30 bronze gears that accurately predicted planetary motions, solar/lunar eclipses, and Olympic calendar cycles.',
    hint: 'Often referred to as the world\'s oldest analog computer.',
    category: 'History of Technology',
    difficulty: 'advanced'
  },
  {
    id: 'fc-3',
    front: 'What was the legal principle of "lex talionis" in Hammurabi’s Code?',
    back: 'The law of equivalent retribution (colloquially "an eye for an eye"), where the punishment was intended to mirror the specific injury inflicted on the victim of equal social rank.',
    hint: 'Old Babylonian law carved on a diorite stele c. 1750 BCE.',
    category: 'Legal History',
    difficulty: 'intermediate'
  },
  {
    id: 'fc-4',
    front: 'What is lost-wax (cire perdue) casting in Bronze Age metallurgy?',
    back: 'A process where a duplicate metal sculpture is cast from an original wax model. The wax is melted out of a clay mold and replaced with molten bronze, exemplified by the Mohenjo-daro Dancing Girl.',
    hint: 'Used in Harappan and Greek bronze art.',
    category: 'Metallurgy & Art',
    difficulty: 'intermediate'
  }
];

export const SAMPLE_SCHOLAR_QUIZ: QuizQuestion[] = [
  {
    id: 'q-1',
    question: 'Which ancient scholar and linguist achieved the breakthrough decipherment of the Egyptian Hieroglyphs in 1822?',
    options: [
      'Heinrich Schliemann',
      'Jean-François Champollion',
      'Howard Carter',
      'Arthur Evans'
    ],
    correctIndex: 1,
    explanation: 'Jean-François Champollion published his historic letter to Bon-Joseph Dacier in 1822, demonstrating that hieroglyphs represented both phonetic sounds and ideograms.',
    topic: 'Archaeological Decipherment'
  },
  {
    id: 'q-2',
    question: 'What caused the collapse and destruction of the Colossus of Rhodes in 226 BCE?',
    options: [
      'A Roman siege led by Mummius',
      'A major earthquake that fractured its knees',
      'A tidal wave in the Aegean Sea',
      'Destruction by Persian invaders'
    ],
    correctIndex: 1,
    explanation: 'According to Strabo and Pliny, an intense earthquake struck Rhodes in 226 BCE, snapping the bronze statue at its knees after standing for only 54 years.',
    topic: 'Ancient Greek Wonders'
  },
  {
    id: 'q-3',
    question: 'The Sutton Hoo Mound 1 ship burial in England is widely associated with which Anglo-Saxon ruler?',
    options: [
      'King Alfred the Great',
      'King Offa of Mercia',
      'King Rædwald of East Anglia',
      'King Athelstan'
    ],
    correctIndex: 2,
    explanation: 'Dating of the Merovingian coins (c. 620–625 CE) strongly supports attribution to King Rædwald, high king of East Anglia mentioned in Bede\'s Ecclesiastical History.',
    topic: 'Early Medieval Europe'
  }
];

export const SAMPLE_QUIZZES: QuizDeck[] = [
  {
    id: 'deck-ancient-archaeology',
    title: 'Ancient World Archaeology',
    subject: 'History & Archaeology',
    questions: SAMPLE_SCHOLAR_QUIZ
  },
  {
    id: 'deck-classical-wonders',
    title: 'Classical Engineering & Art',
    subject: 'History of Technology',
    questions: [
      SAMPLE_SCHOLAR_QUIZ[1],
      SAMPLE_SCHOLAR_QUIZ[0],
      SAMPLE_SCHOLAR_QUIZ[2]
    ]
  }
];

export const SAMPLE_FLASHCARDS: FlashcardDeck[] = [
  {
    id: 'deck-fc-artifacts',
    title: 'Foundational Artifacts & Epigraphy',
    subject: 'Archaeology',
    cards: SAMPLE_SCHOLAR_FLASHCARDS
  },
  {
    id: 'deck-fc-metallurgy',
    title: 'Ancient Science & Metallurgy',
    subject: 'Technology History',
    cards: [
      SAMPLE_SCHOLAR_FLASHCARDS[1],
      SAMPLE_SCHOLAR_FLASHCARDS[3],
      SAMPLE_SCHOLAR_FLASHCARDS[0]
    ]
  }
];

export const SAMPLE_DATASET_CSV = `Artifact_ID,Name,Civilization,Date_Start,Material,Status,Museum
JE-60672,Gold Mask of Tutankhamun,Ancient Egypt,-1323,Gold & Lapis Lazuli,Surviving,Egyptian Museum Cairo
BM-EA24,The Rosetta Stone,Ptolemaic Egypt,-196,Granodiorite,Fragmentary,British Museum
LOUVRE-Sb-8,Code of Hammurabi,Mesopotamian,-1750,Diorite,Surviving,Musée du Louvre
NAM-X15087,Antikythera Mechanism,Ancient Greek,-150,Bronze,Fragmentary,National Archaeological Museum Athens
SM-AM-21300,Bust of Nefertiti,Ancient Egypt,-1345,Limestone & Stucco,Surviving,Neues Museum Berlin
LOST-GRE-001,Colossus of Rhodes,Ancient Greek,-280,Bronze,Destroyed,Destroyed in Antiquity
QIN-SHI-K001,Terracotta Kneeling Archer,Ancient China,-210,Terracotta,Surviving,Emperor Qinshihuang Museum
ND-IM-HR5721,Dancing Girl,Indus Valley,-2300,Bronze,Surviving,National Museum New Delhi
BM-1939.1010.1,Sutton Hoo Helmet,Anglo-Saxon,600,Iron & Tinned Bronze,Partially Surviving,British Museum
NAM-GR-624,Mask of Agamemnon,Mycenaean Greece,-1550,Gold Foil,Surviving,National Archaeological Museum Athens
BM-Af1909.0513.1,Queen Idia Pendant Mask,Kingdom of Benin,1520,Ivory & Iron,Surviving,British Museum
LOST-RUS-002,Amber Room Panels,Imperial Russia,1701,Amber & Gold,Lost,Lost in WWII`;

// ----------------------------------------------------------------------
// Specialized Astra AI Agents
// ----------------------------------------------------------------------

export const DEFAULT_AGENTS: AIAgent[] = [
  {
    id: 'agent-researcher',
    name: 'Astra Researcher',
    slug: 'researcher',
    role: 'Deep Academic & Multi-Source Synthesis',
    avatar: 'Search',
    badge: 'Deep Search',
    description: 'Conducts deep research sweeps, cross-examines sources, verifies claims, and drafts comprehensive citations.',
    systemPrompt: 'You are Astra Researcher. Provide deeply factual, rigorous synthesis backed by citations, dates, peer-reviewed methodology, and clear confidence levels.',
    capabilities: ['Academic Synthesis', 'Citation Extraction', 'Cross-Verification', 'Source Reliability Scoring'],
    knowledgeSources: ['Semantic Scholar', 'ArXiv Index', 'Institutional Archives', 'Global Web Index'],
    suggestedPrompts: [
      'Investigate the dating controversies surrounding the Antikythera Mechanism',
      'Compare bronze metallurgy techniques in Shang China vs Mycenaean Greece',
      'Summarize current peer-reviewed research on James Webb exoplanet atmospheric spectra'
    ],
    color: '#38BDF8',
    enabled: true,
    category: 'research'
  },
  {
    id: 'agent-historian',
    name: 'Astra Historian',
    slug: 'historian',
    role: 'Chronological & Cultural Context Specialist',
    avatar: 'BookOpen',
    badge: 'Historical AI',
    description: 'Specializes in ancient civilizations, dynastic lineages, archaeological discoveries, and historiographical debates.',
    systemPrompt: 'You are Astra Historian. Provide deep chronological clarity, distinguish verified facts from legends, note geographical shifts, and connect historical causality.',
    capabilities: ['Chronological Analysis', 'Civilization Mapping', 'Primary Source Epigraphy', 'Provenance Tracking'],
    knowledgeSources: ['Ancient World Mapping Center', 'Corpus Inscriptionum', 'UNESCO World Heritage DB'],
    suggestedPrompts: [
      'Detail the diplomatic correspondence preserved in the Amarna Letters',
      'Trace the transmission of Greco-Roman philosophy through Islamic Golden Age scholars',
      'Explain the collapse of Bronze Age Mediterranean trade routes in 1177 BCE'
    ],
    color: '#A855F7',
    enabled: true,
    category: 'history'
  },
  {
    id: 'agent-ancient-objects',
    name: 'Astra Ancient Objects',
    slug: 'ancient-objects',
    role: 'Curatorial Antiquities & Provenance Expert',
    avatar: 'Landmark',
    badge: 'Antiquities',
    description: 'Curates authentic archaeological artifacts, verifies museum custody, tracks lost or looted treasures, and verifies imagery.',
    systemPrompt: 'You are Astra Ancient Objects. You verify object authenticity, strictly differentiate original photographs from historical illustrations or reconstructions, and provide exact dates.',
    capabilities: ['Museum Provenance', 'Material Analysis', 'Survival Status Tracking', 'Image Verification'],
    knowledgeSources: ['British Museum Catalog', 'Louvre Inventory', 'Metropolitan Museum API', 'Perseus Project'],
    suggestedPrompts: [
      'What objects from the Royal Cemetery of Ur survived intact?',
      'Detail the verified provenance and rediscovery of the Rosetta Stone in 1799',
      'Show missing or looted antiquities from the Baghdad Museum 2003 inventory'
    ],
    color: '#F59E0B',
    enabled: true,
    category: 'history'
  },
  {
    id: 'agent-coder',
    name: 'Astra Coder',
    slug: 'coder',
    role: 'Algorithmic Architecture & System Engineering',
    avatar: 'Code2',
    badge: 'Full-Stack',
    description: 'Writes clean TypeScript, React, algorithms, database schemas, and architectural patterns with mathematical rigor.',
    systemPrompt: 'You are Astra Coder. Write performant, type-safe, elegant code. Explain time and space complexity, and provide edge-case handling.',
    capabilities: ['TypeScript & React', 'System Architecture', 'API Optimization', 'Algorithmic Debugging'],
    knowledgeSources: ['ECMAScript Spec', 'PostgreSQL Internals', 'Node.js Runtime', 'Web Performance'],
    suggestedPrompts: [
      'Write a zero-dependency orbital position calculator for satellite coordinates',
      'Implement an astronomical BCE/CE date parsing and sorting module in TypeScript',
      'Optimize a virtualized gallery component for 5,000 museum artifacts'
    ],
    color: '#10B981',
    enabled: true,
    category: 'technical'
  },
  {
    id: 'agent-analyst',
    name: 'Astra Analyst',
    slug: 'analyst',
    role: 'Quantitative & Statistical Intelligence',
    avatar: 'LineChart',
    badge: 'Analytics',
    description: 'Extracts statistical correlations, uncovers hidden outliers, analyzes CSVs and financial models with visual clarity.',
    systemPrompt: 'You are Astra Analyst. Formulate clear hypotheses, verify data integrity, compute descriptive metrics, and highlight actionable insights.',
    capabilities: ['Statistical Modeling', 'Outlier Detection', 'Trend Forecasting', 'Metric Synthesis'],
    knowledgeSources: ['Quantitative Finance Engine', 'Tabular Analytics Core', 'Distribution Visualizers'],
    suggestedPrompts: [
      'Analyze artifact survival rates grouped by primary material composition',
      'Forecast satellite deployment trajectories over the next decade',
      'Identify distribution skews in chronological artifact collection datasets'
    ],
    color: '#06B6D4',
    enabled: true,
    category: 'technical'
  },
  {
    id: 'agent-writer',
    name: 'Astra Writer',
    slug: 'writer',
    role: 'Stylistic Prose & Narrative Architecture',
    avatar: 'PenTool',
    badge: 'Prose Studio',
    description: 'Crafts persuasive essays, immersive historical narratives, speeches, and editorial prose with cadence and precision.',
    systemPrompt: 'You are Astra Writer. Write with captivating resonance, structural elegance, rhythmic variation, and evocative yet disciplined diction.',
    capabilities: ['Narrative Fiction & Non-Fiction', 'Persuasive Essays', 'Speechwriting', 'Editorial Polishing'],
    knowledgeSources: ['Literary Canon', 'Rhetorical Frameworks', 'Style Guides'],
    suggestedPrompts: [
      'Write a cinematic narrative from the perspective of an astronomer in Alexandria in 150 BCE',
      'Draft an editorial on why ancient cultural heritage belongs to collective human posterity',
      'Create an evocative essay contrasting the cosmic void with human archaeological memory'
    ],
    color: '#EC4899',
    enabled: true,
    category: 'creation'
  },
  {
    id: 'agent-teacher',
    name: 'Astra Teacher',
    slug: 'teacher',
    role: 'Socratic Concept Mastery & Step-by-Step Learning',
    avatar: 'GraduationCap',
    badge: 'Socratic Tutor',
    description: 'Breaks complex concepts into intuitive analogies, checks understanding with interactive questions, and adapts to student level.',
    systemPrompt: 'You are Astra Teacher. Follow the core teaching rules: explain simply, break into small steps, encourage critical thinking, use analogies, and end with a quick summary.',
    capabilities: ['Socratic Scaffolding', 'Adaptive Explanations', 'Step-by-Step Math/Science', 'Diagnostic Quizzing'],
    knowledgeSources: ['Pedagogical Curriculum', 'Cognitive Science Framework', 'STEM Knowledge Base'],
    suggestedPrompts: [
      'Explain how carbon-14 radiometric dating works using an intuitive hourglass analogy',
      'Walk me step-by-step through calculating the orbital velocity of the ISS',
      'Help me understand the decipherment of Egyptian hieroglyphs through the Rosetta Stone'
    ],
    color: '#8B5CF6',
    enabled: true,
    category: 'creation'
  },
  {
    id: 'agent-planner',
    name: 'Astra Planner',
    slug: 'planner',
    role: 'Strategic Execution & Project Architecture',
    avatar: 'Compass',
    badge: 'Strategy',
    description: 'Transforms ambiguous goals into structured roadmaps, timelines, task dependencies, and risk mitigation plans.',
    systemPrompt: 'You are Astra Planner. Create structured, realistic, dependency-aware plans with milestone gates and resource considerations.',
    capabilities: ['Gantt Roadmapping', 'Dependency Resolution', 'Risk Assessment', 'Resource Scheduling'],
    knowledgeSources: ['Agile & Critical Path Method', 'Systems Thinking', 'Operational Management'],
    suggestedPrompts: [
      'Create a 6-month field expedition and conservation plan for an archaeological site',
      'Build a study syllabus to master ancient Mediterranean history in 12 weeks',
      'Design a launch checklist for deploying a high-throughput museum API'
    ],
    color: '#F97316',
    enabled: true,
    category: 'operations'
  },
  {
    id: 'agent-translator',
    name: 'Astra Translator',
    slug: 'translator',
    role: 'Polyglot & Historical Epigraphy Engine',
    avatar: 'Languages',
    badge: 'Linguistics',
    description: 'Translates between modern languages and translates classical idioms, ancient Greek, Latin, and Classical Arabic roots.',
    systemPrompt: 'You are Astra Translator. Preserve cultural nuance, stylistic tone, etymology, and morphological precision across modern and classical languages.',
    capabilities: ['Etymological Breakdown', 'Classical Latin & Greek', 'Idiomatic Nuance', 'Multi-Language Parallelization'],
    knowledgeSources: ['Oxford Latin Dictionary', 'Liddell-Scott-Jones Greek Lexicon', 'Comparative Linguistics Corpus'],
    suggestedPrompts: [
      'Translate the opening of the Rosetta Stone Decree into modern English with Greek term notes',
      'Translate this technical research summary into French, German, and Mandarin',
      'Explain the Proto-Indo-European root origins of the word "Astra" and "Star"'
    ],
    color: '#14B8A6',
    enabled: true,
    category: 'creation'
  },
  {
    id: 'agent-creative',
    name: 'Astra Creative',
    slug: 'creative',
    role: 'Worldbuilding, Concept Art Direction & Ideation',
    avatar: 'Sparkles',
    badge: 'Ideation',
    description: 'Brainstorms innovative concepts, sci-fi worldbuilding, speculative futures, visual prompts, and lateral problem solutions.',
    systemPrompt: 'You are Astra Creative. Unleash imaginative yet coherent worldbuilding, visual art prompts, speculative futures, and creative analogies.',
    capabilities: ['Speculative Worldbuilding', 'Prompt Engineering', 'Brainstorming Frameworks', 'Aesthetic Direction'],
    knowledgeSources: ['Aesthetic Archetypes', 'Speculative Fiction History', 'Design Systems'],
    suggestedPrompts: [
      'Worldbuild a civilization living inside a hollowed-out asteroid with artificial biomes',
      'Design three distinct conceptual architectures for an orbital deep-space museum',
      'Brainstorm 10 speculative inventions inspired by ancient Antikythera clockwork'
    ],
    color: '#D946EF',
    enabled: true,
    category: 'creation'
  },
  {
    id: 'agent-data',
    name: 'Astra Data',
    slug: 'data',
    role: 'Relational Modeling & Tabular Computation',
    avatar: 'Database',
    badge: 'Data Engine',
    description: 'Inspects relational structures, generates SQL queries, cleans datasets, and analyzes large collections.',
    systemPrompt: 'You are Astra Data. Focus on data normalization, schema optimization, relational integrity, and fast tabular transforms.',
    capabilities: ['SQL Generation', 'Schema Normalization', 'Missing Value Audit', 'JSON/CSV Transformation'],
    knowledgeSources: ['PostgreSQL & SQLite Specs', 'Data Engineering Patterns', 'Relational Calculus'],
    suggestedPrompts: [
      'Write a PostgreSQL query to rank museum objects by date confidence and material diversity',
      'Generate a schema for tracking artifact restitution claims and institutional provenance',
      'Clean and normalize this archaeological stratigraphy log'
    ],
    color: '#6366F1',
    enabled: true,
    category: 'technical'
  }
];

// ----------------------------------------------------------------------
// Astra Cosmos Satellite Telemetry & Planetary Data
// ----------------------------------------------------------------------

export const SATELLITE_DATA: SatelliteData[] = [
  {
    id: 'sat-iss',
    name: 'International Space Station (ISS)',
    noradId: '25544',
    type: 'Crewed Space Station',
    orbitAltitudeKm: 420,
    velocityKmS: 7.66,
    latitude: 51.64,
    longitude: -12.45,
    periodMinutes: 92.68,
    launchYear: 1998,
    operator: 'NASA / Roscosmos / ESA / JAXA / CSA',
    missionObjective: 'Microgravity and space environment research laboratory supporting continuous human presence in low Earth orbit.',
    status: 'active'
  },
  {
    id: 'sat-jwst',
    name: 'James Webb Space Telescope (JWST)',
    noradId: '50463',
    type: 'Deep Space Infrared Observatory',
    orbitAltitudeKm: 1500000,
    velocityKmS: 0.22,
    latitude: 0,
    longitude: 0,
    periodMinutes: 8760,
    launchYear: 2021,
    operator: 'NASA / ESA / CSA',
    missionObjective: 'Observing the earliest stars and galaxies formed after the Big Bang, study planetary systems and exoplanet atmospheres at Sun-Earth L2 Lagrange point.',
    status: 'active'
  },
  {
    id: 'sat-hubble',
    name: 'Hubble Space Telescope (HST)',
    noradId: '20580',
    type: 'Optical & UV Space Observatory',
    orbitAltitudeKm: 535,
    velocityKmS: 7.59,
    latitude: 28.5,
    longitude: 45.2,
    periodMinutes: 95.4,
    launchYear: 1990,
    operator: 'NASA / ESA',
    missionObjective: 'Providing revolutionary deep-field imagery, cosmic expansion measurements, and multi-wavelength planetary observations for over three decades.',
    status: 'active'
  },
  {
    id: 'sat-tiangong',
    name: 'Tiangong Space Station',
    noradId: '48274',
    type: 'Modular Space Station',
    orbitAltitudeKm: 390,
    velocityKmS: 7.68,
    latitude: 41.5,
    longitude: 105.8,
    periodMinutes: 92.2,
    launchYear: 2021,
    operator: 'CMSA (China)',
    missionObjective: 'Long-term orbital science facility conducting space medicine, fundamental physics, and astronomical surveys with the Xuntian telescope.',
    status: 'active'
  },
  {
    id: 'sat-chandra',
    name: 'Chandra X-ray Observatory',
    noradId: '25867',
    type: 'High-Energy Astrophysical Observatory',
    orbitAltitudeKm: 133000,
    velocityKmS: 2.14,
    latitude: 14.2,
    longitude: -88.6,
    periodMinutes: 3840,
    launchYear: 1999,
    operator: 'NASA / Smithsonian SAO',
    missionObjective: 'Detecting X-ray emission from very hot regions of the Universe, such as exploded stars, clusters of galaxies, and matter around black holes.',
    status: 'active'
  },
  {
    id: 'sat-starlink',
    name: 'Starlink Constellation Cluster (Avg)',
    noradId: '70001',
    type: 'Low-Latency Broadband Constellation',
    orbitAltitudeKm: 550,
    velocityKmS: 7.59,
    latitude: 33.2,
    longitude: -118.4,
    periodMinutes: 95.6,
    launchYear: 2019,
    operator: 'SpaceX',
    missionObjective: 'Providing global low-latency satellite internet coverage through autonomous inter-satellite laser links and phased-array antennas.',
    status: 'active'
  }
];

export const PLANET_DATA: PlanetData[] = [
  {
    name: 'Mercury',
    type: 'Terrestrial',
    distanceFromSunAU: 0.39,
    radiusKm: 2439.7,
    massEarthRelative: 0.055,
    moonsCount: 0,
    orbitalPeriodDays: 88,
    surfaceTempC: '-180 to 430°C',
    atmosphere: ['Trace Sodium', 'Potassium', 'Helium'],
    features: ['Caloris Basin', 'Extensive scarps', 'No magnetic atmosphere cushion']
  },
  {
    name: 'Venus',
    type: 'Terrestrial',
    distanceFromSunAU: 0.72,
    radiusKm: 6051.8,
    massEarthRelative: 0.815,
    moonsCount: 0,
    orbitalPeriodDays: 224.7,
    surfaceTempC: '465°C (Average)',
    atmosphere: ['96.5% Carbon Dioxide', '3.5% Nitrogen', 'Sulfuric Acid clouds'],
    features: ['Runaway greenhouse effect', 'Retrograde rotation', 'Super-rotating atmosphere']
  },
  {
    name: 'Earth',
    type: 'Terrestrial',
    distanceFromSunAU: 1.0,
    radiusKm: 6371.0,
    massEarthRelative: 1.0,
    moonsCount: 1,
    orbitalPeriodDays: 365.25,
    surfaceTempC: '-88 to 58°C (15°C avg)',
    atmosphere: ['78% Nitrogen', '21% Oxygen', '1% Argon/CO2/Water'],
    features: ['Liquid water oceans', 'Active plate tectonics', 'Abundant biosphere']
  },
  {
    name: 'Mars',
    type: 'Terrestrial',
    distanceFromSunAU: 1.52,
    radiusKm: 3389.5,
    massEarthRelative: 0.107,
    moonsCount: 2,
    orbitalPeriodDays: 687,
    surfaceTempC: '-140 to 20°C (-63°C avg)',
    atmosphere: ['95% CO2', '2.6% Nitrogen', '1.9% Argon'],
    features: ['Olympus Mons (highest volcano)', 'Valles Marineris canyon', 'Subsurface ice deposits']
  },
  {
    name: 'Jupiter',
    type: 'Gas Giant',
    distanceFromSunAU: 5.2,
    radiusKm: 69911,
    massEarthRelative: 317.8,
    moonsCount: 95,
    orbitalPeriodDays: 4333,
    surfaceTempC: '-110°C (Cloud tops)',
    atmosphere: ['90% Hydrogen', '10% Helium', 'Methane/Ammonia traces'],
    features: ['Great Red Spot anticyclone', 'Powerful magnetosphere', 'Ocean moon Europa']
  },
  {
    name: 'Saturn',
    type: 'Gas Giant',
    distanceFromSunAU: 9.58,
    radiusKm: 58232,
    massEarthRelative: 95.2,
    moonsCount: 146,
    orbitalPeriodDays: 10759,
    surfaceTempC: '-140°C',
    atmosphere: ['96% Hydrogen', '3% Helium', 'Ammonia crystals'],
    features: ['Spectacular ring system of ice particles', 'Hexagonal north polar jet', 'Titan hydrocarbon lakes']
  },
  {
    name: 'Uranus',
    type: 'Ice Giant',
    distanceFromSunAU: 19.2,
    radiusKm: 25362,
    massEarthRelative: 14.5,
    moonsCount: 28,
    orbitalPeriodDays: 30687,
    surfaceTempC: '-195°C',
    atmosphere: ['83% Hydrogen', '15% Helium', '2% Methane'],
    features: ['Extreme 98° axial tilt', 'Retrograde rotation', 'Faint ring system']
  },
  {
    name: 'Neptune',
    type: 'Ice Giant',
    distanceFromSunAU: 30.05,
    radiusKm: 24622,
    massEarthRelative: 17.1,
    moonsCount: 16,
    orbitalPeriodDays: 60190,
    surfaceTempC: '-201°C',
    atmosphere: ['80% Hydrogen', '19% Helium', '1.5% Methane'],
    features: ['Fastest planetary winds (2,100 km/h)', 'Great Dark Spot', 'Cryovolcanic moon Triton']
  }
];

export const SPACE_MISSIONS: SpaceMission[] = [
  {
    id: 'mission-artemis',
    name: 'Artemis II Lunar Orbital Mission',
    agency: 'NASA / CSA',
    target: 'Moon (Lunar Orbit)',
    launchDate: '2025-2026',
    status: 'planned',
    type: 'Human Deep Space Exploration',
    highlights: 'First crewed mission beyond low Earth orbit since Apollo 17, testing Orion life-support systems on a lunar free-return trajectory.'
  },
  {
    id: 'mission-clipper',
    name: 'Europa Clipper',
    agency: 'NASA / JPL',
    target: 'Jupiter’s Moon Europa',
    launchDate: 'October 2024',
    status: 'active',
    type: 'Outer Solar System Astrobiology',
    highlights: 'Conducting dozens of low-altitude flybys of Europa to investigate its subsurface liquid ocean, ice shell thickness, and potential habitability.'
  },
  {
    id: 'mission-voyager1',
    name: 'Voyager 1 Interstellar Mission',
    agency: 'NASA',
    target: 'Interstellar Space',
    launchDate: 'September 1977',
    status: 'active',
    type: 'Interstellar Probe',
    highlights: 'Humanity’s most distant technological object, currently over 24 billion kilometers from Earth in interstellar space, transmitting plasma telemetry.'
  },
  {
    id: 'mission-perseverance',
    name: 'Perseverance Rover & Ingenuity',
    agency: 'NASA',
    target: 'Mars (Jezero Crater)',
    launchDate: 'July 2020',
    status: 'active',
    type: 'Planetary Surface Astrobiology',
    highlights: 'Caching Martian core samples of ancient delta sediment for future return to Earth, demonstrating autonomous rotorcraft flight in thin atmosphere.'
  }
];
