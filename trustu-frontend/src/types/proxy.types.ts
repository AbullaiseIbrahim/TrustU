export interface ProxyListing {
  id: string
  userId: string
  userName: string
  serviceType: string
  chargePerTask: number | null
  chargeRange?: string
  location: string
  description: string
  isConnected: boolean
  mutualFriends: number
  availableUntil?: string
  createdAt: string
}

export type CreateProxyPayload = Omit<
  ProxyListing,
  'id' | 'userId' | 'userName' | 'isConnected' | 'mutualFriends' | 'createdAt'
>
