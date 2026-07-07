// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

export const ONBOARDING_TASKS = [
  {
    id: "1",
    title: "Sign your contract",
    subtitle: "Independent Contractor Agreement",
    status: "pending",
    icon: require("@/assets/images/edit.png"),
  },
  {
    id: "2",
    title: "Upload your qualifications",
    subtitle: "Certificates & coaching badges",
    status: "pending",
    icon: require("@/assets/images/Upload.png"),
  },
  {
    id: "3",
    title: "Purchase your uniform",
    subtitle: "Order your official kit",
    status: "pending",
    icon: require("@/assets/images/Wallet.png"),
  },
  {
    id: "4",
    title: "Watch Training Courses",
    subtitle: "Complete required modules",
    status: "pending",
    icon: require("@/assets/images/Play.png"),
  },
];

export const CONTRACT_SECTIONS = [
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

export const DASHBOARD_TASKS = [
  { id: "1", title: "Sign your contract", duration: "10 minutes", icon: require("@/assets/images/edit.png"), color: "#E04F2A" },
  { id: "2", title: "Upload your qualifications", duration: "5 minutes", icon: require("@/assets/images/Upload.png"), color: "#E8A000" },
  { id: "3", title: "Purchase your uniform", duration: "5 minutes", icon: require("@/assets/images/Wallet.png"), color: "#1D6FA4" },
  { id: "4", title: "Watch Training Courses", duration: "90 minutes", icon: require("@/assets/images/Play.png"), color: "#2E9E4F" },
];

export const QUALIFICATION_TYPES = [
  { id: "1", label: "FA Level 1 Coaching Certificate", required: true },
  { id: "2", label: "Futsal Level 1 Qualification", required: false },
  { id: "3", label: "Emergency First Aid Training", required: true },
  { id: "4", label: "Other (Upload up to 5 items)", required: true },
  { id: "5", label: "Notes", required: false },
];

export const UNIFORM_ITEMS = [
  { id: "1", name: "Coaches T-shirt", price: "£35.00", sizes: ["S", "M", "L", "XL"], image: require("@/assets/images/uniform.png") },
  { id: "2", name: "Coaches T-shirt", price: "£20.00", sizes: ["S", "M", "L", "XL"], image: require("@/assets/images/uniform.png") },
  { id: "3", name: "Coaches T-shirt", price: "£25.00", sizes: ["S", "M", "L", "XL"], image: require("@/assets/images/uniform.png") },
  { id: "4", name: "Coaches T-shirt", price: "£25.00", sizes: ["S", "M", "L", "XL"], image: require("@/assets/images/uniform.png") },
  { id: "5", name: "Coaches T-shirt", price: "£25.00", sizes: ["S", "M", "L", "XL"], image: require("@/assets/images/uniform.png") },
  { id: "6", name: "Coaches T-shirt", price: "£25.00", sizes: ["S", "M", "L", "XL"], image: require("@/assets/images/uniform.png") },
];

export const TRAINING_COURSES = [
  {
    id: "1", title: "How to use this app", duration: "45 min",
    thumbnail: require("@/assets/images/training1.png"), category: "Education", completed: false, status: "passed",
    videos: [
      { id: "1", title: "Welcome", duration: "2 minutes", thumbnail: require("@/assets/images/app1.png"), category: "Onboarding", completed: false, status: "passed" },
      { id: "2", title: "Onboarding", duration: "8 minutes", thumbnail: require("@/assets/images/app2.png"), category: "Training", completed: false, status: "retake" },
      { id: "3", title: "Welcome", duration: "2 minutes", thumbnail: require("@/assets/images/app3.png"), category: "Introduction", completed: true, status: "passed" },
      { id: "4", title: "Training Session", duration: "8 minutes", thumbnail: require("@/assets/images/app4.png"), category: "Coaching", completed: false, status: "pending" },
      { id: "5", title: "Welcome", duration: "2 minutes", thumbnail: require("@/assets/images/app5.png"), category: "Coaching", completed: true, status: "passed" },
      { id: "6", title: "Onboarding", duration: "8 minutes", thumbnail: require("@/assets/images/app6.png"), category: "Training", completed: false, status: "retake" },
    ],
  },
  {
    id: "2", title: "Coach Education", duration: "30 min",
    thumbnail: require("@/assets/images/training2.png"), category: "Safety", completed: false, status: "retake",
    videos: [
      { id: "1", title: "Welcome", duration: "2 minutes", thumbnail: require("@/assets/images/app1.png"), category: "Onboarding", completed: false, status: "passed" },
      { id: "2", title: "Onboarding", duration: "8 minutes", thumbnail: require("@/assets/images/app2.png"), category: "Training", completed: false, status: "retake" },
      { id: "3", title: "Welcome", duration: "2 minutes", thumbnail: require("@/assets/images/app3.png"), category: "Introduction", completed: true, status: "passed" },
      { id: "4", title: "Training Session", duration: "8 minutes", thumbnail: require("@/assets/images/app4.png"), category: "Coaching", completed: false, status: "pending" },
      { id: "5", title: "Welcome", duration: "2 minutes", thumbnail: require("@/assets/images/app5.png"), category: "Coaching", completed: true, status: "passed" },
      { id: "6", title: "Onboarding", duration: "8 minutes", thumbnail: require("@/assets/images/app6.png"), category: "Training", completed: false, status: "retake" },
    ],
  },
  {
    id: "3", title: "Health and Safety", duration: "60 min",
    thumbnail: require("@/assets/images/training3.png"), category: "Compliance", completed: false, status: "retake",
    videos: [
      { id: "1", title: "Welcome", duration: "2 minutes", thumbnail: require("@/assets/images/app1.png"), category: "Onboarding", completed: false, status: "passed" },
      { id: "2", title: "Onboarding", duration: "8 minutes", thumbnail: require("@/assets/images/app2.png"), category: "Training", completed: false, status: "retake" },
      { id: "3", title: "Welcome", duration: "2 minutes", thumbnail: require("@/assets/images/app3.png"), category: "Introduction", completed: true, status: "passed" },
      { id: "4", title: "Training Session", duration: "8 minutes", thumbnail: require("@/assets/images/app4.png"), category: "Coaching", completed: false, status: "pending" },
      { id: "5", title: "Welcome", duration: "2 minutes", thumbnail: require("@/assets/images/app5.png"), category: "Coaching", completed: true, status: "passed" },
      { id: "6", title: "Onboarding", duration: "8 minutes", thumbnail: require("@/assets/images/app6.png"), category: "Training", completed: false, status: "retake" },
    ],
  },
  {
    id: "4", title: "Safeguarding", duration: "10 min",
    thumbnail: require("@/assets/images/training4.png"), category: "Compliance", completed: true, status: "pending",
    videos: [
      { id: "1", title: "Welcome", duration: "2 minutes", thumbnail: require("@/assets/images/app1.png"), category: "Onboarding", completed: false, status: "passed" },
      { id: "2", title: "Onboarding", duration: "8 minutes", thumbnail: require("@/assets/images/app2.png"), category: "Training", completed: false, status: "retake" },
      { id: "3", title: "Welcome", duration: "2 minutes", thumbnail: require("@/assets/images/app3.png"), category: "Introduction", completed: true, status: "passed" },
      { id: "4", title: "Training Session", duration: "8 minutes", thumbnail: require("@/assets/images/app4.png"), category: "Coaching", completed: false, status: "pending" },
      { id: "5", title: "Welcome", duration: "2 minutes", thumbnail: require("@/assets/images/app5.png"), category: "Coaching", completed: true, status: "passed" },
      { id: "6", title: "Onboarding", duration: "8 minutes", thumbnail: require("@/assets/images/app6.png"), category: "Training", completed: false, status: "retake" },
    ],
  },
];

export const ASSESSMENT_QUESTIONS = [
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
