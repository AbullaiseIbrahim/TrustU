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
    detail: (id: string | number) => `/communities/${id}`,
    members: (id: string | number) => `/communities/${id}/members`,
    subMembers: (subId: string | number) => `/communities/sub/${subId}/members`,
    join: (id: string | number) => `/communities/${id}/join`,
    leave: (id: string | number) => `/communities/${id}/leave`,
  },
  posts: {
    list: () => '/posts',
    create: () => '/posts',
    detail: (id: string | number) => `/posts/${id}`,
    update: (id: string | number) => `/posts/${id}`,
    delete: (id: string | number) => `/posts/${id}`,
    like: (id: string | number) => `/posts/${id}/like`,
    unlike: (id: string | number) => `/posts/${id}/unlike`,
    comments: (id: string | number) => `/posts/${id}/comments`,
    createComment: (id: string | number) => `/posts/${id}/comments`,
    deleteComment: (commentId: string | number) => `/posts/comments/${commentId}`,
  },
  amenities: {
    list: () => '/amenities',
  },
} as const;
