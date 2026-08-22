/* =========================================================
   SOMEONE HAS SENT YOU A COOKIE!
   COOKIE LAB — GMAIL API VERCEL SERVERLESS FUNCTION
   ========================================================= */

const { google } = require("googleapis");


/* =========================================================
   ESCAPE MESSAGE HTML
   ========================================================= */

function escapeHtml(value = "") {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;")
        .replaceAll("\n", "<br>");

}


/* =========================================================
   PARSE BASE64 IMAGE
   ========================================================= */

function parseImage(data, filename) {

    if (
        !data ||
        typeof data !== "string"
    ) {
        return null;
    }

    const match =
        data.match(
            /^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/s
        );

    if (!match) {
        return null;
    }

    const mime =
        match[1] === "image/jpg"
            ? "image/jpeg"
            : match[1];

    return {

        content:
            match[2],

        filename:
            filename,

        content_type:
            mime

    };

}


/* =========================================================
   BASE64URL ENCODE
   Gmail requires URL-safe base64 for the raw message.
   ========================================================= */

function base64UrlEncode(value) {

    return Buffer
        .from(value, "utf8")
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");

}


/* =========================================================
   WRAP BASE64 FOR MIME
   ========================================================= */

function wrapBase64(base64) {

    return base64
        .replace(/\s/g, "")
        .match(/.{1,76}/g)
        ?.join("\r\n") || "";

}


/* =========================================================
   MIME HEADER ENCODING
   Allows emoji in subject safely.
   ========================================================= */

function encodeMimeHeader(value) {

    return `=?UTF-8?B?${Buffer
        .from(value, "utf8")
        .toString("base64")}?=`;

}


/* =========================================================
   CREATE MIME EMAIL
   ========================================================= */

function createMimeMessage({
    to,
    from,
    subject,
    html,
    packed,
    cookie
}) {

    const mixedBoundary =
        "CookieLabMixed_" +
        Date.now();

    const relatedBoundary =
        "CookieLabRelated_" +
        Math.random()
            .toString(36)
            .slice(2);


    /* =====================================================
       HTML PART
       ===================================================== */

    const htmlBase64 =
        Buffer
            .from(html, "utf8")
            .toString("base64");


    /* =====================================================
       MIME MESSAGE
       ===================================================== */

    const mime = [

        `From: ${from}`,

        `To: ${to}`,

        `Subject: ${encodeMimeHeader(subject)}`,

        "MIME-Version: 1.0",

        `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`,

        "",

        `--${mixedBoundary}`,

        `Content-Type: multipart/related; boundary="${relatedBoundary}"`,

        "",


        /* =================================================
           HTML
        ================================================= */

        `--${relatedBoundary}`,

        "Content-Type: text/html; charset=UTF-8",

        "Content-Transfer-Encoding: base64",

        "",

        wrapBase64(htmlBase64),

        "",


        /* =================================================
           PACKED COOKIE IMAGE
        ================================================= */

        `--${relatedBoundary}`,

        `Content-Type: ${packed.content_type}; name="${packed.filename}"`,

        "Content-Transfer-Encoding: base64",

        "Content-Disposition: inline",

        "Content-ID: <packed-cookie>",

        "",

        wrapBase64(packed.content),

        "",


        /* =================================================
           FINAL COOKIE IMAGE
        ================================================= */

        `--${relatedBoundary}`,

        `Content-Type: ${cookie.content_type}; name="${cookie.filename}"`,

        "Content-Transfer-Encoding: base64",

        "Content-Disposition: inline",

        "Content-ID: <final-cookie>",

        "",

        wrapBase64(cookie.content),

        "",

        `--${relatedBoundary}--`,

        "",


        /* =================================================
           END RELATED / START OUTER
        ================================================= */

        `--${mixedBoundary}--`,

        ""

    ].join("\r\n");


    return mime;

}


/* =========================================================
   VERCEL FUNCTION
   ========================================================= */

