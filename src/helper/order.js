import React, {useState, useEffect} from 'react';
import { useQuery, useMutation} from 'react-query';
import { placeOrder } from  './api'; 

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
