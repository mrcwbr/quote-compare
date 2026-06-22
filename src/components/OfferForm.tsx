import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Offer } from '../types'

type OfferData = Omit<Offer, 'id'>

interface Props {
  initialData?: OfferData
  onSubmit: (data: OfferData) => void
  onDelete?: () => void
  onCancel: () => void
}

export default function OfferForm({ initialData, onSubmit, onDelete, onCancel }: Props) {
  const { t } = useTranslation()
  const [company, setCompany] = useState(initialData?.company ?? '')
  const [price, setPrice] = useState(initialData?.price != null ? String(initialData.price) : '')
  const [date, setDate] = useState(initialData?.date ?? '')
  const [link, setLink] = useState(initialData?.link ?? '')
  const [note, setNote] = useState(initialData?.note ?? '')
  const companyRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    companyRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const priceNum = parseFloat(price.replace(',', '.'))
    if (!company.trim() || isNaN(priceNum) || priceNum < 0) return
    onSubmit({ company: company.trim(), price: priceNum, date, link: link.trim(), note: note.trim() })
  }

  const isValid =
    company.trim() !== '' && price !== '' && !isNaN(parseFloat(price.replace(',', '.')))

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {initialData ? t('offerForm.titleEdit') : t('offerForm.titleNew')}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('offerForm.companyLabel')} <span className="text-red-500">*</span>
          </label>
          <input
            ref={companyRef}
            type="text"
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder={t('offerForm.companyPlaceholder')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('offerForm.priceLabel')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
              €
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('offerForm.dateLabel')}
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('offerForm.linkLabel')}
          </label>
          <input
            type="url"
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('offerForm.noteLabel')}
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={t('offerForm.notePlaceholder')}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              {t('offerForm.deleteOffer')}
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
              disabled={!isValid}
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
