const { google } = require("googleapis");

module.exports = async function handler(req, res) {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).send("Missing Google authorization code.");
        }

        const redirectUri =
            "https://theshartechclub-cookielab.vercel.app/api/auth/callback";

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUri
        );

        const { tokens } = await oauth2Client.getToken({
            code: code,
            redirect_uri: redirectUri
        });

        if (!tokens.refresh_token) {
            return res.status(500).send(
                "Google did not return a refresh token. Please revoke Cookie Lab access and authorize it again."
            );
        }

        console.log("Google authorization successful.");

        return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Cookie Lab Gmail Connected</title>
            </head>

            <body style="
                font-family: Arial, sans-serif;
                text-align: center;
                padding-top: 80px;
            ">

                <h1>🍪 Gmail connected!</h1>

                <p>
                    Google authorization was successful.
                </p>

                <p>
                    The Gmail account has been authorized for Cookie Lab.
                </p>

                <p>
                    You can close this window.
                </p>

            </body>
            </html>
        `);

    } catch (error) {
        console.error("Google OAuth Callback Error:", error);

        return res.status(500).send(`
            <h1>Google authorization failed 😭</h1>
            <p>${error.message}</p>
        `);
    }
};