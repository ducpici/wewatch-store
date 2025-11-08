export type Product = {
  id: number;
  modal_num: string;
  name: string;
  brand: {
    id: number;
    name: string;
    description: string;
    slug: string;
  };
  origin: string;
  crystal_material: string;
  movement_type: string;
  dial_diameter: string;
  case_thickness: string;
  strap_material: string;
  water_resistance: string;
  category: {
    id: number;
    name: string;
    description: string;
    slug: string;
  };
  quantity: number;
  price: number;
  image: string;
  slug: string;
  state: string;
  functions: ProductFunction[];
};

type ProductFunction = {
  id: number;
  name: string;
};

export type RelatedProduct = {
  title?: string | undefined;
  slug: string;
};
