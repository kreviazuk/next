'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { menuItems } from '@/config/menu'

export default function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <div className={`bg-gray-800 text-white ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">图书管理系统</h1>
        </div>
        
        {/* 菜单 */}
        <nav className="mt-4">
          {menuItems.map((item) => (
            <div key={item.key} className="mb-2">
              <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                {item.label}
              </div>
              {item.children && (
                <div className="ml-4">
                  {item.children.map((child) => (
                    <div
                      key={child.key}
                      className={`px-4 py-2 cursor-pointer ${
                        pathname === child.path
                          ? 'bg-blue-600'
                          : 'hover:bg-gray-700'
                      }`}
                      onClick={() => child.path && router.push(child.path)}
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-4 py-3 flex justify-between items-center">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-600 hover:text-gray-900"
            >
              {collapsed ? '展开' : '收起'}
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">管理员</span>
              <button className="text-gray-600 hover:text-gray-900">
                退出
              </button>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 