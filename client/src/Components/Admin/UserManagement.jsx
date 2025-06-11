import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addUser,
  deleteUser,
  updateUser,
  fetchUsers,
  clearError,
} from "../../Redux/Slice/adminSlice";
import { toast } from "sonner";

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.admin);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchUsers());
    }
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 2000 });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await dispatch(addUser(data)).unwrap();
      toast.success("User added successfully!", { duration: 1000 });
      reset();
    } catch (err) {
      // console.error(err)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (userID, newRole) => {
    try {
      await dispatch(updateUser({ id: userID, role: newRole })).unwrap();
      toast.success("User role updated!", { duration: 1000 });
    } catch (err) {
      // console.error(err)
    }
  };

  const handleDeleteUser = async (userID) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await dispatch(deleteUser(userID)).unwrap();
        toast.success("User deleted successfully!", { duration: 1000 });
      } catch (err) {
        // console.error(err)
      }
    }
  };

  if (loading && !isSubmitting) {
    return (
      <div className="flex justify-center items-center">
        <span className="loading"></span>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      {/* Add New User Form */}
      <div className="rounded-lg mb-6 p-6 bg-white shadow-md">
        <h3 className="text-lg font-bold mb-4">Add New User</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              className="input w-full bg-neutral-200 focus:outline-main-theme"
              placeholder="Enter the name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-700 mt-1">{errors.name.message}</p>
            )}
          </div>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              className="input w-full bg-neutral-200 focus:outline-main-theme"
              placeholder="Enter email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-700 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              className="input w-full bg-neutral-200 focus:outline-main-theme"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-700 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {/* Role Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Role</label>
            <select
              className="input w-full bg-neutral-200 focus:outline-main-theme"
              {...register("role", {
                required: "Role is required",
              })}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-700 mt-1">{errors.role.message}</p>
            )}
          </div>
          {/* Submit */}
          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-soft bg-main-theme btn-wide border-0"
            >
              {isSubmitting ? (
                <>
                  <span className="loading"></span>
                  Adding...
                </>
              ) : (
                "Add User"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* User List Management */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="table min-w-full text-left text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="font-medium text-gray-900 whitespace-nowrap p-4">
                  {user.name}
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="select bg-white"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="btn btn-soft btn-error border-0"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
