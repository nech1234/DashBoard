import { supabase, TABLES, CONTENT_STATUS } from '../lib/supabase'

export const contentService = {
  // 프로젝트별 컨텐츠 조회
  async getContentsByChannel(projectId, status = null) {
    try {
      let query = supabase
        .from(TABLES.JSON_ITEMS)
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
      
      if (status) {
        query = query.eq('status', status)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('JSON 아이템 조회 오류:', error)
      throw error
    }
  },

  // 컨텐츠 ID로 조회
  async getContentById(contentId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.JSON_ITEMS)
        .select('*')
        .eq('id', contentId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('JSON 아이템 조회 오류:', error)
      throw error
    }
  },

  // 새 컨텐츠 생성
  async createContent(contentData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.JSON_ITEMS)
        .insert([{
          ...contentData,
          status: CONTENT_STATUS.PENDING
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('JSON 아이템 생성 오류:', error)
      throw error
    }
  },

  // 컨텐츠 상태 업데이트
  async updateContentStatus(contentId, status) {
    try {
      const { data, error } = await supabase
        .from(TABLES.JSON_ITEMS)
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', contentId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('JSON 아이템 상태 업데이트 오류:', error)
      throw error
    }
  },

  // 컨텐츠 업데이트
  async updateContent(contentId, contentData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.JSON_ITEMS)
        .update({
          ...contentData,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('JSON 아이템 업데이트 오류:', error)
      throw error
    }
  },

  // 컨텐츠 삭제
  async deleteContent(contentId) {
    try {
      const { error } = await supabase
        .from(TABLES.JSON_ITEMS)
        .delete()
        .eq('id', contentId)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('JSON 아이템 삭제 오류:', error)
      throw error
    }
  },

  // 컨텐츠 승인
  async approveContent(contentId) {
    return this.updateContentStatus(contentId, CONTENT_STATUS.APPROVED)
  },

  // 컨텐츠 거절
  async rejectContent(contentId) {
    return this.updateContentStatus(contentId, CONTENT_STATUS.REJECTED)
  },

  // 컨텐츠 재검토 (대기 상태로 변경)
  async resetContent(contentId) {
    return this.updateContentStatus(contentId, CONTENT_STATUS.PENDING)
  },

  // 컨텐츠 업로드 완료
  async uploadContent(contentId) {
    return this.updateContentStatus(contentId, CONTENT_STATUS.UPLOADED)
  }
} 