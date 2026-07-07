import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { UNIFORM_ITEMS } from "./OnboardingConstants";

// ─────────────────────────────────────────────
// UNIFORM STEP
// ─────────────────────────────────────────────

const UniformStep = ({ onNext, onComplete, onBack, isCompleted, styles, COLORS }) => {
  const [selected, setSelected] = useState({});
  const [activeItem, setActiveItem] = useState(null);

  const toggleSize = (itemId, size) => setSelected((prev) => ({ ...prev, [itemId]: size }));

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
        <Text style={styles.contractHeaderTitle}>Purchase Uniform</Text>
        <View style={[styles.pendingBadge, isCompleted && { backgroundColor: COLORS.success }]}>
          <Text style={[styles.pendingBadgeText, isCompleted && { color: "#fff" }]}>
            {isCompleted ? "Completed" : "Pending"}
          </Text>
        </View>
      </View>

      <View style={styles.contractBtnRow}>
        <TouchableOpacity style={styles.contractBtn} onPress={onBack}>
          <Text style={styles.contractBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.uniformNotice}>
          You must purchase mandatory items. Use discount code COACH25 at checkout to receive 25% off.
        </Text>
        <View style={styles.uniformGrid}>
          {UNIFORM_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.uniformGridItem}
              onPress={() => setActiveItem(activeItem === item.id ? null : item.id)}
              activeOpacity={0.85}
            >
              <Image source={item.image} style={styles.uniformGridImage} resizeMode="cover" />
              <Text style={styles.uniformGridName}>{item.name}</Text>
              <Text style={styles.uniformGridPrice}>{item.price}</Text>
              {activeItem === item.id && (
                <View style={styles.sizeRow}>
                  {item.sizes.map((sz) => (
                    <TouchableOpacity
                      key={sz}
                      style={[styles.sizeBtn, selected[item.id] === sz && styles.sizeBtnActive]}
                      onPress={() => toggleSize(item.id, sz)}
                    >
                      <Text style={[styles.sizeBtnText, selected[item.id] === sz && styles.sizeBtnTextActive]}>{sz}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.stepFooter}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleComplete} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>
            {isCompleted ? "Completed (Go Back)" : "Continue →"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UniformStep;
