export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-ai-assisted-imaging-matters",
    title: "Why AI-assisted imaging matters",
    excerpt:
      "Radiology departments are reading more studies with the same number of people. Here's how AI-assisted review fits into that picture — and where it doesn't.",
    date: "2026-08-14",
    tag: "Perspective",
    content: [
      "Imaging volumes have grown steadily for years, but radiology staffing hasn't kept pace. In many health systems, the result is a growing backlog of studies waiting to be read, and radiologists under real time pressure on every case that comes through the worklist.",
      "AI-assisted review doesn't solve staffing shortages on its own, and it isn't a replacement for a trained radiologist's judgment. What it can do is help triage — surfacing studies that may need urgent attention, flagging candidate regions of interest, and giving a radiologist a faster starting point on a study rather than a blank viewer.",
      "That distinction matters. Lucenta is built as a second opinion, not a first read. Every finding our models surface is reviewed, confirmed, or dismissed by a radiologist before it reaches a report. We think that's the only responsible way to introduce AI into a clinical workflow — as an assistive layer, evaluated carefully, that earns trust study by study.",
      "We're still early. Our models are in active development and are being evaluated through structured pilots with partner imaging departments, not deployed as a finished, standalone diagnostic product. We'll keep writing about what we learn as those pilots progress.",
    ],
  },
  {
    slug: "announcing-our-pilot-program",
    title: "Announcing our pilot program",
    excerpt:
      "We're opening a limited pilot program for imaging departments who want to evaluate AI-assisted review against their own studies.",
    date: "2026-09-02",
    tag: "Announcement",
    content: [
      "Today we're opening applications for the Lucenta pilot program — a structured, low-risk way for imaging departments to evaluate our AI-assisted review platform against their own studies before any wider rollout.",
      "The pilot is designed around a simple principle: nothing should be taken on faith. Partner sites work with our clinical team to define success criteria up front, run Lucenta alongside their existing workflow, and review performance together on a regular cadence.",
      "Pilot sites get hands-on support with DICOM and PACS integration, access to our clinical and engineering team throughout the pilot, and full visibility into how our models are performing on their studies — including where they fall short.",
      "We're onboarding a limited number of departments at a time so we can give each pilot the attention it needs. If your imaging department is interested in participating, reach out through our contact page and we'll follow up to talk through fit and timelines.",
    ],
  },
  {
    slug: "building-with-radiologists-not-just-for-them",
    title: "Building with radiologists, not just for them",
    excerpt:
      "Clinical advisors have been part of Lucenta since the earliest research prototypes. Here's why that mattered from day one.",
    date: "2026-09-16",
    tag: "Engineering",
    content: [
      "It's easy to build a model that performs well on a benchmark and much harder to build one that a radiologist actually trusts in their worklist. Early on, we decided the only way to close that gap was to have practicing radiologists involved from the earliest prototypes — not brought in at the end to sign off on a finished product.",
      "That's shaped decisions large and small: how findings are presented in the viewer, how confidence scores are framed, which false positives are tolerable and which aren't, and how much control a radiologist has to override or dismiss a suggestion.",
      "It's also shaped how we talk about the technology. We describe Lucenta's AI capabilities as in development and pilot stage because that's what's true today, not because it reads well on a website. As the platform matures through pilots, we'll update that language to match — but only as the evidence supports it.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
