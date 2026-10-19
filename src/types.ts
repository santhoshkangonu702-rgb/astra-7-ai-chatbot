/**
 * Astra 7 — Core Types & Interfaces
 * "One AI. Seven Powers. Limitless Knowledge."
 */

export type PowerId =
  | 'home'
  | 'tools'
  | 'chat'
  | 'search'
  | 'news'
  | 'study'
  | 'codelab'
  | 'documents'
  | 'image-studio'
  | 'voice'
  | 'data-analyst'
  | 'writer'
  | 'memory'
  | 'more'
  | 'history'
  | 'settings'
  | 'profile'
  | 'tool-assistant'
  | 'tool-writer'
  | 'tool-study'
  | 'tool-ideas'
  | 'tool-resume'
  | 'tool-code'
  | 'tool-image'
  | 'tool-more'
  | 'explore'
  | 'agents'
  | 'cosmos'
  | 'projects'
  | 'knowledge'
  | 'files'
  | 'scholar'
  | 'create'
  | 'vision'
  | 'data'
  | 'library'
  | 'favorites'
  | 'admin'
  | 'navigator'
  | 'planner'
  | 'factcheck'
  | 'briefing'
  | 'workspace'
  | 'toolbox'
  | 'goalcoach'
  | 'meeting'
  | 'document-gen'
  | 'brandstudio'
  | 'compare-science'
  | 'analytics'
  | 'future-lab'
  | 'world-data'
  | 'world'
  | 'future-city'
  | 'space'
  | 'earth'
  | 'robotics'
  | 'spatial'
  | 'scenario'
  | 'scenarios'
  | 'personal-tutor'
  | 'career'
  | 'research'
  | 'privacy'
  | 'agent-builder'
  | 'creative-studio'
  | 'data-universe'
  | 'translator'
  | 'digital-twin'
  | 'twin'
  | 'discovery'
  | 'astra-brain'
  | 'image-to-game'
  | 'cinema-studio'
  | 'music'
  | 'datahub'
  | 'global-intelligence'
  | 'india-intelligence'
  | 'maps-places'
  | 'finance-economy'
  | 'travel-intelligence'
  | 'science-universe'
  | 'human-knowledge'
  | 'tech-radar'
  | 'gaming-intelligence'
  | 'entertainment'
  | 'sports'
  | 'app-builder'
  | 'business-lab'
  | 'security-center'
  | 'personal-knowledge'
  | 'quick-answer'
  | 'achievements'
  | 'satellite'
  | 'disaster'
  | 'health'
  | 'astra-lab'
  | 'engineering-lab'
  | 'smarthome'
  | 'mobility'
  | 'green'
  | 'socialstudio'
  | 'source-graph'
  | 'personal-space'
  | 'multi-agent'
  | 'help';

export type NexusThemeId =
  | 'aurora-gold'
  | 'ocean-blue'
  | 'cyber-sunset'
  | 'forest-green'
  | 'neon-purple'
  | 'minimal-white';

export type AppTheme = 'light' | 'dark' | 'pastel' | 'ocean' | NexusThemeId;
export type AccentColor = 'purple' | 'blue' | 'pink' | 'orange' | 'green' | 'cyan' | 'gold' | 'emerald';

export type AstraTheme = AppTheme | 'cosmic-astra' | 'cosmic-purple' | 'neon-intelligence' | 'obsidian-glass';

export type UserRole = 'guest' | 'student' | 'creator' | 'developer' | 'researcher' | 'admin' | 'historian';
export type SubscriptionTier = 'free' | 'pro';

export interface UserProfile {
  id: string;
  name: string;
  fullName?: string;
  username?: string;
  email: string;
  avatar: string;
  role: UserRole;
  tier: SubscriptionTier;
  plan?: SubscriptionTier;
  bio?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  accountStatus?: 'active' | 'pending_verification' | 'locked' | 'suspended';
  authProvider?: 'email_password' | 'phone_otp' | 'google';
  lastLoginAt?: string;
  securityScore?: number;
  createdAt: string;
  joinedDate?: string;
  preferences: {
    language: string;
    theme: AppTheme;
    accentColor: AccentColor;
    animations: boolean;
    soundEffects: boolean;
    notifications: boolean;
    hapticFeedback: boolean;
    reducedMotion?: boolean;
    speechVoice?: string;
  };
}

export interface UserSession {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  ip: string;
  userAgent: string;
  device: string;
  current: boolean;
}

export interface SecurityAuditLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  details: string;
}

