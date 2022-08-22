import React, {useState} from 'react';
import {View, StyleSheet, PanResponder} from 'react-native';
import {LineChart as SVGLineChart, Path} from 'react-native-svg-charts';
import {Line} from 'react-native-svg';

import * as Theme  from '../../theme';
const { useTheme, WP, HP, StyledText } = Theme;

export const LineChart = ({data, size, hasTooltip = false, base = null, baseline= false, ...props}) => {
	const {theme, styles} = useStyles();
	
	const [locationX, setX] = useState(null);
	const [trigger, setTrigger] = useState(false);	

	const getColor = (values = []) => {
		const filteredValues = values.filter(item => item);// Remove the NULL
		const color = filteredValues.slice(-1).pop() > (base || filteredValues[0]) ? theme.green : theme.red;
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
            key={ 'moving-axis' }
            y1={ '0%' }
            y2={ '100%' }
            x1={ width ? x(Math.floor(locationX*data.length/width)) : x(0)}
            x2={ width ? x(Math.floor(locationX*data.length/width)) : x(0)}
            stroke={ 'grey' }
            strokeDasharray={ [ 4, 8 ] }
            strokeWidth={ 2 }
        />
    )

    const HorizontalLine = ({ y, height }) => {
    	var minValue = Math.min(base, Math.min(...data.filter(item => item)));
		var maxValue = Math.max(base, Math.max(...data.filter(item => item)));
    	var first = (base || data[0]);
    	var firstPct = 100 - (first - minValue)*100/(maxValue - minValue);
    	return (
	        <Line
	            key={ 'zero-x-axis' }
	            x1={ '0%' }
	            x2={ '100%' }
	            y1={ `${firstPct}%`}
	            y2={ `${firstPct}%`}
	            stroke={ theme.grey8 }
	            strokeDasharray={ [ 4, 8 ] }
	            strokeWidth={ 1 }
	        />
	    )
    }


  	const PriceText = ({x, y, width}) => {
  		var value = '--';
  		try{
  			value = width ? data[Math.min(data.length - 1, Math.floor(locationX*data.length/width))].toFixed(2) : '--';
  		} catch(err){
  			setTrigger(false);
  		}
  		const changeValue = data?.[0] ? '(' + ((value/data[0] - 1)*100).toFixed(2)+'%)'  : '--'
  		const color = value != '--' ? value >= (base || data[0]) ? theme.green : theme.red : theme.text;
  		return (
  			<View style={styles.priceTextContainer}>
  				<StyledText isNumber={true} style={[styles.priceText, {color}]}>{value}</StyledText>
  				<StyledText isNumber={true} style={[styles.priceText, {marginLeft: WP(1), color}]}>{changeValue}</StyledText>
			</View>
		)
  	}

	  const Shadow = ({ line, color }) => (
		<Path
			key={'shadow'}
			d={line}
			fill={'none'}
			strokeWidth={2}
			stroke={color}
		/>
	)
  	
 	const panResponder = React.useRef(
	    PanResponder.create({
	      // Ask to be the responder:
	      onStartShouldSetPanResponder: (evt, gestureState) => {
	      	return true;
	      },
	      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
	      	return true;
	      },
	        
	      onMoveShouldSetPanResponder: (evt, gestureState) => {
	      	return true;
	      },
	      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
	      	return true;
	      },

	      onPanResponderGrant: (evt, gestureState) => {
	        // The gesture has started. Show visual feedback so the user knows
	        // what is happening!
	        // gestureState.d{x,y} will be set to zero now
	        console.log("onPanResponderGrant");
	        setTrigger(true); 
	      },
	      onPanResponderMove: (evt, gestureState) => {
	        // The most recent move distance is gestureState.move{X,Y}
	        // The accumulated gesture distance since becoming responder is
	        // gestureState.d{x,y}

	        setX(evt.nativeEvent.locationX);
	      },
	      onPanResponderTerminationRequest: (evt, gestureState) =>
	        true,
	      onPanResponderRelease: (evt, gestureState) => {
	        // The user has released all touches while this view is the
	        // responder. This typically means a gesture has succeeded
	        setTimeout(() => setTrigger(false), 5000)
	      },
	      onPanResponderTerminate: (evt, gestureState) => {
	        // Another component has become the responder, so this gesture
	        // should be cancelled
	        setTimeout(() => setTrigger(false), 5000)
	      },
	      onShouldBlockNativeResponder: (evt, gestureState) => {
	        // Returns whether this component should block native components from becoming the JS
	        // responder. Returns true by default. Is currently only supported on android.
	        return true;
	      }
	    })
  	).current;

  	// console.log("locationX: ", locationX);

	return (
		<View style={[styles.chartContainer, props.chartContainerStyle]} {...panResponder.panHandlers}>
			<SVGLineChart
	            style={[getSize(size), props.chartStyle]}
	            data={ data }
	            svg={{ stroke: getColor(data), strokeWidth: 10, strokeOpacity: 0.05}}
	            contentInset={ { bottom: 0, top: 30 } }
	        >
	        {baseline && <HorizontalLine />}
	        {hasTooltip && trigger && <VerticalLine />}
	        {hasTooltip && trigger && <PriceText />}
			<Shadow color={getColor(data)}/>
	        </SVGLineChart>
        </View>
	);
}

const useStyles = () => {
	const {theme, HP, WP, Typography} = useTheme();


	const styles = StyleSheet.create({
		chartContainer: {
			width: '90%',
			alignSelf: 'center'
		},
		chartStyle: {
			paddingTop: HP(5)
		},
		tinyChart: {
			height: HP(6) + 30, width: '20%', 
		},
		mediumChart:{
			height: HP(20) + 30, width: WP(50)
		},
		bigChart: {
			height: HP(30) + 30, width: '100%',

		},
		priceTextContainer: {
			// position: 'absolute',
			// top: HP(-4),
			// left: WP(20),
			flexDirection: 'row',
		},
		priceText: {
			fontSize: WP(5)
		}
	});

	return {styles, theme};
}
