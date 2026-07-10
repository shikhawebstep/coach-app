import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Svg, { Path } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import { WebView } from 'react-native-webview';

const { width: SCREEN_W } = Dimensions.get('window');
const PAD_W = SCREEN_W - 80;
const PAD_H = 120;
const PDF_PREVIEW_HEIGHT = 420;

// ─────────────────────────────────────────────
// SIGNATURE DRAWING PAD  (SVG + PanResponder)
// ─────────────────────────────────────────────
function SignaturePad({ onHasSignature, disabled, viewShotRef, c }) {
  const [paths, setPaths] = useState([]);
  const currentPath = useRef([]);
  const padRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const measure = () => {
    padRef.current?.measure((_fx, _fy, _w, _h, px, py) => {
      offsetRef.current = { x: px, y: py };
    });
  };

  const pt = (pageX, pageY) => ({
    x: (pageX - offsetRef.current.x).toFixed(1),
    y: (pageY - offsetRef.current.y).toFixed(1),
  });

  const disabledRef = useRef(disabled);
  const onHasSignatureRef = useRef(onHasSignature);
  disabledRef.current = disabled;
  onHasSignatureRef.current = onHasSignature;

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !disabledRef.current,
    onMoveShouldSetPanResponder: () => !disabledRef.current,
    onPanResponderGrant: ({ nativeEvent: { pageX, pageY } }) => {
      const { x, y } = pt(pageX, pageY);
      currentPath.current = [`M${x},${y}`];
    },
    onPanResponderMove: ({ nativeEvent: { pageX, pageY } }) => {
      const { x, y } = pt(pageX, pageY);
      currentPath.current.push(`L${x},${y}`);
      setPaths(prev => {
        const copy = [...prev];
        if (copy._temp && copy.length > 0) {
          copy[copy.length - 1] = currentPath.current.join(' ');
        } else {
          copy.push(currentPath.current.join(' '));
        }
        copy._temp = true;
        return copy;
      });
    },
 onPanResponderRelease: () => {
    const d = currentPath.current.join(' ');
    if (d) {
      setPaths(prev => {
        const done = [...prev];
        done._temp = false;
        return done;
      });
      onHasSignatureRef.current?.(true);
    }
    currentPath.current = [];
  },
  })).current;

  const clear = () => {
    setPaths([]);
    currentPath.current = [];
    onHasSignature?.(false);
  };

  return (
    <View style={{ marginTop: 4 }}>
      {/* result: 'base64' is critical — default 'tmpfile' returns a file:// URI, not image data */}
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9, result: 'base64' }}>
        <View ref={padRef} onLayout={measure} style={[localSt.padBox, { borderBottomColor: c.borderStrong }]} {...pan.panHandlers}>
          {paths.length === 0 && (
            <Text style={[localSt.padHint, { color: c.placeholder }]}>Sign here…</Text>
          )}
          <Svg width={PAD_W} height={PAD_H} style={StyleSheet.absoluteFill}>
            {paths.map((d, i) => (
              <Path key={i} d={d} stroke="#1A2FA8" strokeWidth={2.2}
                fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </Svg>
        </View>
      </ViewShot>
      {paths.length > 0 && (
        <TouchableOpacity onPress={clear} style={localSt.clearBtn}>
          <Ionicons name="refresh-outline" size={13} color="#EF4444" />
          <Text style={localSt.clearBtnText}>Clear signature</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// PDF PREVIEW (via Google Docs viewer inside WebView)
// ─────────────────────────────────────────────
function PdfPreview({ pdfUrl, c }) {
  const [webviewLoading, setWebviewLoading] = useState(true);
  const [webviewError, setWebviewError] = useState(false);

  if (!pdfUrl) {
    return (
      <View style={[localSt.pdfEmptyBox, { borderColor: c.border }]}>
        <Ionicons name="document-outline" size={28} color={c.placeholder} />
        <Text style={[localSt.pdfEmptyText, { color: c.textSecondary }]}>
          No contract PDF available yet.
        </Text>
      </View>
    );
  }

  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;

  return (
    <View style={[localSt.pdfPreviewWrap, { borderColor: c.border }]}>
      {webviewError ? (
        <View style={[localSt.pdfEmptyBox, { borderColor: 'transparent' }]}>
          <Ionicons name="alert-circle-outline" size={26} color={c.error} />
          <Text style={[localSt.pdfEmptyText, { color: c.textSecondary }]}>
            Couldn't preview the PDF. Try opening it directly.
          </Text>
          <TouchableOpacity
            style={[localSt.pdfOpenBtn, { backgroundColor: c.primary }]}
            onPress={() => WebBrowser.openBrowserAsync(pdfUrl)}
          >
            <Text style={localSt.pdfOpenBtnText}>Open PDF</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <WebView
            source={{ uri: viewerUrl }}
            style={{ height: PDF_PREVIEW_HEIGHT, backgroundColor: 'transparent' }}
            onLoadEnd={() => setWebviewLoading(false)}
            onError={() => { setWebviewLoading(false); setWebviewError(true); }}
            scalesPageToFit
          />
          {webviewLoading && (
            <View style={localSt.pdfLoadingOverlay}>
              <ActivityIndicator size="small" color={c.primary} />
              <Text style={[localSt.pdfEmptyText, { color: c.textSecondary, marginTop: 8 }]}>
                Loading contract preview…
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// PDF TEXT PREVIEW (optional fallback)
// ─────────────────────────────────────────────
function PdfTextPreview({ text, c }) {
  if (!text) {
    return (
      <View style={[localSt.pdfEmptyBox, { borderColor: c.border }]}>
        <Ionicons name="document-text-outline" size={28} color={c.placeholder} />
        <Text style={[localSt.pdfEmptyText, { color: c.textSecondary }]}>
          No extracted text available for this contract.
        </Text>
      </View>
    );
  }
  return (
    <ScrollView
      style={[localSt.pdfTextWrap, { borderColor: c.border }]}
      contentContainerStyle={{ padding: 14 }}
      nestedScrollEnabled
    >
      <Text style={{ fontSize: 13, lineHeight: 20, color: c.text, fontFamily: 'Urbanist_400Regular' }}>
        {text}
      </Text>
    </ScrollView>
  );
}

// ─────────────────────────────────────────────
// MAIN CONTRACT STEP
// ─────────────────────────────────────────────
const ContractStep = ({
  onNext, onComplete, onBack,
  isCompleted, styles, COLORS, token, userId
}) => {
  const c = {
    bg: COLORS?.background || '#fff',
    paper: COLORS?.card || '#fff',
    border: COLORS?.border || '#EEF0F3',
    borderStrong: COLORS?.borderStrong || '#9E9FAA',
    text: COLORS?.text || '#1a1a1a',
    textSecondary: COLORS?.textSecondary || '#6B7280',
    placeholder: COLORS?.placeholder || '#bbb',
    primary: COLORS?.blueBtn || '#2F5FE5',
    success: COLORS?.success || '#22C55E',
    error: COLORS?.error || '#EF4444',
    badgeBg: COLORS?.cardAlt || '#F3F4F6',
  };

  const [fullName, setFullName] = useState('');
  const [hasSig, setHasSig] = useState(false);
  const [agreed, setAgreed] = useState(isCompleted);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [contract, setContract] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [signedPdfUrl, setSignedPdfUrl] = useState(null);

  // Which signature method the user picked
  const [sigMethod, setSigMethod] = useState('type'); // 'type' | 'draw'

  // Which preview mode for the contract PDF
  const [previewMode, setPreviewMode] = useState('pdf'); // 'pdf' | 'text'

  const viewShotRef = useRef(null);

  useEffect(() => {
    if (!token || !userId) { setProfileLoading(false); return; }
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/account-profile/${userId}`, {
      method: 'GET', headers,
    })
      .then(r => r.json())
      .then(result => {
        if (result.status && result.data) {
          const ct = result.data.contract;
          setContract(ct);
          const name = `${result.data.firstName || ''} ${result.data.lastName || ''}`.trim();
          setFullName(name);
          if (ct?.signedPdfFile) setSignedPdfUrl(ct.signedPdfFile);
        }
      })
      .catch(err => console.error('Profile fetch:', err))
      .finally(() => setProfileLoading(false));
  }, [token, userId]);

  const handleSign = async () => {
    if (!agreed) {
      setError("Please check the agreement box.");
      return;
    }

    if (!fullName.trim()) {
      setError("Please type your full name.");
      return;
    }

    if (sigMethod === "draw" && !hasSig) {
      setError("Please draw your signature.");
      return;
    }

    if (!contract?.id) {
      setError("No contract found.");
      return;
    }

    setSigning(true);
    setError(null);
    setSuccessMsg(null);

    try {
      let signatureBase64 = null;

      // Capture drawn signature
      if (sigMethod === "draw") {
        try {
          const raw = await viewShotRef.current?.capture?.();

          if (!raw) {
            throw new Error("Failed to capture signature.");
          }

          signatureBase64 = `data:image/png;base64,${raw}`;
        } catch (err) {
          console.error("Signature capture error:", err);
          setError("Unable to capture signature. Please try again.");
          return;
        }
      }

      const payload = {
        contractTemplateId: contract.id,
        signedName: fullName.trim(),
        signatureImage: signatureBase64, // null if typed
      };

    
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", `Bearer ${token}`);

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/contract/sign`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );

      const responseText = await res.text();


      let result = {};


      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Response is not valid JSON");
      }

      if (!res.ok || !result.status) {
        setError(result.message || "Failed to sign contract.");
        return;
      }

      const signedPdf =
        result.data?.signedPdfFile ||
        result.data?.pdfFile ||
        null;

      if (signedPdf) {
        setSignedPdfUrl(signedPdf);
      }

      setSuccessMsg("Contract signed successfully!");

      if (onComplete) {
        onComplete();
      } else if (onNext) {
        onNext();
      }
    } catch (err) {
      console.error("Contract Sign Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setSigning(false);
    }
  };
  // status values seen so far: "not_assigned", presumably also "assigned" / "signed"
  const isSigned = contract?.status === 'signed' || !!contract?.signedAt || isCompleted;
  const activePdfUrl = signedPdfUrl || contract?.signedPdfFile || contract?.pdfFile;
  const signatureProvided = sigMethod === 'type'
    ? fullName.trim().length > 0
    : hasSig;
  const canSign = agreed && signatureProvided && !isSigned;

  const localStyles = getLocalStyles(c);

  return (
    <View style={[styles.stepContainer, { backgroundColor: c.bg }]}>

      {/* ── Top header bar ── */}
      <View style={localStyles.contractHeader}>
        <TouchableOpacity onPress={onBack} style={localStyles.backCircle}>
          <Ionicons name="arrow-back" size={18} color={c.text} />
        </TouchableOpacity>
        <Text style={localStyles.contractHeaderTitle}>Sign your contract</Text>
        <View style={[localStyles.statusBadge, isSigned && { backgroundColor: c.success }]}>
          <Text style={[localStyles.statusBadgeText, isSigned && { color: '#fff' }]}>
            {isSigned ? 'Completed' : 'Pending'}
          </Text>
        </View>
      </View>

      {/* ── Top action buttons ── */}
      <View style={localStyles.actionRow}>
        <TouchableOpacity style={localStyles.primaryPillBtn} onPress={onBack}>
          <Text style={localStyles.primaryPillBtnText}>Previous</Text>
        </TouchableOpacity>

        {isSigned && (
          <TouchableOpacity style={localStyles.primaryPillBtn} onPress={onNext}>
            <Text style={localStyles.primaryPillBtnText}>Next</Text>
          </TouchableOpacity>
        )}

        {activePdfUrl && (
          <TouchableOpacity
            style={localStyles.primaryPillBtn}
            onPress={() => Linking.openURL(activePdfUrl)}
          >
            <Text style={localStyles.primaryPillBtnText}>Download</Text>
          </TouchableOpacity>
        )}
      </View>

      {profileLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <ActivityIndicator color={c.primary} size="large" />
          <Text style={{ color: c.textSecondary, fontFamily: 'Urbanist_500Medium' }}>Loading contract…</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={localStyles.paper}>

            {previewMode === 'pdf' ? (
              <PdfPreview pdfUrl={contract?.signedPdfFile ? contract?.signedPdfFile : contract?.pdfFile} c={c} />
            ) : (
              <PdfTextPreview text={contract?.pdfText} c={c} />
            )}

            {signedPdfUrl && (
              <TouchableOpacity
                style={localStyles.signedPdfRow}
                onPress={() => WebBrowser.openBrowserAsync(signedPdfUrl)}
              >
                <Ionicons name="document-text" size={16} color={c.success} />
                <Text style={localStyles.signedPdfRowText}>View Signed Contract PDF</Text>
                <Ionicons name="open-outline" size={14} color={c.success} />
              </TouchableOpacity>
            )}

            {/* ── Signature section ── */}
            {!isSigned && (
              <View style={localStyles.sigSection}>
                <Text style={localStyles.heading}>Provide your signature</Text>

                <View style={localStyles.methodToggleRow}>
                  <TouchableOpacity
                    style={[localStyles.methodToggleBtn, sigMethod === 'type' && { backgroundColor: c.primary, borderColor: c.primary }]}
                    onPress={() => setSigMethod('type')}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="text-outline" size={14} color={sigMethod === 'type' ? '#fff' : c.text} />
                    <Text style={[localStyles.methodToggleText, sigMethod === 'type' && { color: '#fff' }]}>
                      Type Name
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[localStyles.methodToggleBtn, sigMethod === 'draw' && { backgroundColor: c.primary, borderColor: c.primary }]}
                    onPress={() => setSigMethod('draw')}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="create-outline" size={14} color={sigMethod === 'draw' ? '#fff' : c.text} />
                    <Text style={[localStyles.methodToggleText, sigMethod === 'draw' && { color: '#fff' }]}>
                      Draw Signature
                    </Text>
                  </TouchableOpacity>
                </View>

                {sigMethod === 'type' ? (
                  <View style={localStyles.nameSection}>
                    <TextInput
                      style={[localStyles.nameInput, isSigned && localStyles.nameInputSigned]}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Type your full name"
                      placeholderTextColor={c.placeholder}
                      editable={!isSigned}
                    />
                    <Text style={localStyles.sigLabel}>Typing your name here counts as your signature</Text>
                  </View>
                ) : (
                  <>
                    <SignaturePad
                      onHasSignature={setHasSig}
                      disabled={isSigned}
                      viewShotRef={viewShotRef}
                      c={c}
                    />
                    <View style={localStyles.nameSection}>
                      <TextInput
                        style={[localStyles.nameInput, isSigned && localStyles.nameInputSigned]}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Full name"
                        placeholderTextColor={c.placeholder}
                        editable={!isSigned}
                      />
                    </View>
                  </>
                )}
              </View>
            )}

            {!isSigned && (
              <TouchableOpacity
                style={localStyles.agreeRow}
                onPress={() => setAgreed(v => !v)}
                activeOpacity={0.8}
              >
                <View style={[localStyles.checkbox, agreed && localStyles.checkboxChecked]}>
                  {agreed && <Ionicons name="checkmark" size={12} color="#fff" />}
                </View>
                <Text style={localStyles.agreeText}>
                  I have read and agree to the terms of this contract
                </Text>
              </TouchableOpacity>
            )}

            {error && (
              <View style={localStyles.errorBox}>
                <Ionicons name="alert-circle-outline" size={15} color={c.error} />
                <Text style={localStyles.errorBoxText}>{error}</Text>
              </View>
            )}
            {successMsg && (
              <View style={localStyles.successBox}>
                <Ionicons name="checkmark-circle-outline" size={15} color={c.success} />
                <Text style={localStyles.successBoxText}>{successMsg}</Text>
              </View>
            )}

            {!isSigned && (
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {[
                  { label: 'Name', done: fullName.trim().length > 0 },
                  { label: sigMethod === 'draw' ? 'Signature' : 'Typed name', done: signatureProvided },
                  { label: 'Agreed', done: agreed },
                ].map(({ label, done }) => (
                  <View key={label} style={[localStyles.pill, done && localStyles.pillDone]}>
                    <Ionicons
                      name={done ? "checkmark-circle" : "ellipse-outline"}
                      size={12}
                      color={done ? c.success : c.placeholder}
                    />
                    <Text style={[localStyles.pillText, done && localStyles.pillTextDone]}>
                      {label}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={[
                localStyles.signBtn,
                (canSign || isSigned) ? { backgroundColor: c.primary } : { backgroundColor: '#D1D5DB' },
              ]}
              onPress={isSigned ? null : handleSign}
              disabled={!canSign && !isSigned}
              activeOpacity={canSign ? 0.85 : 1}
            >
              {signing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons
                    name={isSigned ? "checkmark-circle" : "create-outline"}
                    size={20} color="#fff"
                  />
                  <Text style={localStyles.signBtnText}>
                    {isSigned ? 'Contract Signed ✓' : 'Sign & Continue'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

// ─── Styles (theme-aware, Urbanist-only) ───────────────────────────────────
const getLocalStyles = (c) => StyleSheet.create({
  contractHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, gap: 12,
  },
  backCircle: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: c.border,
  },
  contractHeaderTitle: { flex: 1, fontSize: 18, fontFamily: 'Urbanist_700Bold', color: c.text },
  statusBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusBadgeText: { fontSize: 11, fontFamily: 'Urbanist_700Bold', color: '#B45309' },

  actionRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: c.border,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 24,
  },
  secondaryBtnText: { fontSize: 13, fontFamily: 'Urbanist_600SemiBold', color: c.text },
  primaryPillBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: c.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 24,
  },
  primaryPillBtnText: { fontSize: 13, fontFamily: 'Urbanist_700Bold', color: '#fff' },

  paper: {
    backgroundColor: c.paper, marginHorizontal: 16, marginTop: 8,
    borderRadius: 16, gap: 10,
  },
  docTitle: { fontSize: 18, fontFamily: 'Urbanist_700Bold', color: c.text, marginBottom: 2 },
  typePill: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: c.badgeBg, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, marginBottom: 6,
  },
  typePillText: { fontSize: 12, fontFamily: 'Urbanist_700Bold', color: c.primary },
  body: { fontSize: 13.5, fontFamily: 'Urbanist_400Regular', color: c.textSecondary, lineHeight: 21 },
  heading: { fontSize: 14, fontFamily: 'Urbanist_700Bold', color: c.text, marginBottom: 8 },

  nameSection: { marginTop: 12 },
  nameInput: {
    borderWidth: 1.5, borderColor: c.border, backgroundColor: c.badgeBg,
    color: c.text, fontSize: 14, fontFamily: 'Urbanist_600SemiBold',
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12,
  },
  nameInputSigned: { backgroundColor: 'rgba(34,197,94,0.1)', borderColor: c.success },

  sigSection: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: c.border, gap: 8 },
  sigLabelRow: { borderTopWidth: 1, borderTopColor: c.border, paddingTop: 4, width: PAD_W },
  sigLabel: { fontSize: 12, fontFamily: 'Urbanist_400Regular', fontStyle: 'italic', color: c.textSecondary, marginTop: 6 },
  signedBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(34,197,94,0.08)', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)',
  },
  signedBoxText: { color: c.success, fontFamily: 'Urbanist_700Bold', fontSize: 14 },

  agreeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 4 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 2, borderColor: c.border,
    justifyContent: 'center', alignItems: 'center', marginTop: 1, flexShrink: 0,
  },
  checkboxChecked: { backgroundColor: c.primary, borderColor: c.primary },
  agreeText: { fontSize: 12.5, fontFamily: 'Urbanist_500Medium', color: c.textSecondary, lineHeight: 18, flex: 1 },

  errorBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 8, padding: 10,
    borderLeftWidth: 3, borderLeftColor: c.error,
  },
  errorBoxText: { color: c.error, fontSize: 13, fontFamily: 'Urbanist_500Medium', flex: 1 },
  successBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: 'rgba(34,197,94,0.08)', borderRadius: 8, padding: 10,
    borderLeftWidth: 3, borderLeftColor: c.success,
  },
  successBoxText: { color: c.success, fontSize: 13, fontFamily: 'Urbanist_500Medium', flex: 1 },
  signedPdfRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#0F2C1A', borderRadius: 12, padding: 12,
  },
  signedPdfRowText: { color: '#4ADE80', fontFamily: 'Urbanist_700Bold', fontSize: 13, flex: 1 },

  pill: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5, backgroundColor: c.badgeBg,
  },
  pillDone: { backgroundColor: 'rgba(34,197,94,0.12)' },
  pillText: { fontSize: 11, fontFamily: 'Urbanist_600SemiBold', color: c.placeholder, marginLeft: 3 },
  pillTextDone: { color: c.success },

  signBtn: { height: 54, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 14 },
  signBtnText: { color: '#fff', fontFamily: 'Urbanist_700Bold', fontSize: 16 },

  methodToggleRow: {
    flexDirection: 'row', gap: 8, marginBottom: 12,
  },
  methodToggleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1.5, borderColor: c.border,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
  },
  methodToggleText: {
    fontSize: 12.5, fontFamily: 'Urbanist_600SemiBold', color: c.text,
  },
});

const localSt = StyleSheet.create({
  padBox: {
    width: PAD_W, height: PAD_H, borderBottomWidth: 1.5,
    backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  padHint: { fontSize: 15, fontFamily: 'Urbanist_400Regular', fontStyle: 'italic', position: 'absolute' },
  clearBtn: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    marginTop: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    backgroundColor: '#FEE2E2',
  },
  clearBtnText: { color: '#EF4444', fontSize: 12, fontFamily: 'Urbanist_600SemiBold', marginLeft: 3 },

  pdfPreviewWrap: {
    borderWidth: 1, borderRadius: 12, overflow: 'hidden', marginBottom: 4,
  },
  pdfEmptyBox: {
    height: PDF_PREVIEW_HEIGHT / 1.6,
    borderWidth: 1, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20,
  },
  pdfEmptyText: { fontSize: 13, fontFamily: 'Urbanist_500Medium', textAlign: 'center' },
  pdfOpenBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, marginTop: 4 },
  pdfOpenBtnText: { color: '#fff', fontFamily: 'Urbanist_700Bold', fontSize: 13 },
  pdfLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  pdfTextWrap: {
    height: PDF_PREVIEW_HEIGHT,
    borderWidth: 1, borderRadius: 12, marginBottom: 4,
  },
});

export default ContractStep;