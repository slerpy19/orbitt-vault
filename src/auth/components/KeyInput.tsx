import React from 'react';

interface KeyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const KeyInput: React.FC<KeyInputProps> = ({
  value,
  onChange,
  placeholder = 'orbitt-xxxxxxxxxxxxxxxxxxxxxxxx',
  disabled = false,
  autoFocus = false,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!val.startsWith('orbitt-') && val.length > 0) {
      val = 'orbitt-' + val;
    }
    onChange(val);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').toLowerCase().replace(/[^a-z0-9-]/g, '');
    let val = text;
    if (!val.startsWith('orbitt-') && val.length > 0) {
      val = 'orbitt-' + val;
    }
    onChange(val);
  };

  const isValidFormat = /^orbitt-[a-z0-9]{24,}$/.test(value);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        id="access-key"
        name="access-key"
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3.5 rounded-lg border transition-all
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          font-mono text-base
          ${isValidFormat && value.length > 20
            ? 'border-green-300 dark:border-green-700'
            : value.length > 0
            ? 'border-yellow-300 dark:border-yellow-700'
            : 'border-gray-300 dark:border-gray-600'}
        `}
        aria-label="Access key"
        autoComplete="off"
        spellCheck={false}
      />
      {value.length > 0 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isValidFormat && value.length >= 31 ? (
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};