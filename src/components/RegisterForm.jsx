import React, { useState } from "react";
import { SignUp, useSignUp } from "@clerk/clerk-react";

const RegisterForm = () => {
  const { signUp } = useSignUp();
  const [role, setRole] = useState("reader");
  const [formData, setFormData] = useState({
    resumeUrl: "",
    workDescription: "",
    publishedWorkUrls: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (role === "reporter") {
      if (!formData.resumeUrl) newErrors.resumeUrl = "Resume URL is required.";
      if (!formData.workDescription) newErrors.workDescription = "Work description is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Step 1: Use Clerk's built-in SignUp component for creating the user
      const signUpResponse = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      // Step 2: If role is "reporter", update extra fields
      if (role === "reporter") {
        await signUp.update({
          firstName: formData.firstName,
          publicMetadata: {
            role,
            resumeUrl: formData.resumeUrl,
            workDescription: formData.workDescription,
            publishedWorkUrls: formData.publishedWorkUrls.split(",").map(url => url.trim()),
          },
        });
      } else {
        await signUp.update({
          firstName: formData.firstName,
          publicMetadata: { role },
        });
      }

      // Step 3: Trigger email verification
      await signUp.attemptVerification({ strategy: "email_code" });
      alert("Registration successful! Check your email to verify your account.");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen mt-5 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">
          Create an Account
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Please fill out the form to register. If you're a reporter, additional information is required.
        </p>

        {/* One Single Form for Registration */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email and Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Create a strong password"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={role}
              onChange={handleRoleChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="reader">Reader</option>
              <option value="reporter">Reporter</option>
            </select>
          </div>

          {/* Extra Fields for Reporter */}
          {role === "reporter" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume URL
                </label>
                <input
                  type="url"
                  name="resumeUrl"
                  value={formData.resumeUrl}
                  onChange={handleInputChange}
                  required
                  placeholder="Link to your resume"
                  className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.resumeUrl ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.resumeUrl && <p className="text-red-500 text-sm mt-1">{errors.resumeUrl}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Description
                </label>
                <textarea
                  name="workDescription"
                  value={formData.workDescription}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe your work experience"
                  className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.workDescription ? "border-red-500" : "border-gray-300"
                  }`}
                ></textarea>
                {errors.workDescription && <p className="text-red-500 text-sm mt-1">{errors.workDescription}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Published Work URLs (comma-separated)
                </label>
                <input
                  type="text"
                  name="publishedWorkUrls"
                  value={formData.publishedWorkUrls}
                  onChange={handleInputChange}
                  placeholder="e.g., https://example.com/article1, https://example.com/article2"
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md text-white font-semibold shadow-md bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
