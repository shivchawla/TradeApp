import React, {useState} from 'react';
import {useColorScheme} from 'react-native';

export { WP, HP } from './responsive';
export { StyledText } from './styled';
export { Typography } from './typography';

export const DarkTheme = {
        primary: '#FF6624',
        white: '#ffffff',
        text: '#ffffff',
        light:'#f2f2f2',
        fldDesc: "#999999",
        border: "#E5E5E5",

        grey: '#F6F6F6',
        error: "#E7221B",
        verified: "#72BB53",
        dark: '#000',
        gryBack: "#CDCDCD",
        darkgrey: "#797D7F",
        inActiveTab: "#FEC0A5",
        background: '#1d2127',
        tabBackground: 'black',
        tabTint: 'yellow',
        black:'#1d2127',
        blackFontColor:'#20292f',
        green:'#48b300',
        red:'red',
        backArrow: 'yellow',
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
