import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  initialName?: string;
  onSubmit: (name: string) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export default function TradeForm({
  initialName = '',
  onSubmit,
  onDelete,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        {initialName ? t('tradeForm.titleEdit') : t('tradeForm.titleNew')}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) onSubmit(name.trim());
        }}
      >
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {t('tradeForm.nameLabel')} <span className="text-red-500">*</span>
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('tradeForm.namePlaceholder')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              {t('tradeForm.deleteTrade')}
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('common.save')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
