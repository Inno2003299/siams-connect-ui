export type SmartTag = "Late submission" | "Low activity" | "Consistent performer";

export type DailyLog = {
  day: string; // Mon, Tue...
  date: string;
  tasks: string;
  skills: string[];
  hours: number;
};

export type WeekLog = {
  id: string;
  studentId: string;
  week: number;
  range: string; // e.g. "Mar 04 — Mar 08"
  submittedAt: string;
  status: "Pending" | "Endorsed" | "Rejected";
  summary: string;
  daily: DailyLog[];
  attachments?: { name: string; size: string }[];
};

export type AssignedStudent = {
  id: string;
  name: string;
  initials: string;
  institution: string;
  program: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Completed" | "At Risk";
  weeksCompleted: number;
  totalWeeks: number;
  tags: SmartTag[];
};

export const ASSIGNED_STUDENTS: AssignedStudent[] = [
  {
    id: "s1",
    name: "Amina Otieno",
    initials: "AO",
    institution: "University of Nairobi",
    program: "BSc. Computer Science",
    email: "amina.o@uni.edu",
    phone: "+254 700 112 233",
    role: "Data Engineering Intern",
    status: "Active",
    weeksCompleted: 8,
    totalWeeks: 12,
    tags: ["Consistent performer"],
  },
  {
    id: "s2",
    name: "Brian Owino",
    initials: "BO",
    institution: "JKUAT",
    program: "BSc. Software Engineering",
    email: "brian.o@uni.edu",
    phone: "+254 711 445 667",
    role: "Backend Intern",
    status: "Active",
    weeksCompleted: 7,
    totalWeeks: 12,
    tags: ["Late submission"],
  },
  {
    id: "s3",
    name: "Faith Wanjiru",
    initials: "FW",
    institution: "Strathmore University",
    program: "BBIT",
    email: "faith.w@uni.edu",
    phone: "+254 722 998 110",
    role: "QA Intern",
    status: "Active",
    weeksCompleted: 8,
    totalWeeks: 12,
    tags: ["Consistent performer"],
  },
  {
    id: "s4",
    name: "Daniel Kiptoo",
    initials: "DK",
    institution: "Moi University",
    program: "BSc. IT",
    email: "daniel.k@uni.edu",
    phone: "+254 733 220 008",
    role: "Mobile Intern",
    status: "At Risk",
    weeksCompleted: 6,
    totalWeeks: 12,
    tags: ["Low activity", "Late submission"],
  },
];

export const WEEK_LOGS: WeekLog[] = [
  {
    id: "w1",
    studentId: "s1",
    week: 9,
    range: "Apr 21 — Apr 25",
    submittedAt: "Today, 10:24",
    status: "Pending",
    summary:
      "Built and deployed the ETL job for the customer churn dataset. Wrote tests covering edge cases and ran a 30-day backfill.",
    daily: [
      { day: "Mon", date: "Apr 21", tasks: "Designed schema for churn dataset and reviewed PR with senior engineer.", skills: ["SQL", "Postgres"], hours: 8 },
      { day: "Tue", date: "Apr 22", tasks: "Implemented Airflow DAG for daily ingestion.", skills: ["Python", "Airflow"], hours: 8 },
      { day: "Wed", date: "Apr 23", tasks: "Wrote unit tests and ran backfill on staging.", skills: ["pytest"], hours: 7 },
      { day: "Thu", date: "Apr 24", tasks: "Resolved data-quality issues and added validation.", skills: ["Python"], hours: 8 },
      { day: "Fri", date: "Apr 25", tasks: "Deployed to production and documented runbook.", skills: ["BigQuery", "Docs"], hours: 6 },
    ],
    attachments: [{ name: "etl_runbook.pdf", size: "412 KB" }],
  },
  {
    id: "w2",
    studentId: "s2",
    week: 9,
    range: "Apr 21 — Apr 25",
    submittedAt: "Today, 09:11",
    status: "Pending",
    summary:
      "Implemented JWT refresh-token rotation on the auth service and added rate-limit middleware.",
    daily: [
      { day: "Mon", date: "Apr 21", tasks: "Investigated existing JWT flow.", skills: ["Node.js"], hours: 7 },
      { day: "Tue", date: "Apr 22", tasks: "Implemented refresh rotation.", skills: ["Node.js", "Redis"], hours: 8 },
      { day: "Wed", date: "Apr 23", tasks: "Added rate-limit middleware.", skills: ["Express"], hours: 7 },
      { day: "Thu", date: "Apr 24", tasks: "Pair-programming on migration plan.", skills: ["Postgres"], hours: 6 },
      { day: "Fri", date: "Apr 25", tasks: "Wrote integration tests.", skills: ["Jest"], hours: 7 },
    ],
  },
  {
    id: "w3",
    studentId: "s4",
    week: 9,
    range: "Apr 21 — Apr 25",
    submittedAt: "2d ago",
    status: "Pending",
    summary:
      "Worked on offline mode for the mobile checklist screen and resolved a sync bug.",
    daily: [
      { day: "Mon", date: "Apr 21", tasks: "Reviewed offline architecture proposal.", skills: ["React Native"], hours: 6 },
      { day: "Tue", date: "Apr 22", tasks: "Implemented local cache with MMKV.", skills: ["MMKV"], hours: 7 },
      { day: "Wed", date: "Apr 23", tasks: "Reproduced and fixed sync race condition.", skills: ["Debugging"], hours: 6 },
      { day: "Thu", date: "Apr 24", tasks: "Manual QA on Android device.", skills: ["QA"], hours: 5 },
      { day: "Fri", date: "Apr 25", tasks: "Submitted PR for review.", skills: ["Git"], hours: 5 },
    ],
  },
  {
    id: "w4",
    studentId: "s3",
    week: 8,
    range: "Apr 14 — Apr 18",
    submittedAt: "Yesterday",
    status: "Endorsed",
    summary: "Built regression test suite for the checkout flow and triaged 12 bugs.",
    daily: [
      { day: "Mon", date: "Apr 14", tasks: "Set up Cypress and wrote first 4 specs.", skills: ["Cypress"], hours: 8 },
      { day: "Tue", date: "Apr 15", tasks: "Wrote 6 more specs and added CI step.", skills: ["Cypress", "GH Actions"], hours: 8 },
      { day: "Wed", date: "Apr 16", tasks: "Triaged 12 reported bugs in Jira.", skills: ["Jira"], hours: 7 },
      { day: "Thu", date: "Apr 17", tasks: "Reproduced flaky tests and stabilised them.", skills: ["Debugging"], hours: 7 },
      { day: "Fri", date: "Apr 18", tasks: "Documented test patterns for the team.", skills: ["Docs"], hours: 6 },
    ],
  },
];

export const LETTERS = [
  {
    id: "l1",
    student: "Amina Otieno",
    subject: "Industrial Attachment Introduction",
    sentAt: "Mar 03, 09:12",
    status: "Sent" as const,
    fileName: "amina_intro_letter.pdf",
  },
  {
    id: "l2",
    student: "Brian Owino",
    subject: "Industrial Attachment Introduction",
    sentAt: "Mar 04, 11:45",
    status: "Sent" as const,
    fileName: "brian_intro_letter.pdf",
  },
  {
    id: "l3",
    student: "Daniel Kiptoo",
    subject: "Industrial Attachment Introduction",
    sentAt: "Mar 06, 14:20",
    status: "Pending" as const,
    fileName: "daniel_intro_letter.pdf",
  },
];
