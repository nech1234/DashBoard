import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase 환경 변수가 설정되지 않았습니다.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// 테이블 이름들
export const TABLES = {
  PROJECTS: 'projects',
  JSON_ITEMS: 'json_items',
  USERS: 'users'
}

// 컨텐츠 상태 값들
export const CONTENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED', 
  REJECTED: 'REJECTED',
  UPLOADED: 'UPLOADED'
} 