import React, { useState, useEffect, useRef } from "react";
import {
  Calculator,
  Cloud,
  MapPin,
  Users,
  FileBarChart,
  Layers,
  ChevronDown,
  ArrowRight,
  Check,
  Ruler,
  HardHat,
  Compass,
  TrendingUp,
  Home as HomeIcon,
  UploadCloud,
  ClipboardCheck,
  Send,
  Quote,
} from "lucide-react";
import logo from "../assets/precisestimationLogo.png";
// ---- Design tokens -------------------------------------------------------
const T = {
  bg: "#0E2233",
  bgPanel: "#14304A",
  bgPanelAlt: "#102A40",
  line: "#254A68",
  lineFaint: "#1B394F",
  cyan: "#8FD8EC",
  cyanDim: "#5B93A6",
  amber: "#F0A83B",
  amberDim: "#C6852B",
  text: "#EAF3F8",
  textMuted: "#93AEC1",
  textFaint: "#5F7C90",
};

const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
`;

// ---- Hero live estimate ticker ------------------------------------------
const LINE_ITEMS = [
  { label: "Site prep & excavation", amount: 8420 },
  { label: "Foundation & slab", amount: 21750 },
  { label: "Framing & structure", amount: 34980 },
  { label: "Roofing & envelope", amount: 18300 },
  { label: "Electrical rough-in", amount: 11650 },
  { label: "Plumbing rough-in", amount: 9870 },
  { label: "Insulation & linings", amount: 12440 },
  { label: "Fixtures & finishes", amount: 15980 },
];

function useLiveEstimate() {
  const [visibleCount, setVisibleCount] = useState(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion.current) {
      setVisibleCount(LINE_ITEMS.length);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      if (i > LINE_ITEMS.length) {
        i = 0;
      }
      setVisibleCount(i);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const items = LINE_ITEMS.slice(0, visibleCount);
  const total = items.reduce((sum, it) => sum + it.amount, 0);
  return { items, total, visibleCount };
}

function fmt(n) {
  return n.toLocaleString("en-AU", { maximumFractionDigits: 0 });
}

// ---- Blueprint grid backdrop --------------------------------------------
function BlueprintGrid({ opacity = 0.5 }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="grid-minor"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 24 0 L 0 0 0 24"
            fill="none"
            stroke={T.lineFaint}
            strokeWidth="1"
          />
        </pattern>
        <pattern
          id="grid-major"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <rect width="120" height="120" fill="url(#grid-minor)" />
          <path
            d="M 120 0 L 0 0 0 120"
            fill="none"
            stroke={T.line}
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-major)" />
    </svg>
  );
}

// ---- Small building blocks ------------------------------------------------
function Eyebrow({ children }) {
  return (
    <div
      className="inline-flex items-center gap-2 mb-4"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        letterSpacing: "0.14em",
      }}
    >
      <span style={{ color: T.amber }}>{"//"}</span>
      <span style={{ color: T.cyanDim, textTransform: "uppercase" }}>
        {children}
      </span>
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  href = "#",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  const styles =
    variant === "primary"
      ? { background: T.amber, color: "#1A1204" }
      : variant === "outline"
        ? {
            background: "transparent",
            color: T.text,
            border: `1px solid ${T.line}`,
          }
        : { background: "transparent", color: T.cyan };
  return (
    <a
      href={href}
      className={base + " " + className}
      style={{
        ...styles,
        fontFamily: "'Inter', sans-serif",
        outlineColor: T.amber,
      }}
      onMouseEnter={(e) => {
        if (variant === "primary") e.currentTarget.style.background = "#FFC066";
        if (variant === "outline") e.currentTarget.style.borderColor = T.cyan;
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") e.currentTarget.style.background = T.amber;
        if (variant === "outline") e.currentTarget.style.borderColor = T.line;
      }}
      {...props}
    >
      {children}
    </a>
  );
}

// ---- Nav -------------------------------------------------------------------
function Nav() {
  const links = ["Overview", "Features", "How it works", "FAQ"];
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur"
      style={{
        background: "rgba(14,34,51,0.85)",
        borderBottom: `1px solid ${T.line}`,
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <img src={logo} width={200} height={150} className="rounded-lg"></img>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                color: T.textMuted,
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
              }}
              className="hover:opacity-100 transition-opacity"
              onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
            >
              {l}
            </a>
          ))}
        </nav>
        <div className="hidden sm:block">
          <Button
            variant="primary"
            href="#contact"
            className="!px-5 !py-2.5 text-xs"
          >
            Request a demo
          </Button>
        </div>
      </div>
    </header>
  );
}

// ---- Hero --------------------------------------------------------------
function Hero() {
  const { items, total, visibleCount } = useLiveEstimate();

  return (
    <section className="relative overflow-hidden" style={{ background: T.bg }}>
      <BlueprintGrid opacity={0.6} />
      <div
        className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${T.cyanDim}22 0%, transparent 70%)`,
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <Eyebrow>Construction cost estimating</Eyebrow>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: T.text,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
            }}
            className="text-4xl md:text-5xl mb-6"
          >
            Scope it right.
            <br />
            Price it <span style={{ color: T.amber }}>once.</span>
          </h1>
          <p
            style={{
              color: T.textMuted,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.7,
            }}
            className="text-base md:text-lg max-w-md mb-8"
          >
            Precisestimation turns a job brief into a defensible,
            line-by-line cost estimate in minutes — built on live regional
            material and labour pricing, not last year's spreadsheet.
          </p>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <Button variant="primary" href="#contact">
              Talk to sales
            </Button>
          </div>
        </div>

        {/* Signature element: live-building estimate panel */}
        <div
          className="relative"
          style={{
            background: T.bgPanel,
            border: `1px solid ${T.line}`,
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: `1px solid ${T.line}` }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: T.textFaint,
                letterSpacing: "0.08em",
              }}
            >
              ESTIMATE — 3 BED RENOVATION
            </span>
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: T.amber,
                boxShadow: `0 0 0 3px ${T.amber}33`,
              }}
            />
          </div>
          <div className="px-5 pt-4 pb-2 min-h-[280px]">
            {items.map((it, i) => (
              <div
                key={it.label}
                className="flex items-center justify-between py-2"
                style={{
                  borderBottom:
                    i === items.length - 1
                      ? "none"
                      : `1px dashed ${T.lineFaint}`,
                  animation: "fadeSlideIn 0.4s ease-out",
                }}
              >
                <span
                  style={{
                    color: T.textMuted,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13.5,
                  }}
                >
                  {it.label}
                </span>
                <span
                  style={{
                    color: T.text,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 13.5,
                  }}
                >
                  ${fmt(it.amount)}
                </span>
              </div>
            ))}
          </div>
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{
              borderTop: `1px solid ${T.line}`,
              background: T.bgPanelAlt,
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: T.textMuted,
              }}
            >
              {visibleCount >= LINE_ITEMS.length
                ? "Estimated total"
                : "Calculating\u2026"}
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 22,
                fontWeight: 600,
                color: T.amber,
              }}
            >
              ${fmt(total)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Overview / trust strip ----------------------------------------------
function Overview() {
  const stats = [
    { value: "12,000+", label: "priced components" },
    { value: "Weekly", label: "regional data refresh" },
    { value: "1 minute", label: "avg. line item lookup" },
  ];
  return (
    <section
      id="overview"
      className="relative"
      style={{
        background: T.bgPanelAlt,
        borderTop: `1px solid ${T.line}`,
        borderBottom: `1px solid ${T.line}`,
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <Eyebrow>Overview</Eyebrow>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: T.text,
              fontWeight: 700,
            }}
            className="text-2xl md:text-3xl mb-4"
          >
            Estimates built on real pricing, not guesswork
          </h2>
          <p
            style={{
              color: T.textMuted,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.75,
            }}
            className="mb-4"
          >
            Precisestimation is a cloud-based costing platform for builders,
            estimators and developers who need to scope a job fast and stand
            behind the number. Every material and labour rate is tied to
            region-specific data, so a quote for Ballarat doesn't quietly use
            Brisbane prices.
          </p>
          <p
            style={{
              color: T.textMuted,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.75,
            }}
          >
            Adjust for site access, terrain, climate zone and other conditions
            that actually move a budget — then export a report your client or
            lender can read without a phone call.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-5"
              style={{ background: T.bgPanel, border: `1px solid ${T.line}` }}
            >
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: T.cyan,
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  color: T.textFaint,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12.5,
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Who it's built for ----------------------------------------------
function WhoWeServe() {
  const segments = [
    {
      icon: HardHat,
      title: "Builders",
      desc: "Turn a set of drawings into material and labour numbers you can bid on the same day — not the same week.",
    },
    {
      icon: Compass,
      title: "Architects & designers",
      desc: "Keep a concept inside budget from the first sketch, with cost feedback before it turns into a redesign.",
    },
    {
      icon: TrendingUp,
      title: "Developers",
      desc: "Run feasibility and budget forecasts fast enough to compare sites and options before committing capital.",
    },
    {
      icon: HomeIcon,
      title: "Homeowners",
      desc: "Get an independent read on real market rates before you sign off on a renovation or new build quote.",
    },
  ];
  return (
    <section
      className="relative"
      style={{ background: T.bgPanelAlt, borderTop: `1px solid ${T.line}` }}
    >
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <Eyebrow>Who it's for</Eyebrow>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: T.text,
              fontWeight: 700,
            }}
            className="text-2xl md:text-3xl"
          >
            Built for everyone who has to answer "what will it cost?"
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {segments.map((s) => (
            <div
              key={s.title}
              className="p-6 flex flex-col items-center justify-center"
              style={{ background: T.bgPanel, border: `1px solid ${T.line}` }}
            >
              <s.icon size={22} color={T.cyan} strokeWidth={1.75} />
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: T.text,
                  fontWeight: 600,
                }}
                className="text-base mt-4 mb-2"
              >
                {s.title}
              </h3>
              <p
                style={{
                  color: T.textMuted,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- How it works ------------------------------------------------------
function HowItWorks() {
  const steps = [
    {
      icon: UploadCloud,
      title: "Upload your plans",
      desc: "Drop in drawings, a scope note, or start from a blank estimate — whatever you've got to work with.",
    },
    {
      icon: ClipboardCheck,
      title: "Review the auto-priced scope",
      desc: "Precisestimation breaks the job into priced line items using live regional rates. Adjust anything by hand.",
    },
    {
      icon: Send,
      title: "Export and send",
      desc: "Generate a clean PDF or Excel breakdown ready for a client, lender, or tender submission.",
    },
  ];
  return (
    <section
      id="how-it-works"
      className="relative"
      style={{ background: T.bg }}
    >
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <Eyebrow>How it works</Eyebrow>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: T.text,
              fontWeight: 700,
            }}
            className="text-2xl md:text-3xl"
          >
            From plans to priced estimate, in three steps
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.title} className="relative pl-14">
              <div
                className="absolute left-0 top-0 w-9 h-9 flex items-center justify-center"
                style={{ border: `1px solid ${T.amberDim}`, color: T.amber }}
              >
                <s.icon size={17} strokeWidth={1.75} />
              </div>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  color: T.textFaint,
                  letterSpacing: "0.1em",
                }}
              >
                STEP {i + 1}
              </span>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: T.text,
                  fontWeight: 600,
                }}
                className="text-lg mt-1 mb-2"
              >
                {s.title}
              </h3>
              <p
                style={{
                  color: T.textMuted,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Testimonials --------------------------------------------------------
function Testimonials() {
  const quotes = [
    {
      text: "We used to spend a full day pricing a tender. Now it's closer to an hour, and the numbers hold up when a client pushes back on them.",
      name: "J. Whitfield",
      role: "Residential Builder, Geelong",
    },
    {
      text: "The regional pricing is what sold me. A framing estimate for a coastal job finally didn't look like it was priced for the city.",
      name: "R. Nazari",
      role: "Estimator, Commercial Fit-out",
    },
    {
      text: "Our whole team estimates off the same live job now instead of three different spreadsheets floating around.",
      name: "T. Okafor",
      role: "Project Manager, Developer",
    },
  ];
  return (
    <section
      className="relative"
      style={{ background: T.bgPanelAlt, borderTop: `1px solid ${T.line}` }}
    >
      <div className="max-w-6xl mx-auto px-6 py-20">
        <Eyebrow>What builders say</Eyebrow>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: T.text,
            fontWeight: 700,
          }}
          className="text-2xl md:text-3xl mb-12"
        >
          Trusted by teams who bid for a living
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {quotes.map((q) => (
            <div
              key={q.name}
              className="p-6 flex flex-col"
              style={{ background: T.bgPanel, border: `1px solid ${T.line}` }}
            >
              <Quote size={20} color={T.amberDim} />
              <p
                style={{
                  color: T.textMuted,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
                className="my-4 flex-1"
              >
                {q.text}
              </p>
              <div
                style={{ borderTop: `1px solid ${T.line}` }}
                className="pt-3"
              >
                <div
                  style={{
                    color: T.text,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13.5,
                    fontWeight: 600,
                  }}
                >
                  {q.name}
                </div>
                <div
                  style={{
                    color: T.textFaint,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                  }}
                >
                  {q.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Capability cards -----------------------------------------------------
function Capabilities() {
  const cards = [
    {
      icon: Calculator,
      title: "Smarter scoping",
      desc: "Break a job into priced components before you commit to a number.",
    },
    {
      icon: Cloud,
      title: "Faster estimating",
      desc: "Automated takeoffs and rate lookups cut hours of manual pricing.",
    },
    {
      icon: FileBarChart,
      title: "Tighter cost control",
      desc: "Track margin and feasibility as the estimate takes shape, not after.",
    },
    {
      icon: Users,
      title: "Built for teams",
      desc: "Co-edit an estimate live so nobody's working off a stale version.",
    },
  ];
  return (
    <section className="relative" style={{ background: T.bg }}>
      <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <div
            key={c.title}
            className="p-6 flex flex-col items-center transition-colors duration-150"
            style={{ background: T.bgPanel, border: `1px solid ${T.line}` }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = T.cyanDim)
            }
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.line)}
          >
            <c.icon size={22} color={T.amber} strokeWidth={1.75} />
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: T.text,
                fontWeight: 600,
              }}
              className="text-base mt-4 mb-2"
            >
              {c.title}
            </h3>
            <p
              style={{
                color: T.textMuted,
                fontFamily: "'Inter', sans-serif",
                fontSize: 13.5,
                lineHeight: 1.6,
              }}
            >
              {c.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---- Features ---------------------------------------------------------
function Features() {
  const feats = [
    {
      icon: Cloud,
      title: "Cloud-based, anywhere",
      desc: "Price a job from the site, the office or the ute — estimates sync the moment you're back online.",
    },
    {
      icon: Layers,
      title: "Prebuilt estimating templates",
      desc: "Standardise recurring job types with reusable task, material and labour templates.",
    },
    {
      icon: MapPin,
      title: "Site-condition adjustments",
      desc: "Factor in access, terrain, climate zone and other local conditions that move the budget.",
    },
    {
      icon: FileBarChart,
      title: "Client-ready reporting",
      desc: "Export a clean, itemised report you can hand to a client, lender or insurer as-is.",
    },
  ];
  return (
    <section
      id="features"
      className="relative"
      style={{ background: T.bgPanelAlt, borderTop: `1px solid ${T.line}` }}
    >
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <Eyebrow>Features</Eyebrow>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: T.text,
              fontWeight: 700,
            }}
            className="text-2xl md:text-3xl"
          >
            Automated cost calculations
          </h2>
          <p
            style={{
              color: T.textMuted,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.7,
            }}
            className="mt-3"
          >
            Less time re-keying numbers, more time on the parts of the job that
            actually need your judgement.
          </p>
        </div>
        <div
          className="grid md:grid-cols-2 gap-px"
          style={{ background: T.line }}
        >
          {feats.map((f) => (
            <div
              key={f.title}
              className="p-8 flex flex-col items-center"
              style={{ background: T.bgPanelAlt }}
            >
              <f.icon size={20} color={T.cyan} strokeWidth={1.75} />
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: T.text,
                  fontWeight: 600,
                }}
                className="text-lg mt-4 mb-2"
              >
                {f.title}
              </h3>
              <p
                style={{
                  color: T.textMuted,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.65,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Pricing ---------------------------------------------------------
function Pricing() {
  const [annual, setAnnual] = useState(false);
  const plans = [
    {
      name: "Scope Lite",
      blurb: "For sole traders and small crews pricing residential jobs.",
      monthly: 149,
      users: "1 user",
      features: [
        "Material cost data",
        "1 region",
        "Standard templates",
        "Email support",
      ],
      highlight: false,
    },
    {
      name: "Scope Pro",
      blurb: "Best value — for growing builders and estimating teams.",
      monthly: 219,
      users: "Up to 5 users",
      features: [
        "Material + labour cost data",
        "3 regions",
        "Custom templates",
        "Site-condition adjustments",
        "Priority support",
      ],
      highlight: true,
    },
    {
      name: "Scope Business",
      blurb: "For larger firms needing national coverage and controls.",
      monthly: 399,
      users: "Unlimited users",
      features: [
        "Full national data",
        "All regions",
        "Team collaboration & permissions",
        "Reporting exports",
        "Dedicated account manager",
      ],
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="relative" style={{ background: T.bg }}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <Eyebrow>Pricing</Eyebrow>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: T.text,
                fontWeight: 700,
              }}
              className="text-2xl md:text-3xl"
            >
              Plans that scale with your jobs
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: annual ? T.textFaint : T.text,
              }}
            >
              Monthly
            </span>
            <button
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual((a) => !a)}
              className="relative w-11 h-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: annual ? T.amber : T.line,
                outlineColor: T.amber,
              }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 bg-white transition-transform"
                style={{
                  transform: annual ? "translateX(22px)" : "translateX(2px)",
                }}
              />
            </button>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: annual ? T.text : T.textFaint,
              }}
            >
              Annual <span style={{ color: T.cyan }}>(save 15%)</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((p) => {
            const price = annual ? Math.round(p.monthly * 0.85) : p.monthly;
            return (
              <div
                key={p.name}
                className="p-7 flex flex-col"
                style={{
                  background: p.highlight ? T.bgPanel : "transparent",
                  border: `1px solid ${p.highlight ? T.amberDim : T.line}`,
                }}
              >
                {p.highlight && (
                  <span
                    className="self-start mb-4 px-2 py-1"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      color: "#1A1204",
                      background: T.amber,
                    }}
                  >
                    BEST VALUE
                  </span>
                )}
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: T.text,
                    fontWeight: 700,
                  }}
                  className="text-xl mb-1"
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    color: T.textMuted,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13.5,
                    lineHeight: 1.6,
                  }}
                  className="mb-5"
                >
                  {p.blurb}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: T.text,
                      fontSize: 32,
                      fontWeight: 600,
                    }}
                  >
                    ${price}
                  </span>
                  <span
                    style={{
                      color: T.textFaint,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                    }}
                  >
                    /mth
                  </span>
                </div>
                <div
                  style={{
                    color: T.textFaint,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12.5,
                  }}
                  className="mb-6"
                >
                  {p.users} · billed {annual ? "annually" : "monthly"}
                </div>
                <ul className="flex-1 space-y-3 mb-7">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check
                        size={15}
                        color={T.cyan}
                        className="mt-0.5 flex-shrink-0"
                      />
                      <span
                        style={{
                          color: T.textMuted,
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 13.5,
                        }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={p.highlight ? "primary" : "outline"}
                  href="#contact"
                  className="w-full"
                >
                  {p.highlight ? "Get started" : "Choose plan"}
                </Button>
              </div>
            );
          })}
        </div>
        <p
          style={{
            color: T.textFaint,
            fontFamily: "'Inter', sans-serif",
            fontSize: 12.5,
          }}
          className="mt-8 text-center"
        >
          Need national coverage or a custom rollout?{" "}
          <a href="#contact" style={{ color: T.cyan }}>
            Talk to sales
          </a>{" "}
          for tailored pricing.
        </p>
      </div>
    </section>
  );
}

