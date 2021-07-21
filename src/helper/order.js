import React, {useState, useEffect} from 'react';
import { useQuery, useMutation} from 'react-query';
import { placeOrder, getOrders } from  './api'; 

//Write a order key validation function
const validateOrder = (params) => {
  return true
}

export function usePlaceOrder() {
  const {isError, mutate} = useMutation(orderParams => {
    const updatedParams = {type:"market", time_in_force:"day", ...orderParams};
    if (validateOrder(updatedParams)) {
      return placeOrder(updatedParams);
    }

    throw new Error("Invalid Order Parameters");
  });

  return [isError, mutate];
}


export function useOrders({symbol, status}) {
  console.log(`Symbol: ${symbol ? symbol : 'No Symbol provided (ALL)'}`);
  console.log(`Status: ${status ? status: 'No Status provided (ALL)'}`);
  const query = {...symbol && {symbols: [symbol]}, ...status && {status}};
  const queryKey = 'getOrders' + (symbol || '') + (status || 'open');

  const {isError, error, data} = useQuery(queryKey, () => getOrders(query));
  
  return [isError, data];
}