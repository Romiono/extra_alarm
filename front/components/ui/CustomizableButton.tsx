import React from 'react';
import {Pressable, Text, ViewStyle} from "react-native";


interface Props {
    children: React.ReactNode;
    styles?: ViewStyle;
}

const CustomizableButton = ({styles, children}: Props) => {
    return (
        <Pressable style={{
            width: '100%',
            height: 50,
            backgroundColor: '#78DFFF',
            borderRadius: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...styles}}>
            <Text style={{fontSize: 20, color: '#ECEDEE'}}>{children}</Text>
        </Pressable>
    );
};

export default CustomizableButton;