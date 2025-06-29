import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const BannerImage: React.FC = () => {
  const currentHour = new Date().getHours();
  let greeting = "Good Evening";
  let gradientColors: [string, string] = ["#667eea", "#764ba2"];
  let emoji = "🌙";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning";
    gradientColors = ["#ff9a9e", "#fecfef"];
    emoji = "☀️";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
    gradientColors = ["#a8edea", "#fed6e3"];
    emoji = "🌤️";
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.decorativeShapes}>
          <View style={[styles.shape, styles.shape1]} />
          <View style={[styles.shape, styles.shape2]} />
          <View style={[styles.shape, styles.shape3]} />
          <View style={[styles.shape, styles.shape4]} />
        </View>

        <View style={styles.content}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.greeting}>{greeting}!</Text>
          <Text style={styles.subtitle}>Ready to build great habits?</Text>
        </View>

        <View style={styles.wave}>
          <View style={styles.waveShape} />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    height: 160,
    paddingHorizontal: 24,
    paddingVertical: 20,
    position: "relative",
    overflow: "hidden",
  },
  decorativeShapes: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  shape: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 50,
  },
  shape1: {
    width: 80,
    height: 80,
    top: -20,
    right: -10,
    transform: [{ rotate: "45deg" }],
  },
  shape2: {
    width: 60,
    height: 60,
    bottom: -20,
    left: -20,
    borderRadius: 30,
  },
  shape3: {
    width: 40,
    height: 40,
    top: 60,
    right: 60,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  shape4: {
    width: 100,
    height: 20,
    bottom: 40,
    right: -30,
    borderRadius: 10,
    transform: [{ rotate: "-15deg" }],
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 1,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  wave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },
  waveShape: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    transform: [{ scaleX: 1.5 }],
  },
});

export default BannerImage;
