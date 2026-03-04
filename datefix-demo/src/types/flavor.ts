export type FlavorName = "original" | "cinnamon" | "turmeric" | "ginger";

export type IdleAnimationParams = {
  floatAmplitudeX: number;
  floatAmplitudeY: number;
  floatDuration: number;
  floatDelay: number;
  rotateAmplitude: number;
};

export type SceneLayer = {
  id: string;
  imagePath: string;
  alt: string;
  zIndex: number;
  parallaxMultiplier: number;
  idleAnimation: IdleAnimationParams;
  offsetX: number;
  offsetY: number;
  scale: number;
};

export type FlavorConfig = {
  name: FlavorName;
  displayName: string;
  subtitle: string;
  description: string;
  colorToken: string;
  colorHex: string;
  packetLayer: SceneLayer | null;
  ingredientLayers: SceneLayer[];
};
