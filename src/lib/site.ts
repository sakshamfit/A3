/**
 * A3 Interior Designer & Builder — studio content.
 * Business details, review quotes and product lines are taken from the studio's
 * Google Business Profile; imagery follows the source asset map.
 */

export const BUSINESS = {
  name: 'A3 Interior Designer & Builder',
  wordmark: 'A3',
  wordmarkAccent: 'Interior',
  category: 'Interior designer in Gorakhpur, Uttar Pradesh',
  description:
    'Interior design firm, also featuring an architect, helping with design needs for residential and commercial spaces.',
  address:
    'Second Floor, Commercial Road, Azeet Plaza, Buddha Vihar, Taramandal, Gorakhpur, Uttar Pradesh 273001',
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
} as const

/** Asset map — exact sources from the reference build. */
export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop',
  philosophy:
    'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1992&auto=format&fit=crop',
  residenceObsidian:
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2700&auto=format&fit=crop',
  residenceGarden:
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop',
  gallery1:
    'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg',
  gallery2:
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop',
  gallery3:
    'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg',
  gallery4:
    'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg',
} as const

/** Philosophy section — sticky metrics column. */
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

/** Featured residences — the availability list. */
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
      'Architecture and interiors delivered together — double-height living, a shaded courtyard, and a staircase cast in place.',
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
    image: IMAGES.gallery1,
  },
  {
    index: '04',
    title: 'Studio Bone',
    location: 'Golghar, Gorakhpur',
    year: '2024',
    summary:
      'A calm commercial fit-out — acoustic ceilings, linear lighting and furniture detailed for a team of thirty.',
    area: '1,650 sq ft',
    config: 'Workspace',
    price: 'On request',
    image: IMAGES.gallery3,
  },
]

/** Highlights — dark band. */
export const HIGHLIGHTS = [
  {
    icon: 'solar:city-linear',
    title: 'Homes & Workspaces',
    copy: 'Residential interiors, retail and commercial fit-outs across Gorakhpur and the nearby cities of Uttar Pradesh.',
  },
  {
    icon: 'solar:leaf-linear',
    title: 'Design To Delivery',
    copy: 'An in-house team of designers, an architect and craftsmen — one point of contact from first sketch to handover.',
  },
  {
    icon: 'solar:lock-keyhole-linear',
    title: 'Built To The Estimate',
    copy: 'Transparent estimates, a fixed scope of work, and modular kitchens and wardrobes finished to last.',
  },
] as const

/** Gallery mosaic. */
export const GALLERY = [
  {
    src: IMAGES.gallery1,
    alt: 'Living room with layered lighting and an oak media wall',
    caption: 'Living room',
    project: 'Terracotta Villa',
    span: 'tall',
  },
  {
    src: IMAGES.gallery2,
    alt: 'Lounge seating in warm neutral tones',
    caption: 'Lounge',
    project: 'Obsidian Loft',
    span: 'wide',
  },
  {
    src: IMAGES.gallery3,
    alt: 'Master bedroom with a fluted headboard wall',
    caption: 'Master bedroom',
    project: 'Garden Duplex',
    span: 'standard',
  },
  {
    src: IMAGES.gallery4,
    alt: 'Modular kitchen with a stone island and tall units',
    caption: 'Modular kitchen',
    project: 'Studio Bone',
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
    quote:
      'Good looking for my design in my home very nice work thank you for company',
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
]

export const SERVICES = [
  'Interior design',
  'Residential interior decorators',
  'Interior decorators service',
  'Kitchen designs & kitchen interior',
  'Architecture',
] as const
