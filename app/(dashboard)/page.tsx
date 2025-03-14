export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 统计卡片 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">总用户数</h3>
          <p className="text-3xl font-bold mt-2">123</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">总图书数</h3>
          <p className="text-3xl font-bold mt-2">1,234</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">借阅总数</h3>
          <p className="text-3xl font-bold mt-2">567</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">待归还</h3>
          <p className="text-3xl font-bold mt-2">89</p>
        </div>
      </div>

      {/* 后续可以添加图表等其他内容 */}
    </div>
  )
} 