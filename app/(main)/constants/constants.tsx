
export const apiUrls = {
    tenants: "/api/M365Tenant",
    domains: "/api/CheckListResult/Domains?tenantId=",
    checklists: "/api/CheckListResult/CheckListResults?tenantid=",
    globalAdmins: "/api/CheckListResult/GlobalAdmins?tenantId=",
    inactiveUsersLicenses: "/api/CheckListResult/InactiveUsersLicenses?tenantId=",
    inactiveUsers:"/api/CheckListResult/InactiveUsers?tenantId=",
    secureScore: '/api/CheckListResult/SecuritySecores?tenantId=',
    subscriptions: "/api/CheckListResult/ProductDetails?tenantId=",
    enableTenant: "/api/M365Tenant/Enable",
    disableTenant:"/api/M365Tenant/Disable",
};
  