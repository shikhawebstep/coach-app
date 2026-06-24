import { useAuth } from '@/context/AuthContext';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Header from '../components/layout/Header';
import OnboardingHeader from "../components/layout/OnboardingHeader";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
// ─────────────────────────────────────────────
// THEME COLORS
// ─────────────────────────────────────────────

const DARK_COLORS = {
  primary: "#F5C518",
  dark: "#1A1A1A",
  darkCard: "#242424",
  surface: "#2E2E2E",
  border: "#3A3A3A",
  textPrimary: "#FFFFFF",
  textSecondary: "#AAAAAA",
  success: "#4CAF50",
  error: "#FF5252",
  accent: "#00B0FF",
  headerBg: "#111111",
  screenBg: "#1A1A1A",
  inputBg: "#2E2E2E",
  inputBorder: "#3A3A3A",
  inputText: "#FFFFFF",
  contractBg: "#1A1A1A",
  contractHeaderBg: "#242424",
  contractBtnRowBg: "#242424",
  contractBodyText: "#BBBBBB",
  contractTitleText: "#FFFFFF",
  contractBorderBottom: "#3A3A3A",
  checkboxBorder: "#666",
  checkLabel: "#CCCCCC",
  qualIntro: "#AAAAAA",
  qualFieldLabel: "#AAAAAA",
  uploadFieldBg: "#2E2E2E",
  uploadFieldBorder: "#444",
  uploadFieldText: "#FFFFFF",
  notPossessText: "#AAAAAA",
  notesInputBg: "#2E2E2E",
  notesInputBorder: "#444",
  notesInputText: "#FFFFFF",
  uniformNotice: "#AAAAAA",
  uniformGridName: "#5B8EFF",
  uniformGridPrice: "#FFFFFF",
  searchBarBg: "#2E2E2E",
  searchBarBorder: "#444",
  searchInputText: "#FFFFFF",
  timerBarBg: "#1e2a4a",
  timerText: "#5B8EFF",
  qLabel: "#5B8EFF",
  qText: "#FFFFFF",
  assessOptionBg: "#2E2E2E",
  assessOptionBorder: "#555",
  assessOptionText: "#FFFFFF",
  assessOptionSelectedBg: "#2E2E2E",
  assessOptionSelectedBorder: "#5B8EFF",
  assessOptionSelectedText: "#5B8EFF",
  resultSubText: "#CCCCCC",
  pendingBadgeBg: "#F7D02A",
  pendingBadgeText: "#000",
  contractNameInputBg: "#2E2E2E",
  contractNameInputBorder: "#555",
  contractNameInputText: "#FFF",
};

const LIGHT_COLORS = {
  primary: "#F5C518",
  dark: "#F9F9F9",
  darkCard: "#FFFFFF",
  surface: "#EAEAEA",
  border: "#D3D3D3",
  textPrimary: "#1A1A1A",
  textSecondary: "#666666",
  success: "#4CAF50",
  error: "#FF5252",
  accent: "#00B0FF",
  headerBg: "#FFFFFF",
  screenBg: "#F5F5F5",
  inputBg: "#F6F6F7",
  inputBorder: "#D3D3D3",
  inputText: "#111111",
  contractBg: "#FFFFFF",
  contractHeaderBg: "#FFFFFF",
  contractBtnRowBg: "#FFFFFF",
  contractBodyText: "#444444",
  contractTitleText: "#111111",
  contractBorderBottom: "#DDDDDD",
  checkboxBorder: "#CCCCCC",
  checkLabel: "#444444",
  qualIntro: "#444444",
  qualFieldLabel: "#797A88",
  uploadFieldBg: "#F6F6F7",
  uploadFieldBorder: "#DDDDDD",
  uploadFieldText: "#111111",
  notPossessText: "#797A88",
  notesInputBg: "#F7F7F7",
  notesInputBorder: "#DDDDDD",
  notesInputText: "#111111",
  uniformNotice: "#676774",
  uniformGridName: "#2563EB",
  uniformGridPrice: "#111111",
  searchBarBg: "#F7F7F7",
  searchBarBorder: "#DDDDDD",
  searchInputText: "#111111",
  timerBarBg: "#EEF2FF",
  timerText: "#2563EB",
  qLabel: "#2563EB",
  qText: "#111111",
  assessOptionBg: "#FAFAFA",
  assessOptionBorder: "#9E9FAA",
  assessOptionText: "#000000",
  assessOptionSelectedBg: "#FAFAFA",
  assessOptionSelectedBorder: "#2563EB",
  assessOptionSelectedText: "#2563EB",
  resultSubText: "#212121",
  pendingBadgeBg: "#F7D02A",
  pendingBadgeText: "#000",
  contractNameInputBg: "#FFF",
  contractNameInputBorder: "#CCC",
  contractNameInputText: "#111",
};

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === 'light' ? LIGHT_COLORS : DARK_COLORS;
};

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const ONBOARDING_TASKS = [
  {
    id: "1",
    title: "Sign your contract",
    subtitle: "Independent Contractor Agreement",
    status: "pending",
    icon: require("../assets/images/edit.png"),
  },
  {
    id: "2",
    title: "Upload your qualifications",
    subtitle: "Certificates & coaching badges",
    status: "pending",
    icon: require("../assets/images/Upload.png"),
  },
  {
    id: "3",
    title: "Purchase your uniform",
    subtitle: "Order your official kit",
    status: "pending",
    icon: require("../assets/images/Wallet.png"),
  },
  {
    id: "4",
    title: "Watch Training Courses",
    subtitle: "Complete required modules",
    status: "pending",
    icon: require("../assets/images/Play.png"),
  },
];

