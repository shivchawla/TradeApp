import React from 'react';

import { getDepositsInDb, getWithdrawsInDb, 
	addDepositInDb, addWithdrawInDb } from './firebase'

import { useLoading } from './extra';
import { useAuth } from './user'

export const useFunds = () => {
	
	const { currentUser, userAccount } = useAuth();
	const { isLoading, loadingFunc } = useLoading();

	const getFundingTransactions = async({start, end, type}) => {
		return await Promise.all([
			type != 'withdraw' ? await getDepositsInDb(currentUser?.email, {start, end}) : [],
			type != 'deposit' ? await getWithdrawsInDb(currentUser?.email, {start, end}) : []
		]).then(([deposits, withdraws]) => {
			return [
				...deposits.map(item => { return {...item, type: "DEPOSIT"}}),
				...withdraws.map(item => { return {...item, type: "WITHDRAW"}})
			];
		});		
	}

	const getDeposits = async() => await loadingFunc(
		async() => {
			const email = currentUser?.email;
			return await getDeposits(email);
		}	
	)

	const getWithdraws = async() => await loadingFunc(
		async() => {
			const email = currentUser?.email;
			return await getWithdraws(email);
		} 
	)

	const addDeposit = async(deposit) => await loadingFunc(
		async() => {

			if (!currentUser ) {
				throw Error("User doesn't exist");
			}

			if (!userAccount) {
				throw Error("User Account doesn't exist");
			}

			const email = currentUser?.email;
			const account = userAccount?.account?.id;
			return await addDepositInDb(email, {...deposit, account});
		}
	)

	const addWithdraw = async(withdraw) => await loadingFunc(
		async() => {
			if (!currentUser ) {
				throw Error("User doesn't exist");
			}

			if (!userAccount) {
				throw Error("User Account doesn't exist");
			}

			const email = currentUser?.email;
			const account = userAccount?.account?.id;
			return await addWithdrawInDb(email, {...withdraw, account});
		}
	)

	return { isLoading, 
		getDeposits, getWithdraws, 
		getFundingTransactions, addDeposit, 
		addWithdraw };

} 
