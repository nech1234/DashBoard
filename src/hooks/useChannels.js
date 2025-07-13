import { useState, useEffect } from 'react'
import { channelService } from '../services/channelService'

export const useChannels = () => {
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchChannels = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await channelService.getAllChannels()
      setChannels(data || [])
    } catch (err) {
      setError(err.message)
      console.error('채널 조회 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChannels()
  }, [])

  const createChannel = async (channelData) => {
    try {
      const newChannel = await channelService.createChannel(channelData)
      setChannels(prev => [newChannel, ...prev])
      return newChannel
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateChannel = async (channelId, channelData) => {
    try {
      const updatedChannel = await channelService.updateChannel(channelId, channelData)
      setChannels(prev => prev.map(channel => 
        channel.id === channelId ? updatedChannel : channel
      ))
      return updatedChannel
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteChannel = async (channelId) => {
    try {
      await channelService.deleteChannel(channelId)
      setChannels(prev => prev.filter(channel => channel.id !== channelId))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    channels,
    loading,
    error,
    refetch: fetchChannels,
    createChannel,
    updateChannel,
    deleteChannel
  }
} 