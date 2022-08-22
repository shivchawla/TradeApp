import React from 'react'
import {View, StyleSheet} from 'react-native';

import { useTheme, useDimensions, useTypography, StyledText } from '../../theme';

import { FormMeta } from './meta';

const LabelValue = ({label, value}) => {
	const {theme, styles} = useStyles();

	return (
		<View style={styles.labelValue}>
			<StyledText style={styles.label}>{label}</StyledText>
			<StyledText style={styles.value}>{value}</StyledText>
		</View>
	)
}


export const OnboardSummary = ({type, data}) => {
	
	console.log("Summary Component");
	const {theme, styles} = useStyles();

	const meta = FormMeta?.[type]?.meta ?? {};

	const nestedKeys = type == 'employment' ? ['employerAddress'] : [];
	const typeData = data?.[type] ?? {};

	return (
		<View style={styles.summary}>
			<StyledText style={styles.summaryTitle}>{FormMeta?.[type]?.title}</StyledText>
			{Object.keys(meta).map(key => {
				if (nestedKeys.includes(key)) {
					Object.keys(meta[key]).map(key2 => {
						return <LabelValue key={key+'-'+key2} label={meta[key][key2].title} value={typeData[key][key2]} />
					})
				} else {
					return <LabelValue key={key} label={meta[key].title} value={typeData[key]} />
				}
			})} 
		</View>
	)
}


const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();

	const styles = StyleSheet.create({
		summary: {
			borderColor: theme.grey7,
			borderWidth: 1,
			padding: WP(3),
			paddingTop: WP(5),
			paddingBottom: WP(5),
			marginTop: HP(5),
		},
		summaryTitle: {
			fontSize: WP(4.5),
			color: theme.grey7,
			marginTop: WP(-8),
			backgroundColor: theme.background,
			alignSelf: 'flex-start',
			paddingLeft: WP(2),
			paddingRight: WP(2),
		},
		labelValue: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginTop: WP(3)
		},
		label: {
			fontSize: WP(4),
			color: theme.grey4
		},
		value: {
			fontSize: WP(4.5),
			color: theme.grey
		}

	})

	return {theme, styles};
}