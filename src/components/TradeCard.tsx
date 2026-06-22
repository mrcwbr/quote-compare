import { useTranslation } from 'react-i18next'
import { Trade, Offer } from '../types'

interface Props {
  trade: Trade
  onEditTrade: () => void
  onAddOffer: () => void
  onEditOffer: (offer: Offer) => void
  onSelectOffer: (offerId: string | null) => void
}

function formatEur(value: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value)
}

function formatDate(dateStr: string, locale: string): string {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat(locale).format(new Date(dateStr + 'T00:00:00'))
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  )
}

export default function TradeCard({
  trade,
  onEditTrade,
  onAddOffer,
  onEditOffer,
  onSelectOffer,
}: Props) {
  const { t, i18n } = useTranslation()
  const selected = trade.offers.find(o => o.id === trade.selectedOfferId)
  const cheapest =
    trade.offers.length > 0
      ? trade.offers.reduce((min, o) => (o.price < min.price ? o : min))
      : null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-base font-semibold text-gray-900">{trade.name}</h2>
          <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
            {t('trade.offerCount', { count: trade.offers.length })}
          </span>
          {selected && (
            <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
              {t('trade.selectedBadge', { price: formatEur(selected.price) })}
            </span>
          )}
        </div>
        <button
          onClick={onEditTrade}
          title={t('trade.editTooltip')}
          className="text-gray-400 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-200 transition-colors"
        >
          <PencilIcon />
        </button>
      </div>

      {trade.offers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                <th className="w-10 px-4 py-2.5 text-center">✓</th>
                <th className="px-4 py-2.5 text-left font-medium">{t('table.company')}</th>
                <th className="px-4 py-2.5 text-right font-medium">{t('table.price')}</th>
                <th className="px-4 py-2.5 text-left font-medium">{t('table.date')}</th>
                <th className="px-4 py-2.5 text-left font-medium">{t('table.link')}</th>
                <th className="px-4 py-2.5 text-left font-medium">{t('table.note')}</th>
                <th className="w-10 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {trade.offers.map(offer => {
                const isSelected = offer.id === trade.selectedOfferId
                const isCheapest = cheapest?.id === offer.id && trade.offers.length > 1
                return (
                  <tr
                    key={offer.id}
                    onClick={() => onSelectOffer(offer.id)}
                    className={`border-b border-gray-50 last:border-0 cursor-pointer transition-colors ${
                      isSelected ? 'bg-green-50 hover:bg-green-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => onSelectOffer(offer.id)}
                        onClick={e => e.stopPropagation()}
                        className="w-4 h-4 cursor-pointer accent-green-600"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {offer.company}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className={`font-semibold ${isSelected ? 'text-green-700' : 'text-gray-900'}`}>
                        {formatEur(offer.price)}
                      </span>
                      {isCheapest && (
                        <span className="ml-1.5 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                          {t('trade.cheapest')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {formatDate(offer.date, i18n.language)}
                    </td>
                    <td className="px-4 py-3">
                      {offer.link ? (
                        <a
                          href={offer.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-blue-600 hover:text-blue-800 hover:underline text-xs"
                        >
                          {t('table.openLink')}
                        </a>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-500 max-w-48 truncate"
                      title={offer.note || undefined}
                    >
                      {offer.note || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          onEditOffer(offer)
                        }}
                        title={t('table.editTooltip')}
                        className="text-gray-400 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100 transition-colors"
                      >
                        <PencilIcon />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 py-8 text-center text-gray-400 text-sm">
          {t('trade.noOffers')}
        </div>
      )}

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <button
          onClick={onAddOffer}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
        >
          <span className="text-base leading-none">+</span> {t('trade.addOffer')}
        </button>
      </div>
    </div>
  )
}
