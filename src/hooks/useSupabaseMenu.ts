import { useState, useEffect } from 'react'
import { menuService, MenuItem } from '@/lib/supabase'

export const useSupabaseMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const items = await menuService.getMenuItems()
      setMenuItems(items)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading menu items')
      console.error('Error fetching menu items:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenuItems()
  }, [])

  return {
    menuItems,
    loading,
    error,
    refetch: fetchMenuItems
  }
}