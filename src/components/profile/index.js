import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useTradingAccountData, useBrokerageAccountData } from '../../helper';
import { AccountIcon, FullViewModal, SimpleButton, HorizontalField, IconTextButton } from '../common';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme'; 
import { formatValue} from '../../utils';

const bgImageDark = require("../../assets/images/profile-bg.png");
const bgImageLight = require("../../assets/images/profile-bg.png");

const ProfileSideBarTop = ({handleExit}) => {
	const {theme, styles} = useStyles();
	const {WP} = useDimensions();
	const {tradingAccount: account} = useTradingAccountData();
	const navigation = useNavigation();

	const accountNumber = account?.account_number;
	const cash = account?.cash ?? 0;
	const investedValue = (account?.long_market_value ?? 0 ) + Math.abs(account?.short_market_value ?? 0 );
	const buyingPower = account?.buying_power ?? 0;

	const goTo = (route) => {
		handleExit();
		navigation.navigate(route);
	}

	return (
		<View style={[styles.sidebarContentContainer, styles.topSidebarContainer]}>
			<HorizontalField 
				label="Account" 
				value={accountNumber} 
				containerStyle={styles.horizontalFieldContainer}
			/>
			<HorizontalField 
				label="Cash" 
				value={`$${formatValue(cash)}`} 
				isNumber={true}
				containerStyle={styles.horizontalFieldContainer}
			/>
			<HorizontalField 
				label="Invested" 
				value={`$${formatValue(investedValue)}`}
				isNumber={true} 
				containerStyle={styles.horizontalFieldContainer}
			/>
			<HorizontalField 
				label="Buying Power" 
				value={`$${formatValue(buyingPower)}`}
				isNumber={true} 
				containerStyle={styles.horizontalFieldContainer}
			/>
			<View style={styles.actionButtonContainer}>
				<SimpleButton 
					title="DEPOSIT" 
					buttonStyle={styles.actionButton} 
					buttonTextStyle={styles.actionButtonText}
					onClick={() => goTo('CreateDeposit')}
				/>
				<SimpleButton 
					title="WITHDRAW" 
					buttonStyle={styles.actionButton} 
					buttonTextStyle={styles.actionButtonText}
					onClick={() => goTo('CreateWithdraw')}
				/>
			</View>
		</View>
	)
}

const ProfileSideBarBottomContent = ({children}) => {
	const {theme, styles} = useStyles();
	return (
		<View style={[styles.sidebarContentContainer, styles.bottomSidebarMiniContainer]}>
			{children}			
		</View>
	)
}

const ProfileSideBarBottom = ({handleExit}) => {
	const {theme, styles} = useStyles();
	const navigation = useNavigation();

	const goTo = (route) => {
		handleExit();
		navigation.navigate(route);
	}

	return (
		<View style={styles.bottomSidebarContainer}>
			<ProfileSideBarBottomContent >
				<IconTextButton 
					iconName="pie-chart" 
					title="Account Details" 
					containerStyle={styles.iconButtonContainer}
					textStyle={styles.iconButtonText}
					onPress={() => goTo('Account')}
				/>
			</ProfileSideBarBottomContent>

			<ProfileSideBarBottomContent >
				<IconTextButton 
					iconName="logo-usd" 
					title="Transaction History" 
					subTitle="Pending, Filled, Transfers & More"
					containerStyle={styles.iconButtonContainer}
					textStyle={styles.iconButtonText}
					subTitleStyle={styles.iconButtonSubTitle}
					onPress={() => goTo('History')}
				/>
			</ProfileSideBarBottomContent>

			<ProfileSideBarBottomContent >
				<IconTextButton 
					iconName="settings" 
					title="Settings" 
					subTitle="Adjust theme, notifications & more"
					containerStyle={styles.iconButtonContainer}
					textStyle={styles.iconButtonText}
					subTitleStyle={styles.iconButtonSubTitle}
					onPress={() => goTo('Settings')}
				/>
			</ProfileSideBarBottomContent>


			<ProfileSideBarBottomContent >
				<IconTextButton 
					iconName="help-circle-outline" 
					title="Support" 
					subTitle="Browse FAQs or contact us"
					containerStyle={styles.iconButtonContainer}
					textStyle={styles.iconButtonText}
					subTitleStyle={styles.iconButtonSubTitle}
					onPress={() => goTo()}
				/>
			</ProfileSideBarBottomContent>

			<ProfileSideBarBottomContent >
				<IconTextButton 
					iconName="exit-outline" 
					title="Sign Out" 
					containerStyle={styles.iconButtonContainer}
					textStyle={styles.iconButtonText}
					onPress={() => goTo()}
				/>
			</ProfileSideBarBottomContent>
			
		</View>
	)
}

