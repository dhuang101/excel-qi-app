// this function controls the format of the email sent when an account is provisioned
export const createAccountProvisionedEmail = (email: string) => {
	return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Account Provisioned</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; line-height: 1.6;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                            
                            <tr>
                                <td align="center" style="padding: 30px 20px 20px 20px; border-bottom: 1px solid #eeeeee;">
                                    <h1 style="margin: 0; font-size: 24px; color: #333333;">Account Provisioning Notice</h1>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 40px 30px; color: #555555;">
                                    <p style="margin: 0 0 20px 0; font-size: 16px;">
                                        The following email address has been successfully provisioned with a new account on <strong>EXCEL QI</strong>.
                                    </p>
                                    
                                    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #007bff; background-color: #f7f9fc; padding: 15px; border-radius: 4px; text-align: center;">
                                        ${email} </p>

                                    <p style="margin-top: 30px; font-size: 14px; color: #888888;">
                                        This is an automated notification. Please ensure the new user is informed and provided with any necessary setup instructions.
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td align="center" style="padding: 20px 30px; border-top: 1px solid #eeeeee;">
                                    <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
                                        &copy; 2025 EXCEL QI. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                        </td>
                </tr>
            </table>
            </body>
        </html>
    `
}
