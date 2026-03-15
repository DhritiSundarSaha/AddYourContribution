export type Product = {
  _id: string;
  name: string;
  category: 'Men' | 'Women' | 'Unisex';
  designCategory: 'Anime' | 'Bollywood' | 'Hollywood' | 'Gaming' | 'Sports' | 'Mandala' | 'Minimal' | 'Line art';
  type: 'T-shirt' | 'Hoodie' | 'Cap' | 'Mug' | 'Sports T-shirt';
  sizes: string[];
  colors: string[];
  basePrice: number;
  mockupImage?: string;
};

export type Asset = {
  _id: string;
  title: string;
  category: string;
  fileUrl: string;
};
