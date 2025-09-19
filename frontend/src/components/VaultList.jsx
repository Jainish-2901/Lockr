import { useState } from "react";
import { deleteVaultItem, getVaultItems, updateVaultItem } from "../api";
import { Eye, EyeOff, Search } from "lucide-react";

export default function VaultList({ items = [], setItems }) {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    website: "",
    username: "",
    password: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({});
  const [editShowPassword, setEditShowPassword] = useState(false); // for edit mode
  const [search, setSearch] = useState(""); // search filter
  const [confirmDelete, setConfirmDelete] = useState(null); // track item for confirm modal

  const refreshItems = async () => {
    try {
      const res = await getVaultItems();
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vault items");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVaultItem(id);
      await refreshItems();
      setConfirmDelete(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete item");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditForm({
      website: item.website || "",
      username: item.username || "",
      password: item.password || "",
      notes: item.notes || "",
    });
    setEditShowPassword(false); // reset show/hide on edit open
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    try {
      await updateVaultItem(id, editForm);
      await refreshItems();
      setEditId(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update item");
    }
  };

  const handleCancel = () => setEditId(null);

  const togglePassword = (id) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // filter items by website, username, or notes
  const filteredItems = items.filter(
    (item) =>
      item.website?.toLowerCase().includes(search.toLowerCase()) ||
      item.username?.toLowerCase().includes(search.toLowerCase()) ||
      item.notes?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid gap-4">
      {error && <p className="text-red-500">{error}</p>}

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by website, username, or notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* List */}
      {filteredItems.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No vault items found</p>
      ) : (
        filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition"
          >
            {editId === item._id ? (
              <form
                onSubmit={(e) => handleEditSubmit(e, item._id)}
                className="grid grid-cols-2 gap-3"
              >
                <input
                  name="website"
                  value={editForm.website}
                  onChange={handleEditChange}
                  className="border border-gray-300 p-2 rounded col-span-2"
                />
                <input
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                  className="border border-gray-300 p-2 rounded"
                />
                <div className="relative">
                  <input
                    name="password"
                    type={editShowPassword ? "text" : "password"}
                    value={editForm.password}
                    onChange={handleEditChange}
                    className="border border-gray-300 p-2 rounded pr-8 w-full"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setEditShowPassword((v) => !v)}
                    aria-label={editShowPassword ? "Hide password" : "Show password"}
                  >
                    {editShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <input
                  name="notes"
                  value={editForm.notes}
                  onChange={handleEditChange}
                  className="border border-gray-300 p-2 rounded col-span-2"
                />
                <div className="col-span-2 flex gap-3 mt-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-between items-start">
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-semibold text-gray-700">Website:</span>{" "}
                    {item.website}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Username:</span>{" "}
                    {item.username}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Password:</span>{" "}
                    {showPassword[item._id] ? item.password : "••••••••"}
                    <button
                      type="button"
                      onClick={() => togglePassword(item._id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showPassword[item._id] ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Notes:</span>{" "}
                    {item.notes}
                  </p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 rounded-md text-sm border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete(item)}
                    className="px-3 py-1 rounded-md text-sm border border-red-500 text-red-600 hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-medium">{confirmDelete.website}</span>?
            </p>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}