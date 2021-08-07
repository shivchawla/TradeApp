import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, TextInput} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'
import ConfirmButton from '../../components/confirmButton';
import ShowJson from '../../components/showJson';
import { usePlaceOrder, useSymbolActivity } from '../../helper';
import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';
// import {Picker} from '@react-native-picker/picker';

import TickerDisplay from '../../components/tickerDisplay';

import Ionicons from 'react-native-vector-icons/Ionicons';

const Picker = ({items, selectedValue, onSelect}) => {
	const [show, setShow] = useState(false);
	const styles = useStyles();
	const theme = useTheme();

	return (
		<View style={styles.pickerContainer}>
			<TouchableOpacity style={styles.pickerViewContainer} onPress={() => setShow(!show)}>
				<StyledText style={styles.selectedValue}>{selectedValue.title}</StyledText> 
				{show ? <Ionicons name="chevron-up" color={theme.grey3} size={WP(5)} />
				 : <Ionicons name="chevron-down" color={theme.grey3} size={WP(5)} />
				}
			</TouchableOpacity>

			{show && 
				<View styles={styles.pickerOptionsContainer}>
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

	)
}

const TextInputWithIcon = ({quantity, onChange, ...props}) => {
	const styles = useStyles();
	const theme = useTheme();

	const [edit, setEdit] = useState(false);

	return (
		<View style={styles.textInputContainer}>
			
			{!edit ? 
				<>
					<Text style={styles.quantity}>{quantity}</Text>
					<TouchableOpacity  onPress={() => setEdit(!edit)}>
			      		<Ionicons name="pencil" color={theme.grey3} size={WP(6)} />
		      		</TouchableOpacity>
	      		</>
			:
				<TextInput
					{...props}
			        style={styles.quantity}
			        onChangeText={onChange}
			        value={quantity}
			        keyboardType="numeric"
			        onBlur={() => setEdit(false)}
			        autoFocus={edit}
		      	/>
			}
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
				<Picker {...{items}} 
					onSelect={onSelect}
					selectedValue={selectedValue}
				/>

				<TextInputWithIcon
			        onChange={(v) => onChangeQuantity(v)}
			        {...{quantity}}
		      	/>
			</View>
		)
	}


//Preview should be added here
const PlaceOrder = (props) => {

	const {symbol, action: propAction} = props.route.params;
	const [action, setAction] = useState(propAction);
	const [isNotional, setIsNotional] = useState(true);
	const [quantity, setQuantity] = useState(100);
	
	const {navigation} = props;
	const [isError, mutate] = usePlaceOrder();
	const {addActivity} = useSymbolActivity(symbol);
	const styles = useStyles();

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

	const InstructionText = ({action, symbol, isNotional}) => {
		const theme = useTheme();
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

	
	const title = (action || "").toUpperCase() + " " + symbol;
	
	return (
		<>
		{!!action && 
			<AppView {...{title}} headerRight={<HeaderRight {...{action}}/>} footer={<Footer {...{title, symbol, action}}/>} appContainerStyle={styles.appContainer}>
				<TickerDisplay {...{symbol}} style={styles.tickerDisplayContainer} priceStyle={styles.priceStyle} priceChangeStyle={styles.priceChangeStyle}/>
				<InstructionText {...{symbol, action, isNotional}} />
				<QuantitySelector {...{isNotional, quantity}} 
					onChangeQuantity={(qty) => setQuantity(qty)} 
					onChangeType={(v) => setIsNotional(v == 'notional')}
				/>
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
			justifyContent: ' center',
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
			position: 'absolute'
		},
		pickerItem: {
			fontSize: WP(6),
		},
		quantity: {
			color: theme.grey3,
			fontSize: WP(15),
			marginLeft: WP(3),
			marginRight: WP(1)
		} 
		
	});

	return styles;
}

export default PlaceOrder; 