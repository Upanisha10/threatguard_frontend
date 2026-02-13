import { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { UserPlus, Trash2, Edit2, X } from "lucide-react";
import { apiService } from "../services/api";

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export default function Users() {
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    role: "ANALYST",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users", error);
    }
  };

  const openAddForm = () => {
    setFormData({ id: null, name: "", email: "", role: "ANALYST" });
    setEditMode(false);
    setShowForm(true);
  };

  const openEditForm = (user) => {
    setFormData(user);
    setEditMode(true);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.email) {
        alert("Name and Email are required");
        return;
      }

      setSaving(true);

      if (editMode && formData.id !== null) {
        await apiService.updateUser(formData.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        });
      } else {
        await apiService.registerUser({
          name: formData.name,
          email: formData.email,
          role: formData.role,
        });
      }

      setShowForm(false);
      loadUsers();
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          User Management
        </h1>
        <p className="text-gray-500 mt-1">
          Manage platform users, roles and access permissions
        </p>
      </div>

      <Card className="p-8 shadow-sm border border-gray-200">

        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              System Users
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Total Users: {users.length}
            </p>
          </div>

          <Button
            onClick={openAddForm}
            className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow-sm"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="mb-8 p-6 rounded-xl border border-gray-200 bg-gray-50 shadow-inner">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {editMode ? "Edit User" : "Create New User"}
              </h3>

              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-800" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">

              <input
                className="border border-gray-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900 rounded-lg px-4 py-2 outline-none transition"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                className="border border-gray-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900 rounded-lg px-4 py-2 outline-none transition"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <select
                className="border border-gray-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900 rounded-lg px-4 py-2 outline-none transition"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="ANALYST">Security Analyst</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-lg"
              >
                {saving
                  ? editMode
                    ? "Updating..."
                    : "Creating..."
                  : editMode
                  ? "Update User"
                  : "Create User"}
              </Button>

              <Button
                onClick={() => setShowForm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-left">

            <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold shadow-sm">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {user.userId}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center space-x-4">
                    <button
                      onClick={() => openEditForm(user)}
                      className="text-blue-600 hover:text-blue-900 transition"
                    >
                      <Edit2 className="w-4 h-4 inline" />
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </Card>
    </div>
  );
}
