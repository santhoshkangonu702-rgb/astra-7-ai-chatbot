/**
 * Astra 7 — Intelligent Query Router & Intent Classifier
 * Categorizes user questions, determines live search requirements, and selects optimal reasoning models.
 */

export type QueryCategory =
  | 'GENERAL'
  | 'GENERAL_KNOWLEDGE'
  | 'SCIENCE'
  | 'TECHNOLOGY'
  | 'EDUCATION'
  | 'CODING'
  | 'MATH'
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
  | 'DATA_ANALYSIS'
  | 'CURRENT_NEWS'
  | 'NEWS'
  | 'WEB_SEARCH'
  | 'SPORTS'
  | 'WEATHER'
  | 'BUSINESS'
  | 'HISTORY'
  | 'GEOGRAPHY'
  | 'TRAVEL'
  | 'ENTERTAINMENT'
  | 'CAREER'
  | 'RESEARCH'
  | 'CREATIVE'
  | 'KNOWLEDGE_HUB'
  | 'PROJECT_SPACES'
  | 'OTHER';

export type ToolRequired =
  | 'ai_knowledge'
  | 'web_search'
  | 'news_search'
  | 'document_search'
  | 'image_understanding'
  | 'data_analysis'
  | 'calculation'
  | 'multi_tool';

export type AnswerMode =
  | 'definition'
  | 'comparison'
  | 'coding'
  | 'mathematics'
  | 'research'
  | 'news'
  | 'study'
  | 'general';

export interface RouteDecision {
  category: QueryCategory;
  needCurrentInfo: boolean;
  toolRequired: ToolRequired;
  answerMode: AnswerMode;
  confidence: number;
  reason: string;
  detectedLanguage: 'en' | 'te' | 'hi' | 'mixed' | 'other';
  languageName: string;
  recommendedModel: string;
  temperature: number;
  suggestedActionLabel: string;
}

export class AstraAIRouter {
  private static LIVE_KEYWORDS = [
    'today', 'latest', 'current', 'breaking', 'news', 'recent', 'yesterday',
    'this week', 'this month', 'now', 'price of', 'stock price', 'crypto price',
    'bitcoin price', 'weather', 'forecast', 'temperature', 'score', 'scores',
    'match result', 'live match', 'who won', 'election', 'released', 'release date',
    '2025', '2026', 'update', 'status of', 'flight status', 'current prime minister',
    'current president', 'ceo of', 'standings', 'cricket score', 'ipl', 'medal tally'
  ];

  private static CODING_KEYWORDS = [
    'code', 'python', 'javascript', 'typescript', 'java', 'c++', 'golang', 'rust',
    'function', 'algorithm', 'debug', 'fix this error', 'syntax error', 'sql query',
    'database schema', 'react', 'tailwind', 'component', 'api route', 'regex',
    'html', 'css', 'class', 'struct', 'pointer', 'docker', 'git', 'compile', 'bug'
  ];

  private static MATH_KEYWORDS = [
    'calculate', 'derivative', 'integral', 'equation', 'solve for x', 'matrix',
    'probability', 'hypotenuse', 'pythagorean', 'algebra', 'calculus', 'logarithm',
    'geometry', 'standard deviation', 'quadratic', 'trigonometry', 'sin(', 'cos(',
    'limit as', 'factorize', 'polynomial', 'math problem', 'arithmetic', 'formula'
  ];

  private static WRITING_KEYWORDS = [
    'write an essay', 'draft an email', 'write an email', 'blog post', 'cover letter',
    'statement of purpose', 'sop', 'resume summary', 'rewrite', 'proofread',
    'paraphrase', 'speech for', 'poem', 'story about', 'article on', 'press release',
    'newsletter', 'social media post', 'linkedin post', 'tweet', 'composition'
  ];