const CONTRACT_SECTIONS = [
  {
    id: "background",
    heading: "Background",
    body: `a. The Company is of the opinion that the Contractor has the necessary qualifications, experience and abilities to provide services to the Company.\nb. The Contractor agrees to provide such services to the Company on the terms and conditions set out in the Agreement.`,
  },
  {
    id: "general1",
    heading: "General",
    body: `IN CONSIDERATION OF the matters described above and of the mutual benefits and obligations set forth in this Agreement, the receipt and sufficiency of which consideration is hereby acknowledged, the Company and the Contractor (individually the "Party" and collectively the "Parties" to this Agreement) agree as follows:`,
  },
  {
    id: "general2",
    heading: "General",
    body: `a. The particulars of this Agreement are as set out in this Agreement and the Company policies, procedures and rules as may be introduced and/or varied from time to time.\nb. The Company has a duty to safeguard all students, parents and guardians and their personal information. The Contractor agrees to adhere to the Company's policies and understands that failure to do so may lead to all work being withdrawn.\nc. Any amendments or modifications of this Agreement or additional obligation assumed by either Party in connection with this agreement will be binding only if evidenced in writing signed by all Parties.`,
  },
];

const DASHBOARD_TASKS = [
  { id: "1", title: "Sign your contract", duration: "10 minutes", icon: require("../assets/images/edit.png"), color: "#E04F2A" },
  { id: "2", title: "Upload your qualifications", duration: "5 minutes", icon: require("../assets/images/Upload.png"), color: "#E8A000" },
  { id: "3", title: "Purchase your uniform", duration: "5 minutes", icon: require("../assets/images/Wallet.png"), color: "#1D6FA4" },
  { id: "4", title: "Watch Training Courses", duration: "90 minutes", icon: require("../assets/images/Play.png"), color: "#2E9E4F" },
];

const QUALIFICATION_TYPES = [
  { id: "1", label: "FA Level 1 Coaching Certificate", required: true },
  { id: "2", label: "Futsal Level 1 Qualification", required: false },
  { id: "3", label: "Emergency First Aid Training", required: true },
  { id: "4", label: "Other (Upload up to 5 items)", required: true },
  { id: "5", label: "Notes", required: false },
];

const UNIFORM_ITEMS = [
  { id: "1", name: "Coaches T-shirt", price: "£35.00", sizes: ["S", "M", "L", "XL"], image: require("../assets/images/uniform.png") },
  { id: "2", name: "Coaches T-shirt", price: "£20.00", sizes: ["S", "M", "L", "XL"], image: require("../assets/images/uniform.png") },
  { id: "3", name: "Coaches T-shirt", price: "£25.00", sizes: ["S", "M", "L", "XL"], image: require("../assets/images/uniform.png") },
  { id: "4", name: "Coaches T-shirt", price: "£25.00", sizes: ["S", "M", "L", "XL"], image: require("../assets/images/uniform.png") },
  { id: "5", name: "Coaches T-shirt", price: "£25.00", sizes: ["S", "M", "L", "XL"], image: require("../assets/images/uniform.png") },
  { id: "6", name: "Coaches T-shirt", price: "£25.00", sizes: ["S", "M", "L", "XL"], image: require("../assets/images/uniform.png") },
];

const TRAINING_COURSES = [
  {
    id: "1", title: "How to use this app", duration: "45 min",
    thumbnail: require("../assets/images/training1.png"), category: "Education", completed: false, status: "passed",
    videos: [
      { id: "1", title: "Welcome", duration: "2 minutes", thumbnail: require("../assets/images/app1.png"), category: "Onboarding", completed: false, status: "passed" },
      { id: "2", title: "Onboarding", duration: "8 minutes", thumbnail: require("../assets/images/app2.png"), category: "Training", completed: false, status: "retake" },
      { id: "3", title: "Welcome", duration: "2 minutes", thumbnail: require("../assets/images/app3.png"), category: "Introduction", completed: true, status: "passed" },
      { id: "4", title: "Training Session", duration: "8 minutes", thumbnail: require("../assets/images/app4.png"), category: "Coaching", completed: false, status: "pending" },
      { id: "5", title: "Welcome", duration: "2 minutes", thumbnail: require("../assets/images/app5.png"), category: "Coaching", completed: true, status: "passed" },
      { id: "6", title: "Onboarding", duration: "8 minutes", thumbnail: require("../assets/images/app6.png"), category: "Training", completed: false, status: "retake" },
    ],
  },
  {
    id: "2", title: "Coach Education", duration: "30 min",
    thumbnail: require("../assets/images/training2.png"), category: "Safety", completed: false, status: "retake",
    videos: [
      { id: "1", title: "Welcome", duration: "2 minutes", thumbnail: require("../assets/images/app1.png"), category: "Onboarding", completed: false, status: "passed" },
      { id: "2", title: "Onboarding", duration: "8 minutes", thumbnail: require("../assets/images/app2.png"), category: "Training", completed: false, status: "retake" },
      { id: "3", title: "Welcome", duration: "2 minutes", thumbnail: require("../assets/images/app3.png"), category: "Introduction", completed: true, status: "passed" },
      { id: "4", title: "Training Session", duration: "8 minutes", thumbnail: require("../assets/images/app4.png"), category: "Coaching", completed: false, status: "pending" },
      { id: "5", title: "Welcome", duration: "2 minutes", thumbnail: require("../assets/images/app5.png"), category: "Coaching", completed: true, status: "passed" },
      { id: "6", title: "Onboarding", duration: "8 minutes", thumbnail: require("../assets/images/app6.png"), category: "Training", completed: false, status: "retake" },
    ],
  },
  {
    id: "3", title: "Health and Safety", duration: "60 min",
    thumbnail: require("../assets/images/training3.png"), category: "Compliance", completed: false, status: "retake",
    videos: [
      { id: "1", title: "Welcome", duration: "2 minutes", thumbnail: require("../assets/images/app1.png"), category: "Onboarding", completed: false, status: "passed" },
      { id: "2", title: "Onboarding", duration: "8 minutes", thumbnail: require("../assets/images/app2.png"), category: "Training", completed: false, status: "retake" },
      { id: "3", title: "Welcome", duration: "2 minutes", thumbnail: require("../assets/images/app3.png"), category: "Introduction", completed: true, status: "passed" },
      { id: "4", title: "Training Session", duration: "8 minutes", thumbnail: require("../assets/images/app4.png"), category: "Coaching", completed: false, status: "pending" },
      { id: "5", title: "Welcome", duration: "2 minutes", thumbnail: require("../assets/images/app5.png"), category: "Coaching", completed: true, status: "passed" },
      { id: "6", title: "Onboarding", duration: "8 minutes", thumbnail: require("../assets/images/app6.png"), category: "Training", completed: false, status: "retake" },
    ],
  },
  {
    id: "4", title: "Safeguarding", duration: "10 min",
    thumbnail: require("../assets/images/training4.png"), category: "Compliance", completed: true, status: "pending",
    videos: [
      { id: "1", title: "Welcome", duration: "2 minutes", thumbnail: require("../assets/images/app1.png"), category: "Onboarding", completed: false, status: "passed" },
      { id: "2", title: "Onboarding", duration: "8 minutes", thumbnail: require("../assets/images/app2.png"), category: "Training", completed: false, status: "retake" },
      { id: "3", title: "Welcome", duration: "2 minutes", thumbnail: require("../assets/images/app3.png"), category: "Introduction", completed: true, status: "passed" },
      { id: "4", title: "Training Session", duration: "8 minutes", thumbnail: require("../assets/images/app4.png"), category: "Coaching", completed: false, status: "pending" },
      { id: "5", title: "Welcome", duration: "2 minutes", thumbnail: require("../assets/images/app5.png"), category: "Coaching", completed: true, status: "passed" },
      { id: "6", title: "Onboarding", duration: "8 minutes", thumbnail: require("../assets/images/app6.png"), category: "Training", completed: false, status: "retake" },
    ],
  },
];

