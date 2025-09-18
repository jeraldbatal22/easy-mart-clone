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
import { categorySchema, createCategorySchema, type CategoryFormData } from "@/lib/validations/admin";

interface Category {
  _id: string;
  name: string;
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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  // Form states
  const [formLoading, setFormLoading] = useState(false);
  
  // React Hook Form setup
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      imageFile: undefined,
      imageUrl: "",
    },
  });

  // Fetch categories
  const fetchCategories = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
      });
      
      const response = await fetch(`/api/category/grocery?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data.categories);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.error || "Failed to fetch categories");
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchCategories(1, query);
  };

  const handlePageChange = (page: number) => {
    fetchCategories(page, searchQuery);
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit }));
    fetchCategories(1, searchQuery);
  };

  const resetForm = () => {
    form.reset({
      name: "",
      imageFile: undefined,
      imageUrl: "",
    });
    setEditingCategory(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      imageFile: undefined,
      imageUrl: category.imageUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setFormLoading(true);
      
      // Validate with appropriate schema based on whether we're editing
      const validationSchema = editingCategory ? categorySchema : createCategorySchema;
      const validationResult = validationSchema.safeParse(data);
      
      if (!validationResult.success) {
        validationResult.error.issues.forEach((error: any) => {
          form.setError(error.path[0] as keyof CategoryFormData, {
            message: error.message,
          });
        });
        return;
      }
      
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.name.trim());
      
      if (editingCategory) {
        formDataToSend.append("id", editingCategory._id);
        if (data.imageFile) {
          formDataToSend.append("file", data.imageFile);
        }
        
        const response = await fetch("/api/category/grocery", {
          method: "PUT",
          body: formDataToSend,
        });
        
        const responseData = await response.json();
        
        if (responseData.success) {
          toast.success("Category updated successfully");
          setIsModalOpen(false);
          resetForm();
          fetchCategories(pagination.page, searchQuery);
        } else {
          toast.error(responseData.error || "Failed to update category");
        }
      } else {
        if (!data.imageFile) {
          toast.error("Category image is required");
          return;
        }
        
        formDataToSend.append("file", data.imageFile);
        
        const response = await fetch("/api/category/grocery", {
          method: "POST",
          body: formDataToSend,
        });
        
        const responseData = await response.json();
        
        if (responseData.success) {
          toast.success("Category created successfully");
          setIsModalOpen(false);
          resetForm();
          fetchCategories(pagination.page, searchQuery);
        } else {
          toast.error(responseData.error || "Failed to create category");
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
    if (!categoryToDelete) return;

    try {
      setFormLoading(true);
      
      const response = await fetch(`/api/category/grocery?id=${categoryToDelete._id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Category deleted successfully");
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
        fetchCategories(pagination.page, searchQuery);
      } else {
        toast.error(data.error || "Failed to delete category");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error deleting category:", error);
    } finally {
      setFormLoading(false);
    }
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
              alt="Category"
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
      key: "createdAt",
      label: "Created",
      render: (value: string) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
  ];

  return (
    <div className="p-6">
      <DataTable
        data={categories}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        onSearch={handleSearch}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        title="Categories Management"
        addButtonText="Add Category"
        emptyMessage="No categories found"
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingCategory ? "Edit Category" : "Add New Category"}
        size="md"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Enter category name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label>Category Image</Label>
            <ImageUpload
              value={form.watch("imageUrl") || ""}
              onChange={(file, url) => {
                form.setValue("imageFile", file || undefined);
                form.setValue("imageUrl", url || "");
              }}
              placeholder="Upload category image"
            />
            {form.formState.errors.imageFile && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.imageFile.message}</p>
            )}
            {editingCategory && !form.watch("imageFile") && (
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
              {editingCategory ? "Update" : "Create"} Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the category &quot;{categoryToDelete?.name}&quot;? 
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setCategoryToDelete(null);
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
