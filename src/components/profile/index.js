import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useTradingAccountData, useBrokerageAccountData } from '../../helper';
import { AccountIcon, FullViewModal } from '../common';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme'; 

const ProfileSideBar = (props) => {
	// const navigation = useNavigation();
	// const {theme, styles} = useStyles();
	const {WP, HP} = useDimensions();

	// return null;
	return (<Text>Hola</Text>)
		
}

export const ProfileSidebarWithIcon = React.memo(() => {
	const [isVisible, setVisible] = useState(false); 
	const {styles, theme} = useStyles();
	const {tradingAccount} = useTradingAccountData();

	console.log("Rendering ProfileSideBar");
	// console.log(tradingAccount);

	return (
		<>
			<AccountIcon onPress={() => setVisible(true)}/>
			<FullViewModal 
				opacity={0.7}
				isVisible={isVisible}
				animationIn="slideInLeft" // Has others, we want slide in from the left
        		animationOut="slideOutLeft" // When discarding the drawer
        		swipeDirection="left"
        		onHide={() => setVisible(false)}
        		modalStyle={styles.modal}
        		modalContentStyle={styles.modalContent}
    		>
				<ProfileSideBar />
			</FullViewModal>
		</>
	)
})


const useStyles = () => {
	const {theme} = useTheme();
	const {HP, WP} = useDimensions();

	const styles = StyleSheet.create({
		modal: {
			width: WP(100)
		},
		modalContent: {
			backgroundColor: theme.background,
			width: '85%'
		}

	});

	return {styles, theme};

}
