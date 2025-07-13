import { useState, useEffect } from 'react'
import { contentService } from '../services/contentService'

export const useContents = (channelId) => {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchContents = async () => {
    if (!channelId) return

    try {
      setLoading(true)
      setError(null)
      const data = await contentService.getContentsByChannel(channelId)
      setContents(data || [])
    } catch (err) {
      setError(err.message)
      console.error('컨텐츠 조회 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContents()
  }, [channelId])

  const createContent = async (contentData) => {
    try {
      const newContent = await contentService.createContent({
        ...contentData,
        project_id: channelId
      })
      setContents(prev => [newContent, ...prev])
      return newContent
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateContent = async (contentId, contentData) => {
    try {
      const updatedContent = await contentService.updateContent(contentId, contentData)
      setContents(prev => prev.map(content => 
        content.id === contentId ? updatedContent : content
      ))
      return updatedContent
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const approveContent = async (contentId) => {
    try {
      const updatedContent = await contentService.approveContent(contentId)
      setContents(prev => prev.map(content => 
        content.id === contentId ? updatedContent : content
      ))
      return updatedContent
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const rejectContent = async (contentId) => {
    try {
      const updatedContent = await contentService.rejectContent(contentId)
      setContents(prev => prev.map(content => 
        content.id === contentId ? updatedContent : content
      ))
      return updatedContent
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const resetContent = async (contentId) => {
    try {
      const updatedContent = await contentService.resetContent(contentId)
      setContents(prev => prev.map(content => 
        content.id === contentId ? updatedContent : content
      ))
      return updatedContent
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const uploadContent = async (contentId) => {
    try {
      const updatedContent = await contentService.uploadContent(contentId)
      setContents(prev => prev.map(content => 
        content.id === contentId ? updatedContent : content
      ))
      return updatedContent
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteContent = async (contentId) => {
    try {
      await contentService.deleteContent(contentId)
      setContents(prev => prev.filter(content => content.id !== contentId))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    contents,
    loading,
    error,
    refetch: fetchContents,
    createContent,
    updateContent,
    approveContent,
    rejectContent,
    resetContent,
    uploadContent,
    deleteContent
  }
} 