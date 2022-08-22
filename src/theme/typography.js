import { useDimensions } from './responsive'

export const useTypography = () => {
    const {HP , WP} = useDimensions();
    
    const fontSize = {
        six: WP(6),
        five: WP(5),
        four: WP(4),
        fourPointFive: WP(4.5),
        threePointFive: WP(3.5),
        three: WP(3),
        twoPointFive: WP(2.5),
        two: WP(2)
    }

    const fontWeight = {
        bold: '700',
        semiBold:'600',
        normal: '400'
    }

    const DefaultIconSize = WP(7);

    return {fontSize, fontWeight, DefaultIconSize};
}
