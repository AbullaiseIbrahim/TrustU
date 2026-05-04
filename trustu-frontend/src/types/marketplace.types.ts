export interface MarketplaceListing {
  id: string
  userId: string
  userName: string
  itemType: string
  itemName: string
  price: number
  priceNegotiable: boolean
  location: string
  description: string
  isConnected: boolean
  mutualFriends: number
  createdAt: string
}

export type CreateMarketplacePayload = Omit<
  MarketplaceListing,
  'id' | 'userId' | 'userName' | 'isConnected' | 'mutualFriends' | 'createdAt'
>