export interface ProviderStatus {
  smsProvider: {
    name: string;
    configured: boolean;
    senderNumber?: string;
    mode: 'live' | 'unconfigured';
  };
  emailProvider: {
    name: string;
    configured: boolean;
    fromEmail?: string;
    mode: 'live' | 'unconfigured';
  };
  serverTime: string;
}

// ----------------------------------------------------------------------
// Astra 7 Idea Generator Types
// ----------------------------------------------------------------------
export interface IdeaCard {
  id: string;
  title: string;
  tagline: string;
  category: 'startup' | 'app' | 'website' | 'project' | 'business' | 'content' | 'college';
  description: string;
  targetAudience: string;
  feasibilityScore: number; // 1-100
  monetization: string;
  keyFeatures: string[];
  techStack?: string[];
  createdAt?: string;
}

// ----------------------------------------------------------------------
// Astra 7 Study Assistant Types
// ----------------------------------------------------------------------
export interface StudyFlashcard {
  id: string;
  question?: string;
  answer?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  front?: string;
  back?: string;
  category?: string;
}

export interface StudyQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ----------------------------------------------------------------------
// Astra 7 Resume Builder Types
// ----------------------------------------------------------------------
export interface ResumeSection {
  id: string;
  type: 'personal' | 'education' | 'skills' | 'projects' | 'experience' | 'certifications' | 'achievements' | 'languages' | 'interests';
  title: string;
  enabled: boolean;
  order: number;
}

export interface ResumePersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface ResumeData {
  personalInfo: ResumePersonalInfo;
  personal?: ResumePersonalInfo;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    highlights?: string[];
  }>;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets?: string[];
    bulletPoints?: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  projects: Array<{
    id: string;
    title: string;
    description: string;
    techStack: string[];
    link?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
  achievements?: string[];
  languages?: Array<{
    language: string;
    proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
  }>;
  interests?: string[];
  template?: 'modern-gradient' | 'executive-clean' | 'tech-minimal' | 'modern' | 'executive' | 'tech';
}

// ----------------------------------------------------------------------
// Astra 7 Code Assistant Types
// ----------------------------------------------------------------------
export type CodeLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'html'
  | 'css'
  | 'react'
  | 'java'
  | 'c'
  | 'cpp'
  | 'sql';

export type CodeAction =
  | 'explain'
  | 'generate'
  | 'debug'
  | 'improve'
  | 'convert'
  | 'format';

export interface CodeAssistantResult {
  id: string;
  language: CodeLanguage;
  action: CodeAction;
  originalCode?: string;
  processedCode: string;
  explanation: string;
  suggestions: string[];
  timestamp: string;
}

// ----------------------------------------------------------------------
// Astra 7 Image Creator Types
// ----------------------------------------------------------------------
export type ImageStyle =
  | 'realistic'
  | '3d'
  | 'anime'
  | 'illustration'
  | 'cinematic'
  | 'minimal'
  | 'fantasy'
  | 'product_photography'
  | string;

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3';

export interface GeneratedImageItem {
  id: string;
  prompt: string;
  style: ImageStyle;
  aspectRatio: AspectRatio;
  imageUrl: string;
  createdAt: string;
  saved?: boolean;
}

// ----------------------------------------------------------------------
// AI Agent System
// ----------------------------------------------------------------------

export interface AIAgent {
  id: string;
  name: string;
  slug: string;
  role: string;
  avatar: string;
  badge: string;
  description: string;
  systemPrompt: string;
  capabilities: string[];
  knowledgeSources: string[];
  suggestedPrompts: string[];
  color: string;
  enabled: boolean;
  category: 'research' | 'creation' | 'technical' | 'history' | 'operations';
}

// ----------------------------------------------------------------------
// Astra Cosmos Information & Telemetry System
// ----------------------------------------------------------------------

export interface SatelliteData {
  id: string;
  name: string;
  noradId: string;
  type: string;
  orbitAltitudeKm: number;
  velocityKmS: number;
  latitude: number;
  longitude: number;
  periodMinutes: number;
  launchYear: number;
  operator: string;
  missionObjective: string;
  status: 'active' | 'decommissioned' | 'orbit_decay';
}

export interface PlanetData {
  name: string;
  type: 'Terrestrial' | 'Gas Giant' | 'Ice Giant' | 'Dwarf Planet';
  distanceFromSunAU: number;
  radiusKm: number;
  massEarthRelative: number;
  moonsCount: number;
  orbitalPeriodDays: number;
  surfaceTempC: string;
  atmosphere: string[];
  features: string[];
}

export interface SpaceMission {
  id: string;
  name: string;
  agency: string;
  target: string;
  launchDate: string;
  status: 'active' | 'completed' | 'planned';
  type: string;
  highlights: string;
}

