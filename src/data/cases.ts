import data from './cases.json';
import type { Lang } from './site';

export type CaseSection = { label: string; html: string };
export type CaseInfo = { label: string; value: string };
export type CaseStudy = {
  slug: string;
  lang: Lang;
  route: string;
  alternate: string;
  h1: string;
  index: string;
  head: string;
  metaTitle: string;
  metaDescription: string;
  scrollLabel: string;
  infos: CaseInfo[];
  sections: CaseSection[];
  next: { href: string; label: string };
  nextTitle: string;
  footerTheme: 'light';
};

export const cases = data as CaseStudy[];

export function getCase(lang: Lang, slug: string): CaseStudy {
  const found = cases.find((c) => c.lang === lang && c.slug === slug);
  if (!found) throw new Error(`Unknown case ${lang}/${slug}`);
  return found;
}
