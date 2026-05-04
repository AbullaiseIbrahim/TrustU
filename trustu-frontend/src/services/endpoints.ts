// Central endpoint registry — all API path builders live here.

export const ENDPOINTS = {
  auth: {
    login: () => '/login',
    register: () => '/register',
    logout: () => '/logout',
  },
  otp: {
    send: () => '/otp/send',
    verify: () => '/otp/verify',
    resend: () => '/otp/resend',
  },
  profile: {
    me: () => '/user/profile',
    update: () => '/user/profile',   // POST — route only supports GET/POST, not PUT
  },
  accommodation: {
    list: () => '/accommodations',
    userList: () => '/accommodations/user',
    detail: (id: string | number) => `/accommodations/${id}/info`,
    create: () => '/accommodations',
    update: () => '/accommodations',          // PUT with id in body
    delete: (id: string | number) => `/accommodations/${id}`,
  },
  friends: {
    list: () => '/friends',
    pending: () => '/friends/pending',
    mutual: (userId: string | number) => `/friends/mutual/${userId}`,
    sendRequest: (userId: string | number) => `/friends/request/${userId}`,
    accept: (id: string | number) => `/friends/accept/${id}`,
    reject: (id: string | number) => `/friends/reject/${id}`,
    remove: (userId: string | number) => `/friends/${userId}`,
  },
  community: {
    list: () => '/communities',
    join: (id: string | number) => `/communities/${id}/join`,
    leave: (id: string | number) => `/communities/${id}/leave`,
  },
  posts: {
    list: () => '/posts',
    create: () => '/posts',
    detail: (id: string | number) => `/posts/${id}`,
    delete: (id: string | number) => `/posts/${id}`,
    upvote: (id: string | number) => `/posts/${id}/upvote`,
    replies: (id: string | number) => `/posts/${id}/replies`,
    createReply: (id: string | number) => `/posts/${id}/replies`,
  },
  proxy: {
    list: () => '/proxy',
    userList: () => '/proxy/user',
    detail: (id: string | number) => `/proxy/${id}`,
    create: () => '/proxy',
    delete: (id: string | number) => `/proxy/${id}`,
  },
  marketplace: {
    list: () => '/marketplace',
    userList: () => '/marketplace/user',
    detail: (id: string | number) => `/marketplace/${id}`,
    create: () => '/marketplace',
    update: (id: string | number) => `/marketplace/${id}`,
    delete: (id: string | number) => `/marketplace/${id}`,
  },
} as const;
