import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useHabits } from "../context/HabitsContext";
import { Habit } from "../types/Habit";
import Checkbox from "./Checkbox";
import HabitModal from "./HabitModal";

interface HabitItemProps {
  habit: Habit;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit }) => {
  const { toggleHabit, deleteHabit } = useHabits();
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    toggleHabit(habit.id);
  };

  const handleCheckboxToggle = () => {
    toggleHabit(habit.id);
  };

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Habit",
      `Are you sure you want to delete "${habit.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteHabit(habit.id),
        },
      ]
    );
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleValue }] }]}
    >
      <TouchableOpacity
        style={[
          styles.habitContainer,
          habit.completed && styles.completedContainer,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.leftContent}>
          <View
            style={[
              styles.iconContainer,
              habit.completed && styles.completedIconContainer,
            ]}
          >
            <Text style={styles.icon}>{habit.icon}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.habitName,
                habit.completed && styles.completedText,
              ]}
            >
              {habit.name}
            </Text>
            <Text
              style={[
                styles.habitSubtitle,
                habit.completed && styles.completedSubtitle,
              ]}
            >
              {habit.subtitle}
            </Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEdit}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <AntDesign name="edit" size={18} color="#6c757d" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <AntDesign name="delete" size={18} color="#dc3545" />
            </TouchableOpacity>
          </View>
          <Checkbox checked={habit.completed} onToggle={handleCheckboxToggle} />
        </View>
      </TouchableOpacity>

      <HabitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        habit={habit}
        mode="edit"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  habitContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedContainer: {
    backgroundColor: "#f8f9fa",
    opacity: 0.8,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  completedIconContainer: {
    backgroundColor: "#e8f5e8",
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#6c757d",
  },
  habitSubtitle: {
    fontSize: 14,
    color: "#6c757d",
  },
  completedSubtitle: {
    textDecorationLine: "line-through",
    color: "#adb5bd",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    marginRight: 12,
  },
  actionButton: {
    padding: 8,
    marginHorizontal: 4,
  },
});

export default HabitItem;
