import Link from "next/link";
import {
  ArrowRight,
  Download,
  ExternalLink,
  Factory,
  Linkedin,
  Mail,
  Phone,
  Satellite,
} from "lucide-react";
import { getProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { ResumeViewer } from "@/components/ResumeViewer";
import { BoardModelViewer } from "@/components/viewers/BoardModelViewer";

const resumeHref = "/resume/pratham-ingale-resume.pdf";
const email = "pratham.ing49@gmail.com";
const phone = "704-431-7206";
const linkedInHref = "https://www.linkedin.com/in/pratham-ingale/";

const focusAreas = [
  "avionics hardware",
  "power electronics",
  "mixed-signal PCB design",
  "bring-up & validation",
];

const companyFlags = [
  { name: "spacex", label: "starlink aviation", tone: "border-[#9aa4b2]/45 text-slate-200" },
  { name: "tesla", label: "cell manufacturing", tone: "border-[#b74134]/60 text-[#f0c2ba]" },
];

const profile = [
  ["Education", "Georgia Tech / B.S. Electrical Engineering"],
  ["GPA", "4.0"],
  ["Expected graduation", "December 2027"],
  ["Citizenship", "US Citizen"],
];

const experience = [
  {
    company: "SpaceX | Starlink Aviation",
    role: "Avionics Hardware Design Intern",
    term: "Summer 2026",
    location: "Woodinville, WA",
    icon: Satellite,
    bullets: [
      "Increase AC/DC input EMI-filter power capability from 400 W to 550 W by identifying magnetic saturation limits, redesigning the filter, and validating full-load hardware performance.",
      "Lead bring-up of a radiation-test coupon spanning 8 buck-converter variants, including loop-gain, efficiency, ripple, protection-threshold, and startup characterization.",
      "Isolate temperature and load-dependent diode leakage as the root cause of high-temperature shutdowns, extending operation from 90 s at 90 C to more than 3 hr at 115 C.",
    ],
  },
  {
    company: "SpaceX | Starlink Aviation",
    role: "Avionics Hardware Design Intern",
    term: "Fall 2025",
    location: "Woodinville, WA",
    icon: Satellite,
    bullets: [
      "Designed a 60 W isolated half-bridge LLC resonant converter with ZVS and AP310 loop-gain validation, improving efficiency by 15% over the existing flyback.",
      "Executed staged bring-up of a 400 W isolated AC/DC PCBA revision across CrCM PFC, LLC, boost, and buck stages with DO-160 current-harmonic validation.",
      "Led RCA for bring-up failures involving a buck-feedback trace, chassis-coupled load-switch noise, and LLC cross-regulation collapse on the auxiliary rail.",
    ],
  },
  {
    company: "Tesla | Cell Manufacturing",
    role: "Cell Electronics Design Intern",
    term: "Summer 2025",
    location: "San Diego, CA",
    icon: Factory,
    bullets: [
      "Designed a 4 kW, 50 V / 80 A mixed-signal PCB with CAN FD, hardware addressing, connector-orientation detection, protection, pre-charge, and isolated power domains.",
      "Engineered an 8-layer, 2 oz high-current PCB rated for 2.5 kW and validated power integrity and thermals at 450 A for 700 s.",
      "Built a high-speed digital star interface for one host and two nodes with controlled impedance, ground-via shielding, capacitive coupling, and damped filtering.",
    ],
  },
];

const skills = [
  ["Power", "Isolated LLC, AC/DC and DC/DC converters, ZVS, loop gain, EMI filters, PFC"],
  ["PCB", "Stackup, impedance control, return paths, creepage, current density, PDN"],
  ["Mixed signal", "I/V/T sensing, SAR ADCs, comparators, discrete voters, SPI, I2C, CAN, Ethernet, USB"],
  ["Lab", "Oscilloscopes, HV/current probes, e-loads, AP310, PX8000, IR camera, thermal chambers"],
  ["EDA & software", "Altium Designer, LTspice, SIMPLIS, TINA-TI, VS Code, GitHub, Enovia, Jira, Excel"],
];

export default function HomePage() {
  const projects = getProjects();
  const featured = projects.slice(0, 4);
  const heroProject = projects.find((project) => project.slug === "recovery-system") ?? projects[0];

  return (
    <main className="home-page">
      <section className="border-b border-line-soft/80">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,0.62fr)] lg:px-8 lg:py-16">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
              Electrical engineering / hardware design
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-normal leading-tight text-[#f4efe3] md:text-7xl">
              Pratham Ingale
            </h1>

            <div className="mt-6 flex max-w-3xl flex-wrap gap-x-3 gap-y-2 text-sm text-slate-400">
              {focusAreas.map((area, index) => (
                <span key={area}>
                  {area}
                  {index < focusAreas.length - 1 ? <span className="pl-3 text-slate-700">/</span> : null}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {companyFlags.map((company) => (
                <div
                  key={company.name}
                  className={`grid min-w-[10rem] grid-cols-[0.28rem_minmax(0,1fr)] overflow-hidden border ${company.tone}`}
                >
                  <span className="bg-current" aria-hidden="true" />
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold lowercase leading-none">{company.name}</p>
                    <p className="mt-1 text-[0.68rem] lowercase tracking-[0.14em] text-slate-500">
                      {company.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${email}`}
                className="inline-flex h-10 items-center gap-2 border border-line-soft px-3 text-sm font-medium text-slate-200 hover:border-copper/60"
              >
                <Mail className="size-4" aria-hidden="true" />
                {email}
              </a>
              <a
                href={`tel:+1${phone.replace(/\D/g, "")}`}
                className="inline-flex h-10 items-center gap-2 border border-line-soft px-3 text-sm font-medium text-slate-200 hover:border-copper/60"
              >
                <Phone className="size-4" aria-hidden="true" />
                {phone}
              </a>
              <a
                href={linkedInHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 border border-line-soft px-3 text-sm font-medium text-slate-200 hover:border-copper/60"
              >
                <Linkedin className="size-4" aria-hidden="true" />
                LinkedIn
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/projects/recovery-system"
                className="inline-flex h-10 items-center gap-2 border border-copper/70 bg-copper/10 px-3 text-sm font-semibold text-[#f4efe3] hover:bg-copper/20"
              >
                Recovery System PCB
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <a
                href="#resume"
                className="inline-flex h-10 items-center gap-2 border border-line-soft px-3 text-sm font-semibold text-slate-200 hover:border-copper/60"
              >
                <Download className="size-4" aria-hidden="true" />
                Resume
              </a>
            </div>
          </div>

          <aside className="grid content-start gap-4">
            {heroProject?.model3d ? (
              <BoardModelViewer
                compact
                title={heroProject.model3d.title}
                glbFile={heroProject.model3d.glbFile}
                stepFile={heroProject.model3d.stepFile}
                rotation={heroProject.model3d.rotation}
                position={heroProject.model3d.position}
                zoom={heroProject.model3d.zoom}
                camera={heroProject.model3d.camera}
                className="overflow-hidden border border-line-soft bg-panel"
                viewerClassName="h-[20rem]"
              />
            ) : null}
            <dl className="grid gap-0 border border-line-soft">
              {profile.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[8rem_minmax(0,1fr)] border-b border-line-soft last:border-b-0">
                  <dt className="px-3 py-3 text-xs uppercase tracking-[0.16em] text-slate-500">{label}</dt>
                  <dd className="px-3 py-3 text-sm font-medium text-slate-100">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8">
        <div>
          <h2 className="text-3xl font-normal text-[#f4efe3]">Internships</h2>
          <a
            href={resumeHref}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-copper hover:text-[#f4efe3]"
          >
            Full resume
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>

        <div className="divide-y divide-line-soft border-y border-line-soft">
          {experience.map((item) => {
            const Icon = item.icon;
            return (
              <article key={`${item.company}-${item.term}`} className="grid gap-4 py-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)]">
                <div className="flex gap-3">
                  <Icon className="mt-1 size-5 shrink-0 text-copper" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#f4efe3]">{item.company}</h3>
                    <p className="mt-1 text-sm text-slate-300">{item.role}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.term}
                      <br />
                      {item.location}
                    </p>
                  </div>
                </div>
                <ul className="grid gap-2 text-sm leading-6 text-slate-300">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="pl-4 text-slate-300 [text-indent:-1rem]">
                      <span className="pr-2 text-copper">-</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8">
        <div>
          <h2 className="text-3xl font-normal text-[#f4efe3]">Education</h2>
        </div>
        <div className="border-y border-line-soft py-6">
          <div>
            <p className="text-lg font-medium text-[#f4efe3]">Georgia Tech / B.S. Electrical Engineering</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              Expected graduation: December 2027. GPA: 4.0.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8">
        <div>
          <h2 className="text-3xl font-normal text-[#f4efe3]">Skills</h2>
        </div>
        <div className="border-y border-line-soft py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map(([label, value]) => (
              <div key={label}>
                <p className="text-sm font-semibold text-[#f4efe3]">{label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl scroll-mt-24 gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8" id="resume">
        <div>
          <h2 className="text-3xl font-normal text-[#f4efe3]">Resume</h2>
        </div>
        <div>
          <ResumeViewer resumeHref={resumeHref} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-t border-line-soft pt-8">
          <div>
            <h2 className="text-3xl font-normal text-[#f4efe3]">Projects</h2>
          </div>
          <Link href="/projects" className="text-sm font-medium text-copper hover:text-[#f4efe3]">
            All projects
          </Link>
        </div>
        <div className="grid gap-4">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} simple />
          ))}
        </div>
      </section>

      <section
        className="mx-auto grid max-w-7xl scroll-mt-24 gap-8 px-4 pb-14 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8"
        id="contact"
      >
        <div>
          <h2 className="text-3xl font-normal text-[#f4efe3]">Contact</h2>
        </div>
        <div className="grid gap-3 border-y border-line-soft py-6 sm:grid-cols-3">
          <a
            href={`mailto:${email}`}
            className="inline-flex min-h-12 items-center gap-3 text-sm text-slate-300 hover:text-copper"
          >
            <Mail className="size-4 shrink-0" aria-hidden="true" />
            {email}
          </a>
          <a
            href={`tel:+1${phone.replace(/\D/g, "")}`}
            className="inline-flex min-h-12 items-center gap-3 text-sm text-slate-300 hover:text-copper"
          >
            <Phone className="size-4 shrink-0" aria-hidden="true" />
            {phone}
          </a>
          <a
            href={linkedInHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center gap-3 text-sm text-slate-300 hover:text-copper"
          >
            <Linkedin className="size-4 shrink-0" aria-hidden="true" />
            linkedin.com/in/pratham-ingale
          </a>
        </div>
      </section>
    </main>
  );
}
