import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {LineChart as SVGLineChart} from 'react-native-svg-charts';

import * as Theme  from '../../theme';
const { useTheme, WP, HP } = Theme;

export const LineChart = ({values, size, style}) => {
	const theme = useTheme();

	// console.log("LineChart");
	// console.log(values);

	const getColor = (values = []) => {
		const filteredValues = values.filter(item => item);// Remove the NULL
		const color = filteredValues.slice(-1).pop() > filteredValues[0] ? theme.green : theme.red;
		return color;
	}

	const getSize = (size) => {
		const style = size == 'S' ? styles.tinyChart : size == 'M' ? styles.mediumChart : styles.bigChart 
		return style;
	}

	return (
		<View style={styles.chartContainer} >
			<SVGLineChart
	            style={[getSize(size), style]}
	            data={ values }
	            svg={{ stroke: getColor(values) }}
	            contentInset={ { bottom: 0 } }
	        />
        </View>
	);
}

const styles = StyleSheet.create({
	chartContainer: {
		alignItems: 'center',
	},
	tinyChart: {
		height: HP(6), width: WP(20), 
		// borderWidth:1, borderColor: 'white'	
	},
	mediumChart:{
		height: HP(20), width: WP(50)
	},
	bigChart: {
		height: HP(30), width: WP(80)
	}
});
