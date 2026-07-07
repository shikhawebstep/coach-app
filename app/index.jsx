import { useState, useEffect } from "react";
import {
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import CustomLoader from "@/components/common/CustomLoader";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─────────────────────────────────────────────────────────────
// THEME  (exact from screenshot)
// ─────────────────────────────────────────────────────────────
const C = {
  yellow:      "#F5C31D",
  bgDark:      "#1C1C1E",   // page bg
  bgCard:      "#2C2C2E",   // dark card
  bgCardInner: "#3A3A3C",   // inner card / input
  white:       "#FFFFFF",
  textWhite:   "#FFFFFF",
  textGrey:    "#AAABAD",
  textDark:    "#1C1C1E",
  badgePending:"#F5C31D",
  badgeDone:   "#4CAF50",
  green:       "#4CAF50",
  red:         "#FF453A",
  border:      "#3A3A3C",
  // task icon colours (from screenshot)
  iconRed:     "#FF453A",
  iconOrange:  "#FF9F0A",
  iconBlue:    "#0A84FF",
  iconGreen:   "#30D158",
};

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const TASKS = [
  {
    id:       "contract",
    label:    "Sign your contract",
    duration: "10 minutes",
    iconBg:   C.iconRed,
    icon:     "✏️",
  },
  {
    id:       "qualifications",
    label:    "Upload your qualifications",
    duration: "5 minutes",
    iconBg:   C.iconOrange,
    icon:     "⬆️",
  },
  {
    id:       "uniform",
    label:    "Purchase your uniform",
    duration: "5 minutes",
    iconBg:   C.iconBlue,
    icon:     "👕",
  },
  {
    id:       "training",
    label:    "Watch Training Courses",
    duration: "90 minutes",
    iconBg:   C.iconGreen,
    icon:     "▶️",
  },
];

const CONTRACT_CLAUSES = [
  {
    id: "background",
    title: "Background",
    body: "Samba Soccer Schools Ltd engages independent contractors to deliver football coaching sessions across its academy network. This agreement sets out the basis on which services will be provided.",
  },
  {
    id: "general",
    title: "General",
    body: "The Contractor agrees to deliver coaching sessions as scheduled, maintain professional standards, represent the Company values, and adhere to safeguarding policies at every session.",
  },
  {
    id: "payment",
    title: "Payment",
    body: "Payment will be processed within 14 days of an approved invoice. Session rates are confirmed in Schedule A. Expenses require prior written approval.",
  },
  {
    id: "ip",
    title: "Intellectual Property",
    body: "All session plans, materials, and content created during the engagement remain the intellectual property of Samba Soccer Schools Ltd unless otherwise agreed in writing.",
  },
  {
    id: "termination",
    title: "Termination",
    body: "Either party may terminate with 14 days written notice. The Company reserves the right to terminate immediately in cases of gross misconduct or safeguarding violations.",
  },
];

const QUALIFICATION_DOCS = [
  { id: "q1", label: "FA Level 1 Coaching Badge",  required: true },
  { id: "q2", label: "FA Level 2 Coaching Badge",  required: false },
  { id: "q3", label: "First Aid Certificate",       required: true },
  { id: "q4", label: "Enhanced DBS Check",          required: true },
  { id: "q5", label: "Public Liability Insurance",  required: true },
  { id: "q6", label: "UEFA B Licence",              required: false },
];

const UNIFORM_ITEMS = [
  { id: "u1", name: "Training Jacket",        price: "£35.00", sizes: ["XS","S","M","L","XL"], image: require("../assets/images/training1.png") },
  { id: "u2", name: "Training Shorts",        price: "£20.00", sizes: ["XS","S","M","L","XL"], image: require("../assets/images/training2.png") },
  { id: "u3", name: "Coach Polo Shirt",       price: "£25.00", sizes: ["XS","S","M","L","XL"], image: require("../assets/images/training3.png") },
  { id: "u4", name: "Training Socks (3 Pack)",price: "£12.00", sizes: ["S/M","M/L","L/XL"],    image: require("../assets/images/training4.png") },
];

const TRAINING_VIDEOS = [
  { id: "v1", title: "Coach Education",  category: "Education",  duration: "45 min", thumbnail: require("../assets/images/training1.png") },
  { id: "v2", title: "Health and Safety",category: "Safety",     duration: "30 min", thumbnail: require("../assets/images/training2.png") },
  { id: "v3", title: "Safeguarding",     category: "Compliance", duration: "60 min", thumbnail: require("../assets/images/training3.png") },
];

const ASSESSMENT_QS = [
  {
    id: "a1",
    question: "What is the purpose of the skill demonstrated in the video?",
    options: ["To score a goal","To control the ball","To pass the ball","To tackle an opponent","To perform a trick"],
    correct: 1,
  },
  {
    id: "a2",
    question: "Which coaching principle should always come first during a session?",
    options: ["Skill development","Player enjoyment","Safeguarding and safety","Tactical awareness"],
    correct: 2,
  },
];

// ─────────────────────────────────────────────────────────────
// SMALL HELPERS
// ─────────────────────────────────────────────────────────────

/** Yellow pill CTA */
const YellowBtn = ({ label, onPress, disabled }) => (
  <TouchableOpacity
    style={[s.yellowBtn, disabled && s.yellowBtnOff]}
    onPress={disabled ? null : onPress}
    activeOpacity={0.85}
  >
    <Text style={s.yellowBtnText}>{label}</Text>
  </TouchableOpacity>
);

/** Circular % ring (pure RN border trick) */
const RingProgress = ({ pct = 0, size = 90 }) => (
  <View style={[s.ring, { width: size, height: size, borderRadius: size / 2 }]}>
    {/* background ring */}
    <View
      style={[
        s.ringBg,
        { width: size, height: size, borderRadius: size / 2, borderWidth: size * 0.08 },
      ]}
    />
    {/* coloured arc — approximated with border-color trick for demo */}
    <View
      style={[
        s.ringFill,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: size * 0.08,
          borderColor: pct > 0 ? C.yellow : "transparent",
          opacity: pct > 0 ? 1 : 0,
        },
      ]}
    />
    {/* inner label */}
    <View
      style={[
        s.ringInner,
        {
          width: size - size * 0.16 - 8,
          height: size - size * 0.16 - 8,
          borderRadius: (size - size * 0.16 - 8) / 2,
        },
      ]}
    >
      <Text style={[s.ringPct, { fontSize: size * 0.22 }]}>{pct}%</Text>
    </View>
  </View>
);

