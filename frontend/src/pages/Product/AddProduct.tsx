import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";
import MultiSelect from "../../components/form/MultiSelect";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import Switch from "../../components/form/switch/Switch";
import FileInput from "../../components/form/input/FileInput";
import axios from "../../lib/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function AddProduct() {
    type Product = {
        modal_num: string;
        brand_id: number;
        origin: string;
        crystal_material: string;
        movement_type: string;
        dial_diameter: number | null;
        case_thickness: number | null;
        strap_material: string;
        water_resistance: number | null;
        category_id: number;
        quantity: string;
        price: string;
        state: boolean;
        image: File | null;
        functions: string[];
    };

    const initialProduct: Product = {
        modal_num: "",
        brand_id: 1,
        origin: "",
        crystal_material: "",
        movement_type: "",
        dial_diameter: null,
        case_thickness: null,
        strap_material: "",
        water_resistance: null,
        category_id: 1,
        quantity: "",
        price: "",
        image: null,
        state: true,
        functions: [],
    };

    const [productData, setProductData] = useState<Product>(initialProduct);
    const [brandData, setBrandData] = useState([]);
    const [categoryDara, setCategoryData] = useState([]);
    const [functionData, setFunctionData] = useState([]);
    const [isEnabled, setIsEnabled] = useState(true);
    const [selectedValue, setSelectedValue] = useState<string>();
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Sản phẩm", path: "/products" },
        { label: "Thêm mới" }, // Không có path => là trang hiện tại
    ];

    const navigate = useNavigate();

    const handleSwitchChange = (checked: boolean) => {
        setIsEnabled(checked);
        setProductData({
            ...productData,
            state: checked,
        });
    };

    const handleBrandChange = (value: string) => {
        const num = parseInt(value);
        setProductData({
            ...productData,
            brand_id: num,
        });
    };

    const handleCategoryChange = (value: string) => {
        const num = parseInt(value);
        setProductData({
            ...productData,
            category_id: num,
        });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setProductData({
                ...productData,
                image: file,
            });
        }
    };

    const handleCreateProduct = async () => {
        if (
            !productData.image ||
            !productData.modal_num ||
            !productData.brand_id ||
            !productData.category_id ||
            !productData.case_thickness ||
            !productData.crystal_material ||
            !productData.dial_diameter ||
            !productData.movement_type ||
            !productData.origin ||
            !productData.quantity ||
            !productData.price ||
            !productData.strap_material ||
            !productData.water_resistance ||
            productData.state === null ||
            productData.state === undefined
        ) {
            toast.error("Các trường không được để trống!");
            return;
        }
        const file = productData.image;

        if (!(file instanceof File) || !file.type.startsWith("image/")) {
            toast.error("File phải là hình ảnh!");
            return;
        }
        if (productData.functions.length === 0) {
            toast.error("Vui lòng chọn ít nhất một chức năng!");
            return;
        }
        try {
            const modal_num = productData.modal_num;
            const { data } = await axios.get("/products/check", {
                params: {
                    modal_num,
                },
            });

            if (data.modalNumExists) {
                toast.error("Số hiệu sản phẩm đã được sử dụng!");
                return;
            }

            const formData = new FormData();
            if (productData.image) {
                formData.append("file", productData.image);
            }
            formData.append("modal_num", productData.modal_num);
            formData.append("brand_id", String(productData.brand_id));
            formData.append("origin", productData.origin);
            formData.append("crystal_material", productData.crystal_material);
            formData.append("movement_type", productData.movement_type);
            formData.append("dial_diameter", String(productData.dial_diameter));
            formData.append(
                "case_thickness",
                String(productData.case_thickness)
            );
            formData.append("strap_material", productData.strap_material);
            formData.append(
                "water_resistance",
                String(productData.water_resistance)
            );
            formData.append("category_id", String(productData.category_id));
            formData.append("quantity", productData.quantity);
            formData.append("price", productData.price);
            formData.append("state", String(productData.state));
            productData.functions.forEach((func) => {
                formData.append("functions[]", func);
            });

            await axios.post(`/products`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Thêm thành công!");
            navigate("/products");
        } catch (error) {
            console.error("Lỗi khi thêm:", error);
            toast.error("Thêm thất bại.");
        }
    };

    const getBrands = () => {
        let res = axios
            .get("/brands")
            .then((response) => {
                const data = response.data.data;
                setBrandData(data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };

    const getCategories = () => {
        let res = axios
            .get("/categories")
            .then((response) => {
                const data = response.data.data;
                setCategoryData(data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };

    const getFunctions = () => {
        let res = axios
            .get("/functions")
            .then((response) => {
                const data = response.data.data;
                setFunctionData(data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };
    useEffect(() => {
        getBrands();
        getCategories();
        getFunctions();
    }, []);

    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ComponentCard title="Thông tin sản phẩm">
                    <div>
                        <Label htmlFor="modal_num">Số hiệu sản phẩm:</Label>
                        <Input
                            type="text"
                            id="modal_num"
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    modal_num: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="origin">Xuất xứ:</Label>
                        <Input
                            type="text"
                            id="origin"
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    origin: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label>Nhà cung cấp:</Label>
                        <Select
                            options={brandData}
                            placeholder="Chọn nhà cung cấp"
                            onChange={handleBrandChange}
                            className="dark:bg-dark-900"
                        />
                    </div>
                    <div>
                        <Label>Loại sản phẩm:</Label>
                        <Select
                            options={categoryDara}
                            placeholder="Chọn loại sản phẩm"
                            onChange={handleCategoryChange}
                            className="dark:bg-dark-900"
                        />
                    </div>
                    <div>
                        <Label htmlFor="quantity">Số lượng:</Label>
                        <Input
                            type="text"
                            id="quantity"
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    quantity: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="price">Giá:</Label>
                        <Input
                            type="text"
                            id="price"
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    price: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label>Hình ảnh</Label>
                        <FileInput
                            onChange={handleFileChange}
                            className="custom-class"
                        />
                    </div>
                    <div className="flex items-center">
                        <Label className="mb-0">Trạng thái:</Label>
                        <div className="ml-6">
                            <Switch
                                label={isEnabled ? "Hoạt động" : "Vô hiệu"}
                                checked={isEnabled}
                                onChange={handleSwitchChange}
                            />
                        </div>
                    </div>
                </ComponentCard>
                <ComponentCard title="Thông số">
                    <div>
                        <Label htmlFor="crystal_material">
                            Chất liệu mặt kính:
                        </Label>
                        <Input
                            type="text"
                            id="crystal_material"
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    crystal_material: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="movement">Loại động cơ:</Label>
                        <Input
                            type="text"
                            id="movement"
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    movement_type: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="dial">Đường kính mặt số:</Label>
                        <Input
                            type="text"
                            id="dial"
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    dial_diameter: parseFloat(e.target.value),
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="case">Độ dày thân:</Label>
                        <Input
                            type="text"
                            id="case"
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    case_thickness: parseFloat(e.target.value),
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="strap">Chất liệu dây đeo:</Label>
                        <Input
                            type="text"
                            id="strap"
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    strap_material: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="water">Hiệu suất chống nước:</Label>
                        <Input
                            type="text"
                            id="water"
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    water_resistance: parseFloat(
                                        e.target.value
                                    ),
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="functions">Chức năng:</Label>
                        <MultiSelect
                            options={functionData}
                            defaultSelected={selectedValues}
                            // onChange={(values) => setSelectedValues(values)}
                            onChange={(values) => {
                                setProductData({
                                    ...productData,
                                    functions: values,
                                });
                            }}
                        />
                    </div>
                </ComponentCard>
            </div>
            <div>
                <Button
                    className="mt-6"
                    size="sm"
                    variant="primary"
                    onClick={handleCreateProduct}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
