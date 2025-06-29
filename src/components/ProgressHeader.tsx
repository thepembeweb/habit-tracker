import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useHabits } from "../context/HabitsContext";

const ProgressHeader: React.FC = () => {
  const { getCompletedCount, getTotalCount } = useHabits();

  const completed = getCompletedCount();
  const total = getTotalCount();
  const progressPercentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.progressInfo}>
        <Text style={styles.progressHeadingText}>You are almost there!</Text>
      </View>
      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          {completed}/{total} habits completed
        </Text>
        <Text style={styles.percentageText}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View
          style={[styles.progressBar, { width: `${progressPercentage}%` }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressHeadingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  progressText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  percentageText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
});

export default ProgressHeader;
