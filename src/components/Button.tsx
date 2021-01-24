import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface IButtonProps extends TouchableOpacityProps {
    variant?: "primary" | "secondary" | "tertiary";
}

const CustomButton: React.FC<IButtonProps> = ({ children, ...touchProps }) => {
    return (
        <TouchableOpacity style={styles.button} {...touchProps}>
            <Text>{children}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "red",
        color: "white",
    }
});

export default CustomButton;