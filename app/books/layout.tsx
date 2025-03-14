import MainLayout from '@/components/layout/MainLayout'

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
} 