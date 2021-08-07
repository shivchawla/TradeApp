import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, TextInput, Modal} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/stack';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'
import ConfirmButton from '../../components/confirmButton';
import ShowJson from '../../components/showJson';
import { usePlaceOrder, useSymbolActivity } from '../../helper';
import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';

import TickerDisplay from '../../components/tickerDisplay';

const Picker = ({items, selectedValue, onSelect}) => {
	const [show, setShow] = useState(false);
	const styles = useStyles();
	const theme = useTheme();

	return (
		<>{
			!!selectedValue &&
		<View style={styles.pickerContainer}>
			<TouchableOpacity style={styles.pickerViewContainer} onPress={() => setShow(!show)}>
				<StyledText style={styles.selectedValue}>{selectedValue.title}</StyledText> 
				{show ? <Ionicons name="chevron-up" color={theme.grey3} size={WP(5)} />
				 : <Ionicons name="chevron-down" color={theme.grey3} size={WP(5)} />
				}
			</TouchableOpacity>

			{show && 
				<View style={styles.pickerOptionsContainer}>
					{
						items.map((item, index) => {
							if (item.key != selectedValue.key) {
								return (
									<TouchableOpacity key={item.key} onPress={() => {onSelect(item); setShow(false)}}> 
										<StyledText style={styles.pickerItem}>{item.title}</StyledText> 	
									</TouchableOpacity>
								)
							}
						})
					}
					
				</View>
			}
		</View>
	}
	</>

	)
}

const BottomPicker = ({items, selectedValue, onSelect}) => {
	const [show, setShow] = useState(false);
	const styles = useStyles();
	const theme = useTheme();

	return (
		<>
		{!!selectedValue &&
			<View style={styles.pickerContainer}>
				<TouchableOpacity style={styles.pickerViewContainer} onPress={() => setShow(!show)}>
					<StyledText style={styles.selectedValue}>{selectedValue.title}</StyledText> 
					{show ? <Ionicons name="chevron-up" color={theme.grey3} size={WP(5)} />
					 : <Ionicons name="chevron-down" color={theme.grey3} size={WP(5)} />
					}
				</TouchableOpacity>
			</View>
		}

		{show &&
		<Modal animationType="slide">
			<View style={styles.bottomPickerOptionsContainer}>
				{
					items.map((item, index) => {
						if (item.key != selectedValue.key) {
							return (
								<TouchableOpacity key={item.key} onPress={() => {onSelect(item); setShow(false)}}> 
									<StyledText style={styles.pickerItem}>{item.title}</StyledText> 	
								</TouchableOpacity>
							)
						}
					})
				}
				
			</View>
		</Modal>
		}
	</>

	)
}

const TextInputWithIcon = ({value, onChange, ...props}) => {
	const styles = useStyles();
	const theme = useTheme();

	const [edit, setEdit] = useState(false);

	return (
		<View style={styles.textInputContainer}>
			
			{!edit ? 
				<>
					<Text style={props.textStyle}>{value}</Text>
					<TouchableOpacity  onPress={() => setEdit(!edit)}>
			      		<Ionicons name="pencil" color={props.iconColor || theme.grey3} size={props.iconsSize || WP(6)} />
		      		</TouchableOpacity>
	      		</>
			:
				<TextInput
					{...props}
			        style={props.textStyle}
			        onChangeText={onChange}
			        value={value}
			        keyboardType="numeric"
			        onBlur={() => setEdit(false)}
			        autoFocus={edit}
		      	/>
			}
      	</View>
	)
}

const HorizontalPickField = ({label, items, selectedValue, onSelect}) => {
	const styles = useStyles();
	return (
		<View style={[styles.horizontalPickField, {height: '50%'}]}>
			<StyledText style={styles.horizontalPickLabel}>{label}</StyledText>
			<BottomPicker {...{items, selectedValue, onSelect}} />
		</View>
	)
}

