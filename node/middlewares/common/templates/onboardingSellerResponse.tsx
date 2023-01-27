const onboardingSellerResponse = `

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:v="urn:schemas-microsoft-com:vml">

<head>
  <!--[if mso]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>ar
      </o:OfficeDocumentSettings>
    </xml>
  <![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <!-- So that mobile webkit will display zoomed in -->
  <meta name="format-detection" content="telephone=no" />
  <!-- disable auto telephone linking in iOS -->
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!--<![endif]-->
  <title>{{_accountInfo.TradingName}}</title>
  <style type="text/css">
    /****** Client Specific Styles Start ******/
    /****** Outlook.com / Hotmail
      ******/
    .ExternalClass {
      width: 100%;
    }

    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height: 100%;
    }

    /****** “Read in Browser” Link
      ******/
    #outlook a {
      padding: 0;
    }

    /****** <table> Element Spacing ******/
    table {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    /****** Image
      Resizing ******/
    img {
      -ms-interpolation-mode: bicubic;
    }

    /****** Prevent
      WebKit and Windows Mobile changing default text sizes ******/
    body {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    /******
      Client Specific Styles End ******/
    body {
      -webkit-text-size-adjust: none;
      -ms-text-size-adjust: none;
    }

    body {
      margin: 0;
      padding: 0;
    }

    table td {
      border-collapse: collapse;
    }

    .yshortcuts a {
      border-bottom: none !important;
    }
  </style>
</head>

<body marginwidth="0" marginheight="0" style="padding:0; color: #1a1a1a;" leftmargin="0" topmargin="0">
  <!-- 100% wrapper (grey background) -->
  <table width="100%" cellspacing="0" border="0" bgcolor="#fff">
    <tbody>
      <tr>
        <td valign="top" align="center"
          style="background-color: #ffffff; color:#1a1a1a; font-family: Arial, sans-serif !important; border-spacing: 0;">
          <!-- 600px container (white background) -->
          <table cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;">
            <tbody>
              <tr>
                <td align="center"
                  style="padding-top: 8%; padding-bottom: 4.75%; padding-left: 16px; padding-right: 16px;
                    background-color: grey; background-size:100% auto; background-repeat: no-repeat;">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0"
                    style="border-spacing: 0; max-width: 426px;">
                    <tbody>
                      <tr>
                        <td align="left">
                          <a href="" target="_blank" title="Your Account Marketplace"
                            style="display: block;">
                            <img src="" alt="Your Logo"
                              style="display:block" width="150" height="29" />
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center"
                  style="padding-top: 32px; padding-bottom: 40px; padding-left: 16px; padding-right: 16px;">
                  <table cellspacing="0" cellpadding="0" border="0" align="center"
                    style="border-spacing: 0; max-width: 426px;">
                    <tbody>
                      <tr>
                        <td style="font-size: 18px; font-weight: bold; line-height: 20px; padding-bottom: 10px;">
                          Salut!
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; padding-bottom: 16px; line-height: 22px;">
                          {{#if isSoft}}
                          Ne bucurăm mult că ai completat toți acești pași
                          pentru a te înscrie pe platforma Your Account
                          Marketplace. Momentan, cereara ta a fost refuzată.
                          {{else}}
                          Echipa noastră a analizat cererea ta de înscriere
                          pe Your Account Marketplace și se pare că nu au fost
                          întrunite toate criteriile. Colegii noștri au
                          sesizat următorul motiv:
                          {{/if}}
                        </td>
                      </tr>
                      {{#if message}}
                      <tr>
                        <td align="center" style="padding-bottom: 20px;">
                          <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center"
                            style="border-spacing: 0; padding-top: 12px; padding-bottom: 12px; padding-left: 16px; padding-right: 16px; background-color: #F5F5F5">
                            <tbody>
                              <tr>
                                <td style="font-style: italic; font-weight: bold;">
                                  {{message}}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      {{/if}}
                      {{#if isSoft}}
                      <tr>
                        <td style="font-size: 14px; line-height: 22px;">
                          Nu-i nimic, poți să mai completezi încă o dată
                          formularul aici. Stai fără grijă, restul datelor
                          au fost salvate.
                        </td>
                      </tr>
                      <tr>
                        <td aria-hidden="true" height="32" style="font-size: 0; line-height: 0;">
                          &nbsp;
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <a href="{{formURL}}" title="FORMULAR"
                            style="display: inline-block; text-decoration: none; border-radius: 6px;  border-top: 9px solid #7531D6; border-bottom: 9px solid #7531D6; border-left: 64px solid #7531D6; border-right: 64px solid #7531D6;
                              border-style: solid; font-size: 11px; line-height: 15px; color: #ffffff; background-color: #7531D6;">FORMULAR</a>
                        </td>
                      </tr>
                      {{else}}
                      <tr>
                        <td style="font-size: 14px; line-height: 22px;">
                          Din păcate, refuzul este final, iar procesul nu
                          poate fi reluat. Îți mulțumim mult pentru
                          înțelegere și îți urăm mult succes în continuare!
                        </td>
                      </tr>
                      {{/if}}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center"
                  style="background-color: grey; padding-top: 12px; padding-bottom: 10px; padding-left: 16px; padding-right: 16px;
                background-image:'';background-size: auto 100%; background-repeat: no-repeat; background-position: center bottom;">
                  <table cellspacing="0" cellpadding="0" border="0" align="center"
                    style="border-spacing: 0; max-width: 426px;">
                    <tbody>
                      <tr>
                        <td align="center">
                          <table cellspacing="0" cellpadding="0" border="0" align="center" style="border-spacing: 0;">
                            <tbody>
                              <tr>
                                <td width="31">
                                  <a title="Facebook" target="_blank" href="https://www.facebook.com/"
                                    style="text-decoration: none;">
                                    <img src="https://{account}.vteximg.com.br/arquivos/facebook.png" width="17"
                                      height="17" alt="Icon" />
                                  </a>
                                </td>
                                <td width="31">
                                  <a title="Instagram" target="_blank" href="https://www.instagram.com/"
                                    style="text-decoration: none;">
                                    <img src="https://{account}.vteximg.com.br/arquivos/instagram.png" width="17"
                                      height="17" alt="Icon" />
                                  </a>
                                </td>
                                <td width="31">
                                  <a title="Linkedin" target="_blank" href="https://www.linkedin.com/company/"
                                    style="text-decoration: none;">
                                    <img src="https://{account}.vteximg.com.br/arquivos/linkedin.png" width="17"
                                      height="17" alt="Icon" />
                                  </a>
                                </td>
                                <td>
                                  <a title="Telegram" target="_blank" href="https://telegram.org/"
                                    style="text-decoration: none;">
                                    <img src="https://{account}.vteximg.com.br/arquivos/telegram.png" width="17"
                                      height="17" alt="Icon" />
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center"
                          style="padding-top: 5px; font-size: 8px !important; line-height: 1.5 !important;">
                          {Your Account} Online SA. Toate drepturile rezervate.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
  <!--/600px container -->
  <!--/100% wrapper-->
</body>
</html>
`
export default onboardingSellerResponse
