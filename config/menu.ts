export interface MenuItem {
  key: string
  label: string
  icon?: string
  children?: MenuItem[]
  path?: string
}

export const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    path: '/dashboard'
  },
  {
    key: 'system',
    label: '系统管理',
    children: [
      {
        key: 'roles',
        label: '角色管理',
        path: '/system/roles'
      },
      {
        key: 'users',
        label: '用户管理',
        path: '/system/users'
      }
    ]
  },
  {
    key: 'books',
    label: '图书管理',
    children: [
      {
        key: 'books-manage',
        label: '图书管理',
        path: '/books/manage'
      },
      {
        key: 'borrowing',
        label: '借阅管理',
        path: '/books/borrowing'
      }
    ]
  },
  {
    key: 'readers',
    label: '读者管理',
    path: '/readers',
    children: [
      {
        key: 'readers-manage',
        label: '读者管理',
        path: '/readers/manage'
      },
      {
        key: 'readers-new',
        label: '添加读者',
        path: '/readers/new'
      }
    ]
  }
] 