// ─────────────────────────────────────────────────────────────
// MODAL TASK SCREENS
// ─────────────────────────────────────────────────────────────

/* CONTRACT */
const ContractTab = ({ onDone }) => {
  const [agreed, setAgreed] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      <View style={s.tabHeader}>
        <Text style={s.tabHeaderTag}>STEP 1 · INDEPENDENT CONTRACTOR AGREEMENT</Text>
        <Text style={s.tabHeaderTitle}>Sign your contract</Text>
      </View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 18 }} showsVerticalScrollIndicator={false}>
        {CONTRACT_CLAUSES.map((c) => (
          <View key={c.id} style={s.clauseCard}>
            <Text style={s.clauseTitle}>{c.title}</Text>
            <Text style={s.clauseBody}>{c.body}</Text>
          </View>
        ))}
        <TouchableOpacity
          style={[s.agreeRow, agreed && s.agreeRowOn]}
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.8}
        >
          <View style={[s.cb, agreed && s.cbOn]}>
            {agreed && <Text style={s.cbTick}>✓</Text>}
          </View>
          <Text style={s.agreeText}>
            I have read and agree to the Independent Contractor Agreement
          </Text>
        </TouchableOpacity>
        <View style={{ height: 10 }} />
      </ScrollView>
      <View style={s.tabFooter}>
        <YellowBtn label="Sign & Continue →" onPress={onDone} disabled={!agreed} />
      </View>
    </View>
  );
};

