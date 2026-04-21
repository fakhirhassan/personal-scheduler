import { useState, useEffect, useMemo } from 'react';

// === Default data: pre-populated with user's plan ===
const DEFAULT_DATA = {
  name: "",
  currentFocus: "Mids prep + FYP + Udemy momentum",
  dailyBlocks: [
    { id: 1, time: "06:00", activity: "Wake, Fajr, hydrate", category: "personal", mins: 45 },
    { id: 2, time: "06:45", activity: "Gen AI Udemy — fresh-brain deep work", category: "learning", mins: 90 },
    { id: 3, time: "08:15", activity: "Breakfast + commute", category: "personal", mins: 75 },
    { id: 4, time: "09:30", activity: "University classes", category: "university", mins: 180 },
    { id: 5, time: "12:30", activity: "Lunch + Zuhr", category: "personal", mins: 60 },
    { id: 6, time: "13:30", activity: "Mids prep / coursework", category: "university", mins: 120 },
    { id: 7, time: "15:30", activity: "FYP work (AniAd)", category: "research", mins: 90 },
    { id: 8, time: "17:00", activity: "DSA with Python — Udemy", category: "learning", mins: 75 },
    { id: 9, time: "18:15", activity: "Walk + Maghrib", category: "personal", mins: 45 },
    { id: 10, time: "19:00", activity: "Dinner + family", category: "personal", mins: 60 },
    { id: 11, time: "20:00", activity: "Job applications + LinkedIn", category: "career", mins: 60 },
    { id: 12, time: "21:00", activity: "Reading (book)", category: "learning", mins: 30 },
    { id: 13, time: "21:30", activity: "Research reading / notes", category: "research", mins: 45 },
    { id: 14, time: "22:15", activity: "Reflect + plan tomorrow", category: "personal", mins: 15 },
    { id: 15, time: "22:30", activity: "Sleep", category: "personal", mins: 0 },
  ],
  todayPriorities: ["", "", ""],
  tasks: [],
  scholarships: [
    {
      id: "chevening",
      name: "Chevening Scholarship",
      country: "United Kingdom",
      deadline: "2026-10-07",
      funding: "Fully funded · 1-year master's",
      gate: "Needs 2,800 work hours by deadline — start job by June 1, 2026",
      status: "preparing",
      tasks: [
        { id: 1, text: "Land a job by June 1 to hit 2,800-hour threshold", done: false, due: "2026-06-01" },
        { id: 2, text: "Shortlist 3 UK master's programs (AI / AI governance focus)", done: false, due: "2026-07-15" },
        { id: 3, text: "Draft Leadership essay (500 words) — use GDG Chair + ACM stories", done: false, due: "2026-08-20" },
        { id: 4, text: "Draft Networking essay (500 words)", done: false, due: "2026-08-27" },
        { id: 5, text: "Draft Studying in UK essay (500 words)", done: false, due: "2026-09-03" },
        { id: 6, text: "Draft Career Plan essay (500 words) — tie to Pakistan AI ecosystem", done: false, due: "2026-09-10" },
        { id: 7, text: "Secure 2 strong referees (1 academic, 1 professional)", done: false, due: "2026-09-15" },
        { id: 8, text: "Apply to 3 UK universities in parallel", done: false, due: "2026-09-20" },
        { id: 9, text: "Submit Chevening application", done: false, due: "2026-10-07" },
      ],
    },
    {
      id: "emai",
      name: "Erasmus Mundus — EMAI (AI track)",
      country: "EU (Spain / France / Netherlands)",
      deadline: "2026-12-20",
      funding: "Fully funded · 2-year joint master's · €1,400/mo",
      gate: "No work-exp requirement. Strong match for your AniAd + IP governance profile",
      status: "preparing",
      tasks: [
        { id: 1, text: "Research EMAI curriculum + partner unis (UPF / Radboud / NTNU)", done: false, due: "2026-07-01" },
        { id: 2, text: "Draft Statement of Purpose (focus on AI + IP/copyright governance)", done: false, due: "2026-10-15" },
        { id: 3, text: "Get IELTS/TOEFL score (6.5+ or 90+)", done: false, due: "2026-09-30" },
        { id: 4, text: "Compile 2 academic reference letters", done: false, due: "2026-10-30" },
        { id: 5, text: "Get transcripts notarized + translated if needed", done: false, due: "2026-11-10" },
        { id: 6, text: "Write research proposal aligned to EMAI research areas", done: false, due: "2026-11-25" },
        { id: 7, text: "Submit EMAI scholarship track application", done: false, due: "2026-12-20" },
      ],
    },
    {
      id: "daad",
      name: "DAAD Study Scholarship (Germany)",
      country: "Germany",
      deadline: "2026-10-31",
      funding: "Fully funded · ~€934/mo + tuition + health + travel",
      gate: "Apply to EU programs taught in English. Stronger if you've published",
      status: "preparing",
      tasks: [
        { id: 1, text: "Identify 2-3 AI master's programs at German universities (RPTU, TUM, Saarland)", done: false, due: "2026-07-20" },
        { id: 2, text: "Write DAAD motivation letter (2 pages)", done: false, due: "2026-09-15" },
        { id: 3, text: "Get 2 academic referees' Letter Reference Forms filled", done: false, due: "2026-10-05" },
        { id: 4, text: "Draft detailed study plan with rationale for each course", done: false, due: "2026-10-15" },
        { id: 5, text: "Submit via DAAD portal", done: false, due: "2026-10-31" },
      ],
    },
    {
      id: "csc",
      name: "CSC Type A 2027 (China, HEC route)",
      country: "China",
      deadline: "2027-01-31",
      funding: "Fully funded · tuition + housing + ¥3,000/mo + insurance",
      gate: "Apply via HEC Pakistan. English-taught AI programs available at top unis",
      status: "preparing",
      tasks: [
        { id: 1, text: "Shortlist 2 Chinese universities with English AI master's (Tsinghua, Fudan, SJTU, USTC)", done: false, due: "2026-11-15" },
        { id: 2, text: "Contact professors in AI groups for pre-acceptance letters", done: false, due: "2026-12-10" },
        { id: 3, text: "Prepare study plan (1,500 words, China-focused rationale)", done: false, due: "2026-12-20" },
        { id: 4, text: "Foreigner Physical Examination Form from registered hospital", done: false, due: "2027-01-10" },
        { id: 5, text: "Submit via HEC portal + CSC portal (use 2 agency numbers)", done: false, due: "2027-01-25" },
      ],
    },
    {
      id: "commonwealth",
      name: "Commonwealth Scholarship",
      country: "United Kingdom",
      deadline: "2026-10-20",
      funding: "Fully funded · 1-year master's · development focus",
      gate: "Development-oriented theme fits your AI governance pitch",
      status: "preparing",
      tasks: [
        { id: 1, text: "Frame AI governance / copyright research as Pakistan development issue", done: false, due: "2026-08-15" },
        { id: 2, text: "Apply to eligible UK universities (LSE, Edinburgh, Manchester)", done: false, due: "2026-09-15" },
        { id: 3, text: "Complete development-impact statement", done: false, due: "2026-10-01" },
        { id: 4, text: "Submit Commonwealth application", done: false, due: "2026-10-20" },
      ],
    },
    {
      id: "fulbright2028",
      name: "Fulbright 2028 (backup if 2027 doesn't land)",
      country: "United States",
      deadline: "2027-04-01",
      funding: "Fully funded · US master's",
      gate: "Retake GRE → 310+. Add 1 year of work + publication before reapplying",
      status: "conditional",
      tasks: [
        { id: 1, text: "Retake GRE in September 2026 — target 315+", done: false, due: "2026-09-30" },
        { id: 2, text: "Publish workshop paper from AniAd work", done: false, due: "2026-12-31" },
        { id: 3, text: "Strengthen Pakistan-contribution narrative in SOP", done: false, due: "2027-02-15" },
        { id: 4, text: "Re-apply via USEFP portal", done: false, due: "2027-04-01" },
      ],
    },
  ],
  courses: [
    { id: "genai", name: "Generative AI", platform: "Udemy", completed: 0, total: 40, target: "2026-08-15", notes: "Fresh-brain mornings. Build a small project per module." },
    { id: "dsa", name: "DSA with Python", platform: "Udemy", completed: 0, total: 60, target: "2026-10-31", notes: "Evening slot. Target: 3 LeetCode problems per section." },
  ],
  books: [
    { id: 1, title: "", status: "reading", progress: 0 },
    { id: 2, title: "", status: "queued", progress: 0 },
  ],
  research: [
    { id: 1, milestone: "Finalize benchmark study protocol for AniAd models", done: false, due: "2026-05-15" },
    { id: 2, milestone: "Run evaluations on 3 text-to-video models (temporal coherence)", done: false, due: "2026-06-30" },
    { id: 3, milestone: "Draft paper: 'IP Governance in Generative Video Models'", done: false, due: "2026-09-15" },
    { id: 4, milestone: "Submit to AI workshop (NeurIPS workshop / ACL / EMNLP workshop)", done: false, due: "2026-10-20" },
  ],
  timeline: [
    { month: "2026-04", events: [
      { text: "Mids prep intensifies — reduce course load, keep research ticking", type: "university" },
      { text: "Start Udemy Gen AI (finish Module 1-2)", type: "learning" },
      { text: "Begin LinkedIn outreach for remote AI roles", type: "career" },
    ]},
    { month: "2026-05", events: [
      { text: "Mid-term exams", type: "university" },
      { text: "FYP milestone: benchmark study protocol finalized", type: "research" },
      { text: "Apply to 10+ AI/ML jobs per week", type: "career" },
    ]},
    { month: "2026-06", events: [
      { text: "Final exams + FYP defense", type: "university" },
      { text: "GRADUATION", type: "milestone" },
      { text: "Job start target: June 15", type: "career" },
    ]},
    { month: "2026-07", events: [
      { text: "Settle into job. Log hours meticulously for Chevening", type: "career" },
      { text: "Complete Gen AI Udemy", type: "learning" },
      { text: "Shortlist target universities across all 5 scholarships", type: "scholarship" },
    ]},
    { month: "2026-08", events: [
      { text: "Chevening opens — start essays", type: "scholarship" },
      { text: "IELTS booked", type: "scholarship" },
      { text: "Paper draft: AniAd benchmark study", type: "research" },
    ]},
    { month: "2026-09", events: [
      { text: "IELTS exam", type: "scholarship" },
      { text: "GRE retake (target 315+)", type: "scholarship" },
      { text: "Draft all Chevening + DAAD essays", type: "scholarship" },
    ]},
    { month: "2026-10", events: [
      { text: "Chevening deadline (Oct 7)", type: "deadline" },
      { text: "Commonwealth deadline (Oct 20)", type: "deadline" },
      { text: "DAAD deadline (Oct 31)", type: "deadline" },
      { text: "Paper submission to workshop", type: "research" },
    ]},
    { month: "2026-11", events: [
      { text: "EMAI application in progress", type: "scholarship" },
      { text: "Start CSC Type A prep — university contact", type: "scholarship" },
      { text: "Complete DSA Udemy", type: "learning" },
    ]},
    { month: "2026-12", events: [
      { text: "EMAI deadline (mid-late Dec)", type: "deadline" },
      { text: "Other Erasmus Mundus applications", type: "scholarship" },
    ]},
    { month: "2027-01", events: [
      { text: "CSC Type A deadline (late Jan)", type: "deadline" },
      { text: "Remaining Erasmus Mundus deadlines", type: "scholarship" },
      { text: "Chevening shortlist notification", type: "scholarship" },
    ]},
    { month: "2027-02", events: [
      { text: "Chevening interviews (if shortlisted)", type: "scholarship" },
      { text: "Fulbright 2028 application prep begins", type: "scholarship" },
    ]},
    { month: "2027-03", events: [
      { text: "First scholarship decisions expected (Erasmus, DAAD)", type: "milestone" },
    ]},
    { month: "2027-04", events: [
      { text: "Fulbright 2028 deadline (Apr 1)", type: "deadline" },
      { text: "Chevening conditional offers", type: "scholarship" },
    ]},
    { month: "2027-05", events: [
      { text: "Most scholarship decisions finalized", type: "milestone" },
      { text: "Visa + logistics for chosen program", type: "career" },
    ]},
    { month: "2027-06", events: [
      { text: "CSC admission letters distributed", type: "scholarship" },
      { text: "Pre-departure prep", type: "career" },
    ]},
    { month: "2027-09", events: [
      { text: "MASTERS PROGRAM STARTS", type: "milestone" },
    ]},
  ],
  log: {},
};

