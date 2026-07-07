import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CONTRACT_SECTIONS } from "./OnboardingConstants";

// ─────────────────────────────────────────────
// CONTRACT STEP
// ─────────────────────────────────────────────

const ContractStep = ({ onNext, onComplete, onBack, isCompleted, styles, COLORS }) => {
  const [agreed, setAgreed] = useState(isCompleted);
  const [fullName, setFullName] = useState('');

  const handleComplete = () => {
    if (onComplete) onComplete();
    else if (onNext) onNext();
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.contractHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.contractHeaderTitle}>Sign your contract</Text>
        <View style={[styles.pendingBadge, isCompleted && { backgroundColor: COLORS.success }]}>
          <Text style={[styles.pendingBadgeText, isCompleted && { color: "#fff" }]}>
            {isCompleted ? "Completed" : "Pending"}
          </Text>
        </View>
      </View>

      <View style={styles.contractBtnRow}>
        <TouchableOpacity style={styles.contractBtn} onPress={onBack}>
          <Text style={styles.contractBtnText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contractBtn} onPress={onBack}>
          <Text style={styles.contractBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contractScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.contractDocTitle}>INDEPENDENT CONTRACTOR AGREEMENT</Text>
        <View style={styles.contractIntroRow}>
          <Text style={styles.contractBody}>This independent contractor agreement is between </Text>
          <TextInput
            style={styles.contractNameInput}
            placeholder="Full Name"
            placeholderTextColor={COLORS.textSecondary}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        <Text style={styles.contractBody}>
          And SAMBA SOCCER SCHOOLS GLOBAL LTD ("We", "Us", "Our", the "Company")
        </Text>

        {CONTRACT_SECTIONS.map((sec) => (
          <View key={sec.id} style={styles.contractSection}>
            <Text style={styles.contractHeading}>{sec.heading}</Text>
            <Text style={styles.contractBody}>{sec.body}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.checkRow}
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={styles.checkLabel}>I have read and agree to the terms of this contract</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.stepFooter}>
        <TouchableOpacity
          style={[styles.primaryBtn, !agreed && styles.primaryBtnDisabled]}
          onPress={agreed ? handleComplete : null}
          activeOpacity={agreed ? 0.85 : 1}
        >
          <Text style={styles.primaryBtnText}>
            {isCompleted ? "Completed (Go Back)" : "Sign & Continue →"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContractStep;
