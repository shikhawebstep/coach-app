import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";

// ─────────────────────────────────────────────
// WELCOME STEP
// ─────────────────────────────────────────────

const WelcomeStep = ({ coachName = "Ethan", onStart, styles }) => (
  <ImageBackground source={require("@/assets/images/coach4.png")} style={styles.backgroundImage} resizeMode="cover">
    <View style={styles.welcomeOverlay} />
    <View style={styles.welcomeContent}>
      <Image source={require("@/assets/images/sslogo.png")} style={styles.welcomeHeroImage} resizeMode="cover" />
      <Text style={styles.welcomeGreeting}>Welcome to</Text>
      <Text style={styles.welcomeBrand}>Samba Soccer Schools</Text>
      <Text style={styles.welcomeBody}>We are thrilled to have you join us!</Text>
      <Text style={styles.welcomeBody}>
        Before you take the pitch, there are {"\n"} a few essential onboarding tasks {"\n"} that must be completed.
      </Text>
      <TouchableOpacity style={styles.yellowBtn} onPress={onStart}>
        <Text style={styles.yellowBtnText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
);

export default WelcomeStep;
