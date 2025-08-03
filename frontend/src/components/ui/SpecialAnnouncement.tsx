import React, { useEffect } from 'react';

interface SpecialAnnouncementProps {
  announcement: string | null;
  onClose: () => void;
}

export const SpecialAnnouncement: React.FC<SpecialAnnouncementProps> = ({ announcement, onClose }) => {
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Display for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [announcement, onClose]);

  if (!announcement) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
      aria-live="polite"
    >
      <div
        className={`
          text-white px-8 py-4 rounded-lg shadow-2xl text-center animate-combo-pop
          ${announcement.includes('Amazing') 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
            : 'bg-gradient-to-r from-gray-600 to-blue-800'}
        `}
      >
        <span className="text-5xl font-extrabold drop-shadow-lg">
          {announcement}
        </span>
      </div>
    </div>
  );
};
