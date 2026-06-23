const en = {
  app: {
    title: 'House Renovation',
    subtitle: 'Quote Comparison',
  },
  header: {
    shareLink: 'Share link',
    linkCopied: 'Link copied',
    exportJson: 'JSON',
    addTrade: 'Trade',
  },
  emptyState: {
    title: 'No trades added yet',
    description:
      'Click on “Trade” to add e. g. Plumbing, Electrical or Painting.',
  },
  trade: {
    offerCount_one: '{{count}} quote',
    offerCount_other: '{{count}} quotes',
    selectedBadge: '{{price}} selected',
    editTooltip: 'Edit trade',
    moveUpTooltip: 'Move up',
    moveDownTooltip: 'Move down',
    cheapest: 'cheapest',
    noOffers: 'No quotes added yet.',
    addOffer: 'Add quote',
  },
  table: {
    company: 'Company',
    price: 'Price',
    date: 'Date',
    link: 'Link',
    note: 'Note',
    openLink: 'Open ↗',
    editTooltip: 'Edit quote',
  },
  tradeForm: {
    titleEdit: 'Edit trade',
    titleNew: 'New trade',
    nameLabel: 'Name',
    namePlaceholder: 'e. g. Plumbing, Electrical, Painting',
    deleteTrade: 'Delete trade',
  },
  offerForm: {
    titleEdit: 'Edit quote',
    titleNew: 'New quote',
    companyLabel: 'Company',
    companyPlaceholder: 'Company name',
    priceLabel: 'Price (€)',
    dateLabel: 'Date',
    linkLabel: 'Link to quote',
    noteLabel: 'Note',
    notePlaceholder: 'Any notes about the quote…',
    deleteOffer: 'Delete quote',
  },
  common: {
    cancel: 'Cancel',
    save: 'Save',
  },
  summary: {
    selectedOffers: 'Selected quotes ({{selected}}/{{total}})',
    noOfferChosen: 'no quote selected',
    grandTotal: 'Grand total',
    missingSelection_one: '{{count}} trade without selection',
    missingSelection_other: '{{count}} trades without selection',
  },
} as const;

export default en;
