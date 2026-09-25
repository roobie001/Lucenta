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
      "Radiology departments read more studies every year without hiring at the same rate. Here is where AI-assisted review could help, and where it won't.",
    date: "2026-09-25",
    tag: "Perspective",
    content: [
      "The number of imaging studies keeps going up. The number of radiologists available to read them mostly doesn't. In a lot of hospitals that means a backlog, and a radiologist working down a long worklist with little time to give any one case.",
      "AI won't fix a staffing shortage, and it shouldn't stand in for a radiologist's judgment. What it could do is take a first pass. It could flag studies that might be urgent, mark regions worth a closer look, and give the radiologist somewhere to start instead of an empty viewer.",
      "That is how we are designing Lucentaa: a first pass, not a final read. The plan is for a radiologist to confirm or dismiss every finding the models flag, with nothing going into a report without that step. Trust in a tool like this has to be earned one study at a time, and we would rather that be slow than assumed.",
      "It's very early. Lucentaa is a concept, and there are no pilots running yet. We are looking for pilot partners among healthcare providers, and we'll write about what we learn as we go.",
    ],
  },
  {
    slug: "announcing-our-pilot-program",
    title: "What we hope a pilot would look like",
    excerpt:
      "We don't have a pilot running yet. This is what we'd like one to look like, and who we'd like to run it with.",
    date: "2026-09-25",
    tag: "Plans",
    content: [
      "Lucentaa doesn't have a pilot running yet. We are seeking pilot partners among healthcare providers, and this post sets out what we would like a first pilot to look like.",
      "The starting idea is simple: nothing should be taken on trust. Before a pilot began, we and the partner would agree on what success looks like. Lucentaa would then run next to the department's normal workflow, and we would review the results together.",
      "We plan to work directly with radiologists during pilot testing to validate the platform's outputs. That includes the cases where the models get it wrong, which are often the most useful ones to look at.",
      "We can't promise a fixed shape for any of this yet, and we would like partners to help set it. If your imaging department is interested, use the contact page and tell us about your setup.",
    ],
  },
  {
    slug: "building-with-radiologists-not-just-for-them",
    title: "Why we want radiologists involved from the start",
    excerpt:
      "We don't have clinical advisors on board yet. Here is why we want radiologists involved early, and what we hope that changes.",
    date: "2026-09-25",
    tag: "Approach",
    content: [
      "A model can score well on a benchmark and still be something no radiologist wants on their worklist. To avoid that, we intend to involve practicing radiologists early in pilot testing, instead of asking for a sign-off at the end.",
      "We expect it to shape a lot of small decisions. How a finding is shown in the viewer. How a confidence score is worded. Which false positives are tolerable and which are not. How easily a radiologist can override a suggestion or dismiss it.",
      "It also affects how we describe the product. We call the AI features 'planned' and 'early concept' because that is accurate today, not because it looks cautious on a website. When there is evidence to say more, we'll say more. Not before.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
