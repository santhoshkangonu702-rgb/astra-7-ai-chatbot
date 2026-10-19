import React, { useRef, useEffect } from 'react';
import {
  Image as ImageIcon,
  Video,
  Camera,
  FileText,
  Sparkles,
  Clapperboard,
  Gamepad2,
  BarChart3,
  Grid,
  X
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

export interface AttachmentActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUploadImage: () => void;
  onSelectUploadVideo: () => void;
  onSelectTakePhoto: () => void;
  onSelectChooseFile: () => void;
  onSelectGenerateImage: () => void;
  onSelectGenerateVideo?: () => void;
  onSelectCinemaStudio?: () => void;
  onSelectImageToGame?: () => void;
  onSelectDataAnalysis?: () => void;
  onSelectMoreTools?: () => void;
}

export const AttachmentActionMenu: React.FC<AttachmentActionMenuProps> = ({
  isOpen,
  onClose,
  onSelectUploadImage,
  onSelectUploadVideo,
  onSelectTakePhoto,
  onSelectChooseFile,
  onSelectGenerateImage,
  onSelectCinemaStudio,
  onSelectImageToGame,
  onSelectDataAnalysis,
  onSelectMoreTools
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /**
   * Section 11 items:
   * Image, Video, Document, Camera, Create Image, Cinema Studio, Image → Game, Data, More
   */
  const menuItems = [
    {
      id: 'image',
      icon: ImageIcon,
      title: 'Image',
      subtitle: 'Upload JPG, PNG, WEBP',
      color: 'text-amber-300 bg-amber-400/10 border-amber-400/30',
      action: onSelectUploadImage,
    },
    {
      id: 'video',
      icon: Video,
      title: 'Video',
      subtitle: 'Upload MP4, MOV, WEBM',
      color: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
      action: onSelectUploadVideo,
    },
    {
      id: 'file',
      icon: FileText,
      title: 'Document',
      subtitle: 'PDF, DOCX, TXT, code files',
      color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
      action: onSelectChooseFile,
    },
    {
      id: 'camera',
      icon: Camera,
      title: 'Camera',
      subtitle: 'Capture live camera photo',
      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      action: onSelectTakePhoto,
    },
    {
      id: 'gen-image',
      icon: Sparkles,
      title: 'Create Image',
      subtitle: 'Photorealistic AI generation',
      color: 'text-[#FFD76A] bg-amber-500/20 border-amber-400/40',
      action: onSelectGenerateImage,
    },
    {
      id: 'cinema-studio',
      icon: Clapperboard,
      title: 'Cinema Studio',
      subtitle: 'Epic Indian fantasy & trailer editor',
      color: 'text-rose-300 bg-rose-500/20 border-rose-500/30',
      action: onSelectCinemaStudio || onSelectUploadVideo,
    },
    {
      id: 'image-to-game',
      icon: Gamepad2,
      title: 'Image → Game',
      subtitle: 'Photo to playable game concept',
      color: 'text-purple-300 bg-purple-500/20 border-purple-500/30',
      action: onSelectImageToGame || onSelectUploadImage,
    },
    {
      id: 'data',
      icon: BarChart3,
      title: 'Data',
      subtitle: 'CSV, datasets & calculations',
      color: 'text-blue-300 bg-blue-500/20 border-blue-500/30',
      action: onSelectDataAnalysis || onSelectChooseFile,
    },
    {
      id: 'more',
      icon: Grid,
      title: 'More',
      subtitle: 'Astra 7 modular intelligence tools',
      color: 'text-indigo-300 bg-indigo-500/20 border-indigo-500/30',
      action: onSelectMoreTools || onClose,
    },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full left-0 mb-3 w-80 sm:w-[420px] max-h-[80vh] overflow-y-auto z-40 bg-[#090D18]/95 backdrop-blur-2xl border border-amber-500/30 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.85)] p-3 animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-amber-500/15 mb-2">
        <span className="text-[11px] font-mono tracking-wider text-[#FFD76A] font-bold uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Astra Multimedia & Creation Core
        </span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                triggerHaptic(14);
                item.action();
                onClose();
              }}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl hover:bg-white/[0.06] border border-transparent hover:border-amber-500/30 transition-all text-left group"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 shadow-sm ${item.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate group-hover:text-[#FFD76A] transition-colors">
                  {item.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {item.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