  private static SCIENCE_KEYWORDS = [
    'photosynthesis', 'mitochondria', 'quantum', 'relativity', 'black hole', 'gravity',
    'thermodynamics', 'chemical reaction', 'periodic table', 'dna', 'crispr', 'evolution',
    'solar system', 'astronomy', 'plate tectonics', 'geology', 'physics', 'biology', 'chemistry'
  ];

  private static WEATHER_KEYWORDS = [
    'weather', 'forecast', 'temperature', 'rain today', 'humidity', 'wind speed',
    'sunny in', 'snow in', 'climate today'
  ];

  private static SPORTS_KEYWORDS = [
    'score', 'match', 'ipl', 'world cup', 'fifa', 'cricket', 'football score',
    'nba', 'champions league', 'tennis', 'olympics', 'medal tally', 'standings',
    'fc barcelona', 'real madrid', 'manchester united', 'arsenal', 'csk', 'rcb', 'mi'
  ];

  private static CREATIVE_KEYWORDS = [
    'startup idea', 'business idea', 'name ideas', 'brainstorm', 'slogan',
    'tagline', 'creative concept', 'pitch deck idea', 'invent', 'marketing campaign'
  ];

  private static IMAGE_KEYWORDS = [
    'generate image', 'create image', 'draw', 'picture of', 'sketch', 'illustration of',
    'render a', 'visualize a', 'generate a photo', 'wallpaper of', 'painting of'
  ];

  private static DATA_KEYWORDS = [
    'csv', 'excel', 'dataset', 'spreadsheet', 'data analysis', 'visualize data',
    'correlation', 'data summary', 'bar chart', 'histogram', 'regression'
  ];

  private static KNOWLEDGE_KEYWORDS = [
    'knowledge space', 'knowledge hub', 'my documents', 'in my files',
    'search my knowledge', 'indexed document', 'rag query', 'knowledge base', 'rag search'
  ];

  private static PROJECT_KEYWORDS = [
    'project space', 'my project', 'project task', 'project milestone',
    'project goal', 'project deliverable', 'project memory', 'kanban board', 'project roadmap'
  ];