// === Category styling ===
const CATEGORY_COLORS = {
  personal: { bg: "bg-stone-100", text: "text-stone-600", dot: "bg-stone-400" },
  learning: { bg: "bg-amber-50", text: "text-amber-800", dot: "bg-amber-600" },
  university: { bg: "bg-orange-50", text: "text-orange-800", dot: "bg-orange-600" },
  research: { bg: "bg-emerald-50", text: "text-emerald-800", dot: "bg-emerald-700" },
  career: { bg: "bg-rose-50", text: "text-rose-800", dot: "bg-rose-700" },
  scholarship: { bg: "bg-indigo-50", text: "text-indigo-800", dot: "bg-indigo-700" },
  deadline: { bg: "bg-red-50", text: "text-red-800", dot: "bg-red-600" },
  milestone: { bg: "bg-amber-100", text: "text-amber-900", dot: "bg-amber-700" },
};

const STATUS_STYLES = {
  preparing: "bg-amber-100 text-amber-900 border-amber-300",
  submitted: "bg-sky-100 text-sky-900 border-sky-300",
  shortlisted: "bg-emerald-100 text-emerald-900 border-emerald-300",
  rejected: "bg-stone-200 text-stone-700 border-stone-400",
  accepted: "bg-emerald-200 text-emerald-900 border-emerald-500",
  conditional: "bg-stone-100 text-stone-700 border-stone-300",
};

