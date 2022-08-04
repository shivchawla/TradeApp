import React, { useState } from 'react';
import { Text, View, Dimensions, Animated, PanResponder, GestureResponderEvent, PanResponderGestureState, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import {DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_BORDER_RADIUS, DEFAULT_COMPLETE_THRESHOLD_PERCENTAGE} from './constants';

import SwipeButtonCircle from './swipeCircle';
import { SwipeButtonText, AfterSwipeButtonText } from './swipeText';
import {useTheme, WP, HP} from '../../../theme';

export const SwipeButton = ({title, swipeTitle, icon, disabled, onSwipeSuccess, onSwipeEnd, onSwipeStart, ...props}) => {

    const height = props?.height ?? DEFAULT_HEIGHT;
    const width = props?.width ?? DEFAULT_WIDTH;
    const completeThresholdPercentage = props?.completeThresholdPercentage ?? DEFAULT_COMPLETE_THRESHOLD_PERCENTAGE;
    const borderRadius = props?.borderRadius ?? DEFAULT_BORDER_RADIUS;

    const [endReached, setEndReached] = useState(false);
    const opacity = disabled ? 0.5 : 1;
    const opacityStyle = { opacity };
    // const [translateX] = useState(new Animated.Value(0));
    const translateX = React.useRef(new Animated.Value(0)).current;

    const scrollDistance = width - (completeThresholdPercentage / 100) - height;
    const completeThreshold = scrollDistance * (completeThresholdPercentage / 100);

    const animateToStart = () => {
        Animated.spring(translateX, { toValue: 0, tension: 10, friction: 5, useNativeDriver: false }).start();
        return setEndReached(false);
    };

    const animateToEnd = () => {
        if (onSwipeSuccess) {
            onSwipeSuccess();
        };

        Animated.spring(translateX, { toValue: scrollDistance, tension: 10, friction: 5, useNativeDriver: false }).start();

        return setEndReached(true);
    };
   
    const onMove = (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (disabled) {
            return false;
        }

        if (gestureState.dx < 0 || gestureState.dx > scrollDistance) {
            return Animated.event([{ dx: translateX }], { useNativeDriver: false })({
                ...gestureState,
                dx: gestureState.dx < 0 ? 0 : scrollDistance,
            });
        }

        return Animated.event([{ dx: translateX }], { useNativeDriver: false })(gestureState);
    };

    const onRelease = () => {

        if (disabled) {
            return;
        }

        // if (endReached) {
        //     setEndReached(false);
        // }

        const isCompleted = translateX._value >= completeThreshold;
        
        if (isCompleted) {
            animateToEnd();
        } else {
            animateToStart();
        }
    };

    const panResponser = () => PanResponder.create({
        onPanResponderGrant: onSwipeStart ? () => onSwipeStart() : () => {},
        onPanResponderEnd: onSwipeEnd ? () => onSwipeEnd() : () => {},
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => false,
        onPanResponderMove: onMove,
        onPanResponderRelease: onRelease,
    });

    
    const widthOverLay = translateX.interpolate({ inputRange: [0, 100], outputRange: [31, 131]});
    
    const {theme, styles} = useStyles();

    return (
        <View style={[
            styles.container,
            opacityStyle,
            props.containerStyle,
            { height, width, borderRadius: height/2},
        ]}
        >
            <SwipeButtonText
                {...props}
                title={title}
                height={height}
            />

            {!disabled  && <Animated.View
                style={[
                    styles.underlayContainer,
                    props.underlayStyle,
                    {
                        width: widthOverLay,
                        height,
                        borderTopLeftRadius: height/2,
                        borderBottomLeftRadius: height/2,
                    },
                ]}

            >
                <AfterSwipeButtonText title={swipeTitle} {...props} />
                 
            </Animated.View>}

            <SwipeButtonCircle
                {...{icon}}
                opacity={opacity}
                panHandlers={panResponser().panHandlers}
                translateX={translateX}
                height={height}
                {...props}
            />
        </View>
    );
};

const useStyles = () => {

    const {theme} = useTheme();
    
    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#152228',
            alignSelf: 'center',
            justifyContent: 'center',
            marginVertical: 10,
            borderColor: theme.success,
            borderWidth:1,
        },
        underlayContainer: {
            position: 'absolute',
            backgroundColor: theme.success,
            borderColor: theme.success,
            borderTopWidth:1,
            borderBottomWidth:1,
        }
    });

    return {theme, styles}
}