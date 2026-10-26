import { HomeDashboard } from '@/components/features/home/HomeDashboard'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const name: unknown = user?.user_metadata?.name
  return <HomeDashboard products={MOCK_PRODUCTS} userName={typeof name === 'string' ? name : undefined} />
}
