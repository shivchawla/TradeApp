import React, {useState} from 'react';
import {useColorScheme} from 'react-native';

export { WP, HP } from './responsive';
export { StyledText, PaddedView } from './styled';
export { Typography } from './typography';

export const DarkTheme = {
        primary: '#FF6624',
        white: '#ffffff',
        text: '#d9d9d9',
        fldDesc: "#999999",
        border: "#E5E5E5",

        light:'#d9d9d9', //one below lightgrey
        lightgrey:'#cccccc',
        grey: '#a6a6a6',
        grey2: '#9a9a9a',
        grey3: '#8d8d8d',
        grey4: '#808080',
        grey5: '#747474',
        darkgrey: "#797D7F", //same as grey5
        grey6: '#676767',
        grey7: '#5a5a5a',
        verydarkgrey:'#5a5a5a',
        grey8: '#4d4d4d',
        grey9: '#414141',
        grey10: '#343434',
     
        error: "#E7221B",
        success: '#57ff57',
        verified: "#72BB53",
        dark: '#000',
        gryBack: "#CDCDCD",
        
        inActiveTab: "#FEC0A5",
        background: '#121212' , //'#0b0b0b',
        tabBackground: '#0e0e0e',
        tabTint: '#ffea00',
        black:'#1d2127',
        blackFontColor:'#20292f',
        green:'#57ff57',
        red:'#ff5757',
        backArrow: '#ffea00',
        positionLabel: '#797D7F',
        positionValue: '#d9d9d9',

        greyP1: '#d9d9d9',
        greyP2:'#cccccc',
        greyP3:'#c0c0c0'
}

export const DefaultTheme = {
        primary: '#FF6624',
        light: '#ffffff',
        fldDesc: "#999999",
        border: "#E5E5E5",
        grey: '#F6F6F6',
        error: "#E7221B",
        verified: "#72BB53",
        dark: '#000',
        gryBack: "#CDCDCD",
        darkgrey: "#797D7F",
        inActiveTab: "#FEC0A5",

        black:'#1d2127',
        blackFontColor:'#20292f',
        green:'#48b300',
        red:'red',
}


const ThemeContext = React.createContext(null);
	
export const ThemeProvider = ({children}) => {
	
	const scheme = useColorScheme();

	return(
		<ThemeContext.Provider value={scheme == 'dark' ? DarkTheme : DefaultTheme}>
		{children}
		</ThemeContext.Provider>
	)
};

export const useTheme = () => React.useContext(ThemeContext);

export const getPnLColor = (value) => {        
        const theme = useTheme();
        return value > 0 ? theme.green : theme.red;
}