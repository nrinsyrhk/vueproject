//***************************************************************************************************************************************** */
//                                                  Keycloak 22 admin api                                                                   //
//***************************************************************************************************************************************** */
const keycloakConfig = require("./keycloakConfig")
let keycloakAdminAPi =   {
    getAccessToken: `${keycloakConfig['auth-server-url']}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
    getUserToken: `${keycloakConfig['auth-server-url']}/realms/${keycloakConfig.realm2}/protocol/openid-connect/token`,
    registerWithTempPassword: `${keycloakConfig['auth-server-url']}/admin/realms/${keycloakConfig.realm2}/users`,
    registerWithPassword: `${keycloakConfig['auth-server-url']}/admin/realms/${keycloakConfig.realm2}/users`,
    searchUser: `${keycloakConfig['auth-server-url']}/admin/realms/${keycloakConfig.realm2}/users?search=`,
    searchUsername: `${keycloakConfig['auth-server-url']}/admin/realms/${keycloakConfig.realm2}/users?username=`,
}
module.exports = keycloakAdminAPi;