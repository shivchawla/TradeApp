import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import {useTheme, useDimensions, useTypography, StyledText} from '../../theme';

export const ShowMoreContainer = ({title, content, summary = null, summaryInline = false, onShowMore, ...props}) => {
	const {theme, styles} = useStyles();

	return (
		<>
		<View style={styles.headerContainer}>
			<View style={styles.contentHeader}>
                <StyledText style={styles.contentTitle}>{title}</StyledText>
                <TouchableOpacity activeOpacity={1.0} onPress={onShowMore}>
                    <StyledText style={styles.showMoreText}>Show More</StyledText>
                </TouchableOpacity>
			</View>
		</View>
		<View style={[styles.contentContainer, props.containerStyle]}>
			<View style={styles.detailContainer}>{content}</View>
		</View>
		</>
	)
}

const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();

	const styles = StyleSheet.create({
		headerContainer: {
			borderTopWidth:2,
			borderColor: theme.grey9,
			marginTop: HP(5),
			width: '100%',
		},
		detailContainer: {
			width: '100%',
			// justifyContent: 'center',
			// alignItems: 'center'
		},
		contentContainer: {
			marginTop: WP(0),
			width: '100%',
			paddingBottom: HP(2),
		},
		contentHeader: {
			marginTop: -11,
			flexDirection: 'row',
			justifyContent: 'space-between'		
		},
		contentTitle: {
			backgroundColor: theme.background,
			paddingRight: WP(2),
			color: theme.grey1,
			fontWeight: '700',
			fontSize: WP(3.5)
		},
        showMoreText: {
            backgroundColor: theme.background,
            paddingLeft: WP(2),
			fontSize: WP(3),
            color: theme.icon
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
