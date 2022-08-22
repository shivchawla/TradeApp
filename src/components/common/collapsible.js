import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import {ShowHideButton} from './iconButtons';
import {useTheme, StyledText} from '../../theme';

export const Collapsible = ({title, content, summary = null, summaryInline = false, endButton = null, show = true, enabled=true, ...props}) => {
	const {theme, styles} = useStyles();
	const [showDetail, setShow] = useState(show);

	const ToggleButton = () => enabled && <ShowHideButton iconColor={theme.grey3} containerStyle={styles.contentToggleIcon} {...{showDetail}} onToggle={() => setShow(!showDetail)} />;
	
	return (
		<>
		<View style={styles.headerContainer}>
			<View style={styles.contentHeader}>
				{enabled ? 
				<TouchableOpacity activeOpacity={1} onPress={() => setShow(!showDetail)}>
					<StyledText style={styles.contentTitle}>{title}</StyledText>
				</TouchableOpacity>
				: <StyledText style={styles.contentTitle}>{title}</StyledText>
				}

				{(summaryInline && summary) 
					? 
					<View style={{flexDirection: 'row'}}>
						<View style={styles.summaryContainer}>{summary}</View>
						<ToggleButton />
					</View>
					: 
					<ToggleButton />
				}
			</View>
		</View>
		<View style={[styles.contentContainer, props.containerStyle]}>
			{(summary && !summaryInline) && <View style={styles.summaryContainer}>{summary}</View>}
			{showDetail && <View style={styles.detailContainer}>{content}</View>}
			{showDetail && endButton && <View style={[styles.endButtonContainer, props.buttonContainerStyle]}>{endButton}</View>}
		</View>
		</>
	)
}

const useStyles = () => {
	const {theme, HP, WP, Typography} = useTheme();


	const styles = StyleSheet.create({
		headerContainer: {
			borderTopWidth:1,
			borderColor: theme.grey9,
			marginTop: HP(5),
			width: WP(100),
		},
		detailContainer: {
			width: '100%',
			// justifyContent: 'center',
			// alignItems: 'center'
		},
		contentContainer: {
			marginTop: WP(0),
			width: '100%'
		},
		contentHeader: {
			marginTop: -11,
			flexDirection: 'row',
			justifyContent: 'space-between'		
		},
		contentTitle: {
			backgroundColor: theme.background,
			paddingRight: WP(2),
			color: theme.grey3,
			fontWeight: '700',
			fontSize: WP(3.5)
		},
		contentToggleIcon: {
			backgroundColor: theme.background,
			paddingRight: WP(4),
			paddingLeft: WP(2),
			// paddingTop: WP(2),
			marginTop: WP(-1),
		},
		summaryContainer: {
			alignItems: 'flex-start',
			justifyContent: 'center',
			paddingLeft: WP(3)
		},
		endButtonContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
			marginBottom: HP(5)
		}
	});

	return {theme, styles};
}