// ----------------------------------------------------------------------
// Astra History: Ancient Object & Archaeological Knowledge System
// ----------------------------------------------------------------------

export type ObjectType =
  | 'artifact'
  | 'structure'
  | 'site'
  | 'document'
  | 'artwork'
  | 'historical_event';

export type DatePrecision =
  | 'exact'
  | 'approximate'
  | 'range'
  | 'century'
  | 'period';

export type DateConfidence = 'high' | 'medium' | 'low';

export type ObjectStatus =
  | 'surviving'
  | 'partially_surviving'
  | 'damaged'
  | 'fragmentary'
  | 'destroyed'
  | 'lost'
  | 'missing'
  | 'stolen'
  | 'recovered'
  | 'buried'
  | 'undiscovered'
  | 'unknown'
  | 'disputed'
  | 'legendary';

export type ImageType =
  | 'authentic_photograph'
  | 'museum_photograph'
  | 'archaeological_photograph'
  | 'historical_photograph'
  | 'historical_drawing'
  | 'historical_painting'
  | 'manuscript_image'
  | 'scholarly_reconstruction'
  | '3d_reconstruction'
  | 'ai_reconstruction'
  | 'not_available';

export type VerificationStatus =
  | 'unverified'
  | 'partially_verified'
  | 'verified'
  | 'expert_reviewed';

export interface ImageMetadata {
  image_url: string;
  thumbnail_url?: string;
  image_type: ImageType;
  source_name: string;
  source_url: string;
  photographer?: string;
  copyright?: string;
  license: string;
  attribution: string;
  verification_status: VerificationStatus;
}

export interface ObjectReference {
  title: string;
  author?: string;
  institution?: string;
  year?: number | string;
  url?: string;
  accessDate?: string;
}

export interface AuditLogEntry {
  timestamp: string;
  changed_by: string;
  field: string;
  prev_value: any;
  new_value: any;
  reason?: string;
}

export interface HistoricalObject {
  id: string;
  object_id: string; // e.g. "MET-1923.44", "BM-EA24"
  name: string;
  alternative_names: string[];
  object_type: ObjectType;
  description: string;

  // Chronology & Dating
  date_display: string; // e.g. "c. 1323 BCE", "196 BCE"
  date_start: number; // astronomical year: -1323 for 1323 BCE, 800 for 800 CE
  date_end: number;
  date_precision: DatePrecision;
  date_confidence: DateConfidence;
  dating_method?: string; // e.g. "Radiocarbon C-14", "Epigraphic analysis", "Stratigraphy"
  date_source?: string;

  // Cultural & Geographical context
  civilization: string; // e.g. "Ancient Egyptian", "Greco-Roman", "Mesopotamian"
  culture?: string;
  period?: string; // e.g. "New Kingdom, 18th Dynasty", "Ptolemaic Period"
  region: string; // e.g. "Nile Valley, Upper Egypt"
  country: string; // Modern territory e.g. "Egypt", "Iraq", "Greece"
  coordinates?: {
    lat: number;
    lng: number;
    approximate: boolean;
  };

  // Physical specifications
  material: string[]; // e.g. ["Gold", "Lapis Lazuli", "Glass"]
  dimensions?: any; // e.g. "54 cm × 39.3 cm × 49 cm" or { height_cm, width_cm, weight_kg }
  weight?: string; // e.g. "10.23 kg"

  // Provenance & Discovery
  discovery_location: string;
  discovery_site?: any;
  discovery_date?: string; // e.g. "November 1922"
  discoverer?: string; // e.g. "Howard Carter & Lord Carnarvon"

  // Current Custody & Status
  current_location: string; // e.g. "Cairo, Egypt"
  museum: string; // e.g. "The Egyptian Museum, Cairo"
  status: ObjectStatus;
  approximate_year?: number;
  verification_level?: string;
  archaeological_period?: string;
  inscriptions?: any;

  // Visual Assets
  image: ImageMetadata;
  additional_images?: ImageMetadata[];

  // Historical Narrative
  history: string;
  significance: string;
  educational_summary?: {
    simple: string;
    student_questions: string[];
    key_takeaways: string[];
  };

