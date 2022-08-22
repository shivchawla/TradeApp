import React, {useState} from 'react';
import {useColorScheme} from 'react-native';

import {getCurrentTheme, setCurrentTheme} from '../helper';

import { useDimensions } from './responsive';
import { useTypography } from './typography';

export const DarkTheme = {
    name: 'dark',

    primary: '#FF6624',
    white: '#ffffff',
    text: '#d9d9d9',
    shadedText: '#747474',
    fldDesc: "#999999",
    border: "#E5E5E5",

    light:'#d9d9d9', 
    grey: '#B6B7B8',//10 list of grey is created by blending light(#d9d9d9) with background (0d1a26)
    grey2: '#A4A6A8',  
    grey3: '#929598',
    grey4: '#818488',
    grey5: '#6F7377',
    darkgrey: "#6F7377",
    grey6: '#5E6267',
    grey7: '#4C5157',
    grey8: '#3A4047',
    grey9: '#292F36',
    grey10: '#171E26',


    error: "#ff5757",
    success: '#00cc99',
    verified: "#72BB53",
    dark: '#000',
    gryBack: "#CDCDCD",

    selectedColor: '#000000',
    
    inActiveTab: "#FEC0A5",
    background: '#16161e' ,
    tabBackground: '#171e26',
    tabTint: '#ffac33',
    selectedBorder: '#ffac33',
    black:'#1d2127',
    blackFontColor:'#20292f',
    green:'#00cc99',
    greenShadow: "#ffffff1A",
    red:'#ff5757',
    redShadow: "#ff575726",
    backArrow: '#ffac33',
    icon: '#ffac33',
    greyIcon: '#6F7377',
    positionLabel: '#797D7F',
    positionValue: '#d9d9d9',

    greyP1: '#d9d9d9',
    greyP2:'#cccccc',
    greyP3:'#c0c0c0'
}

export const LightTheme = {
    name: 'light',

    primary: '#FF6624',
    light: '#ffffff',
    background: '#f4f6fc',
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
	
	const systemScheme = useColorScheme();
    // console.log("systemScheme:", systemScheme);

    // const [theme, setTheme] = useState(systemScheme == 'dark' ? DarkTheme : LightTheme);
    //In v1 of app, keep only dark mode
    const [theme, setTheme] = useState(DarkTheme);

    const {WP, HP} = useDimensions();

    const Typography = useTypography();
    
    React.useEffect(() => {
        (async() => {
            let scheme = await getCurrentTheme();
            if (!scheme) {
                await setCurrentTheme(systemScheme);
                scheme = systemScheme;  
            }

            // setTheme(scheme == 'dark' ? DarkTheme : LightTheme)

            //In v1 of app, keep only dark mode
            setTheme(DarkTheme);

        })()
    }, []);

    const updateTheme = async(scheme) => {
        await setCurrentTheme(scheme);
        setTheme(scheme == 'dark' ? DarkTheme : LightTheme)
    }

    const getPnLColor = (value) => {        
        return value > 0 ? theme.green : theme.red;
    }

	return(
		<ThemeContext.Provider value={{theme, updateTheme, WP, HP, Typography}}>
		{children}
		</ThemeContext.Provider>
	)
};

export const useTheme = () => React.useContext(ThemeContext);

