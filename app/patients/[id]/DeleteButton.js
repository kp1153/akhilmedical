"use client";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id, type, patientId }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/${type}/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-400 hover:text-red-600"
    >
      Delete
    </button>
  );
}