const express = require('express');
const Keycloak = require('keycloak-connect');
const app = express.Router()
const keycloakConfig = require("../config/keycloakConfig")
const keycloak = new Keycloak(keycloakConfig);
const axios = require('axios');
const querystring = require('querystring');
const keycloakAdminAPi = require("../config/keycloakAdminApi")
app.use(keycloak.middleware());
require('dotenv').config();

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Load environment variables from .env file
//********************************************/
//         Register Keycloak middleware
//********************************************/
const adminCredentials = {
  client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
  grant_type: process.env.KEYCLOAK_GRANT_TYPE,
  client_id: process.env.KEYCLOAK_CLIENT_ID
};

//********************************************/
//  //Function to get access token for Admin Priviledges
//********************************************/
async function getAcsToken() {
  try {
    const response = await axios.post(
      keycloakAdminAPi.getAccessToken,
      querystring.stringify(adminCredentials),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Failed to retrieve access token:', error);
    throw error;
  }
}
//*********************************************************************************/
//              Get access token by refresh token
//*********************************************************************************/
app.post('/refreshACSToken', async (req, res) => {
  try {
    const rawData = req.body
    const userCredentials = {
      refresh_token: rawData.refresh_token,
      grant_type: "refresh_token",
      client_id: process.env.KEYCLOAKPS_CLIENT_ID
    };
    const response = await axios.post(keycloakAdminAPi.getUserToken, querystring.stringify(userCredentials),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    if (response.data && response.data.access_token) {
      res.status(200).json({ success: true, data: response.data, message: 'Access Token successfully refreshed.' });
    } else {
      res.status(404).json({ success: false, message: 'Fail to refresh Access Token!' });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: 'Fail to refresh Access Token!' });
  }
});
//*********************************************************************************/
//              Get token by users credentials
//*********************************************************************************/
app.post('/userauthtoken', async (req, res) => {
  try {
    const rawData = req.body

    const userCredentials = {
      username: rawData.username,
      password: rawData.password,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
      grant_type: process.env.KEYCLOAK_GRANT_TYPE,
      client_id: process.env.KEYCLOAK_CLIENT_ID
    };
    
    const response = await axios.post(keycloakAdminAPi.getUserToken, querystring.stringify(userCredentials),
   
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
   
    if (response.data && response.data.access_token) {
      res.status(200).json({ success: true, data: response.data, message: 'User Authentication successful.' });
    } else {
      res.status(404).json({ success: false, message: 'User Authentication unsuccessful!' });
    }

  } catch (error) {
     console.log(error);
    res.status(500).json({ success: false, message: 'Authentication unsuccessful!' });
  }
});
//*********************************************************** */
//          Registering new user at Keycloak with password
//********************************************************** */
app.post('/register', async (req, res) => {
  const rawData = req.body
  try {
    const accessToken = await getAcsToken();
    const status = axios
      .post(
        keycloakAdminAPi.registerWithPassword,
        {
          // Add the raw data here
          firstName: rawData.firstName,
          lastName: rawData.lastName,
          email: rawData.email,
          username: rawData.username,
          enabled: true,
          credentials: [
            {
              type: "password",
              value: rawData.Pass,
              temporary: false,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(response => {
        res.status(200).json({ success: true, message: 'User registered successfully.' });
      })
      .catch(response => {
        res.status(401).json({ success: false, message: 'An error occurred during registration.Either email or username exist' });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred during registration.', error });
  }
});
//******************************************************************************** */
//          Registering new user at Keycloak with temporary password settings
//******************************************************************************** */
app.post('/register/temp', async (req, res) => {
  const rawData = req.body
  try {

    const accessToken = await getAcsToken();
    axios
      .post(
        keycloakAdminAPi.registerWithTempPassword,
        {
          // Add the raw data here
          firstName: rawData.firstName,
          lastName: rawData.lastName,
          email: rawData.email,
          username: rawData.username,
          enabled: true,
          credentials: [
            {
              type: 'password',
              value: rawData.Pass,
              temporary: true,
            },
          ],
          requiredActions: ['UPDATE_PASSWORD'],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(response => {
        res.status(200).json({ success: true, message: 'User registered successfully.' });
      })
      .catch(error => {
        res.status(401).json({ success: false, message: 'An error occurred during registration.', error });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred during registration.' });
  }
});
//******************************************************************************** */
//              To search user by username, first or last name, or email using Admin-cli ACS Token
//******************************************************************************** */

/**
 * @swagger
 * /api/keycloak/user:
 *   post:
 *     summary: Search for a user using Keycloak API
 *     tags:
 *       - Keycloak
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *                 description: The search string for finding the user.
 *                 example: john_doe
 *     responses:
 *       200:
 *         description: User found or not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User found.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique identifier of the user
 *                         example: "abc123"
 *                       username:
 *                         type: string
 *                         description: Username of the user
 *                         example: john_doe
 *                       email:
 *                         type: string
 *                         description: Email address of the user
 *                         example: john_doe@example.com
 *       401:
 *         description: An error occurred during the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred.
 */

app.post('/user', async (req, res) => {
  const { search } = req.body;
  const accessToken = await getAcsToken();
  // Perform operations based on the userId parameter
try {
    axios
      .get(keycloakAdminAPi.searchUser + `${search}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        if (response.data.length == 0) {
          res.status(200).json({ success: false, message: 'User not found.', data: response.data });
        } else {
          res.status(200).json({ success: true, message: 'User found.', data: response.data });
        }
      });
  } catch (error) {
    res.status(401).json({ success: false, message: 'An error occurred.'});
  }
});
//*********************************************************************************/
//              Set up new password for the users
//*********************************************************************************/
app.post('/set-kata-laluan', async (req, res) => {
  const rawData = req.body
  const accessToken = await getAcsToken();
  //only for non AD users
  try {
    axios
      .put(
        `${keycloakConfig['auth-server-url']}/admin/realms/${keycloakConfig.realm2}/users/${rawData.user_id}/reset-password`,
        {
          type: 'password',
          value: rawData.value,
          temporary: rawData.temporary,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(response => {
        res.status(200).json({ success: true, message: 'User password has been update successfully.' });
      })
      .catch(error => {
        res.status(401).json({ success: false, message: 'An error occurred during update password.', error });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred during update password.' });
  }
});
//********************************************/
//        //Api to logout access token
//********************************************/
app.post('/delete-session/:idsesi', async (req, res) => {
  const idsesi = req.params.idsesi;
  const accessToken = await getAcsToken();
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${keycloakConfig['auth-server-url']}/admin/realms/${keycloakConfig.realm2}/users/${idsesi}/logout`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    }
  };
  try {
    axios.request(config)
      .then(response => {

        res.status(200).json({ success: true, message: 'User has been logout successfully.' });
      })
      .catch(error => {
        // console.log(error);
        res.status(401).json({ success: false, message: 'An error occurred during logout', error });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred during logout.', error });
  }
});
//********************************************/
//      Api to update profile user
//********************************************/
app.post('/email-update', async (req, res) => {
  const rawData = req.body
  try {
    const accessToken = await getAcsToken();
    const status = axios
      .put(
        keycloakAdminAPi.registerWithPassword + "/" + rawData.id_user,
        {
          // Add the raw data here
          email: rawData.email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(response => {
        res.status(200).json({ success: true, message: 'User email update successfully.' });
      })
      .catch(response => {
        res.status(401).json({ success: false, message: 'An error occurred during update!' });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred during update!', error });
  }
});
module.exports = app