import React, {useState, useEffect} from 'react';
import {useQuery} from 'react-query';

import { getStockPosition } from  './api'; 

export function useStockPositionData(symbol) {
  console.log("useStockPositionData: ", symbol);
  const {isError, data} = useQuery(['stockPosition', symbol], () => getStockPosition(symbol));
  return [isError, data];
}