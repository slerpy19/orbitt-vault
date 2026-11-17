import React from 'react';

interface DeviceBoundNoticeProps {
  onClose: () => void;
}

export const DeviceBoundNotice: React.FC<DeviceBoundNoticeProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Device Already Bound</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              This access key is already linked to another device. Each key can only be used on one phone/device for security.
            </p>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              If this is your device, try clearing browser data or contact the administrator for a new key.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          I Understand
        </button>
      </div>
    </div>
  );
};