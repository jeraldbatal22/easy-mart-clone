"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/common/layout/Header";
import {
  Edit3,
} from "lucide-react";
import { useState } from "react";
import SidebarAccount from "../_components/sidebar";

export default function AccountDetailsPage() {
  const [isEditing, setIsEditing] = useState<{
    fullName: boolean;
    mobile: boolean;
    email: boolean;
  }>({
    fullName: false,
    mobile: false,
    email: false,
  });

  const [formData, setFormData] = useState({
    fullName: "Alicii Virgo",
    mobile: "+447xx038471",
    email: "Aliciivirgo@gmail.com",
  });

  const handleEdit = (field: keyof typeof isEditing) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = (field: keyof typeof formData) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <div className="mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <SidebarAccount/>
          {/* Sidebar */}

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
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
                        <Input
                          value={formData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSave("fullName")}
                          className="bg-primary-500 hover:bg-primary-600 w-full sm:w-auto"
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <span className="text-gray-900 font-medium text-sm sm:text-base">
                          {formData.fullName}
                        </span>
                        <button
                          onClick={() => handleEdit("fullName")}
                          className="flex items-center justify-center sm:justify-start space-x-2 text-primary-600 hover:text-primary-700 transition-colors self-start sm:self-auto"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    {isEditing.mobile ? (
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <Input
                          value={formData.mobile}
                          onChange={(e) =>
                            handleInputChange("mobile", e.target.value)
                          }
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSave("mobile")}
                          className="bg-primary-500 hover:bg-primary-600 w-full sm:w-auto"
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <span className="text-gray-900 font-medium text-sm sm:text-base">
                          {formData.mobile}
                        </span>
                        <button
                          onClick={() => handleEdit("mobile")}
                          className="flex items-center justify-center sm:justify-start space-x-2 text-primary-600 hover:text-primary-700 transition-colors self-start sm:self-auto"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                      </div>
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
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSave("email")}
                          className="bg-primary-500 hover:bg-primary-600 w-full sm:w-auto"
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <span className="text-gray-900 font-medium text-sm sm:text-base break-all">
                          {formData.email}
                        </span>
                        <button
                          onClick={() => handleEdit("email")}
                          className="flex items-center justify-center sm:justify-start space-x-2 text-primary-600 hover:text-primary-700 transition-colors self-start sm:self-auto"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
