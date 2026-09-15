/**
 * A3 Interior Designer & Builder — studio content.
 *
 * Business details and review quotes come from the studio's Google Business
 * Profile. All interiors imagery is generated for this build and served
 * locally from /public/images as WebP.
 */

export const BUSINESS = {
  name: 'A3 Interior Designer & Builder',
  wordmark: 'A3',
  wordmarkAccent: 'Interior',
  category: 'Interior designer in Gorakhpur, Uttar Pradesh',
  description:
    'Interior design firm, also featuring an architect, helping with design needs for residential and commercial spaces.',
  addressLines: [
    'Second Floor, Azeet Plaza',
    'Commercial Road, Buddha Vihar, Taramandal',
    'Gorakhpur, Uttar Pradesh 273001',
  ],
  locality: 'Gorakhpur, Uttar Pradesh',
  phoneDisplay: '094515 46780',
  phoneHref: 'tel:+919451546780',
  whatsapp: 'https://wa.me/919451546780',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=A3%20Interior%20Designer%20%26%20Builder%2C%20Azeet%20Plaza%2C%20Commercial%20Road%2C%20Taramandal%2C%20Gorakhpur',
  reviewsUrl: 'https://www.google.com/search?q=a3+interior+design+gorakhpur',
  rating: '4.8',
  reviewCount: 174,
  hours: 'Open · Closes 10 pm',
  hoursNote: 'Mon — Sun · 10:00 am – 10:00 pm',
  founded: '2016',
} as const

/** Locally generated interiors, served as WebP. */
export const IMAGES = {
  hero: '/images/hero-living.webp',
  philosophy: '/images/philosophy-detail.webp',
  residenceObsidian: '/images/res-obsidian.webp',
  residenceGarden: '/images/res-garden.webp',
  residenceTerracotta: '/images/res-terracotta.webp',
  residenceStudio: '/images/res-studio.webp',
  galleryLiving: '/images/gal-living.webp',
  galleryLounge: '/images/gal-lounge.webp',
  galleryKitchen: '/images/gal-kitchen.webp',
  galleryBedroom: '/images/gal-bedroom.webp',
} as const

export const MARQUEE = [
  'Interior design',
  'Modular kitchens',
  'Wardrobes & storage',
  'Residential decorators',
  'Architecture',
  'Turnkey fit-outs',
  'Commercial interiors',
  'Site supervision',
] as const

/** Philosophy — sticky metrics rail. */
export const METRICS = [
  {
    icon: 'solar:cup-star-linear',
    value: '4.8',
    suffix: '/ 5',
    label: 'Average rating across 174 Google reviews.',
  },
  {
    icon: 'solar:medal-ribbon-linear',
    value: '174',
    suffix: 'reviews',
    label: 'Verified reviews from Gorakhpur homes & businesses.',
  },
  {
    icon: 'solar:shield-check-linear',
    value: '10 PM',
    suffix: 'open late',
    label: 'Free design consultation, seven days a week.',
  },
] as const

export type Residence = {
  index: string
  title: string
  location: string
  year: string
  summary: string
  area: string
  config: string
  price: string
  image: string
}

export const RESIDENCES: Residence[] = [
  {
    index: '01',
    title: 'Obsidian Loft',
    location: 'Taramandal, Gorakhpur',
    year: '2025',
    summary:
      'A three-bedroom apartment rebuilt around a dark-stone kitchen island, with seamless storage walls and warm oak underfoot.',
    area: '2,400 sq ft',
    config: '3 BHK',
    price: 'On request',
    image: IMAGES.residenceObsidian,
  },
  {
    index: '02',
    title: 'Garden Duplex',
    location: 'Buddha Vihar, Gorakhpur',
    year: '2025',
    summary:
      'Architecture and interiors delivered together — a shaded courtyard, fluted plaster headboards and brass fittings throughout.',
    area: '3,100 sq ft',
    config: '4 BHK Duplex',
    price: 'On request',
    image: IMAGES.residenceGarden,
  },
  {
    index: '03',
    title: 'Terracotta Villa',
    location: 'Rapti Nagar, Gorakhpur',
    year: '2024',
    summary:
      'Turnkey interiors for a family home: arched passageways, a reading nook under the skylight and a modular kitchen in teak.',
    area: '2,850 sq ft',
    config: '4 BHK',
    price: 'On request',
    image: IMAGES.residenceTerracotta,
  },
  {
    index: '04',
    title: 'Studio Bone',
    location: 'Golghar, Gorakhpur',
    year: '2024',
    summary:
      'A calm commercial fit-out — acoustic ceilings, linear lighting and oak workstations detailed for a team of thirty.',
    area: '1,650 sq ft',
    config: 'Workspace',
    price: 'On request',
    image: IMAGES.residenceStudio,
  },
]

