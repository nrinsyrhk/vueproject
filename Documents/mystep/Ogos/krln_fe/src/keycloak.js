import Keycloak from "keycloak-js";
const url = import.meta.env.VITE_KEYCLOAK_AUTH_SERVER_URL
const realm = import.meta.env.VITE_KEYCLOAK_REALM
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID

const keycloak = new Keycloak({
  url: url,
  realm: realm,
  clientId: clientId,
});

const initKeycloak = () => {
    return keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256',
      flow: 'standard',
    })
    .then(authenticated => {
      console.log("Keycloak initialized:", authenticated);
    })
    .catch(err => {
      console.error("Keycloak init failed:", err);
    });
  };
export { keycloak, initKeycloak };
