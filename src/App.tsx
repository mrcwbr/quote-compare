import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import Modal from './components/Modal';
import OfferForm from './components/OfferForm';
import Summary from './components/Summary';
import TradeCard from './components/TradeCard';
import TradeForm from './components/TradeForm';
import { ModalState, Offer, Trade } from './types';
import { generateId } from './utils.ts';

const STORAGE_KEY = 'quote-compare-v2';

function encodeState(trades: Trade[]): string {
  const bytes = new TextEncoder().encode(JSON.stringify(trades));
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function decodeState(encoded: string): Trade[] {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return JSON.parse(new TextDecoder().decode(bytes)) as Trade[];
}

function loadInitialState(): Trade[] {
  const hash = location.hash.slice(1);
  if (hash) {
    try {
      return decodeState(hash);
    } catch {
      /* fall through */
    }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Trade[]) : [];
  } catch {
    return [];
  }
}

function downloadJson(trades: Trade[]) {
  const blob = new Blob([JSON.stringify(trades, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quote-compare-export.json';
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const { t } = useTranslation();
  const [trades, setTrades] = useState<Trade[]>(loadInitialState);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
    if (trades.length > 0) {
      history.replaceState(null, '', `#${encodeState(trades)}`);
    } else {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }, [trades]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  }

  function addTrade(name: string) {
    setTrades((prev) => [
      ...prev,
      { id: generateId(), name, offers: [], selectedOfferId: null },
    ]);
    setModal(null);
  }

  function updateTrade(id: string, name: string) {
    setTrades((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
    setModal(null);
  }

  function deleteTrade(id: string) {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  }

  function addOffer(tradeId: string, data: Omit<Offer, 'id'>) {
    setTrades((prev) =>
      prev.map((trade) => {
        if (trade.id !== tradeId) return trade;
        const newOffer: Offer = { ...data, id: generateId() };
        return {
          ...trade,
          offers: [...trade.offers, newOffer],
          selectedOfferId: trade.selectedOfferId ?? newOffer.id,
        };
      })
    );
    setModal(null);
  }

  function updateOffer(tradeId: string, offer: Offer) {
    setTrades((prev) =>
      prev.map((trade) => {
        if (trade.id !== tradeId) return trade;
        return {
          ...trade,
          offers: trade.offers.map((o) => (o.id === offer.id ? offer : o)),
        };
      })
    );
    setModal(null);
  }

  function deleteOffer(tradeId: string, offerId: string) {
    setTrades((prev) =>
      prev.map((trade) => {
        if (trade.id !== tradeId) return trade;
        const offers = trade.offers.filter((o) => o.id !== offerId);
        const selectedOfferId =
          trade.selectedOfferId === offerId
            ? (offers[0]?.id ?? null)
            : trade.selectedOfferId;
        return { ...trade, offers, selectedOfferId };
      })
    );
  }

  function selectOffer(tradeId: string, offerId: string | null) {
    setTrades((prev) =>
      prev.map((trade) =>
        trade.id === tradeId ? { ...trade, selectedOfferId: offerId } : trade
      )
    );
  }

  function closeModal() {
    setModal(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 p-4 sm:px-6">
          <div className="shrink-0">
            <h1 className="text-xl font-bold text-gray-900">
              {t('app.title')}
            </h1>
            <p className="mt-0.5 text-xs text-gray-400">{t('app.subtitle')}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <LanguageSwitcher />
            {trades.length > 0 && (
              <>
                <button
                  onClick={copyLink}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    copied
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckIcon /> {t('header.linkCopied')}
                    </>
                  ) : (
                    <>
                      <ShareIcon /> {t('header.shareLink')}
                    </>
                  )}
                </button>
                <button
                  onClick={() => downloadJson(trades)}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <DownloadIcon /> {t('header.exportJson')}
                </button>
              </>
            )}
            <button
              onClick={() => setModal({ type: 'add-trade' })}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
            >
              <span className="text-lg leading-none">+</span>
              {t('header.addTrade')}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-48 sm:px-6">
        {trades.length === 0 ? (
          <div className="py-24 text-center text-gray-400">
            <div className="mb-4 text-6xl select-none">🏗️</div>
            <p className="text-lg font-medium text-gray-500">
              {t('emptyState.title')}
            </p>
            <p className="mt-1 text-sm">{t('emptyState.description')}</p>
          </div>
        ) : (
          <div className="space-y-5">
            {trades.map((trade) => (
              <TradeCard
                key={trade.id}
                trade={trade}
                onEditTrade={() => setModal({ type: 'edit-trade', trade })}
                onAddOffer={() =>
                  setModal({ type: 'add-offer', tradeId: trade.id })
                }
                onEditOffer={(offer) =>
                  setModal({ type: 'edit-offer', tradeId: trade.id, offer })
                }
                onSelectOffer={(offerId) => selectOffer(trade.id, offerId)}
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
              onSubmit={(name) => updateTrade(modal.trade.id, name)}
              onDelete={() => {
                deleteTrade(modal.trade.id);
                closeModal();
              }}
              onCancel={closeModal}
            />
          )}
          {modal.type === 'add-offer' && (
            <OfferForm
              onSubmit={(data) => addOffer(modal.tradeId, data)}
              onCancel={closeModal}
            />
          )}
          {modal.type === 'edit-offer' && (
            <OfferForm
              initialData={modal.offer}
              onSubmit={(data) =>
                updateOffer(modal.tradeId, { ...data, id: modal.offer.id })
              }
              onDelete={() => {
                deleteOffer(modal.tradeId, modal.offer.id);
                closeModal();
              }}
              onCancel={closeModal}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

function ShareIcon() {
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
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function DownloadIcon() {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
