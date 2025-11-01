import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
// import { useSelector } from "react-redux";
// import uploadImage from "../utils/UploadImage";
// import Loading from "../components/Loading";
// import ViewImage from "../components/ViewImage";
// import AddFieldComponent from "../components/AddFieldComponent";
// import Axios from "../utils/Axios";
// import SummaryApi from "../common/SummaryApi";
// import AxiosToastError from "../utils/AxiosToastError";
// import successAlert from "../utils/SuccessAlert";

// ✅ Types for Category and SubCategory
interface Category {
  _id: string;
  name: string;
  [key: string]: any;
}

// ✅ Product Interface
interface Product {
  _id?: string;
  name?: string;
  images?: string[];
  unit?: string;
  stock?: number | string;
  price?: number | string;
  discount?: number | string;
  description?: string;
  more_details?: Record<string, string>;
}

// ✅ Props Interface
interface EditProductAdminProps {
  close: () => void;
  data: Product;
  fetchProductData?: () => void;
}

// ✅ RootState Type (Redux)
interface RootState {
  product: {
    allCategory: Category[];
    allSubCategory: Category[];
  };
}

const EditProductAdmin: React.FC<EditProductAdminProps> = ({
  close,
  data: propsData,
  fetchProductData,
}) => {
  const [data, setData] = useState<Product>({
    _id: propsData._id,
    name: propsData.name,
    images: propsData.images,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  });

  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [viewImageURL, setViewImageURL] = useState<string>("");
  const [selectCategory, setSelectCategory] = useState<string>("");
  const [selectSubCategory, setSelectSubCategory] = useState<string>("");
  const [openAddField, setOpenAddField] = useState<boolean>(false);
  const [fieldName, setFieldName] = useState<string>("");

  // Redux selectors
//   const allCategory = useSelector(
//     (state: RootState) => state.product.allCategory
//   );
//   const allSubCategory = useSelector(
//     (state: RootState) => state.product.allSubCategory
//   );

  /** Handle Text and Number Input Changes */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  /** Handle Image Upload */
  const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageLoading(true);
    try {
      const response: any = {};
      const { data: imageResponse } = response;
      const imageUrl = imageResponse.data.url;

    //   setData((prev) => ({
    //     ...prev,
    //     image: [...prev.images, ''],
    //   }));
    } catch (error) {
    //   AxiosToastError(error);
    } finally {
      setImageLoading(false);
    }
  };

  /** Delete Image by Index */
  const handleDeleteImage = (index: number) => {
    // const newImages = [...data.images];
    // newImages.splice(index, 1);
    // setData((prev) => ({ ...prev, image: newImages }));
  };

  /** Remove Category or SubCategory */
  const handleRemoveCategory = (index: number) => {
    // const newCategory = [...data.category];
    // newCategory.splice(index, 1);
    // setData((prev) => ({ ...prev, category: newCategory }));
  };

  const handleRemoveSubCategory = (index: number) => {
    // const newSubCategory = [...data.subCategory];
    // newSubCategory.splice(index, 1);
    // setData((prev) => ({ ...prev, subCategory: newSubCategory }));
  };

  /** Add Dynamic Field */
  const handleAddField = () => {
    if (!fieldName.trim()) return;
    setData((prev) => ({
      ...prev,
      more_details: { ...prev.more_details, [fieldName]: "" },
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  /** Submit Updated Product */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // try {
    //   const response = await Axios({
    //     ...SummaryApi.updateProductDetails,
    //     data,
    //   });

    //   const { data: responseData } = response;

    //   if (responseData.success) {
    //     successAlert(responseData.message);
    //     close();
    //     fetchProductData();

    //     // Reset form
    //     setData({
    //       _id: "",
    //       name: "",
    //       image: [],
    //       category: [],
    //       subCategory: [],
    //       unit: "",
    //       stock: "",
    //       price: "",
    //       discount: "",
    //       description: "",
    //       more_details: {},
    //     });
    //   }
    // } catch (error) {
    //   AxiosToastError(error);
    // }
  };

  return (
    <section className="fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70 p-4">
      <div className="bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]">
        <div className="p-2 bg-white shadow-md flex items-center justify-between">
          <h2 className="font-semibold">Edit Product</h2>
          <button onClick={close}>
            <IoClose size={20} />
          </button>
        </div>

        <div className="grid p-3">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="grid gap-1">
              <label htmlFor="name" className="font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              />
            </div>

            {/* Description */}
            <div className="grid gap-1">
              <label htmlFor="description" className="font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={data.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter product description"
                required
                className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200 resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <p className="font-medium">Image</p>
              <label
                htmlFor="productImage"
                className="bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer"
              >
                <div className="text-center flex flex-col justify-center items-center">
                  {imageLoading ? (
                    <p>Loading</p>
                  ) : (
                    <>
                      <FaCloudUploadAlt size={35} />
                      <p>Upload Image</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id="productImage"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadImage}
                />
              </label>

              {/* Display Uploaded Images */}
              <div className="flex flex-wrap gap-4 mt-2">
                {data.images && data.images.map((img, index) => (
                  <div
                    key={img + index}
                    className="h-20 w-20 bg-blue-50 border relative group"
                  >
                    <img
                      src={img}
                      alt={img}
                      className="w-full h-full object-scale-down cursor-pointer"
                      onClick={() => setViewImageURL(img)}
                    />
                    <div
                      onClick={() => handleDeleteImage(index)}
                      className="absolute bottom-0 right-0 p-1 bg-red-600 text-white rounded hidden group-hover:block cursor-pointer"
                    >
                      <MdDelete />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category */}
            {/* <div className="grid gap-1">
              <label className="font-medium">Category</label>
              <select
                className="bg-blue-50 border w-full p-2 rounded"
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const category = allCategory.find((el) => el._id === value);
                  if (category) {
                    setData((prev) => ({
                      ...prev,
                      category: [...prev.category, category],
                    }));
                    setSelectCategory("");
                  }
                }}
              >
                <option value="">Select Category</option>
                {allCategory.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-3 mt-2">
                {data.category.map((c, index) => (
                  <div
                    key={c._id + index}
                    className="text-sm flex items-center gap-1 bg-blue-50 p-1 rounded"
                  >
                    <p>{c.name}</p>
                    <IoClose
                      size={20}
                      className="hover:text-red-500 cursor-pointer"
                      onClick={() => handleRemoveCategory(index)}
                    />
                  </div>
                ))}
              </div>
            </div> */}

            {/* SubCategory */}
            {/* <div className="grid gap-1">
              <label className="font-medium">Sub Category</label>
              <select
                className="bg-blue-50 border w-full p-2 rounded"
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const subCategory = allSubCategory.find(
                    (el) => el._id === value
                  );
                  if (subCategory) {
                    setData((prev) => ({
                      ...prev,
                      subCategory: [...prev.subCategory, subCategory],
                    }));
                    setSelectSubCategory("");
                  }
                }}
              >
                <option value="">Select Sub Category</option>
                {allSubCategory.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-3 mt-2">
                {data.subCategory.map((c, index) => (
                  <div
                    key={c._id + index}
                    className="text-sm flex items-center gap-1 bg-blue-50 p-1 rounded"
                  >
                    <p>{c.name}</p>
                    <IoClose
                      size={20}
                      className="hover:text-red-500 cursor-pointer"
                      onClick={() => handleRemoveSubCategory(index)}
                    />
                  </div>
                ))}
              </div>
            </div> */}

            {/* Unit, Stock, Price, Discount */}
            {["unit", "stock", "price", "discount"].map((field) => (
              <div key={field} className="grid gap-1">
                <label htmlFor={field} className="font-medium capitalize">
                  {field}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === "unit" ? "text" : "number"}
                  value={data[field as keyof Product] as string | number}
                  onChange={handleChange}
                  required
                  placeholder={`Enter product ${field}`}
                  className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
                />
              </div>
            ))}

            {/* Dynamic Fields */}
            {data.more_details && Object.keys(data.more_details).map((key) => (
              <div key={key} className="grid gap-1">
                <label htmlFor={key} className="font-medium capitalize">
                  {key}
                </label>
                <input
                  id={key}
                  type="text"
                  value={data?.more_details?.[key]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setData((prev) => ({
                      ...prev,
                      more_details: { ...prev.more_details, [key]: value },
                    }));
                  }}
                  required
                  className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
                />
              </div>
            ))}

            <div
              onClick={() => setOpenAddField(true)}
              className="hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded"
            >
              Add Fields
            </div>

            <button
              type="submit"
              className="bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold"
            >
              Update Product
            </button>
          </form>
        </div>

        {/* View Image Modal */}
        {/* {viewImageURL && (
          <ViewImage url={viewImageURL} close={() => setViewImageURL("")} />
        )} */}

        {/* Add Field Modal */}
        {/* {openAddField && (
          <AddFieldComponent
            value={fieldName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFieldName(e.target.value)
            }
            submit={handleAddField}
            close={() => setOpenAddField(false)}
          />
        )} */}
      </div>
    </section>
  );
};

export default EditProductAdmin;