const ASSESSMENT_QUESTIONS = [
  {
    id: "1",
    question: "What is the purpose of the skill demonstrated in the video?",
    options: ["To score a goal", "To control the ball", "To pass the ball", "To tackle an opponent", "To perform a trick"],
    correct: 1,
  },
  {
    id: "2",
    question: "Which foot should you use when performing this drill?",
    options: ["Dominant foot only", "Both feet alternately", "Weaker foot only", "Either foot"],
    correct: 1,
  },
];

// ─────────────────────────────────────────────
// STYLES FACTORY
// ─────────────────────────────────────────────

const createStyles = (C) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.screenBg },
    backgroundImage: { flex: 1 },
    stepContainer: { flex: 1, backgroundColor: C.contractBg },
    stepFooter: { padding: 16, backgroundColor: C.contractBg },

    primaryBtn: { backgroundColor: "#2F5FE5", borderRadius: 15, paddingHorizontal: 60, paddingVertical: 15, alignItems: "center" },
    greenBtn: { backgroundColor: "#1BAC4B", borderRadius: 40, paddingHorizontal: 60, paddingVertical: 23, alignItems: "center" },
    redBtn: { backgroundColor: "#FF5252" },
    yellowBtn: { backgroundColor: "#F7D02A", borderRadius: 40, paddingHorizontal: 70, paddingVertical: 18, alignItems: "center" },
    primaryBtnDisabled: { backgroundColor: '#2f5fe575' },
    primaryBtnText: { color: '#FFF', fontFamily: 'Urbanist_700Bold', fontSize: 16 },
    yellowBtnText: { color: '#000', fontFamily: 'Urbanist_700Bold', fontSize: 16 },

    // Task Panel Overlay
    taskPanelOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.65)", zIndex: 100, justifyContent: "flex-end" },
    taskPanel: { backgroundColor: C.darkCard, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "70%" },
    taskPanelHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
    taskPanelTitle: { color: C.textPrimary, fontSize: 16, fontFamily: 'Urbanist_700Bold' },
    taskPanelClose: { color: C.textSecondary, fontSize: 20 },

    // Task List
    taskList: { gap: 10 },
    taskItem: { flexDirection: "row", alignItems: "center", backgroundColor: C.surface, borderRadius: 12, padding: 12, gap: 12, borderWidth: 1, borderColor: C.border },
    taskItemActive: { borderColor: C.primary, backgroundColor: "rgba(245,197,24,0.07)" },
    taskIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.surface, justifyContent: "center", alignItems: "center" },
    taskIconActive: { backgroundColor: C.primary },
    taskIconDone: { backgroundColor: C.success },
    taskIcon: { width: 20, height: 20 },
    taskTitle: { color: C.textSecondary, fontSize: 14, fontFamily: 'Urbanist_600SemiBold' },
    taskTitleActive: { color: C.textPrimary },
    taskSub: { color: C.textSecondary, fontSize: 12, fontFamily: 'Urbanist_400Regular', marginTop: 2 },
    taskBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    taskBadgePending: { backgroundColor: C.border },
    taskBadgeActive: { backgroundColor: C.primary },
    taskBadgeDone: { backgroundColor: C.success },
    taskBadgeText: { fontSize: 10, color: "#fff", fontFamily: 'Urbanist_700Bold' },

    // Welcome
    welcomeHeroImage: { width: 115, height: 155 },
    welcomeContent: { flex: 1, flexDirection: "column", justifyContent: "flex-end", alignItems: "center", padding: 20, paddingBottom: 100 },
    welcomeGreeting: { color: "#fff", fontSize: 24, fontFamily: 'Urbanist_700Bold', paddingTop: 20 },
    welcomeBrand: { color: C.primary, fontSize: 24, fontFamily: 'Urbanist_700Bold', lineHeight: 32, marginBottom: 12, textAlign: "center" },
    welcomeBody: { fontFamily: 'Urbanist_500Medium', color: "#fdfdffd8", fontSize: 16, textAlign: "center", lineHeight: 21, marginBottom: 20 },
    welcomeOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.45)' },

    // Dashboard
    dashProgressCard: { flexDirection: "row", alignItems: "center", backgroundColor: C.darkCard, borderRadius: 32, padding: 14, marginHorizontal: 18, marginBottom: 16, gap: 14, borderWidth: 1, borderColor: C.border },
    dashCircleWrap: { width: 120, height: 120, justifyContent: "center", alignItems: "center", position: "relative" },
    dashCircleLabel: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" },
    dashCirclePercent: { color: C.textPrimary, fontSize: 24, fontFamily: 'Urbanist_700Bold' },
    dashProgressTitle: { color: C.textPrimary, fontSize: 19, fontFamily: 'Urbanist_700Bold', lineHeight: 25 },
    dashProgressSub: { color: C.textSecondary, fontSize: 16, fontFamily: 'Urbanist_400Regular', marginTop: 10 },
    dashSectionLabel: { color: C.textPrimary, fontSize: 20, fontFamily: 'Urbanist_700Bold', letterSpacing: 1.2, paddingHorizontal: 18, marginBottom: 10 },
    dashTaskList: { paddingHorizontal: 18, gap: 10 },
    dashTaskRow: { flexDirection: "row", alignItems: "center", backgroundColor: C.darkCard, borderRadius: 14, padding: 13, gap: 12, borderWidth: 1, borderColor: C.border, marginBottom: 10 },
    dashTaskIcon: { width: 50, height: 50, borderRadius: 21, justifyContent: "center", alignItems: "center" },
    dashTaskTitle: { color: C.textPrimary, fontSize: 20, fontFamily: 'Urbanist_600SemiBold' },
    dashTaskDur: { color: C.textSecondary, fontSize: 14, fontFamily: 'Urbanist_400Regular', marginTop: 2 },
    dashBadge: { backgroundColor: C.primary, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
    dashBadgeDone: { backgroundColor: C.success },
    dashBadgeText: { color: C.dark, fontSize: 10, fontFamily: 'Urbanist_700Bold' },
    dashBadgeTextDone: { color: '#fff' },

    // Contract / shared header
    contractHeader: { flexDirection: "row", alignItems: "center", padding: 14, borderBottomWidth: 0.5, borderBottomColor: C.contractBorderBottom, backgroundColor: C.contractHeaderBg, gap: 10 },
    backArrow: { fontSize: 20, color: C.textPrimary },
    contractHeaderTitle: { flex: 1, fontSize: 22, fontFamily: 'Urbanist_700Bold', color: C.contractTitleText },
    pendingBadge: { backgroundColor: C.pendingBadgeBg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
    pendingBadgeText: { fontSize: 13, fontFamily: 'Urbanist_700Bold', color: C.pendingBadgeText },
    contractBtnRow: { flexDirection: "row", gap: 8, padding: 10, borderBottomWidth: 0.5, borderBottomColor: C.contractBorderBottom, backgroundColor: C.contractBtnRowBg },
    contractBtn: { backgroundColor: "#2F5FE5", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 },
    contractBtnText: { color: "#fff", fontSize: 13, fontFamily: 'Urbanist_600SemiBold' },
    contractScroll: { flex: 1, paddingHorizontal: 18, paddingTop: 18 },
    contractDocTitle: { fontSize: 16, fontFamily: 'Urbanist_700Bold', color: C.contractTitleText, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.3 },
    contractIntroRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginBottom: 6 },
    contractNameInput: { borderWidth: 1, borderColor: C.contractNameInputBorder, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, fontSize: 13, width: 80, color: C.contractNameInputText, backgroundColor: C.contractNameInputBg },
    contractBody: { color: C.contractBodyText, fontSize: 14, fontFamily: 'Urbanist_400Regular', lineHeight: 25 },
    contractSection: { marginBottom: 18, marginTop: 10 },
    contractHeading: { fontSize: 17, fontFamily: 'Urbanist_700Bold', color: C.contractTitleText, marginBottom: 6 },
    checkRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14, marginTop: 8, marginBottom: 20 },
    checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: C.checkboxBorder, justifyContent: "center", alignItems: "center", marginTop: 1 },
    checkboxChecked: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
    checkMark: { color: "#fff", fontWeight: "800", fontSize: 13 },
    checkLabel: { color: C.checkLabel, fontSize: 13, fontFamily: 'Urbanist_400Regular', flex: 1, lineHeight: 25 },

    // Qualifications
    qualIntro: { fontSize: 15, color: C.qualIntro, fontFamily: 'Urbanist_400Regular', marginBottom: 16 },
    qualFieldLabel: { fontSize: 14, fontFamily: 'Urbanist_700Bold', color: C.qualFieldLabel, marginBottom: 6 },
    uploadField: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: C.uploadFieldBorder, borderRadius: 8, padding: 10, backgroundColor: C.uploadFieldBg, marginBottom: 6 },
    uploadFieldFilled: { borderColor: "#bbb" },
    uploadFieldText: { flex: 1, fontSize: 13, fontFamily: 'Urbanist_400Regular', color: C.uploadFieldText },
    uploadIcon: { height: 20, width: 20 },
    notPossessRow: { flexDirection: "row", alignItems: "center", justifyContent: 'flex-start', gap: 4, marginBottom: 16 },
    notPossessText: { fontSize: 12, marginRight: 10, fontFamily: 'Urbanist_700Bold', color: C.notPossessText },
    npCheckbox: { width: 16, height: 16, borderWidth: 1.5, borderColor: "#bbb", borderRadius: 3, justifyContent: "center", alignItems: "center" },
    npCheckboxChecked: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
    npCheckMark: { color: "#fff", fontSize: 10, fontWeight: "700" },
    notesInput: { borderWidth: 1, borderColor: C.notesInputBorder, borderRadius: 8, padding: 10, backgroundColor: C.notesInputBg, fontSize: 13, color: C.notesInputText, marginBottom: 18, minHeight: 48 },
    uploadBtn: { backgroundColor: "#2563EB", borderRadius: 10, padding: 15, alignItems: "center" },
    uploadBtnText: { color: "#fff", fontSize: 15, fontFamily: 'Urbanist_600SemiBold' },

    // Uniform
    uniformNotice: { fontSize: 15, color: C.uniformNotice, fontFamily: 'Urbanist_400Regular', lineHeight: 22, marginBottom: 14 },
    uniformGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    uniformGridItem: { width: "47%" },
    uniformGridImage: { width: "100%", aspectRatio: 1, backgroundColor: C.surface, marginBottom: 6 },
    uniformGridName: { fontSize: 13, fontFamily: 'Urbanist_500Medium', color: C.uniformGridName, marginBottom: 2 },
    uniformGridPrice: { fontSize: 13, fontFamily: 'Urbanist_700Bold', color: C.uniformGridPrice, marginBottom: 6 },
    sizeRow: { flexDirection: "row", gap: 6 },
    sizeBtn: { width: 34, height: 30, borderRadius: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, justifyContent: "center", alignItems: "center" },
    sizeBtnActive: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
    sizeBtnText: { color: C.textSecondary, fontSize: 12, fontFamily: 'Urbanist_600SemiBold' },
    sizeBtnTextActive: { color: "#fff" },

    // Training
    searchBar: { flexDirection: "row", alignItems: "center", gap: 8, margin: 10, borderWidth: 1, borderColor: C.searchBarBorder, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: C.searchBarBg },
    searchInput: { flex: 1, fontSize: 14, fontFamily: 'Urbanist_400Regular', color: C.searchInputText },
    searchIcon: { width: 20, height: 20 },
    courseListCard: { borderRadius: 20, overflow: "hidden", marginBottom: 8, height: 150 },
    courseListImage: { flex: 1, justifyContent: "flex-end" },
    courseListOverlay: { backgroundColor: "rgba(0, 0, 0, 0.29)", padding: 20, justifyContent: "flex-end", height: "100%" },
    courseListTitle: { color: "#fff", fontSize: 24, fontFamily: 'Urbanist_700Bold', marginBottom: 2, textShadowColor: 'rgba(24, 23, 23, 0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
    courseListMeta: { color: "rgba(255,255,255,0.8)", fontFamily: 'Urbanist_500Medium', fontSize: 14 },
    courseListBadgeWrap: { position: "absolute", top: 8, right: 8 },
    courseBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
    courseBadgePending: { backgroundColor: "#F7D02A" },
    courseBadgePassed: { backgroundColor: "#22c55e" },
    courseBadgeRetake: { backgroundColor: "#ef4444" },
    courseBadgeText: { fontSize: 14, fontFamily: 'Urbanist_700Bold', color: "#fff" },
    videoGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between', gap: 20, padding: 10 },
    videoGridThumb: { width: "47%", borderRadius: 18, overflow: "hidden" },
    videoGridImage: { width: '100%', height: 180, justifyContent: "flex-end" },
    videoGridOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.2)" },
    playBtnSmall: { width: 50, height: 50, borderRadius: 25, backgroundColor: "rgba(0,0,0,0.16)", justifyContent: "center", alignItems: "center" },
    videoGridLabel: { color: "#fff", fontSize: 18, fontFamily: 'Urbanist_700Bold', paddingHorizontal: 6 },
    videoGridDur: { color: "rgba(255,255,255,0.8)", fontSize: 10, fontFamily: 'Urbanist_500Medium', paddingHorizontal: 6, paddingBottom: 6 },
    darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.26)', borderRadius: 12 },

    // Assessment
    timerBar: { backgroundColor: C.timerBarBg, padding: 13, alignItems: "center" },
    timerText: { fontSize: 16, color: C.timerText, fontFamily: 'Urbanist_700Bold' },
    qLabel: { color: C.qLabel, fontSize: 16, fontFamily: 'Urbanist_600SemiBold', marginBottom: 6 },
    qText: { color: C.qText, fontSize: 24, fontFamily: 'Urbanist_700Bold', lineHeight: 27, marginVertical: 26 },
    assessOption: { borderWidth: 1, borderColor: C.assessOptionBorder, borderRadius: 8, padding: 15, alignItems: "center", marginBottom: 14, backgroundColor: C.assessOptionBg },
    assessOptionSelected: { borderColor: C.assessOptionSelectedBorder, backgroundColor: C.assessOptionSelectedBg },
    assessOptionText: { fontSize: 18, color: C.assessOptionText, fontFamily: 'Urbanist_700Bold' },
    assessOptionTextSelected: { color: C.assessOptionSelectedText, fontWeight: "500" },

    // Results
    resultContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, backgroundColor: C.contractBg },
    resultCircle: { justifyContent: "center", alignItems: "center", marginBottom: 20 },
    resultCirclePass: { marginVertical: 10 },
    resultCircleFail: {},
    resultTitle: { color: '#1BAC4B', fontSize: 24, fontFamily: 'Urbanist_700Bold', marginBottom: 10, textAlign: "center" },
    resultTitleFail: { color: '#FF5252' },
    resultSub: { color: C.resultSubText, fontSize: 16, fontFamily: 'Urbanist_400Regular', lineHeight: 21, textAlign: "center" },
    avatar: { width: 160, height: 160 },
  });

