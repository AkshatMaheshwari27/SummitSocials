import { AudienceSplit } from "@/components/workshop/AudienceSplit";
import { BuildShowcase } from "@/components/workshop/BuildShowcase";
import { EventCard } from "@/components/workshop/EventCard";
import { FeatureGrid } from "@/components/workshop/FeatureGrid";
import { FinalCta } from "@/components/workshop/FinalCta";
import { Hero } from "@/components/workshop/Hero";
import { LearnGrid, type LearnItem } from "@/components/workshop/LearnGrid";
import { ScheduleTimeline } from "@/components/workshop/ScheduleTimeline";
import { Section } from "@/components/ui/Section";
import { getPrimaryCta } from "@/lib/cta";
import { getEventAvailability } from "@/lib/event";
import { getSessionUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  formatPrice,
  formatWorkshopDate,
  getCurrentWorkshop,
} from "@/lib/workshop";

/* Page-level content not modelled by the database. */
const EVENT_TIME = "10:00 AM – 1:00 PM";
const DURATION = "3 hours";

const WHATS_ON_LEDE =
  "You start from an empty file and leave with an AI-powered app running on a live URL — built by you, in one afternoon.";

const LEARN: LearnItem[] = [
  {
    n: "01",
    icon: "sparkle",
    tone: "coral",
    title: "AI fundamentals",
    body: "How models work in practice — tokens, context, and what they are and aren't good at.",
  },
  {
    n: "02",
    icon: "wand",
    tone: "sky",
    title: "Prompt engineering",
    body: "Prompts that return what you need: system messages, structure, and constraints.",
  },
  {
    n: "03",
    icon: "plug",
    tone: "lavender",
    title: "API integration",
    body: "Calling a model from your own code — keys, requests, streaming, and failures.",
  },
  {
    n: "04",
    icon: "layers",
    tone: "green",
    title: "Building the interface",
    body: "Wrapping the model in a real UI with input, loading, and result states.",
  },
  {
    n: "05",
    icon: "code",
    tone: "coral",
    title: "Connecting the pieces",
    body: "Wiring prompt, API, and interface into one flow that works end to end.",
  },
  {
    n: "06",
    icon: "rocket",
    tone: "sky",
    title: "Deploying the project",
    body: "Environment variables, a deploy, and a live URL you can share the same day.",
  },
];

const SCHEDULE = [
  { time: "10:00", title: "Introduction", detail: "The idea, the stack, and what you'll have by 1pm." },
  { time: "10:30", title: "AI + prompts", detail: "Fundamentals and prompt engineering, with exercises." },
  { time: "11:15", title: "Build", detail: "Your first API call and the interface around it." },
  { time: "12:15", title: "Integrate", detail: "Connect prompt, API, and UI into one working flow." },
  { time: "12:45", title: "Deploy", detail: "Ship it and get a live URL." },
  { time: "13:00", title: "Wrap up", detail: "Demos, next steps, and where to take it." },
];

const AUDIENCE_FOR = [
  "You've written some code and want to build with AI",
  "You've never shipped anything that calls an API",
  "You're building your first AI project",
  "You learn by doing",
];
const AUDIENCE_NOT = [
  "You want a lecture with slides",
  "You're after a deep dive on model internals",
  "You've already shipped several AI apps",
];

