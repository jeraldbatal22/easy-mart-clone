"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Save, X, Star, TrendingUp, CheckCircle, Eye } from "lucide-react";
import { productSchema, createProductSchema, type ProductFormData } from "@/lib/validations/admin";

interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
  groceryCategory: string;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  image: string;
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  stockLabel: string;
  groceryCategory: string;
  subGroceryCategory?: string;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isVerified?: boolean;
  featured?: boolean;
  discount?: {
    percentage?: number;
    type?: "percentage" | "fixed";
    value?: number;
  };
  tags?: string[];
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Form states
  const [formLoading, setFormLoading] = useState(false);
  
  // React Hook Form setup
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      unit: "",
      stock: 0,
      stockLabel: "",
      groceryCategory: "",
      subGroceryCategory: "",
      isBestSeller: false,
      isTrending: false,
      isVerified: false,
      featured: false,
      discountType: "percentage",
      discountPercentage: 0,
      discountValue: 0,
      tags: "",
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      imageFile: null,
      imageUrl: "",
    },
  });
  console.log(form.getValues())
  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category/grocery?limit=100");
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch subcategories based on selected category
  const fetchSubCategories = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/category/subcategory?categoryId=${categoryId}&limit=100`);
      const data = await response.json();
      
      if (data.success) {
        setSubcategories(data.data.subcategories);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Fetch products
  const fetchProducts = async (page = 1, search = "", categoryId = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { q: search }),
        ...(categoryId && { groceryCategoryId: categoryId }),
      });
      
      const response = await fetch(`/api/product?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      } else {
        toast.error(data.error || "Failed to fetch products");
      }
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchProducts(1, query, selectedCategory);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSubcategories([]);
    if (categoryId) {
      fetchSubCategories(categoryId);
    }
    fetchProducts(1, searchQuery, categoryId);
  };

  const handlePageChange = (page: number) => {
    fetchProducts(page, searchQuery, selectedCategory);
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit }));
    fetchProducts(1, searchQuery, selectedCategory);
  };

  const resetForm = () => {
    form.reset({
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      unit: "",
      stock: 0,
      stockLabel: "",
      groceryCategory: "",
      subGroceryCategory: "",
      isBestSeller: false,
      isTrending: false,
      isVerified: false,
      featured: false,
      discountType: "percentage",
      discountPercentage: 0,
      discountValue: 0,
      tags: "",
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      imageFile: null,
      imageUrl: "",
    });
    setEditingProduct(null);
    setSubcategories([]);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description || "",
      price: product.price,
      originalPrice: product.originalPrice,
      unit: product.unit,
      stock: product.stock,
      stockLabel: product.stockLabel,
      groceryCategory: product.groceryCategory,
      subGroceryCategory: product.subGroceryCategory || "",
      isBestSeller: product.isBestSeller || false,
      isTrending: product.isTrending || false,
      isVerified: product.isVerified || false,
      featured: product.featured || false,
      discountPercentage: product.discount?.percentage,
      discountType: product.discount?.type || "percentage",
      discountValue: product.discount?.value,
      tags: product.tags?.join(", ") || "",
      weight: product.weight,
      length: product.dimensions?.length,
      width: product.dimensions?.width,
      height: product.dimensions?.height,
      calories: product.nutritionalInfo?.calories,
      protein: product.nutritionalInfo?.protein,
      carbs: product.nutritionalInfo?.carbs,
      fat: product.nutritionalInfo?.fat,
      fiber: product.nutritionalInfo?.fiber,
      imageFile: undefined,
      imageUrl: product.image,
    });
    
    // Fetch subcategories for the selected category
    if (product.groceryCategory) {
      fetchSubCategories(product.groceryCategory);
    }
    
    setIsModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleCategoryChange = (categoryId: string) => {
    form.setValue("groceryCategory", categoryId);
    form.setValue("subGroceryCategory", "");
    setSubcategories([]);
    if (categoryId) {
      fetchSubCategories(categoryId);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setFormLoading(true);
      
      // Validate with appropriate schema based on whether we're editing
      const validationSchema = editingProduct ? productSchema : createProductSchema;
      const validationResult = validationSchema.safeParse(data);
      
      if (!validationResult.success) {
        validationResult.error.issues.forEach((error: any) => {
          form.setError(error.path[0] as keyof ProductFormData, {
            message: error.message,
          });
        });
        return;
      }
      
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.name.trim());
      formDataToSend.append("description", data.description?.trim() || "");
      formDataToSend.append("price", data.price.toString());
      if (data.originalPrice) formDataToSend.append("originalPrice", data.originalPrice.toString());
      formDataToSend.append("unit", data.unit.trim());
      formDataToSend.append("stock", data.stock.toString());
      if (data.stockLabel) formDataToSend.append("stockLabel", data.stockLabel);
      formDataToSend.append("groceryCategory", data.groceryCategory);
      formDataToSend.append("subGroceryCategory", data.subGroceryCategory);
      formDataToSend.append("isBestSeller", data.isBestSeller.toString());
      formDataToSend.append("isTrending", data.isTrending.toString());
      formDataToSend.append("isVerified", data.isVerified.toString());
      formDataToSend.append("featured", data.featured.toString());
      
      // Handle discount
      if (data.discountPercentage || data.discountValue) {
        const discount = {
          type: data.discountType,
          ...(data.discountPercentage && { percentage: data.discountPercentage }),
          ...(data.discountValue && { value: data.discountValue }),
        };
        formDataToSend.append("discount", JSON.stringify(discount));
      }
      
      // Handle tags
      if (data.tags) {
        const tagsArray = data.tags.split(",").map(tag => tag.trim()).filter(Boolean);
        formDataToSend.append("tags", JSON.stringify(tagsArray));
      }
      
      // Handle weight
      if (data.weight) {
        formDataToSend.append("weight", data.weight.toString());
      }
      
      // Handle dimensions
      if (data.length || data.width || data.height) {
        const dimensions = {
          ...(data.length && { length: data.length }),
          ...(data.width && { width: data.width }),
          ...(data.height && { height: data.height }),
        };
        formDataToSend.append("dimensions", JSON.stringify(dimensions));
      }
      
      // Handle nutritional info
      if (data.calories || data.protein || data.carbs || data.fat || data.fiber) {
        const nutritionalInfo = {
          ...(data.calories && { calories: data.calories }),
          ...(data.protein && { protein: data.protein }),
          ...(data.carbs && { carbs: data.carbs }),
          ...(data.fat && { fat: data.fat }),
          ...(data.fiber && { fiber: data.fiber }),
        };
        formDataToSend.append("nutritionalInfo", JSON.stringify(nutritionalInfo));
      }
      
      if (editingProduct) {
        formDataToSend.append("id", editingProduct._id);
        if (data.imageFile) {
          formDataToSend.append("file", data.imageFile);
        } else if (data.imageUrl) {
          formDataToSend.append("imageUrl", data.imageUrl);
        }
        
        const response = await fetch("/api/product", {
          method: "PUT",
          body: formDataToSend,
        });
        
        const responseData = await response.json();
        
        if (responseData.success) {
          toast.success("Product updated successfully");
          setIsModalOpen(false);
          resetForm();
          fetchProducts(pagination.page, searchQuery, selectedCategory);
        } else {
          toast.error(responseData.error || "Failed to update product");
        }
      } else {
        if (!data.imageFile && !data.imageUrl) {
          toast.error("Product image is required");
          return;
        }
        
        if (data.imageFile) {
          formDataToSend.append("file", data.imageFile);
        } else if (data.imageUrl) {
          formDataToSend.append("imageUrl", data.imageUrl);
        }
        
        const response = await fetch("/api/product", {
          method: "POST",
          body: formDataToSend,
        });
        
        const responseData = await response.json();
        
        if (responseData.success) {
          toast.success("Product created successfully");
          setIsModalOpen(false);
          resetForm();
          fetchProducts(pagination.page, searchQuery, selectedCategory);
        } else {
          toast.error(responseData.error || "Failed to create product");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error submitting form:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setFormLoading(true);
      
      const response = await fetch(`/api/product?id=${productToDelete._id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Product deleted successfully");
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
        fetchProducts(pagination.page, searchQuery, selectedCategory);
      } else {
        toast.error(data.error || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error deleting product:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category?.name || "Unknown Category";
  };


  const columns = [
    {
      key: "image",
      label: "Image",
      render: (value: string) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          {value ? (
            <Image
              src={value}
              alt="Product"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              📦
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (value: string, item: Product) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.unit}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "price",
      label: "Price",
      render: (value: number, item: Product) => (
        <div>
          <div className="font-medium">${value.toFixed(2)}</div>
          {item.originalPrice && item.originalPrice > value && (
            <div className="text-sm text-gray-500 line-through">
              ${item.originalPrice.toFixed(2)}
            </div>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      key: "stock",
      label: "Stock",
      render: (value: number, item: Product) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{item.stockLabel}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "groceryCategory",
      label: "Category",
      render: (value: string) => getCategoryName(value),
      sortable: true,
    },
    {
      key: "badges",
      label: "Badges",
      render: (value: any, item: Product) => (
        <div className="flex flex-wrap gap-1">
          {item.isBestSeller && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Star className="h-3 w-3 mr-1" />
              Best Seller
            </span>
          )}
          {item.isTrending && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </span>
          )}
          {item.isVerified && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </span>
          )}
          {item.featured && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Eye className="h-3 w-3 mr-1" />
              Featured
            </span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value: string) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
  ];

  return (
    <div className="p-6">
      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Label htmlFor="category-filter">Filter by Category:</Label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 min-w-[200px]"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        data={products}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        onSearch={handleSearch}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        title="Products Management"
        addButtonText="Add Product"
        emptyMessage="No products found"
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        size="xl"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Enter product name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Enter product description"
                  className="w-full border border-gray-300 rounded px-3 py-2 min-h-[80px]"
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...form.register("price", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.price.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    {...form.register("originalPrice", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {form.formState.errors.originalPrice && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.originalPrice.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <Input
                    id="unit"
                    {...form.register("unit")}
                    placeholder="e.g., kg, lb, each"
                  />
                  {form.formState.errors.unit && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.unit.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    {...form.register("stock", { valueAsNumber: true })}
                    placeholder="0"
                  />
                  {form.formState.errors.stock && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.stock.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="stockLabel">Stock Label</Label>
                <Input
                  id="stockLabel"
                  {...form.register("stockLabel")}
                  placeholder="e.g., In Stock, 5 Left"
                />
                {form.formState.errors.stockLabel && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.stockLabel.message}</p>
                )}
              </div>
            </div>

            {/* Categories and Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Categories & Image</h3>
              
              <div>
                <Label htmlFor="groceryCategory">Category *</Label>
                <select
                  id="groceryCategory"
                  {...form.register("groceryCategory")}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {form.formState.errors.groceryCategory && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.groceryCategory.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="subGroceryCategory">Subcategory *</Label>
                <select
                  id="subGroceryCategory"
                  {...form.register("subGroceryCategory")}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!form.watch("groceryCategory")}
                >
                  <option value="">Select a subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
                {form.formState.errors.subGroceryCategory && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.subGroceryCategory.message}</p>
                )}
              </div>

              <div>
                <Label>Product Image *</Label>
                <ImageUpload
                  value={form.watch("imageUrl") || ""}
                  onChange={(file, url) => {
                    form.setValue("imageFile", file || undefined);
                    form.setValue("imageUrl", url || "");
                  }}
                  placeholder="Upload product image"
                />
                {form.formState.errors.imageFile && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.imageFile.message}</p>
                )}
                {editingProduct && !form.watch("imageFile") && (
                  <p className="text-sm text-gray-500 mt-1">
                    Leave empty to keep current image
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isBestSeller"
                  checked={form.watch("isBestSeller")}
                  onCheckedChange={(checked) => form.setValue("isBestSeller", !!checked)}
                />
                <Label htmlFor="isBestSeller">Best Seller</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isTrending"
                  checked={form.watch("isTrending")}
                  onCheckedChange={(checked) => form.setValue("isTrending", !!checked)}
                />
                <Label htmlFor="isTrending">Trending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVerified"
                  checked={form.watch("isVerified")}
                  onCheckedChange={(checked) => form.setValue("isVerified", !!checked)}
                />
                <Label htmlFor="isVerified">Verified</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={form.watch("featured")}
                  onCheckedChange={(checked) => form.setValue("featured", !!checked)}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>
          </div>

          {/* Discount */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Discount</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="discountType">Discount Type</Label>
                <select
                  id="discountType"
                  {...form.register("discountType")}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <Label htmlFor="discountPercentage">Discount {form.watch("discountType") === "percentage" ? "Percentage" : "Value"}</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  step="0.01"
                  {...form.register(form.watch("discountType") === "percentage" ? "discountPercentage" : "discountValue", { valueAsNumber: true })}
                  placeholder={form.watch("discountType") === "percentage" ? "10" : "5.00"}
                />
                {(form.formState.errors.discountPercentage || form.formState.errors.discountValue) && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.discountPercentage?.message || form.formState.errors.discountValue?.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  {...form.register("tags")}
                  placeholder="organic, fresh, local"
                />
                {form.formState.errors.tags && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.tags.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  {...form.register("weight", { valueAsNumber: true })}
                  placeholder="1.5"
                />
                {form.formState.errors.weight && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.weight.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dimensions (cm)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="length">Length</Label>
                <Input
                  id="length"
                  type="number"
                  step="0.01"
                  {...form.register("length", { valueAsNumber: true })}
                  placeholder="10"
                />
                {form.formState.errors.length && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.length.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.01"
                  {...form.register("width", { valueAsNumber: true })}
                  placeholder="5"
                />
                {form.formState.errors.width && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.width.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  {...form.register("height", { valueAsNumber: true })}
                  placeholder="3"
                />
                {form.formState.errors.height && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.height.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Nutritional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Nutritional Information (per 100g)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  step="0.01"
                  {...form.register("calories", { valueAsNumber: true })}
                  placeholder="100"
                />
                {form.formState.errors.calories && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.calories.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  step="0.01"
                  {...form.register("protein", { valueAsNumber: true })}
                  placeholder="5"
                />
                {form.formState.errors.protein && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.protein.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  step="0.01"
                  {...form.register("carbs", { valueAsNumber: true })}
                  placeholder="20"
                />
                {form.formState.errors.carbs && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.carbs.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  step="0.01"
                  {...form.register("fat", { valueAsNumber: true })}
                  placeholder="2"
                />
                {form.formState.errors.fat && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.fat.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="fiber">Fiber (g)</Label>
                <Input
                  id="fiber"
                  type="number"
                  step="0.01"
                  {...form.register("fiber", { valueAsNumber: true })}
                  placeholder="3"
                />
                {form.formState.errors.fiber && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.fiber.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {editingProduct ? "Update" : "Create"} Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        title="Delete Product"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the product &quot;{productToDelete?.name}&quot;? 
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={formLoading}
            >
              {formLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