// ─────────────────────────────────────────────
// TASK LIST COMPONENT
// ─────────────────────────────────────────────

const TaskList = ({ tasks, completedTasks = {}, currentTaskIndex, onSelect, styles, COLORS }) => (
  <View style={styles.taskList}>
    {tasks.map((task, i) => {
      const isDone = !!completedTasks[task.id];
      const isActive = i === currentTaskIndex;
      return (
        <TouchableOpacity
          key={task.id}
          style={[styles.taskItem, isActive && styles.taskItemActive]}
          onPress={() => onSelect(i)}
          activeOpacity={0.75}
        >
          <View style={[styles.taskIconWrap, isDone && styles.taskIconDone, isActive && styles.taskIconActive]}>
            {isDone ? (
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>✓</Text>
            ) : (
              <Image source={task.icon} style={styles.taskIcon} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.taskTitle, isActive && styles.taskTitleActive]}>{task.title}</Text>
            <Text style={styles.taskSub}>{task.subtitle}</Text>
          </View>
          <View style={[styles.taskBadge, isDone ? styles.taskBadgeDone : isActive ? styles.taskBadgeActive : styles.taskBadgePending]}>
            <Text style={styles.taskBadgeText}>{isDone ? "Done" : isActive ? "Now" : "Pending"}</Text>
          </View>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ─────────────────────────────────────────────
// DASHBOARD STEP
// ─────────────────────────────────────────────

const TaskDashboardStep = ({ coachName = "Ethan", completedTasks = {}, onSelectTask, onStart, styles, COLORS }) => {
  const circumference = 2 * Math.PI * 23;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 4) * 100);

  return (
    <ImageBackground source={require('../assets/images/Login.png')} resizeMode="cover" style={{ flex: 1 }}>
      <OnboardingHeader />
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={{ paddingHorizontal: 18, paddingBottom: 17 }}>
            <Text style={{ color: COLORS.textPrimary, fontSize: 32, fontFamily: 'Urbanist_700Bold' }}>
              Morning, {coachName} 👋
            </Text>
          </View>

          <View style={styles.dashProgressCard}>
            <View style={styles.dashCircleWrap}>
              <Svg width={110} height={110} viewBox="0 0 58 58">
                <Circle cx="29" cy="29" r="23" fill="none" stroke={COLORS.border} strokeWidth="5" />
                <Circle
                  cx="29" cy="29" r="23" fill="none"
                  stroke={COLORS.primary} strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * progressPercent) / 100}
                  strokeLinecap="round" transform="rotate(-90 29 29)"
                />
              </Svg>
              <View style={styles.dashCircleLabel}>
                <Text style={styles.dashCirclePercent}>{progressPercent}%</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashProgressTitle}>
                {progressPercent === 100 ? "Awesome! You've\ncompleted all tasks." : "Wow! You're nearly\nready to get going."}
              </Text>
              <Text style={styles.dashProgressSub}>{completedCount} of 4 completed!</Text>
            </View>
          </View>

          <Text style={styles.dashSectionLabel}>Onboarding Tasks (4)</Text>

          <View style={styles.dashTaskList}>
            {DASHBOARD_TASKS.map((task, index) => {
              const isDone = !!completedTasks[task.id];
              return (
                <TouchableOpacity key={task.id} style={styles.dashTaskRow} onPress={() => onSelectTask(index)} activeOpacity={0.8}>
                  <View style={[styles.dashTaskIcon, { backgroundColor: isDone ? COLORS.success : task.color }]}>
                    {isDone ? (
                      <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>✓</Text>
                    ) : (
                      <Image source={task.icon} style={styles.taskIcon} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dashTaskTitle}>{task.title}</Text>
                    <Text style={styles.dashTaskDur}>{task.duration}</Text>
                  </View>
                  <View style={[styles.dashBadge, isDone ? styles.dashBadgeDone : null]}>
                    <Text style={[styles.dashBadgeText, isDone ? styles.dashBadgeTextDone : null]}>
                      {isDone ? "Completed" : "Pending"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.stepFooter}>
          <TouchableOpacity style={styles.yellowBtn} onPress={onStart} activeOpacity={0.85}>
            <Text style={styles.yellowBtnText}>
              {progressPercent === 100 ? "Finish Onboarding" : "Get started"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

// ─────────────────────────────────────────────
// WELCOME STEP
// ─────────────────────────────────────────────

const WelcomeStep = ({ coachName = "Ethan", onStart, styles, COLORS }) => (
  <ImageBackground source={require("../assets/images/coach4.png")} style={styles.backgroundImage} resizeMode="cover">
    <View style={styles.welcomeOverlay} />
    <View style={styles.welcomeContent}>
      <Image source={require("../assets/images/sslogo.png")} style={styles.welcomeHeroImage} resizeMode="cover" />
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

// ─────────────────────────────────────────────
// QUALIFICATIONS STEP
// ─────────────────────────────────────────────

const QualificationsStep = ({ onNext, onComplete, onBack, isCompleted, styles, COLORS, token,userId }) => {
  const [files, setFiles] = useState({});       // { fa_level_1: {name, uri, mimeType}, ... }
  const [notPossess, setNotPossess] = useState({});
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
console.log('userId',userId)

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
                <Image source={require('../assets/images/Upload2.png')} style={styles.uploadIcon} />
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

// ─────────────────────────────────────────────
// TRAINING STEP
// ─────────────────────────────────────────────
const TrainingStep = ({ onComplete, onBack, isCompleted, styles, COLORS, authToken }) => {
  const [view, setView] = useState('list');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qIndex]: selectedOptionText }
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(643);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.grabbite.com/api/coachpro/courses/listing", {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const rawText = await response.text();
      if (!response.ok) throw new Error(`Failed to load courses (${response.status}): ${rawText}`);

      const json = JSON.parse(rawText);
      if (!json.status) throw new Error(json.message || "Failed to load courses");

      setCourses(json.data || []);
    } catch (e) {
      console.error('fetchCourses error:', e);
      setError(e.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (view !== 'assessment' || showResult) return;
    const t = setInterval(() => setTimeLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [view, showResult]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Flatten every module's uploadFiles into one "videos" list for display
  const getMediaItems = (course) => {
    if (!course?.modules) return [];
    return course.modules.flatMap((mod) =>
      (mod.uploadFiles || []).map((file) => ({
        title: file.originalName,
        duration: file.durationText || '—',
        isVideo: file.mimeType?.startsWith('video'),
        thumbnail: { uri: file.url }, // images render directly; videos show url as poster fallback
        url: file.url,
        moduleTitle: mod.title,
      }))
    );
  };

  const questions = selectedCourse?.questions || [];
  const passingValue = selectedCourse?.passingConditionValue ?? 70;

  // Score by comparing selected option TEXT to the answer TEXT (API gives strings, not indices)
  const score = questions.filter((q, i) => answers[i] === q.answer).length;
  const scorePercent = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const passed = scorePercent >= passingValue;

  const filteredCourses = courses.filter((c) =>
    (c.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (view === 'list') return (
    <View style={styles.stepContainer}>
      <View style={styles.contractHeader}>
        <TouchableOpacity onPress={onBack}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
        <Text style={styles.contractHeaderTitle}>Training</Text>
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

      <View style={styles.searchBar}>
        <Image source={require('../assets/images/search-01.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search course..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <Text style={{ color: COLORS.textSecondary, padding: 16 }}>Loading courses…</Text>
      ) : error ? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: COLORS.error, marginBottom: 8 }}>{error}</Text>
          <TouchableOpacity style={styles.contractBtn} onPress={fetchCourses}>
            <Text style={styles.contractBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredCourses.length === 0 ? (
        <Text style={{ color: COLORS.textSecondary, padding: 16 }}>No courses found.</Text>
      ) : (
        <ScrollView style={{ flex: 1, paddingHorizontal: 12, paddingTop: 8 }}>
          {filteredCourses.map((course) => {
            const media = getMediaItems(course);
            const firstThumb = media.find((m) => !m.isVideo)?.thumbnail
              || require('../assets/images/training1.png');

            // Note: API doesn't currently return per-user pass/retake status here.
            // Treat compulsory + not-yet-attempted as "Pending" until you have a
            // completion-status endpoint to merge in.
            const status = 'pending';

            return (
              <TouchableOpacity
                key={course.id}
                style={styles.courseListCard}
                onPress={() => { setSelectedCourse(course); setView('videos'); }}
                activeOpacity={0.85}
              >
                <ImageBackground source={firstThumb} style={styles.courseListImage} resizeMode="cover">
                  <View style={styles.courseListOverlay}>
                    <Text style={styles.courseListTitle}>{course.title}</Text>
                    <Text style={styles.courseListMeta}>
                      {media.length} item{media.length !== 1 ? 's' : ''} · {course.totalQuestions} question{course.totalQuestions !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={styles.courseListBadgeWrap}>
                    <View style={[
                      styles.courseBadge,
                      status === 'passed' ? styles.courseBadgePassed :
                        status === 'retake' ? styles.courseBadgeRetake :
                          styles.courseBadgePending,
                    ]}>
                      <Text style={styles.courseBadgeText}>
                        {status === 'passed' ? 'Passed' : status === 'retake' ? 'Retake' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 16 }} />
        </ScrollView>
      )}
    </View>
  );

  if (view === 'videos') {
    const media = getMediaItems(selectedCourse);
    return (
      <View style={styles.stepContainer}>
        <View style={styles.contractHeader}>
          <TouchableOpacity onPress={() => setView('list')}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
          <Text style={styles.contractHeaderTitle}>{selectedCourse?.title}</Text>
        </View>

        <View style={styles.contractBtnRow}>
          <TouchableOpacity style={styles.contractBtn} onPress={() => setView('list')}>
            <Text style={styles.contractBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {!!selectedCourse?.description && (
            <Text style={{ color: COLORS.textSecondary, padding: 14 }}>{selectedCourse.description}</Text>
          )}
          <View style={styles.videoGrid}>
            {media.map((m, i) => (
              <TouchableOpacity key={i} style={styles.videoGridThumb} activeOpacity={0.85}>
                <ImageBackground source={m.thumbnail} style={styles.videoGridImage} resizeMode="cover">
                  <View style={styles.darkOverlay} />
                  <View style={styles.videoGridOverlay}>
                    <View style={styles.playBtnSmall}>
                      <Text style={{ color: '#fff', fontSize: 40 }}>{m.isVideo ? '▶' : '🖼'}</Text>
                    </View>
                  </View>
                  <View style={{ padding: 10 }}>
                    <Text style={styles.videoGridLabel}>{m.title}</Text>
                    <Text style={styles.videoGridDur}>{m.duration}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={{ padding: 12, backgroundColor: COLORS.contractBg }}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => { setView('assessment'); setTimeLeft(643); setCurrentQ(0); setAnswers({}); setShowResult(false); }}
          >
            <Text style={styles.primaryBtnText}>Start Assessment</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (view === 'assessment' && !showResult) {
    if (questions.length === 0) {
      return (
        <View style={styles.stepContainer}>
          <Text style={{ padding: 20, color: COLORS.textSecondary }}>No questions available for this course.</Text>
        </View>
      );
    }
    return (
      <View style={styles.stepContainer}>
        <View style={styles.contractHeader}>
          <TouchableOpacity onPress={() => setView('videos')}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
          <Text style={styles.contractHeaderTitle}>Assessment</Text>
        </View>

        <View style={styles.contractBtnRow}>
          <TouchableOpacity style={styles.contractBtn} onPress={() => setView('videos')}>
            <Text style={styles.contractBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerBar}>
          <Text style={styles.timerText}>Time remaining {formatTime(timeLeft)}</Text>
        </View>

        <View style={{ flex: 1, padding: 14 }}>
          <Text style={styles.qLabel}>Question {currentQ + 1}/{questions.length}</Text>
          <Text style={styles.qText}>{questions[currentQ].question}</Text>

          {questions[currentQ].options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.assessOption, answers[currentQ] === opt && styles.assessOptionSelected]}
              onPress={() => setAnswers((prev) => ({ ...prev, [currentQ]: opt }))}
              activeOpacity={0.8}
            >
              <Text style={[styles.assessOptionText, answers[currentQ] === opt && styles.assessOptionTextSelected]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ padding: 14, backgroundColor: COLORS.contractBg }}>
          <TouchableOpacity
            style={[styles.primaryBtn, answers[currentQ] === undefined && styles.primaryBtnDisabled]}
            onPress={answers[currentQ] !== undefined
              ? () => currentQ < questions.length - 1
                ? setCurrentQ(currentQ + 1)
                : setShowResult(true)
              : null}
          >
            <Text style={styles.primaryBtnText}>
              {currentQ < questions.length - 1 ? 'Next' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (view === 'assessment' && showResult) return (
    <View style={[styles.resultContainer]}>
      <View style={[styles.resultCircle, passed ? styles.resultCirclePass : styles.resultCircleFail]}>
        <Image
          source={passed ? require('../assets/images/congrats.png') : require('../assets/images/failed.png')}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>
      <Text style={[styles.resultTitle, !passed && styles.resultTitleFail]}>
        {passed ? 'Congratulations!' : 'Almost there!'}
      </Text>
      <Text style={styles.resultSub}>
        {passed
          ? "You've passed the assessment and completed all onboarding tasks."
          : `You scored ${score}/${questions.length} (${scorePercent}%). You need ${passingValue}% to pass.`}
      </Text>
      <TouchableOpacity
        style={[styles.greenBtn, { marginTop: 24 }, !passed && styles.redBtn]}
        onPress={passed
          ? onComplete
          : () => { setCurrentQ(0); setAnswers({}); setShowResult(false); }}
      >
        <Text style={styles.primaryBtnText}>
          {passed ? 'Go Back To Courses' : 'Retake Assessment'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return null;
};
// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────

export default function OnboardingScreen({ navigation, coachName = "Ethan" }) {
  const router = useRouter();
  const scheme = useColorScheme(); // triggers re-render on theme change
  const COLORS = scheme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  const styles = createStyles(COLORS);
  const { token, userId,  } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({
    "1": false, "2": false, "3": false, "4": false,
  });

  const sharedProps = { styles, COLORS };

  const handleSelectTask = (taskIndex) => setCurrentStep(taskIndex + 2);
  const handleBackToDashboard = () => setCurrentStep(1);
  const handleCompleteTask = (taskId) => {
    setCompletedTasks((prev) => ({ ...prev, [taskId]: true }));
    setCurrentStep(1);
  };
  const handleComplete = () => {
    if (navigation) navigation.navigate("Home");
    else router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[
      { flex: 1 },
      currentStep !== 1 && { backgroundColor: COLORS.screenBg }
    ]}>
      <StatusBar
        barStyle={scheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={COLORS.headerBg}
      />

      {currentStep > 1 && <Header />}

      {/* TASK PANEL OVERLAY */}
      {showTaskPanel && currentStep > 0 && (
        <View style={styles.taskPanelOverlay}>
          <View style={styles.taskPanel}>
            <View style={styles.taskPanelHeader}>
              <Text style={styles.taskPanelTitle}>Onboarding Tasks (4)</Text>
              <TouchableOpacity onPress={() => setShowTaskPanel(false)}>
                <Text style={styles.taskPanelClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <TaskList
              tasks={ONBOARDING_TASKS}
              completedTasks={completedTasks}
              currentTaskIndex={currentStep - 2}
              onSelect={(i) => { setCurrentStep(i + 2); setShowTaskPanel(false); }}
              {...sharedProps}
            />
          </View>
        </View>
      )}

      <View style={{ flex: 1 }}>
        {currentStep === 0 && <WelcomeStep coachName={coachName} onStart={() => setCurrentStep(1)} {...sharedProps} />}

        {currentStep === 1 && (
          <TaskDashboardStep
            coachName={coachName}
            completedTasks={completedTasks}
            onSelectTask={handleSelectTask}
            onStart={() => {
              const firstIncomplete = DASHBOARD_TASKS.findIndex((t) => !completedTasks[t.id]);
              if (firstIncomplete !== -1) handleSelectTask(firstIncomplete);
              else handleComplete();
            }}
            {...sharedProps}
          />
        )}

        {currentStep === 2 && (
          <ContractStep
            isCompleted={!!completedTasks["1"]}
            onComplete={() => handleCompleteTask("1")}
            onBack={handleBackToDashboard}
            {...sharedProps}
          />
        )}

        {currentStep === 3 && (
          <QualificationsStep
            isCompleted={!!completedTasks["2"]}
            onComplete={() => handleCompleteTask("2")}
            onBack={handleBackToDashboard}
            {...sharedProps}
            token={token}
            userId={userId}
          />
        )}

        {currentStep === 4 && (
          <UniformStep
            isCompleted={!!completedTasks["3"]}
            onComplete={() => handleCompleteTask("3")}
            onBack={handleBackToDashboard}
            {...sharedProps}
          />
        )}

        {currentStep === 5 && (
          <TrainingStep
            isCompleted={!!completedTasks["4"]}
            onComplete={() => handleCompleteTask("4")}
            onBack={handleBackToDashboard}
            {...sharedProps}
            authToken={token}
          />
        )}
      </View>
    </SafeAreaView>
  );
}