/** Material board — drives both the DOM swatches and the WebGL scene. */
export type Material = {
  name: string
  finish: string
  swatch: string
  note: string
}

export const MATERIALS: Material[] = [
  { name: 'Travertine', finish: 'Honed', swatch: '#d9cfbd', note: 'Counters, ledges, thresholds' },
  { name: 'Smoked Oak', finish: 'Fluted', swatch: '#9a6b3f', note: 'Wardrobes, panelling, joinery' },
  { name: 'Black Stone', finish: 'Leathered', swatch: '#2b2b2b', note: 'Kitchen islands, wet areas' },
  { name: 'Limewash', finish: 'Burnished', swatch: '#e8e2d4', note: 'Walls, arches, ceilings' },
]

/** Pinned shell → finished transformation. */
export const PROCESS = [
  {
    step: '01',
    title: 'Survey & brief',
    copy: 'We measure every wall, note the way light moves through the day and agree the budget before a single line is drawn.',
  },
  {
    step: '02',
    title: 'Drawings & 3D',
    copy: 'Layouts, elevations and a walkthrough our carpenters can actually build from — approved by you room by room.',
  },
  {
    step: '03',
    title: 'Joinery & site work',
    copy: 'Shutters, frames and storage are made in our workshop while electricians and plasterers finish on site.',
  },
  {
    step: '04',
    title: 'Styling & handover',
    copy: 'Hardware, lighting, textiles and a full clean before the keys change hands — then a check-in after the monsoon.',
  },
] as const

/** Gallery mosaic. */
export const GALLERY = [
  {
    src: IMAGES.galleryLiving,
    alt: 'Living room with oak battens wrapping a lit media wall',
    caption: 'Living room',
    project: 'Terracotta Villa',
    span: 'tall',
  },
  {
    src: IMAGES.galleryLounge,
    alt: 'Lounge alcove with two curved armchairs and an arched mirror',
    caption: 'Lounge',
    project: 'Obsidian Loft',
    span: 'wide',
  },
  {
    src: IMAGES.galleryKitchen,
    alt: 'Modular kitchen island in pale stone with two oak stools',
    caption: 'Modular kitchen',
    project: 'Studio Bone',
    span: 'standard',
  },
  {
    src: IMAGES.galleryBedroom,
    alt: 'Master bedroom with a fluted plaster headboard wall',
    caption: 'Master bedroom',
    project: 'Garden Duplex',
    span: 'standard',
  },
] as const

export type Review = {
  quote: string
  highlights: string[]
  meta: string
}

/** Review quotes, verbatim from the Google Business Profile. */
export const REVIEWS: Review[] = [
  {
    quote: 'Good looking for my design in my home very nice work thank you for company',
    highlights: ['home', 'work', 'company'],
    meta: 'Google review',
  },
  {
    quote: 'We absolutely loved the service from A3 interior designer & builders.',
    highlights: ['service'],
    meta: 'Google review',
  },
  {
    quote: 'He provides interior designing service in gorakhpur, and nearby city.',
    highlights: ['designing service'],
    meta: 'Google review',
  },
  {
    quote:
      'A3 interior designer is leading the best architect and top interior designers in Gorakhpur, working with the aim of creating a new way of furnishing.',
    highlights: ['architect', 'top interior designers'],
    meta: 'From the studio on Google',
  },
]

export const SERVICES = [
  'Interior design',
  'Residential interior decorators',
  'Interior decorators service',
  'Kitchen designs & kitchen interior',
  'Architecture',
] as const