  /**
   * Classify user query and decide routing parameters
   */
  public static route(
    message: string,
    hasAttachments = false,
    forceWebSearch = false
  ): RouteDecision {
    const raw = message.trim();
    const lower = raw.toLowerCase();

    // 1. Detect language
    const langInfo = this.detectLanguage(raw);

    // Answer mode detection
    let answerMode: AnswerMode = 'general';
    if (lower.startsWith('what is') || lower.startsWith('define ') || lower.startsWith('meaning of') || lower.includes('definition of')) {
      answerMode = 'definition';
    } else if (lower.includes(' vs ') || lower.includes('compare ') || lower.includes('difference between') || lower.includes('comparison of')) {
      answerMode = 'comparison';
    } else if (this.CODING_KEYWORDS.some(kw => lower.includes(kw))) {
      answerMode = 'coding';
    } else if (this.MATH_KEYWORDS.some(kw => lower.includes(kw))) {
      answerMode = 'mathematics';
    } else if (lower.includes('research ') || lower.includes('in-depth') || lower.includes('deep research') || lower.includes('comprehensive study')) {
      answerMode = 'research';
    } else if (this.LIVE_KEYWORDS.some(kw => lower.includes(kw))) {
      answerMode = 'news';
    } else if (lower.includes('explain') || lower.includes('teach me') || lower.includes('how to learn')) {
      answerMode = 'study';
    }

    // 2. If user explicitly toggled web search
    if (forceWebSearch) {
      return {
        category: 'WEB_SEARCH',
        needCurrentInfo: true,
        toolRequired: 'web_search',
        answerMode: answerMode === 'general' ? 'news' : answerMode,
        confidence: 0.99,
        reason: 'User explicitly activated live web search',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.3,
        suggestedActionLabel: 'Searching the web...'
      };
    }

    // 2b. Multimodal Media Intent Classification
    if (
      lower.includes('animate this') ||
      lower.includes('turn this image into video') ||
      lower.includes('turn this into a video') ||
      lower.includes('turn this into video') ||
      lower.includes('image to video') ||
      lower.includes('make this image move') ||
      lower.includes('bring this photo to life')
    ) {
      return {
        category: 'IMAGE_TO_VIDEO',
        needCurrentInfo: false,
        toolRequired: 'image_understanding',
        answerMode: 'general',
        confidence: 0.98,
        reason: 'Image-to-Video generation instruction with motion synthesis',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'veo-3.1-lite-generate-preview',
        temperature: 0.5,
        suggestedActionLabel: 'Preparing Veo video motion...'
      };
    }

    if (
      lower.includes('remove background') ||
      lower.includes('remove the background') ||
      lower.includes('make it rainy') ||
      lower.includes('change background') ||
      lower.includes('change the weather') ||
      lower.includes('turn into a painting') ||
      lower.includes('turn into painting') ||
      lower.includes('edit this image') ||
      lower.includes('edit the photo') ||
      lower.includes('change color to') ||
      lower.includes('add sunglasses')
    ) {
      return {
        category: 'IMAGE_EDITING',
        needCurrentInfo: false,
        toolRequired: 'image_understanding',
        answerMode: 'general',
        confidence: 0.97,
        reason: 'AI Image inpainting or conversational editing transformation',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-3.1-flash-image',
        temperature: 0.4,
        suggestedActionLabel: 'Transforming image with AI...'
      };
    }

    if (
      lower.includes('variation of this') ||
      lower.includes('different version') ||
      lower.includes('another style of this') ||
      lower.includes('vary this image')
    ) {
      return {
        category: 'IMAGE_VARIATION',
        needCurrentInfo: false,
        toolRequired: 'image_understanding',
        answerMode: 'general',
        confidence: 0.95,
        reason: 'Image variation and aesthetic style re-rendering',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-3.1-flash-image',
        temperature: 0.6,
        suggestedActionLabel: 'Creating visual variations...'
      };
    }

    if (
      lower.includes("what's in this image") ||
      lower.includes('what is in this image') ||
      lower.includes('analyze this image') ||
      lower.includes('analyze this photo') ||
      lower.includes('describe this picture') ||
      lower.includes('explain this image') ||
      lower.includes('identify this object')
    ) {
      return {
        category: 'IMAGE_ANALYSIS',
        needCurrentInfo: false,
        toolRequired: 'image_understanding',
        answerMode: 'study',
        confidence: 0.98,
        reason: 'Multimodal computer vision analysis & object recognition',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.2,
        suggestedActionLabel: 'Analyzing visual elements...'
      };
    }

    if (
      lower.includes('summarize this video') ||
      lower.includes('what happens in this video') ||
      lower.includes('analyze this video') ||
      lower.includes('video breakdown') ||
      lower.includes('key moments in this video')
    ) {
      return {
        category: 'VIDEO_ANALYSIS',
        needCurrentInfo: false,
        toolRequired: 'image_understanding',
        answerMode: 'study',
        confidence: 0.96,
        reason: 'Multimodal video comprehension and timeline synthesis',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.2,
        suggestedActionLabel: 'Analyzing video timeline...'
      };
    }

    if (
      lower.includes('create a video') ||
      lower.includes('generate a video') ||
      lower.includes('generate video') ||
      lower.includes('cinematic video about') ||
      lower.includes('make a video about') ||
      lower.includes('create a 10s video') ||
      lower.includes('create a 5s video')
    ) {
      return {
        category: 'VIDEO_GENERATION',
        needCurrentInfo: false,
        toolRequired: 'multi_tool',
        answerMode: 'general',
        confidence: 0.97,
        reason: 'Veo Text-to-Video generation pipeline requested',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'veo-3.1-lite-generate-preview',
        temperature: 0.7,
        suggestedActionLabel: 'Synthesizing Veo video script & motion...'
      };
    }

    if (
      lower.startsWith('create a photo of') ||
      lower.startsWith('create an image of') ||
      lower.startsWith('generate an image of') ||
      lower.startsWith('generate a picture of') ||
      lower.startsWith('draw a ') ||
      lower.startsWith('paint a ') ||
      this.IMAGE_KEYWORDS.some((kw) => lower.includes(kw))
    ) {
      return {
        category: 'IMAGE_GENERATION',
        needCurrentInfo: false,
        toolRequired: 'image_understanding',
        answerMode: 'general',
        confidence: 0.97,
        reason: 'Text-to-Image high-fidelity generation requested',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-3.1-flash-image',
        temperature: 0.7,
        suggestedActionLabel: 'Generating high-resolution artwork...'
      };
    }

    if (
      lower.includes('media gallery') ||
      lower.includes('my generated images') ||
      lower.includes('my generated videos') ||
      lower.includes('open gallery') ||
      lower.includes('show my library')
    ) {
      return {
        category: 'MEDIA_LIBRARY',
        needCurrentInfo: false,
        toolRequired: 'ai_knowledge',
        answerMode: 'general',
        confidence: 0.95,
        reason: 'User navigation to Astra Media Gallery & Library',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.3,
        suggestedActionLabel: 'Opening Media Library...'
      };
    }

    // 3. Document Analysis trigger
    if (
      hasAttachments ||
      lower.includes('this pdf') ||
      lower.includes('this document') ||
      lower.includes('this doc') ||
      lower.includes('uploaded file') ||
      lower.includes('the attached') ||
      lower.includes('attached file')
    ) {
      return {
        category: 'DOCUMENT_ANALYSIS',
        needCurrentInfo: false,
        toolRequired: 'document_search',
        answerMode: 'study',
        confidence: 0.95,
        reason: 'Document attachments or explicit document inquiry detected',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.2,
        suggestedActionLabel: 'Analyzing document...'
      };
    }

    // 3b. Knowledge Space trigger
    if (this.KNOWLEDGE_KEYWORDS.some((kw) => lower.includes(kw))) {
      return {
        category: 'KNOWLEDGE_HUB',
        needCurrentInfo: false,
        toolRequired: 'document_search',
        answerMode: 'research',
        confidence: 0.95,
        reason: 'Private Knowledge Space or document RAG query detected',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.2,
        suggestedActionLabel: 'Searching Knowledge Space...'
      };
    }

    // 3c. Project Space trigger
    if (this.PROJECT_KEYWORDS.some((kw) => lower.includes(kw))) {
      return {
        category: 'PROJECT_SPACES',
        needCurrentInfo: false,
        toolRequired: 'ai_knowledge',
        answerMode: 'general',
        confidence: 0.94,
        reason: 'Project workspace, task management, or project memory query detected',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.3,
        suggestedActionLabel: 'Accessing Project Space...'
      };
    }

    // 4. Data Analysis trigger
    if (this.DATA_KEYWORDS.some(kw => lower.includes(kw))) {
      return {
        category: 'DATA_ANALYSIS',
        needCurrentInfo: false,
        toolRequired: 'data_analysis',
        answerMode: 'general',
        confidence: 0.93,
        reason: 'Data table, CSV, or statistical dataset inquiry detected',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.2,
        suggestedActionLabel: 'Analyzing data metrics...'
      };
    }

    // 5. Image Generation trigger
    if (this.IMAGE_KEYWORDS.some((kw) => lower.includes(kw))) {
      return {
        category: 'IMAGE_TASK',
        needCurrentInfo: false,
        toolRequired: 'image_understanding',
        answerMode: 'general',
        confidence: 0.92,
        reason: 'Image generation prompt detected',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.7,
        suggestedActionLabel: 'Preparing image prompt...'
      };
    }

    // 6. Weather trigger
    if (this.WEATHER_KEYWORDS.some((kw) => lower.includes(kw))) {
      return {
        category: 'WEATHER',
        needCurrentInfo: true,
        toolRequired: 'web_search',
        answerMode: 'news',
        confidence: 0.94,
        reason: 'Live meteorological or atmospheric inquiry',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.2,
        suggestedActionLabel: 'Checking live weather...'
      };
    }

    // 7. Sports trigger
    if (this.SPORTS_KEYWORDS.some((kw) => lower.includes(kw))) {
      const isHistoricalSports = lower.includes('1990') || lower.includes('history of');
      const needLive = !isHistoricalSports && (lower.includes('score') || lower.includes('today') || lower.includes('latest') || lower.includes('current'));
      return {
        category: 'SPORTS',
        needCurrentInfo: needLive,
        toolRequired: needLive ? 'web_search' : 'ai_knowledge',
        answerMode: needLive ? 'news' : 'general',
        confidence: 0.91,
        reason: needLive ? 'Live sports score or tournament update' : 'Sports domain inquiry',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.3,
        suggestedActionLabel: needLive ? 'Retrieving live scores...' : 'Reviewing sports data...'
      };
    }

    // 8. Check for Live News & Current Information
    const hasLiveKeyword = this.LIVE_KEYWORDS.some((kw) => lower.includes(kw));
    if (hasLiveKeyword) {
      return {
        category: 'CURRENT_NEWS',
        needCurrentInfo: true,
        toolRequired: 'news_search',
        answerMode: 'news',
        confidence: 0.93,
        reason: 'Temporal anchors (today, latest, recent, prices) require verified live information',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.3,
        suggestedActionLabel: 'Searching the web for latest updates...'
      };
    }

    // 9. Translation trigger
    if (
      lower.includes('translate') ||
      lower.includes('in telugu') ||
      lower.includes('in hindi') ||
      lower.includes('telugu lo') ||
      lower.includes('hindi me') ||
      lower.includes('అర్ధం') ||
      lower.includes('అనువాదం') ||
      lower.includes('अनुवाद') ||
      lower.includes('meaning in')
    ) {
      return {
        category: 'TRANSLATION',
        needCurrentInfo: false,
        toolRequired: 'ai_knowledge',
        answerMode: 'definition',
        confidence: 0.96,
        reason: 'Linguistic translation or cross-lingual definition query',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.3,
        suggestedActionLabel: 'Translating...'
      };
    }

    // 10. Coding trigger
    if (this.CODING_KEYWORDS.some((kw) => lower.includes(kw))) {
      return {
        category: 'CODING',
        needCurrentInfo: false,
        toolRequired: 'ai_knowledge',
        answerMode: 'coding',
        confidence: 0.95,
        reason: 'Programming language, code synthesis, or debugging request',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.2,
        suggestedActionLabel: 'Constructing code solution...'
      };
    }

    // 11. Math trigger
    if (this.MATH_KEYWORDS.some((kw) => lower.includes(kw)) || /[\d\+\-\*\/\^=]{3,}/.test(lower)) {
      return {
        category: 'MATH',
        needCurrentInfo: false,
        toolRequired: 'calculation',
        answerMode: 'mathematics',
        confidence: 0.94,
        reason: 'Mathematical formula, calculation, or step-by-step proof',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.1,
        suggestedActionLabel: 'Calculating step-by-step...'
      };
    }

    // 12. Deep Research trigger
    if (lower.includes('research') || lower.includes('comprehensive report') || lower.includes('in-depth analysis')) {
      return {
        category: 'RESEARCH',
        needCurrentInfo: true,
        toolRequired: 'multi_tool',
        answerMode: 'research',
        confidence: 0.93,
        reason: 'Deep research multi-source synthesis request',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.3,
        suggestedActionLabel: 'Conducting deep research synthesis...'
      };
    }

    // 13. Science & Natural Phenomena
    if (this.SCIENCE_KEYWORDS.some((kw) => lower.includes(kw))) {
      return {
        category: 'SCIENCE',
        needCurrentInfo: false,
        toolRequired: 'ai_knowledge',
        answerMode: answerMode === 'general' ? 'study' : answerMode,
        confidence: 0.92,
        reason: 'Empirical scientific explanation or physical phenomena inquiry',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.3,
        suggestedActionLabel: 'Formulating scientific explanation...'
      };
    }

    // 14. Writing / Drafting trigger
    if (this.WRITING_KEYWORDS.some((kw) => lower.includes(kw))) {
      return {
        category: 'WRITING',
        needCurrentInfo: false,
        toolRequired: 'ai_knowledge',
        answerMode: 'general',
        confidence: 0.92,
        reason: 'Document creation, creative writing, or professional composition',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.7,
        suggestedActionLabel: 'Composing text...'
      };
    }

    // 15. Creative / Brainstorming
    if (this.CREATIVE_KEYWORDS.some((kw) => lower.includes(kw))) {
      return {
        category: 'CREATIVE',
        needCurrentInfo: false,
        toolRequired: 'ai_knowledge',
        answerMode: 'general',
        confidence: 0.9,
        reason: 'Ideation, naming, or conceptual brainstorming',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.8,
        suggestedActionLabel: 'Brainstorming concepts...'
      };
    }

    // 16. Education / Conceptual explanations
    if (
      lower.startsWith('what is') ||
      lower.startsWith('why is') ||
      lower.startsWith('how does') ||
      lower.startsWith('explain') ||
      lower.includes('teach me') ||
      lower.includes('concept of') ||
      lower.includes('difference between')
    ) {
      return {
        category: 'EDUCATION',
        needCurrentInfo: false,
        toolRequired: 'ai_knowledge',
        answerMode: answerMode === 'general' ? 'study' : answerMode,
        confidence: 0.88,
        reason: 'Pedagogical explanation, educational breakdown, or concept inquiry',
        detectedLanguage: langInfo.code,
        languageName: langInfo.name,
        recommendedModel: 'gemini-2.5-flash',
        temperature: 0.4,
        suggestedActionLabel: 'Preparing clear explanation...'
      };
    }

    // Default: General Knowledge
    return {
      category: 'GENERAL_KNOWLEDGE',
      needCurrentInfo: false,
      toolRequired: 'ai_knowledge',
      answerMode: answerMode,
      confidence: 0.85,
      reason: 'General multi-domain query handled via verified foundation knowledge',
      detectedLanguage: langInfo.code,
      languageName: langInfo.name,
      recommendedModel: 'gemini-2.5-flash',
      temperature: 0.5,
      suggestedActionLabel: 'Thinking...'
    };
  }

  /**
   * Multi-lingual auto-detection supporting English, Telugu, Hindi, and mixed
   */
  private static detectLanguage(text: string): {
    code: 'en' | 'te' | 'hi' | 'mixed' | 'other';
    name: string;
  } {
    const hasTelugu = /[\u0C00-\u0C7F]/.test(text);
    const hasHindi = /[\u0900-\u097F]/.test(text);
    const lower = text.toLowerCase();

    // Check romanized keywords
    const isRomanizedTelugu =
      lower.includes('cheppu') ||
      lower.includes('enti') ||
      lower.includes('ela') ||
      lower.includes('telugu lo') ||
      lower.includes('undhi') ||
      lower.includes('kavali');

    const isRomanizedHindi =
      lower.includes('batao') ||
      lower.includes('kya hai') ||
      lower.includes('kaise') ||
      lower.includes('hindi me') ||
      lower.includes('chahiye') ||
      lower.includes('hoga');

    if (hasTelugu || isRomanizedTelugu) {
      return { code: 'te', name: 'Telugu (తెలుగు)' };
    }

    if (hasHindi || isRomanizedHindi) {
      return { code: 'hi', name: 'Hindi (हिंदी)' };
    }

    return { code: 'en', name: 'English' };
  }
}
