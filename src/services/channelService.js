import { supabase, TABLES } from '../lib/supabase'

export const channelService = {
  // 모든 프로젝트(채널) 조회
  async getAllChannels() {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('프로젝트 조회 오류:', error)
      throw error
    }
  },

  // 프로젝트(채널) ID로 조회
  async getChannelById(channelId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select('*')
        .eq('id', channelId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('프로젝트 조회 오류:', error)
      throw error
    }
  },

  // 새 프로젝트(채널) 생성
  async createChannel(channelData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .insert([channelData])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('프로젝트 생성 오류:', error)
      throw error
    }
  },

  // 프로젝트(채널) 업데이트
  async updateChannel(channelId, channelData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .update(channelData)
        .eq('id', channelId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('프로젝트 업데이트 오류:', error)
      throw error
    }
  },

  // 프로젝트(채널) 삭제
  async deleteChannel(channelId) {
    try {
      const { error } = await supabase
        .from(TABLES.PROJECTS)
        .delete()
        .eq('id', channelId)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('프로젝트 삭제 오류:', error)
      throw error
    }
  }
} 