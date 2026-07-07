import * as DocumentPicker from 'expo-document-picker';
import { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { QUALIFICATION_TYPES } from "./OnboardingConstants";

// ─────────────────────────────────────────────
// QUALIFICATIONS STEP
// ─────────────────────────────────────────────

const QualificationsStep = ({ onNext, onComplete, onBack, isCompleted, styles, COLORS, token, userId }) => {
  const [files, setFiles] = useState({});       // { fa_level_1: {name, uri, mimeType}, ... }
  const [notPossess, setNotPossess] = useState({});
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  console.log('userId', userId);

  // Map your UI qualification ids -> API field names
  const FIELD_MAP = {
    "1": "fa_level_1",
    "2": "futsal_level_1_qualification",
    "3": "first_aid",
    "4": "others",
  };

  const pickFile = async (id) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      console.log('DocumentPicker result:', result);

      if (result.canceled) return;

      const asset = result.assets[0];
      setFiles((prev) => ({ ...prev, [id]: asset }));
      setError(null);
    } catch (e) {
      console.error('DocumentPicker error:', e);
      setError(`Could not open file picker: ${e.message}`);
    }
  };

  const toggleNotPossess = (id) => setNotPossess((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleComplete = async () => {
    setUploading(true);
    setError(null);
    try {
      const formdata = new FormData();
      let fileCount = 0;

      QUALIFICATION_TYPES.forEach((qual) => {
        const fieldName = FIELD_MAP[qual.id];
        if (!fieldName) return;
        const file = files[qual.id];
        if (file && !notPossess[qual.id]) {
          formdata.append(fieldName, {
            uri: file.uri,
            name: file.name || `${fieldName}_upload`,
            type: file.mimeType || "application/octet-stream",
          });
          fileCount++;
        }
      });

      if (notes) formdata.append("notes", notes);

      console.log('--- Upload debug ---');
      console.log('fileCount:', fileCount);
      console.log('files state:', files);
      console.log('userId:', userId);
      console.log('token present:', !!token, token?.slice(0, 20));

      if (fileCount === 0 && !notes) {
        setError("Please upload at least one document or add notes");
        setUploading(false);
        return;
      }

      const response = await fetch(
        `https://api.grabbite.com/api/coachPro/account-profile/upload/qualifications/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formdata,
        }
      );

      console.log('response status:', response.status);
      console.log('response headers:', JSON.stringify([...response.headers.entries()]));

      // Read the body as text FIRST — response.json() will throw and swallow
      // the actual error body if the server returns HTML/plain-text on failure
      const rawText = await response.text();
      console.log('response raw body:', rawText);

      if (!response.ok) {
        throw new Error(`Upload failed (${response.status}): ${rawText}`);
      }

      let result;
      try {
        result = JSON.parse(rawText);
      } catch (parseErr) {
        throw new Error(`Server returned non-JSON: ${rawText.slice(0, 200)}`);
      }

      console.log('parsed result:', result);

      if (onComplete) onComplete();
      else if (onNext) onNext();
    } catch (e) {
      console.error('Upload error full:', e);
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.contractHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.contractHeaderTitle}>Upload Qualifications</Text>
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

      <ScrollView style={{ flex: 1, padding: 18 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.qualIntro}>Please upload the requested documents below.</Text>

        {error && (
          <Text style={{ color: COLORS.error, fontSize: 13, marginBottom: 10 }}>{error}</Text>
        )}

        {QUALIFICATION_TYPES.map((qual) => {
          const isNotesField = qual.id === "5";
          if (isNotesField) return null; // render Notes separately below
          return (
            <View key={qual.id} style={{ marginBottom: 6 }}>
              <Text style={styles.qualFieldLabel}>{qual.label}</Text>
              <TouchableOpacity
                style={[styles.uploadField, files[qual.id] && styles.uploadFieldFilled]}
                onPress={() => pickFile(qual.id)}
                activeOpacity={0.8}
                disabled={notPossess[qual.id]}
              >
                <Text style={styles.uploadFieldText} numberOfLines={1}>
                  {files[qual.id]?.name || ''}
                </Text>
                <Image source={require('@/assets/images/Upload2.png')} style={styles.uploadIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.notPossessRow} onPress={() => toggleNotPossess(qual.id)}>
                <Text style={styles.notPossessText}>I do not possess this qualification</Text>
                <View style={[styles.npCheckbox, notPossess[qual.id] && styles.npCheckboxChecked]}>
                  {notPossess[qual.id] && <Text style={styles.npCheckMark}>✓</Text>}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}

        <Text style={[styles.qualFieldLabel, { marginTop: 8 }]}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={2}
          placeholderTextColor={COLORS.textSecondary}
        />

        <TouchableOpacity style={styles.uploadBtn} onPress={handleComplete} disabled={uploading}>
          <Text style={styles.uploadBtnText}>
            {uploading ? "Uploading…" : isCompleted ? "Completed (Go Back)" : "Upload"}
          </Text>
        </TouchableOpacity>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

export default QualificationsStep;
