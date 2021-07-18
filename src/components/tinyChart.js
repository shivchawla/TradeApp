import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {LineChart} from 'react-native-svg-charts';

const TinyChart = ({prices}) => {
	return (
		<View>
			<LineChart
				style={style.lineChart}
				data={prices}
				container={{top: 20, bottom: 20}}
				svg={{stroke: prices[prices.length - 1] > 0 ? 'green' : 'red'}}
			/>
		</View>
		)
}

const styles = StyleSheet.create({
	lineChart: {
		height: 100,
		width: 100
	}
});

export default TinyChart;