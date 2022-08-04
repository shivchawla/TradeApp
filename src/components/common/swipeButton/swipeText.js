import React from 'react';
import { View, Text, TextProps, StyleProp, TextStyle, ViewProps, ViewStyle, StyleSheet } from 'react-native';
import { DEFAULT_HEIGHT } from './constants';
import {useTheme, WP, HP} from '../../../theme';


export const SwipeButtonText = ({title, ...props}) => {
    
    const height = props?.height ?? DEFAULT_HEIGHT;
    const {theme, styles} = useStyles();

    return (
        <View
            style={[
                styles.titleContainer,
                { height },
                props.titleContainerStyle,
            ]}>
            <Text
                numberOfLines={1}
                allowFontScaling={false}
                style={[styles.title, props.titleStyle]}
            >
                {title}
            </Text>
        </View>
    );
};


export const AfterSwipeButtonText = ({title, ...props}) => {
    const height = props?.height ?? DEFAULT_HEIGHT;
    const {theme, styles} = useStyles();
    
    return (
        <View
            style={[
                styles.swipeTitleContainer,
                { height },
                props.swipeTitleContainerStyle,
            ]}
        >
            <Text
                numberOfLines={1}
                allowFontScaling={false}
                ellipsizeMode="clip"
                style={[styles.swipeTitle, props.swipeTitleStyle]}
            >
                {title} 
            </Text>
        </View>
    )
}

const useStyles = () => {

    const {theme} = useTheme();

    const styles = StyleSheet.create({
        titleContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            color: theme.text,
            fontSize: WP(5),
            textAlign: 'center',
            marginLeft: WP(10),
        },
        swipeTitleContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        swipeTitle: {
            color: theme.black,
            fontSize: WP(5),
            maxWidth: '100%',
            textAlign: 'center',
            position: 'absolute',
            marginLeft: WP(3),
            left: WP(10)
        }
    });

    return {theme, styles}
}