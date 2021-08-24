import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import {ShowHideButton} from './';
import {useTheme, StyledText, WP} from '../../theme';

export const Collapsible = ({title, content, show = true, ...props}) => {
	const {theme, styles} = useStyles();
	const [showDetail, setShow] = useState(show);

	return (
		<View style={[styles.outerContentContainer, props.containerStyle]}>
			<View style={styles.contentHeader}>
				<TouchableOpacity onPress={() => setShow(!showDetail)}>
					<StyledText style={styles.contentTitle}>{title}</StyledText>
				</TouchableOpacity>
				<ShowHideButton containerStyle={styles.contentToggleIcon} {...{showDetail}} onToggle={() => setShow(!showDetail)} />
			</View>
			{showDetail && <View style={styles.contentContainer}>{content}</View>}
		</View>
	)
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		outerContentContainer: {
			borderTopWidth:1,
			borderColor: theme.grey9,
			marginTop: WP(5),
			marginBottom: WP(5),
			width: WP(100) 
		},
		contentContainer: {
			marginTop: WP(5),
			paddingLeft: WP(2), 
			paddingRight: WP(2) 
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
			marginTop: WP(-1),
		}
	});

	return {theme, styles};
}
