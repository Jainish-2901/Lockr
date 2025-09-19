import { useEffect, useState } from "react";
//import Navbar from "../components/Navbar";
import VaultForm from "../components/VaultForm";
import VaultList from "../components/VaultList";
import { getVaultItems } from "../api";

export default function Dashboard() {
  const [items, setItems] = useState([]); // ✅ always start with an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getVaultItems();
        setItems(res?.data || []); // ✅ fallback to empty array
      } catch (err) {
        console.error("Error fetching vault items:", err);
        setItems([]); // ✅ prevent undefined
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-white to-indigo-50">

      {/* Dashboard Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Form */}
        <section className="bg-white/70 backdrop-blur-xl border border-gray-100 shadow-lg rounded-2xl p-6">
          <VaultForm setItems={setItems} />
        </section>

        {/* Vault Items */}
        <section>
          {loading ? (
            <p className="text-gray-500 text-center mt-6 animate-pulse">
              Loading your vault...
            </p>
          ) : items.length > 0 ? (
            <VaultList items={items} setItems={setItems} />
          ) : (
            <p className="text-gray-400 text-center mt-6">
              🔐 No items yet. Add your first password!
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
