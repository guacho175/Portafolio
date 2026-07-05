import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  Code2, Zap, Globe, Database, Cpu, Layers, Terminal, GitBranch,
  Rocket, Star, ArrowRight, Download, Mail, ExternalLink, Menu, X,
  FileText, Settings, MessageSquare, Layout, ChevronRight, Package,
  Sun, Moon, Lightbulb, Hammer, Send, Linkedin, Github, CheckCircle2,
  Server, Workflow, Link2, Bot, BarChart3
} from "lucide-react";

/* ─── Mouse gradient background ───────────────────────────── */
function MouseGradientBg({ dark }: { dark: boolean }) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  const grad1X = useTransform(smoothX, [0, 1], ["10%", "70%"]);
  const grad1Y = useTransform(smoothY, [0, 1], ["5%", "60%"]);
  const grad2X = useTransform(smoothX, [0, 1], ["80%", "20%"]);
  const grad2Y = useTransform(smoothY, [0, 1], ["70%", "15%"]);

  if (dark) return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-[0.13]"
        style={{ left: grad1X, top: grad1Y, x: "-50%", y: "-50%", background: "radial-gradient(circle, #4f9eff 0%, transparent 70%)" }} />
      <motion.div className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-[0.10]"
        style={{ left: grad2X, top: grad2Y, x: "-50%", y: "-50%", background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)" }} />
      <div className="absolute inset-0" style={{ background: "#050d1a" }} />
      <motion.div className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-[0.13] mix-blend-screen"
        style={{ left: grad1X, top: grad1Y, x: "-50%", y: "-50%", background: "radial-gradient(circle, #4f9eff 0%, transparent 70%)" }} />
      <motion.div className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-[0.10] mix-blend-screen"
        style={{ left: grad2X, top: grad2Y, x: "-50%", y: "-50%", background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)" }} />
    </div>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#f0f4ff" }} />
      <motion.div className="absolute w-[700px] h-[700px] rounded-full blur-[130px] opacity-[0.18]"
        style={{ left: grad1X, top: grad1Y, x: "-50%", y: "-50%", background: "radial-gradient(circle, #93c5fd 0%, transparent 70%)" }} />
      <motion.div className="absolute w-[500px] h-[500px] rounded-full blur-[110px] opacity-[0.14]"
        style={{ left: grad2X, top: grad2Y, x: "-50%", y: "-50%", background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)" }} />
    </div>
  );
}

/* ─── Floating sticker ────────────────────────────────────── */
function FloatingIcon({ icon: Icon, x, y, size, delay, duration, color, rotate }: {
  icon: React.ElementType; x: number; y: number; size: number;
  delay: number; duration: number; color: string; rotate: number;
}) {
  return (
    <motion.div className="absolute pointer-events-none select-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0.10, 0.22, 0.10], scale: [0.9, 1.05, 0.9], y: [0, -20, 0], rotate: [rotate, rotate + 9, rotate] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}>
      <Icon size={size} color={color} strokeWidth={1.2} />
    </motion.div>
  );
}

/* ─── Animated counter ───────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const observed = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !observed.current) {
        observed.current = true;
        let s = 0;
        const step = Math.ceil(to / 45);
        const t = setInterval(() => { s += step; if (s >= to) { setCount(to); clearInterval(t); } else setCount(s); }, 28);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Fade-in wrapper ─────────────────────────────────────── */
function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1, rootMargin: "-40px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

/* ─── 3D Flip Card ───────────────────────────────────────── */
function FlipCard({ front, back }: {
  front: React.ReactNode; back: React.ReactNode;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: 1000, height: 220 }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl border border-border p-6 flex flex-col"
          style={{ backfaceVisibility: "hidden", background: "var(--card-bg)" }}>
          {front}
        </div>
        {/* Back */}
        <div className="absolute inset-0 rounded-2xl border border-primary/30 p-6 flex flex-col"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "var(--card-bg-back)" }}>
          {back}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Service flip card ──────────────────────────────────── */
