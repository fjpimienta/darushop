export interface IProduct {
  id?: number;
  name?: string;
  slug?: string;
  short_desc?: string;
  price: number;
  sale_price: number;
  review: number;
  ratings: number;
  until: string;
  stock: number;
  top: boolean;
  featured: boolean;
  new: boolean;
  author: string;
  sold: string;
  category: ICategorys[];
  brands: IBrands[];
  pictures: IPicture[];
  sm_pictures?: IPicture[];
  variants?: IVariant[];
  active: boolean;
}

export interface ICategorys {
  name: string;
  slug: string;
  pivot: IPivotCategory;
}

export interface IPivotCategory {
  product_id: string;
  product_category_id: string;
}

export interface IBrands {
  name: string;
  slug: string;
  pivot: IPivotBrand;
}

export interface IPivotBrand {
  product_id: string;
  brand_id: string;
}

export interface IPicture {
  width: string;
  height: string;
  url: string;
  pivot: IPivotePicture;
}

export interface IPivotePicture {
  related_id: string;
  upload_file_id: string;
}

export interface IVariant {
  id: number;
  color: string;
  color_name: string;
  price: number;
  pivot: IPivoteVariant;
  size: ISize;
}

export interface IPivoteVariant {
  product_id: string;
  component_id: string;
}

export interface ISize {
  id: number;
  name: string;
  slug: string;
  pivot: IPivoteSize;
}

export interface IPivoteSize {
  components_variants_variant_id: string;
  component_id: string;
}
