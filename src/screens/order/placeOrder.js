import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'
import ConfirmButton from '../../components/confirmButton';
import ShowJson from '../../components/showJson';
import { usePlaceOrder, useSymbolActivity } from '../../helper';
import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';

//Preview should be added here
const PlaceOrder = (props) => {

	const {symbol, action: propAction} = props.route.params;
	const [action, setAction] = useState(propAction);
	
	const {navigation} = props;
	const [isError, mutate] = usePlaceOrder();
	const {addActivity} = useSymbolActivity(symbol);
	const styles = useStyles();

	// React.useEffect(() => {
	// 	setAction(propAction);
	// }, [])

	const sendOrder = ({symbol, action}) => {
		mutate({symbol, side: action.toLowerCase(), qty: 1, type: 'limit', limit_price: 100}, {
			onSuccess: (response, input) => {
				addActivity(symbol, response); 
				navigation.navigate('OrderStatus', {goBack: () => navigation.navigate('StockDetail', {symbol}), order: response});
			},
			onError: (err, input) => console.log(err)
		});
	}

	const Footer = ({title, symbol, action}) => {
		const styles = useStyles();
		return <ConfirmButton {...{title}} onClick={() => sendOrder({symbol, action})} buttonStyle={[styles.tradeButton, action == "BUY" ? styles.buyButton : styles.sellButton]}/>
	}

	const HeaderRight = ({action}) => {
		const nAction = action == "BUY" ? "SELL" : "BUY";
		return (
			<TouchableOpacity style={styles.actionSwitchButton} onPress={() => setAction(nAction)}>
				<StyledText style={styles.switchButtonText}>{nAction}</StyledText>
			</TouchableOpacity> 
		)
	}

	const title = (action || "").toUpperCase() + " " + symbol;
	
	return (
		<>
		{!!action && 
			<AppView {...{title}} headerRight={<HeaderRight {...{action}}/>} footer={<Footer {...{title, symbol, action}}/>} >
				
			</AppView>
		}
		</>
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		tradeButton: {
			width: WP(100)
		},
		buyButton: {
			backgroundColor: theme.green
		},
		sellButton: {
			backgroundColor: theme.red
		},
		actionSwitchButton: {
			backgroundColor: theme.grey10,
			padding: WP(3),
			paddingTop: WP(1),
			paddingBottom: WP(1),
			borderRadius: WP(2)
		},
		switchButtonText: {
			fontWeight: Typography.bold
		}
	});

	return styles;
}

export default PlaceOrder; 