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

/** Locally generated interiors, served as WebP / JPG. */
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
  // new interiors generated for stacked spreads & flips
  ivoryKitchen: '/images/res-ivory-kitchen.jpg',
  sageBedroom: '/images/res-sage-bedroom.jpg',
  archedLibrary: '/images/res-arched-library.jpg',
  brassBath: '/images/res-brass-bath.jpg',
  oakDining: '/images/res-oak-dining.jpg',
  courtyard: '/images/res-courtyard.jpg',
  workspace: '/images/res-workspace.jpg',
  obsidianLuxe: '/images/res-obsidian-luxe.jpg',
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
  /** Full-bleed backdrop the scroll-expansion panel starts on. */
  backdrop: string
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
    backdrop: IMAGES.galleryKitchen,
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
    backdrop: IMAGES.galleryBedroom,
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
    backdrop: IMAGES.philosophy,
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
    backdrop: IMAGES.hero,
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

/** Stack Spread — deck that fans out on scroll */
export const STACK_SPREAD_ITEMS = [
  {
    src: IMAGES.galleryLiving,
    alt: "Living room with oak battens wrapping a lit media wall",
    title: "Living",
    subtitle: "Terracotta Villa",
  },
  {
    src: IMAGES.galleryLounge,
    alt: "Lounge alcove with two curved armchairs and an arched mirror",
    title: "Lounge",
    subtitle: "Obsidian Loft",
  },
  {
    src: IMAGES.ivoryKitchen,
    alt: "Ivory modular kitchen with smoked oak cabinets and travertine island",
    title: "Ivory Kitchen",
    subtitle: "Taramandal · 2025",
  },
  {
    src: IMAGES.sageBedroom,
    alt: "Sage fluted headboard bedroom with linen bedding",
    title: "Sage Bedroom",
    subtitle: "Buddha Vihar · 2025",
  },
  {
    src: IMAGES.oakDining,
    alt: "Oak dining table with garden view",
    title: "Dining",
    subtitle: "Rapti Nagar · 2024",
  },
] as const

/** GSAP Card Flip — editorial frames */
export const FLIP_FRAMES = [
  {
    id: "obsidian",
    image: IMAGES.residenceObsidian,
    alt: "Dark stone kitchen island with seamless storage walls",
    title: "Obsidian Loft",
    subtitle: "Taramandal · 3 BHK",
    caption: "The dark stone island anchors the apartment — storage walls disappear around it.",
  },
  {
    id: "ivory",
    image: IMAGES.ivoryKitchen,
    alt: "Ivory kitchen with travertine island and oak stools",
    title: "Ivory Kitchen",
    subtitle: "Taramandal · Modular",
    caption: "Ivory shutters, oak inside, travertine on top — built in our workshop to the millimetre.",
  },
  {
    id: "sage",
    image: IMAGES.sageBedroom,
    alt: "Sage bedroom with fluted plaster headboard",
    title: "Sage Bedroom",
    subtitle: "Buddha Vihar · 4 BHK",
    caption: "Fluted plaster catches the morning light; the wardrobe behind it holds a whole dressing room.",
  },
  {
    id: "arched",
    image: IMAGES.archedLibrary,
    alt: "Arched library reading nook with skylight",
    title: "Arched Nook",
    subtitle: "Rapti Nagar · Library",
    caption: "A reading arch under a skylight — limewash, oak shelves, terracotta underfoot.",
  },
  {
    id: "dining",
    image: IMAGES.oakDining,
    alt: "Oak dining with garden view",
    title: "Garden Dining",
    subtitle: "Rapti Nagar · Villa",
    caption: "Twelve seats around smoked oak, garden beyond the glass — where the villa slows down.",
  },
  {
    id: "bath",
    image: IMAGES.brassBath,
    alt: "Black stone bathroom with brass fittings and arched mirror",
    title: "Brass Bath",
    subtitle: "Golghar · Bath",
    caption: "Black stone, brass, arched mirror — the wet area that feels like a lounge.",
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

/** Studio team — shown in the Meet the Owners carousel. */
export type Owner = {
  name: string
  role: string
  avatar: string
  quote: string
  bio: string
  location: string
  experience: string
  tags: string[]
  meta: string
  socials: {
    instagram?: string
    linkedin?: string
    twitter?: string
  }
}

export const OWNERS: Owner[] = [
  {
    name: 'Aman Agarwal',
    role: 'Founder & Principal Designer',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&h=640&fit=crop&crop=face&q=70&auto=format',
    quote:
      'Good drawings kept falling apart on site — so we kept the drawings and the site under one roof. That is still how we work.',
    bio: 'Started A3 on the second floor of Azeet Plaza in 2016. Aman draws every plan himself, then stays on site until the last handle is level. Clients know him for the notebook he carries and the way he will redraw a kitchen three times rather than force a compromise.',
    location: 'Gorakhpur',
    experience: '12+ years',
    tags: ['Residential', 'Turnkey', 'On-site every day'],
    meta: 'B.Arch · Founded A3 in 2016',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    name: 'Shalini Agarwal',
    role: 'Head of Interiors & Sourcing',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=640&h=640&fit=crop&crop=face&q=70&auto=format',
    quote:
      'A home is not a catalogue. It is the one place where nothing should need explaining — every colour, every joint, every light.',
    bio: 'Shalini runs materials and light. From travertine ledges to the exact hinge that will survive a monsoon, she tests everything in our workshop before it reaches your home. She also leads the final styling — the step that makes a finished room feel inhabited from day one.',
    location: 'Taramandal',
    experience: '9 years',
    tags: ['Materials', 'Lighting', 'Styling'],
    meta: 'M.Des Interiors · Joined 2018',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    name: 'Vikash Yadav',
    role: 'Project Head — Execution & Joinery',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=640&h=640&fit=crop&crop=face&q=70&auto=format',
    quote: 'We build the shutters in our shop so that on site we are fitting, not figuring. That one choice saves weeks.',
    bio: 'Vikash came from our carpentry workshop and now runs every site. He coordinates the eight trades that can be in one apartment at once and keeps the single price we quoted. If you meet him at 7 am he already knows which wall will be painted that day.',
    location: 'Workshop & Site',
    experience: '14 years',
    tags: ['Joinery', 'Site supervision', 'Handover'],
    meta: 'Master Carpenter · With A3 since 2017',
    socials: {
      instagram: 'https://instagram.com',
      twitter: 'https://x.com',
    },
  },
]
