import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, TextInput, Dimensions } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

import { AppView, ConfirmButton, 
	Picker, BottomPicker, HorizontalPickField, 
	HorizontalInputField, TextInputWithIcon} from '../../components/common';
	
import { usePlaceOrder, useSymbolActivity } from '../../helper';
import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';

import TickerDisplay from '../../components/tickerDisplay';

const QuantitySelector = ({quantity, isNotional, onChangeQuantity, onChangeType}) => {
	const styles = useStyles();

	const items = [{key: 'notional', title: 'USD'}, {key:'shares', title:'Shares'}];
	const [selectedValue, setValue] = useState(isNotional ? items[0] : items[1]);

	const onSelect = (v) => {
		setValue(v); 
		onChangeType(v.key);
		onChangeQuantity(v.key == 'notional' ? 100 : 1);
	}

	return (
		<View style={styles.quantitySelectContainer}>
			<Picker {...{items, onSelect, selectedValue}} />

			<TextInputWithIcon
				textStyle={styles.quantity}
		        onChange={(v) => onChangeQuantity(v)}
		        value={quantity}
	      	/>
		</View>
	)
}

const OrderTypeSelector = ({orderType, onSelect}) => {
	const items = [{key: 'market', title: 'MARKET'}, {key: 'limit', title: 'LIMIT'}, {key:'stop', title: 'STOP MARKET'}, {stop: 'stop_limit', title: 'STOP LIMIT'}];
	const selectedValue = items.find(item => item.key == orderType);
	return (
		<HorizontalPickField label="Order Type" {...{items, selectedValue, onSelect}} />
	)
}

const TifSelector = ({tif, onSelect}) => {
	const items = [{key: 'day', title: 'DAY'}, {key: 'gtc', title: 'GTC'}];
	const selectedValue = items.find(item => item.key == tif);
	return (
		<HorizontalPickField label="Time in Force" {...{items, selectedValue, onSelect}} />
	)
}

const NotionalSelector = ({isNotional, onSelect}) => {
	const items = [{key: 'notional', title: 'USD'}, {key:'shares', title:'Shares'}];
	const selectedValue = isNotional ? items[0] : items[1]
	return (
		<HorizontalPickField label="Quantity Type" {...{items, selectedValue, onSelect}} />
	)
}


