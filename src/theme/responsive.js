import { useWindowDimensions, PixelRatio, Dimensions } from 'react-native';

export const useDimensions = () => {
    const screenWidth = useWindowDimensions().width;
    const screenHeight = useWindowDimensions().height;

    const widthPercentageToDP = widthPercent => {    
        // Convert string input to decimal number
        const elemWidth = parseFloat(widthPercent);
        return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
    };

    const heightPercentageToDP = heightPercent => {
        // Convert string input to decimal number
        const elemHeight = parseFloat(heightPercent);
        return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
    };

    return {
        WP: widthPercentageToDP,
        HP: heightPercentageToDP,
        deviceWidth: screenWidth,
        deviceheight: screenHeight,
    };  
}

