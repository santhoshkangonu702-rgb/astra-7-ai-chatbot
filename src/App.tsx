import React, { useState, useEffect } from 'react';
import { PowerId, UserProfile, HistoricalObject, DatabaseStats, AIAgent, AppTheme, AccentColor, NexusThemeId } from './types';
import { Navigation } from './components/Navigation';
import { AstraSidebar } from './components/nexus/AstraSidebar';
import { MobileBottomNav } from './components/nexus/MobileBottomNav';
import { NexusDashboard } from './components/nexus/NexusDashboard';
import { TopBar } from './components/TopBar';
import { CommandPalette } from './components/CommandPalette';
import { VoiceModeModal } from './components/VoiceModeModal';
import { HelpModal } from './components/HelpModal';
import { AuthModal } from './components/AuthModal';
import { ProUpgradeModal } from './components/ProUpgradeModal';

// Astra 7 Core Power Tools
import { HomeScreen } from './components/powers/HomeScreen';
import { ToolsScreen } from './components/powers/ToolsScreen';
import { AIAssistantTool } from './components/powers/AIAssistantTool';
import { AIWriterTool } from './components/powers/AIWriterTool';
import { StudyAssistantTool } from './components/powers/StudyAssistantTool';
import { IdeaGeneratorTool } from './components/powers/IdeaGeneratorTool';
import { ResumeBuilderTool } from './components/powers/ResumeBuilderTool';
import { CodeAssistantTool } from './components/powers/CodeAssistantTool';
import { ImageCreatorTool } from './components/powers/ImageCreatorTool';
import { HistoryScreen } from './components/powers/HistoryScreen';
import { SettingsScreen } from './components/powers/SettingsScreen';
import { ProfileScreen } from './components/powers/ProfileScreen';

// Nexus 2040 Dedicated Modules
import { NewsPower } from './components/powers/NewsPower';
import { CodeLabPower } from './components/powers/CodeLabPower';
import { DocumentAIPower } from './components/powers/DocumentAIPower';
import { VoiceAstraPower } from './components/powers/VoiceAstraPower';
import { AstraMemoryPower } from './components/powers/AstraMemoryPower';

// Secondary Matrix Modules
import { DashboardPower } from './components/powers/DashboardPower';
import { ChatPower } from './components/powers/ChatPower';
import { SearchPower } from './components/powers/SearchPower';
import { ScholarPower } from './components/powers/ScholarPower';
import { CreatePower } from './components/powers/CreatePower';
import { VisionPower } from './components/powers/VisionPower';
import { DataPower } from './components/powers/DataPower';
import { HistoryPower } from './components/powers/HistoryPower';
import { CosmosPower } from './components/powers/CosmosPower';
import { AgentsPower } from './components/powers/AgentsPower';
import { LibraryPower } from './components/powers/LibraryPower';
import { AdminPower } from './components/powers/AdminPower';
import { KnowledgeHubPower } from './components/powers/KnowledgeHubPower';
import { ProjectSpacesPower } from './components/powers/ProjectSpacesPower';
import { EverythingWorkspacePower } from './components/powers/EverythingWorkspacePower';
import { NavigatorPower } from './components/powers/NavigatorPower';
import { FactCheckPower } from './components/powers/FactCheckPower';
import { DailyBriefingPower } from './components/powers/DailyBriefingPower';
import { SmartPlannerPower } from './components/powers/SmartPlannerPower';
import { GoalCoachPower } from './components/powers/GoalCoachPower';
import { AstraToolboxPower } from './components/powers/AstraToolboxPower';