/* QUALIFICATIONS */
const QualificationsTab = ({ onDone }) => {
  const [uploads, setUploads] = useState({});
  const toggle = (id) => setUploads((p) => ({ ...p, [id]: !p[id] }));
  const required = QUALIFICATION_DOCS.filter((d) => d.required);
  const doneCount = required.filter((d) => uploads[d.id]).length;
  const canProceed = doneCount === required.length;
  return (
    <View style={{ flex: 1 }}>
      <View style={s.tabHeader}>
        <Text style={s.tabHeaderTag}>STEP 2 · DOCUMENTS</Text>
        <Text style={s.tabHeaderTitle}>Upload Qualifications</Text>
        <Text style={s.tabHeaderSub}>Tap each document to mark as uploaded</Text>
      </View>
      {/* progress */}
      <View style={{ paddingHorizontal: 18, marginBottom: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
          <Text style={s.smallGrey}>Required documents</Text>
          <Text style={s.smallGrey}>{doneCount}/{required.length}</Text>
        </View>
        <View style={s.trackBar}><View style={[s.trackFill, { width: `${(doneCount / required.length) * 100}%` }]} /></View>
      </View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 18 }} showsVerticalScrollIndicator={false}>
        {QUALIFICATION_DOCS.map((doc) => {
          const up = !!uploads[doc.id];
          return (
            <TouchableOpacity
              key={doc.id}
              style={[s.qualRow, up && s.qualRowDone]}
              onPress={() => toggle(doc.id)}
              activeOpacity={0.8}
            >
              <View style={[s.qualIconBox, { backgroundColor: up ? C.green : C.bgCardInner }]}>
                <Text style={{ fontSize: 20 }}>{up ? "✓" : "📎"}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.qualLabel}>{doc.label}</Text>
                <Text style={[s.qualReq, { color: doc.required ? C.red : C.textGrey }]}>
                  {doc.required ? "Required" : "Optional"}
                </Text>
              </View>
              <View style={[s.statusPill, { backgroundColor: up ? C.green : C.bgCardInner }]}>
                <Text style={[s.statusPillText, { color: up ? C.white : C.textGrey }]}>
                  {up ? "Done" : "Upload"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 16 }} />
      </ScrollView>
      <View style={s.tabFooter}>
        <YellowBtn label="Continue →" onPress={onDone} disabled={!canProceed} />
      </View>
    </View>
  );
};

/* UNIFORM */
const UniformTab = ({ onDone }) => {
  const [sizes, setSizes] = useState({});
  return (
    <View style={{ flex: 1 }}>
      <View style={s.tabHeader}>
        <Text style={s.tabHeaderTag}>STEP 3 · KIT ORDER</Text>
        <Text style={s.tabHeaderTitle}>Purchase your uniform</Text>
        <Text style={s.tabHeaderSub}>Select a size for each item</Text>
      </View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 18 }} showsVerticalScrollIndicator={false}>
        {UNIFORM_ITEMS.map((item) => (
          <View key={item.id} style={s.uniformCard}>
            <Image source={item.image} style={s.uniformImg} resizeMode="cover" />
            <View style={s.uniformInfo}>
              <Text style={s.uniformName}>{item.name}</Text>
              <Text style={s.uniformPrice}>{item.price}</Text>
              <View style={s.sizeRow}>
                {item.sizes.map((sz) => (
                  <TouchableOpacity
                    key={sz}
                    style={[s.sizeChip, sizes[item.id] === sz && s.sizeChipOn]}
                    onPress={() => setSizes((p) => ({ ...p, [item.id]: sz }))}
                  >
                    <Text style={[s.sizeText, sizes[item.id] === sz && s.sizeTextOn]}>{sz}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ))}
        <View style={{ height: 16 }} />
      </ScrollView>
      <View style={s.tabFooter}>
        <YellowBtn label="Continue →" onPress={onDone} />
      </View>
    </View>
  );
};

/* TRAINING */
const TrainingTab = ({ onDone }) => {
  const SUB = ["Videos", "How to use", "Assessment"];
  const [sub, setSub] = useState(0);
  const [playing, setPlaying] = useState(null);
  const [watched, setWatched] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const markWatched = (id) => {
    if (!watched.includes(id)) setWatched((p) => [...p, id]);
    setPlaying(null);
    setSub(2);
  };

  const score = ASSESSMENT_QS.filter((q, i) => answers[i] === q.correct).length;
  const pct   = Math.round((score / ASSESSMENT_QS.length) * 100);
  const pass  = pct >= 70;

  return (
    <View style={{ flex: 1 }}>
      <View style={s.tabHeader}>
        <Text style={s.tabHeaderTag}>STEP 4 · TRAINING</Text>
        <Text style={s.tabHeaderTitle}>Watch Training Courses</Text>
      </View>

      {/* sub tab bar */}
      <View style={s.subTabBar}>
        {SUB.map((t, i) => (
          <TouchableOpacity
            key={t}
            style={[s.subTab, sub === i && s.subTabOn]}
            onPress={() => setSub(i)}
          >
            <Text style={[s.subTabText, sub === i && s.subTabTextOn]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── VIDEOS ── */}
      {sub === 0 && !playing && (
        <ScrollView style={{ flex: 1, paddingHorizontal: 18 }} showsVerticalScrollIndicator={false}>
          {TRAINING_VIDEOS.map((v) => {
            const done = watched.includes(v.id);
            return (
              <TouchableOpacity
                key={v.id}
                style={[s.vidCard, done && { borderColor: C.green, borderWidth: 1.5 }]}
                onPress={() => setPlaying(v)}
                activeOpacity={0.85}
              >
                <View style={s.vidThumbWrap}>
                  <Image source={v.thumbnail} style={s.vidThumb} resizeMode="cover" />
                  <View style={s.vidOverlay}>
                    <View style={[s.playBtn, done && { backgroundColor: C.green }]}>
                      <Text style={s.playBtnText}>{done ? "✓" : "▶"}</Text>
                    </View>
                  </View>
                </View>
                <View style={s.vidMeta}>
                  <View style={s.vidCatPill}><Text style={s.vidCatText}>{v.category}</Text></View>
                  <Text style={s.vidTitle}>{v.title}</Text>
                  <Text style={s.vidDur}>⏱ {v.duration}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 16 }} />
        </ScrollView>
      )}

      {/* ── VIDEO PLAYER ── */}
      {sub === 0 && playing && (
        <ScrollView style={{ flex: 1 }}>
          <View style={s.playerWrap}>
            <Image source={playing.thumbnail} style={s.playerImg} resizeMode="cover" />
            <View style={s.playerOverlay}>
              <View style={s.bigPlay}><Text style={s.bigPlayText}>▶</Text></View>
            </View>
          </View>
          <View style={{ padding: 18 }}>
            <Text style={s.playerTitle}>{playing.title}</Text>
            <Text style={s.playerSub}>{playing.category} · {playing.duration}</Text>
            <Text style={s.playerDesc}>
              Watch this training video in full. You will be assessed on key techniques, safety guidelines, and best practice demonstrated.
            </Text>
            <YellowBtn label="Mark as Watched →" onPress={() => markWatched(playing.id)} />
          </View>
        </ScrollView>
      )}

      {/* ── HOW TO USE ── */}
      {sub === 1 && (
        <ScrollView style={{ flex: 1, padding: 18 }} showsVerticalScrollIndicator={false}>
          {[
            { icon: "📱", t: "Navigate the app",    b: "Use the bottom navigation bar to switch between your schedule, sessions, messages, and profile." },
            { icon: "📅", t: "View your sessions",  b: "All upcoming coaching sessions appear in the Schedule tab. Tap any session for full details." },
            { icon: "✅", t: "Mark attendance",      b: "At the start of each session tap 'Start Session' to check players in and trigger your payment." },
            { icon: "💬", t: "Message the team",    b: "Use the Messages tab to contact your coordinator or other coaches. Reply within 24 hours." },
          ].map((item, i) => (
            <View key={i} style={s.howCard}>
              <Text style={s.howIcon}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.howTitle}>{item.t}</Text>
                <Text style={s.howBody}>{item.b}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ── ASSESSMENT ── */}
      {sub === 2 && !submitted && (
        <View style={{ flex: 1, padding: 18 }}>
          <View style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
              <Text style={s.smallGrey}>Question {qIdx + 1} / {ASSESSMENT_QS.length}</Text>
            </View>
            <View style={s.trackBar}>
              <View style={[s.trackFill, { width: `${((qIdx + 1) / ASSESSMENT_QS.length) * 100}%` }]} />
            </View>
          </View>
          <Text style={s.questionText}>{ASSESSMENT_QS[qIdx].question}</Text>
          {ASSESSMENT_QS[qIdx].options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={[s.optRow, answers[qIdx] === i && s.optRowOn]}
              onPress={() => setAnswers((p) => ({ ...p, [qIdx]: i }))}
              activeOpacity={0.8}
            >
              <View style={[s.radio, answers[qIdx] === i && s.radioOn]} />
              <Text style={[s.optText, answers[qIdx] === i && s.optTextOn]}>{opt}</Text>
            </TouchableOpacity>
          ))}
          <View style={[s.tabFooter, { marginTop: 12 }]}>
            <YellowBtn
              label={qIdx < ASSESSMENT_QS.length - 1 ? "Next →" : "Submit →"}
              disabled={answers[qIdx] === undefined}
              onPress={() => {
                if (qIdx < ASSESSMENT_QS.length - 1) setQIdx((q) => q + 1);
                else setSubmitted(true);
              }}
            />
          </View>
        </View>
      )}

      {/* ── RESULT ── */}
      {sub === 2 && submitted && (
        <View style={s.resultWrap}>
          <View style={[s.resultRing, { borderColor: pass ? C.green : C.red }]}>
            <Text style={s.resultPct}>{pct}%</Text>
          </View>
          <Text style={s.resultTitle}>{pass ? "🎉 Congratulations!" : "Almost there!"}</Text>
          <Text style={s.resultSub}>
            {pass
              ? "You've passed the assessment. Welcome to the Samba team!"
              : `You scored ${score}/${ASSESSMENT_QS.length}. You need 70% to pass.`}
          </Text>
          <View style={{ width: "100%", paddingHorizontal: 24 }}>
            {pass
              ? <YellowBtn label="Finish Onboarding 🎉" onPress={onDone} />
              : <YellowBtn label="Retry" onPress={() => { setQIdx(0); setAnswers({}); setSubmitted(false); }} />
            }
          </View>
        </View>
      )}
    </View>
  );
};

// Map task id → tab component
const TAB_COMPONENTS = {
  contract:       ContractTab,
  qualifications: QualificationsTab,
  uniform:        UniformTab,
  training:       TrainingTab,
};

// ─────────────────────────────────────────────────────────────
// WELCOME SPLASH  (left screen in screenshot)
// ─────────────────────────────────────────────────────────────
const WelcomeSplash = ({ onGetStarted }) => (
  <View style={s.splashWrap}>
    <StatusBar barStyle="light-content" />
    {/* Hero image full-bleed */}
    <Image
      source={require("../assets/images/training1.png")}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    />
    {/* dark gradient overlay */}
    <View style={s.splashOverlay} />

    {/* Samba "S" badge */}
    <View style={s.splashBadge}>
      <Text style={s.splashBadgeLetter}>S</Text>
      <Text style={s.splashStars}>★ ★ ★</Text>
    </View>

    {/* Bottom text block */}
    <View style={s.splashBottom}>
      <Text style={s.splashWelcome}>Welcome to</Text>
      <Text style={s.splashBrand}>Samba Soccer Schools</Text>
      <Text style={s.splashSub}>We are thrilled to have you join us!</Text>
      <Text style={s.splashBody}>
        Before you take the pitch, there are{"\n"}
        a few essential onboarding tasks{"\n"}
        that must be completed.
      </Text>
      <YellowBtn label="Get started" onPress={onGetStarted} />
    </View>
  </View>
);

// ─────────────────────────────────────────────────────────────
// DASHBOARD  (right screen in screenshot)
// ─────────────────────────────────────────────────────────────
const Dashboard = ({ coachName, completedIds, onTaskPress, onGetStarted }) => {
  const done  = completedIds.length;
  const total = TASKS.length;
  const pct   = Math.round((done / total) * 100);

  return (
    <View style={{ flex: 1, backgroundColor: C.bgDark }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Greeting */}
        <View style={s.dashGreet}>
          <Text style={s.dashGreetName}>Morning, {coachName} 👋</Text>
        </View>

        {/* Progress card */}
        <View style={s.progressCard}>
          <RingProgress pct={pct} size={80} />
          <View style={s.progressCardText}>
            <Text style={s.progressCardTitle}>
              Wow! You're nearly{"\n"}ready to get going.
            </Text>
            <Text style={s.progressCardSub}>{done * 4} of {total * 4} completed!</Text>
          </View>
        </View>

        {/* Task list */}
        <Text style={s.taskListLabel}>Onboarding Tasks ({total})</Text>

        {TASKS.map((task, i) => {
          const isDone    = completedIds.includes(task.id);
          const isNext    = !isDone && completedIds.length === i;
          return (
            <TouchableOpacity
              key={task.id}
              style={s.taskCard}
              onPress={() => onTaskPress(task)}
              activeOpacity={0.85}
            >
              {/* coloured icon */}
              <View style={[s.taskIconBox, { backgroundColor: task.iconBg }]}>
                <Text style={s.taskIconText}>{task.icon}</Text>
              </View>

              {/* label */}
              <View style={s.taskMeta}>
                <Text style={s.taskLabel}>{task.label}</Text>
                <Text style={s.taskDur}>{task.duration}</Text>
              </View>

              {/* status badge */}
              <View style={[
                s.taskBadge,
                isDone ? s.taskBadgeDone : s.taskBadgePending,
              ]}>
                <Text style={[
                  s.taskBadgeText,
                  isDone ? { color: C.white } : { color: C.textDark },
                ]}>
                  {isDone ? "Done ✓" : "Pending"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sticky CTA */}
      <View style={s.dashFooter}>
        <YellowBtn
          label={done === total ? "Complete ✓" : "Get started"}
          onPress={onGetStarted}
        />
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────
export default function OnboardingScreen({ navigation, coachName = "Ethan" }) {
  const router = useRouter();
  const { isLoggedIn, isAuthLoading } = useAuth();

  const [screen, setScreen]         = useState("splash"); // 'splash' | 'dashboard'
  const [activeTask, setActiveTask] = useState(null);     // task object or null
  const [completed, setCompleted]   = useState([]);       // array of task ids

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isAuthLoading, isLoggedIn]);

  if (isAuthLoading || (!isAuthLoading && !isLoggedIn)) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bgDark, justifyContent: 'center', alignItems: 'center' }}>
        <CustomLoader size={80} color={C.yellow} />
      </View>
    );
  }

  const openTask  = (task) => setActiveTask(task);
  const closeTask = () => setActiveTask(null);

  const finishTask = () => {
    if (activeTask && !completed.includes(activeTask.id)) {
      setCompleted((p) => [...p, activeTask.id]);
    }
    setActiveTask(null);
  };

  const TabComponent = activeTask ? TAB_COMPONENTS[activeTask.id] : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bgDark }}>

      {/* ── SPLASH ── */}
      {screen === "splash" && (
        <WelcomeSplash onGetStarted={() => setScreen("dashboard")} />
      )}

      {/* ── DASHBOARD ── */}
      {screen === "dashboard" && (
        <Dashboard
          coachName={coachName}
          completedIds={completed}
          onTaskPress={openTask}
          onGetStarted={() => {
            // open the first pending task automatically
            const first = TASKS.find((t) => !completed.includes(t.id));
            if (first) openTask(first);
          }}
        />
      )}

      {/* ── TASK MODAL (slides up from bottom) ── */}
      <Modal
        visible={!!activeTask}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeTask}
      >
        <SafeAreaView style={s.modalSafe}>
          <StatusBar barStyle="light-content" />

          {/* modal drag bar + close */}
          <View style={s.modalTopBar}>
            <View style={s.modalHandle} />
            <TouchableOpacity style={s.modalClose} onPress={closeTask}>
              <Text style={s.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* task content */}
          {TabComponent && <TabComponent onDone={finishTask} />}
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({

  // ── Yellow button
  yellowBtn: {
    backgroundColor: C.yellow,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
  },
  yellowBtnOff: { backgroundColor: "#444" },
  yellowBtnText: {
    color: C.textDark,
    fontWeight: "800",
    fontSize: 16,
  },

  // ── Ring
  ring: { justifyContent: "center", alignItems: "center", position: "relative" },
  ringBg: {
    position: "absolute",
    borderColor: C.bgCardInner,
  },
  ringFill: {
    position: "absolute",
  },
  ringInner: {
    backgroundColor: C.bgCard,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  ringPct: { color: C.white, fontWeight: "800" },

  // ── Splash
  splashWrap: { flex: 1, justifyContent: "flex-end" },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  splashBadge: {
    position: "absolute",
    top: "35%",
    alignSelf: "center",
    alignItems: "center",
  },
  splashBadgeLetter: {
    fontSize: 90,
    fontWeight: "900",
    color: C.white,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  splashStars: {
    fontSize: 20,
    color: C.white,
    letterSpacing: 6,
    marginTop: -12,
  },
  splashBottom: {
    paddingHorizontal: 28,
    paddingBottom: 48,
    alignItems: "center",
  },
  splashWelcome: {
    color: C.white,
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 4,
  },
  splashBrand: {
    color: C.yellow,
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  splashSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    marginBottom: 8,
  },
  splashBody: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },

  // ── Dashboard
  dashGreet: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
  },
  dashGreetName: {
    color: C.white,
    fontSize: 26,
    fontWeight: "900",
  },
  progressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCard,
    marginHorizontal: 18,
    borderRadius: 16,
    padding: 18,
    gap: 18,
    marginBottom: 22,
  },
  progressCardText: { flex: 1 },
  progressCardTitle: {
    color: C.white,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
    marginBottom: 4,
  },
  progressCardSub: {
    color: C.textGrey,
    fontSize: 13,
  },
  taskListLabel: {
    color: C.textGrey,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 18,
    marginBottom: 10,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCard,
    marginHorizontal: 18,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  taskIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  taskIconText: { fontSize: 22 },
  taskMeta: { flex: 1 },
  taskLabel: {
    color: C.white,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  taskDur: { color: C.textGrey, fontSize: 12 },
  taskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  taskBadgePending: { backgroundColor: C.yellow },
  taskBadgeDone:    { backgroundColor: C.green },
  taskBadgeText:    { fontSize: 12, fontWeight: "700" },
  dashFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.bgDark,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },

  // ── Modal
  modalSafe: {
    flex: 1,
    backgroundColor: C.bgDark,
  },
  modalTopBar: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: C.bgCard,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.border,
    marginBottom: 6,
  },
  modalClose: {
    position: "absolute",
    right: 16,
    top: 10,
    padding: 6,
  },
  modalCloseText: {
    color: C.textGrey,
    fontSize: 18,
    fontWeight: "700",
  },

  // ── Tab header
  tabHeader: {
    backgroundColor: C.bgCard,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 10,
  },
  tabHeaderTag: {
    color: C.yellow,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  tabHeaderTitle: {
    color: C.white,
    fontSize: 20,
    fontWeight: "900",
  },
  tabHeaderSub: {
    color: C.textGrey,
    fontSize: 13,
    marginTop: 3,
  },
  tabFooter: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: C.bgDark,
  },

  // ── Progress track
  trackBar: {
    height: 6,
    backgroundColor: C.bgCardInner,
    borderRadius: 3,
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    backgroundColor: C.yellow,
    borderRadius: 3,
  },
  smallGrey: { color: C.textGrey, fontSize: 12, fontWeight: "600" },

  // ── Contract
  clauseCard: {
    backgroundColor: C.bgCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  clauseTitle: {
    color: C.yellow,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  clauseBody: { color: C.textGrey, fontSize: 13, lineHeight: 20 },
  agreeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: C.bgCard,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    padding: 14,
    marginTop: 6,
  },
  agreeRowOn: { borderColor: C.green, backgroundColor: "rgba(76,175,80,0.07)" },
  cb: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: C.border,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  cbOn: { backgroundColor: C.green, borderColor: C.green },
  cbTick: { color: C.white, fontSize: 13, fontWeight: "900" },
  agreeText: { flex: 1, color: C.textGrey, fontSize: 13, lineHeight: 20 },

  // ── Qualifications
  qualRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
  },
  qualRowDone: { borderColor: C.green },
  qualIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  qualLabel:  { color: C.white, fontSize: 14, fontWeight: "600" },
  qualReq:    { fontSize: 11, marginTop: 2, fontWeight: "600" },
  statusPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusPillText: { fontSize: 11, fontWeight: "700" },

  // ── Uniform
  uniformCard: {
    flexDirection: "row",
    backgroundColor: C.bgCard,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  uniformImg:  { width: 110, height: 120 },
  uniformInfo: { flex: 1, padding: 12 },
  uniformName: { color: C.white, fontSize: 15, fontWeight: "700", marginBottom: 4 },
  uniformPrice:{ color: C.yellow, fontSize: 15, fontWeight: "800", marginBottom: 10 },
  sizeRow:     { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  sizeChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: C.bgCardInner,
    borderWidth: 1,
    borderColor: C.border,
  },
  sizeChipOn:  { backgroundColor: C.yellow, borderColor: C.yellow },
  sizeText:    { fontSize: 12, fontWeight: "700", color: C.textGrey },
  sizeTextOn:  { color: C.textDark },

  // ── Sub tab bar (Training)
  subTabBar: {
    flexDirection: "row",
    backgroundColor: C.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingHorizontal: 8,
  },
  subTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  subTabOn:      { borderBottomColor: C.yellow },
  subTabText:    { fontSize: 13, fontWeight: "600", color: C.textGrey },
  subTabTextOn:  { color: C.white, fontWeight: "800" },

  // ── Video cards
  vidCard: {
    backgroundColor: C.bgCard,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  vidThumbWrap: { height: 150, position: "relative" },
  vidThumb:     { width: "100%", height: "100%" },
  vidOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  playBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.yellow,
    justifyContent: "center",
    alignItems: "center",
  },
  playBtnText: { color: C.textDark, fontSize: 18, fontWeight: "800", marginLeft: 3 },
  vidMeta:     { padding: 12 },
  vidCatPill: {
    alignSelf: "flex-start",
    backgroundColor: C.bgCardInner,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 6,
  },
  vidCatText:  { fontSize: 10, fontWeight: "700", color: C.textGrey, textTransform: "uppercase", letterSpacing: 0.5 },
  vidTitle:    { color: C.white, fontSize: 15, fontWeight: "700", marginBottom: 3 },
  vidDur:      { color: C.textGrey, fontSize: 12 },

  // ── Video player
  playerWrap: { height: 210, position: "relative", backgroundColor: "#000" },
  playerImg:  { width: "100%", height: "100%" },
  playerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  bigPlay: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: C.yellow,
    justifyContent: "center",
    alignItems: "center",
  },
  bigPlayText: { color: C.textDark, fontSize: 26, fontWeight: "800", marginLeft: 4 },
  playerTitle: { color: C.white, fontSize: 18, fontWeight: "800", marginTop: 14, marginBottom: 4 },
  playerSub:   { color: C.textGrey, fontSize: 13, marginBottom: 10 },
  playerDesc:  { color: C.textGrey, fontSize: 13, lineHeight: 20, marginBottom: 18 },

  // ── How to use
  howCard: {
    flexDirection: "row",
    backgroundColor: C.bgCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
    alignItems: "flex-start",
  },
  howIcon:  { fontSize: 26, marginTop: 2 },
  howTitle: { color: C.white, fontSize: 14, fontWeight: "700", marginBottom: 4 },
  howBody:  { color: C.textGrey, fontSize: 13, lineHeight: 19 },

  // ── Assessment
  questionText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 24,
    marginBottom: 16,
  },
  optRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    gap: 12,
  },
  optRowOn:   { borderColor: C.yellow, backgroundColor: "rgba(245,195,29,0.07)" },
  radio:      { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.border },
  radioOn:    { borderColor: C.yellow, backgroundColor: C.yellow },
  optText:    { color: C.textGrey, fontSize: 14, flex: 1 },
  optTextOn:  { color: C.white, fontWeight: "600" },

  // ── Result
  resultWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    padding: 32,
  },
  resultRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 7,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: C.bgCard,
  },
  resultPct:   { fontSize: 28, fontWeight: "900", color: C.white },
  resultTitle: { fontSize: 22, fontWeight: "900", color: C.white, textAlign: "center" },
  resultSub:   { fontSize: 14, color: C.textGrey, textAlign: "center", lineHeight: 21 },
});