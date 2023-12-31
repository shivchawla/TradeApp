import React, {useState, useEffect} from 'react';
import { useQuery, useMutation} from 'react-query';
import { placeOrder, getOrders, getOrder, cancelOrder, cancelAllOrders, updateOrder } from  './api'; 

import { COMPLETE_ORDER_STATUS, OPEN_ORDER_STATUS } from '../config'

export const filterTrades = (trades) => {
  return trades.filter(item => COMPLETE_ORDER_STATUS.includes(item.status));  
}

export const filterOpenOrders = (orders) => {
  return orders.filter(item => OPEN_ORDER_STATUS.includes(item.status));  
}

//Write a order key validation function
const validateOrder = (params) => {
  return true
}

//Write a order key validation function
const validateUpdateOrder = (params) => {
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

export function useUpdateOrder() {
  const {isError, mutate} = useMutation(orderParams => {
    const {order_id, ...updatedParams} = orderParams;
    if (validateUpdateOrder(updatedParams)) {
      return updateOrder(order_id, updatedParams);
    }

    throw new Error("Invalid Order Parameters");
  });

  return {isError, updateOrder: (params, callbackParams) => mutate(params, callbackParams)};
}


export function useCancelOrder() {
  const {isError, mutate} = useMutation(orderId => cancelOrder(orderId));
  return {isError, cancelOrder: (orderId, callbackParams) => mutate(orderId, callbackParams)};
}

export function useCancelAllOrders() {
  const {isError, mutate} = useMutation(() => cancelAllOrders());
  return {isError, cancelAllOrders: (callbackParams) => mutate(null, callbackParams)};
}


export function useOrderDetail(orderId, params={}) {
  const {isError, error, data: orderDetail, refetch} = useQuery(['getOrder', orderId], () => getOrder(orderId), params);
  return {isError, orderDetail, getOrderDetail: () => refetch().then(r => r.data)};
}


export function useOrders({symbol, status, after, until, limit = 10}, params = {}) {
  // console.log(`Symbol: ${symbol ? symbol : 'No Symbol provided (ALL)'}`);
  // console.log(`Status: ${status ? status: 'No Status provided (ALL)'}`);
  const query = {...symbol && {symbols: symbol}, ...status && {status}, ...after && {after}, ...until && {until}, ...limit && {limit}};
  // const queryKey = 'getOrders' + (symbol || '') + (status || 'open');

  const {isError, data: orders, refetch} = useQuery(['getOrders', query], () => getOrders(query), params);

  return {isError, orders, getOrders: () => refetch().then(r => r.data)};
}
