// ENDPOINTS keys
export const ENDPOINTS = {
    // auth
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    getMe: "/auth/me",
    registerAdmin: "/auth/register-admin",
    refreshToken: "/auth/refresh-token",
    forgotPassword: "/auth/forgot-password",
    verifyOTP: "/auth/verify-otp",
  
    // location
    getProvinceDistricts: "/location/province-districts",
  
    // leaders
    getAllLeaders: "/leaders/all",
    getLeaderboard: "/leaders/leaderboard",
    getLeaderDetail: "/leaders",  // GET /:id/detail (public)
    registerLeader: "/leaders/register",
    getLeaderStatus: "/leaders/status",
    searchLeaders: "/leaders/admin/search",
    getLeaderDetailForAdmin: "/leaders/admin",  // GET /:id/detail (protected)
    approveLeader: "/leaders/admin/approve",
    rejectLeader: "/leaders/admin/reject",
    updateLeaderTotalPoint: "/leaders/admin/update-total-point",
    exportLeaderboardCSV: "/leaders/admin/export-leaderboard-csv",
  
    // community events
    registerEvent: "/community-events/register",
    searchCommunityEvents: "/community-events/admin/search",
    getCommunityEventDetail: "/community-events/admin",  // GET /:id/detail (protected)
    approveCommunityEvent: "/community-events/admin/approve",
    rejectCommunityEvent: "/community-events/admin/reject",
  
    // partner gaming centers
    registerPartnerGamingCenter: "/partner-gaming-centers/register",
    getPartnerGamingCenterStatus: "/partner-gaming-centers/status",
    getPagingCurrentUserPartnerGamingCenter: "/partner-gaming-centers/my-gaming-centers",
    getPagingAllPartnerGamingCenters: "/partner-gaming-centers/all",
    getPartnerGamingCenterDetail: "/partner-gaming-centers",  // GET /:id (protected)
    updatePartnerGamingCenter: "/partner-gaming-centers",  // PUT /:id (protected)
    getPublicPartnerGamingCenterDetail: "/partner-gaming-centers/public",  // GET /:id (public)
    searchPartnerGamingCenters: "/partner-gaming-centers/admin/search",
    getPartnerGamingCenterDetailForAdmin: "/partner-gaming-centers/admin",  // GET /:id/detail (protected)
    approvePartnerGamingCenter: "/partner-gaming-centers/admin/approve",
    rejectPartnerGamingCenter: "/partner-gaming-centers/admin/reject",
  
    // events
    createEvent: "/events/admin/create",
    searchEvents: "/events/admin/search",
    getEventDetail: "/events/admin",
    updateEvent: "/events/admin",
    getPublicEvents: "/events/public", 
    getPublicEventDetail: "/events/public", // GET /:id (public)

    // accounts
    allAccounts: "/admin/findAll",
    findAccount: "/admin/find",
    allLogs: "/log/findAll",
    deleteAccount: "/admin/delete",
    toggleTwoFactorAuth: "/admin/toggle-2fa",
    changePassword: "/auth/reset-password",
    updateInfo: "/admin/update",
  
    // content
    findAllContentConfigsForAdmin: "/admin/content/find-all",
    updateContentConfigForAdmin: "/admin/content/update",
    findAllContentConfigsForPublic: "/contents/find-all",
  
    // campaigns
    addCampaign: "/admin/campaigns/create",
    updateCampaign: "/admin/campaigns/update",
    searchCampaigns: "/admin/campaigns/search",
    getCampaignDetail: "/admin/campaigns",
    findAllCampaigns: "/admin/campaigns/find-all",
  
    // notifications
    getNotifications: "/notifications",
    getUnreadNotificationCount: "/notifications/unread-count",
    markNotificationsAsRead: "/notifications/mark-read-multiple",
  };