import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Trash2,
  Plus,
  Search,
  ExternalLink,
  Sparkles,
  Bot,
  User,
  Download,
  FileText,
  Image as ImageIcon,
  Landmark,
  Globe,
  Zap,
  Square,
  Languages,
  ArrowRight,
  Code2,
  Brain,
  Calculator,
  Compass,
  CheckCircle2,
  AlertCircle,
  Film,
  Palette,
  Pin,
  Edit3,
  Share2,
  Bookmark,
  RotateCcw,
  MoreVertical,
  X,
  Camera,
  Gamepad2,
  Clapperboard,
  ChevronDown,
  Grid,
  Menu,
  Star
} from 'lucide-react';
import { AstraCoreIcon } from '../nexus/AstraCoreIcon';
import {
  ChatMessage,
  Conversation,
  MessageAttachment,
  AIAgent,
  QueryCategory,
  VerifiedSource,
  UserMemoryItem,
  PowerId
} from '../../types';
import { api } from '../../services/api';
import { ChatMarkdown } from '../chat/ChatMarkdown';
import { VerifiedSourcesDrawer } from '../chat/VerifiedSourcesDrawer';
import { DocumentIntelligencePanel, ActiveDoc } from '../chat/DocumentIntelligencePanel';
import { MemoryModal } from '../chat/MemoryModal';
import { AttachmentActionMenu } from '../chat/AttachmentActionMenu';
import { CameraCaptureModal } from '../chat/CameraCaptureModal';
import { MediaCreationModal } from '../chat/MediaCreationModal';
import { MediaGalleryModal } from '../chat/MediaGalleryModal';
import { TrendingModelsModal } from '../chat/TrendingModelsModal';
import { GeneratedMediaCard } from '../chat/GeneratedMediaCard';
import { AstraCreationHub } from '../studio/AstraCreationHub';
import { mediaApi, GalleryMediaItem } from '../../services/mediaApi';
import { VoiceInputHandler } from '../voice/VoiceInputHandler';
import { ChatAppearanceModal } from '../chat/ChatAppearanceModal';
import { ChatHistorySidebar } from '../chat/ChatHistorySidebar';
import { chatHistoryService, ChatSearchEntry } from '../../services/chatHistoryService';
import {
  ChatThemeConfig,
  loadSavedChatTheme,
  CHAT_THEME_PRESETS,
  DEFAULT_CHAT_THEME_ID
} from '../../types/chatTheme';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';
import { validateImageFile } from '../../utils/imageValidator';

interface ChatPowerProps {
  initialPrompt?: string;
  onNavigateToObject?: (objectId: string) => void;
  selectedAgent?: AIAgent | null;
  onClearAgent?: () => void;
  onOpenVoiceMode?: () => void;
  onSelectPower?: (power: PowerId) => void;
  onBack?: () => void;
}

