import React from 'react';

interface ComboAnnouncementProps {
  message: string | null;
}

/**
 * Displays a floating combo announcement when the user clears 3+ pairs consecutively
 * without a misclick.
 */
export const ComboAnnouncement: React.FC<ComboAnnouncementProps> = ({ message }) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1500); // Show for 1.5s
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible) return null;

  return (
    <div
      className={`
        fixed top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none
        transition-all duration-500
        ${visible ? 'opacity-100 animate-combo-pop' : 'opacity-0 -translate-y-4'}
      `}
      aria-live="polite"
    >
      <div
        className="mt-10 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl text-center"
      >
        <span className="text-4xl font-extrabold text-pink-600 drop-shadow-md">
          {message}
        </span>
      </div>
    </div>
  );
};
