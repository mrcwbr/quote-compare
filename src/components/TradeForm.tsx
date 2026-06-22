import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  initialName?: string
  onSubmit: (name: string) => void
  onDelete?: () => void
  onCancel: () => void
}

export default function TradeForm({ initialName = '', onSubmit, onDelete, onCancel }: Props) {
  const { t } = useTranslation()
  const [name, setName] = useState(initialName)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {initialName ? t('tradeForm.titleEdit') : t('tradeForm.titleNew')}
      </h2>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (name.trim()) onSubmit(name.trim())
        }}
      >
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('tradeForm.nameLabel')} <span className="text-red-500">*</span>
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('tradeForm.namePlaceholder')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
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
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {t('common.save')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
