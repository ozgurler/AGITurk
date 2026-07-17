import React, { useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  AGITurk — two-sided marketplace prototype                       */
/*  Roles: Job Poster (client)  |  Agent Builder (developer)           */
/*  All data lives in memory — refresh resets the demo.                */
/* ------------------------------------------------------------------ */

const T = {
  bg: "#F4F6F8",
  ink: "#171B21",
  sub: "#5B6472",
  line: "#E3E7EC",
  card: "#FFFFFF",
  teal: "#0B7A66",
  tealSoft: "#E4F2EF",
  amber: "#E8A33D",
  amberSoft: "#FBF1DE",
  red: "#C4483B",
  redSoft: "#F9E9E7",
};

const FONT_DISPLAY = "'Space Grotesk', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', ui-monospace, monospace";

const CATEGORIES = [
  "Customer support",
  "Sales & outreach",
  "Data extraction",
  "Workflow automation",
  "Content generation",
  "Voice agents",
];

const seedBuilders = [
  {
    id: "b1",
    name: "Maya Okonkwo",
    title: "Agent engineer · ex-Stripe",
    rate: 120,
    rating: 4.9,
    jobsDone: 23,
    skills: ["LangGraph", "RAG", "Anthropic API", "Postgres", "Slack apps"],
    bio: "I build production agents with real error handling, evals, and observability — not demos. Most of my work is support and internal-ops agents for B2B SaaS.",
    links: { github: "github.com/mayaok", site: "mayabuilds.dev" },
    portfolio: [
      { title: "Tier-1 support agent for a 40k-user SaaS", desc: "Deflected 62% of tickets, handoff to Zendesk with full context." },
      { title: "Contract-review triage agent", desc: "Flags risky clauses, routes to legal. Built on Claude + custom RAG." },
    ],
  },
  {
    id: "b2",
    name: "Deniz Aksoy",
    title: "Automation studio of one",
    rate: 85,
    rating: 4.7,
    jobsDone: 41,
    skills: ["n8n", "Make", "OpenAI API", "Zapier", "Voice"],
    bio: "Fast, pragmatic builds for small businesses. If it can be automated with an agent plus n8n, I have probably built it twice already.",
    links: { github: "github.com/denizak", site: "denizautomation.co" },
    portfolio: [
      { title: "AI receptionist for a dental group", desc: "Books, reschedules, answers insurance questions by phone." },
    ],
  },
  {
    id: "b3",
    name: "Priya Raman",
    title: "ML engineer → agent consultant",
    rate: 150,
    rating: 5.0,
    jobsDone: 12,
    skills: ["CrewAI", "Fine-tuning", "Evals", "Python", "HubSpot"],
    bio: "I specialize in multi-agent systems with measurable quality bars. Every engagement ships with an eval suite so you know when it regresses.",
    links: { github: "github.com/priyar", site: "raman.consulting" },
    portfolio: [
      { title: "Lead-research crew for an SDR team", desc: "3-agent pipeline: research, qualify, draft. 4x pipeline coverage." },
    ],
  },
];

const seedJobs = [
  {
    id: "j1",
    posterName: "Harbor & Pine Coffee",
    title: "AI receptionist for two cafe locations",
    category: "Voice agents",
    integrations: ["Phone/Twilio", "Square", "Google Calendar"],
    budgetType: "Fixed",
    budgetMin: 2000,
    budgetMax: 4000,
    timeline: "3 weeks",
    status: "Open",
    posted: "2d ago",
    description:
      "We miss ~30 calls a day across two locations. We need a voice agent that answers, shares hours and menu info, takes catering inquiries, and books tastings on our calendar. Must hand off to a human for complaints.",
  },
  {
    id: "j2",
    posterName: "Brightline Legal",
    title: "Intake agent that qualifies personal-injury leads",
    category: "Customer support",
    integrations: ["Web chat", "Clio", "Email"],
    budgetType: "Fixed",
    budgetMin: 5000,
    budgetMax: 8000,
    timeline: "4–6 weeks",
    status: "Open",
    posted: "5d ago",
    description:
      "Chat agent on our site that runs our intake script, scores the lead, pushes qualified cases into Clio, and politely declines out-of-scope matters. Compliance review required before launch.",
  },
  {
    id: "j3",
    posterName: "Cascade Outfitters",
    title: "Agent to monitor competitor pricing daily",
    category: "Data extraction",
    integrations: ["Custom scraping", "Google Sheets", "Slack"],
    budgetType: "Hourly",
    budgetMin: 60,
    budgetMax: 90,
    timeline: "2 weeks",
    status: "Open",
    posted: "1d ago",
    description:
      "Track ~200 SKUs across 6 competitor sites, write to a sheet, and post a Slack digest of price changes every morning. Needs to survive site layout changes without babysitting.",
  },
  {
    id: "j4",
    posterName: "Nomad Payroll",
    title: "Outbound research + first-draft email agent for SDRs",
    category: "Sales & outreach",
    integrations: ["Apollo.io", "HubSpot", "Gmail"],
    budgetType: "Fixed",
    budgetMin: 3500,
    budgetMax: 6000,
    timeline: "1 month",
    status: "Open",
    posted: "1w ago",
    description:
      "For each new Apollo lead: research the company, find a relevant hook, and draft (not send) a first-touch email into HubSpot for SDR review. Quality matters more than volume.",
  },
];

const seedApplications = [
  {
    id: "a1",
    jobId: "j1",
    builderId: "b2",
    cover:
      "I shipped nearly this exact system for a dental group — phone answering, booking, human handoff. I can reuse that architecture and have you live in under 3 weeks.",
    price: 3200,
    delivery: "18 days",
    status: "Shortlisted",
    messages: [
      { from: "poster", text: "Does your dental build handle Spanish callers?" },
      { from: "builder", text: "Yes — it detects language on the first utterance and switches. Happy to demo it live." },
    ],
  },
  {
    id: "a2",
    jobId: "j1",
    builderId: "b1",
    cover:
      "Voice is adjacent to my usual support work, but the booking + handoff logic is identical to systems I run in production. I'd scope a pilot on one location first.",
    price: 3800,
    delivery: "3 weeks",
    status: "New",
    messages: [],
  },
];

/* ----------------------------- atoms ------------------------------ */

const Pill = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: { bg: "#EEF1F4", color: T.sub },
    teal: { bg: T.tealSoft, color: T.teal },
    amber: { bg: T.amberSoft, color: "#9A6A15" },
    red: { bg: T.redSoft, color: T.red },
    ink: { bg: T.ink, color: "#fff" },
  };
  const s = tones[tone] || tones.neutral;
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {children}
    </span>
  );
};

