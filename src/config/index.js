export const apiUrl = 'https://broker-api.sandbox.alpaca.markets';
export const apiKey="CK6VCAV223KKYEEPM2IY";
export const apiSecret="BxizAIrVC5Q9hLwsgmninuL5pzCBhafofX7ZchXy";

export const dataUrl = 'https://data.sandbox.alpaca.markets';
export const wsUrl = 'wss://stream.data.sandbox.alpaca.markets/v2/iex';
export const newsApiUrl = 'https://seekingalpha.com/api/v3/symbols'; 
export const newsUrl = 'https://seekingalpha.com'; 

export const initialStocks = ['AAPL', 'TSLA', 'MSFT', 'GOOG', 'FB', 'QQQ', 'SPY'];
export const defaultStocks = ['AAPL', 'TSLA', 'MSFT', 'GOOG', 'QQQ', 'FB'];

export const COMPLETE_ORDER_STATUS = ['filled', 'partially_filled', 'done_for_day'];
export const OPEN_ORDER_STATUS = ['new', 'accepted', 'replaced', 'pending_cancel', 'pending_replace', 'partially_filled', 'done_for_day'];

export const AVAILABLE_TO_CANCEL_ORDER_STATUS = ['new', 'pending_new', 'replaced', 'accepted', 'partially_filled', 'done_for_day'];

export const CANCEL_ORDER_STATUS = ['canceled', 'expired'];

export const accountParams = {
  "contact": {
    "email_address": "shiv.chawla@yandex.com",
    "phone_number": "555-666-7788",
    "street_address": ["20 N San Mateo Dr"],
    "city": "San Mateo",
    "state": "CA",
    "postal_code": "94401",
    "country": "USA"
  },
  "identity": {
    "given_name": "John",
    "family_name": "Doe",
    "date_of_birth": "1990-01-01",
    "tax_id": "666-55-4321",
    "tax_id_type": "USA_SSN",
    "country_of_citizenship": "USA",
    "country_of_birth": "USA",
    "country_of_tax_residence": "USA",
    "funding_source": ["employment_income"]
  },
  "disclosures": {
    "is_control_person": false,
    "is_affiliated_exchange_or_finra": false,
    "is_politically_exposed": false,
    "immediate_family_exposed": false
  },
  "agreements": [
    {
      "agreement": "margin_agreement",
      "signed_at": "2020-09-11T18:09:33Z",
      "ip_address": "185.13.21.99"
    },
    {
      "agreement": "account_agreement",
      "signed_at": "2020-09-11T18:13:44Z",
      "ip_address": "185.13.21.99"
    },
    {
      "agreement": "customer_agreement",
      "signed_at": "2020-09-11T18:13:44Z",
      "ip_address": "185.13.21.99"
    }
  ],
  "documents": [
    {
      "document_type": "cip_result",
      "content": "VGhlcmUgYXJlIG5vIHdpbGQgYWxwYWNhcy4=",
      "mime_type": "application/pdf"
    },
    {
      "document_type": "identity_verification",
      "document_sub_type": "passport",
      "content": "QWxwYWNhcyBjYW5ub3QgbGl2ZSBhbG9uZS4=",
      "mime_type": "image/jpeg"
    }
  ],
  "trusted_contact": {
    "given_name": "Jane",
    "family_name": "Doe",
    "email_address": "jane.doe@example.com"
  }
};

export const POSITION_SUMMARY_FIELDS = {
  // 'side': 'Direction',
  'qty': 'Quantity',
  'unrealized_pl': 'PnL',
};

export const POSITION_FIELDS = {
  
  'avg_entry_price': 'Avg. Price',
  'market_value': 'Current Market Value',
  'cost_basis': 'Total Cost',
  'unrealized_intraday_pl': "Today's Profit/Loss",
};

export const MARKET_DATA_FIELDS = {
  'openPrice': "Open",
  'highPrice': "High",
  'lowPrice': "Low",
  'closePrice': "Prev. Close",
  "volume": "Today's Volume",
  "yHigh" : "52W High",
  "yLow" : "52W Low",
  "yReturn": "52W Return",
  'ytdReturn': "YTD Return",
}

export const ORDER_MORE_FIELDS = {
  'time_in_force': 'TIF', 
  'submitted_at': 'Submitted',
  'canceled_at': 'Canceled',
  'filled_at': 'Filled',
  'expired_at': 'Expired'
}

export const ACCOUNT_SUMMARY_FIELDS = {
  "regt_buying_power": "Reg. Buying Power",
  "daytrading_buying_power": "Day Buying Power",
  "cash": "Cash",
  "portfolio_value": "Portfolio Value",
  "initial_margin": "Initial Margin",
  "maintenance_margin": "Maintenance Margin",
}


export const BANK_CURRENCIES = [
  {key:'USD', title:'US Dollar'}, 
  {key: 'GTQ', title: 'Guatemalan Quetzal'}
];
export const SUPPORTED_BANKS = [{key:'bi', title:'Banco Industrial'}, 
  {key: 'azteca', title: 'Banco Azteca Guatemala'},
  {key: 'bac', title: 'BAC Credomatic'},
  {key: 'bantrab', title: 'Bantrab Bank'},
  {key: 'banrural', title: 'Banco de Desarrollo Rural'},
  {key: 'gtcontinental', title: 'Banco G&T Continental'},
  {key: 'bam', title: 'BAM: Banco Agromercantil de Guatemala'},
  {key: 'ficohsa', title: 'Ficohsa Bank'}
];
  
export const BANK_ACCOUNT_TYPES = [
  {key:"saving", title: "Savings Account"},
  {key:"checking", title: "Checkings Account"}
];

