/**
 * Dummy data for UI testing without a backend.
 *
 * Enable:  localStorage.setItem('trustu_mock', 'true')  → refresh
 * Disable: localStorage.removeItem('trustu_mock')        → refresh
 */

import type { Post, Reply } from '@/types/post.types'
import type { Accommodation } from '@/services/accommodation.api'
import type { ProxyListing } from '@/types/proxy.types'
import type { MarketplaceListing } from '@/types/marketplace.types'
import type { PaginatedResponse } from '@/types/api.types'

// ── Helpers ──────────────────────────────────────────────────────────────────

const paginated = <T>(data: T[]): PaginatedResponse<T> => ({
  data,
  meta: { currentPage: 1, lastPage: 1, perPage: 20, total: data.length, from: 1, to: data.length },
  message: 'Success',
  success: true,
})

// ── Community Posts ───────────────────────────────────────────────────────────

export const MOCK_POSTS: PaginatedResponse<Post> = paginated([
  {
    id: 'p1',
    userId: 'u2',
    userName: 'Fatima Malik',
    userDesignation: 'Student',
    content: 'Does anyone know a good PG near the main gate that allows late-night entry? I have evening lab sessions that go till 10 PM.',
    upvotes: 12,
    replyCount: 3,
    hasUpvoted: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p2',
    userId: 'u3',
    userName: 'Arjun Sharma',
    userDesignation: 'Student',
    content: 'Looking for someone to share a Swiggy One subscription — the annual plan is ₹1,299 and we can split it 4 ways. Anyone interested?',
    upvotes: 8,
    replyCount: 5,
    hasUpvoted: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p3',
    userId: 'u4',
    userName: 'Priya Nair',
    userDesignation: 'Faculty',
    content: 'Reminder: The library will be closed this Saturday for maintenance. Please plan your study sessions accordingly.',
    upvotes: 34,
    replyCount: 2,
    hasUpvoted: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p4',
    userId: 'u5',
    userName: 'Rahul Gupta',
    userDesignation: 'Alumni',
    content: 'Hey everyone! I am looking for a flatmate for my 2BHK near campus. Rent is ₹6,500/month including electricity. Vegetarian preferred but not strict.',
    upvotes: 5,
    replyCount: 7,
    hasUpvoted: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p5',
    userId: 'u6',
    userName: 'Zara Khan',
    userDesignation: 'Student',
    content: 'Can anyone recommend a good affordable gym near Jamia Nagar? I am looking for something under ₹800/month.',
    upvotes: 19,
    replyCount: 11,
    hasUpvoted: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
])

// ── Replies ───────────────────────────────────────────────────────────────────

export const MOCK_REPLIES: Record<string, Reply[]> = {
  p1: [
    { id: 'r1', postId: 'p1', userId: 'u7', userName: 'Sana Ali', content: 'Try Zara PG near gate 3 — they allow entry till midnight and it is decent.', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 'r2', postId: 'p1', userId: 'u8', userName: 'Dev Patel', content: 'Sunrise Residency allows till 11 PM. The warden is understanding.', createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
    { id: 'r3', postId: 'p1', userId: 'u9', userName: 'Meera Joshi', content: 'DM me, I know a place!', createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
  ],
  p2: [
    { id: 'r4', postId: 'p2', userId: 'u10', userName: 'Kabir Singh', content: 'I am in! DM me your number.', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
    { id: 'r5', postId: 'p2', userId: 'u11', userName: 'Ananya Roy', content: 'Me too, count me in!', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
  ],
  p3: [],
  p4: [],
  p5: [],
}

// ── Accommodation ─────────────────────────────────────────────────────────────

export const MOCK_ACCOMMODATIONS: PaginatedResponse<Accommodation> = paginated([
  {
    id: 'a1', userId: 'u3', userName: 'Arjun Sharma',
    title: 'Furnished Room near Gate 3',
    address: 'Jamia Nagar, Gate 3',
    description: 'Furnished room in a shared flat. 2 mins walk to main gate. Wi-Fi included.',
    amount: 5500, cityId: 32, communityId: 1, subCommunityId: null,
    type: 0, isNegotiable: true, availableFrom: '2024-01-01', gender: 1,
    isConnected: true, mutualFriends: 4,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a2', userId: 'u5', userName: 'Rahul Gupta',
    title: '2BHK Flat – Flatmate Wanted',
    address: 'Okhla, Phase 1',
    description: '2BHK flat. Looking for a flatmate. Separate rooms available. 10 min commute to campus.',
    amount: 8000, cityId: 32, communityId: 1, subCommunityId: null,
    type: 1, isNegotiable: false, availableFrom: '2024-01-15', gender: 0,
    isConnected: false, mutualFriends: 2,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a3', userId: 'u12', userName: 'Neha Saxena',
    title: 'Single Occupancy PG – Females Only',
    address: 'Batla House',
    description: 'Single occupancy PG, meals included, AC room, 24/7 water supply.',
    amount: 6000, cityId: 32, communityId: 1, subCommunityId: null,
    type: 0, isNegotiable: false, availableFrom: '2024-02-01', gender: 2,
    isConnected: false, mutualFriends: 1,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a4', userId: 'u13', userName: 'Mohammad Irfan',
    title: 'Budget Hostel near Campus',
    address: 'Zakir Nagar',
    description: 'Budget hostel, 5 min walk to campus. Common kitchen and TV room available.',
    amount: 3500, cityId: 32, communityId: 1, subCommunityId: null,
    type: 0, isNegotiable: true, availableFrom: '2024-01-01', gender: 1,
    isConnected: true, mutualFriends: 6,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
])

// ── Proxy Services ────────────────────────────────────────────────────────────

export const MOCK_PROXY: PaginatedResponse<ProxyListing> = paginated([
  {
    id: 'x1',
    userId: 'u6',
    userName: 'Zara Khan',
    serviceType: 'Errand',
    chargePerTask: 80,
    location: 'On Campus',
    description: 'I can pick up printouts, canteen food, or stationery for you. Quick and reliable.',
    isConnected: false,
    mutualFriends: 3,
    availableUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'x2',
    userId: 'u14',
    userName: 'Vikram Rao',
    serviceType: 'Tutoring',
    chargePerTask: null,
    chargeRange: '₹200 – ₹400 / session',
    location: 'Library / Online',
    description: 'Offering tutoring for Mathematics (B.Tech level), Data Structures and Algorithms. 2 years experience.',
    isConnected: true,
    mutualFriends: 5,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'x3',
    userId: 'u15',
    userName: 'Aisha Bano',
    serviceType: 'Photography',
    chargePerTask: 500,
    location: 'Campus / Nearby',
    description: 'Portrait and event photography. DSLR camera. DM me for portfolio samples.',
    isConnected: false,
    mutualFriends: 1,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'x4',
    userId: 'u16',
    userName: 'Sahil Verma',
    serviceType: 'Delivery',
    chargePerTask: 50,
    location: 'Jamia Nagar & Okhla',
    description: 'Have a bike. Can deliver food, parcels, or documents within 5km of campus.',
    isConnected: true,
    mutualFriends: 8,
    availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
])

// ── Marketplace ───────────────────────────────────────────────────────────────

export const MOCK_MARKETPLACE: PaginatedResponse<MarketplaceListing> = paginated([
  {
    id: 'm1',
    userId: 'u4',
    userName: 'Priya Nair',
    itemType: 'Books',
    itemName: 'Data Structures by Narasimha Karumanchi',
    price: 250,
    priceNegotiable: true,
    location: 'On Campus',
    description: 'Good condition, minimal highlighting. Useful for placements and B.Tech exams.',
    isConnected: false,
    mutualFriends: 2,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'm2',
    userId: 'u17',
    userName: 'Rohan Kapoor',
    itemType: 'Electronics',
    itemName: 'Boat Airdopes 141 TWS Earbuds',
    price: 700,
    priceNegotiable: false,
    location: 'Jamia Nagar',
    description: 'Used for 3 months, works perfectly. Selling because I got AirPods. Comes with original box.',
    isConnected: true,
    mutualFriends: 7,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'm3',
    userId: 'u18',
    userName: 'Divya Menon',
    itemType: 'Furniture',
    itemName: 'Study Table with Bookshelf',
    price: 1800,
    priceNegotiable: true,
    location: 'Okhla Phase 2',
    description: 'Solid wood study table with attached bookshelf. Selling as I am moving out of the city.',
    isConnected: false,
    mutualFriends: 0,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'm4',
    userId: 'u19',
    userName: 'Hamza Sheikh',
    itemType: 'Electronics',
    itemName: 'Casio FX-991EX Scientific Calculator',
    price: 400,
    priceNegotiable: false,
    location: 'On Campus',
    description: 'Barely used. Perfect for engineering and science students. Original bill available.',
    isConnected: true,
    mutualFriends: 3,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
])