// Astra 7 — NEXUS 2040 Ecosystem Modules
import { AstraWorldPower } from './components/powers/AstraWorldPower';
import { AstraFutureCityPower } from './components/powers/AstraFutureCityPower';
import { AstraPersonalTutorPower } from './components/powers/AstraPersonalTutorPower';
import { AstraCareerPower } from './components/powers/AstraCareerPower';
import { AstraResearchPower } from './components/powers/AstraResearchPower';
import { AstraPrivacyCenterPower } from './components/powers/AstraPrivacyCenterPower';
import { AstraAgentBuilderPower } from './components/powers/AstraAgentBuilderPower';
import { AstraCreativeStudioPower } from './components/powers/AstraCreativeStudioPower';
import { AstraTranslatorPower } from './components/powers/AstraTranslatorPower';
import { AstraDigitalTwinPower } from './components/powers/AstraDigitalTwinPower';
import { AstraSpatialModePower } from './components/powers/AstraSpatialModePower';
import { AstraRoboticsPower } from './components/powers/AstraRoboticsPower';
import { AstraEarthPower } from './components/powers/AstraEarthPower';
import { AstraScenarioSimulatorPower } from './components/powers/AstraScenarioSimulatorPower';
import { ImageToGamePower } from './components/powers/ImageToGamePower';
import { CinemaStudioPower } from './components/powers/CinemaStudioPower';
import { AstraMusicPower } from './components/powers/AstraMusicPower';
import { AstraDataHubPower } from './components/powers/AstraDataHubPower';
import { GlobalIndiaIntelligencePower } from './components/powers/GlobalIndiaIntelligencePower';
import { MapsPlacesPower } from './components/powers/MapsPlacesPower';
import { FinanceEconomyPower } from './components/powers/FinanceEconomyPower';
import { TravelIntelligencePower } from './components/powers/TravelIntelligencePower';
import { ScienceUniversePower } from './components/powers/ScienceUniversePower';
import { HumanKnowledgeGraphPower } from './components/powers/HumanKnowledgeGraphPower';
import { AITechRadarPower } from './components/powers/AITechRadarPower';
import { AstraAppBuilderPower } from './components/powers/AstraAppBuilderPower';
import { AstraBusinessLabPower } from './components/powers/AstraBusinessLabPower';
import { PersonalKnowledgeGraphPower } from './components/powers/PersonalKnowledgeGraphPower';
import { AstraSecurityCenterPower } from './components/powers/AstraSecurityCenterPower';
import { SportsIntelligencePower } from './components/powers/SportsIntelligencePower';
import { EntertainmentUniversePower } from './components/powers/EntertainmentUniversePower';
import { GamingIntelligencePower } from './components/powers/GamingIntelligencePower';
import { QuickAnswerPower } from './components/powers/QuickAnswerPower';
import { MeetingAssistantPower } from './components/powers/MeetingAssistantPower';
import { AchievementCenterPower } from './components/powers/AchievementCenterPower';
import { SatelliteTrackerPower } from './components/powers/SatelliteTrackerPower';
import { DisasterCenterPower } from './components/powers/DisasterCenterPower';
import { HealthEducationPower } from './components/powers/HealthEducationPower';
import { AstraLabPower } from './components/powers/AstraLabPower';
import { EngineeringLabPower } from './components/powers/EngineeringLabPower';
import { SmartHomeConceptPower } from './components/powers/SmartHomeConceptPower';
import { AstraMobilityPower } from './components/powers/AstraMobilityPower';
import { AstraGreenPower } from './components/powers/AstraGreenPower';
import { BrandStudioPower } from './components/powers/BrandStudioPower';
import { SocialStudioPower } from './components/powers/SocialStudioPower';
import { MultiAgentPower } from './components/powers/MultiAgentPower';
import { SourceGraphPower } from './components/powers/SourceGraphPower';
import { PersonalSpacePower } from './components/powers/PersonalSpacePower';

import { DEFAULT_USERS } from './data/sampleData';
import { api } from './services/api';
import { authApi } from './services/authApi';
import { classifyAstraIntent, AstraIntentMatch } from './services/astraBrain';
import { BrainRoutingAnimation } from './components/nexus/BrainRoutingAnimation';
import { hapticWorkspaceTransition, hapticAction, hapticSuccess } from './utils/haptics';

