import React from "react";
import { TouchableOpacity, StyleSheet, Animated } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  checkedColor?: string;
  uncheckedColor?: string;
  borderColor?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  size = 24,
  checkedColor = "#28a745",
  uncheckedColor = "transparent",
  borderColor = "#dee2e6",
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const opacityValue = React.useRef(
    new Animated.Value(checked ? 1 : 0)
  ).current;

  React.useEffect(() => {
    Animated.timing(opacityValue, {
      toValue: checked ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [checked, opacityValue]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: checked ? checkedColor : uncheckedColor,
          borderColor: checked ? checkedColor : borderColor,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}
      >
        <AntDesign name="check" size={size * 0.6} color="white" />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Checkbox;
