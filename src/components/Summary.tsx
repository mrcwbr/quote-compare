import { useTranslation } from 'react-i18next';
import { Trade } from '../types';

interface Props {
  trades: Trade[];
}

function formatEur(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

export default function Summary({ trades }: Props) {
  const { t } = useTranslation();

  const rows = trades.map((trade) => ({
    trade,
    offer: trade.offers.find((o) => o.id === trade.selectedOfferId) ?? null,
  }));

  const total = rows.reduce((sum, r) => sum + (r.offer?.price ?? 0), 0);
  const selectedCount = rows.filter((r) => r.offer !== null).length;
  const missingCount = trades.length - selectedCount;

  return (
    <div className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex items-start gap-6">
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
              {t('summary.selectedOffers', {
                selected: selectedCount,
                total: trades.length,
              })}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {rows.map(({ trade, offer }) => (
                <div
                  key={trade.id}
                  className="flex items-baseline gap-1.5 text-sm"
                >
                  <span className="text-gray-400">{trade.name}:</span>
                  {offer ? (
                    <>
                      <span className="font-medium text-gray-800">
                        {offer.company}
                      </span>
                      <span className="text-gray-600">
                        {formatEur(offer.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-300 italic">
                      {t('summary.noOfferChosen')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 border-l border-gray-100 pl-6 text-right">
            <p className="mb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">
              {t('summary.grandTotal')}
            </p>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">
              {formatEur(total)}
            </p>
            {missingCount > 0 && (
              <p className="mt-0.5 text-xs text-amber-600">
                {t('summary.missingSelection', { count: missingCount })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
