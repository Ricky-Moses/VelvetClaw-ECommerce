import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { fetchProductDetails } from "../../Redux/Slice/ProductSlice";
import { updateProducts } from "../../Redux/Slice/adminProductSlice";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProducts, loading, error } = useSelector(
    (state) => state.products
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      countInStock: 0,
      category: "",
      brand: "",
      sizes: "",
      colors: "",
      collections: "",
      material: "",
      gender: "",
      sku: "",
      images: [],
      isFeatured: false,
      isPublished: true,
      tags: "",
      dimension: "",
      weight: "",
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProducts) {
      setImages(
        selectedProducts.images?.map((img) => ({
          url: img.url,
          altText: img.altText || "Product Image",
          isCloudinary: true, // Mark existing images as Cloudinary
        })) || []
      );
      setValue("name", selectedProducts.name || "");
      setValue("description", selectedProducts.description || "");
      setValue("gender", selectedProducts.gender || "");
      setValue("price", selectedProducts.price || "");
      setValue("countInStock", selectedProducts.countInStock || 0);
      setValue("sku", selectedProducts.sku || "");
      setValue("sizes", selectedProducts.sizes?.join(", ") || "");
      setValue("colors", selectedProducts.colors?.join(", ") || "");
      setValue("dimension", selectedProducts.dimension || "");
      setValue("collections", selectedProducts.collections || "");
      setValue("brand", selectedProducts.brand || "");
      setValue("material", selectedProducts.material || "");
      setValue("tags", selectedProducts.tags?.join(", ") || "");
      setValue("weight", selectedProducts.weight || "");
      setValue("isFeatured", selectedProducts.isFeatured || false);
      setValue(
        "isPublished",
        selectedProducts.isPublished !== undefined
          ? selectedProducts.isPublished
          : true
      );
    }
  }, [selectedProducts, setValue]);

  useEffect(() => {
    register("images", {
      validate: () => images.length > 0 || "Upload at least one image",
    });
  }, [register, images]);

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file), // For local preview only
      altText: file.name,
      file, // Store file for upload
      isCloudinary: false, // Mark as local until uploaded
    }));
    setImages((prev) => [...prev, ...newImages]);
    setValue("image", files, { shouldValidate: true });
  };

  const uploadImagesToCloudinary = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("image", file));
    try {
      const { data } = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.images;
    } catch (err) {
      throw new Error(`Image upload failed: ${err.message}`);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let updatedImages = images
        .filter((img) => img.isCloudinary) // Keep existing Cloudinary images
        .map((img) => ({
          url: img.url,
          altText: img.altText,
        }));

      // Upload new images to Cloudinary
      const newFiles = images
        .filter((img) => !img.isCloudinary && img.file)
        .map((img) => img.file);
      if (newFiles.length > 0) {
        const uploadedImages = await uploadImagesToCloudinary(newFiles);
        updatedImages = [...updatedImages, ...uploadedImages];
      }

      if (updatedImages.length === 0) {
        throw new Error("At least one image is required");
      }

      const formattedData = {
        ...data,
        sizes: data.sizes
          .split(",")
          .map((item) => item.trim().toUpperCase())
          .filter((item) => item),
        colors: data.colors
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
        tags: data.tags
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
        images: updatedImages,
        dimension: data.dimension || "",
        weight: data.weight || "",
        isFeatured: data.isFeatured || false,
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
      };

      await dispatch(
        updateProducts({ id, productData: formattedData })
      ).unwrap();
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      toast.error("Failed to update product: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <span className="loading"></span>
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="max-w-5xl shadow-md rounded-md mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        {/* Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            {...register("name", { required: "Product name is required" })}
            placeholder="Product Name"
            className="input w-full bg-neutral-200 focus:outline-main-theme"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            {...register("description", {
              required: "Enter the description of product",
            })}
            placeholder="Description"
            className="input w-full min-h-[5rem] max-h-[8rem] bg-neutral-200 focus:outline-main-theme whitespace-pre-wrap break-words overflow-auto"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>
        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            {...register("price", {
              required: "Enter price",
              valueAsNumber: true,
            })}
            placeholder="Enter the price"
            className="input w-full bg-neutral-200 focus:outline-main-theme"
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>
        {/* Original Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Original Price</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            {...register("originalPrice", {
              required: "Enter original price",
              valueAsNumber: true,
            })}
            placeholder="Enter the original price"
            className="input w-full bg-neutral-200 focus:outline-main-theme"
          />
          {errors.originalPrice && (
            <p className="text-red-500">{errors.originalPrice.message}</p>
          )}
        </div>
        {/* Count In Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Stock Count</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            {...register("countInStock", {
              required: "Enter stock count",
              valueAsNumber: true,
            })}
            placeholder="Enter stock quantity"
            className="input w-full bg-neutral-200 focus:outline-main-theme"
          />
          {errors.countInStock && (
            <p className="text-red-500">{errors.countInStock.message}</p>
          )}
        </div>
        {/* Category */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Category</label>
          <select
            {...register("category", {
              required: "Please select the category",
              validate: (value) =>
                value !== "" || "Please select a valid category",
            })}
            className="select w-full bg-neutral-200 focus:outline-main-theme"
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Top Wear">Top Wear</option>
            <option value="Bottom Wear">Bottom Wear</option>
          </select>
          {errors.category && (
            <p className="text-red-500">{errors.category.message}</p>
          )}
        </div>
        {/* Brand Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Brand Name</label>
          <input
            type="text"
            {...register("brand")}
            placeholder="Brand Name"
            className="input w-full bg-neutral-200 focus:outline-main-theme"
          />
          {errors.brand && (
            <p className="text-red-500">{errors.brand.message}</p>
          )}
        </div>
        {/* Sizes */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Sizes (Comma Separated)
          </label>
          <input
            type="text"
            {...register("sizes", {
              required: "Enter sizes",
              validate: (value) =>
                value.split(",").some((item) => item.trim()) ||
                "At least one size is required",
            })}
            placeholder="e.g. S, M, L"
            className="input w-full bg-neutral-200 focus:outline-main-theme uppercase"
          />
          {errors.sizes && (
            <p className="text-red-500">{errors.sizes.message}</p>
          )}
        </div>
        {/* Colors */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Colors (Comma Separated)
          </label>
          <input
            type="text"
            {...register("colors", {
              required: "Enter colors",
              validate: (value) =>
                value.split(",").some((item) => item.trim()) ||
                "At least one color is required",
            })}
            placeholder="e.g. Red, Blue"
            className="input w-full bg-neutral-200 focus:outline-main-theme"
          />
          {errors.colors && (
            <p className="text-red-500">{errors.colors.message}</p>
          )}
        </div>
        {/* Collection */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Collection</label>
          <input
            type="text"
            {...register("collections", {
              required: "Please enter a collection",
            })}
            placeholder="Product Collections"
            className="input w-full bg-neutral-200 focus:outline-main-theme"
          />
          {errors.collections && (
            <p className="text-red-500">{errors.collections.message}</p>
          )}
        </div>
        {/* Material */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Material</label>
          <input
            type="text"
            {...register("material")}
            placeholder="Product Material"
            className="input w-full bg-neutral-200 focus:outline-main-theme"
          />
          {errors.material && (
            <p className="text-red-500">{errors.material.message}</p>
          )}
        </div>
        {/* Gender */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Gender</label>
          <select
            {...register("gender", {
              required: "Please select the gender",
              validate: (value) => value !== "" || "Please select a gender",
            })}
            className="select w-full bg-neutral-200 focus:outline-main-theme"
          >
            <option value="" disabled>
              Select a gender
            </option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
          {errors.gender && (
            <p className="text-red-500">{errors.gender.message}</p>
          )}
        </div>
        {/* SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            {...register("sku", { required: "Enter SKU" })}
            placeholder="Enter the SKU"
            className="input w-full bg-neutral-200 focus:outline-main-theme"
          />
          {errors.sku && <p className="text-red-500">{errors.sku.message}</p>}
        </div>
        {/* Tags */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Tags (Comma Separated)
          </label>
          <input
            type="text"
            {...register("tags")}
            placeholder="e.g. casual, trendy"
            className="input w-full bg-neutral-200 focus:outline-main-theme"
          />
          {errors.tags && <p className="text-red-500">{errors.tags.message}</p>}
        </div>
        {/* Dimension */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Dimension</label>
          <input
            type="text"
            {...register("dimension", {
              validate: (value) =>
                !value ||
                /^[\d.]+x[\d.]+x[\d.]+$/.test(value) ||
                "Invalid format. Use LxWxH (e.g., 10x20x30)",
            })}
            placeholder="e.g. 10x20x30 cm"
            className="input w-full bg-neutral-200 focus:outline-main-theme"
          />
          {errors.dimension && (
            <p className="text-red-500">{errors.dimension.message}</p>
          )}
        </div>
        {/* Weight */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Weight</label>
          <input
            type="text"
            {...register("weight")}
            placeholder="e.g. 500g"
            className="input w-full bg-neutral-200 focus:outline-main-theme"
          />
          {errors.weight && (
            <p className="text-red-500">{errors.weight.message}</p>
          )}
        </div>
        {/* Is Featured */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Is Featured</label>
          <input
            type="checkbox"
            {...register("isFeatured")}
            className="checkbox bg-neutral-200 focus:outline-main-theme"
          />
          {errors.isFeatured && (
            <p className="text-red-500">{errors.isFeatured.message}</p>
          )}
        </div>
        {/* Is Published */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Is Published</label>
          <input
            type="checkbox"
            {...register("isPublished")}
            defaultChecked
            className="checkbox bg-neutral-200 focus:outline-main-theme !text-main-theme"
          />
          {errors.isPublished && (
            <p className="text-red-500">{errors.isPublished.message}</p>
          )}
        </div>
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="file-input file-input-error w-full bg-neutral-200 focus:outline-main-theme cursor-pointer mb-2"
          />
          {errors.images && (
            <p className="text-red-500">{errors.images.message}</p>
          )}
          {images.length > 0 && (
            <div className="flex items-center gap-4 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    className="w-20 h-20 object-center rounded"
                    src={img.url}
                    alt={img.altText || "Product Image"}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className={`btn btn-wide btn-soft btn-success ${isSubmitting ? 'disabled:cursor-not-allowed' : ''}`}
            
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="btn btn-wide btn-soft btn-error"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;

