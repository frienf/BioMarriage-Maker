export type PhotoCrop = { scale: number; offsetX: number; offsetY: number };

export type PhotoState = {
  src: string | null; // object URL or data URL of original uploaded photo
  crop: PhotoCrop;
};

export type BiodataSection = 'personal' | 'family' | 'education' | 'contact' | 'horoscope';

export type Biodata = {
  fullName?: string;
  [key: string]: unknown;
};

export type TemplateEntry = {
  id: string;
  version: number;
  thumb: string;
  background: string;
  manifest: import('./schema').Manifest;
};
