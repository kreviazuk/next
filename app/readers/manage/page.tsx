"use client";

import { useRouter } from "next/navigation";

export default function ReadersManagePage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>读者管理</h1>
        <button onClick={() => router.push("/readers/new")} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">添加读者</button>
      </div>
    </div>
  );
}
