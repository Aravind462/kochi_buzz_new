"use client";

import React, { useState } from "react";
import { useUser } from "../../../providers/UserContext";

const ProfileCard = () => {
  const { user, setUser } = useUser();
  const [newCategory, setNewCategory] = useState("");
  console.log(user);
  

//   // Remove a category
//   const handleRemoveCategory = (category: string) => {
//     if (!user) return;
//     setUser({
//       ...user,
//       preferredCategories: user.preferredCategories.filter((c) => c !== category),
//     });
//   };

//   // Add a new category
//   const handleAddCategory = () => {
//     if (!user || !newCategory.trim()) return;
//     if (user.preferredCategories.includes(newCategory)) return;

//     setUser({
//       ...user,
//       preferredCategories: [...user.preferredCategories, newCategory],
//     });
//     setNewCategory("");
//   };

  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md">
      {/* Profile Card */}
      <div className="flex items-center bg-gray-100 rounded-lg p-6 w-full max-w-sm">
        <div className="w-20 h-20 border rounded-full overflow-hidden">
          <img src="https://github.com/shadcn.png" className="w-full h-full object-cover" alt="User Avatar" />
        </div>
        <div className="ml-4">
          <p className="text-lg font-semibold">Name: {user?.username || "Guest"}</p>
          <p className="text-sm text-gray-600">Email: {user?.email || "No Email"}</p>
        </div>
      </div>

      {/* Preferred Event Categories */}
      <div className="bg-gray-100 rounded-lg p-4 w-full max-w-sm">
        <div className="border-b pb-2 font-medium text-gray-700">Preferred Event Categories</div>
{/* 
        {user?.preferredCategories?.length > 0 ? (
          user.preferredCategories.map((category, index) => (
            <div key={index} className="border-b flex justify-between items-center px-4 py-2 text-sm">
              <p>{category}</p>
              <button className="text-red-500 hover:text-red-700 transition" onClick={() => handleRemoveCategory(category)}>
                X
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm py-2">No categories selected</p>
        )} */}

        {/* Add Category Input */}
        <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-600">
          <input
            type="text"
            placeholder="Add Category"
            className="p-1 border rounded w-full mr-2"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          {/* <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={handleAddCategory}>
            +
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