// ---- FAQ ---------------------------------------------------------------
function FAQ() {
  const faqs = [
    {
      q: "What is Precisestimation?",
      a: "A cloud-based tool for scoping and pricing construction work — from renovations to new builds — using regularly updated material and labour cost data.",
    },
    {
      q: "Who is it built for?",
      a: "Residential and commercial builders, quantity surveyors, subcontractors, developers and anyone who needs a defensible cost estimate quickly.",
    },
    {
      q: "Can I adjust estimates for a specific site?",
      a: "Yes. You can factor in access difficulty, terrain, climate zone and other local conditions that affect the real cost of a job.",
    },
    {
      q: "Can my team work on an estimate together?",
      a: "Yes — estimates update in real time as team members edit, so everyone is always looking at the current version.",
    },
    {
      q: "Is there a free trial?",
      a: "Reach out through the contact form below and we'll set you up with a guided demo on real job data.",
    },
  ];
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="relative"
      style={{ background: T.bgPanelAlt, borderTop: `1px solid ${T.line}` }}
    >
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Eyebrow>FAQ</Eyebrow>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: T.text,
            fontWeight: 700,
          }}
          className="text-2xl md:text-3xl mb-10"
        >
          Questions, answered
        </h2>
        <div>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} style={{ borderBottom: `1px solid ${T.line}` }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ outlineColor: T.amber }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: T.text,
                      fontWeight: 600,
                      fontSize: 15.5,
                    }}
                  >
                    {f.q}
                  </span>
                  <ChevronDown
                    size={18}
                    color={T.cyan}
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                      flexShrink: 0,
                    }}
                  />
                </button>
                {isOpen && (
                  <p
                    style={{
                      color: T.textMuted,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                    className="pb-5 pr-8"
                  >
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---- Contact / CTA -------------------------------------------------------
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:4000";
const MAX_FILE_MB = 10;
 
function Contact() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    details: "",
  });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
 
  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
 
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setFileError("");
    if (!f) {
      setFile(null);
      return;
    }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`File is over ${MAX_FILE_MB}MB — please attach a smaller file.`);
      setFile(null);
      e.target.value = "";
      return;
    }
    setFile(f);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      setStatus("error");
      setErrorMsg("Please fill in your name and email.");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
 
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      if (file) body.append("file", file);
 
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        body,
      });
      const data = await res.json();
 
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong.");
      }
 
      setStatus("success");
      setForm({ firstName: "", lastName: "", email: "", company: "", details: "" });
      setFile(null);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Could not send your request. Please try again.");
    }
  };
 
  const inputStyle = {
    background: T.bgPanel,
    border: `1px solid ${T.line}`,
    color: T.text,
    fontFamily: "'Inter', sans-serif",
    outlineColor: T.amber,
  };
 
  if (status === "success") {
    return (
      <section id="contact" className="relative overflow-hidden" style={{ background: T.bg }}>
        <BlueprintGrid opacity={0.35} />
        <div className="relative max-w-lg mx-auto px-6 py-24 text-center">
          <ClipboardCheck size={32} color={T.amber} className="mx-auto mb-4" />
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", color: T.text, fontWeight: 700 }} className="text-2xl mb-2">
            Request received
          </h2>
          <p style={{ color: T.textMuted, fontFamily: "'Inter', sans-serif" }} className="mb-6">
            Thanks — we'll be in touch shortly to set up your walkthrough.
          </p>
          <Button variant="outline" onClick={() => setStatus("idle")} href="#contact">
            Send another request
          </Button>
        </div>
      </section>
    );
  }
 
  return (
    <section id="contact" className="relative overflow-hidden" style={{ background: T.bg }}>
      <BlueprintGrid opacity={0.35} />
      <div className="relative max-w-3xl mx-auto px-6 py-20 text-center">
        <Eyebrow>Get in touch</Eyebrow>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", color: T.text, fontWeight: 700 }} className="text-2xl md:text-4xl mb-4">
          Ready to price your next job with confidence?
        </h2>
        <p style={{ color: T.textMuted, fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }} className="pb-6 max-w-3xl mx-auto">
          Tell us a bit about your business — attach a plan, brief or spec
          sheet if you have one — and we'll set up a walkthrough on a real
          job, not a slide deck.
        </p>
        <form className="grid sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto" onSubmit={handleSubmit}>
          <input placeholder="First name" value={form.firstName} onChange={handleChange("firstName")} className="px-4 py-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={inputStyle} />
          <input placeholder="Last name" value={form.lastName} onChange={handleChange("lastName")} className="px-4 py-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={inputStyle} />
          <input type="email" placeholder="Work email" value={form.email} onChange={handleChange("email")} className="sm:col-span-2 px-4 py-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={inputStyle} />
          <input placeholder="Company" value={form.company} onChange={handleChange("company")} className="sm:col-span-2 px-4 py-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={inputStyle} />
          <textarea
            placeholder="Tell us about the job (optional)"
            value={form.details}
            onChange={handleChange("details")}
            rows={3}
            className="sm:col-span-2 px-4 py-3 text-sm resize-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={inputStyle}
          />
 
          {/* File upload */}
          <div className="sm:col-span-2">
            <label
              htmlFor="file-upload"
              className="flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors"
              style={{ ...inputStyle, color: file ? T.text : T.textFaint }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.cyanDim)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.line)}
            >
              <UploadCloud size={17} color={T.cyan} className="flex-shrink-0" />
              <span className="truncate">
                {file ? file.name : `Attach a file (plan, brief, spec — up to ${MAX_FILE_MB}MB)`}
              </span>
            </label>
            <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />
            {fileError && (
              <p style={{ color: "#F2745C", fontFamily: "'Inter', sans-serif", fontSize: 12.5 }} className="mt-2">
                {fileError}
              </p>
            )}
          </div>
 
          {status === "error" && (
            <p style={{ color: "#F2745C", fontFamily: "'Inter', sans-serif", fontSize: 13 }} className="sm:col-span-2">
              {errorMsg}
            </p>
          )}
 
          <div className="sm:col-span-2 mt-2">
            <Button
            onClick={handleSubmit}
              type="submit"
              variant="primary"
              disabled={status === "submitting"}
              className="w-full"
              style={{ opacity: status === "submitting" ? 0.7 : 1, cursor: status === "submitting" ? "wait" : "pointer" }}
            >
              {status === "submitting" ? "Sending…" : "Request a demo"} <Send size={16} />
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

// ---- Footer -------------------------------------------------------------
function Footer() {
  return (
    <footer
      style={{ background: T.bgPanelAlt, borderTop: `1px solid ${T.line}` }}
    >
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={logo} width={200} height={150} className="rounded-lg"></img>
        </div>
        <span
          style={{
            color: T.textFaint,
            fontFamily: "'Inter', sans-serif",
            fontSize: 12.5,
          }}
        >
          © 2026 Precisestimation. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

// ---- Root ------------------------------------------------------------
export default function BuildScopeEstimatorLanding() {
  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      <style>{`
        ${FONT_IMPORT}
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; }
        }
      `}</style>
      <Nav />
      <Hero />
      <Overview />
      <WhoWeServe />
      <Capabilities />
      <Features />
      <HowItWorks />
      <Testimonials />
      {/* <Pricing /> */}
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}
