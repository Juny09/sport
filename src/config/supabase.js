// src/lib/supabase.js

import { createClient } from '@supabase/supabase-js'

// ✅ 从环境变量获取 URL 和 Key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// ✅ 安全检查（调试用）
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Missing Supabase credentials in .env file')
  console.warn('⚠️ SUPABASE_URL:', SUPABASE_URL)
  console.warn('⚠️ SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY?.slice(0, 10) + '...')
}

// ✅ 正确创建 Supabase 实例
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ✅ 可选：测试连接函数
export const testConnection = async () => {
  try {
    const { error } = await supabase.from('activities').select('id').limit(1)
    if (error) {
      console.error('❌ Supabase query error:', error)
      return false
    }
    console.log('✅ Supabase connection successful')
    return true
  } catch (err) {
    console.error('❌ Supabase connection failed:', err)
    return false
  }
}