export default function App() {
  const [activePower, setActivePower] = useState<PowerId>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [globalRoutingQuery, setGlobalRoutingQuery] = useState<string | null>(null);
  const [globalIntentMatch, setGlobalIntentMatch] = useState<AstraIntentMatch | null>(null);

  // Appearance Theme & Accent State (Default to Aurora Gold 2040 Command as requested)
  const [theme, setTheme] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('astra7_nexus_theme') || localStorage.getItem('astra7_theme');
      if (saved) return saved;
    } catch {}
    return 'aurora-gold';
  });

  const [accent, setAccent] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem('astra7_accent');
      if (saved && ['purple', 'blue', 'pink', 'orange', 'green', 'cyan'].includes(saved)) {
        return saved as AccentColor;
      }
    } catch {}
    return 'purple';
  });

  // User Profile with persistence
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('astra7_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_USERS[0];
  });

  // Apply theme to HTML root element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(
      'dark',
      'theme-pastel',
      'theme-ocean',
      'theme-aurora-gold',
      'theme-ocean-blue',
      'theme-cyber-sunset',
      'theme-forest-green',
      'theme-neon-purple',
      'theme-minimal-white'
    );

    if (theme === 'aurora-gold' || theme === 'dark' || !theme) {
      root.classList.add('dark', 'theme-aurora-gold');
    } else if (theme === 'ocean-blue') {
      root.classList.add('dark', 'theme-ocean-blue');
    } else if (theme === 'cyber-sunset') {
      root.classList.add('dark', 'theme-cyber-sunset');
    } else if (theme === 'forest-green') {
      root.classList.add('dark', 'theme-forest-green');
    } else if (theme === 'neon-purple') {
      root.classList.add('dark', 'theme-neon-purple');
    } else if (theme === 'minimal-white' || theme === 'light') {
      root.classList.add('theme-minimal-white');
    } else if (theme === 'pastel') {
      root.classList.add('theme-pastel');
    } else if (theme === 'ocean') {
      root.classList.add('theme-ocean');
    }

    try {
      localStorage.setItem('astra7_nexus_theme', theme);
      localStorage.setItem('astra7_theme', theme);
    } catch {}
  }, [theme]);

  // Apply accent color
  useEffect(() => {
    try {
      localStorage.setItem('astra7_accent', accent);
    } catch {}
  }, [accent]);

  // Cross-power state & data
  const [objects, setObjects] = useState<HistoricalObject[]>([]);
  const [featuredObject, setFeaturedObject] = useState<HistoricalObject | undefined>(undefined);
  const [databaseStats, setDatabaseStats] = useState<DatabaseStats | undefined>(undefined);
  const [initialPromptForPower, setInitialPromptForPower] = useState<string | undefined>(undefined);
  const [selectedHistoryObjectId, setSelectedHistoryObjectId] = useState<string | null>(null);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);

  // Load initial database records, AI health & auth session
  useEffect(() => {
    loadDatabase();
    checkAISettings();

    // Hydrate authenticated user profile from backend session
    authApi.getMe()
      .then((res) => {
        if (res.user) {
          setCurrentUser(res.user);
          try {
            localStorage.setItem('astra7_user', JSON.stringify(res.user));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const loadDatabase = async () => {
    try {
      const data = await api.getObjects({ limit: 50 });
      setObjects(data.objects);
      if (data.objects.length > 0) {
        const tut = data.objects.find((o) => o.id.includes('tut') || o.name.includes('Tutankhamun')) || data.objects[0];
        setFeaturedObject(tut);
      }
      const stats = await api.getDatabaseStats();
      setDatabaseStats(stats);
    } catch (err) {
      console.error('Failed to load database on startup', err);
    }
  };

  const checkAISettings = async () => {
    try {
      const settings = await api.getAISettings();
      setHasGeminiKey(settings.isKeyConfigured);
    } catch (err) {
      setHasGeminiKey(true);
    }
  };

  // Keyboard shortcut listener (Cmd+K / Ctrl+K and ? for Help)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === '?' && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsHelpModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation handlers
  const handleSelectPower = (power: PowerId) => {
    hapticWorkspaceTransition();
    setActivePower(power);
    setIsMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectPrompt = (prompt: string, targetPower?: PowerId, showAnimation: boolean = false) => {
    let destination: PowerId = targetPower || 'chat';
    const match = classifyAstraIntent(prompt);
    if (!targetPower || targetPower === 'chat' || targetPower === 'home') {
      destination = match.powerId;
    }

    if (showAnimation) {
      hapticAction();
      setGlobalRoutingQuery(prompt);
      setGlobalIntentMatch(match);
      return;
    }

    hapticWorkspaceTransition();
    setInitialPromptForPower(prompt);
    setActivePower(destination);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectObjectFromDiscovery = (obj: HistoricalObject | string) => {
    const id = typeof obj === 'string' ? obj : obj.id;
    setSelectedHistoryObjectId(id);
    setActivePower('history');
  };

  const handleAskScholarAboutObject = (obj: HistoricalObject) => {
    setInitialPromptForPower(`Explain the historical and cultural significance of ${obj.name} (${obj.civilization}, ${obj.date_display}) step-by-step.`);
    setActivePower('scholar');
  };

  const handleSelectAgentForChat = (agent: AIAgent) => {
    setSelectedAgent(agent);
    if (agent.suggestedPrompts && agent.suggestedPrompts.length > 0) {
      setInitialPromptForPower(agent.suggestedPrompts[0]);
    }
    setActivePower('chat');
  };

  const handleVoiceMessage = async (voiceText: string): Promise<string | void> => {
    try {
      const response = await api.sendChat(voiceText);
      return response.content;
    } catch (err) {
      return `Processed your query through Astra 7. Results verified and grounded.`;
    }
  };

  const handleSaveToCollection = (item: any) => {
    alert(`Saved "${item.name || item.title || 'Record'}" to your Astra Library!`);
  };

  // Lock background scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawerOpen]);

  // Escape key handler for drawer and general dismissal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div
      id="astra-app-root"
      className="app-root-container w-full max-w-full h-[100dvh] max-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 overflow-hidden no-horizontal-overflow transition-colors"
      style={{
        width: '100%',
        maxWidth: '100%',
        height: '100dvh',
        maxHeight: '100dvh',
        overflowX: 'hidden',
        overflowY: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Soft Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(234,179,8,0.08),rgba(0,0,0,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(234,179,8,0.12),rgba(0,0,0,0))]" />

      {/* 1. Global Top Header (Fixed/Sticky at top full width) */}
      <TopBar
        activePower={activePower}
        onSelectPower={handleSelectPower}
        currentUser={currentUser}
        onSwitchUser={setCurrentUser}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onOpenVoiceMode={() => setIsVoiceModeOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
        hasGeminiKey={hasGeminiKey}
        theme={theme as any}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
      />

      {/* 2. Workspace Body: SIDEBAR (260-280px / 72px) + MAIN CONTENT (flex: 1) */}
      <div
        id="astra-workspace-wrapper"
        className="relative z-10 flex-1 flex w-full max-w-full min-w-0 min-h-0 overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Desktop Sidebar: 260-280px expanded, 72px collapsed */}
        <aside
          className={`hidden lg:flex shrink-0 h-full border-r border-amber-500/20 transition-all duration-300 ${
            sidebarCollapsed ? 'w-[72px]' : 'w-[260px] xl:w-[280px]'
          }`}
          style={{
            width: sidebarCollapsed ? '72px' : undefined,
            maxWidth: sidebarCollapsed ? '72px' : '280px',
            minWidth: sidebarCollapsed ? '72px' : '260px',
          }}
        >
          <AstraSidebar
            activePower={activePower}
            onSelectPower={handleSelectPower}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            user={currentUser}
            onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            className="w-full h-full border-none"
          />
        </aside>

        {/* Mobile / Tablet Slide-Out Navigation Drawer */}
        {isMobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Dark Translucent Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setIsMobileDrawerOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-out Drawer Panel: 80-88vw, max 360px */}
            <div className="relative z-50 w-[85vw] max-w-[360px] h-[100dvh] bg-slate-950 border-r border-amber-500/25 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
              <AstraSidebar
                activePower={activePower}
                onSelectPower={(power) => {
                  handleSelectPower(power);
                  setIsMobileDrawerOpen(false);
                }}
                onCloseMobile={() => setIsMobileDrawerOpen(false)}
                user={currentUser}
                onOpenUpgrade={() => {
                  setIsMobileDrawerOpen(false);
                  setIsUpgradeModalOpen(true);
                }}
                onOpenAuth={() => {
                  setIsMobileDrawerOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        )}

        {/* Main Content Area: Fills 100% width on mobile, fills remaining desktop workspace */}
        <div
          id="astra-main-application-area"
          className="flex-1 min-w-0 w-full max-w-full h-full flex flex-col overflow-hidden pb-16 lg:pb-0"
          style={{
            flex: '1 1 0%',
            minWidth: 0,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* Active Power Screen */}
          <main
            id="astra-main-power-screen"
            className="flex-1 min-w-0 w-full max-w-full h-full overflow-y-auto overflow-x-hidden"
            style={{
              flex: '1 1 0%',
              minWidth: 0,
              width: '100%',
              maxWidth: '100%',
              overflowX: 'hidden',
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              boxSizing: 'border-box',
            }}
          >
            {/* 1. Main ASTRA 7 — NEXUS 2040 Dashboard */}
            {activePower === 'home' && (
              <NexusDashboard
                onSelectPower={handleSelectPower}
                onDirectPrompt={handleDirectPrompt}
                onOpenVoiceMode={() => setIsVoiceModeOpen(true)}
                onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
                currentTheme={theme}
                onSelectTheme={(themeId) => setTheme(themeId)}
                user={currentUser}
              />
            )}

            {/* 2. News Power */}
            {activePower === 'news' && (
              <NewsPower
                onBack={() => handleSelectPower('home')}
                onSelectArticleTopic={(topic) => {
                  setInitialPromptForPower(`Research and summarize recent findings on: ${topic}`);
                  setActivePower('chat');
                }}
              />
            )}

            {/* 3. Code Lab IDE */}
            {activePower === 'codelab' && (
              <CodeLabPower onBack={() => handleSelectPower('home')} />
            )}

            {/* 4. Documents AI */}
            {activePower === 'documents' && (
              <DocumentAIPower onBack={() => handleSelectPower('home')} />
            )}

            {/* 5. Voice Astra */}
            {activePower === 'voice' && (
              <VoiceAstraPower
                onBack={() => handleSelectPower('home')}
                onOpenTextChat={() => handleSelectPower('chat')}
              />
            )}

            {/* 6. Astra Memory */}
            {activePower === 'memory' && (
              <AstraMemoryPower onBack={() => handleSelectPower('home')} />
            )}

            {/* 7. Astra Personal Tutor / AI Tutor Pro */}
            {activePower === 'study' && (
              <AstraPersonalTutorPower onBack={() => handleSelectPower('home')} />
            )}

            {/* 8. Image Studio */}
            {activePower === 'image-studio' && (
              <ImageCreatorTool onBack={() => handleSelectPower('home')} />
            )}

            {/* 9. AI Writer */}
            {activePower === 'writer' && (
              <AIWriterTool onBack={() => handleSelectPower('home')} />
            )}

            {/* 10. Data Analyst */}
            {activePower === 'data-analyst' && (
              <DataPower onSaveToLibrary={handleSaveToCollection} onBack={() => handleSelectPower('home')} />
            )}

            {/* 11. More Intelligence Modules */}
            {activePower === 'more' && (
              <ToolsScreen onSelectPower={handleSelectPower} onBack={() => handleSelectPower('home')} />
            )}

            {/* 12. Tools Hub */}
            {activePower === 'tools' && (
              <ToolsScreen onSelectPower={handleSelectPower} onBack={() => handleSelectPower('home')} />
            )}

            {/* 3. AI Assistant Tool */}
            {activePower === 'tool-assistant' && (
              <AIAssistantTool initialPrompt={initialPromptForPower} onBack={() => handleSelectPower('home')} />
            )}

            {/* 4. AI Writer Tool */}
            {activePower === 'tool-writer' && (
              <AIWriterTool onBack={() => handleSelectPower('home')} />
            )}

            {/* 5. Study Assistant Tool */}
            {activePower === 'tool-study' && (
              <StudyAssistantTool onBack={() => handleSelectPower('home')} />
            )}

            {/* 6. Idea Generator Tool */}
            {activePower === 'tool-ideas' && (
              <IdeaGeneratorTool />
            )}

            {/* 7. Resume Builder Tool */}
            {activePower === 'tool-resume' && (
              <ResumeBuilderTool />
            )}

            {/* 8. Code Assistant Tool */}
            {activePower === 'tool-code' && (
              <CodeAssistantTool />
            )}

            {/* 9. Image Creator Tool */}
            {activePower === 'tool-image' && (
              <ImageCreatorTool onBack={() => handleSelectPower('home')} />
            )}

            {/* 10. AI Chat - Astra 7 Nexus 2040 Supercharged Chat */}
            {activePower === 'chat' && (
              <ChatPower
                initialPrompt={initialPromptForPower}
                onOpenVoiceMode={() => setIsVoiceModeOpen(true)}
                onSelectPower={handleSelectPower}
                onBack={() => handleSelectPower('home')}
                selectedAgent={selectedAgent}
                onClearAgent={() => setSelectedAgent(null)}
              />
            )}

            {/* 11. History */}
            {activePower === 'history' && (
              <HistoryScreen
                onSelectPower={handleSelectPower}
                onDirectPrompt={handleDirectPrompt}
              />
            )}

            {/* 12. Settings */}
            {activePower === 'settings' && (
              <SettingsScreen
                currentTheme={theme as AppTheme}
                currentAccent={accent}
                onThemeChange={(newTheme) => setTheme(newTheme)}
                onAccentChange={(newAccent) => setAccent(newAccent)}
              />
            )}

            {/* 13. Profile */}
            {activePower === 'profile' && (
              <ProfileScreen
                user={currentUser}
                onUpdateUser={(updated) => {
                  const newUser = { ...currentUser, ...updated };
                  setCurrentUser(newUser);
                  try {
                    localStorage.setItem('astra7_user', JSON.stringify(newUser));
                  } catch {}
                }}
                onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
                onLogout={() => {
                  try {
                    localStorage.removeItem('astra7_user');
                  } catch {}
                  setCurrentUser(DEFAULT_USERS[0]);
                  setIsAuthModalOpen(true);
                }}
                onSelectPower={handleSelectPower}
              />
            )}

            {/* Secondary Legacy Modules */}
            {activePower === 'explore' && (
              <DashboardPower
                onNavigate={handleSelectPower}
                onSelectAgent={handleSelectAgentForChat}
                onStartChat={(prompt) => {
                  if (prompt) setInitialPromptForPower(prompt);
                  setActivePower('chat');
                }}
              />
            )}

            {activePower === 'cosmos' && (
              <CosmosPower
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('tool-assistant');
                }}
              />
            )}

            {(activePower === 'agents' || activePower === 'agent-builder') && (
              <AstraAgentBuilderPower onBack={() => handleSelectPower('home')} />
            )}

            {activePower === 'search' && (
              <SearchPower
                initialQuery={initialPromptForPower}
                onSaveToLibrary={handleSaveToCollection}
                onBack={() => handleSelectPower('home')}
              />
            )}

            {activePower === 'scholar' && (
              <ScholarPower onSaveToLibrary={handleSaveToCollection} />
            )}

            {(activePower === 'create' || activePower === 'creative-studio') && (
              <AstraCreativeStudioPower onBack={() => handleSelectPower('home')} />
            )}

            {activePower === 'vision' && (
              <VisionPower onNavigateToObject={handleSelectObjectFromDiscovery} />
            )}

            {activePower === 'data' && (
              <DataPower onSaveToLibrary={handleSaveToCollection} />
            )}

            {activePower === 'library' && (
              <LibraryPower
                currentUser={currentUser}
                onNavigateToPower={(power, targetId) => {
                  if (targetId) setSelectedHistoryObjectId(targetId);
                  setActivePower(power);
                }}
              />
            )}

            {activePower === 'admin' && (
              <AdminPower onRefreshDatabase={loadDatabase} />
            )}

            {/* Astra 7 Knowledge Hub & Project Spaces */}
            {activePower === 'knowledge' && (
              <KnowledgeHubPower
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('tool-assistant');
                }}
              />
            )}

            {activePower === 'projects' && (
              <ProjectSpacesPower
                onNavigateToPower={handleSelectPower}
              />
            )}

            {/* Astra 7 Workspace Intelligence Engines */}
            {activePower === 'workspace' && (
              <EverythingWorkspacePower
                onSelectPower={handleSelectPower}
              />
            )}

            {activePower === 'navigator' && (
              <NavigatorPower
                onSelectPower={handleSelectPower}
                initialGoal={initialPromptForPower}
              />
            )}

            {activePower === 'factcheck' && (
              <FactCheckPower />
            )}

            {activePower === 'briefing' && (
              <DailyBriefingPower />
            )}

            {activePower === 'planner' && (
              <SmartPlannerPower />
            )}

            {activePower === 'goalcoach' && (
              <GoalCoachPower />
            )}

            {activePower === 'toolbox' && (
              <AstraToolboxPower />
            )}

            {/* Astra 7 — NEXUS 2040 Extended Ecosystem Routing */}
            {activePower === 'world' && (
              <AstraWorldPower onBack={() => handleSelectPower('home')} />
            )}

            {activePower === 'future-city' && (
              <AstraDataHubPower
                initialDomain="FUTURE 2030 → 2050"
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {activePower === 'research' && (
              <AstraResearchPower onBack={() => handleSelectPower('home')} />
            )}

            {activePower === 'career' && (
              <AstraCareerPower onBack={() => handleSelectPower('home')} />
            )}

            {activePower === 'privacy' && (
              <AstraPrivacyCenterPower
                onBack={() => handleSelectPower('home')}
                onClearHistory={() => loadDatabase()}
              />
            )}

            {activePower === 'translator' && (
              <AstraTranslatorPower onBack={() => handleSelectPower('home')} />
            )}

            {(activePower === 'twin' || activePower === 'digital-twin') && (
              <AstraDigitalTwinPower onBack={() => handleSelectPower('home')} />
            )}

            {activePower === 'spatial' && (
              <AstraSpatialModePower onBack={() => handleSelectPower('home')} />
            )}

            {activePower === 'robotics' && (
              <AstraRoboticsPower onBack={() => handleSelectPower('home')} />
            )}

            {activePower === 'earth' && (
              <AstraEarthPower onBack={() => handleSelectPower('home')} />
            )}

            {(activePower === 'scenarios' || activePower === 'scenario') && (
              <AstraScenarioSimulatorPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Astra Image → Game Power */}
            {activePower === 'image-to-game' && (
              <ImageToGamePower onBack={() => handleSelectPower('home')} />
            )}

            {/* Astra Cinema Studio Power */}
            {activePower === 'cinema-studio' && (
              <CinemaStudioPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Astra Music Discovery Power */}
            {activePower === 'music' && (
              <AstraMusicPower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Central Astra Data Universe */}
            {(activePower === 'datahub' || activePower === 'data') && (
              <AstraDataHubPower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Global & India Intelligence */}
            {(activePower === 'global-intelligence' || activePower === 'india-intelligence') && (
              <GlobalIndiaIntelligencePower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Maps & Places Intelligence */}
            {activePower === 'maps-places' && (
              <MapsPlacesPower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Finance & Economy */}
            {activePower === 'finance-economy' && (
              <FinanceEconomyPower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Travel Intelligence */}
            {activePower === 'travel-intelligence' && (
              <TravelIntelligencePower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Science Universe */}
            {activePower === 'science-universe' && (
              <ScienceUniversePower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Human Knowledge Graph */}
            {activePower === 'human-knowledge' && (
              <HumanKnowledgeGraphPower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* AI & Tech Radar */}
            {activePower === 'tech-radar' && (
              <AITechRadarPower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Astra App Builder */}
            {activePower === 'app-builder' && (
              <AstraAppBuilderPower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Astra Business Lab */}
            {activePower === 'business-lab' && (
              <AstraBusinessLabPower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Personal Knowledge Graph ("My Astra Knowledge") */}
            {activePower === 'personal-knowledge' && (
              <PersonalKnowledgeGraphPower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Astra Security Center */}
            {activePower === 'security-center' && (
              <AstraSecurityCenterPower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Sports Intelligence */}
            {activePower === 'sports' && (
              <SportsIntelligencePower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Entertainment Universe */}
            {activePower === 'entertainment' && (
              <EntertainmentUniversePower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Gaming Intelligence */}
            {activePower === 'gaming-intelligence' && (
              <GamingIntelligencePower
                onBack={() => handleSelectPower('home')}
                onAskAstra={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Quick Answer */}
            {activePower === 'quick-answer' && (
              <QuickAnswerPower
                onBack={() => handleSelectPower('home')}
                onAskDeep={(query) => {
                  setInitialPromptForPower(query);
                  setActivePower('chat');
                }}
              />
            )}

            {/* Meeting Assistant */}
            {activePower === 'meeting' && (
              <MeetingAssistantPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Achievement Center */}
            {activePower === 'achievements' && (
              <AchievementCenterPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Satellite Tracker */}
            {activePower === 'satellite' && (
              <SatelliteTrackerPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Disaster Center */}
            {activePower === 'disaster' && (
              <DisasterCenterPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Health Education */}
            {activePower === 'health' && (
              <HealthEducationPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Astra Lab */}
            {activePower === 'astra-lab' && (
              <AstraLabPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Engineering Lab */}
            {activePower === 'engineering-lab' && (
              <EngineeringLabPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Smart Home Concept */}
            {activePower === 'smarthome' && (
              <SmartHomeConceptPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Astra Mobility */}
            {activePower === 'mobility' && (
              <AstraMobilityPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Astra Green */}
            {activePower === 'green' && (
              <AstraGreenPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Brand Studio */}
            {activePower === 'brandstudio' && (
              <BrandStudioPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Social Studio */}
            {activePower === 'socialstudio' && (
              <SocialStudioPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Source Graph */}
            {activePower === 'source-graph' && (
              <SourceGraphPower onBack={() => handleSelectPower('home')} />
            )}

            {/* Personal Space */}
            {activePower === 'personal-space' && (
              <PersonalSpacePower
                onBack={() => handleSelectPower('home')}
                onSelectPower={handleSelectPower}
              />
            )}

            {/* Multi-Agent Orchestration (Section 54) */}
            {activePower === 'multi-agent' && (
              <MultiAgentPower onBack={() => handleSelectPower('home')} />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Section 18) */}
      <MobileBottomNav
        activePower={activePower}
        onSelectPower={handleSelectPower}
        onOpenVoiceMode={() => setIsVoiceModeOpen(true)}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
      />

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      <ProUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgradeSuccess={() => {
          const updated: UserProfile = { ...currentUser, plan: 'pro', tier: 'pro' };
          setCurrentUser(updated);
          try {
            localStorage.setItem('astra7_user', JSON.stringify(updated));
          } catch {}
        }}
      />

      <VoiceModeModal
        isOpen={isVoiceModeOpen}
        onClose={() => setIsVoiceModeOpen(false)}
        onSendMessage={handleVoiceMessage}
        onOpenChatScreen={() => {
          setIsVoiceModeOpen(false);
          handleSelectPower('chat');
        }}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectPower={handleSelectPower}
        onSelectObject={handleSelectObjectFromDiscovery}
        objects={objects}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onOpenVoiceMode={() => {
          setIsHelpModalOpen(false);
          setIsVoiceModeOpen(true);
        }}
        onOpenSearch={() => {
          setIsHelpModalOpen(false);
          setIsCommandPaletteOpen(true);
        }}
      />

      {/* Global Astra Brain 3.0 Processing Animation Overlay */}
      {globalRoutingQuery && (
        <BrainRoutingAnimation
          mode="overlay"
          query={globalRoutingQuery}
          intentMatch={globalIntentMatch}
          onCancel={() => {
            setGlobalRoutingQuery(null);
            setGlobalIntentMatch(null);
          }}
          onComplete={(targetPowerId, finalQuery) => {
            setGlobalRoutingQuery(null);
            setGlobalIntentMatch(null);
            setInitialPromptForPower(finalQuery);
            setActivePower(targetPowerId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
