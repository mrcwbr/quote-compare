import { ChevronDown, ChevronUp, ExternalLink, MoreHorizontal, Pencil, ScanEye, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Offer, Trade } from '../types';

interface Props {
  trade: Trade;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEditTrade: () => void;
  onAddOffer: () => void;
  onEditOffer: (offer: Offer) => void;
  onSelectOffer: (offerId: string | null) => void;
}

function formatEur(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string, locale: string): string {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat(locale).format(
    new Date(`${dateStr}T00:00:00`)
  );
}


export default function TradeCard({
  trade,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onEditTrade,
  onAddOffer,
  onEditOffer,
  onSelectOffer,
}: Props) {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!previewUrl) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setPreviewUrl(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [previewUrl]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);
  const selected = trade.offers.find((o) => o.id === trade.selectedOfferId);
  const cheapest =
    trade.offers.length > 0
      ? trade.offers.reduce((min, o) => (o.price < min.price ? o : min))
      : null;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-base font-semibold text-gray-900">
            {trade.name}
          </h2>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            {t('trade.offerCount', { count: trade.offers.length })}
          </span>
          {selected && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              {t('trade.selectedBadge', {
                price: formatEur(selected.price, i18n.language),
              })}
            </span>
          )}
        </div>
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
          >
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-20 mt-1 min-w-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              {canMoveUp && (
                <button
                  onClick={() => { onMoveUp(); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ChevronUp size={14} /> {t('trade.moveUpTooltip')}
                </button>
              )}
              {canMoveDown && (
                <button
                  onClick={() => { onMoveDown(); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ChevronDown size={14} /> {t('trade.moveDownTooltip')}
                </button>
              )}
              <button
                onClick={() => { onEditTrade(); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Pencil size={14} /> {t('trade.editTooltip')}
              </button>
            </div>
          )}
        </div>
      </div>

      {trade.offers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs tracking-wide text-gray-500 uppercase">
                <th className="w-10 px-4 py-2.5 text-center">✓</th>
                <th className="px-4 py-2.5 text-left font-medium">
                  {t('table.company')}
                </th>
                <th className="px-4 py-2.5 text-right font-medium">
                  {t('table.price')}
                </th>
                <th className="px-4 py-2.5 text-left font-medium">
                  {t('table.date')}
                </th>
                <th className="px-4 py-2.5 text-left font-medium">
                  {t('table.link')}
                </th>
                <th className="px-4 py-2.5 text-left font-medium">
                  {t('table.note')}
                </th>
                <th className="w-10 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {trade.offers.map((offer) => {
                const isSelected = offer.id === trade.selectedOfferId;
                const isCheapest =
                  cheapest?.id === offer.id && trade.offers.length > 1;
                return (
                  <tr
                    key={offer.id}
                    onClick={() => onSelectOffer(offer.id)}
                    className={`cursor-pointer border-b border-gray-50 transition-colors last:border-0 ${
                      isSelected
                        ? 'bg-green-50 hover:bg-green-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => onSelectOffer(offer.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="size-4 cursor-pointer accent-green-600"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-gray-900">
                      {offer.company}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isCheapest && (
                        <span className="mr-2 rounded-sm bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                          {t('trade.cheapest')}
                        </span>
                      )}
                      <span
                        className={`font-semibold ${isSelected ? 'text-green-700' : 'text-gray-900'}`}
                      >
                        {formatEur(offer.price, i18n.language)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {formatDate(offer.date, i18n.language)}
                    </td>
                    <td className="px-4 py-3">
                      {offer.link ? (
                        offer.link.startsWith('https://1drv.ms') ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); setPreviewUrl(offer.link); }}
                            className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 hover:underline"
                          >
                            <ScanEye size={13} />
                            {t('table.openEmbedded')}
                          </button>
                        ) : (
                          <a
                            href={offer.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <ExternalLink size={13} />
                            {t('table.openLink')}
                          </a>
                        )
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td
                      className="max-w-48 truncate px-4 py-3 text-gray-500"
                      title={offer.note || undefined}
                    >
                      {offer.note || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditOffer(offer);
                        }}
                        title={t('table.editTooltip')}
                        className="rounded-sm p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                      >
                        <Pencil size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 py-8 text-center text-sm text-gray-400">
          {t('trade.noOffers')}
        </div>
      )}

      <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
        <button
          onClick={onAddOffer}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
        >
          <span className="text-base leading-none">+</span>{' '}
          {t('trade.addOffer')}
        </button>
      </div>

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/80"
          onClick={(e) => { if (e.target === e.currentTarget) setPreviewUrl(null); }}
        >
          <div className="flex shrink-0 items-center justify-between bg-gray-900 px-4 py-2">
            <span className="text-sm font-medium text-gray-200">{trade.name}</span>
            <button
              onClick={() => setPreviewUrl(null)}
              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <iframe
            src={previewUrl}
            className="min-h-0 flex-1 w-full border-0"
            allow="fullscreen"
            title="Document preview"
          />
        </div>
      )}
    </div>
  );
}
