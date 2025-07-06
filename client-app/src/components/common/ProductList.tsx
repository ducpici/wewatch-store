import ProductCard from "./ProductCard";

interface Product {
    id: number;
    modal_num: string;
    name: string;
    brand: {
        id: number;
        name: string;
        description: string;
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
    };
    quantity: number;
    price: number;
    image: string;
    state: string;
    slug: string;
    functions: {
        id: number;
        name: string;
    }[];
}

interface ProductListProps {
    products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    return (
        <section className="my-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <ProductCard product={product} key={product.id} />
                ))}
            </div>
        </section>
    );
};

export default ProductList;
