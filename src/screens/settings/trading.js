import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Switch} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { AppView, TinyTextButton } from '../../components/common';
import { SwitchSetting } from '../../components/settings';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme';
import { useTradeConfig } from '../../helper';

const TradeSettings = (props) => {
	const {styles} = useStyles();
	
	const {tradeConfig, getTradeConfig, updateTradeConfig} = useTradeConfig();
	const [hasUpdate, setHasUpdate] = useState(false);

	const [isLoading, setLoading] = useState(false)

	const [newConfig, setNewConfig] = useState(null);

	const navigation = useNavigation();

	React.useEffect(() => {
		setNewConfig(tradeConfig);
	}, [tradeConfig]);

	React.useEffect(() => {
		// console.log("New Config Changed");
		// console.log("New Config");
		// console.log(newConfig);

		// console.log("Original Config");
		// console.log(tradeConfig);

		if (newConfig && tradeConfig) {
			var strN = JSON.stringify(newConfig);
			var strO = JSON.stringify(tradeConfig);
			if (strN != strO) {
				setHasUpdate(true);
			} else {
				setHasUpdate(false);
			}
		}
	}, [newConfig])


	const updateSettings = () => {
		setLoading(true)
		updateTradeConfig(newConfig, {
			onSuccess: (r, i) => navigation.navigate("Settings"),
			onError: (e, i) => console.log(e)
		})
	}

	return (
		<AppView {...{isLoading}} title="Trade Settings" headerRight={hasUpdate && <TinyTextButton onPress={updateSettings} title="UPDATE"/>} >
			{newConfig &&
				<View style={styles.switchSettingContainer}>	
					<SwitchSetting 
						title="Fractional Trading" 
						description="Allow fractional trading in USD"
						value={newConfig.fractional_trading}
						onSwitch={() => setNewConfig({...newConfig, fractional_trading: !newConfig.fractional_trading})}	
					/>
					<SwitchSetting 
						title="Don't Allow Shorting" 
						description="Allow only long position"
						value={newConfig.no_shorting}
						onSwitch={() => setNewConfig({...newConfig, no_shorting: !newConfig.no_shorting})}	
					/>
					<SwitchSetting 
						title="Allow Leverage" 
						description="Trade upto 2x"
						value={newConfig.max_margin_multiplier != "1"}
						onSwitch={() => setNewConfig({...newConfig, max_margin_multiplier: newConfig.max_margin_multiplier != "1" ? "1" : "2"})}	
					/>
					<SwitchSetting 
						title="Trade Emails" 
						description="Send email for trades"
						value={newConfig.trade_confirm_email == "all"}
						onSwitch={() => setNewConfig({...newConfig, trade_confirm_email: newConfig.trade_confirm_email == "all" ? "none" : "all"})}	
					/>

					<SwitchSetting 
						title="Suspend Trading" 
						description="*Suspend the ability to place new orders"
						value={newConfig.suspend_trade}
						showAlert={true}
						onSwitch={() => setNewConfig({...newConfig, suspend_trade: !newConfig.suspend_trade})}	
					/>
				</View>
			}
		</AppView>
	)
}


const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();

	
	const styles = StyleSheet.create({
		switchSettingContainer: {
			marginTop: HP(5)
		}
	});

	return {theme, styles};
}

export default TradeSettings;
