const { mapKeys, mapValues } = require("lodash");
const trade_mapping = {
  i: "id",
  S: "symbol",
  x: "exchange",
  p: "price",
  s: "size",
  t: "timestamp",
  c: "conditions",
  z: "tape",
};

const quote_mapping = {
  S: "symbol",
  bx: "bidExchange",
  bp: "bidPrice",
  bs: "bidSize",
  ax: "askExchange",
  ap: "askPrice",
  as: "askSize",
  t: "timestamp",
  c: "condition",
  z: "tape",
};

const bar_mapping = {
  S: "symbol",
  o: "openPrice",
  h: "highPrice",
  l: "lowPrice",
  c: "closePrice",
  v: "volume",
  t: "timestamp",
};

const snapshot_mapping = {
  latestTrade: "latestTrade",
  latestQuote: "latestQuote",
  minuteBar: "minuteBar",
  dailyBar: "dailyBar",
  prevDailyBar: "prevDailyBar",
};

function aliasObjectKey(data, mapping) {
  return mapKeys(data, (value, key) => {
    return mapping.hasOwnProperty(key) ? mapping[key] : key;
  });
}

function AlpacaQuoteV2(data) {
  return aliasObjectKey(data, quote_mapping);
}

function AlpacaTradeV2(data) {
  return aliasObjectKey(data, trade_mapping);
}

function AlpacaBarV2(data) {
  return aliasObjectKey(data, bar_mapping);
}

function convertSnapshotData(key, data) {
  switch (key) {
    case "latestTrade":
      return AlpacaTradeV2(data);
    case "latestQuote":
      return AlpacaQuoteV2(data);
    case "minuteBar":
    case "dailyBar":
    case "prevDailyBar":
      return AlpacaBarV2(data);
    default:
      return data;
  }
}

export const processBars = ({bars = []}) => bars.map(bar => AlpacaBarV2(bar));

export const processSnapshot = (data) => {
  let snapshot = aliasObjectKey(data, snapshot_mapping);

  return mapValues(snapshot, (value, key) => {
    return convertSnapshotData(key, value);
  });
}

