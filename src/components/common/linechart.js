import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {LineChart as SVGLineChart} from 'react-native-svg-charts';
import { Circle, G, Line, Rect, Text } from 'react-native-svg'
import {useDebounce, useThrottle, useThrottleFn} from 'react-use';


import * as Theme  from '../../theme';
const { useTheme, WP, HP, StyledText } = Theme;

export const LineChart = ({data, size, style, hasTooltip = false}) => {
	const theme = useTheme();
	const [locationX, setX] = useState(null);
	const [trigger, setTrigger] = useState(false);	

	const getColor = (values = []) => {
		const filteredValues = values.filter(item => item);// Remove the NULL
		const color = filteredValues.slice(-1).pop() > filteredValues[0] ? theme.green : theme.red;
		return color;
	}

	const getSize = (size) => {
		const style = size == 'S' ? styles.tinyChart : size == 'M' ? styles.mediumChart : styles.bigChart 
		return style;
	}

	/**
     * Both below functions should preferably be their own React Components
     */

    const VerticalLine = ({ x, width }) => (
        <Line
            key={ 'zero-axis' }
            y1={ '0%' }
            y2={ '100%' }
            x1={ width ? x(Math.floor(locationX*data.length/width)) : x(0)}
            x2={ width ? x(Math.floor(locationX*data.length/width)) : x(0)}
            stroke={ 'grey' }
            strokeDasharray={ [ 4, 8 ] }
            strokeWidth={ 2 }
        />
    )

  	const PriceText = ({x, y, width}) => {
  		const value = width ? data[Math.floor(locationX*data.length/width)] : '--';
  		const changeValue = data?.[0] ? '(' + ((value/data[0] - 1)*100).toFixed(2)+'%)'  : '--'
  		const color = value != '--' ? value >= data[0] ? theme.green : theme.red : theme.text;
  		return (
  			<View style={styles.priceTextContainer}>
  				<StyledText style={[styles.priceText, {color}]}>{value}</StyledText>
  				<StyledText style={[styles.priceText, {marginLeft: WP(1), color}]}>{changeValue}</StyledText>
			</View>
		)
  	}

	return (
		<View style={styles.chartContainer} 
		 	onMoveShouldSetResponder={hasTooltip ? (evt) => {setTrigger(true); return true} : false}
		 	onResponderTerminate={hasTooltip ? (evt) => setTimeout(() => setTrigger(false), 5000) : false}
		 	onResponderRelease={hasTooltip ? (evt) => setTimeout(() => setTrigger(false), 5000) : false}
			onResponderMove={hasTooltip ? (evt) => setX(evt.nativeEvent.locationX) : false}
		>
			<SVGLineChart
	            style={[getSize(size), style]}
	            data={ data }
	            svg={{ stroke: getColor(data) }}
	            contentInset={ { bottom: 0 } }
	           
	        >
	        {hasTooltip && trigger && <VerticalLine />}
	        {hasTooltip && trigger && <PriceText />}
	        </SVGLineChart>
        </View>
	);
}

const styles = StyleSheet.create({
	chartContainer: {
		// alignItems: 'center',
		// justifyContent: 'center',
		width: '90%',
		alignSelf: 'center'
	},
	tinyChart: {
		height: HP(6), width: WP(20), 
	},
	mediumChart:{
		height: HP(20), width: WP(50)
	},
	bigChart: {
		height: HP(30), width: '100%',

	},
	priceTextContainer: {
		position: 'absolute',
		top: HP(-4),
		flexDirection: 'row'
	},
	priceText: {
		fontSize: WP(5)
	}
});
