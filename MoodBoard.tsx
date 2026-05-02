'use client';

import { useState } from 'react';
import { MediaAsset } from '@/types';
import { cn } from '@/lib/utils';
import { Plus, Image as ImageIcon, X, Upload } from 'lucide-react';

interface MoodBoardProps {
  assets: MediaAsset[];
  slots?: number;
  editable?: boolean;
  onUpload?: (slotIndex: number, file: File) => void;
  onRemove?: (mediaId: string) => void;
}

export default function MoodBoard({ 
  assets, 
  slots = 8, 
  editable = false,
  onUpload,
  onRemove 
}: MoodBoardProps) {
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  // Create slot array with existing assets
  const slotArray = Array.from({ length: slots }, (_, i) => {
    return assets.find(a => a.slot_index === i + 1);
  });

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    
    if (!editable || !onUpload) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onUpload(slotIndex, files[0]);
    }
  };

  const handleFileSelect = (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUpload || !e.target.files?.length) return;
    onUpload(slotIndex, e.target.files[0]);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-charcoal-500 flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-kraft-500" />
        Mood Board
      </h4>
      
      <div className="mood-board-grid">
        {slotArray.map((asset, index) => (
          <div
            key={index}
            className={cn(
              "mood-board-slot relative group",
              asset && "mood-board-slot-filled",
              dragOverSlot === index && "border-gold-400 bg-gold-50"
            )}
            onDragOver={(e) => {
              e.preventDefault();
              if (editable) setDragOverSlot(index);
            }}
            onDragLeave={() => setDragOverSlot(null)}
            onDrop={(e) => handleDrop(e, index + 1)}
          >
            {asset ? (
              <>
                {/* Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center rounded-lg"
                  style={{ 
                    backgroundImage: asset.is_placeholder 
                      ? 'linear-gradient(135deg, #FAF7EA 0%, #E5D5C1 100%)'
                      : `url(${asset.file_url})`
                  }}
                >
                  {asset.is_placeholder && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-kraft-300" />
                    </div>
                  )}
                </div>
                
                {/* Hover overlay */}
                {editable && onRemove && (
                  <div className="absolute inset-0 bg-charcoal-600/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => onRemove(asset.media_id)}
                      className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {/* Caption */}
                {asset.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-charcoal-600/80 to-transparent rounded-b-lg">
                    <p className="text-[10px] text-white truncate">{asset.caption}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {editable ? (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(index + 1, e)}
                    />
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px]">Upload</span>
                  </label>
                ) : (
                  <>
                    <Plus className="w-6 h-6" />
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      
      {editable && (
        <p className="text-xs text-charcoal-400 text-center">
          Drag and drop images or click to upload
        </p>
      )}
    </div>
  );
}
