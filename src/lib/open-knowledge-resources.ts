export type OpenKnowledgeRightsStatus =
  | 'PUBLIC_DOMAIN_WITH_ATTRIBUTION'
  | 'PUBLIC_DOMAIN_US_WITH_JURISDICTION_NOTE'
  | 'PUBLIC_DOMAIN_OR_FREE_LICENSE_ITEM_REVIEW'
  | 'PUBLIC_DOMAIN_US_WITH_ITEM_REVIEW'
  | 'MIXED_RIGHTS_ITEM_REVIEW';

export interface OpenKnowledgeResource {
  title: string;
  institution: string;
  resourceType: string;
  languages: string[];
  disciplines: string[];
  sourceUrl: string;
  rightsStatus: OpenKnowledgeRightsStatus;
  licenseOrRightsUrl: string;
  jurisdictionNote: string;
  whyItMatters: string;
  landingCardTitle: string;
  landingCardSummary: string;
  riskLevel: 'low' | 'medium';
  reviewNotes: string;
  visualTone: 'archive' | 'voice' | 'cinema' | 'commons' | 'text' | 'europe';
}

export const openKnowledgeResources: OpenKnowledgeResource[] = [
  {
    title: 'Maytime',
    institution: 'B. P. Schulberg Productions / New Zealand Film Archive / Library of Congress',
    resourceType: 'Silent film fragment',
    languages: ['English intertitles'],
    disciplines: ['Acting', 'Film history', 'Cinematography'],
    sourceUrl: 'https://archive.org/details/maytime-1923',
    rightsStatus: 'PUBLIC_DOMAIN_OR_FREE_LICENSE_ITEM_REVIEW',
    licenseOrRightsUrl: 'http://creativecommons.org/publicdomain/mark/1.0/',
    jurisdictionNote:
      'Internet Archive marks this item as Public Domain Mark 1.0; review the specific file and any added audio before reuse.',
    whyItMatters:
      'A recovered silent feature fragment with early Clara Bow screen work, useful for studying gesture, framing, and preservation.',
    landingCardTitle: 'Maytime (1923)',
    landingCardSummary:
      'Recovered silent-era material for studying screen presence, gesture, composition, and archival survival.',
    riskLevel: 'low',
    reviewNotes: 'Good individual candidate; keep as external source link and avoid embedding until files are reviewed.',
    visualTone: 'cinema',
  },
  {
    title: 'Animated Picture Studio',
    institution: 'Hepworth Mfg. Co. / Library of Congress Paper Print Film Collection',
    resourceType: 'Silent film short',
    languages: ['Silent film'],
    disciplines: ['Directing', 'Production design', 'Early cinema'],
    sourceUrl: 'https://archive.org/details/animated-studio',
    rightsStatus: 'PUBLIC_DOMAIN_OR_FREE_LICENSE_ITEM_REVIEW',
    licenseOrRightsUrl: 'http://creativecommons.org/publicdomain/mark/1.0/',
    jurisdictionNote:
      'Internet Archive marks this item as Public Domain Mark 1.0. The page notes sound, so treat audio cautiously.',
    whyItMatters:
      'An early meta-cinema short showing a studio setup, staged action, and visual tricks in the fixed-camera era.',
    landingCardTitle: 'Animated Picture Studio (1903)',
    landingCardSummary:
      'A compact early-cinema study of staging, the film set, performance blocking, and practical visual illusion.',
    riskLevel: 'low',
    reviewNotes: 'Excellent visual-study candidate; keep link-only if audio provenance remains unclear.',
    visualTone: 'cinema',
  },
  {
    title: 'No hay mal que por bien no venga',
    institution: 'Juan Ruiz de Alarcon / Universidad de Sevilla',
    resourceType: 'Printed play',
    languages: ['Español'],
    disciplines: ['Classical theatre', 'Verse', 'Adaptation'],
    sourceUrl: 'https://archive.org/details/HHAZ378412',
    rightsStatus: 'PUBLIC_DOMAIN_OR_FREE_LICENSE_ITEM_REVIEW',
    licenseOrRightsUrl: 'http://creativecommons.org/publicdomain/mark/1.0/',
    jurisdictionNote:
      'Internet Archive marks this item as Public Domain Mark 1.0; source is a historical edition from university holdings.',
    whyItMatters:
      'A concrete Spanish Golden Age theatre resource for verse, declamation, adaptation, and character dynamics.',
    landingCardTitle: 'Ruiz de Alarcon: classical verse',
    landingCardSummary:
      'A historical edition of a Spanish classical comedy for studying verse rhythm, speech, and adaptation.',
    riskLevel: 'low',
    reviewNotes: 'Strong theatre candidate; cite the source record and keep the link external.',
    visualTone: 'text',
  },
  {
    title: 'La Sardana dels promesos',
    institution: 'Josep Morato i Grau / European Libraries',
    resourceType: 'Printed play',
    languages: ['Català'],
    disciplines: ['Catalan theatre', 'Dramaturgy', 'Voice'],
    sourceUrl: 'https://archive.org/details/bub_gb_TG8SHy1K6gAC',
    rightsStatus: 'PUBLIC_DOMAIN_OR_FREE_LICENSE_ITEM_REVIEW',
    licenseOrRightsUrl: 'http://creativecommons.org/publicdomain/mark/1.0/',
    jurisdictionNote:
      'Internet Archive marks this item as Public Domain Mark 1.0; review the exact scan record before reuse.',
    whyItMatters:
      'A concrete Catalan-language dramatic text for studying local theatre heritage, speech, and adaptation.',
    landingCardTitle: 'La Sardana dels promesos (1908)',
    landingCardSummary:
      'A Catalan dramatic text for voice, dramaturgy, rhythm, and culturally specific stage research.',
    riskLevel: 'low',
    reviewNotes: 'Good multilingual signal for the landing; maintain source attribution.',
    visualTone: 'text',
  },
  {
    title: 'Jesus Krist Gure Jaunaren Testamentu Berria',
    institution: 'Joanes Leizarraga / Basque Library Collection',
    resourceType: 'Historical book',
    languages: ['Euskera'],
    disciplines: ['Language heritage', 'Voice', 'Translation'],
    sourceUrl: 'https://archive.org/details/JesusKristGureJaunarenTestamentuBerria',
    rightsStatus: 'PUBLIC_DOMAIN_OR_FREE_LICENSE_ITEM_REVIEW',
    licenseOrRightsUrl: 'http://creativecommons.org/publicdomain/mark/1.0/',
    jurisdictionNote:
      'Internet Archive marks this item as Public Domain Mark 1.0; it is a historical Basque text, not a contemporary performance resource.',
    whyItMatters:
      'A landmark text for Basque written language, useful as a heritage signal for translation, diction, and linguistic research.',
    landingCardTitle: 'Leizarraga and early Basque prose',
    landingCardSummary:
      'A foundational Euskera text for language heritage, translation awareness, and voice research context.',
    riskLevel: 'low',
    reviewNotes: 'Use the framing carefully: language heritage and voice research, not film-specific material.',
    visualTone: 'archive',
  },
  {
    title: 'Rimas',
    institution: 'Gustavo Adolfo Becquer / LibriVox',
    resourceType: 'Poetry audiobook',
    languages: ['Español'],
    disciplines: ['Voice', 'Diction', 'Poetry'],
    sourceUrl: 'https://archive.org/details/rimas_1908_librivox',
    rightsStatus: 'PUBLIC_DOMAIN_US_WITH_JURISDICTION_NOTE',
    licenseOrRightsUrl: 'http://creativecommons.org/publicdomain/mark/1.0/',
    jurisdictionNote:
      'LibriVox recordings are released as public-domain audio; verify the item page and jurisdiction notes before reuse.',
    whyItMatters:
      'A concrete Spanish-language voice resource for breath, phrasing, poetic rhythm, and interpretive listening.',
    landingCardTitle: 'Becquer: Rimas for voice work',
    landingCardSummary:
      'A public-domain poetry recording for Spanish diction, breath control, cadence, and vocal analysis.',
    riskLevel: 'low',
    reviewNotes: 'Strong practical resource for performers and voice training.',
    visualTone: 'voice',
  },
  {
    title: 'The Photoplay: A Psychological Study',
    institution: 'Hugo Munsterberg / Internet Archive scan',
    resourceType: 'Film theory text',
    languages: ['English'],
    disciplines: ['Film theory', 'Editing', 'Audience psychology'],
    sourceUrl: 'https://archive.org/details/photoplayapsycho005300mbp',
    rightsStatus: 'PUBLIC_DOMAIN_US_WITH_ITEM_REVIEW',
    licenseOrRightsUrl: 'https://archive.org/details/photoplayapsycho005300mbp',
    jurisdictionNote:
      'Published in 1916, but the specific scan and metadata should be reviewed before reuse beyond linking.',
    whyItMatters:
      'A classic early film-theory text connecting cinema, perception, attention, memory, and dramatic construction.',
    landingCardTitle: 'The Photoplay (1916)',
    landingCardSummary:
      'A foundational film-theory text for studying editing, spectatorship, psychology, and cinematic form.',
    riskLevel: 'medium',
    reviewNotes: 'Good fit editorially; keep link-only until item metadata is reviewed on the page.',
    visualTone: 'text',
  },
  {
    title: 'Masks or Faces?',
    institution: 'William Archer / University of Toronto',
    resourceType: 'Acting theory text',
    languages: ['English'],
    disciplines: ['Acting', 'Stage psychology', 'Performance theory'],
    sourceUrl: 'https://archive.org/details/masksorfacesstud00archuoft',
    rightsStatus: 'PUBLIC_DOMAIN_US_WITH_ITEM_REVIEW',
    licenseOrRightsUrl: 'https://archive.org/details/masksorfacesstud00archuoft',
    jurisdictionNote:
      'The book was published in 1888; the item page should still be reviewed because no modern open-license badge is always visible.',
    whyItMatters:
      'A historically important study of acting psychology and the performer’s emotional involvement.',
    landingCardTitle: 'Masks or Faces? (1888)',
    landingCardSummary:
      'A classic acting-theory resource for performers, directors, and teachers comparing technique and emotion.',
    riskLevel: 'medium',
    reviewNotes: 'Useful and relevant; keep as external reference unless the item license is confirmed.',
    visualTone: 'text',
  },
];
