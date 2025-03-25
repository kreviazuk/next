"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
// 导入其他需要的组件和工具

export default function NewReaderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    // 其他读者信息字段
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 发送请求创建读者
      const response = await fetch("/api/readers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        // 成功后重定向到读者列表页
        router.push("/readers");
        router.refresh(); // 刷新页面数据
      }
    } catch (error) {
      console.error("添加读者失败:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">添加新读者</h1>
      {/* 表单内容 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 表单字段 */}
        <div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            保存
          </button>
        </div>
      </form>
    </div>
  );
} 