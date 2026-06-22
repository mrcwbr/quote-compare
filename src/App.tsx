import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Trade, Offer, ModalState } from './types'
import TradeCard from './components/TradeCard'
import Modal from './components/Modal'
import TradeForm from './components/TradeForm'
import OfferForm from './components/OfferForm'
import Summary from './components/Summary'
import LanguageSwitcher from './components/LanguageSwitcher'

const STORAGE_KEY = 'haus-sanierung-v2'

function generateId(): string {
  return crypto.randomUUID()
}

function encodeState(trades: Trade[]): string {
  const bytes = new TextEncoder().encode(JSON.stringify(trades))
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function decodeState(encoded: string): Trade[] {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return JSON.parse(new TextDecoder().decode(bytes)) as Trade[]
}

function loadInitialState(): Trade[] {
  const hash = location.hash.slice(1)
  if (hash) {
    try {
      return decodeState(hash)
    } catch {
      /* fall through */
    }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Trade[]) : []
  } catch {
    return []
  }
}

function downloadJson(trades: Trade[]) {
  const blob = new Blob([JSON.stringify(trades, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'haussanierung-angebote.json'
  a.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const { t } = useTranslation()
  const [trades, setTrades] = useState<Trade[]>(loadInitialState)
  const [modal, setModal] = useState<ModalState | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades))
    if (trades.length > 0) {
      history.replaceState(null, '', '#' + encodeState(trades))
    } else {
      history.replaceState(null, '', location.pathname + location.search)
    }
  }, [trades])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard not available */
    }
  }

  function addTrade(name: string) {
    setTrades(prev => [
      ...prev,
      { id: generateId(), name, offers: [], selectedOfferId: null },
    ])
    setModal(null)
  }

  function updateTrade(id: string, name: string) {
    setTrades(prev => prev.map(t => (t.id === id ? { ...t, name } : t)))
    setModal(null)
  }

  function deleteTrade(id: string) {
    setTrades(prev => prev.filter(t => t.id !== id))
  }

  function addOffer(tradeId: string, data: Omit<Offer, 'id'>) {
    setTrades(prev =>
      prev.map(trade => {
        if (trade.id !== tradeId) return trade
        const newOffer: Offer = { ...data, id: generateId() }
        return {
          ...trade,
          offers: [...trade.offers, newOffer],
          selectedOfferId: trade.selectedOfferId ?? newOffer.id,
        }
      }),
    )
    setModal(null)
  }

  function updateOffer(tradeId: string, offer: Offer) {
    setTrades(prev =>
      prev.map(trade => {
        if (trade.id !== tradeId) return trade
        return { ...trade, offers: trade.offers.map(o => (o.id === offer.id ? offer : o)) }
      }),
    )
    setModal(null)
  }

  function deleteOffer(tradeId: string, offerId: string) {
    setTrades(prev =>
      prev.map(trade => {
        if (trade.id !== tradeId) return trade
        const offers = trade.offers.filter(o => o.id !== offerId)
        const selectedOfferId =
          trade.selectedOfferId === offerId ? (offers[0]?.id ?? null) : trade.selectedOfferId
        return { ...trade, offers, selectedOfferId }
      }),
    )
  }

  function selectOffer(tradeId: string, offerId: string | null) {
    setTrades(prev =>
      prev.map(trade => (trade.id === tradeId ? { ...trade, selectedOfferId: offerId } : trade)),
    )
  }

  function closeModal() {
    setModal(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="shrink-0">
            <h1 className="text-xl font-bold text-gray-900">{t('app.title')}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{t('app.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <LanguageSwitcher />
            {trades.length > 0 && (
              <>
                <button
                  onClick={copyLink}
                  className={`text-sm font-medium px-3 py-2 rounded-lg border transition-colors flex items-center gap-1.5 ${
                    copied
                      ? 'border-green-300 text-green-700 bg-green-50'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {copied ? (
                    <><CheckIcon /> {t('header.linkCopied')}</>
                  ) : (
                    <><ShareIcon /> {t('header.shareLink')}</>
                  )}
                </button>
                <button
                  onClick={() => downloadJson(trades)}
                  className="text-sm font-medium px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <DownloadIcon /> {t('header.exportJson')}
                </button>
              </>
            )}
            <button
              onClick={() => setModal({ type: 'add-trade' })}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span className="text-lg leading-none">+</span>
              {t('header.addTrade')}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-48">
        {trades.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <div className="text-6xl mb-4 select-none">🏗️</div>
            <p className="text-lg font-medium text-gray-500">{t('emptyState.title')}</p>
            <p className="text-sm mt-1">{t('emptyState.description')}</p>
          </div>
        ) : (
          <div className="space-y-5">
            {trades.map(trade => (
              <TradeCard
                key={trade.id}
                trade={trade}
                onEditTrade={() => setModal({ type: 'edit-trade', trade })}
                onAddOffer={() => setModal({ type: 'add-offer', tradeId: trade.id })}
                onEditOffer={offer => setModal({ type: 'edit-offer', tradeId: trade.id, offer })}
                onSelectOffer={offerId => selectOffer(trade.id, offerId)}
              />
            ))}
          </div>
        )}
      </main>

      {trades.length > 0 && <Summary trades={trades} />}

      {modal !== null && (
        <Modal onClose={closeModal}>
          {modal.type === 'add-trade' && (
            <TradeForm onSubmit={addTrade} onCancel={closeModal} />
          )}
          {modal.type === 'edit-trade' && (
            <TradeForm
              initialName={modal.trade.name}
              onSubmit={name => updateTrade(modal.trade.id, name)}
              onDelete={() => { deleteTrade(modal.trade.id); closeModal() }}
              onCancel={closeModal}
            />
          )}
          {modal.type === 'add-offer' && (
            <OfferForm
              onSubmit={data => addOffer(modal.tradeId, data)}
              onCancel={closeModal}
            />
          )}
          {modal.type === 'edit-offer' && (
            <OfferForm
              initialData={modal.offer}
              onSubmit={data => updateOffer(modal.tradeId, { ...data, id: modal.offer.id })}
              onDelete={() => { deleteOffer(modal.tradeId, modal.offer.id); closeModal() }}
              onCancel={closeModal}
            />
          )}
        </Modal>
      )}
    </div>
  )
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