const SpecStrip = ({ job }) => (
  <div
    className="flex flex-wrap gap-x-4 gap-y-1 text-xs"
    style={{ fontFamily: FONT_MONO, color: T.sub }}
  >
    <span>
      <span style={{ color: T.teal }}>budget</span>{" "}
      {job.budgetType === "Hourly"
        ? `$${job.budgetMin}–${job.budgetMax}/hr`
        : `$${job.budgetMin.toLocaleString()}–${job.budgetMax.toLocaleString()}`}
    </span>
    <span>
      <span style={{ color: T.teal }}>timeline</span> {job.timeline}
    </span>
    <span>
      <span style={{ color: T.teal }}>stack</span>{" "}
      {job.integrations.join(" + ").toLowerCase()}
    </span>
  </div>
);

const Btn = ({ children, onClick, kind = "primary", small, disabled }) => {
  const base =
    "rounded-lg font-medium transition-opacity " +
    (small ? "px-3 py-1.5 text-sm " : "px-4 py-2 text-sm ") +
    (disabled ? "opacity-40 cursor-not-allowed " : "hover:opacity-85 ");
  const styles = {
    primary: { background: T.ink, color: "#fff" },
    teal: { background: T.teal, color: "#fff" },
    ghost: { background: "transparent", color: T.ink, border: `1px solid ${T.line}` },
  };
  return (
    <button className={base} style={styles[kind]} onClick={disabled ? undefined : onClick}>
      {children}
    </button>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <div className="mb-1 text-xs font-medium uppercase tracking-wide" style={{ color: T.sub }}>
      {label}
    </div>
    {children}
  </label>
);

const inputCls =
  "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2";
const inputStyle = { borderColor: T.line, background: "#fff", color: T.ink };

const STATUS_FLOW = ["New", "Shortlisted", "Interviewing", "Hired", "Rejected"];
const statusTone = (s) =>
  s === "Hired" ? "teal" : s === "Rejected" ? "red" : s === "New" ? "neutral" : "amber";

/* ------------------------------ app ------------------------------- */

export default function AGITurk() {
  const [role, setRole] = useState(null); // null | 'poster' | 'builder'
  const [view, setView] = useState({ name: "feed" });
  const [jobs, setJobs] = useState(seedJobs);
  const [apps, setApps] = useState(seedApplications);
  const [builders] = useState(seedBuilders);
  const me = { poster: { name: "You (FlyOnIT)", id: "me" }, builder: builders[0] };

  const go = (name, params = {}) => setView({ name, ...params });

  const updateApp = (id, patch) =>
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const addMessage = (appId, from, text) =>
    setApps((prev) =>
      prev.map((a) =>
        a.id === appId ? { ...a, messages: [...a.messages, { from, text }] } : a
      )
    );

  return (
    <div className="min-h-screen" style={{ background: T.bg, color: T.ink, fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
        input:focus, textarea:focus, select:focus { box-shadow: 0 0 0 2px ${T.tealSoft}; border-color: ${T.teal} !important; }
      `}</style>

      {role === null ? (
        <Landing onPick={(r) => { setRole(r); go(r === "poster" ? "posterDash" : "feed"); }} />
      ) : (
        <>
          <Nav role={role} view={view} go={go} onSwitch={() => setRole(null)} />
          <main className="mx-auto max-w-5xl px-4 pb-16 pt-6">
            {view.name === "feed" && (
              <Feed jobs={jobs} go={go} role={role} apps={apps} meBuilder={me.builder} />
            )}
            {view.name === "job" && (
              <JobDetail
                job={jobs.find((j) => j.id === view.id)}
                role={role}
                apps={apps}
                meBuilder={me.builder}
                onApply={(app) => { setApps((p) => [...p, app]); go("builderDash"); }}
                go={go}
              />
            )}
            {view.name === "post" && (
              <PostJob
                onPost={(job) => { setJobs((p) => [job, ...p]); go("posterDash"); }}
              />
            )}
            {view.name === "posterDash" && (
              <PosterDash jobs={jobs} apps={apps} builders={builders} go={go} />
            )}
            {view.name === "pipeline" && (
              <Pipeline
                job={jobs.find((j) => j.id === view.id)}
                apps={apps.filter((a) => a.jobId === view.id)}
                builders={builders}
                updateApp={updateApp}
                addMessage={addMessage}
                go={go}
              />
            )}
            {view.name === "builderDash" && (
              <BuilderDash apps={apps} jobs={jobs} meBuilder={me.builder} addMessage={addMessage} />
            )}
            {view.name === "profile" && (
              <Profile builder={builders.find((b) => b.id === view.id)} go={go} />
            )}
          </main>
        </>
      )}
    </div>
  );
}

/* ---------------------------- landing ----------------------------- */

function Landing({ onPick }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-12">
      <div className="mb-2 text-xs" style={{ fontFamily: FONT_MONO, color: T.teal }}>
        agiturk.v1 — marketplace for working agents
      </div>
      <h1
        className="mb-4 text-4xl font-bold leading-tight md:text-5xl"
        style={{ fontFamily: FONT_DISPLAY }}
      >
        Post the job.
        <br />
        Hire the person who ships the agent.
      </h1>
      <p className="mb-10 max-w-xl text-base" style={{ color: T.sub }}>
        A two-sided board where businesses describe the AI agent they need, and
        builders apply with a price, a timeline, and proof they've shipped
        before.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <RoleCard
          eyebrow="I need an agent built"
          title="Post a job"
          desc="Describe the workflow, set a budget, review applications, hire."
          onClick={() => onPick("poster")}
        />
        <RoleCard
          eyebrow="I build agents"
          title="Find agent work"
          desc="Browse specs, apply with a proposal, message clients directly."
          onClick={() => onPick("builder")}
        />
      </div>
      <div className="mt-10 text-xs" style={{ color: T.sub }}>
        Demo prototype — data resets on refresh. Switch roles anytime from the top bar.
      </div>
    </div>
  );
}

function RoleCard({ eyebrow, title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border p-6 text-left transition-transform hover:-translate-y-0.5"
      style={{ background: T.card, borderColor: T.line }}
    >
      <div className="mb-1 text-xs" style={{ fontFamily: FONT_MONO, color: T.teal }}>
        {eyebrow}
      </div>
      <div className="mb-1 text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>
        {title} →
      </div>
      <div className="text-sm" style={{ color: T.sub }}>{desc}</div>
    </button>
  );
}

/* ------------------------------ nav ------------------------------- */

function Nav({ role, view, go, onSwitch }) {
  const tabs =
    role === "poster"
      ? [
          { id: "posterDash", label: "My jobs" },
          { id: "post", label: "Post a job" },
          { id: "feed", label: "Browse board" },
        ]
      : [
          { id: "feed", label: "Job board" },
          { id: "builderDash", label: "My applications" },
        ];
  return (
    <header className="sticky top-0 z-10 border-b" style={{ background: T.card, borderColor: T.line }}>
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
        <div className="text-base font-bold" style={{ fontFamily: FONT_DISPLAY }}>
          AGI<span style={{ color: T.teal }}>Turk</span>
        </div>
        <nav className="flex flex-1 gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => go(t.id)}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium"
              style={
                view.name === t.id
                  ? { background: T.ink, color: "#fff" }
                  : { color: T.sub }
              }
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Pill tone="teal">{role === "poster" ? "Job poster" : "Builder"}</Pill>
          <button className="text-xs underline" style={{ color: T.sub }} onClick={onSwitch}>
            switch role
          </button>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------ feed ------------------------------ */

function Feed({ jobs, go, role, apps, meBuilder }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const filtered = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (cat === "All" || j.category === cat) &&
          (q === "" ||
            (j.title + j.description + j.integrations.join(" "))
              .toLowerCase()
              .includes(q.toLowerCase()))
      ),
    [jobs, q, cat]
  );
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>
        Open agent jobs
      </h2>
      <div className="mb-4 flex flex-col gap-2 md:flex-row">
        <input
          className={inputCls}
          style={inputStyle}
          placeholder="Search title, description, integrations…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className={inputCls + " md:w-56"}
          style={inputStyle}
          value={cat}
          onChange={(e) => setCat(e.target.value)}
        >
          <option>All</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map((j) => {
          const applied =
            role === "builder" &&
            apps.some((a) => a.jobId === j.id && a.builderId === meBuilder.id);
          return (
            <button
              key={j.id}
              onClick={() => go("job", { id: j.id })}
              className="rounded-2xl border p-5 text-left transition-transform hover:-translate-y-0.5"
              style={{ background: T.card, borderColor: T.line }}
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Pill tone="neutral">{j.category}</Pill>
                <span className="text-xs" style={{ color: T.sub }}>
                  {j.posterName} · {j.posted}
                </span>
                {applied && <Pill tone="teal">Applied</Pill>}
              </div>
              <div className="mb-1 text-lg font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                {j.title}
              </div>
              <p className="mb-3 line-clamp-2 text-sm" style={{ color: T.sub }}>
                {j.description}
              </p>
              <SpecStrip job={j} />
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-2xl border p-8 text-center text-sm" style={{ borderColor: T.line, color: T.sub }}>
            No jobs match. Clear the search or try another category.
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------- job detail --------------------------- */

function JobDetail({ job, role, apps, meBuilder, onApply, go }) {
  const [cover, setCover] = useState("");
  const [price, setPrice] = useState("");
  const [delivery, setDelivery] = useState("");
  if (!job) return null;
  const alreadyApplied = apps.some(
    (a) => a.jobId === job.id && a.builderId === meBuilder.id
  );
  const submit = () =>
    onApply({
      id: "a" + Math.random().toString(36).slice(2, 7),
      jobId: job.id,
      builderId: meBuilder.id,
      cover,
      price: Number(price) || 0,
      delivery,
      status: "New",
      messages: [],
    });
  return (
    <div className="mx-auto max-w-3xl">
      <button className="mb-4 text-sm underline" style={{ color: T.sub }} onClick={() => go("feed")}>
        ← Back to board
      </button>
      <div className="rounded-2xl border p-6" style={{ background: T.card, borderColor: T.line }}>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Pill tone="neutral">{job.category}</Pill>
          <span className="text-xs" style={{ color: T.sub }}>
            {job.posterName} · {job.posted}
          </span>
        </div>
        <h2 className="mb-2 text-2xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>
          {job.title}
        </h2>
        <SpecStrip job={job} />
        <p className="mt-4 text-sm leading-relaxed">{job.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.integrations.map((i) => (
            <Pill key={i}>{i}</Pill>
          ))}
        </div>
      </div>

      {role === "builder" && (
        <div className="mt-4 rounded-2xl border p-6" style={{ background: T.card, borderColor: T.line }}>
          <h3 className="mb-3 text-lg font-bold" style={{ fontFamily: FONT_DISPLAY }}>
            {alreadyApplied ? "Application sent" : "Apply to this job"}
          </h3>
          {alreadyApplied ? (
            <p className="text-sm" style={{ color: T.sub }}>
              You've applied. Track it under <b>My applications</b>.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <Field label="Cover letter">
                <textarea
                  className={inputCls}
                  style={inputStyle}
                  rows={4}
                  placeholder="Why you, in the client's language — what have you shipped that's close to this?"
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={job.budgetType === "Hourly" ? "Proposed rate ($/hr)" : "Proposed price ($)"}>
                  <input
                    className={inputCls}
                    style={inputStyle}
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Field>
                <Field label="Estimated delivery">
                  <input
                    className={inputCls}
                    style={inputStyle}
                    placeholder="e.g. 3 weeks"
                    value={delivery}
                    onChange={(e) => setDelivery(e.target.value)}
                  />
                </Field>
              </div>
              <div>
                <Btn kind="teal" onClick={submit} disabled={!cover || !price || !delivery}>
                  Submit application
                </Btn>
              </div>
            </div>
          )}
        </div>
      )}

      {role === "poster" && (
        <div className="mt-4 text-sm" style={{ color: T.sub }}>
          Viewing as a poster — applications for your own jobs live in <b>My jobs</b>.
        </div>
      )}
    </div>
  );
}

/* ---------------------------- post job ---------------------------- */

function PostJob({ onPost }) {
  const [f, setF] = useState({
    title: "",
    category: CATEGORIES[0],
    description: "",
    integrations: "",
    budgetType: "Fixed",
    budgetMin: "",
    budgetMax: "",
    timeline: "",
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.title && f.description && f.budgetMin && f.budgetMax && f.timeline;
  const submit = () =>
    onPost({
      id: "j" + Math.random().toString(36).slice(2, 7),
      posterName: "You (FlyOnIT)",
      title: f.title,
      category: f.category,
      integrations: f.integrations
        ? f.integrations.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Unspecified"],
      budgetType: f.budgetType,
      budgetMin: Number(f.budgetMin),
      budgetMax: Number(f.budgetMax),
      timeline: f.timeline,
      status: "Open",
      posted: "just now",
      description: f.description,
      mine: true,
    });
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>
        Post an agent job
      </h2>
      <div className="flex flex-col gap-4 rounded-2xl border p-6" style={{ background: T.card, borderColor: T.line }}>
        <Field label="Job title">
          <input className={inputCls} style={inputStyle} placeholder="e.g. AI receptionist for two cafe locations" value={f.title} onChange={set("title")} />
        </Field>
        <Field label="Category">
          <select className={inputCls} style={inputStyle} value={f.category} onChange={set("category")}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="What should the agent do?">
          <textarea className={inputCls} style={inputStyle} rows={5} placeholder="Describe the workflow, the systems it touches, and what success looks like." value={f.description} onChange={set("description")} />
        </Field>
        <Field label="Required integrations (comma-separated)">
          <input className={inputCls} style={inputStyle} placeholder="Slack, HubSpot, custom API…" value={f.integrations} onChange={set("integrations")} />
        </Field>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Field label="Budget type">
            <select className={inputCls} style={inputStyle} value={f.budgetType} onChange={set("budgetType")}>
              <option>Fixed</option>
              <option>Hourly</option>
            </select>
          </Field>
          <Field label="Budget min ($)">
            <input className={inputCls} style={inputStyle} type="number" value={f.budgetMin} onChange={set("budgetMin")} />
          </Field>
          <Field label="Budget max ($)">
            <input className={inputCls} style={inputStyle} type="number" value={f.budgetMax} onChange={set("budgetMax")} />
          </Field>
          <Field label="Timeline">
            <input className={inputCls} style={inputStyle} placeholder="3 weeks" value={f.timeline} onChange={set("timeline")} />
          </Field>
        </div>
        <div>
          <Btn kind="teal" onClick={submit} disabled={!valid}>
            Publish job
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* -------------------------- poster dash --------------------------- */

function PosterDash({ jobs, apps, builders, go }) {
  const mine = jobs.filter((j) => j.mine || j.id === "j1"); // j1 is the demo "your job"
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>
          My jobs
        </h2>
        <Btn kind="teal" small onClick={() => go("post")}>
          + Post a job
        </Btn>
      </div>
      <div className="flex flex-col gap-3">
        {mine.map((j) => {
          const jApps = apps.filter((a) => a.jobId === j.id);
          return (
            <button
              key={j.id}
              onClick={() => go("pipeline", { id: j.id })}
              className="rounded-2xl border p-5 text-left transition-transform hover:-translate-y-0.5"
              style={{ background: T.card, borderColor: T.line }}
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Pill tone={j.status === "Open" ? "teal" : "neutral"}>{j.status}</Pill>
                <span className="text-xs" style={{ color: T.sub }}>{j.posted}</span>
              </div>
              <div className="mb-1 text-lg font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                {j.title}
              </div>
              <div className="text-sm" style={{ color: T.sub }}>
                {jApps.length} application{jApps.length !== 1 && "s"}
                {jApps.length > 0 &&
                  " · " +
                    STATUS_FLOW.filter((s) => jApps.some((a) => a.status === s))
                      .map((s) => `${jApps.filter((a) => a.status === s).length} ${s.toLowerCase()}`)
                      .join(", ")}
              </div>
            </button>
          );
        })}
        {mine.length === 0 && (
          <div className="rounded-2xl border p-8 text-center text-sm" style={{ borderColor: T.line, color: T.sub }}>
            No jobs yet. Post your first agent job to start receiving applications.
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------- pipeline ---------------------------- */

function Pipeline({ job, apps, builders, updateApp, addMessage, go }) {
  const [openMsg, setOpenMsg] = useState(null);
  const [draft, setDraft] = useState("");
  if (!job) return null;
  return (
    <div className="mx-auto max-w-3xl">
      <button className="mb-4 text-sm underline" style={{ color: T.sub }} onClick={() => go("posterDash")}>
        ← My jobs
      </button>
      <h2 className="mb-1 text-2xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>
        {job.title}
      </h2>
      <div className="mb-5">
        <SpecStrip job={job} />
      </div>
      <div className="flex flex-col gap-3">
        {apps.map((a) => {
          const b = builders.find((x) => x.id === a.builderId);
          return (
            <div key={a.id} className="rounded-2xl border p-5" style={{ background: T.card, borderColor: T.line }}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <button className="text-left" onClick={() => go("profile", { id: b.id })}>
                  <div className="font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                    {b.name} <span className="text-xs font-normal underline" style={{ color: T.teal }}>view profile</span>
                  </div>
                  <div className="text-xs" style={{ color: T.sub }}>
                    ★ {b.rating} · {b.jobsDone} jobs · ${b.rate}/hr
                  </div>
                </button>
                <Pill tone={statusTone(a.status)}>{a.status}</Pill>
              </div>
              <p className="mb-2 text-sm">{a.cover}</p>
              <div className="mb-3 text-xs" style={{ fontFamily: FONT_MONO, color: T.sub }}>
                <span style={{ color: T.teal }}>bid</span> ${a.price.toLocaleString()}{" "}
                <span style={{ color: T.teal }}>· delivery</span> {a.delivery}
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_FLOW.filter((s) => s !== a.status).map((s) => (
                  <Btn key={s} kind={s === "Hired" ? "teal" : "ghost"} small onClick={() => updateApp(a.id, { status: s })}>
                    {s === "Rejected" ? "Reject" : "Move to " + s}
                  </Btn>
                ))}
                <Btn kind="ghost" small onClick={() => setOpenMsg(openMsg === a.id ? null : a.id)}>
                  Message ({a.messages.length})
                </Btn>
              </div>
              {openMsg === a.id && (
                <div className="mt-3 rounded-xl border p-3" style={{ borderColor: T.line, background: T.bg }}>
                  {a.messages.map((m, i) => (
                    <div key={i} className="mb-2 text-sm">
                      <span className="font-medium">{m.from === "poster" ? "You" : b.name.split(" ")[0]}:</span>{" "}
                      {m.text}
                    </div>
                  ))}
                  {a.messages.length === 0 && (
                    <div className="mb-2 text-xs" style={{ color: T.sub }}>No messages yet.</div>
                  )}
                  <div className="flex gap-2">
                    <input
                      className={inputCls}
                      style={inputStyle}
                      placeholder="Write a message…"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                    />
                    <Btn
                      small
                      onClick={() => {
                        if (!draft.trim()) return;
                        addMessage(a.id, "poster", draft.trim());
                        setDraft("");
                      }}
                    >
                      Send
                    </Btn>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {apps.length === 0 && (
          <div className="rounded-2xl border p-8 text-center text-sm" style={{ borderColor: T.line, color: T.sub }}>
            No applications yet. Builders on the board can see this job now.
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------- builder dash -------------------------- */

function BuilderDash({ apps, jobs, meBuilder, addMessage }) {
  const mine = apps.filter((a) => a.builderId === meBuilder.id);
  const [openMsg, setOpenMsg] = useState(null);
  const [draft, setDraft] = useState("");
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>
        My applications
      </h2>
      <div className="flex flex-col gap-3">
        {mine.map((a) => {
          const j = jobs.find((x) => x.id === a.jobId);
          return (
            <div key={a.id} className="rounded-2xl border p-5" style={{ background: T.card, borderColor: T.line }}>
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold" style={{ fontFamily: FONT_DISPLAY }}>{j.title}</div>
                <Pill tone={statusTone(a.status)}>{a.status}</Pill>
              </div>
              <div className="mb-2 text-xs" style={{ color: T.sub }}>{j.posterName}</div>
              <div className="mb-3 text-xs" style={{ fontFamily: FONT_MONO, color: T.sub }}>
                <span style={{ color: T.teal }}>your bid</span> ${a.price.toLocaleString()}{" "}
                <span style={{ color: T.teal }}>· delivery</span> {a.delivery}
              </div>
              <Btn kind="ghost" small onClick={() => setOpenMsg(openMsg === a.id ? null : a.id)}>
                Messages ({a.messages.length})
              </Btn>
              {openMsg === a.id && (
                <div className="mt-3 rounded-xl border p-3" style={{ borderColor: T.line, background: T.bg }}>
                  {a.messages.map((m, i) => (
                    <div key={i} className="mb-2 text-sm">
                      <span className="font-medium">{m.from === "builder" ? "You" : "Client"}:</span> {m.text}
                    </div>
                  ))}
                  {a.messages.length === 0 && (
                    <div className="mb-2 text-xs" style={{ color: T.sub }}>No messages yet.</div>
                  )}
                  <div className="flex gap-2">
                    <input
                      className={inputCls}
                      style={inputStyle}
                      placeholder="Reply to the client…"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                    />
                    <Btn
                      small
                      onClick={() => {
                        if (!draft.trim()) return;
                        addMessage(a.id, "builder", draft.trim());
                        setDraft("");
                      }}
                    >
                      Send
                    </Btn>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {mine.length === 0 && (
          <div className="rounded-2xl border p-8 text-center text-sm" style={{ borderColor: T.line, color: T.sub }}>
            You haven't applied to anything yet. Head to the job board and submit your first proposal.
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- profile ---------------------------- */

function Profile({ builder, go }) {
  if (!builder) return null;
  return (
    <div className="mx-auto max-w-2xl">
      <button className="mb-4 text-sm underline" style={{ color: T.sub }} onClick={() => window.history.length && go("posterDash")}>
        ← Back
      </button>
      <div className="rounded-2xl border p-6" style={{ background: T.card, borderColor: T.line }}>
        <div className="mb-1 text-2xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>
          {builder.name}
        </div>
        <div className="mb-2 text-sm" style={{ color: T.sub }}>{builder.title}</div>
        <div className="mb-4 text-xs" style={{ fontFamily: FONT_MONO, color: T.sub }}>
          <span style={{ color: T.teal }}>rating</span> ★ {builder.rating}{" "}
          <span style={{ color: T.teal }}>· jobs</span> {builder.jobsDone}{" "}
          <span style={{ color: T.teal }}>· rate</span> ${builder.rate}/hr
        </div>
        <p className="mb-4 text-sm leading-relaxed">{builder.bio}</p>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {builder.skills.map((s) => (
            <Pill key={s}>{s}</Pill>
          ))}
        </div>
        <div className="mb-4 text-xs" style={{ fontFamily: FONT_MONO, color: T.sub }}>
          {builder.links.github} · {builder.links.site}
        </div>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide" style={{ color: T.sub }}>
          Portfolio
        </h3>
        <div className="flex flex-col gap-3">
          {builder.portfolio.map((p) => (
            <div key={p.title} className="rounded-xl border p-4" style={{ borderColor: T.line }}>
              <div className="mb-1 font-semibold" style={{ fontFamily: FONT_DISPLAY }}>{p.title}</div>
              <div className="text-sm" style={{ color: T.sub }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
