const de = {
  app: {
    title: 'Haussanierung',
    subtitle: 'Angebotsvergleich',
  },
  header: {
    shareLink: 'Link teilen',
    linkCopied: 'Link kopiert',
    exportJson: 'JSON',
    addTrade: 'Gewerk',
  },
  emptyState: {
    title: 'Noch keine Gewerke angelegt',
    description:
      'Klicke auf „Gewerk" um z. B. Sanitär, Elektrik oder Malerarbeiten anzulegen.',
  },
  trade: {
    offerCount_one: '{{count}} Angebot',
    offerCount_other: '{{count}} Angebote',
    selectedBadge: '{{price}} ausgewählt',
    editTooltip: 'Gewerk bearbeiten',
    moveUpTooltip: 'Nach oben',
    moveDownTooltip: 'Nach unten',
    cheapest: 'günstigst',
    noOffers: 'Noch keine Angebote hinterlegt.',
    addOffer: 'Angebot hinzufügen',
  },
  table: {
    company: 'Firma',
    price: 'Preis',
    date: 'Datum',
    link: 'Link',
    note: 'Notiz',
    openLink: 'Öffnen',
    openEmbedded: 'Vorschau',
    editTooltip: 'Angebot bearbeiten',
  },
  tradeForm: {
    titleEdit: 'Gewerk bearbeiten',
    titleNew: 'Neues Gewerk',
    nameLabel: 'Bezeichnung',
    namePlaceholder: 'z. B. Sanitär, Elektrik, Malerarbeiten',
    deleteTrade: 'Gewerk löschen',
  },
  offerForm: {
    titleEdit: 'Angebot bearbeiten',
    titleNew: 'Neues Angebot',
    companyLabel: 'Firma',
    companyPlaceholder: 'Firmenname',
    priceLabel: 'Preis (€)',
    dateLabel: 'Datum',
    linkLabel: 'Link zum Angebot',
    linkHint: 'OneDrive-Links (1drv.ms) werden als eingebettete Vorschau angezeigt.',
    noteLabel: 'Notiz',
    notePlaceholder: 'Beliebige Notizen zum Angebot…',
    deleteOffer: 'Angebot löschen',
  },
  common: {
    cancel: 'Abbrechen',
    save: 'Speichern',
  },
  summary: {
    selectedOffers: 'Ausgewählte Angebote ({{selected}}/{{total}})',
    noOfferChosen: 'kein Angebot gewählt',
    grandTotal: 'Gesamtsumme',
    missingSelection_one: '{{count}} Gewerk ohne Auswahl',
    missingSelection_other: '{{count}} Gewerke ohne Auswahl',
  },
} as const;

export default de;
