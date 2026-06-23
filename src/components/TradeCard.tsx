import { useTranslation } from 'react-i18next';
import { Offer, Trade } from '../types';

interface Props {
  trade: Trade;
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

function PencilIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

export default function TradeCard({
  trade,
  onEditTrade,
  onAddOffer,
  onEditOffer,
  onSelectOffer,
}: Props) {
  const { t, i18n } = useTranslation();
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
              {t('trade.selectedBadge', { price: formatEur(selected.price, i18n.language) })}
            </span>
          )}
        </div>
        <button
          onClick={onEditTrade}
          title={t('trade.editTooltip')}
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
        >
          <PencilIcon />
        </button>
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
                        <a
                          href={offer.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {t('table.openLink')}
                        </a>
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
                        <PencilIcon />
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
    </div>
  );
}