function ServiceFlipCard({ icon: Icon, title, desc, detail, color, dark }: {
  icon: React.ElementType; title: string; desc: string; detail: string[]; color: string; dark: boolean;
}) {
  return (
    <FlipCard
      front={
        <>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
            style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
            <Icon size={20} color={color} />
          </div>
          <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: dark ? "#e8edf5" : "#0d1f3c" }}>{title}</h3>
          <p className="text-sm leading-relaxed flex-1" style={{ color: dark ? "#8ba4c4" : "#4a6080" }}>{desc}</p>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color }}>
            Hover para ver más <ChevronRight size={12} />
          </div>
        </>
      }
      back={
        <>
          <p className="text-xs font-mono mb-4 font-semibold" style={{ color }}>{title}</p>
          <ul className="space-y-2 flex-1">
            {detail.map(d => (
              <li key={d} className="flex items-start gap-2 text-sm" style={{ color: dark ? "#c8d8f0" : "#2d4a6a" }}>
                <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" style={{ color }} />
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-3 text-xs font-mono" style={{ color: dark ? "#8ba4c4" : "#6080a0" }}>Voltea de nuevo →</div>
        </>
      }
    />
  );
}

/* ─── Project card with tilt ─────────────────────────────── */
function ProjectCard({ name, desc, tags, color, dark }: {
  name: string; desc: string; tags: string[]; color: string; dark: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 150, damping: 18 });
  const sRotY = useSpring(rotY, { stiffness: 150, damping: 18 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotX.set(((e.clientY - cy) / rect.height) * -14);
    rotY.set(((e.clientX - cx) / rect.width) * 14);
  }, [rotX, rotY]);

  const onLeave = useCallback(() => { rotX.set(0); rotY.set(0); }, [rotX, rotY]);

  return (
    <motion.div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: "preserve-3d", perspective: 800 }}
      whileHover={{ scale: 1.02 }}
      className="relative p-6 rounded-2xl border border-border group cursor-default overflow-hidden"
      style2={{ background: dark ? "rgba(13,31,60,0.7)" : "rgba(255,255,255,0.7)" } as React.CSSProperties}
    >
      <div className="absolute inset-0 rounded-2xl" style={{ background: dark ? "rgba(13,31,60,0.7)" : "rgba(255,255,255,0.7)" }} />
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
            <Package size={16} color={color} />
          </div>
          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: dark ? "#8ba4c4" : "#6080a0" }} />
        </div>
        <h3 className="font-semibold mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: dark ? "#e8edf5" : "#0d1f3c" }}>{name}</h3>
        <p className="text-sm mb-4 leading-relaxed" style={{ color: dark ? "#8ba4c4" : "#4a6080" }}>{desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map(t => (
            <span key={t} className="text-[11px] px-2 py-0.5 rounded-md font-mono"
              style={{ background: dark ? "rgba(79,158,255,0.1)" : "rgba(59,130,246,0.08)", color: dark ? "#7ab8ff" : "#3b6fa8" }}>{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Skill badge ─────────────────────────────────────────── */
function SkillBadge({ label, dark }: { label: string; dark: boolean }) {
  return (
    <motion.span whileHover={{ scale: 1.06, y: -2 }}
      className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-mono font-medium border whitespace-nowrap cursor-default"
      style={{
        borderColor: dark ? "rgba(79,158,255,0.2)" : "rgba(59,130,246,0.2)",
        background: dark ? "rgba(79,158,255,0.07)" : "rgba(59,130,246,0.05)",
        color: dark ? "#7ab8ff" : "#2563eb"
      }}>
      {label}
    </motion.span>
  );
}

/* ─── Main App ───────────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Todo");
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const floaters = [
    { icon: Code2,     x: 7,  y: 14, size: 36, delay: 0,    duration: 6,   color: "#4f9eff", rotate: -15 },
    { icon: Zap,       x: 88, y: 8,  size: 28, delay: 0.8,  duration: 5,   color: "#a78bfa", rotate: 10  },
    { icon: Globe,     x: 92, y: 52, size: 38, delay: 1.5,  duration: 7,   color: "#34d399", rotate: 5   },
    { icon: Database,  x: 4,  y: 62, size: 30, delay: 0.4,  duration: 5.5, color: "#fb923c", rotate: -8  },
    { icon: Cpu,       x: 46, y: 4,  size: 24, delay: 2,    duration: 8,   color: "#f472b6", rotate: 20  },
    { icon: Layers,    x: 72, y: 18, size: 32, delay: 1.2,  duration: 6.5, color: "#4f9eff", rotate: -12 },
    { icon: Terminal,  x: 14, y: 38, size: 22, delay: 0.6,  duration: 7,   color: "#fbbf24", rotate: 8   },
    { icon: GitBranch, x: 80, y: 76, size: 28, delay: 1.8,  duration: 5.5, color: "#4f9eff", rotate: -5  },
    { icon: Star,      x: 60, y: 86, size: 20, delay: 1,    duration: 6,   color: "#fbbf24", rotate: 15  },
    { icon: Server,    x: 35, y: 90, size: 22, delay: 2.2,  duration: 6.5, color: "#34d399", rotate: -10 },
  ];

  const techs = [
    "React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "Supabase",
    "Python", "FastAPI", "Docker", "n8n", "Make.com", "Tailwind CSS",
    "Prisma", "Redis", "GraphQL", "REST APIs", "Git", "Vercel",
    "AWS", "OpenAI API", "Stripe", "Webhooks", "Linux", "Nginx",
  ];

  const steps = [
    {
      icon: Lightbulb, step: "01", title: "Entender el problema",
      desc: "Antes de escribir código, entiendo tu negocio, el problema real y qué solución tiene sentido.",
      color: "#fbbf24"
    },
    {
      icon: Hammer, step: "02", title: "Construir la solución",
      desc: "Backend, automatización, landing o integración — lo construyo con las herramientas correctas.",
      color: "#4f9eff"
    },
    {
      icon: Rocket, step: "03", title: "Hacer entrega",
      desc: "Publicado, probado y listo para usar. Con documentación para que lo operes solo.",
      color: "#34d399"
    },
  ];

  const services = [
    {
      icon: Layout, title: "Landing pages", color: "#4f9eff",
      desc: "Páginas enfocadas en conversión, velocidad y captación de leads.",
      detail: ["Diseño responsive mobile-first", "SEO técnico básico", "Formularios con integración CRM", "Analytics y tracking de eventos"]
    },
    {
      icon: Workflow, title: "Flujos inteligentes", color: "#a78bfa",
      desc: "Automatizaciones entre herramientas: emails, CRMs, notificaciones y más.",
      detail: ["n8n y Make.com", "Zapier como alternativa", "Trigger por formulario, webhook o cron", "Notificaciones Slack / Telegram"]
    },
    {
      icon: Link2, title: "Integración de herramientas", color: "#34d399",
      desc: "Conectamos tu stack: CRMs, pagos, sistemas internos y APIs de terceros.",
      detail: ["Stripe, MercadoPago, PayPal", "HubSpot, Notion, Airtable", "APIs REST y GraphQL", "Middleware personalizado"]
    },
    {
      icon: FileText, title: "Documentación y soporte", color: "#fb923c",
      desc: "Docs claras para operar y escalar tu solución de forma autónoma.",
      detail: ["Guías paso a paso con capturas", "Diagramas de flujo", "Videos explicativos", "Soporte post-entrega 15 días"]
    },
    {
      icon: Code2, title: "Productos web", color: "#f472b6",
      desc: "Dashboards, portales, herramientas internas y MVPs rápidos.",
      detail: ["Next.js + Supabase", "Auth completo (roles y permisos)", "Panel admin incluido", "Deploy en Vercel o Railway"]
    },
    {
      icon: Bot, title: "Bots y asistentes", color: "#fbbf24",
      desc: "Bots de Telegram, WhatsApp o Discord conectados a tu flujo de negocio.",
      detail: ["Bot de Telegram con comandos", "Integración con IA (OpenAI)", "Respuestas automáticas", "Base de datos de usuarios"]
    },
  ];

  const skillGroups = [
    { label: "Frontend", icon: Layout, color: "#4f9eff", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"] },
    { label: "Backend", icon: Server, color: "#34d399", items: ["Node.js", "FastAPI", "Python", "Express", "GraphQL", "REST APIs"] },
    { label: "Bases de datos", icon: Database, color: "#fb923c", items: ["PostgreSQL", "MySQL", "Supabase", "Redis", "Prisma", "MongoDB"] },
    { label: "Automatización", icon: Workflow, color: "#a78bfa", items: ["n8n", "Make.com", "Zapier", "Webhooks", "Cron jobs", "OpenAI API"] },
    { label: "DevOps", icon: Cpu, color: "#f472b6", items: ["Docker", "Vercel", "Railway", "AWS", "Nginx", "Linux"] },
    { label: "Integraciones", icon: Link2, color: "#fbbf24", items: ["Stripe", "MercadoPago", "HubSpot", "Notion", "Airtable", "Twilio"] },
  ];

  const filters = ["Todo", "Web", "Automatización", "Integraciones", "Backend"];

  const projects = [
    { name: "AgendaPro Orbynex", desc: "Software multi-tenant para clínicas y consultorios. Citas, pagos y gestión de pacientes.", tags: ["Next.js", "PostgreSQL", "Stripe"], color: "#4f9eff", category: "Web" },
    { name: "orbynex.digital", desc: "Landing universal con automatización digital para validar propuestas y capturar leads calificados.", tags: ["Next.js", "n8n", "Supabase"], color: "#a78bfa", category: "Web" },
    { name: "FlowSync Bot", desc: "Bot de Telegram conectado a n8n que gestiona tareas, recordatorios y reportes automáticos.", tags: ["Python", "n8n", "Telegram API"], color: "#34d399", category: "Automatización" },
    { name: "DataBridge", desc: "Middleware que sincroniza datos entre plataformas SaaS, transformando y enrutando en tiempo real.", tags: ["Node.js", "Redis", "Webhooks"], color: "#fb923c", category: "Integraciones" },
    { name: "API Commerce", desc: "Backend modular para tiendas online: catálogo, stock, pedidos y pagos con Stripe.", tags: ["FastAPI", "PostgreSQL", "Docker"], color: "#f472b6", category: "Backend" },
    { name: "AutoReport", desc: "Sistema que genera reportes PDF automáticos desde Google Sheets y los envía por email.", tags: ["Python", "Make.com", "Gmail API"], color: "#fbbf24", category: "Automatización" },
  ];

  const filtered = activeFilter === "Todo" ? projects : projects.filter(p => p.category === activeFilter);

  const bg = dark ? "#050d1a" : "#f0f4ff";
  const surface = dark ? "rgba(13,31,60,0.6)" : "rgba(255,255,255,0.65)";
  const textMain = dark ? "#e8edf5" : "#0d1f3c";
  const textMuted = dark ? "#8ba4c4" : "#4a6080";
  const borderCol = dark ? "rgba(79,158,255,0.15)" : "rgba(59,130,246,0.18)";
  const navBg = dark ? "rgba(5,13,26,0.88)" : "rgba(240,244,255,0.88)";

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: bg, color: textMain, minHeight: "100vh", overflowX: "hidden" }}>
      {/* Global CSS */}
      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ticker-wrap { display: flex; gap: 12px; animation: ticker 30s linear infinite; width: max-content; }
        ::selection { background: rgba(79,158,255,0.3); }
        * { box-sizing: border-box; }
      `}</style>

      {/* Mouse gradient */}
      <MouseGradientBg dark={dark} />

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl"
        style={{ borderColor: borderCol, background: navBg }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #4f9eff, #a78bfa)" }}>
              <Code2 size={15} color="#fff" />
            </div>
            <div>
              <span className="font-semibold text-sm block leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: textMain }}>
                Christian Galindez
              </span>
              <span className="text-[10px] leading-tight" style={{ color: textMuted }}>Desarrollador backend</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: textMuted }}>
            {["Orbynex", "Proyectos", "Stack", "Contacto"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                className="hover:opacity-100 transition-opacity"
                style={{ opacity: 0.75 }}
                onMouseEnter={e => (e.currentTarget.style.color = "#4f9eff")}
                onMouseLeave={e => (e.currentTarget.style.color = textMuted)}>
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
              onClick={() => setDark(!dark)}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: borderCol, background: dark ? "rgba(79,158,255,0.08)" : "rgba(59,130,246,0.08)", color: dark ? "#4f9eff" : "#2563eb" }}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{ color: textMuted }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t px-4 py-4 flex flex-col gap-3 text-sm"
            style={{ borderColor: borderCol, background: navBg, color: textMuted }}>
            {["Orbynex", "Proyectos", "Stack", "Contacto"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="py-1" style={{ color: textMuted }}
                onClick={() => setMenuOpen(false)}>{l}</a>
            ))}
          </motion.div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {floaters.map((f, i) => <FloatingIcon key={i} {...f} />)}

        {/* Emoji stickers */}
        {[
          { e: "🚀", style: { right: "10%", top: "22%" }, y: [-12, 0], r: [0, 6] },
          { e: "⚡", style: { left: "5%", bottom: "30%" }, y: [10, 0], r: [0, -5] },
          { e: "🔧", style: { right: "5%", bottom: "38%" }, y: [-8, 0], r: [0, 4] },
          { e: "💡", style: { left: "22%", top: "14%" }, y: [-10, 0], r: [0, 7] },
          { e: "🌐", style: { right: "28%", bottom: "20%" }, y: [6, 0], r: [0, -4] },
        ].map(({ e, style, y, r }, i) => (
          <motion.div key={i} className="absolute text-3xl pointer-events-none select-none"
            style={style}
            animate={{ y: [y[0], y[1], y[0]], rotate: [r[0], r[1], r[0]] }}
            transition={{ duration: 3.5 + i * 0.5, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}>
            {e}
          </motion.div>
        ))}

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <FadeIn delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 border"
              style={{ borderColor: "rgba(79,158,255,0.3)", background: "rgba(79,158,255,0.09)", color: "#4f9eff" }}>
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>●</motion.span>
              Abierto a trabajo freelance · Productos freelance · Startups
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: "#4f9eff" }}>Portafolio técnico</p>
          </FadeIn>

          <FadeIn delay={0.18}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.15]"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: textMain }}>
              Backend,{" "}
              <span style={{ background: "linear-gradient(135deg, #4f9eff 0%, #a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                automatización
              </span>
              <br />y productos web.
            </h1>
          </FadeIn>

          <FadeIn delay={0.26}>
            <p className="text-base sm:text-lg max-w-xl mb-8 leading-relaxed" style={{ color: textMuted }}>
              Construyo APIs, sitios web, integraciones y flujos automáticos con las herramientas y documentación claras para que tu empresa vuele más.
            </p>
          </FadeIn>

          <FadeIn delay={0.34}>
            <div className="flex flex-wrap gap-3">
              <motion.a href="#proyectos" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #4f9eff, #3b82f6)" }}>
                Ver proyectos <ArrowRight size={15} />
              </motion.a>
              <motion.a href="#" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors"
                style={{ borderColor: borderCol, color: textMain }}>
                <Download size={15} /> Descargar CV
              </motion.a>
              <motion.a href="#contacto" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors"
                style={{ borderColor: borderCol, color: textMain }}>
                <Mail size={15} /> Contactar
              </motion.a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="relative z-10 border-y" style={{ borderColor: borderCol, background: surface, backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-3 gap-6">
          {[
            { v: 10, s: "+", l: "Proyectos construidos entre backend, productos web e integraciones." },
            { v: 3,  s: "+", l: "Áreas de herramientas de desarrollo, stack y soporte." },
            { v: 65, s: "+", l: "Tecnologías, lenguajes, APIs y conceptos aplicados." },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.1} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#4f9eff" }}>
                <Counter to={s.v} suffix={s.s} />
              </p>
              <p className="text-xs max-w-[160px] mx-auto leading-snug" style={{ color: textMuted }}>{s.l}</p>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── Tech ticker ── */}
      <div className="relative z-10 overflow-hidden py-4 border-b" style={{ borderColor: borderCol }}>
        <div className="ticker-wrap">
          {[...techs, ...techs].map((t, i) => (
            <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium border whitespace-nowrap"
              style={{ borderColor: dark ? "rgba(79,158,255,0.2)" : "rgba(59,130,246,0.2)", background: dark ? "rgba(79,158,255,0.06)" : "rgba(59,130,246,0.05)", color: dark ? "#7ab8ff" : "#2563eb" }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Qué puedo hacer por ti ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "#4f9eff" }}>Qué puedo hacer por ti</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: textMain }}>
              De la idea al producto funcionando.
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}
                className="relative p-6 rounded-2xl border overflow-hidden"
                style={{ borderColor: borderCol, background: surface, backdropFilter: "blur(12px)" }}>
                <div className="absolute top-4 right-4 text-5xl font-black opacity-[0.04]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: s.color }}>
                  {s.step}
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <h3 className="font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: textMain }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{s.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Sitios web", "APIs", "Automatizaciones", "Integraciones", "Bots", "Bases de datos"].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-sm border font-medium"
                style={{ borderColor: borderCol, background: dark ? "rgba(79,158,255,0.06)" : "rgba(59,130,246,0.06)", color: dark ? "#7ab8ff" : "#2563eb" }}>
                {tag}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── Orbynex / Services ── */}
      <section id="orbynex" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <FadeIn>
          <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "#4f9eff" }}>Marca propia</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span style={{ background: "linear-gradient(135deg, #4f9eff, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  orbynex.digital
                </span>
              </h2>
              <p className="text-sm mt-2 max-w-md" style={{ color: textMuted }}>
                Mi marca de soluciones web y automatización digital para negocios pequeños. Las cards se voltean al pasar el cursor.
              </p>
            </div>
            <div className="flex gap-3">
              <motion.a href="https://portafolio.orbynexdigital.cl" target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #4f9eff, #3b82f6)" }}>
                Ver Orbynex <ExternalLink size={13} />
              </motion.a>
              <motion.a href="#proyectos"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
                style={{ borderColor: borderCol, color: textMain }}>
                Ver proyectos
              </motion.a>
            </div>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          style={{ "--card-bg": surface, "--card-bg-back": dark ? "rgba(20,40,80,0.85)" : "rgba(235,245,255,0.9)" } as React.CSSProperties}>
          {services.map((s, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <ServiceFlipCard {...s} dark={dark} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Stack / Capacidades ── */}
      <section id="stack" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <FadeIn>
          <div className="mb-10">
            <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: "#4f9eff" }}>Capacidades</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: textMain }}>Stack técnico</h2>
            <p className="text-sm mt-2" style={{ color: textMuted }}>Herramientas para construir, integrar, desplegar y mantener.</p>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((g, gi) => (
            <FadeIn key={gi} delay={gi * 0.08}>
              <div className="p-5 rounded-2xl border" style={{ borderColor: borderCol, background: surface, backdropFilter: "blur(12px)" }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${g.color}18`, border: `1px solid ${g.color}25` }}>
                    <g.icon size={16} color={g.color} />
                  </div>
                  <span className="font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: textMain }}>{g.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map(item => <SkillBadge key={item} label={item} dark={dark} />)}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="proyectos" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: "#4f9eff" }}>Trabajo aplicado</p>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: textMain }}>Proyectos</h2>
              <p className="text-sm mt-2" style={{ color: textMuted }}>Backend, productos web, integraciones y automatizaciones reales.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: textMuted }}>
              <BarChart3 size={13} color="#4f9eff" /> Tecnologías en evolución
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map(f => (
              <motion.button key={f} onClick={() => setActiveFilter(f)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
                style={activeFilter === f
                  ? { background: "#4f9eff", color: "#050d1a" }
                  : { background: dark ? "rgba(13,31,60,0.5)" : "rgba(230,240,255,0.8)", color: textMuted, border: `1px solid ${borderCol}` }}>
                {f}
              </motion.button>
            ))}
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.07}>
              <ProjectCard {...p} dark={dark} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Contact form ── */}
      <section id="contacto" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <motion.div className="text-5xl mb-4 inline-block"
                animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.12, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                👋
              </motion.div>
              <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: "#4f9eff" }}>Contacto</p>
              <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: textMain }}>
                ¿Tienes un proyecto en mente?
              </h2>
              <p className="text-sm" style={{ color: textMuted }}>
                No necesitas tener todo claro antes de escribir. Cuéntame la idea y lo conversamos.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 rounded-2xl border" style={{ borderColor: borderCol, background: surface }}>
                <div className="text-4xl mb-3">✅</div>
                <p className="font-semibold" style={{ color: textMain }}>¡Mensaje enviado!</p>
                <p className="text-sm mt-1" style={{ color: textMuted }}>Te respondo en menos de 24h.</p>
              </motion.div>
            ) : (
              <form className="space-y-4 p-6 rounded-2xl border" style={{ borderColor: borderCol, background: surface, backdropFilter: "blur(12px)" }}
                onSubmit={e => { e.preventDefault(); setSent(true); }}>
                {[
                  { id: "name", label: "Nombre", type: "text", placeholder: "Tu nombre" },
                  { id: "email", label: "Correo", type: "email", placeholder: "tu@email.com" },
                ].map(f => (
                  <div key={f.id}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: textMuted }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      value={formState[f.id as keyof typeof formState]}
                      onChange={e => setFormState(s => ({ ...s, [f.id]: e.target.value }))}
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all"
                      style={{
                        borderColor: borderCol,
                        background: dark ? "rgba(5,13,26,0.6)" : "rgba(240,248,255,0.8)",
                        color: textMain
                      }}
                      onFocus={e => (e.target.style.borderColor = "#4f9eff")}
                      onBlur={e => (e.target.style.borderColor = borderCol)}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: textMuted }}>Mensaje</label>
                  <textarea placeholder="Cuéntame sobre tu proyecto..." rows={4} required
                    value={formState.message}
                    onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all resize-none"
                    style={{
                      borderColor: borderCol,
                      background: dark ? "rgba(5,13,26,0.6)" : "rgba(240,248,255,0.8)",
                      color: textMain
                    }}
                    onFocus={e => (e.target.style.borderColor = "#4f9eff")}
                    onBlur={e => (e.target.style.borderColor = borderCol)}
                  />
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #4f9eff, #3b82f6)" }}>
                  <Send size={15} /> Enviar mensaje
                </motion.button>
              </form>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t" style={{ borderColor: borderCol, background: dark ? "rgba(5,13,26,0.9)" : "rgba(240,244,255,0.9)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #4f9eff, #a78bfa)" }}>
                <Code2 size={13} color="#fff" />
              </div>
              <span className="font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: textMain }}>
                Christian Galindez
              </span>
            </div>
            <a href="mailto:christian.galindez.dev@gmail.com" className="text-xs hover:text-primary transition-colors"
              style={{ color: textMuted }}>
              christian.galindez.dev@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-4">
            <motion.a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.12, y: -2 }}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: borderCol, color: textMuted }}
              onMouseEnter={e => (e.currentTarget.style.color = "#4f9eff")}
              onMouseLeave={e => (e.currentTarget.style.color = textMuted)}>
              <Linkedin size={16} />
            </motion.a>
            <motion.a href="https://github.com" target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.12, y: -2 }}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: borderCol, color: textMuted }}
              onMouseEnter={e => (e.currentTarget.style.color = "#4f9eff")}
              onMouseLeave={e => (e.currentTarget.style.color = textMuted)}>
              <Github size={16} />
            </motion.a>
            <motion.a href="https://portafolio.orbynexdigital.cl" target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.12, y: -2 }}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: borderCol, color: textMuted }}
              onMouseEnter={e => (e.currentTarget.style.color = "#4f9eff")}
              onMouseLeave={e => (e.currentTarget.style.color = textMuted)}>
              <Globe size={16} />
            </motion.a>
          </div>
        </div>
        <div className="border-t px-4 sm:px-6 py-4" style={{ borderColor: borderCol }}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-xs" style={{ color: textMuted }}>
            <span>© 2024 Christian Galindez · orbynex.digital</span>
            <span className="font-mono">Built with React + Motion ⚡</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
