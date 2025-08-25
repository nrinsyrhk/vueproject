require('dotenv').config();
const keycloakConfig = {
    realm: process.env.KEYCLOAK_REALM,
    realm2: process.env.KEYCLOAK_REALM2,
    'auth-server-url': process.env.KEYCLOAK_AUTH_SERVER_URL,
    'ssl-required': process.env.KEYCLOAK_SSL_REQUIRED,
    resource: process.env.KEYCLOAK_RESOURCE,
    'bearer-only': true,
}

module.exports = keycloakConfig