// === Helper: days until ===
const daysUntil = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

const formatMonth = (ym) => {
  const [y, m] = ym.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m) - 1]} ${y}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const todayStr = () => new Date().toISOString().slice(0, 10);

// === Main ===
export default function Planner() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [tab, setTab] = useState("today");
  const [loaded, setLoaded] = useState(false);
  const [expandedScholarship, setExpandedScholarship] = useState(null);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("planner-v1");
        if (result?.value) {
          const parsed = JSON.parse(result.value);
          setData({ ...DEFAULT_DATA, ...parsed });
        }
      } catch (e) {
        // first load
      }
      setLoaded(true);
    })();
  }, []);

  const save = async (next) => {
    setData(next);
    try {
      await window.storage.set("planner-v1", JSON.stringify(next));
    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  // === Derived ===
  const upcomingDeadlines = useMemo(() => {
    const items = [];
    data.scholarships.forEach((s) => {
      items.push({ label: s.name, date: s.deadline, kind: "scholarship" });
      s.tasks.forEach((t) => {
        if (!t.done && t.due) items.push({ label: `${s.name}: ${t.text}`, date: t.due, kind: "task" });
      });
    });
    data.research.forEach((r) => {
      if (!r.done) items.push({ label: `Research: ${r.milestone}`, date: r.due, kind: "research" });
    });
    return items
      .filter((i) => daysUntil(i.date) >= 0 && daysUntil(i.date) <= 60)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  }, [data]);

  const overallProgress = useMemo(() => {
    const all = data.scholarships.flatMap((s) => s.tasks);
    if (all.length === 0) return 0;
    return Math.round((all.filter((t) => t.done).length / all.length) * 100);
  }, [data]);

  // === Handlers ===
  const togglePriority = (i, val) => {
    const next = { ...data, todayPriorities: [...data.todayPriorities] };
    next.todayPriorities[i] = val;
    save(next);
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const next = {
      ...data,
      tasks: [...data.tasks, { id: Date.now(), text: newTask, done: false, date: todayStr() }],
    };
    setNewTask("");
    save(next);
  };

  const toggleTask = (id) => {
    const next = { ...data, tasks: data.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) };
    save(next);
  };

  const removeTask = (id) => {
    const next = { ...data, tasks: data.tasks.filter((t) => t.id !== id) };
    save(next);
  };

  const toggleScholarshipTask = (sid, tid) => {
    const next = {
      ...data,
      scholarships: data.scholarships.map((s) =>
        s.id === sid
          ? { ...s, tasks: s.tasks.map((t) => (t.id === tid ? { ...t, done: !t.done } : t)) }
          : s
      ),
    };
    save(next);
  };

  const updateScholarshipStatus = (sid, status) => {
    const next = {
      ...data,
      scholarships: data.scholarships.map((s) => (s.id === sid ? { ...s, status } : s)),
    };
    save(next);
  };

  const updateCourseProgress = (id, val) => {
    const next = {
      ...data,
      courses: data.courses.map((c) =>
        c.id === id ? { ...c, completed: Math.max(0, Math.min(c.total, val)) } : c
      ),
    };
    save(next);
  };

  const toggleResearch = (id) => {
    const next = { ...data, research: data.research.map((r) => (r.id === id ? { ...r, done: !r.done } : r)) };
    save(next);
  };

  const saveReflection = (text) => {
    const next = { ...data, log: { ...data.log, [todayStr()]: text } };
    save(next);
  };

  const updateName = (val) => save({ ...data, name: val });
  const updateFocus = (val) => save({ ...data, currentFocus: val });
  const updateBook = (id, field, val) => {
    const next = { ...data, books: data.books.map((b) => (b.id === id ? { ...b, [field]: val } : b)) };
    save(next);
  };

  // === Today's date display ===
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateDisplay = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F2ECE0", fontFamily: "'IBM Plex Sans', system-ui" }}>
        <div className="text-stone-500 text-sm tracking-wider uppercase">Loading your plan...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F2ECE0", minHeight: "100vh", color: "#1F1B16" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body, html, .planner-root { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
        .display { font-family: 'Fraunces', 'Playfair Display', Georgia, serif; font-optical-sizing: auto; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .ink-text { color: #1F1B16; }
        .muted-text { color: #6B6257; }
        .soft-border { border-color: #D9CFC0; }
        .rust { color: #A94A2D; }
        .sage { color: #556B4B; }
        .gold { color: #8B6F2E; }
        .fade-in { animation: fade 0.4s ease-out; }
        @keyframes fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .hover-lift { transition: all 0.2s ease; }
        .hover-lift:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(31, 27, 22, 0.08); }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #A94A2D !important; }
        .grain { position: relative; }
        .grain::before { content: ''; position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3CfeColorMatrix values='0 0 0 0 0.2 0 0 0 0 0.18 0 0 0 0 0.15 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); pointer-events: none; opacity: 0.5; }
      `}</style>

      <div className="planner-root max-w-4xl mx-auto px-5 py-8 md:py-12">
        {/* Header */}
        <header className="mb-10 border-b pb-8 soft-border">
          <div className="flex items-baseline justify-between mb-3">
            <div className="mono text-xs uppercase tracking-[0.2em] muted-text">
              {dayName} · {dateDisplay}
            </div>
            <div className="mono text-xs muted-text">v1.0</div>
          </div>
          <h1 className="display text-5xl md:text-6xl font-light leading-none mb-3 ink-text">
            {data.name ? (
              <>Hello, <em className="gold">{data.name}</em></>
            ) : (
              <span className="muted-text italic">Your planner</span>
            )}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mt-4">
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateName(e.target.value)}
              placeholder="Enter your name"
              className="mono text-xs px-3 py-2 bg-transparent border soft-border rounded w-full md:w-auto"
              style={{ color: "#1F1B16" }}
            />
            <div className="flex-1 flex items-center gap-2">
              <span className="mono text-xs uppercase tracking-wider muted-text whitespace-nowrap">Current Focus:</span>
              <input
                type="text"
                value={data.currentFocus}
                onChange={(e) => updateFocus(e.target.value)}
                className="mono text-xs flex-1 px-3 py-2 bg-transparent border soft-border rounded"
                style={{ color: "#A94A2D" }}
              />
            </div>
          </div>
        </header>

        {/* Tab navigation */}
        <nav className="flex flex-wrap gap-1 mb-8 border-b soft-border">
          {[
            { id: "today", label: "Today" },
            { id: "scholarships", label: "Scholarships" },
            { id: "timeline", label: "Timeline" },
            { id: "learning", label: "Learning" },
            { id: "reflect", label: "Reflect" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`mono text-xs uppercase tracking-[0.15em] px-4 py-3 border-b-2 -mb-px transition-all ${
                tab === t.id
                  ? "border-current rust"
                  : "border-transparent muted-text hover:ink-text"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* === TODAY TAB === */}
        {tab === "today" && (
          <div className="fade-in">
            {/* Top 3 priorities */}
            <section className="mb-10">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="display text-2xl italic">Three things that matter today</h2>
                <span className="mono text-xs muted-text">Pick carefully</span>
              </div>
              <div className="space-y-2">
                {data.todayPriorities.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/60 rounded px-4 py-3 border soft-border">
                    <span className="mono text-xs gold font-semibold w-6">0{i + 1}</span>
                    <input
                      type="text"
                      value={p}
                      onChange={(e) => togglePriority(i, e.target.value)}
                      placeholder={i === 0 ? "Your most important thing" : i === 1 ? "The second priority" : "The third"}
                      className="flex-1 bg-transparent border-0 text-base placeholder:muted-text"
                      style={{ color: "#1F1B16" }}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Upcoming radar */}
            {upcomingDeadlines.length > 0 && (
              <section className="mb-10">
                <h2 className="display text-2xl italic mb-4">On the horizon <span className="mono text-xs muted-text not-italic">· next 60 days</span></h2>
                <div className="space-y-2">
                  {upcomingDeadlines.map((d, i) => {
                    const days = daysUntil(d.date);
                    const urgency = days <= 7 ? "rust" : days <= 30 ? "gold" : "muted-text";
                    return (
                      <div key={i} className="flex items-center gap-4 py-2 border-b soft-border">
                        <div className={`mono text-xs font-semibold w-16 ${urgency}`}>
                          {days === 0 ? "TODAY" : `${days}d`}
                        </div>
                        <div className="flex-1 text-sm ink-text">{d.label}</div>
                        <div className="mono text-xs muted-text">{formatDate(d.date)}</div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Daily schedule */}
            <section className="mb-10">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="display text-2xl italic">The shape of your day</h2>
                <span className="mono text-xs muted-text">{data.dailyBlocks.length} blocks · ~15 hrs</span>
              </div>
              <div className="space-y-1">
                {data.dailyBlocks.map((block) => {
                  const cat = CATEGORY_COLORS[block.category] || CATEGORY_COLORS.personal;
                  return (
                    <div key={block.id} className={`flex items-start gap-4 px-3 py-2.5 rounded ${cat.bg} hover-lift`}>
                      <div className="mono text-xs font-semibold w-14 pt-0.5 ink-text">{block.time}</div>
                      <div className={`w-1 self-stretch rounded-full ${cat.dot}`}></div>
                      <div className="flex-1">
                        <div className="text-sm ink-text">{block.activity}</div>
                        {block.mins > 0 && (
                          <div className={`mono text-xs mt-0.5 ${cat.text}`}>
                            {Math.floor(block.mins / 60)}h{block.mins % 60 > 0 ? ` ${block.mins % 60}m` : ""} · {block.category}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mono text-xs muted-text mt-4 italic">
                Template for current semester. Post-graduation: swap university blocks for job work, push Udemy + scholarship prep into evenings.
              </p>
            </section>

            {/* Quick tasks */}
            <section>
              <h2 className="display text-2xl italic mb-4">Loose tasks</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  placeholder="What else needs doing?"
                  className="flex-1 bg-white/60 border soft-border rounded px-3 py-2 text-sm"
                />
                <button
                  onClick={addTask}
                  className="mono text-xs uppercase tracking-wider px-4 py-2 bg-[#1F1B16] text-white rounded hover:bg-[#A94A2D] transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-1">
                {data.tasks.length === 0 && (
                  <p className="muted-text text-sm italic">No loose tasks. Peaceful.</p>
                )}
                {data.tasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 py-2 group">
                    <button
                      onClick={() => toggleTask(t.id)}
                      className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-all ${
                        t.done ? "bg-[#A94A2D] border-[#A94A2D]" : "border-[#8B7A66]"
                      }`}
                    >
                      {t.done && <span className="text-white text-xs leading-none">✓</span>}
                    </button>
                    <span className={`flex-1 text-sm ${t.done ? "line-through muted-text" : "ink-text"}`}>{t.text}</span>
                    <button
                      onClick={() => removeTask(t.id)}
                      className="text-xs muted-text opacity-0 group-hover:opacity-100 transition-opacity hover:rust"
                    >
                      remove
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* === SCHOLARSHIPS TAB === */}
        {tab === "scholarships" && (
          <div className="fade-in">
            <div className="mb-8 p-5 bg-white/40 border soft-border rounded">
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="display text-2xl italic">Overall scholarship readiness</h2>
                <span className="mono text-sm font-semibold rust">{overallProgress}%</span>
              </div>
              <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#C9A96A] to-[#A94A2D] transition-all" style={{ width: `${overallProgress}%` }}></div>
              </div>
              <p className="mono text-xs muted-text mt-2">Across all {data.scholarships.length} tracked scholarships</p>
            </div>

            <div className="space-y-4">
              {data.scholarships.map((s) => {
                const daysLeft = daysUntil(s.deadline);
                const completedTasks = s.tasks.filter((t) => t.done).length;
                const progress = s.tasks.length === 0 ? 0 : Math.round((completedTasks / s.tasks.length) * 100);
                const isExpanded = expandedScholarship === s.id;
                const urgencyText = daysLeft <= 30 ? "rust" : daysLeft <= 90 ? "gold" : "muted-text";

                return (
                  <div key={s.id} className="bg-white/60 border soft-border rounded overflow-hidden hover-lift">
                    <button
                      onClick={() => setExpandedScholarship(isExpanded ? null : s.id)}
                      className="w-full text-left p-5"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="display text-xl ink-text">{s.name}</h3>
                            <span className={`mono text-[10px] uppercase tracking-wider px-2 py-0.5 border rounded ${STATUS_STYLES[s.status]}`}>
                              {s.status}
                            </span>
                          </div>
                          <p className="mono text-xs muted-text">{s.country} · {s.funding}</p>
                        </div>
                        <div className="text-right">
                          <div className={`mono text-lg font-semibold ${urgencyText}`}>
                            {daysLeft < 0 ? "passed" : `${daysLeft}d`}
                          </div>
                          <div className="mono text-xs muted-text">{formatDate(s.deadline)}</div>
                        </div>
                      </div>

                      <p className="text-sm ink-text mb-3 italic">⚑ {s.gate}</p>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#556B4B] transition-all" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="mono text-xs muted-text whitespace-nowrap">
                          {completedTasks}/{s.tasks.length} · {progress}%
                        </span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t soft-border p-5 bg-[#F7F2E8] fade-in">
                        <div className="mb-4">
                          <label className="mono text-xs uppercase tracking-wider muted-text mr-2">Status:</label>
                          <select
                            value={s.status}
                            onChange={(e) => updateScholarshipStatus(s.id, e.target.value)}
                            className="mono text-xs bg-white border soft-border rounded px-2 py-1"
                          >
                            <option value="preparing">Preparing</option>
                            <option value="submitted">Submitted</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="accepted">Accepted</option>
                            <option value="conditional">Conditional (later cycle)</option>
                          </select>
                        </div>

                        <h4 className="mono text-xs uppercase tracking-wider muted-text mb-3">Prep roadmap</h4>
                        <div className="space-y-2">
                          {s.tasks.map((t) => {
                            const tDays = daysUntil(t.due);
                            return (
                              <div key={t.id} className="flex items-start gap-3 py-1.5">
                                <button
                                  onClick={() => toggleScholarshipTask(s.id, t.id)}
                                  className={`w-4 h-4 mt-0.5 border-2 rounded-sm flex-shrink-0 flex items-center justify-center transition-all ${
                                    t.done ? "bg-[#556B4B] border-[#556B4B]" : "border-[#8B7A66]"
                                  }`}
                                >
                                  {t.done && <span className="text-white text-xs leading-none">✓</span>}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm ${t.done ? "line-through muted-text" : "ink-text"}`}>{t.text}</div>
                                  {t.due && (
                                    <div className="mono text-xs muted-text mt-0.5">
                                      by {formatDate(t.due)}{!t.done && tDays >= 0 && ` · ${tDays} days`}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* === TIMELINE TAB === */}
        {tab === "timeline" && (
          <div className="fade-in">
            <div className="mb-8">
              <h2 className="display text-3xl italic mb-2">From here to September 2027</h2>
              <p className="muted-text text-sm">The arc of the next 18 months. Bold items are deadlines or milestones.</p>
            </div>
            <div className="relative">
              <div className="absolute left-[5.5rem] top-2 bottom-2 w-px bg-[#D9CFC0]"></div>
              <div className="space-y-6">
                {data.timeline.map((m, i) => {
                  const isCurrent = m.month === todayStr().slice(0, 7);
                  const isPast = new Date(m.month + "-01") < new Date(todayStr().slice(0, 7) + "-01");
                  return (
                    <div key={m.month} className="flex gap-6">
                      <div className="w-20 flex-shrink-0 text-right">
                        <div className={`mono text-xs uppercase tracking-wider ${isPast ? "muted-text opacity-50" : isCurrent ? "rust font-bold" : "ink-text"}`}>
                          {formatMonth(m.month)}
                        </div>
                        {isCurrent && <div className="mono text-[10px] rust mt-0.5">YOU ARE HERE</div>}
                      </div>
                      <div className={`w-3 h-3 rounded-full mt-1.5 -ml-[0.5rem] z-10 border-2 ${
                        isCurrent ? "bg-[#A94A2D] border-[#A94A2D]" : isPast ? "bg-[#D9CFC0] border-[#D9CFC0]" : "bg-white border-[#8B7A66]"
                      }`}></div>
                      <div className={`flex-1 pb-2 ${isPast ? "opacity-50" : ""}`}>
                        <div className="space-y-1.5">
                          {m.events.map((e, j) => {
                            const cat = CATEGORY_COLORS[e.type] || CATEGORY_COLORS.personal;
                            const isBig = e.type === "deadline" || e.type === "milestone";
                            return (
                              <div key={j} className={`flex items-center gap-2 ${isBig ? "font-semibold" : ""}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${cat.dot}`}></div>
                                <span className={`text-sm ${isBig ? cat.text : "ink-text"}`}>
                                  {e.text}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* === LEARNING TAB === */}
        {tab === "learning" && (
          <div className="fade-in">
            <section className="mb-10">
              <h2 className="display text-2xl italic mb-4">Courses</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.courses.map((c) => {
                  const progress = Math.round((c.completed / c.total) * 100);
                  const daysToTarget = daysUntil(c.target);
                  const lecturesLeft = c.total - c.completed;
                  return (
                    <div key={c.id} className="bg-white/60 border soft-border rounded p-5">
                      <div className="mb-3">
                        <h3 className="display text-lg ink-text">{c.name}</h3>
                        <div className="mono text-xs muted-text">{c.platform}</div>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="mono text-xs muted-text">Progress</span>
                          <span className="mono text-sm font-semibold rust">{progress}%</span>
                        </div>
                        <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#C9A96A] to-[#A94A2D] transition-all" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <button
                          onClick={() => updateCourseProgress(c.id, c.completed - 1)}
                          className="mono text-xs w-7 h-7 border soft-border rounded hover:bg-stone-100"
                        >−</button>
                        <span className="mono text-xs muted-text flex-1 text-center">
                          {c.completed} / {c.total} lectures
                        </span>
                        <button
                          onClick={() => updateCourseProgress(c.id, c.completed + 1)}
                          className="mono text-xs w-7 h-7 border soft-border rounded hover:bg-stone-100"
                        >+</button>
                      </div>
                      <div className="mono text-xs muted-text mb-2">
                        Target: {formatDate(c.target)} · {daysToTarget > 0 ? `${daysToTarget} days` : "due"}
                      </div>
                      {daysToTarget > 0 && lecturesLeft > 0 && (
                        <div className="mono text-xs gold">
                          Need ~{Math.ceil(lecturesLeft / Math.max(1, Math.floor(daysToTarget / 7)))} lectures/week to finish on time
                        </div>
                      )}
                      <p className="text-xs muted-text mt-2 italic">{c.notes}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="display text-2xl italic mb-4">Reading</h2>
              <div className="space-y-2">
                {data.books.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 bg-white/60 border soft-border rounded p-3">
                    <input
                      type="text"
                      value={b.title}
                      onChange={(e) => updateBook(b.id, "title", e.target.value)}
                      placeholder="Book title..."
                      className="flex-1 bg-transparent border-0 text-sm"
                    />
                    <select
                      value={b.status}
                      onChange={(e) => updateBook(b.id, "status", e.target.value)}
                      className="mono text-xs bg-transparent border soft-border rounded px-2 py-1"
                    >
                      <option value="queued">Queued</option>
                      <option value="reading">Reading</option>
                      <option value="finished">Finished</option>
                    </select>
                  </div>
                ))}
              </div>
              <p className="mono text-xs muted-text mt-2 italic">30 mins daily at 21:00 slot. Steady beats ambitious here.</p>
            </section>

            <section>
              <h2 className="display text-2xl italic mb-4">Research track <span className="mono text-xs muted-text not-italic">· IP & GenAI Governance</span></h2>
              <div className="space-y-2">
                {data.research.map((r) => {
                  const days = daysUntil(r.due);
                  return (
                    <div key={r.id} className="flex items-start gap-3 bg-white/60 border soft-border rounded p-3">
                      <button
                        onClick={() => toggleResearch(r.id)}
                        className={`w-4 h-4 mt-0.5 border-2 rounded-sm flex-shrink-0 flex items-center justify-center ${
                          r.done ? "bg-[#556B4B] border-[#556B4B]" : "border-[#8B7A66]"
                        }`}
                      >
                        {r.done && <span className="text-white text-xs leading-none">✓</span>}
                      </button>
                      <div className="flex-1">
                        <div className={`text-sm ${r.done ? "line-through muted-text" : "ink-text"}`}>{r.milestone}</div>
                        <div className="mono text-xs muted-text mt-0.5">
                          {formatDate(r.due)}{!r.done && days >= 0 && ` · ${days} days`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* === REFLECT TAB === */}
        {tab === "reflect" && (
          <div className="fade-in">
            <div className="mb-8">
              <h2 className="display text-3xl italic mb-2">Today's reflection</h2>
              <p className="muted-text text-sm">One line, one paragraph, whatever. What happened. What mattered. What you learned.</p>
            </div>
            <textarea
              value={data.log[todayStr()] || ""}
              onChange={(e) => saveReflection(e.target.value)}
              placeholder="When I look back on today..."
              className="w-full min-h-[240px] bg-white/60 border soft-border rounded p-4 text-base leading-relaxed"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            />
            <p className="mono text-xs muted-text mt-3 italic">Auto-saves. Come back to this in 6 months and it'll be worth more than you think.</p>

            {Object.keys(data.log).length > 1 && (
              <div className="mt-10">
                <h3 className="display text-xl italic mb-4">Earlier entries</h3>
                <div className="space-y-4">
                  {Object.entries(data.log)
                    .filter(([d]) => d !== todayStr())
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .slice(0, 10)
                    .map(([date, text]) => (
                      <div key={date} className="border-l-2 border-[#C9A96A] pl-4 py-1">
                        <div className="mono text-xs muted-text mb-1">{formatDate(date)}</div>
                        <p className="text-sm ink-text whitespace-pre-wrap leading-relaxed">{text}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t soft-border text-center">
          <p className="mono text-xs muted-text">
            Built as one source of truth · saves automatically · close &amp; return
          </p>
          <p className="display italic text-sm muted-text mt-2">
            "The best way to predict the future is to build it."
          </p>
        </footer>
      </div>
    </div>
  );
}
