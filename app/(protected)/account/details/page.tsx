"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/common/layout/Header";
import { Edit3 } from "lucide-react";
import { useEffect, useState } from "react";
import SidebarAccount from "../_components/sidebar";
import { useAppSelector } from "@/lib/hooks";
import { User } from "@/lib/slices/authSlice";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for form validation
const accountDetailsSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),
  phone: z
    .string()
    .min(7, "phone number must be at least 7 digits")
    .max(20, "phone number must be at most 20 digits"),
  email: z.string().email("Invalid email address"),
});

type AccountDetailsForm = z.infer<typeof accountDetailsSchema>;

const getFullName = (user: User | null) => {
  if (!user) return "";
  if (user.firstName || user.lastName) {
    return [user.firstName, user.lastName].filter(Boolean).join(" ");
  }
  return "";
};

const getPhone = (user: User | null) => {
  if (!user) return "";
  // Try both 'phone'
  return user.phone ?? "";
};

const getEmail = (user: User | null) => {
  if (!user) return "";
  return user.email ?? "";
};

const AccountDetailsPage = () => {
  const { user } = useAppSelector((state) => state.auth);

  // Editing state for each field
  const [isEditing, setIsEditing] = useState<{
    fullName: boolean;
    phone: boolean;
    email: boolean;
  }>({
    fullName: false,
    phone: false,
    email: false,
  });

  // Set up react-hook-form with zod
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm<AccountDetailsForm>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      fullName: getFullName(user),
      phone: getPhone(user),
      email: getEmail(user),
    },
  });

  // When user changes, reset form values
  useEffect(() => {
    reset({
      fullName: getFullName(user),
      phone: getPhone(user),
      email: getEmail(user),
    });
  }, [user, reset]);

  // Handle edit toggling
  const handleEdit = (field: keyof typeof isEditing) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Simulate save (could call API here)
  const handleSave = (field: keyof typeof isEditing) => {
    // Optionally, you could call handleSubmit here for validation
    // For now, just close the edit mode for the field
    setIsEditing((prev) => ({
      ...prev,
      [field]: false,
    }));
    // Optionally, update user in redux or backend here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <div className="mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <SidebarAccount />
          {/* Sidebar */}

          {/* Main Content Area */}
          <div className="flex-1">
            <form
              // We don't submit the whole form at once, but this enables enter-to-save for fields
              onSubmit={e => e.preventDefault()}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8"
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
                Account Details
              </h1>

              <div className="space-y-4 sm:space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    {isEditing.fullName ? (
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <Controller
                          name="fullName"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              value={field.value}
                              onChange={field.onChange}
                              className="flex-1 border-1 border-gray-200 focus:border-none"
                            />
                          )}
                        />
                        <Button
                          size="sm"
                          type="button"
                          onClick={() => {
                            // Validate before saving
                            handleSubmit(() => handleSave("fullName"))();
                          }}
                          className="bg-primary-500 hover:bg-primary-600 w-full sm:w-auto "
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <span className="text-gray-900 font-medium text-sm sm:text-base">
                          {getValues("fullName")}
                        </span>
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => handleEdit("fullName")}
                          className="flex items-center justify-center sm:justify-start space-x-2 text-primary-600 hover:text-primary-700 transition-colors self-start sm:self-auto"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit</span>
                        </Button>
                      </div>
                    )}
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                    )}
                  </div>
                </div>

                {/* phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    phone Number
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    {isEditing.phone ? (
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <Controller
                          name="phone"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              value={field.value}
                              onChange={field.onChange}
                              className="flex-1 border-gray-200 focus:border-none"
                            />
                          )}
                        />
                        <Button
                          size="sm"
                          type="button"
                          onClick={() => {
                            handleSubmit(() => handleSave("phone"))();
                          }}
                          className="bg-primary-500 hover:bg-primary-600 w-full sm:w-auto"
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <span className="text-gray-900 font-medium text-sm sm:text-base">
                          {getValues("phone")}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleEdit("phone")}
                          className="flex items-center justify-center sm:justify-start space-x-2 text-primary-600 hover:text-primary-700 transition-colors self-start sm:self-auto"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                      </div>
                    )}
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    {isEditing.email ? (
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <Controller
                          name="email"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="email"
                              value={field.value}
                              onChange={field.onChange}
                              className="flex-1 border-gray-200 focus:border-none"
                            />
                          )}
                        />
                        <Button
                          size="sm"
                          type="button"
                          onClick={() => {
                            handleSubmit(() => handleSave("email"))();
                          }}
                          className="bg-primary-500 hover:bg-primary-600 w-full sm:w-auto"
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <span className="text-gray-900 font-medium text-sm sm:text-base break-all">
                          {getValues("email")}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleEdit("email")}
                          className="flex items-center justify-center sm:justify-start space-x-2 text-primary-600 hover:text-primary-700 transition-colors self-start sm:self-auto"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                      </div>
                    )}
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsPage;
