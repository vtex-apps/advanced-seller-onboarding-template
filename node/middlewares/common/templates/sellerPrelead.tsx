const sellerPrelead = (marketplaceName: string) => { return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Puncte de fidelitate</title>
    <style type="text/css">
        /* /\/\/\/\/\/\/\/\/ CLIENT-SPECIFIC STYLES /\/\/\/\/\/\/\/\/ */

        #outlook a {
            padding: 0;
        }
        /* Force Outlook to provide a "view in browser" message */

        .ReadMsgBody {
            width: 100%;
        }

        .ExternalClass {
            width: 100%;
        }
        /* Force Hotmail to display emails at full width */

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }
        /* Force Hotmail to display normal line spacing */

        body,
        table,
        td,
        p,
        a,
        li,
        blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        /* Prevent WebKit and Windows mobile changing default text sizes */

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        /* Remove spacing between tables in Outlook 2007 and up */

        img {
            -ms-interpolation-mode: bicubic;
        }
        /* Allow smoother rendering of resized image in Internet Explorer */
        /* /\/\/\/\/\/\/\/\/ RESET STYLES /\/\/\/\/\/\/\/\/ */

        body {
            margin: 0;
            padding: 0;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse;
        }

        body,
        #bodyTable,
        #bodyCell {
            height: 100%;
            margin: 0;
            padding: 0;
            width: 100%;
        }
        /* /\/\/\/\/\/\/\/\/ TEMPLATE STYLES /\/\/\/\/\/\/\/\/ */

        body {
            background-color: #e6e6e6;
            font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
            font-size: 14px;
            color: #666666;
        }
        /* /\/\/\/\/\/\/\/\/ Gmail hack: /\/\/\/\/\/\/\/\/ */

        u+#new-gmail-hack {
            display: block !important;
        }
        /* /\/\/\/\/\/\/\/\/ yahoo hack: /\/\/\/\/\/\/\/\/ */

        table[align="center"] {
            margin: 0 auto;
        }

        @media only screen and (max-width: 480px) {
            .rwd-align {
                text-align: center !important;
                border-bottom: 1px solid #444444;
            }
            .col-half {
                width: 50% !important;
            }
        }
    </style>
</head>
<center>
    <div style="margin: 0; padding: 0; background-color:#e6e6e6;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;padding:0px;margin:0px;width:100%;">
            <tr>
                <td colspan="3" style="padding:0px;margin:0px;font-size:14px;height:20px;" height="20">&nbsp;</td>
            </tr>
            <tr>
                <td style="padding:0px;margin:0px;">&nbsp;</td>
                <td style="padding:0px;margin:0px;" width="600">
                    <!-- DONT EDIT ABOVE THIS LINE -->



                    <!-- EMAIL DESIGN START -->
                    <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="border-collapse: collapse;margin: 0 auto; max-width:600px; width: 100%;border: 1px solid #e6e6e6;width:100%;">

                        <!-- CONTENT START -->
                        <tr>
                            <td align="left" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;max-width:600px; width: 100%; background-color: #ffffff; color:#666666;">
                                    <tr>
                                        <td valign="top" align="left" style="padding-top:30px; padding-right:20px; padding-bottom:30px; padding-left:20px;">
                                            <div>
                                                <h2 style="color:#000000; display:block; font-size:18px; font-style:normal; font-weight: bold; text-align:left; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;">
                                                    Salut,
                                                </h2>

                                                <p style="color:#666666; display:block; font-size:14px; font-style:normal; line-height:18px; text-align:left; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; padding-top: 5px; padding-right: 0px; padding-bottom: 5px; padding-left: 0px;">
                                                    Ne bucurăm ca dorești să te alături comunității ` + marketplaceName + `.

                                                    Pentru a continua procesul de înregistrare este necesară completarea formularului ce poate fi accesat din linkul de mai jos. Mulțumim!
                                                </p>

                                                <h3 style="text-align:center;">
                                                    <a href={{formURL}}>Formular</a>
                                                </h3>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <!-- EMAIL DESIGN END -->


                    <!-- DONT EDIT BELOW THIS LINE -->
                </td>
                <td style="padding:0px;margin:0px;">&nbsp;</td>
            </tr>
            <tr>
                <td colspan="3" style="padding:0px;margin:0px;font-size:14px;height:20px;" height="20">&nbsp;</td>
            </tr>
        </table>
    </div>
</center>

</html>
`
}
export default sellerPrelead