const CATEGORY_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  CURRENT_NEWS: { label: 'Live News', bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  NEWS: { label: 'Live News', bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  WEB_SEARCH: { label: 'Live Web Grounded', bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  SCIENCE: { label: 'Science & Physics', bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  TECHNOLOGY: { label: 'Technology', bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  MATHEMATICS: { label: 'Mathematics & Proofs', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  MATH: { label: 'Step-by-Step Math', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  HISTORY: { label: 'History & Civilizations', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  GEOGRAPHY: { label: 'Geography & Earth', bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  BUSINESS: { label: 'Business & Markets', bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  TRAVEL: { label: 'Travel & Navigation', bg: 'bg-teal-500/15', text: 'text-teal-300', border: 'border-teal-500/30' },
  ENTERTAINMENT: { label: 'Entertainment & Media', bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  CAREER: { label: 'Career & Resume', bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  RESEARCH: { label: 'Deep Research', bg: 'bg-fuchsia-500/15', text: 'text-fuchsia-300', border: 'border-fuchsia-500/30' },
  CODING: { label: 'Coding & Algorithms', bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  TRANSLATION: { label: 'Multilingual', bg: 'bg-pink-500/15', text: 'text-pink-300', border: 'border-pink-500/30' },
  DOCUMENT_ANALYSIS: { label: 'Document Intelligence', bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  DOCUMENT: { label: 'Document Intelligence', bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  RAG: { label: 'RAG Knowledge', bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  EDUCATION: { label: 'Astra Scholar', bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  WRITING: { label: 'Content Synthesis', bg: 'bg-teal-500/15', text: 'text-teal-300', border: 'border-teal-500/30' },
  IMAGE_GENERATION: { label: 'AI Image Studio (Gemini 3.1)', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  IMAGE_EDITING: { label: 'AI Inpainting', bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  IMAGE_VARIATION: { label: 'Style Variation', bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  IMAGE_TO_VIDEO: { label: 'Image to Video (Veo 3.1)', bg: 'bg-fuchsia-500/15', text: 'text-fuchsia-300', border: 'border-fuchsia-500/30' },
  VIDEO_GENERATION: { label: 'AI Video Studio (Veo 3.1)', bg: 'bg-fuchsia-500/15', text: 'text-fuchsia-300', border: 'border-fuchsia-500/30' },
  IMAGE_ANALYSIS: { label: 'Vision Understanding', bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  VIDEO_ANALYSIS: { label: 'Video Understanding', bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' },
  MEDIA_LIBRARY: { label: 'Astra Media Gallery', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  IMAGE_TASK: { label: 'Vision & Image', bg: 'bg-violet-500/15', text: 'text-violet-300', border: 'border-violet-500/30' },
  IMAGE: { label: 'Vision & Image', bg: 'bg-violet-500/15', text: 'text-violet-300', border: 'border-violet-500/30' },
  SPORTS: { label: 'Sports Domain', bg: 'bg-orange-500/15', text: 'text-orange-300', border: 'border-orange-500/30' },
  WEATHER: { label: 'Meteorological', bg: 'bg-sky-500/15', text: 'text-sky-300', border: 'border-sky-500/30' },
  CREATIVE: { label: 'Ideation', bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' },
  GENERAL_KNOWLEDGE: { label: 'General Knowledge', bg: 'bg-slate-500/15', text: 'text-slate-300', border: 'border-slate-500/30' },
  GENERAL: { label: 'General Knowledge', bg: 'bg-slate-500/15', text: 'text-slate-300', border: 'border-slate-500/30' },
  OTHER: { label: 'Astra 7', bg: 'bg-slate-500/15', text: 'text-slate-300', border: 'border-slate-500/30' }
};

const TOOL_LABELS: Record<string, { label: string; icon: string }> = {
  ai_knowledge: { label: 'AI Knowledge', icon: '🧠' },
  web_search: { label: 'Live Web Grounded', icon: '🌐' },
  news_search: { label: 'Live News Wire', icon: '📰' },
  document_search: { label: 'Document Intelligence', icon: '📄' },
  calculation: { label: 'Math Engine', icon: '🧮' },
  image_analysis: { label: 'Vision Analyzer', icon: '👁️' },
  multi_tool: { label: 'Deep Research Synthesis', icon: '🔬' }
};

export const ChatPower: React.FC<ChatPowerProps> = ({
  initialPrompt,
  onNavigateToObject,
  selectedAgent,
  onClearAgent,
  onOpenVoiceMode,
  onSelectPower,
  onBack
}) => {
  const initialUserData = useRef(chatHistoryService.loadUserData()).current;
  const [conversations, setConversations] = useState<Conversation[]>(() => initialUserData.chats);
  const [activeConvId, setActiveConvId] = useState<string>(
    () => initialUserData.lastActiveConvId || initialUserData.chats[0]?.id || 'conv-default'
  );
  const [searchHistory, setSearchHistory] = useState<ChatSearchEntry[]>(() => initialUserData.searches);

  // Responsive Chat History Sidebar state
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState<boolean>(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileDrawerOpen]);

  // Persist conversations and active conversation on change
  useEffect(() => {
    if (conversations.length > 0) {
      chatHistoryService.saveUserData({
        chats: conversations,
        lastActiveConvId: activeConvId
      });
    }
  }, [conversations, activeConvId]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStepStatus, setCurrentStepStatus] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Assistant settings
  const [forceWebSearch, setForceWebSearch] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'auto' | 'en' | 'te' | 'hi'>('auto');
  const [answerLength, setAnswerLength] = useState<'short' | 'balanced' | 'detailed' | 'deep'>('balanced');
  const [activeDoc, setActiveDoc] = useState<ActiveDoc | null>(null);
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [userMemories, setUserMemories] = useState<UserMemoryItem[]>([]);

  // Multimodal AI Media & Studio State
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [creationModalMode, setCreationModalMode] = useState<'image' | 'video'>('image');
  const [creationModalPrompt, setCreationModalPrompt] = useState('');
  const [creationModalRefImage, setCreationModalRefImage] = useState<string | undefined>(undefined);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isModelsOpen, setIsModelsOpen] = useState(false);
  const [isCreationHubOpen, setIsCreationHubOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Theme & Appearance System
  const [currentChatTheme, setCurrentChatTheme] = useState<ChatThemeConfig>(() => loadSavedChatTheme());
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Chat Organization: Pin & Rename
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingConvTitle, setEditingConvTitle] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameInputValue, setRenameInputValue] = useState('');
  const [savedMessageIds, setSavedMessageIds] = useState<Set<string>>(new Set());
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);

  // Voice & Auto-Speak settings
  const [autoSpeak, setAutoSpeak] = useState<boolean>(() => {
    try {
      return localStorage.getItem('astra7_auto_speak') === 'true';
    } catch {
      return false;
    }
  });
  const autoSpeakRef = useRef(autoSpeak);
  useEffect(() => {
    autoSpeakRef.current = autoSpeak;
  }, [autoSpeak]);

  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.05);

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleTogglePinConversation = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic(20);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  const handleStartRename = (id: string, currentTitle: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingConvId(id);
    setEditingConvTitle(currentTitle);
  };

  const handleClearConversationMessages = () => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, messages: [] } : c))
    );
    triggerHaptic(20);
  };

  const formatCategoryToCapability = (category?: string) => {
    if (!category) return 'SEARCH';
    const c = category.toUpperCase();
    if (c.includes('CODE')) return 'CODE';
    if (c.includes('STUDY') || c.includes('MATH') || c.includes('LEARN') || c.includes('EDUCATION')) return 'STUDY';
    if (c.includes('DOC') || c.includes('RAG') || c.includes('FILE')) return 'DOCUMENT';
    if (c.includes('IMAGE') || c.includes('PHOTO') || c.includes('VISION')) return 'IMAGE';
    if (c.includes('NEWS') || c.includes('LIVE')) return 'NEWS';
    if (c.includes('VIDEO') || c.includes('CINEMA')) return 'VIDEO';
    return 'SEARCH';
  };

  const handleSaveRename = (id: string) => {
    if (!editingConvTitle.trim()) {
      setEditingConvId(null);
      return;
    }
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: editingConvTitle.trim(), updatedAt: new Date().toISOString() } : c))
    );
    setEditingConvId(null);
  };

  const handleOpenRenameModal = () => {
    triggerHaptic(15);
    setRenameInputValue(activeConversation.title);
    setIsRenameModalOpen(true);
    setIsChatMenuOpen(false);
  };

  const handleSaveRenameFromModal = () => {
    if (renameInputValue.trim()) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? { ...c, title: renameInputValue.trim(), updatedAt: new Date().toISOString() }
            : c
        )
      );
      setShareToast('Conversation renamed successfully');
      setTimeout(() => setShareToast(null), 2000);
    }
    setIsRenameModalOpen(false);
  };

  const handleShareAnswer = async (text: string) => {
    triggerHaptic(25);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Astra 7 AI Response',
          text
        });
        return;
      } catch (err) {}
    }
    await navigator.clipboard.writeText(text);
    setShareToast('Answer copied to clipboard for sharing!');
    setTimeout(() => setShareToast(null), 2500);
  };

  const handleSaveAnswer = (msg: ChatMessage) => {
    triggerHaptic(30);
    setSavedMessageIds((prev) => new Set([...prev, msg.id]));
    try {
      const savedAnswers = JSON.parse(localStorage.getItem('astra7_saved_answers') || '[]');
      savedAnswers.unshift({
        id: msg.id,
        content: msg.content,
        timestamp: new Date().toISOString(),
        category: msg.category || 'GENERAL_KNOWLEDGE'
      });
      localStorage.setItem('astra7_saved_answers', JSON.stringify(savedAnswers.slice(0, 100)));
    } catch {}
    setShareToast('Saved to your Astra Knowledge Library!');
    setTimeout(() => setShareToast(null), 2500);
  };

  const handleRegenerate = (msgId: string) => {
    triggerHaptic(35);
    const msgIdx = activeConversation.messages.findIndex((m) => m.id === msgId);
    if (msgIdx <= 0) return;
    const prevUserMsg = activeConversation.messages
      .slice(0, msgIdx)
      .reverse()
      .find((m) => m.role === 'user');
    if (prevUserMsg && prevUserMsg.content) {
      handleSendMessage(prevUserMsg.content);
    }
  };

  useEffect(() => {
    api.getUserMemories().then((data) => {
      setUserMemories(data.memories || []);
    }).catch((e) => console.warn('Could not load user memories:', e));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, currentStepStatus]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  // Voice recognition setup
  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser environment.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLanguage === 'te' ? 'te-IN' : selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  // Text to speech with natural assistant tone and custom rate
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#_`\[\]()]/g, '').slice(0, 500);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.name.includes('Natural') ||
          v.name.includes('Neural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel')) &&
        v.lang.startsWith('en')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Generic File, Photo & Video Upload handler with Resilient Validation Pipeline
  const handleGenericFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, explicitType?: 'image' | 'video' | 'document') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        let textContent = '';
        let base64Url = '';
        const isImg = explicitType === 'image' || file.type.startsWith('image/');
        const isVid = explicitType === 'video' || file.type.startsWith('video/');

        if (isImg) {
          // 1. Resilient image validation (Format, corruption, dimensions, max 20MB)
          setCurrentStepStatus('Validating image format & integrity...');
          const validation = await validateImageFile(file);
          if (!validation.valid) {
            alert(validation.error || 'The selected file is not a supported or valid image.');
            continue;
          }

          base64Url = validation.base64!;

          // 2. Upload and verify with backend storage engine
          setCurrentStepStatus('Uploading image to Astra storage...');
          try {
            const uploadRes = await mediaApi.uploadImage({
              base64Image: base64Url,
              filename: file.name,
              mimeType: validation.mimeType,
              size: validation.sizeBytes
            });
            if (uploadRes && uploadRes.url) {
              base64Url = uploadRes.url; // verified backend storage URL
            }
          } catch (uploadErr) {
            // Keep local dataUrl as fallback if network upload encounters transient issue
            console.warn('Backend image storage warning (using local data URL):', uploadErr);
          }
          setCurrentStepStatus(null);
        } else if (
          file.type.includes('text') ||
          file.name.endsWith('.txt') ||
          file.name.endsWith('.csv') ||
          file.name.endsWith('.json') ||
          file.name.endsWith('.md')
        ) {
          textContent = await file.text();
        }

        const newAttach: MessageAttachment = {
          id: `att-${Date.now()}-${i}`,
          name: file.name,
          type: isVid ? 'video' : isImg ? 'image' : 'document',
          mimeType: file.type || (isVid ? 'video/mp4' : isImg ? 'image/jpeg' : 'application/octet-stream'),
          url: base64Url || URL.createObjectURL(file),
          size: file.size,
          content: textContent
        };
        setAttachments((prev) => [...prev, newAttach]);

        // If text file, auto-register as active document for Document Intelligence RAG
        if (textContent) {
          const docResult = await api.uploadDocument(file.name, textContent, file.type, file.size);
          setActiveDoc({
            id: docResult.id,
            name: docResult.name,
            type: docResult.type,
            size: docResult.size,
            chunksCount: docResult.chunksCount,
            summary: docResult.summary,
            content: textContent
          });
        }
      } catch (err: any) {
        console.error('File reading failed:', err);
        alert(err?.message || 'File upload encountered an issue. Please try again.');
      }
    }
    // Reset file input
    e.target.value = '';
  };

  const handleCameraCapture = (base64Data: string, filename: string) => {
    const newAttach: MessageAttachment = {
      id: `att-cam-${Date.now()}`,
      name: filename,
      type: 'image',
      mimeType: 'image/jpeg',
      url: base64Data
    };
    setAttachments((prev) => [...prev, newAttach]);
  };

  const handleOpenCreationModal = (mode: 'image' | 'video', prefillPrompt?: string, refImage?: string) => {
    setCreationModalMode(mode);
    setCreationModalPrompt(prefillPrompt || '');
    setCreationModalRefImage(refImage);
    setIsCreationModalOpen(true);
  };

  const handleMediaCreated = (item: GalleryMediaItem) => {
    // Add assistant message containing the created media
    const mediaMsg: ChatMessage = {
      id: `msg-media-${Date.now()}`,
      role: 'assistant',
      content: item.mediaType === 'video'
        ? `🎬 **AI Video Created**\n\nPrompt: *"${item.prompt}"*\nModel: \`${item.model}\``
        : `🎨 **AI Image Created**\n\nPrompt: *"${item.prompt}"*\nModel: \`${item.model}\``,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: item.mediaType === 'video' ? 'VIDEO_GENERATION' : 'IMAGE_GENERATION',
      generatedMedia: {
        type: item.mediaType,
        url: item.url,
        originalUrl: item.originalUrl,
        prompt: item.prompt,
        enhancedPrompt: item.enhancedPrompt,
        model: item.model,
        aspectRatio: item.aspectRatio,
        duration: item.duration
      }
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              messages: [...c.messages, mediaMsg],
              updatedAt: new Date().toISOString()
            }
          : c
      )
    );
  };

  // Stop Generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setCurrentStepStatus(null);
  };

  // Send Message with Progressive SSE Streaming + Multimodal Dispatch
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputText;
    if ((!prompt.trim() && attachments.length === 0) || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };

    const updatedMessages = [...activeConversation.messages, userMessage];

    // Placeholder assistant message to stream into
    const assistantMsgId = `msg-assistant-${Date.now()}`;
    const assistantPlaceholder: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      status: 'thinking',
      statusLabel: 'Thinking...',
      isStreaming: true,
      category: 'GENERAL_KNOWLEDGE'
    };

    // Update conversation with user message and streaming placeholder
    const smartTitle = (c: Conversation) => {
      if (c.messages.length <= 1 || c.title === 'New Conversation' || c.title === 'Astra 7 Assistant') {
        return chatHistoryService.generateSmartTitle(prompt);
      }
      return c.title;
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              title: smartTitle(c),
              messages: [...updatedMessages, assistantPlaceholder],
              updatedAt: new Date().toISOString()
            }
          : c
      )
    );

    // Save prompt into chat search history
    try {
      const updatedSearches = chatHistoryService.recordSearch(prompt, activeConvId);
      setSearchHistory(updatedSearches);
    } catch {}

    const sentAttachments = [...attachments];
    setInputText('');
    setAttachments([]);
    setIsLoading(true);
    setCurrentStepStatus('Processing request...');

    // Multimodal Intent Check
    const promptLower = prompt.toLowerCase().trim();
    const attachedImage = sentAttachments.find((a) => a.type === 'image' && a.url);
    const attachedVideo = sentAttachments.find((a) => a.type === 'video');

    const isVideoGen =
      promptLower.includes('generate video') ||
      promptLower.includes('create video') ||
      promptLower.includes('make a video') ||
      promptLower.includes('make video') ||
      promptLower.includes('animate this') ||
      promptLower.includes('turn into video');

    const isImageGen =
      !isVideoGen &&
      (promptLower.startsWith('generate image') ||
        promptLower.startsWith('create image') ||
        promptLower.startsWith('draw ') ||
        promptLower.startsWith('paint ') ||
        promptLower.startsWith('picture of ') ||
        promptLower.startsWith('photo of ') ||
        promptLower.includes('generate an image') ||
        promptLower.includes('create an image') ||
        promptLower.includes('generate a picture'));

    const isImageEdit =
      attachedImage &&
      !isVideoGen &&
      (promptLower.includes('remove background') ||
        promptLower.includes('inpaint') ||
        promptLower.includes('edit this image') ||
        promptLower.includes('edit image') ||
        promptLower.includes('change the') ||
        promptLower.includes('variation') ||
        promptLower.includes('restyle'));

    const isImageAnalysis =
      attachedImage &&
      !isImageGen &&
      !isImageEdit &&
      (promptLower.includes('what is in this') ||
        promptLower.includes('analyze') ||
        promptLower.includes('describe this') ||
        promptLower.includes('identify') ||
        promptLower.includes('examine') ||
        promptLower.includes('tell me about'));

    const isVideoAnalysis =
      attachedVideo &&
      (promptLower.includes('analyze') ||
        promptLower.includes('summarize') ||
        promptLower.includes('what happens') ||
        promptLower.includes('timeline') ||
        promptLower.includes('breakdown'));

    // Handle Video Generation with Veo 3.1
    if (isVideoGen) {
      setCurrentStepStatus('Initializing Google Veo 3.1 video synthesis...');
      try {
        const cleanPrompt = prompt.replace(/^(generate video|create video|make video|turn into video)[:\s]*/i, '').trim() || prompt;
        const res = await mediaApi.generateVideo({
          prompt: cleanPrompt,
          aspectRatio: '16:9',
          base64StartImage: attachedImage?.url
        });

        setCurrentStepStatus('Veo 3.1 is synthesizing video frames (polling progress)...');
        let isDone = false;
        let attempts = 0;
        while (!isDone && attempts < 40) {
          await new Promise((r) => setTimeout(r, 4000));
          attempts++;
          const statusRes = await mediaApi.pollVideoStatus(res.operationName);
          if (statusRes.error) {
            throw new Error(statusRes.error.message || 'Video generation failed');
          }
          if (statusRes.done) {
            isDone = true;
            break;
          }
          setCurrentStepStatus(`Veo 3.1 synthesizing video frames (step ${attempts}/40)...`);
        }

        if (!isDone) {
          throw new Error('Video generation timed out. Please check back later.');
        }

        setCurrentStepStatus('Downloading generated video stream...');
        const videoBlob = await mediaApi.downloadVideoBlob(res.operationName);
        const blobUrl = URL.createObjectURL(videoBlob);

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: `🎬 **Google Veo 3.1 AI Video Generated**\n\nPrompt: *"${cleanPrompt}"*\n- **Model**: \`veo-3.1-lite-generate-preview\`\n- **Resolution**: 1080p (16:9)\n\nYou can watch, loop, or download your video below.`,
                          isStreaming: false,
                          status: 'completed',
                          category: 'VIDEO_GENERATION',
                          generatedMedia: {
                            type: 'video',
                            url: blobUrl,
                            prompt: cleanPrompt,
                            model: 'veo-3.1-lite-generate-preview',
                            duration: 5,
                            aspectRatio: '16:9',
                            operationName: res.operationName
                          }
                        }
                      : m
                  )
                }
              : c
          )
        );
      } catch (videoErr: any) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: `⚠️ **Video Generation Notice**\n\n${videoErr.message || 'Veo 3.1 video synthesis encountered an error.'}`,
                          isStreaming: false,
                          status: 'error',
                          category: 'VIDEO_GENERATION'
                        }
                      : m
                  )
                }
              : c
          )
        );
      } finally {
        setIsLoading(false);
        setCurrentStepStatus(null);
      }
      return;
    }

    // Handle Image Generation with Gemini 3.1 Flash Image
    if (isImageGen) {
      setCurrentStepStatus('Enhancing prompt & rendering with Gemini 3.1 Flash Image...');
      try {
        const cleanPrompt = prompt.replace(/^(generate image|create image|picture of|photo of|draw|paint)[:\s]*/i, '').trim() || prompt;
        const res = await mediaApi.generateImage({
          prompt: cleanPrompt,
          aspectRatio: '1:1',
          enhance: true
        });

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: `🎨 **Gemini 3.1 Flash Image Generated**\n\n${res.enhancedPrompt ? `*Enhanced Prompt:* "${res.enhancedPrompt}"\n\n` : ''}Model: \`${res.model}\` • Aspect Ratio: \`${res.aspectRatio || '1:1'}\`\n\nUse the quick actions below to edit with AI, turn into video, or download.`,
                          isStreaming: false,
                          status: 'completed',
                          category: 'IMAGE_GENERATION',
                          generatedMedia: {
                            type: 'image',
                            url: res.imageUrl,
                            prompt: cleanPrompt,
                            enhancedPrompt: res.enhancedPrompt,
                            model: res.model,
                            aspectRatio: res.aspectRatio || '1:1'
                          }
                        }
                      : m
                  )
                }
              : c
          )
        );
      } catch (imgErr: any) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: `⚠️ **Image Generation Notice**\n\n${imgErr.message || 'Gemini 3.1 Flash Image was unable to synthesize the image.'}`,
                          isStreaming: false,
                          status: 'error',
                          category: 'IMAGE_GENERATION'
                        }
                      : m
                  )
                }
              : c
          )
        );
      } finally {
        setIsLoading(false);
        setCurrentStepStatus(null);
      }
      return;
    }

    // Handle Image Editing
    if (isImageEdit && attachedImage) {
      setCurrentStepStatus('Applying AI image modification...');
      try {
        const res = await mediaApi.editImage({
          base64Image: attachedImage.url,
          instruction: prompt,
          preserveSubject: true
        });

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: `✨ **Image Modified with AI Inpainting**\n\nInstruction: *"${prompt}"*\nModel: \`${res.model}\`\n\nCompare before & after, or further restyle below.`,
                          isStreaming: false,
                          status: 'completed',
                          category: 'IMAGE_EDITING',
                          generatedMedia: {
                            type: 'image',
                            url: res.imageUrl,
                            originalUrl: attachedImage.url,
                            prompt: prompt,
                            model: res.model
                          }
                        }
                      : m
                  )
                }
              : c
          )
        );
      } catch (editErr: any) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: `⚠️ **Image Edit Notice**\n\n${editErr.message || 'AI inpainting was unable to process this request.'}`,
                          isStreaming: false,
                          status: 'error',
                          category: 'IMAGE_EDITING'
                        }
                      : m
                  )
                }
              : c
          )
        );
      } finally {
        setIsLoading(false);
        setCurrentStepStatus(null);
      }
      return;
    }

    // Handle Image Analysis
    if (isImageAnalysis && attachedImage) {
      setCurrentStepStatus('Gemini 2.5 Flash analyzing visual features...');
      try {
        const res = await mediaApi.analyzeImage({
          base64Image: attachedImage.url,
          prompt: prompt
        });

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: res.analysis,
                          isStreaming: false,
                          status: 'completed',
                          category: 'IMAGE_ANALYSIS',
                          suggestedActions: [
                            'Turn this image into a video',
                            'Edit: enhance details and lighting',
                            'Extract color palette & tags'
                          ]
                        }
                      : m
                  )
                }
              : c
          )
        );
      } catch (analysisErr: any) {
        console.warn('Image analysis failed:', analysisErr.message);
      } finally {
        setIsLoading(false);
        setCurrentStepStatus(null);
      }
      return;
    }

    // Handle Video Analysis
    if (isVideoAnalysis && attachedVideo) {
      setCurrentStepStatus('Gemini analyzing video stream & extracting timeline...');
      try {
        const res = await mediaApi.analyzeVideo({
          videoName: attachedVideo.name,
          videoSize: attachedVideo.size || 1024 * 1024,
          prompt: prompt
        });

        const formattedAnalysis = `${res.summary}\n\n${
          res.keyMoments && res.keyMoments.length > 0
            ? '**Key Timeline Moments:**\n' + res.keyMoments.map((k) => `- **${k.timestamp}** (${k.title}): ${k.description}`).join('\n')
            : ''
        }`.trim();

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: formattedAnalysis,
                          isStreaming: false,
                          status: 'completed',
                          category: 'VIDEO_ANALYSIS',
                          suggestedActions: [
                            'Summarize key moments',
                            'Generate detailed captions'
                          ]
                        }
                      : m
                  )
                }
              : c
          )
        );
      } catch (vidErr: any) {
        console.warn('Video analysis failed:', vidErr.message);
      } finally {
        setIsLoading(false);
        setCurrentStepStatus(null);
      }
      return;
    }

    // Standard SSE Stream for Text, Code, Math, Documents, Web Grounding
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let accumulatedText = '';
    let detectedCategory: QueryCategory = 'GENERAL_KNOWLEDGE';
    let collectedSources: VerifiedSource[] = [];
    let detectedLang = 'en';
    let isCachedResponse = false;
    let usedModel = 'gemini-2.5-flash';
    let toolReq = 'ai_knowledge';
    let ansMode = 'rhythm';

    try {
      await api.streamChat(
        {
          message: prompt,
          history: activeConversation.messages.map((m) => ({ role: m.role, content: m.content })),
          forceWebSearch,
          documentId: activeDoc?.id,
          language: selectedLanguage !== 'auto' ? selectedLanguage : undefined,
          userMemories: userMemories.map((m) => m.content),
          answerLength
        },
        {
          onStatus: (status) => {
            setCurrentStepStatus(status.label);
            setConversations((prev) =>
              prev.map((c) =>
                c.id === activeConvId
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMsgId
                          ? { ...m, status: status.step as any, statusLabel: status.label }
                          : m
                      )
                    }
                  : c
              )
            );
          },
          onRoute: (route) => {
            detectedCategory = route.category;
            detectedLang = route.language;
            toolReq = route.toolRequired || 'ai_knowledge';
            ansMode = route.answerMode || 'rhythm';
            setConversations((prev) =>
              prev.map((c) =>
                c.id === activeConvId
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMsgId
                          ? {
                              ...m,
                              category: route.category,
                              detectedLanguage: route.language,
                              toolRequired: route.toolRequired,
                              answerMode: route.answerMode,
                              answerLength
                            }
                          : m
                      )
                    }
                  : c
              )
            );
          },
          onSources: (sources) => {
            collectedSources = sources;
            setConversations((prev) =>
              prev.map((c) =>
                c.id === activeConvId
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMsgId ? { ...m, sources } : m
                      )
                    }
                  : c
              )
            );
          },
          onDocumentChunks: (chunks) => {
            setConversations((prev) =>
              prev.map((c) =>
                c.id === activeConvId
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMsgId ? { ...m, documentChunks: chunks } : m
                      )
                    }
                  : c
              )
            );
          },
          onChunk: (textChunk) => {
            accumulatedText += textChunk;
            setConversations((prev) =>
              prev.map((c) =>
                c.id === activeConvId
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMsgId
                          ? {
                              ...m,
                              content: accumulatedText,
                              isStreaming: true,
                              status: 'generating'
                            }
                          : m
                      )
                    }
                  : c
              )
            );
          },
          onDone: (meta) => {
            isCachedResponse = Boolean(meta?.cached);
            usedModel = meta?.model || usedModel;

            const dynamicActions = [
              'Explain simpler',
              'Explain deeper',
              'Give example',
              'Summarize',
              detectedLang === 'te'
                ? 'Translate to English'
                : detectedLang === 'hi'
                ? 'Translate to English'
                : 'Translate to Telugu (తెలుగు)',
              'Search more on web'
            ];

            setConversations((prev) =>
              prev.map((c) =>
                c.id === activeConvId
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMsgId
                          ? {
                              ...m,
                              content: accumulatedText || m.content,
                              isStreaming: false,
                              status: 'completed',
                              cached: isCachedResponse,
                              model: usedModel,
                              toolRequired: toolReq,
                              answerMode: ansMode,
                              suggestedActions: dynamicActions
                            }
                          : m
                      )
                    }
                  : c
              )
            );

            // Auto-speak completed answer if enabled
            if (autoSpeakRef.current && accumulatedText) {
              speakText(accumulatedText);
            }
          },
          onError: (err) => {
            console.warn('Streaming error event:', err);
          }
        },
        abortController.signal
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Handled via stop button
        return;
      }
      console.warn('Streaming failed, invoking fallback endpoint:', err.message);
      // Synchronous fallback
      try {
        const syncRes = await api.sendChat(prompt, activeConversation.messages, undefined, {
          forceWebSearch,
          documentId: activeDoc?.id,
          language: selectedLanguage !== 'auto' ? selectedLanguage : undefined
        });

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: syncRes.content,
                          category: syncRes.category || detectedCategory,
                          sources: syncRes.sources || collectedSources,
                          detectedLanguage: syncRes.detectedLanguage || detectedLang,
                          cached: syncRes.cached,
                          isStreaming: false,
                          status: 'completed',
                          model: syncRes.model || 'gemini-2.5-flash',
                          suggestedActions: [
                            'Can you elaborate on this point?',
                            'What are the primary sources for this?',
                            'How does this relate to other discoveries?'
                          ]
                        }
                      : m
                  )
                }
              : c
          )
        );
      } catch (fallbackErr: any) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: `I encountered a communication issue while processing your request. Please check your internet connection or retry in a few moments.`,
                          isStreaming: false,
                          status: 'error'
                        }
                      : m
                  )
                }
              : c
          )
        );
      }
    } finally {
      setIsLoading(false);
      setCurrentStepStatus(null);
      abortControllerRef.current = null;
    }
  };

  const handleCreateNewConversation = () => {
    triggerHaptic(20);
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      userId: 'astra-explorer',
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      model: 'gemini-2.5-flash',
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          role: 'assistant',
          content: '### Astra 7 Intelligent Core\nReady to assist. Ask anything across science, code, future city, space, music, or mathematics.',
          timestamp: new Date().toISOString(),
          category: 'GENERAL_KNOWLEDGE',
          suggestedActions: [
            'Explore Astra Data Universe',
            'Simulate Future City 2040 Blueprint',
            'Play Kesariya or trending songs',
            'Explain Quantum Computing in Telugu (తెలుగులో)'
          ]
        }
      ]
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    chatHistoryService.saveUserData({ chats: [newConv, ...conversations], lastActiveConvId: newConv.id });
  };

  const handleDeleteConversation = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic(20);
    const remaining = conversations.filter((c) => c.id !== id);
    if (remaining.length === 0) {
      const freshConv: Conversation = {
        id: `conv-${Date.now()}`,
        userId: 'astra-explorer',
        title: 'New Conversation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        model: 'gemini-2.5-flash',
        messages: []
      };
      setConversations([freshConv]);
      setActiveConvId(freshConv.id);
      chatHistoryService.saveUserData({ chats: [freshConv], lastActiveConvId: freshConv.id });
    } else {
      setConversations(remaining);
      const nextActiveId = activeConvId === id ? remaining[0].id : activeConvId;
      setActiveConvId(nextActiveId);
      chatHistoryService.saveUserData({ chats: remaining, lastActiveConvId: nextActiveId });
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportChat = () => {
    const jsonStr = JSON.stringify(activeConversation, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astra-chat-${activeConversation.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
  };

  return (
    <div
      className={`h-[calc(100vh-4rem)] flex overflow-hidden w-full max-w-full ${currentChatTheme.background} ${currentChatTheme.font}`}
      style={{
        ['--chat-accent' as any]: currentChatTheme.accent,
      }}
    >
      {/* Professional ChatGPT-Style Left Chat History Sidebar */}
      <ChatHistorySidebar
        conversations={conversations}
        activeConvId={activeConvId}
        onSelectConversation={(id) => {
          setActiveConvId(id);
          chatHistoryService.saveUserData({ lastActiveConvId: id });
        }}
        onCreateNewChat={handleCreateNewConversation}
        onRenameConversation={(id, newTitle) => {
          setConversations((prev) => {
            const updated = prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c));
            chatHistoryService.saveUserData({ chats: updated });
            return updated;
          });
        }}
        onTogglePin={(id) => {
          handleTogglePinConversation(id);
        }}
        onToggleFavorite={(id) => {
          setConversations((prev) => {
            const updated = prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
            chatHistoryService.saveUserData({ chats: updated });
            return updated;
          });
        }}
        onToggleArchive={(id) => {
          setConversations((prev) => {
            const updated = prev.map((c) => (c.id === id ? { ...c, isArchived: !c.isArchived } : c));
            chatHistoryService.saveUserData({ chats: updated });
            return updated;
          });
        }}
        onDeleteConversation={(id) => {
          handleDeleteConversation(id);
        }}
        onShareConversation={(conv) => {
          handleShareAnswer(conv.messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n'));
        }}
        onOpenSettings={() => setIsThemeModalOpen(true)}
        searchHistory={searchHistory}
        onSelectSearchQuery={(query) => {
          setInputText(query);
        }}
        onRemoveSearchQuery={(id) => {
          const updated = chatHistoryService.removeSearch(id);
          setSearchHistory(updated);
        }}
        onClearAllSearches={() => {
          chatHistoryService.clearAllSearches();
          setSearchHistory([]);
        }}
        isOpen={isMobile ? isMobileDrawerOpen : isDesktopSidebarOpen}
        isMobile={isMobile}
        onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
        onToggleSidebarCollapse={() => {
          if (isMobile) {
            setIsMobileDrawerOpen((prev) => !prev);
          } else {
            setIsDesktopSidebarOpen((prev) => !prev);
          }
        }}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#03050B] relative overflow-hidden">
        {/* Deep Black Futuristic Background with subtle golden particles, light trails & aurora glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Radial Ambient Core Aurora */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-gradient-to-b from-[#F5B82E]/10 via-[#A66A00]/05 to-transparent rounded-full blur-3xl opacity-80" />
          {/* Soft Golden Particle Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#F5B82E_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.035]" />
        </div>

        {/* Chat Top Header (Section 5) */}
        <div className="h-14 px-4 sm:px-6 border-b border-amber-500/20 bg-[#060814]/90 flex items-center justify-between text-xs backdrop-blur-xl shrink-0 z-20 shadow-sm">
          {/* Left: ☰ Hamburger button, Glowing Astra Core icon, ASTRA, ● Online, Theme selector */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* ☰ Hamburger Menu Button (Toggles Chat History Sidebar) */}
            <button
              onClick={() => {
                triggerHaptic(15);
                if (isMobile) {
                  setIsMobileDrawerOpen((prev) => !prev);
                } else {
                  setIsDesktopSidebarOpen((prev) => !prev);
                }
              }}
              className="p-1.5 -ml-1 sm:ml-0 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30 transition-all cursor-pointer shrink-0"
              title="Toggle Chat History (☰)"
              aria-label="Toggle chat history"
            >
              <Menu className="w-5 h-5 text-amber-400" />
            </button>

            <AstraCoreIcon size={26} isProcessing={isLoading} />
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white tracking-wider text-sm font-['Space_Grotesk',sans-serif]">
                ASTRA
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>

            {/* Theme Selector: GOLDEN CORE ▼ */}
            <div className="relative ml-1">
              <button
                onClick={() => setIsThemeModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-[#FFD76A] hover:bg-amber-500/25 border border-amber-500/35 text-[10px] font-mono tracking-wider uppercase font-bold transition-all shadow-sm"
                title="Change Chat Appearance Theme"
              >
                <span>{currentChatTheme.name}</span>
                <ChevronDown className="w-3 h-3 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Right: Controls: ✨, Edit, ⋮ */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Live Web Search Quick Toggle */}
            <button
              onClick={() => setForceWebSearch(!forceWebSearch)}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all border ${
                forceWebSearch
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
              title="Toggle Live Web Search grounding"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>Live: {forceWebSearch ? 'ON' : 'AUTO'}</span>
            </button>

            {/* 🔊 Auto Speak Toggle */}
            <button
              onClick={() => {
                const next = !autoSpeak;
                setAutoSpeak(next);
                try {
                  localStorage.setItem('astra7_auto_speak', String(next));
                } catch {}
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all border ${
                autoSpeak
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm font-bold'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
              title="Auto Speak every completed response aloud"
            >
              {autoSpeak ? <Volume2 className="w-3 h-3 text-amber-400" /> : <VolumeX className="w-3 h-3" />}
              <span className="hidden sm:inline">Auto Speak: {autoSpeak ? 'ON' : 'OFF'}</span>
            </button>

            {/* ⏹ Stop Speaking Button when active */}
            {isSpeaking && (
              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono animate-pulse cursor-pointer"
                title="Stop current speech"
              >
                <Square className="w-2.5 h-2.5 fill-current text-rose-400" />
                <span>Stop Audio</span>
              </button>
            )}

            {/* 🎙️ Voice Chat Continuous Mode Button */}
            {onOpenVoiceMode && (
              <button
                onClick={onOpenVoiceMode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-[#FFD76A] border border-amber-500/35 text-[10px] font-mono transition-all cursor-pointer"
                title="Open Hands-Free Voice Chat"
              >
                <Mic className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Voice Chat</span>
              </button>
            )}

            {/* ✨ Magic Creation Studio Hub */}
            <button
              onClick={() => setIsCreationHubOpen(true)}
              className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-[#FFD76A] border border-amber-500/35 transition-all shadow-sm flex items-center gap-1"
              title="Astra Multimodal Creation Hub"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {/* Edit: Rename Active Conversation */}
            <button
              onClick={handleOpenRenameModal}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1 shrink-0"
              title="Rename Conversation"
              aria-label="Rename conversation"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline text-[11px] font-mono">Edit</span>
            </button>

            {/* ⋮ Menu */}
            <div className="relative">
              <button
                onClick={() => setIsChatMenuOpen(!isChatMenuOpen)}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                title="Chat Options & Controls"
                aria-label="More chat options"
                aria-expanded={isChatMenuOpen}
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {/* Dropdown Menu Backdrop & Card */}
              {isChatMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsChatMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#090D18]/95 backdrop-blur-2xl border border-amber-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.85)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={handleOpenRenameModal}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-left"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Rename Conversation</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsChatMenuOpen(false);
                        handleExportChat();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-left"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Export Chat (.json)</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsChatMenuOpen(false);
                        handleTogglePinConversation(activeConversation.id);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-left"
                    >
                      <Pin className={`w-3.5 h-3.5 ${activeConversation.isPinned ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                      <span>{activeConversation.isPinned ? 'Unpin Conversation' : 'Pin to Top'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsChatMenuOpen(false);
                        setIsThemeModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-left"
                    >
                      <Palette className="w-3.5 h-3.5 text-[#F5B82E]" />
                      <span>Chat Appearance Themes</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsChatMenuOpen(false);
                        setIsMemoryModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-left"
                    >
                      <Brain className="w-3.5 h-3.5 text-purple-400" />
                      <span>Memory Vault ({userMemories.length})</span>
                    </button>
                    <div className="h-px bg-white/10 my-1" />
                    <button
                      onClick={() => {
                        setIsChatMenuOpen(false);
                        handleClearConversationMessages();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Clear Messages</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Selected Persona Agent Banner */}
        {selectedAgent && (
          <div className="px-4 py-2 bg-gradient-to-r from-purple-950/60 via-[#070A14] to-cyan-950/40 border-b border-purple-500/30 flex items-center justify-between text-xs shrink-0 z-10">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-bold text-white font-mono">{selectedAgent.name}</span>
              <span className="text-slate-400 text-[11px] font-mono hidden sm:inline">• {selectedAgent.role}</span>
            </div>
            {onClearAgent && (
              <button
                onClick={onClearAgent}
                className="px-2.5 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-mono transition-colors"
              >
                Dismiss Persona
              </button>
            )}
          </div>
        )}

        {/* Document Intelligence RAG Tray */}
        <DocumentIntelligencePanel
          activeDoc={activeDoc}
          onDocLoaded={(doc) => setActiveDoc(doc)}
          onDocRemoved={() => setActiveDoc(null)}
          onTriggerPrompt={(p) => handleSendMessage(p)}
        />

        {/* Message Stream */}
        <div
          className={`flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 z-10 relative ${
            currentChatTheme.spacing === 'compact'
              ? 'space-y-3 sm:space-y-4'
              : currentChatTheme.spacing === 'relaxed'
              ? 'space-y-6 sm:space-y-8'
              : 'space-y-4 sm:space-y-5'
          }`}
        >
          {activeConversation.messages.map((msg) => {
            return (
              <div key={msg.id} className="w-full max-w-[1100px] xl:max-w-[1200px] mx-auto min-w-0">
                {msg.role === 'user' ? (
                  /* Section 6: USER MESSAGE */
                  <div className="flex flex-col items-end gap-1.5 ml-auto max-w-[88%] sm:max-w-[75%] min-w-0">
                    {/* Attachments if any */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-1 justify-end">
                        {msg.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-[#090D18]/90 border border-amber-500/30 text-xs text-slate-200"
                          >
                            {att.type === 'image' ? (
                              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                            ) : att.type === 'video' ? (
                              <Film className="w-3.5 h-3.5 text-rose-400" />
                            ) : (
                              <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            )}
                            <span className="truncate max-w-[160px] font-mono text-[11px]">{att.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* User Bubble with Gold border, Dark background, soft glow */}
                    <div
                      className={`p-4 rounded-2xl rounded-br-none border leading-relaxed text-xs sm:text-sm font-['Inter',sans-serif] backdrop-blur-md shadow-lg transition-all ${currentChatTheme.userBubble}`}
                      style={{
                        boxShadow: currentChatTheme.glow ? `0 0 20px ${currentChatTheme.accent}20` : undefined
                      }}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>

                    {/* Timestamp & Delivery Indicator */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono pr-1">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-[#F5B82E] font-bold" title="Delivered to Astra Brain 3.0">✓✓</span>
                    </div>
                  </div>
                ) : (
                  /* Section 7 & 10: ASTRA ANSWER CARD (Large elegant glassmorphism card) */
                  <div
                    className={`w-full rounded-3xl p-5 sm:p-7 backdrop-blur-2xl border leading-relaxed shadow-2xl transition-all space-y-4 ${currentChatTheme.assistantBubble} ${currentChatTheme.border}`}
                    style={{
                      boxShadow: currentChatTheme.glow ? `0 0 35px ${currentChatTheme.accent}15` : undefined
                    }}
                  >
                    {/* Header: ASTRA | ASTRA BRAIN → STATUS */}
                    <div className="flex items-center justify-between border-b border-amber-500/15 pb-3.5">
                      <div className="flex items-center gap-3">
                        <AstraCoreIcon size={24} isProcessing={msg.isStreaming} />
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-extrabold text-sm tracking-wider text-white font-mono">
                            ASTRA
                          </span>
                          {/* Compact Astra Brain Status */}
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-[#FFD76A] border border-amber-500/35 text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                            <Brain className="w-3 h-3 text-[#F5B82E]" />
                            <span>ASTRA BRAIN → {formatCategoryToCapability(msg.category)}</span>
                          </span>

                          {msg.cached && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-semibold flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5 text-amber-400" />
                              <span>Instant</span>
                            </span>
                          )}

                          {msg.detectedLanguage && msg.detectedLanguage !== 'en' && (
                            <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-mono flex items-center gap-1">
                              <Languages className="w-2.5 h-2.5" />
                              <span>{msg.detectedLanguage === 'te' ? 'తెలుగు' : 'हिंदी'}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* Generated Multimodal Media Card (Veo Video / Gemini Image) if any */}
                    {msg.generatedMedia && (
                      <div>
                        <GeneratedMediaCard
                          media={msg.generatedMedia}
                          onEditRequest={(instruction, base64Image) => {
                            handleOpenCreationModal('image', instruction, base64Image);
                          }}
                          onAnimateToVideo={(base64Image, p) => {
                            handleOpenCreationModal('video', p, base64Image);
                          }}
                          onOpenStudio={() => setIsCreationHubOpen(true)}
                        />
                      </div>
                    )}

                    {/* Answer Body / Markdown with Space Grotesk Headings and Golden Core Styling */}
                    {msg.content ? (
                      <ChatMarkdown content={msg.content} accentColor={currentChatTheme.accent} />
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 py-3 font-mono text-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F5B82E] animate-pulse" />
                        <span>{msg.statusLabel || 'Astra Brain 3.0 is synthesizing response...'}</span>
                      </div>
                    )}

                    {/* Verified Sources Drawer */}
                    {msg.sources && msg.sources.length > 0 && (
                      <VerifiedSourcesDrawer sources={msg.sources} />
                    )}

                    {/* Museum / Historical RAG sources */}
                    {msg.ragSources && msg.ragSources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-amber-500/15 space-y-1.5">
                        <div className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Landmark className="w-3.5 h-3.5" />
                          <span>Grounded in Archival Museum Repository:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.ragSources.map((source, idx) => (
                            <button
                              key={idx}
                              onClick={() => source.objectId && onNavigateToObject?.(source.objectId)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] text-amber-300 transition-colors"
                            >
                              <span>{source.title}</span>
                              <ExternalLink className="w-3 h-3 text-amber-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Actions: Copy, Share, Save, Regenerate */}
                    {msg.content && (
                      <div className="flex items-center flex-wrap justify-between gap-3 pt-3 border-t border-amber-500/15 text-xs text-slate-400">
                        <div className="flex items-center flex-wrap gap-2">
                          {/* Copy */}
                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-amber-500/15 text-slate-300 hover:text-[#FFD76A] border border-white/5 hover:border-amber-500/30 flex items-center gap-1.5 transition-all text-xs font-mono"
                            title="Copy answer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-300">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          {/* Share */}
                          <button
                            onClick={() => handleShareAnswer(msg.content)}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 flex items-center gap-1.5 transition-all text-xs font-mono"
                            title="Share answer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                          </button>

                          {/* Save */}
                          <button
                            onClick={() => handleSaveAnswer(msg)}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500/15 text-slate-300 hover:text-emerald-300 border border-white/5 hover:border-emerald-500/30 flex items-center gap-1.5 transition-all text-xs font-mono"
                            title="Save to Knowledge Library"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${savedMessageIds.has(msg.id) ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                            <span>{savedMessageIds.has(msg.id) ? 'Saved' : 'Save'}</span>
                          </button>

                          {/* Regenerate */}
                          <button
                            onClick={() => handleRegenerate(msg.id)}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-amber-500/15 text-slate-300 hover:text-[#FFD76A] border border-white/5 hover:border-amber-500/30 flex items-center gap-1.5 transition-all text-xs font-mono"
                            title="Regenerate this response"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Regenerate</span>
                          </button>

                          {/* Read Aloud */}
                          <button
                            onClick={() => speakText(msg.content)}
                            className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all text-xs font-mono"
                            title="Listen via Text-to-Speech"
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                            <span>{isSpeaking ? 'Stop Audio' : 'Read Aloud'}</span>
                          </button>
                        </div>

                        {/* Quick refinement triggers */}
                        <div className="flex items-center gap-2 text-[11px]">
                          <button
                            onClick={() => handleSendMessage(`Explain this simpler in plain words please.`)}
                            className="hover:text-cyan-300 transition-colors hidden sm:inline"
                          >
                            Simpler
                          </button>
                          <span className="text-slate-600 hidden sm:inline">•</span>
                          <button
                            onClick={() => handleSendMessage(`Explain this deeper with more technical rigor and detail please.`)}
                            className="hover:text-cyan-300 transition-colors hidden sm:inline"
                          >
                            Deeper
                          </button>
                          {msg.model && (
                            <>
                              <span className="text-slate-600 hidden md:inline">•</span>
                              <span className="font-mono text-[10px] text-slate-500 hidden md:inline">{msg.model}</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Suggested Action Chips */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                        {msg.suggestedActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(action)}
                            className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-amber-500/15 border border-amber-500/20 hover:border-amber-500/40 text-[11px] text-slate-300 hover:text-amber-200 transition-all text-left flex items-center gap-1.5 shadow-sm"
                          >
                            <span>{action}</span>
                            <ArrowRight className="w-2.5 h-2.5 opacity-60 text-amber-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Active Step Indicator Pill when Loading */}
          {isLoading && currentStepStatus && (
            <div className="w-full max-w-[1100px] xl:max-w-[1200px] mx-auto">
              <div className="flex items-center gap-2.5 p-3.5 max-w-md rounded-2xl bg-[#090D18]/90 border border-amber-500/30 text-xs text-amber-200 shadow-xl backdrop-blur-xl">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="font-medium font-mono">{currentStepStatus}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer & Quick Actions (Sections 11 & 12) */}
        <div className="p-2.5 sm:p-4 border-t border-amber-500/20 bg-[#060814]/95 backdrop-blur-2xl z-20 space-y-2 shrink-0">
          {/* Quick Actions (Section 12: Above the input bar) */}
          <div className="w-full max-w-[1100px] xl:max-w-[1200px] mx-auto flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none px-1">
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => imageInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-amber-500/15 border border-amber-500/25 hover:border-amber-400/50 text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-all shrink-0 shadow-sm group"
                title="Upload Image"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#F5B82E] group-hover:scale-110 transition-transform" />
                <span>Image</span>
              </button>
              <button
                onClick={() => videoInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-amber-500/15 border border-amber-500/25 hover:border-amber-400/50 text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-all shrink-0 shadow-sm group"
                title="Upload Video"
              >
                <Film className="w-3.5 h-3.5 text-[#F5B82E] group-hover:scale-110 transition-transform" />
                <span>Video</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-amber-500/15 border border-amber-500/25 hover:border-amber-400/50 text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-all shrink-0 shadow-sm group"
                title="Upload Document"
              >
                <FileText className="w-3.5 h-3.5 text-[#F5B82E] group-hover:scale-110 transition-transform" />
                <span>Document</span>
              </button>
              <button
                onClick={() => setIsCameraOpen(true)}
                className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-amber-500/15 border border-amber-500/25 hover:border-amber-400/50 text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-all shrink-0 shadow-sm group"
                title="Capture Camera Photo"
              >
                <Camera className="w-3.5 h-3.5 text-[#F5B82E] group-hover:scale-110 transition-transform" />
                <span>Camera</span>
              </button>
              <button
                onClick={() => handleOpenCreationModal('image')}
                className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-amber-500/15 border border-amber-500/25 hover:border-amber-400/50 text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-all shrink-0 shadow-sm group"
                title="Create AI Image"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFD76A] group-hover:scale-110 transition-transform" />
                <span>Create Image</span>
              </button>
              <button
                onClick={() => onSelectPower?.('cinema-studio')}
                className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-amber-500/15 border border-amber-500/25 hover:border-amber-400/50 text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-all shrink-0 shadow-sm group"
                title="Astra Cinema Studio"
              >
                <Clapperboard className="w-3.5 h-3.5 text-[#F5B82E] group-hover:scale-110 transition-transform" />
                <span>Cinema</span>
              </button>
              <button
                onClick={() => onSelectPower?.('image-to-game')}
                className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-amber-500/15 border border-amber-500/25 hover:border-amber-400/50 text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-all shrink-0 shadow-sm group"
                title="Image to Game World"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-[#F5B82E] group-hover:scale-110 transition-transform" />
                <span>Game</span>
              </button>
              <button
                onClick={() => setIsAttachmentMenuOpen(true)}
                className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-amber-500/15 border border-amber-500/25 hover:border-amber-400/50 text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-all shrink-0 shadow-sm group"
                title="More Tools"
              >
                <Grid className="w-3.5 h-3.5 text-[#F5B82E] group-hover:scale-110 transition-transform" />
                <span>More</span>
              </button>
            </div>

            {/* Answer Depth Selector */}
            <div className="hidden lg:flex items-center gap-1 shrink-0 text-slate-400 font-mono text-[10px]">
              {(['short', 'balanced', 'detailed'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAnswerLength(mode)}
                  className={`px-2 py-0.5 rounded-full transition-all ${
                    answerLength === mode
                      ? 'bg-amber-500/20 text-[#FFD76A] border border-amber-500/40 font-bold'
                      : 'hover:text-white'
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Active Attachments Preview */}
          {attachments.length > 0 && (
            <div className="w-full max-w-[1100px] xl:max-w-[1200px] mx-auto flex flex-wrap gap-2">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs text-white shadow-md animate-fadeIn"
                >
                  {att.type === 'image' && att.url ? (
                    <img
                      src={att.url}
                      alt={att.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-md object-cover border border-white/20"
                    />
                  ) : att.type === 'video' ? (
                    <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
                      <Film className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <FileText className="w-4 h-4 text-cyan-400" />
                  )}
                  <div className="flex flex-col max-w-[150px]">
                    <span className="truncate text-xs font-medium text-slate-200">{att.name}</span>
                    <span className="text-[10px] font-mono text-amber-400/80 uppercase">{att.type}</span>
                  </div>
                  <button
                    onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                    title="Remove attachment"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Section 11: CHAT INPUT (Floating Input Bar: Structure [ + ] Message ASTRA... [🎤] [➤]) */}
          <div className="w-full max-w-[1100px] xl:max-w-[1200px] mx-auto relative flex items-center gap-2 bg-[#060814]/90 backdrop-blur-2xl border border-amber-500/35 focus-within:border-amber-400 focus-within:shadow-[0_0_25px_rgba(245,184,46,0.25)] rounded-full px-3 py-1.5 sm:py-2 shadow-2xl transition-all">
            {/* Hidden Input Handles for Photos, Videos and Documents */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleGenericFileUpload(e, 'document')}
              className="hidden"
            />
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              onChange={(e) => handleGenericFileUpload(e, 'image')}
              className="hidden"
            />
            <input
              type="file"
              ref={videoInputRef}
              accept="video/*"
              onChange={(e) => handleGenericFileUpload(e, 'video')}
              className="hidden"
            />

            {/* 1. PLUS BUTTON [ + ] */}
            <div className="relative">
              <button
                onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                className={`w-9 h-9 rounded-full border transition-all shrink-0 flex items-center justify-center ${
                  isAttachmentMenuOpen
                    ? 'bg-[#F5B82E] text-slate-950 font-bold border-amber-300 shadow-[0_0_15px_#F5B82E] rotate-45'
                    : 'bg-white/[0.06] border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-500/20'
                }`}
                title="Add Media, Files or Create with AI"
              >
                <Plus className="w-4 h-4 transition-transform duration-200" />
              </button>

              <AttachmentActionMenu
                isOpen={isAttachmentMenuOpen}
                onClose={() => setIsAttachmentMenuOpen(false)}
                onSelectUploadImage={() => imageInputRef.current?.click()}
                onSelectUploadVideo={() => videoInputRef.current?.click()}
                onSelectTakePhoto={() => setIsCameraOpen(true)}
                onSelectChooseFile={() => fileInputRef.current?.click()}
                onSelectGenerateImage={() => handleOpenCreationModal('image')}
                onSelectCinemaStudio={() => onSelectPower?.('cinema-studio')}
                onSelectImageToGame={() => onSelectPower?.('image-to-game')}
                onSelectDataAnalysis={() => fileInputRef.current?.click()}
                onSelectMoreTools={() => setIsCreationHubOpen(true)}
              />
            </div>

            {/* 2. INPUT FIELD: Message ASTRA... */}
            <textarea
              rows={1}
              placeholder="Message ASTRA..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 min-w-0 bg-transparent text-white text-xs sm:text-sm focus:outline-none placeholder:text-slate-400 resize-none py-1.5 px-2 font-['Inter',sans-serif]"
            />

            {/* 3. VOICE INPUT HANDLER [🎤] with 5 states & direct submission */}
            <VoiceInputHandler
              onTranscript={(transcript) => {
                setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
              }}
              onSubmitPrompt={(spokenPrompt) => {
                setInputText('');
                handleSendMessage(spokenPrompt);
              }}
              currentValue={inputText}
              isProcessing={isLoading}
              isSpeaking={isSpeaking}
              onStopSpeaking={() => {
                window.speechSynthesis?.cancel();
                setIsSpeaking(false);
              }}
              accentColor="amber"
              autoSpeak={autoSpeak}
              onToggleAutoSpeak={() => {
                const next = !autoSpeak;
                setAutoSpeak(next);
                try {
                  localStorage.setItem('astra7_auto_speak', String(next));
                } catch {}
              }}
              onOpenVoiceChat={() => onOpenVoiceMode?.()}
              language={
                selectedLanguage === 'te'
                  ? 'te-IN'
                  : selectedLanguage === 'hi'
                  ? 'hi-IN'
                  : 'en-US'
              }
              size="sm"
            />

            {/* 4. SEND BUTTON [➤] */}
            {isLoading ? (
              <button
                onClick={handleStopGeneration}
                className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)] shrink-0 flex items-center justify-center cursor-pointer"
                title="Stop Generating"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() && attachments.length === 0}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#A66A00] via-[#F5B82E] to-[#FFD76A] hover:brightness-110 disabled:opacity-30 text-slate-950 font-bold transition-all shadow-[0_0_18px_rgba(245,184,46,0.45)] shrink-0 flex items-center justify-center cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4 text-slate-950 -translate-y-px translate-x-px" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Persistent Memory & Context Modal */}
      <MemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        onMemoriesUpdated={setUserMemories}
      />

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Quick Media Creation Modal (Direct Veo 3.1 & Gemini 3.1 Flash Image) */}
      <MediaCreationModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        initialMode={creationModalMode}
        initialPrompt={creationModalPrompt}
        referenceImage={creationModalRefImage}
        onGenerationStarted={(task) => {
          setIsCreationModalOpen(false);
          if (task.imageUrl) {
            handleMediaCreated({
              id: `item-${Date.now()}`,
              userId: 'user-01',
              mediaType: task.type,
              url: task.imageUrl,
              prompt: task.prompt,
              provider: 'google',
              model: task.model,
              aspectRatio: task.aspectRatio || '1:1',
              createdAt: new Date().toISOString()
            });
          } else {
            handleSendMessage(task.prompt);
          }
        }}
      />

      {/* Astra Media Library Gallery Modal */}
      <MediaGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onUseInChat={(item) => handleMediaCreated(item)}
      />

      {/* Trending Multimodal Models Modal */}
      <TrendingModelsModal
        isOpen={isModelsOpen}
        onClose={() => setIsModelsOpen(false)}
        onSelectModel={(modelId) => {
          handleSendMessage(`Explain the technical capabilities, architecture, and prompt recommendations for the ${modelId} model.`);
        }}
      />

      {/* Full-Screen Astra Creation Studio Hub */}
      {isCreationHubOpen && (
        <AstraCreationHub
          onBackToChat={() => setIsCreationHubOpen(false)}
          onSendMediaToChat={(media) => {
            handleMediaCreated({
              id: `item-${Date.now()}`,
              userId: 'user-01',
              mediaType: media.type,
              url: media.url,
              prompt: media.prompt,
              provider: 'google',
              model: media.model,
              createdAt: new Date().toISOString()
            });
            setIsCreationHubOpen(false);
          }}
        />
      )}

      {/* Chat Appearance Customization Modal */}
      <ChatAppearanceModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentChatTheme}
        onThemeChange={(newTheme) => setCurrentChatTheme(newTheme)}
      />

      {/* Rename Conversation Modal (Section 6 & 14) */}
      {isRenameModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsRenameModalOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsRenameModalOpen(false);
          }}
          tabIndex={-1}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#090D18] border border-amber-500/35 shadow-[0_15px_45px_rgba(0,0,0,0.85)] p-5 space-y-4 animate-in zoom-in-95 duration-150 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm font-['Space_Grotesk',sans-serif]">
                <Edit3 className="w-4 h-4 text-[#F5B82E]" />
                <span>Rename Conversation</span>
              </div>
              <button
                onClick={() => setIsRenameModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-mono">Conversation Title</label>
              <input
                type="text"
                autoFocus
                value={renameInputValue}
                onChange={(e) => setRenameInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSaveRenameFromModal();
                  } else if (e.key === 'Escape') {
                    setIsRenameModalOpen(false);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/30 text-white text-sm focus:outline-none focus:border-amber-400 focus:shadow-[0_0_15px_rgba(245,184,46,0.25)] transition-all"
                placeholder="Enter title..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRenameModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRenameFromModal}
                disabled={!renameInputValue.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#F5B82E] hover:brightness-110 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(245,184,46,0.3)]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 border border-amber-300 animate-bounce">
          <Check className="w-4 h-4 text-slate-950" />
          <span>{shareToast}</span>
        </div>
      )}
    </div>
  );
};
