import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { UserPlus, Trash2, Edit2, X } from "lucide-react";
const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};


export default function Users() {
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;


  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Security Analyst",
      email: "analyst@threatguard.com",
      role: "ANALYST",
    },
    {
      id: 2,
      name: "System Administrator",
      email: "admin@threatguard.com",
      role: "ADMIN",
    },
  ]);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    role: "ANALYST",
  });

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

  const handleSave = () => {
    if (editMode) {
      setUsers(
        users.map((u) => (u.id === formData.id ? formData : u))
      );
    } else {
      setUsers([
        ...users,
        {
          ...formData,
          id: users.length + 1,
        },
      ]);
    }

    setShowForm(false);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">User Management</h2>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium">System Users</h3>
            <p className="text-sm text-gray-500">
              Manage platform users and roles
            </p>
          </div>

          <Button onClick={openAddForm}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {showForm && (
          <div className="mb-6 p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">
                {editMode ? "Edit User" : "Add New User"}
              </h4>

              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <input
                className="border p-2 rounded"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                className="border p-2 rounded"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <select
                className="border p-2 rounded"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="ANALYST">Security Analyst</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave}>
                {editMode ? "Update User" : "Save User"}
              </Button>

              <Button onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-sm text-gray-600">
              <th className="py-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
             <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="py-4">
                    <div className="flex items-center space-x-3">
                    
                    {/* Avatar Circle */}
                    <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-semibold">
                        {getInitials(user.name)}
                    </div>

                    <span className="font-medium">{user.name}</span>
                    </div>
                </td>

                <td className="py-4 text-gray-700">{user.email}</td>

                <td className="py-4">
                    <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "ADMIN"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                    >
                    {user.role}
                    </span>
                </td>

                <td className="py-4 text-center space-x-3">
                    <button
                    onClick={() => openEditForm(user)}
                    className="text-blue-600 hover:text-blue-800"
                    >
                    <Edit2 className="w-4 h-4 inline" />
                    </button>

                    <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-800"
                    >
                    <Trash2 className="w-4 h-4 inline" />
                    </button>
                </td>
                </tr>

                
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
