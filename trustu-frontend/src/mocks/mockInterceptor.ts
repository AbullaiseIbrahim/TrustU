/**
 * Mock API interceptor — intercepts all axios requests and returns dummy data
 * when mock mode is enabled. No network calls are made.
 *
 * Enable:  localStorage.setItem('trustu_mock', 'true')  → refresh page
 * Disable: localStorage.removeItem('trustu_mock')        → refresh page
 *
 * To fully revert this feature:
 *   1. Delete this file and src/mocks/mockData.ts
 *   2. Remove the setupMockInterceptor() call from apiClient.ts
 */

import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import {
  MOCK_POSTS,
  MOCK_REPLIES,
  MOCK_ACCOMMODATIONS,
  MOCK_PROXY,
  MOCK_MARKETPLACE,
} from './mockData'
import type { Post, Reply } from '@/types/post.types'
import type { ApiResponse } from '@/types/api.types'
import type { AuthResponse } from '@/types/auth.types'

// ── Mock authenticated user (returned on mock login) ──────────────────────────

const MOCK_AUTH_RESPONSE: ApiResponse<AuthResponse> = {
  data: {
    user: {
      id: 'mock-user-1',
      name: 'Abu Test',
      email: 'test@trustu.app',
      phone: null,
      gender: null,
      designation: 'Student',
      institute: 'Jamia Millia Islamia',
      avatarUrl: null,
      profileComplete: true,
      communityJoined: true,
      communityId: 'community-keralites-jamia',
      communityName: 'Keralites in Jamia',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    token: 'mock-sanctum-token-12345',
  },
  message: 'Login successful',
  success: true,
}

const isMockMode = () => localStorage.getItem('trustu_mock') === 'true'

// ── Fake response builder ─────────────────────────────────────────────────────

function fakeResponse<T>(data: T, config: InternalAxiosRequestConfig): AxiosResponse<T> {
  return { data, status: 200, statusText: 'OK', headers: { 'content-type': 'application/json' }, config }
}

// ── URL → mock data matching ──────────────────────────────────────────────────

function getMockResponse(url: string, method: string): unknown | null {
  const m = method.toLowerCase()

  // ── Auth ──────────────────────────────────────────────────────────────────
  // Mock login / register so the full auth flow works without a backend
  if ((url === '/login' || url === '/register') && m === 'post') return MOCK_AUTH_RESPONSE
  if (url === '/otp/send' || url === '/otp/verify' || url === '/otp/resend') return { data: { message: 'OK' }, message: 'OK', success: true }
  if (url === '/logout' && m === 'post') return { data: null, message: 'Logged out', success: true }

  // Posts list
  if (url === '/posts' && m === 'get') return MOCK_POSTS

  // Create post
  if (url === '/posts' && m === 'post') {
    const newPost: Post = {
      id: `p-${Date.now()}`, userId: 'u1', userName: 'You', userDesignation: 'Student',
      title: '(new post)', description: '', upvotes: 0, replyCount: 0, hasUpvoted: false,
      createdAt: new Date().toISOString(),
    }
    return { data: newPost, message: 'Created', success: true } as ApiResponse<Post>
  }

  // Upvote
  const upvoteMatch = url.match(/^\/posts\/(\w+)\/upvote$/)
  if (upvoteMatch && m === 'post') {
    const post = MOCK_POSTS.data.find((p) => p.id === upvoteMatch[1])
    const toggled: Post = post
      ? { ...post, hasUpvoted: !post.hasUpvoted, upvotes: post.hasUpvoted ? post.upvotes - 1 : post.upvotes + 1 }
      : { id: upvoteMatch[1], userId: '', userName: '', userDesignation: '', title: '', description: '', upvotes: 1, replyCount: 0, hasUpvoted: true, createdAt: '' }
    return { data: toggled, message: 'OK', success: true } as ApiResponse<Post>
  }

  // Get replies
  const repliesGetMatch = url.match(/^\/posts\/(\w+)\/replies$/)
  if (repliesGetMatch && m === 'get') {
    const replies: Reply[] = MOCK_REPLIES[repliesGetMatch[1]] ?? []
    return { data: replies, message: 'OK', success: true } as ApiResponse<Reply[]>
  }

  // Create reply
  const repliesPostMatch = url.match(/^\/posts\/(\w+)\/replies$/)
  if (repliesPostMatch && m === 'post') {
    const newReply: Reply = {
      id: `r-${Date.now()}`, postId: repliesPostMatch[1], userId: 'u1',
      userName: 'You', content: '(new reply)', createdAt: new Date().toISOString(),
    }
    return { data: newReply, message: 'Created', success: true } as ApiResponse<Reply>
  }

  // Delete post
  if (url.match(/^\/posts\/\w+$/) && m === 'delete') return { data: null, message: 'Deleted', success: true }

  // Accommodation
  if ((url === '/accommodations' || url === '/accommodations/user') && m === 'get') return MOCK_ACCOMMODATIONS

  // Proxy
  if ((url === '/proxy' || url === '/proxy/user') && m === 'get') return MOCK_PROXY

  // Marketplace
  if ((url === '/marketplace' || url === '/marketplace/user') && m === 'get') return MOCK_MARKETPLACE

  return null // no mock → real network call
}

// ── Called from apiClient.ts after the instance is created ───────────────────

export function setupMockInterceptor(client: AxiosInstance) {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (!isMockMode()) return config

    const url = config.url ?? ''
    const method = config.method ?? 'get'
    const mockData = getMockResponse(url, method)

    if (mockData !== null) {
      config.adapter = async (axiosConfig) => {
        // Small delay so loading states are visible during UI testing
        await new Promise((resolve) => setTimeout(resolve, 350))
        return fakeResponse(mockData, axiosConfig as InternalAxiosRequestConfig)
      }
    }

    return config
  })

  if (isMockMode()) {
    console.info(
      '%c[TrustU] Mock mode ON — API calls return dummy data',
      'background:#2E7D32;color:white;padding:4px 10px;border-radius:4px;font-weight:bold',
    )
  }
}
