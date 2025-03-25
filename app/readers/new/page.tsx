"use client"

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export default function NewReaderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    gender: "男",
    age: "",
    phone: "",
    address: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 简单验证
    if (!formData.name) {
      toast.error("验证失败", {
        description: "请输入读者姓名"
      });
      return;
    }

    // 电话号码验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      toast.error("验证失败", {
        description: "请输入有效的11位手机号码"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 发送请求创建读者
      const response = await fetch("/api/readers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age) || 0
        })
      });
      
      if (response.ok) {
        toast.success("读者添加成功");
        // 成功后重定向到读者列表页
        router.push("/readers");
        router.refresh(); // 刷新页面数据
      } else {
        const error = await response.json();
        throw new Error(error.message || "添加读者失败");
      }
    } catch (error) {
      console.error("添加读者失败:", error);
      toast.error("添加读者失败", {
        description: error instanceof Error ? error.message : "请稍后重试"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">添加新读者</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="请输入读者姓名"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label>性别</Label>
            <RadioGroup 
              value={formData.gender} 
              onValueChange={handleGenderChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="男" id="male" />
                <Label htmlFor="male">男</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="女" id="female" />
                <Label htmlFor="female">女</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="age">年龄</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="请输入年龄"
              min="1"
              max="120"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">电话号码</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="请输入电话号码"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="address">家庭地址</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="请输入家庭地址"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/readers")}
          >
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </div>
      </form>
    </div>
  );
} 