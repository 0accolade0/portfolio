const { google } = require("googleapis");

module.exports = async function handler(req, res) {
    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

        const redirectUri =
            "https://theshartechclub-cookielab.vercel.app/api/auth/callback";

        if (!clientId || !clientSecret) {
            return res.status(500).send(
                "Google OAuth environment variables are missing."
            );
        }

        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
        );

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/gmail.send"
            ]
        });

        return res.redirect(authUrl);

    } catch (error) {
        console.error("Google Auth Error:", error);

        return res.status(500).send(
            "Failed to start Google authentication: " +
            error.message
        );
    }
};