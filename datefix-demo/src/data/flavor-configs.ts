import type { FlavorConfig, SceneLayer } from "@/types/flavor";

const PACKET_DEFAULTS: Pick<SceneLayer, "zIndex" | "parallaxMultiplier" | "idleAnimation" | "scale"> = {
  zIndex: 5,
  parallaxMultiplier: 0.15,
  scale: 1,
  idleAnimation: {
    floatAmplitudeX: 1,
    floatAmplitudeY: 2,
    floatDuration: 5000,
    floatDelay: 0,
    rotateAmplitude: 0.3,
  },
};

const ORIGINAL_CONFIG: FlavorConfig = {
  name: "original",
  displayName: "Original",
  subtitle: "dates blended with orange blossom water",
  description: "Rich medjool dates delicately blended with orange blossom water for a pure, timeless sweetness.",
  colorToken: "datefix-original",
  colorHex: "#94b8f2",
  packetLayer: {
    ...PACKET_DEFAULTS,
    id: "packet-original",
    imagePath: "/packets/original.webp",
    alt: "DateFix Original packet",
    offsetX: -8,
    offsetY: -10,
  },
  ingredientLayers: [
    {
      id: "original-dates",
      imagePath: "/ingredients/dates.png",
      alt: "Two split medjool dates",
      zIndex: 1,
      parallaxMultiplier: 0.4,
      idleAnimation: {
        floatAmplitudeX: 3,
        floatAmplitudeY: 5,
        floatDuration: 4000,
        floatDelay: 0,
        rotateAmplitude: 1.5,
      },
      offsetX: 0,
      offsetY: -10,
      scale: 2.2,
    },
    {
      id: "original-top-date",
      imagePath: "/ingredients/top-date.png",
      alt: "Single medjool date",
      zIndex: 10,
      parallaxMultiplier: 0.7,
      idleAnimation: {
        floatAmplitudeX: 5,
        floatAmplitudeY: 7,
        floatDuration: 3500,
        floatDelay: 200,
        rotateAmplitude: 2,
      },
      offsetX: 0,
      offsetY: 0,
      scale: 1,
    },
  ],
};

const CINNAMON_CONFIG: FlavorConfig = {
  name: "cinnamon",
  displayName: "Cinnamon",
  subtitle: "dates blended with orange blossom water",
  description: "Warm ceylon cinnamon meets the natural caramel of medjool dates, finished with a floral touch.",
  colorToken: "datefix-cinnamon",
  colorHex: "#d684cc",
  packetLayer: {
    ...PACKET_DEFAULTS,
    id: "packet-cinnamon",
    imagePath: "/packets/cinnamon.webp",
    alt: "DateFix Cinnamon packet",
    offsetX: -8,
    offsetY: -10,
  },
  ingredientLayers: [
    {
      id: "cinnamon-sticks",
      imagePath: "/ingredients/cinnamon.png",
      alt: "Cinnamon sticks with ground cinnamon",
      zIndex: 1,
      parallaxMultiplier: 0.4,
      idleAnimation: {
        floatAmplitudeX: 4,
        floatAmplitudeY: 6,
        floatDuration: 4500,
        floatDelay: 300,
        rotateAmplitude: 1,
      },
      offsetX: -0.5,
      offsetY: -11.5,
      scale: 2.25,
    },
    {
      id: "cinnamon-top",
      imagePath: "/ingredients/top-cinnamon.png",
      alt: "Small crossed cinnamon sticks",
      zIndex: 10,
      parallaxMultiplier: 0.8,
      idleAnimation: {
        floatAmplitudeX: 6,
        floatAmplitudeY: 8,
        floatDuration: 3000,
        floatDelay: 500,
        rotateAmplitude: 2.5,
      },
      offsetX: 0,
      offsetY: 0,
      scale: 1,
    },
  ],
};

const TURMERIC_CONFIG: FlavorConfig = {
  name: "turmeric",
  displayName: "Turmeric",
  subtitle: "dates blended with orange blossom water",
  description: "Golden turmeric root paired with sweet dates for an earthy, sun-kissed bite.",
  colorToken: "datefix-turmeric",
  colorHex: "#e0a958",
  packetLayer: {
    ...PACKET_DEFAULTS,
    id: "packet-turmeric",
    imagePath: "/packets/turmeric.webp",
    alt: "DateFix Turmeric packet",
    offsetX: -8,
    offsetY: -10,
  },
  ingredientLayers: [
    {
      id: "turmeric-root",
      imagePath: "/ingredients/turmeric.png",
      alt: "Turmeric root with powder",
      zIndex: 1,
      parallaxMultiplier: 0.5,
      idleAnimation: {
        floatAmplitudeX: 4,
        floatAmplitudeY: 5,
        floatDuration: 4200,
        floatDelay: 100,
        rotateAmplitude: 1.2,
      },
      offsetX: 0,
      offsetY: -8,
      scale: 2.1,
    },
  ],
};

const GINGER_CONFIG: FlavorConfig = {
  name: "ginger",
  displayName: "Ginger",
  subtitle: "dates blended with orange blossom water",
  description: "Fresh ginger root brings a bright, warming kick to naturally sweet medjool dates.",
  colorToken: "datefix-ginger",
  colorHex: "#a0c75d",
  packetLayer: {
    ...PACKET_DEFAULTS,
    id: "packet-ginger",
    imagePath: "/packets/ginger.webp",
    alt: "DateFix Ginger packet",
    offsetX: -8,
    offsetY: -10,
  },
  ingredientLayers: [
    {
      id: "ginger-root",
      imagePath: "/ingredients/ginger.png",
      alt: "Fresh ginger root",
      zIndex: 1,
      parallaxMultiplier: 0.5,
      idleAnimation: {
        floatAmplitudeX: 3,
        floatAmplitudeY: 5,
        floatDuration: 4000,
        floatDelay: 150,
        rotateAmplitude: 1,
      },
      offsetX: 0,
      offsetY: -7.5,
      scale: 2.1,
    },
  ],
};

export const ALL_FLAVORS: FlavorConfig[] = [
  ORIGINAL_CONFIG,
  GINGER_CONFIG,
  TURMERIC_CONFIG,
  CINNAMON_CONFIG,
];
