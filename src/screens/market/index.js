import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import SingleStock from '../../components/singleStock';
import ScreenName from '../../components/screenName';

const Market = (props) => {
	const {stocks} = props;
	
	useEffect(() => {
		console.log("In User Effect - Market");
	});

	return (
		<AppView>
{/*			{stocks && stocks.length > 0 &&
				stocks.map((stock, index) => {	
					return <SingleStock stock={...}/>
				})
			}*/}
			<ScreenName name="Market Screen" />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Market;