//Preview should be added here
const PlaceOrder = (props) => {
	const styles = useStyles();
	const theme = useTheme();

	const {symbol, action: propAction} = props.route.params;
	const [action, setAction] = useState(propAction);
	const [isNotional, setIsNotional] = useState(true)
	const [quantity, setQuantity] = useState(isNotional ? 100 : 1);
	const [orderType, setOrderType] = useState('market');
	const [tif, setTif] = useState('day');
	const [limitPrice, setLimitPrice] = useState(null);
	const [stopPrice, setStopPrice] = useState(null);

	const [fullView, setFullView] = useState(false)
	
	const [isError, mutate] = usePlaceOrder();
	const {addActivity} = useSymbolActivity(symbol);

	const navigation = useNavigation();
	
	const processOrderParams = () => {
		var params = {symbol, side: action.toLowerCase(), type: orderType, time_in_force: tif};
		
		//Quantity or Notional
		params = {...params, ...(isNotional ? {notional: quantity} : {qty: quantity})};

		//Limit price
		params = {...params, ...((orderType == 'limit' || orderType == 'stop_limit') && {limit_price: limitPrice})};

		//Stop price
		params = {...params, ...((orderType == 'stop' || orderType == "stop_limit") && {stop_price: stopPrice})};
		
		return params;
	}

	const sendOrder = () => {
		mutate(processOrderParams(), {
			onSuccess: (response, input) => {
				addActivity(symbol, response); 
				navigation.navigate('OrderStatus', {goBack: () => navigation.navigate('StockDetail', {symbol}), order: response});
			},
			onError: (err, input) => console.log(err)
		});
	}

	const updateOrderType = (orderType) => {
		if (orderType == "limit") {
			setIsNotional(false);
			setQuantity(1);
			setLimitPrice();
		}

		setOrderType(orderType);
	} 

	const HeaderRight = () => { 
		const nAction = action == "BUY" ? "SELL" : "BUY";
		return (
			<TouchableOpacity style={styles.actionSwitchButton} onPress={() => setAction(nAction)}>
				<StyledText style={styles.switchButtonText}>{nAction}</StyledText>
			</TouchableOpacity> 
		)
	}

	const Footer = ({title, ...props}) => {
		return <ConfirmButton swipe={true} {...{title}} onClick={sendOrder} buttonStyle={[styles.tradeButton, action == "BUY" ? styles.buyButton : styles.sellButton]}/>
	}

	const InstructionText = () => {
		return (
			<View style={styles.instructionTextContainer}>
				<View style={{flexDirection: 'row'}}> 
					<StyledText style={[styles.instructionText, {marginRight: WP(2)}]}>I would like to</StyledText> 
					<StyledText style={[styles.instructionText,{borderColor: theme.grey, borderBottomWidth: 1}]}>{action.toUpperCase()}</StyledText>
				</View>
				<StyledText style={styles.instructionText}>{symbol}</StyledText>
				<StyledText style={styles.instructionText}>{isNotional ? 'worth' : ''}</StyledText>
			</View>
		)
	}

	const SwitchView = () => {
		
		const text = fullView ? "Switch to quick trade" : "Show more options";

		const switchView = () => {
			setIsNotional(true);
			setQuantity(100);
			setOrderType('market');
			setTif('day');
			setFullView(!fullView);
		}

		return (
			<TouchableOpacity style={styles.switchViewContainer} onPress={switchView}>
				<StyledText style={styles.switchViewText}>{text} ...</StyledText>
			</TouchableOpacity>
		)
	}

	const PlaceOrderBasic = () => {
		const orderType = 'market';
		const title = (action || "").toUpperCase() + " " + symbol;
		return (
			<>
			{!!action && 
				<AppView {...{title}} headerRight={<HeaderRight />} footer={<Footer {...{title}}/>} appContainerStyle={styles.appContainer}>
					<TickerDisplay {...{symbol}} style={styles.tickerDisplayContainer} priceStyle={styles.priceStyle} priceChangeStyle={styles.priceChangeStyle}/>
					<InstructionText />
					<QuantitySelector {...{isNotional, quantity}} 
						onChangeQuantity={(qty) => setQuantity(qty)} 
						onChangeType={(v) => setIsNotional(v == 'notional')}
					/>
					<SwitchView />
				</AppView>
			}
			</>
		);
	}

	const PlaceOrderFull = () => {
		const title = (action || "").toUpperCase() + " " + symbol;
		
		return (
			<>
			{!!action && 
				<AppView {...{title}} headerRight={<HeaderRight {...{action}}/>} footer={<Footer {...{title, symbol, action}}/>} appContainerStyle={styles.appContainer}>
					<TickerDisplay {...{symbol}} style={styles.tickerDisplayContainer} priceStyle={styles.priceStyle} priceChangeStyle={styles.priceChangeStyle}/>
					<View style={styles.orderOptionsContainer}>
						{orderType == "market" 
							? <NotionalSelector {...{isNotional}} onSelect={(v) => setIsNotional(v.key == 'notional')} />
							: <HorizontalPickField label="Quantity Type" selectedValue={{key: 'shares', title: 'Shares'}} />
						}
						<HorizontalInputField label="Quantity" value={quantity} onChange={(v) => setQuantity(v)} textStyle={styles.quantityFullView}/>
						<OrderTypeSelector {...{orderType}} onSelect={(v) => updateOrderType(v.key)} />
						{orderType == "limit" && 
							<HorizontalInputField label="Limit Price" value={limitPrice} onChange={(v) => setLimitPrice(v)} />
						}
						{orderType == "stop" && 
							<HorizontalInputField label="Stop Price" value={stopPrice} onChange={(v) => setStopPrice(v)} />
						}
						{orderType == "stop_limit" && 
							<>
							<HorizontalInputField label="Limit Price" value={limitPrice} onChange={(v) => setLimitPrice(v)} />
							<HorizontalInputField label="Stop Price" value={stopPrice} onChange={(v) => setStopPrice(v)} />
							</>
						}
						<TifSelector {...{tif}} onSelect={(v) => setTif(v.key)} />
						
					</View>	

					<SwitchView />
				</AppView>
			}
			</>
		);
	}



	return (
		<>
		{fullView ? 
			<PlaceOrderFull {...{symbol, action}} /> 
			: 
			<PlaceOrderBasic {...{symbol, action}} />
		}</>
	)

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
		},
		tickerDisplayContainer: {
			flexDirection: 'row', 
			marginTop: HP(5),
			alignItems: 'center',
			justifyContent: 'center'
		},
		priceStyle: {
			fontSize: WP(7)
		},
		priceChangeStyle: {
			fontSize: WP(6),
			alignItems: 'center',
			marginLeft: WP(2)
		},
		instructionTextContainer: {
			marginTop: HP(20),
			alignItems: 'center'
		},
		instructionText: {
			fontSize: WP(6)
		},
		quantitySelectContainer: {
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'row',
			width: WP(100),
			marginTop: HP(5)
		},
		
		quantity: {
			color: theme.grey3,
			fontSize: WP(15),
			marginLeft: WP(3),
			marginRight: WP(1)
		},
		quantityFullView: {
			color: theme.text,
			fontSize: WP(6),
			marginLeft: WP(3),
			marginRight: WP(1)
		},
		switchViewContainer: {
			marginTop: HP(10),
			alignItems: 'center',
		},
		switchViewText : {
			color: theme.grey3,
		},
		orderOptionsContainer: {
			marginTop: WP(20)
		},
	
		bottomPickerTitle: {
			// textAlign: ''
		}
		
	});

	return styles;
}

export default PlaceOrder; 