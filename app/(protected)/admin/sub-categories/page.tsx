"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, X } from "lucide-react";
import { subcategorySchema, createSubcategorySchema, type SubcategoryFormData } from "@/lib/validations/admin";

interface Category {
  _id: string;
  name: string;
  imageUrl?: string;
}

interface SubCategory {
  _id: string;
  name: string;
  groceryCategory: string;
  imageUrl?: string;
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

export default function AdminSubCategoriesPage() {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<SubCategory | null>(null);
  
  // Form states
  const [formLoading, setFormLoading] = useState(false);
  
  // React Hook Form setup
  const form = useForm<SubcategoryFormData>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: "",
      groceryCategory: "",
      imageFile: undefined,
      imageUrl: "",
    },
  });

  // Fetch categories for dropdown
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

  // Fetch subcategories
  const fetchSubCategories = async (page = 1, search = "", categoryId = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(categoryId && { categoryId }),
      });
      
      const response = await fetch(`/api/category/subcategory/grocery?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setSubcategories(data.data.subcategories);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.error || "Failed to fetch subcategories");
      }
    } catch (error) {
      toast.error("Failed to fetch subcategories");
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchSubCategories(1, query, selectedCategory);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    fetchSubCategories(1, searchQuery, categoryId);
  };

  const handlePageChange = (page: number) => {
    fetchSubCategories(page, searchQuery, selectedCategory);
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit }));
    fetchSubCategories(1, searchQuery, selectedCategory);
  };

  const resetForm = () => {
    form.reset({
      name: "",
      groceryCategory: "",
      imageFile: undefined,
      imageUrl: "",
    });
    setEditingSubCategory(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    form.reset({
      name: subCategory.name,
      groceryCategory: subCategory.groceryCategory,
      imageFile: undefined,
      imageUrl: subCategory.imageUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (subCategory: SubCategory) => {
    setSubCategoryToDelete(subCategory);
    setIsDeleteModalOpen(true);
  };

  const onSubmit = async (data: SubcategoryFormData) => {
    try {
      setFormLoading(true);
      
      // Validate with appropriate schema based on whether we're editing
      const validationSchema = editingSubCategory ? subcategorySchema : createSubcategorySchema;
      const validationResult = validationSchema.safeParse(data);
      
      if (!validationResult.success) {
        validationResult.error.issues.forEach((error: any) => {
          form.setError(error.path[0] as keyof SubcategoryFormData, {
            message: error.message,
          });
        });
        return;
      }
      
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.name.trim());
      formDataToSend.append("groceryCategory", data.groceryCategory);
      
      if (editingSubCategory) {
        formDataToSend.append("id", editingSubCategory._id);
        if (data.imageFile) {
          formDataToSend.append("file", data.imageFile);
        }
        
        const response = await fetch("/api/category/subcategory", {
          method: "PUT",
          body: formDataToSend,
        });
        
        const responseData = await response.json();
        
        if (responseData.success) {
          toast.success("Subcategory updated successfully");
          setIsModalOpen(false);
          resetForm();
          fetchSubCategories(pagination.page, searchQuery, selectedCategory);
        } else {
          toast.error(responseData.error || "Failed to update subcategory");
        }
      } else {
        if (!data.imageFile) {
          toast.error("Subcategory image is required");
          return;
        }
        
        formDataToSend.append("file", data.imageFile);
        
        const response = await fetch("/api/category/subcategory", {
          method: "POST",
          body: formDataToSend,
        });
        
        const responseData = await response.json();
        
        if (responseData.success) {
          toast.success("Subcategory created successfully");
          setIsModalOpen(false);
          resetForm();
          fetchSubCategories(pagination.page, searchQuery, selectedCategory);
        } else {
          toast.error(responseData.error || "Failed to create subcategory");
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
    if (!subCategoryToDelete) return;

    try {
      setFormLoading(true);
      
      const response = await fetch(`/api/category/subcategory?id=${subCategoryToDelete._id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Subcategory deleted successfully");
        setIsDeleteModalOpen(false);
        setSubCategoryToDelete(null);
        fetchSubCategories(pagination.page, searchQuery, selectedCategory);
      } else {
        toast.error(data.error || "Failed to delete subcategory");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error deleting subcategory:", error);
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
      key: "imageUrl",
      label: "Image",
      render: (value: string) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Subcategory"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              📁
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "groceryCategory",
      label: "Category",
      render: (value: string) => getCategoryName(value),
      sortable: true,
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
        data={subcategories}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        onSearch={handleSearch}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        title="Subcategories Management"
        addButtonText="Add Subcategory"
        emptyMessage="No subcategories found"
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingSubCategory ? "Edit Subcategory" : "Add New Subcategory"}
        size="md"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Subcategory Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Enter subcategory name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="groceryCategory">Parent Category</Label>
            <select
              id="groceryCategory"
              {...form.register("groceryCategory")}
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
            <Label>Subcategory Image</Label>
            <ImageUpload
              value={form.watch("imageUrl") || ""}
              onChange={(file, url) => {
                form.setValue("imageFile", file || undefined);
                form.setValue("imageUrl", url || "");
              }}
              placeholder="Upload subcategory image"
            />
            {form.formState.errors.imageFile && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.imageFile.message}</p>
            )}
            {editingSubCategory && !form.watch("imageFile") && (
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to keep current image
              </p>
            )}
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
              {editingSubCategory ? "Update" : "Create"} Subcategory
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSubCategoryToDelete(null);
        }}
        title="Delete Subcategory"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the subcategory `{subCategoryToDelete?.name}`? 
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSubCategoryToDelete(null);
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
