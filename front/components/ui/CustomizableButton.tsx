import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps,
} from 'react-native';

interface Props extends TouchableOpacityProps {
    children: React.ReactNode;
    styles?: ViewStyle;
    textStyle?: TextStyle;
}

const CustomizableButton: React.FC<Props> = ({ styles, children, onPress, textStyle, ...rest }) => {
    return (
        <TouchableOpacity
            style={[defaultStyles.button, styles]}
            onPress={onPress}
            activeOpacity={0.8}
            {...rest}
        >
            <Text style={[defaultStyles.text, textStyle]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};

const defaultStyles = StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#78DFFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: '#ECEDEE',
    },
});

export default CustomizableButton;
