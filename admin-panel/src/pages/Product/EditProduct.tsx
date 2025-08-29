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
import { useNavigate, useParams } from "react-router";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function EditProduct() {
    const { id } = useParams();

    type Product = {
        modal_num: string;
        brand: {
            id: number | null;
            name: string;
            description: string;
        };
        origin: string;
        crystal_material: string;
        movement_type: string;
        dial_diameter: number | null;
        case_thickness: number | null;
        strap_material: string;
        water_resistance: string;
        category: {
            id: number | null;
            name: string;
            description: string;
        };
        quantity: string | null;
        price: string | null;
        state: boolean;
        image: File | null;
        functions: string[] | null;
    };
    const initialProduct: Product = {
        modal_num: "",
        brand: {
            id: null,
            name: "",
            description: "",
        },
        origin: "",
        crystal_material: "",
        movement_type: "",
        dial_diameter: null,
        case_thickness: null,
        strap_material: "",
        water_resistance: "",
        category: {
            id: null,
            name: "",
            description: "",
        },
        quantity: null,
        price: null,
        image: null,
        state: true,
        functions: null,
    };

    const [productData, setProductData] = useState<Product>(initialProduct);
    const [brandData, setBrandData] = useState([]);
    const [categoryDara, setCategoryData] = useState([]);
    const [functionData, setFunctionData] = useState([]);
    const [prdFunctionData, setPrdFunctionData] = useState([]);
    const [isEnabled, setIsEnabled] = useState(true);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Sản phẩm", path: "/products" },
        { label: "Cập nhật" }, // Không có path => là trang hiện tại
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
        setProductData({
            ...productData,
            brand: {
                ...productData.brand,
                id: parseInt(value),
            },
        });
    };

    const handleCategoryChange = (value: string) => {
        setProductData({
            ...productData,
            category: {
                ...productData.category,
                id: parseInt(value),
            },
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
    const isValidNumber = (value: any) => {
        return !isNaN(value) && Number(value) > 0;
    };

    const handleUpdateProduct = async () => {
        if (
            !productData.functions ||
            !productData.modal_num ||
            !productData.brand.id ||
            !productData.category.id ||
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

        if (!isValidNumber(productData.price)) {
            toast.error("Giá phải là số dương hợp lệ!");
            return;
        }

        if (!isValidNumber(productData.quantity)) {
            toast.error("Số lượng phải là số dương hợp lệ!");
            return;
        }

        if (!isValidNumber(productData.dial_diameter)) {
            toast.error("Đường kính mặt số phải là số dương hợp lệ!");
            return;
        }

        if (!isValidNumber(productData.case_thickness)) {
            toast.error("Độ dày thân phải là số dương hợp lệ!");
            return;
        }

        // const file = productData.image;

        // if (!(file instanceof File) || !file.type.startsWith("image/")) {
        //     toast.error("File phải là hình ảnh!");
        //     return;
        // }
        if (productData.functions.length === 0) {
            toast.error("Vui lòng chọn ít nhất một chức năng!");
            return;
        }
        try {
            const modal_num = productData.modal_num;
            const { data } = await axios.get("/products/check", {
                params: {
                    modal_num,
                    id,
                },
            });

            if (data.modalNumExists) {
                toast.error("Số hiệu sản phẩm đã được sử dụng!");
                return;
            }

            const formData = new FormData();
            if (productData.image instanceof File) {
                formData.append("file", productData.image);
            }

            formData.append("modal_num", productData.modal_num);
            formData.append("brand_id", String(productData.brand.id));
            formData.append("origin", productData.origin);
            formData.append("crystal_material", productData.crystal_material);
            formData.append("movement_type", productData.movement_type);
            formData.append("dial_diameter", String(productData.dial_diameter));
            formData.append(
                "case_thickness",
                String(productData.case_thickness)
            );
            formData.append("strap_material", productData.strap_material);
            formData.append("water_resistance", productData.water_resistance);
            formData.append("category_id", String(productData.category.id));
            formData.append("quantity", String(productData.quantity));
            formData.append("price", String(productData.price));
            formData.append("state", String(productData.state));
            productData.functions.forEach((func) => {
                formData.append("functions[]", func);
            });

            await axios.put(`/products/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Cập nhật thành công!");
            navigate("/products");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            toast.error("Cập nhật thất bại.");
        }
    };

    const getBrands = async () => {
        await axios
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

    const getDataById = () => {
        if (!id) return;
        axios
            .get(`/products/${id}`)
            .then((response) => {
                const data = response.data;
                setProductData(data);
                console.log(data);
                setIsEnabled(data.state);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };

    const getCategories = async () => {
        await axios
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

    const getFunctions = async () => {
        await axios
            .get("/functions")
            .then((response) => {
                const data = response.data.data;
                const fcns = data.map((f: any) => ({
                    id: f.id.toString(),
                    name: f.name,
                }));
                setFunctionData(fcns);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };

    const getProductFunction = async () => {
        await axios
            .get(`/product_function/${id}`)
            .then((response) => {
                console.log(response);
                const data = response.data;
                setPrdFunctionData(data);
                // setProductData({
                //     ...productData,
                //     functions: data,
                // });
                const functionIds = data.map((f: any) => f.toString());
                setProductData((prev) => ({
                    ...prev,
                    functions: functionIds,
                }));
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {});
    };

    useEffect(() => {
        getDataById();
        getBrands();
        getCategories();
        getFunctions();
        getProductFunction();
    }, [id]);

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
                            value={productData.modal_num}
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
                            value={productData.origin}
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
                            value={productData.brand.id?.toString()}
                            placeholder="Chọn nhà cung cấp"
                            onChange={handleBrandChange}
                            className="dark:bg-dark-900"
                        />
                    </div>
                    <div>
                        <Label>Loại sản phẩm:</Label>
                        <Select
                            options={categoryDara}
                            value={productData.category.id?.toString()}
                            placeholder="Chọn loại sản phẩm"
                            onChange={handleCategoryChange}
                            className="dark:bg-dark-900"
                        />
                    </div>
                    <div>
                        <Label htmlFor="quantity">Số lượng:</Label>
                        <Input
                            type="number"
                            id="quantity"
                            value={productData.quantity?.toString()}
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
                            type="number"
                            id="price"
                            value={productData.price?.toString()}
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
                    {productData.image &&
                        typeof productData.image === "string" && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-1">
                                    Ảnh hiện tại:
                                </p>
                                <img
                                    src={`${BASE_URL}${productData.image}`}
                                    alt="Ảnh banner hiện tại"
                                    className="w-64 rounded border"
                                />
                            </div>
                        )}
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
                            value={productData.crystal_material}
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
                            value={productData.movement_type}
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
                            type="number"
                            id="dial"
                            // step="0.01"
                            value={productData.dial_diameter ?? ""}
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
                            type="number"
                            id="case"
                            // step="0.01"
                            value={productData.case_thickness ?? ""}
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
                            value={productData.strap_material}
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
                            type="number"
                            id="water"
                            value={productData.water_resistance}
                            onChange={(e) =>
                                setProductData({
                                    ...productData,
                                    water_resistance: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="functions">Chức năng:</Label>
                        <MultiSelect
                            options={functionData}
                            defaultSelected={prdFunctionData}
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
                    onClick={handleUpdateProduct}
                >
                    Lưu
                </Button>
            </div>
        </>
    );
}