export default async function HomePage() {
  const [workshop, user] = await Promise.all([
    getCurrentWorkshop(),
    getSessionUser(),
  ]);
  const cta = await getPrimaryCta(user?.id);

  if (!workshop) {
    return (
      <div className="wrap-prose py-[var(--section-y)]">
        <p className="pill">Summit Socials</p>
        <h1 className="h-display mt-6">The next event is being planned.</h1>
        <p className="lede mt-4">
          Summit Socials runs hands-on builder workshops through the year. This
          page will carry the date, venue, and registration as soon as the next
          one is scheduled.
        </p>
      </div>
    );
  }

  const paidCount = await prisma.registration.count({
    where: { workshopId: workshop.id, status: "PAID" },
  });
  const availability = getEventAvailability(workshop.capacity, paidCount);

  const price = formatPrice(workshop.priceMinor, workshop.currency);
  const dateText = formatWorkshopDate(workshop.date);
  const IST = "Asia/Kolkata";
  const dateShort = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: IST,
  }).format(workshop.date);
  const day = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    timeZone: IST,
  }).format(workshop.date);
  const monthYear = new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: IST,
  }).format(workshop.date);
  const weekday = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    timeZone: IST,
  }).format(workshop.date);

  return (
    <>
      <Hero
        eyebrow="Hands-on AI workshop"
        headline="Go from prompt to product"
        tagline="Connecting builders, shipping tomorrow's tech."
        intro="Turn an idea into a working AI-powered app in one hands-on workshop with Summit Socials. You leave with something that runs."
        facts={[
          { label: "Date", value: dateShort },
          { label: "Venue", value: "SRMIST" },
          { label: "Format", value: `In person · ${DURATION}` },
          { label: "Fee", value: price },
        ]}
        cta={cta}
        secondaryHref="/#whats-on"
        secondaryLabel="Explore the workshop"
        seatsLabel={availability.label}
        seatsFilling={availability.filling}
      />

      <Section
        id="whats-on"
        eyebrow="What's on"
        title="One afternoon, one working app"
        intro="A focused, practical session — you build the whole way through, from the first prompt to a deployed URL."
      >
        <EventCard
          title={workshop.title}
          summary={WHATS_ON_LEDE}
          day={day}
          monthYear={monthYear}
          weekday={weekday}
          venue={workshop.location}
          price={price}
          availabilityLabel={availability.label}
          filling={availability.filling}
          full={availability.full}
          registrationStatus={cta.registrationStatus}
          reference={cta.reference}
          cta={cta}
          detail={
            <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
              <p className="max-w-prose leading-relaxed text-ink-soft">
                {workshop.description}
              </p>
              <dl className="grid gap-2 text-sm sm:text-right">
                <div>
                  <dt className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ink-faint">
                    Date
                  </dt>
                  <dd className="text-ink">{dateText}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ink-faint">
                    Time
                  </dt>
                  <dd className="text-ink">{EVENT_TIME}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ink-faint">
                    Level
                  </dt>
                  <dd className="text-ink">Beginner-friendly</dd>
                </div>
              </dl>
            </div>
          }
        />
      </Section>

      <Section
        id="inside"
        band
        eyebrow="Inside the day"
        title="How the three hours run"
        intro="Six short modules, each building on the last, wrapped around a single project you carry from start to finish."
      >
        <div className="grid gap-14 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <div>
            <h3 className="font-display text-xl font-medium text-ink">
              The schedule
            </h3>
            <div className="mt-5">
              <ScheduleTimeline items={SCHEDULE} />
            </div>
          </div>
          <div>
            <h3 className="font-display text-xl font-medium text-ink">
              The six modules
            </h3>
            <div className="mt-5">
              <LearnGrid items={LEARN} />
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="build"
        eyebrow="What you'll build"
        title="A small app that does something useful with a model"
        intro="A real API call, a usable interface, and a deploy you can share. The panels below are an illustration of the shape of the project — not a real attendee's work."
      >
        <BuildShowcase />
      </Section>

      <Section
        id="about"
        eyebrow="Why Summit Socials"
        title="Everything you need to ship"
        intro="Summit Socials runs practical, build-first sessions where developers ship real projects. This one gets you from prompt to product in an afternoon."
      >
        <FeatureGrid />
      </Section>

      <Section id="who" eyebrow="Who it's for" title="Come as you are">
        <AudienceSplit forItems={AUDIENCE_FOR} notItems={AUDIENCE_NOT} />
      </Section>

      <FinalCta
        headline="Bring an idea. Leave with it running."
        price={price}
        capacity={workshop.capacity}
        cta={cta}
        secondaryHref="/#inside"
        seatsLabel={availability.label}
        seatsFilling={availability.filling}
      />
    </>
  );
}
