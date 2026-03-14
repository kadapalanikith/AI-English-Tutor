import { useEffect } from 'react';

/**
 * Toast notification that auto-dismisses after 5 s.
 * @param {{ message: string | null; onClose: () => void }} props
 */
const Notification = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-500 text-white px-6 py-3 rounded-xl shadow-xl animate-slide-up"
    >
      <span>⚠️</span>
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white/80 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
};

export default Notification;
