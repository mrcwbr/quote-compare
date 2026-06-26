import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Offer } from '../types';

type OfferData = Omit<Offer, 'id'>;

interface Props {
  initialData?: OfferData;
  onSubmit: (data: OfferData) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export default function OfferForm({
  initialData,
  onSubmit,
  onDelete,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const [company, setCompany] = useState(initialData?.company ?? '');
  const [price, setPrice] = useState(
    initialData?.price != null ? String(initialData.price) : ''
  );
  const [date, setDate] = useState(initialData?.date ?? '');
  const [link, setLink] = useState(initialData?.link ?? '');
  const [note, setNote] = useState(initialData?.note ?? '');
  const companyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    companyRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceNum = parseFloat(price.replace(',', '.'));
    if (!company.trim() || isNaN(priceNum) || priceNum < 0) return;
    onSubmit({
      company: company.trim(),
      price: priceNum,
      date,
      link: link.trim(),
      note: note.trim(),
    });
  }

  const isValid =
    company.trim() !== '' &&
    price !== '' &&
    !isNaN(parseFloat(price.replace(',', '.')));

  return (
    <div className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        {initialData ? t('offerForm.titleEdit') : t('offerForm.titleNew')}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {t('offerForm.companyLabel')}{' '}
            <span className="text-red-500">*</span>
          </label>
          <input
            ref={companyRef}
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={t('offerForm.companyPlaceholder')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {t('offerForm.priceLabel')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-400">
              €
            </span>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {t('offerForm.dateLabel')}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {t('offerForm.linkLabel')}
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">{t('offerForm.linkHint')}</p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {t('offerForm.noteLabel')}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('offerForm.notePlaceholder')}
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
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
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={!isValid}
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