  // Scholarly Evidence
  references: ObjectReference[];
  verification_status: VerificationStatus;
  data_completeness: number; // 0 to 100 percentage
  change_log?: AuditLogEntry[];

  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------------
// Astra Chat System & Multi-Purpose AI Assistant
// ----------------------------------------------------------------------

export type QueryCategory =
  | 'GENERAL'
  | 'GENERAL_KNOWLEDGE'
  | 'CURRENT_NEWS'
  | 'NEWS'
  | 'WEB_SEARCH'
  | 'SCIENCE'
  | 'TECHNOLOGY'
  | 'MATHEMATICS'
  | 'MATH'
  | 'HISTORY'
  | 'GEOGRAPHY'
  | 'BUSINESS'
  | 'TRAVEL'
  | 'ENTERTAINMENT'
  | 'CAREER'
  | 'RESEARCH'
  | 'EDUCATION'
  | 'CODING'
  | 'WRITING'
  | 'TRANSLATION'
  | 'DOCUMENT'
  | 'DOCUMENT_ANALYSIS'
  | 'RAG'
  | 'IMAGE'
  | 'IMAGE_TASK'
  | 'IMAGE_UPLOAD'
  | 'VIDEO_UPLOAD'
  | 'IMAGE_ANALYSIS'
  | 'VIDEO_ANALYSIS'
  | 'IMAGE_GENERATION'
  | 'IMAGE_EDITING'
  | 'IMAGE_VARIATION'
  | 'IMAGE_TO_VIDEO'
  | 'VIDEO_GENERATION'
  | 'VIDEO_EDITING'
  | 'MEDIA_TRANSFORMATION'
  | 'MEDIA_SEARCH'
  | 'MEDIA_LIBRARY'
  | 'SPORTS'
  | 'WEATHER'
  | 'CREATIVE'
  | 'OTHER';

export interface UserMemoryItem {
  id: string;
  category: 'fact' | 'preference' | 'project' | 'instruction';
  content: string;
  createdAt: string;
}

export interface VerifiedSource {
  id: number;
  title: string;
  url: string;
  domain: string;
  snippet?: string;
  reliabilityScore: number;
  authorOrOrg?: string;
  retrievedAt: string;
  isTrustedDomain: boolean;
}

export interface DocumentIntelligenceDoc {
  id: string;
  name: string;
  type: string;
  size: number;
  chunksCount: number;
  summary?: string;
  uploadedAt: string;
  content?: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio' | 'data';
  mimeType: string;
  url: string;
  size?: number;
  duration?: number;
  thumbnailUrl?: string;
  content?: string;
}

export interface GeneratedMediaPayload {
  id?: string;
  type: 'image' | 'video';
  url: string;
  originalUrl?: string;
  prompt: string;
  enhancedPrompt?: string;
  model: string;
  style?: string;
  aspectRatio?: string;
  duration?: number;
  operationName?: string;
  status?: 'preparing' | 'generating' | 'processing' | 'completed' | 'failed';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: MessageAttachment[];
  category?: QueryCategory;
  toolRequired?: string;
  answerMode?: string;
  answerLength?: 'short' | 'balanced' | 'detailed' | 'deep';
  sources?: VerifiedSource[];
  generatedMedia?: GeneratedMediaPayload;
  documentChunks?: Array<{
    id: string;
    docName: string;
    chunkIndex: number;
    snippet: string;
  }>;
  detectedLanguage?: string;
  status?: 'thinking' | 'searching' | 'analyzing' | 'preparing' | 'generating' | 'completed' | 'error';
  statusLabel?: string;
  isStreaming?: boolean;
  cached?: boolean;
  model?: string;
  ragSources?: Array<{
    title: string;
    objectId?: string;
    civilization?: string;
    url?: string;
  }>;
  suggestedActions?: string[];
  tokensUsed?: number;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  model: string;
  isPinned?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  tags?: string[];
}

// ----------------------------------------------------------------------
// Astra Search & Research System
// ----------------------------------------------------------------------

export type SearchMode = 'quick' | 'deep' | 'fact_check' | 'source_explorer';

export interface SearchCitation {
  id: number;
  title: string;
  domain: string;
  url: string;
  snippet: string;
  reliabilityScore: number;
  publishedDate?: string;
  authorOrOrg?: string;
}

export interface ResearchReport {
  id: string;
  query: string;
  mode: SearchMode;
  summary: string;
  structuredSections: Array<{
    heading: string;
    content: string;
    citations: number[];
  }>;
  factChecks?: Array<{
    claim: string;
    verdict: 'verified' | 'disputed' | 'unverified' | 'false';
    explanation: string;
    sources: number[];
  }>;
  citations: SearchCitation[];
  createdAt: string;
  readingTimeMinutes: number;
}

// ----------------------------------------------------------------------
// Astra Scholar System (Educational AI)
// ----------------------------------------------------------------------

export type ScholarSubject =
  | 'history'
  | 'science'
  | 'mathematics'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'geography'
  | 'computer_science'
  | 'literature'
  | 'economics'
  | 'engineering'
  | 'general_knowledge';

export type ScholarDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  category: string;
  difficulty: ScholarDifficulty;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  cards: Flashcard[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface QuizDeck {
  id: string;
  title: string;
  subject: string;
  questions: QuizQuestion[];
}

export interface ScholarLesson {
  id: string;
  title: string;
  subject: ScholarSubject;
  difficulty: ScholarDifficulty;
  conceptBreakdown: string;
  stepByStepGuide: string[];
  realWorldApplications: string[];
  practiceQuestions: string[];
  summary: string;
}

// ----------------------------------------------------------------------
// Astra Create (Content Workspace)
// ----------------------------------------------------------------------

export type CreateToolType =
  | 'writer'
  | 'rewrite'
  | 'summarize'
  | 'expand'
  | 'shorten'
  | 'grammar'
  | 'email'
  | 'essay'
  | 'story'
  | 'social_post'
  | 'blog'
  | 'ad_copy'
  | 'business_proposal'
  | 'resume'
  | 'translation'
  | 'brainstorm';

export type CreateTone =
  | 'professional'
  | 'academic'
  | 'casual'
  | 'visionary'
  | 'persuasive'
  | 'witty'
  | 'empathic'
  | 'poetic';

export type CreateLength = 'concise' | 'standard' | 'comprehensive' | 'exhaustive';

export interface CreateResult {
  id: string;
  tool: CreateToolType;
  title: string;
  prompt: string;
  content: string;
  tone: CreateTone;
  length: CreateLength;
  language: string;
  createdAt: string;
}

// ----------------------------------------------------------------------
// Astra Vision (Multimodal Analysis)
// ----------------------------------------------------------------------

export interface VisionAnalysisResult {
  id: string;
  imageUrl: string;
  description: string;
  detectedEntities: Array<{
    label: string;
    confidence: number;
    boundingBox?: [number, number, number, number];
  }>;
  extractedText?: string;
  diagramExplanation?: string;
  historicalContext?: string;
  certaintyLevel: 'high' | 'moderate' | 'uncertain' | 'speculative';
  safetyNotes?: string;
  timestamp: string;
}

// ----------------------------------------------------------------------
// Astra Data (Document & Spreadsheet Analyzer)
// ----------------------------------------------------------------------

export interface DataColumnStat {
  name: string;
  type: 'numeric' | 'categorical' | 'date' | 'text';
  count: number;
  nullCount: number;
  uniqueCount: number;
  min?: number | string;
  max?: number | string;
  mean?: number;
  median?: number;
}

export interface DataAnalysisResult {
  id: string;
  fileName: string;
  rowCount: number;
  colCount: number;
  columnStats: DataColumnStat[];
  summary: string;
  trends: string[];
  anomalies: string[];
  chartData?: {
    type: 'bar' | 'line' | 'pie';
    title: string;
    xAxisKey: string;
    series: Array<{ name: string; key: string; color?: string }>;
    data: Array<Record<string, any>>;
  };
  sampleRows: Array<Record<string, any>>;
  timestamp: string;
}

// ----------------------------------------------------------------------
// User Collections & Library
// ----------------------------------------------------------------------

export interface UserCollection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  objectIds: string[];
  createdAt: string;
  updatedAt: string;
  color?: string;
}

export interface SavedObject {
  id: string;
  objectId: string;
  userId: string;
  notes?: string;
  savedAt: string;
}

export interface LibraryItem {
  id: string;
  userId: string;
  type: 'conversation' | 'research_report' | 'saved_object' | 'collection' | 'created_doc' | 'analyzed_data' | 'artifact' | 'document' | string;
  title: string;
  snippet: string;
  targetId: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

// ----------------------------------------------------------------------
// Admin & AI Orchestration Settings
// ----------------------------------------------------------------------

export interface AIProviderConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | 'custom';
  activeModel: string;
  apiEndpoint?: string;
  temperature: number;
  maxOutputTokens: number;
  systemInstruction: string;
  isKeyConfigured: boolean;
}

export interface DatabaseStats {
  totalObjects: number;
  verifiedObjects: number;
  survivingObjects: number;
  lostObjects: number;
  destroyedObjects: number;
  missingObjects: number;
  civilizationCounts: Record<string, number>;
  countryCounts: Record<string, number>;
  museumCounts: Record<string, number>;
  periodCounts: Record<string, number>;
  materialCounts: Record<string, number>;
  dataCompletenessAverage: number;
}
