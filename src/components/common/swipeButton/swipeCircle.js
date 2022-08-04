import React, { ReactNode } from 'react';
import { GestureResponderHandlers, Animated, StyleSheet } from 'react-native';
import {useTheme, WP, HP} from '../../../theme';

const SwipeButtonCircle = ({ icon, opacity, panHandlers, translateX, height, borderRadius, ...props }) => {
    
    const {theme, styles} = useStyles();

    return (
        <Animated.View
            {...panHandlers}
            style={[
                styles.iconContainer,
                props.iconContainerStyle,
                {
                    opacity,
                    width: height,
                    height,
                    borderRadius: height/2,
                    transform: [{ translateX }],
                },
            ]}
        >
            <Animated.View
                style={[
                    styles.innerIconContainer,
                    {
                        width: height,
                        height,
                        borderRadius,
                    },
                    { opacity },
                ]}
            >
                {icon}
            </Animated.View>
        </Animated.View>
    );
};

export default SwipeButtonCircle;

const useStyles = () => {

    const {theme} = useTheme();

    const styles = StyleSheet.create({
        iconContainer: {
            position: 'absolute',
            backgroundColor: theme.success,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth:0,
            borderColor: theme.success,
            left: -2,
        },
        innerIconContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    return {theme, styles}
}