const HorizontalInputField = ({label, value, onChange, ...props}) => {
	const styles = useStyles();
	return (
		<View style={styles.horizontalPickField}>
			<StyledText style={styles.horizontalPickLabel}>{label}</StyledText>
			<TextInputWithIcon
				{...props}
		        onChange={onChange}
		        {...{value}}
	      	/>
		</View>
	)
}

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

const OrderTypeSelector = ({onSelect}) => {
	const items = [{key: 'market', title: 'MARKET'}, {key: 'limit', title: 'LIMIT'}, {key:'stop', title: 'STOP MARKET'}, {stop: 'stop-limit', title: 'STOP LIMIT'}];
	
	const [selectedValue, setValue] = useState(items[0]);
	return (
		<HorizontalPickField label="Order Type" {...{items, selectedValue, onSelect}} />
	)
}

const TifSelector = ({onSelect}) => {
	const items = [{key: 'day', title: 'DAY'}, {key: 'gtc', title: 'GTC'}];
	
	const [selectedValue, setValue] = useState(items[0]);
	return (
		<HorizontalPickField label="Time in Force" {...{items, selectedValue, onSelect}} />
	)
}

const NotionalSelector = ({onSelect}) => {
	const items = [{key: 'notional', title: 'USD'}, {key:'shares', title:'Shares'}];
	const [selectedValue, setValue] = useState(items[0]);
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

	const [fullView, setFullView] = useState(false)
	
	const [isError, mutate] = usePlaceOrder();
	const {addActivity} = useSymbolActivity(symbol);
	
	const sendOrder = ({symbol, action}) => {
		mutate({symbol, side: action.toLowerCase(), qty: 1, type: 'limit', limit_price: 100}, {
			onSuccess: (response, input) => {
				addActivity(symbol, response); 
				navigation.navigate('OrderStatus', {goBack: () => navigation.navigate('StockDetail', {symbol}), order: response});
			},
			onError: (err, input) => console.log(err)
		});
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
		return <ConfirmButton {...{title}} onClick={() => sendOrder({symbol, action, ...props})} buttonStyle={[styles.tradeButton, action == "BUY" ? styles.buyButton : styles.sellButton]}/>
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
						<NotionalSelector onSelect={(v) => setIsNotional(v.key == 'notional')} />
						<HorizontalInputField label="Quantity" value={quantity} onChange={(v) => setQuantity(v)} textStyle={styles.quantityFullView}/>
						<OrderTypeSelector onSelect={(v) => setOrderType(v.key)} />
						{orderType == "limit" && 
							<HorizontalInputField label="Limit Price" value={limitPrice} onChange={(v) => setLimitPrice(v)} />
						}
						{orderType == "stop" && 
							<HorizontalInputField label="Stop Price" value={stopPrice} onChange={(v) => setStopPrice(v)} />
						}
						{orderType == "stop-limit" && 
							<>
							<HorizontalInputField label="Limit Price" value={limitPrice} onChange={(v) => setLimitPrice(v)} />
							<HorizontalInputField label="Stop Price" value={stopPrice} onChange={(v) => setStopPrice(v)} />
							</>
							
						}
						<TifSelector onSelect={(v) => setTif(v.key)} />
						
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
		textInputContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center'
		},
		pickerContainer: {
			// height: HP(20)
		},
		pickerViewContainer: {
			flexDirection:'row',
			justifyContent: 'center',
			alignItems: 'center'
		},
		selectedValue: {
			fontSize: WP(6),
			marginRight: WP(2)
		},
		pickerOptionsContainer: {
			// position: 'absolute'
		},
		bottomPickerOptionsContainer: {
			flex: 0.25,
			height: HP(25)
		},
		pickerItem: {
			fontSize: WP(6),
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
		horizontalPickField: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			paddingLeft: WP(3),
			paddingRight: WP(3),
			marginBottom: WP(5),
			width: WP(100)
		},
		horizontalPickLabel: {
			fontSize:  WP(4.5),
			color: theme.text	
		}
		
	});

	return styles;
}

export default PlaceOrder; 