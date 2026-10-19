import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Film,
  Bookmark,
  Trash2,
  Download,
  Copy,
  Check,
  X,
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { mediaApi, GalleryMediaItem } from '../../services/mediaApi';

interface MediaGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseInChat?: (item: GalleryMediaItem) => void;
}

export const MediaGalleryModal: React.FC<MediaGalleryModalProps> = ({
  isOpen,
  onClose,
  onUseInChat,
}) => {
  const [items, setItems] = useState<GalleryMediaItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'favorites'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryMediaItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadGallery();
    }
  }, [isOpen, filter]);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await mediaApi.getGallery(filter);
      setItems(data);
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const isFav = await mediaApi.toggleFavorite(id);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isFavorite: isFav } : item))
      );
      if (selectedItem?.id === id) {
        setSelectedItem((prev) => (prev ? { ...prev, isFavorite: isFav } : null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this media item?')) return;
    try {
      await mediaApi.deleteGalleryItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[85vh] flex flex-col bg-[#0A0E1A] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-[#0C1222]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Astra Gallery & AI Media Library</h2>
              <p className="text-xs text-slate-400">
                Your personal repository of generated images, videos, variations, and creative assets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between p-3 px-6 border-b border-white/5 bg-[#080C16]">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['all', 'image', 'video', 'favorites'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all capitalize ${
                  filter === tab
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-bold shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab === 'all'
                  ? 'All Media'
                  : tab === 'image'
                  ? 'Images'
                  : tab === 'video'
                  ? 'Videos'
                  : 'Favorites'}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-slate-400">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Body Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Gallery Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-48 text-slate-400 font-mono text-xs">
                Loading library...
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400 p-6">
                <ImageIcon className="w-10 h-10 mb-2 opacity-40 text-amber-400" />
                <p className="text-sm font-medium text-white">No media found in this view</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Generate images or videos in chat or the Astra Creation Hub to populate your personal gallery.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`relative rounded-2xl overflow-hidden aspect-square border cursor-pointer group bg-[#0D1426] transition-all ${
                      selectedItem?.id === item.id
                        ? 'border-amber-400 ring-2 ring-amber-400/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {item.mediaType === 'video' ? (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.prompt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}

                    {/* Media Type Overlay Pill */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white flex items-center gap-1 border border-white/10">
                      {item.mediaType === 'video' ? <Film className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                      <span>{item.mediaType}</span>
                    </div>

                    {/* Quick Favorite Toggle */}
                    <button
                      onClick={(e) => handleToggleFavorite(item.id, e)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm border transition-all ${
                        item.isFavorite
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-black/50 text-white/80 border-white/10 opacity-0 group-hover:opacity-100 hover:text-amber-400'
                      }`}
                    >
                      <Bookmark className="w-3 h-3 fill-current" />
                    </button>

                    {/* Bottom Prompt Overlay on Hover */}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[11px] text-white truncate font-medium">{item.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Sidebar for Selected Item */}
          {selectedItem && (
            <div className="w-80 border-l border-white/10 bg-[#080C16] p-4 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="rounded-xl overflow-hidden aspect-video bg-black mb-3 border border-white/10">
                  {selectedItem.mediaType === 'video' ? (
                    <video
                      src={selectedItem.url}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.prompt}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                <h3 className="text-xs font-semibold text-white mb-1">Prompt Details</h3>
                <div className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 mb-3 text-xs text-slate-300">
                  <p className="pr-6 text-[11px] leading-relaxed">{selectedItem.prompt}</p>
                  <button
                    onClick={() => handleCopyPrompt(selectedItem.prompt)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-white"
                    title="Copy Prompt"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="space-y-2 text-[11px] font-mono text-slate-400 border-t border-white/5 pt-3">
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="text-white">{selectedItem.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span className="text-white">{selectedItem.provider}</span>
                  </div>
                  {selectedItem.aspectRatio && (
                    <div className="flex justify-between">
                      <span>Aspect Ratio:</span>
                      <span className="text-white">{selectedItem.aspectRatio}</span>
                    </div>
                  )}
                  {selectedItem.style && (
                    <div className="flex justify-between">
                      <span>Style:</span>
                      <span className="text-white capitalize">{selectedItem.style}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="text-white">
                      {new Date(selectedItem.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                {onUseInChat && (
                  <button
                    onClick={() => {
                      onUseInChat(selectedItem);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Use in Chat Conversation</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <a
                    href={selectedItem.url}
                    download={`astra7-${selectedItem.id}.${selectedItem.mediaType === 'video' ? 'mp4' : 'png'}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs text-center border border-white/10 flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                  <button
                    onClick={(e) => handleDelete(selectedItem.id, e)}
                    className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs border border-rose-500/20 flex items-center justify-center gap-1"
                    title="Delete item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