const ProfileSideBar = ({handleExit}) => {
	const {theme, styles} = useStyles();
	const {WP, HP} = useDimensions();
	const {brokerageAccount} = useBrokerageAccountData();

	return (
		<View style={styles.sidebarContainer}>
			<ImageBackground source={bgImageDark} resizeMode="cover" style={styles.image}>
				
				<View style={styles.signoutButtonContainer}>
					<StyledText style={styles.name}>{`Hello, ${brokerageAccount?.identity?.given_name ?? ""}`} </StyledText>
					{/*<SimpleButton 
						title="Sign out" 
						onClick={() => {}} 
						buttonStyle={styles.signoutButton} 
						buttonTextStyle={styles.signoutButtonText}
					/>*/}
				</View>
				<View style={styles.sidebarInternalContainer}>
					<ProfileSideBarTop {...{handleExit}}/>
					<ProfileSideBarBottom {...{handleExit}}/>
				</View>
			</ImageBackground>
		</View>
	)		
}

export const ProfileSidebarWithIcon = React.memo(() => {
	const [isVisible, setVisible] = useState(false); 
	const {styles, theme} = useStyles();
	const {HP} = useDimensions();

	console.log("Rendering ProfileSideBar");
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
        		hasHeader={false}
        		modalContentStyle={styles.modalContent}
    		>
				<ProfileSideBar handleExit={() => setVisible(false)}/>
			</FullViewModal>
		</>
	)
})


const useStyles = () => {
	const {theme} = useTheme();
	const {HP, WP} = useDimensions();

	const styles = StyleSheet.create({
		modalContent: {
			backgroundColor: theme.background,
			width: '85%',
		},
		sidebarContainer: {
			flex: 1,
			width: '100%',
		},
		image: {
		    flex: 1,
		    width: '100%',
		    alignItems: 'center'
	  	},
	  	name: {
	  		color: theme.background, 
	  		fontSize: WP(6)
	  	},
	  	sidebarInternalContainer: {
	  		width: '90%',
	  	},
	  	sidebarContentContainer: {
	  		backgroundColor: theme.background,
	  		width: '100%',
	  		borderRadius: 10,
	  		borderWidth: 1,
	  		borderColor: theme.grey9,
	  	},
	  	topSidebarContainer: {
	  		marginTop: WP(5),
	  		height: HP(40),
	  	},
	  	bottomSidebarContainer: {
	  		marginTop: HP(2),
	  	},
	  	bottomSidebarMiniContainer: {
	  		marginTop: HP(2),
	  		height: HP(8),
	  		justifyContent: 'center'
	  	},
	  	signoutButtonContainer: {
	  		flexDirection: 'column',
	  		alignItems: 'flex-start',
	  		width: '100%',
	  		marginLeft: WP(10),
	  		marginTop: HP(2)
	  	},
	  	signoutButton: {
	  		marginTop: HP(1),
	  		marginBottom:HP(1),
	  		marginRight: WP(5),
	  		backgroundColor: theme.grey9,
	  		borderRadius: 10,
	  		height: 30,
	  		width: '22%',
	  		justifyContent: 'center',
	  	},
	  	signoutButtonText: {
	  		fontSize: WP(3.5),
	  		fontWeight: '400'	
	  	},
	  	horizontalFieldContainer: {
	  		justifyContent: 'space-between', 
	  		margin: WP(4)
	  	},
	  	actionButton: {
	  		width: '45%',
	  		height: 30,
	  		borderRadius: 10,
	  	},
	  	actionButtonText: {
	  		fontSize: WP(3.5),
	  		fontWeight: '400' 
	  	},
	  	actionButtonContainer: {
	  		flexDirection: 'row', 
	  		justifyContent: 'space-between', 
	  		marginTop: WP(5),
	  		marginLeft: WP(4),
	  		marginRight: WP(4)
	  	},
	  	iconButtonContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			marginLeft: WP(5)
			// backgroundColor:theme.grey9
	  	},
	  	iconButtonText: {
	  		marginLeft: WP(5)
	  	},
	  	iconButtonSubTitle: {
	  		marginLeft: WP(5),
	  		fontSize: WP(3.5),
	  		color: theme.grey5
	  	}


	});

	return {styles, theme};

}
