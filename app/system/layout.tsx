import MainLayout from '@/components/layout/MainLayout'

export default function SystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
} 