module.exports = async function handler(req, res) {

    console.log("🍪 Cookie Lab Gmail API called");


    /* =====================================================
       METHOD
       ===================================================== */

    if (req.method !== "POST") {

        return res.status(405).json({

            error:
                "Method not allowed. Use POST."

        });

    }


    try {

        /* =================================================
           REQUEST BODY
           ================================================= */

        const {
            to,
            message,
            packetImage,
            cookieImage
        } =
            req.body || {};


        console.log(
            "Recipient:",
            to
        );

        console.log(
            "Packet image:",
            !!packetImage
        );

        console.log(
            "Cookie image:",
            !!cookieImage
        );


        /* =================================================
           CHECK GOOGLE ENVIRONMENT VARIABLES
           ================================================= */

        if (
            !process.env.GOOGLE_CLIENT_ID ||
            !process.env.GOOGLE_CLIENT_SECRET ||
            !process.env.GOOGLE_REFRESH_TOKEN
        ) {

            console.error(
                "❌ Google OAuth environment variables are missing."
            );

            return res.status(500).json({

                error:
                    "Google Gmail configuration is missing in Vercel."

            });

        }


        /* =================================================
           VALIDATE EMAIL
           ================================================= */

        if (
            !to ||
            typeof to !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)
        ) {

            return res.status(400).json({

                error:
                    "Please enter a valid email address."

            });

        }


        /* =================================================
           CREATE PACKAGE IMAGE
           ================================================= */

        const packed =
            parseImage(
                packetImage,
                "packed-cookie.png"
            );


        /* =================================================
           CREATE COOKIE IMAGE
           ================================================= */

        const cookie =
            parseImage(
                cookieImage,
                "final-cookie.png"
            );


        /* =================================================
           VALIDATE PACKAGE
           ================================================= */

        if (!packed) {

            return res.status(400).json({

                error:
                    "Packed package image was not received."

            });

        }


        /* =================================================
           VALIDATE COOKIE
           ================================================= */

        if (!cookie) {

            return res.status(400).json({

                error:
                    "Final cookie image was not received."

            });

        }


        /* =================================================
           SAFE MESSAGE
           ================================================= */

        const safeMessage =
            escapeHtml(
                message ||
                "♡ A little cookie for you ♡"
            );


        /* =================================================
           EMAIL HTML
           ================================================= */

        const html = `

<!DOCTYPE html>

<html>

<head>

<meta
    http-equiv="Content-Type"
    content="text/html; charset=UTF-8"
>

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>
    A little cookie for you
</title>

</head>


<body style="
    margin:0;
    padding:0;
    background:#f7f1ec;
    font-family:Arial,Helvetica,sans-serif;
    color:#60483e;
">


<table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        width:100%;
        margin:0;
        padding:0;
        background:#f7f1ec;
    "
>

<tr>

<td
    align="center"
    style="
        padding:35px 15px;
    "
>


<table
    role="presentation"
    width="620"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        width:100%;
        max-width:620px;
        background:#fffdfb;
        border-radius:26px;
        overflow:hidden;
    "
>


<!-- HEADER -->

<tr>

<td
    align="center"
    style="
        padding:30px 28px 22px;
    "
>

<div style="
    font-size:42px;
    line-height:1;
">

🍪

</div>


<h1 style="
    margin:10px 0 5px;
    color:#4c372f;
    font-size:26px;
    line-height:1.2;
    font-weight:700;
">

A little cookie for you ♡

</h1>


<p style="
    margin:0;
    color:#a18c83;
    font-size:13px;
    line-height:1.5;
">

...Someone made this especially for you...

</p>

</td>

</tr>


<!-- PACKAGE -->

<tr>

<td
    align="center"
    style="
        padding:0 24px;
    "
>

<img
    src="cid:packed-cookie"
    alt="Your Cookie Lab package"
    width="560"
    style="
        display:block;
        width:100%;
        max-width:560px;
        height:auto;
        margin:0 auto;
        border:0;
        border-radius:20px;
    "
>

</td>

</tr>


<!-- MESSAGE -->

<tr>

<td
    align="center"
    style="
        padding:20px 40px 5px;
    "
>

<div style="
    color:#b08c78;
    font-size:11px;
    letter-spacing:1.5px;
    text-transform:uppercase;
    font-weight:bold;
    margin-bottom:8px;
">

A little note ♡

</div>


<div style="
    color:#694a3c;
    font-size:15px;
    line-height:1.65;
">

${safeMessage}

</div>

</td>

</tr>


<!-- SPACE -->

<tr>

<td
    style="
        height:30px;
        line-height:30px;
        font-size:1px;
    "
>

&nbsp;

</td>

</tr>


<!-- COOKIE -->

<tr>

<td
    align="center"
    style="
        padding:0 28px;
    "
>

<div style="
    color:#9b8378;
    font-size:13px;
    font-weight:bold;
    line-height:1.5;
    margin-bottom:15px;
">

And here's what's inside ♡

</div>


<img
    src="cid:final-cookie"
    alt="The cookie inside your package"
    width="430"
    style="
        display:block;
        width:100%;
        max-width:430px;
        height:auto;
        margin:0 auto;
        border:0;
        border-radius:20px;
    "
>

</td>

</tr>


<!-- FOOTER -->

<tr>

<td
    align="center"
    style="
        padding:32px 28px 28px;
    "
>

<div style="
    color:#b09a91;
    font-size:11px;
    line-height:1.5;
">

♡ Made with love in theshartechclub's cookie studio ♡

</div>

</td>

</tr>


</table>

</td>

</tr>

</table>


</body>

</html>

`;


        /* =================================================
           CREATE GOOGLE OAUTH CLIENT
           ================================================= */

        const oauth2Client =
            new google.auth.OAuth2(

                process.env.GOOGLE_CLIENT_ID,

                process.env.GOOGLE_CLIENT_SECRET

            );


        oauth2Client.setCredentials({

            refresh_token:
                process.env.GOOGLE_REFRESH_TOKEN

        });


        /* =================================================
           CREATE GMAIL CLIENT
           ================================================= */

        const gmail =
            google.gmail({

                version:
                    "v1",

                auth:
                    oauth2Client

            });


        /* =================================================
           CREATE MIME MESSAGE
           ================================================= */

        const mimeMessage =
            createMimeMessage({

                to:
                    to,

                from:
                    "Cookie Lab <theshartechclub@gmail.com>",

                subject:
                    "🍪 A little cookie for you ♡",

                html:
                    html,

                packed:
                    packed,

                cookie:
                    cookie

            });


        /* =================================================
           GMAIL SEND
           ================================================= */

        const gmailResponse =
            await gmail.users.messages.send({

                userId:
                    "me",

                requestBody: {

                    raw:
                        base64UrlEncode(
                            mimeMessage
                        )

                }

            });


        /* =================================================
           SUCCESS
           ================================================= */

        const messageId =
            gmailResponse?.data?.id;


        console.log(
            "🍪 COOKIE SENT THROUGH GMAIL!"
        );

        console.log(
            "Gmail Message ID:",
            messageId
        );


        return res.status(200).json({

            success:
                true,

            id:
                messageId

        });


    }

    catch (error) {

        console.error(
            "❌ COOKIE GMAIL API ERROR:",
            error
        );


        return res.status(500).json({

            error:
                error.message ||
                "Something went wrong while sending the cookie."

        });

    }

};