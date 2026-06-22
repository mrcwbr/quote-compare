export interface Offer {
  id: string
  company: string
  price: number
  date: string
  link: string
  note: string
}

export interface Trade {
  id: string
  name: string
  offers: Offer[]
  selectedOfferId: string | null
}

export type ModalState =
  | { type: 'add-trade' }
  | { type: 'edit-trade'; trade: Trade }
  | { type: 'add-offer'; tradeId: string }
  | { type: 'edit-offer'; tradeId: string; offer: Offer }
