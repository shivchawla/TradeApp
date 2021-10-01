import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { AppView, ConfirmButton, AlertBox,
	HorizontalPickField, HorizontalInputField,} from '../../components/common';

import { TickerDisplay } from '../../components/market';

import { QuantitySelector, TifSelector, 
	NotionalSelector, OrderTypeSelector } from '../../components/order'
	
import { usePlaceOrder, useSymbolActivity, isMarketOpen } from '../../helper';
import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';

//Preview should be added here
const PlaceOrder = (props) => {
	const {theme, styles} = useStyles();
	const navigation = useNavigation();
	
	const {symbol, action: propAction, fractionable = true} = props.route.params;
	const [action, setAction] = useState(propAction || "BUY");
	const [isNotional, setIsNotional] = useState(fractionable)
	const [quantity, setQuantity] = useState(isNotional && fractionable ? 100 : 1);
	const [orderType, setOrderType] = useState('market');
	const [tif, setTif] = useState('day');
	const [limitPrice, setLimitPrice] = useState(null);
	const [stopPrice, setStopPrice] = useState(null);

	const [isLoading, setLoading] = useState(false);

	const [fullView, setFullView] = useState(false)

	const [showAlert, setAlert] = useState(false);
	
	const {isError, placeOrder} = usePlaceOrder();
	const {addActivity} = useSymbolActivity(symbol);

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
		setLoading(true);

		placeOrder(processOrderParams(), {
			onSuccess: (response, input) => {
				addActivity(symbol, response); 
				navigation.navigate('OrderStatus', {goBack: () => navigation.navigate('StockDetail', {symbol}), order: response});
			},
			onError: (err, input) => {
				if (err.response.status == 403) {
					navigation.navigate('OrderStatus', {goBack: () => navigation.navigate('PlaceOrder', {symbol}), message: "Insufficient Funds! Order Can't be placed!!"});
				} else {
					navigation.navigate('OrderStatus', {goBack: () => navigation.navigate('PlaceOrder', {symbol}), message: "Internal Error!"});
				}
			}
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

	const Footer = ({title, afterTitle, ...props}) => {
		const onConfirmOrder = async() => {
			if (await isMarketOpen()) {
				return sendOrder();
			} else {
				console.log("Will Show Alert Now");
				setAlert(true);
			}
		}

		return (
			<ConfirmButton 
				swipe={true} 
				{...{title, afterTitle}}
				buttonContainerStyle={{position: 'absolute', bottom: 10, alignSelf: 'center'}} 
				onSwipeSuccess={onConfirmOrder} 
				color={action == "BUY" ? theme.green : theme.red}
			/>
		)
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
			setIsNotional(fractionable);
			setQuantity(fractionable ? 100 : 1);
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
	
	const screenTitle = (action || "").toUpperCase() + " " + symbol;
	
	const title = "Swipe to " + screenTitle;
	const afterTitle = "Placing order to " + screenTitle;
	
	return (
		<>
		{!!action && 
			<AppView isLoading={isLoading} title={screenTitle} headerRight={<HeaderRight {...{action}}/>}  appContainerStyle={styles.appContainer} scrollViewStyle={{flexGrow: 1}}>
				<TickerDisplay {...{symbol}} style={styles.tickerDisplayContainer} priceStyle={styles.priceStyle} priceChangeStyle={styles.priceChangeStyle}/>
				{!fullView ? 
					<>
						<InstructionText />
						<QuantitySelector {...{isNotional, quantity}}
							notionalAllowed={fractionable} 
							onChangeQuantity={(qty) => setQuantity(qty)} 
							onChangeType={(v) => setIsNotional(v == 'notional')}
						/>
					</>

					:

					<View style={styles.orderOptionsContainer}>
						{orderType == "market" && fractionable 
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
				}

				<SwitchView />
				<Footer {...{title, afterTitle}}/>
				<AlertBox title="MESSAGE" message="After market hour message" onCancel={() => setAlert(false)} onConfirm={() => {setAlert(false); sendOrder()}} show={showAlert}/> 
			
			</AppView>
		}
		</>
	)

}

const useStyles = () => {
	const {theme} = useTheme();

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

	return {theme, styles};
}

export default PlaceOrder; 