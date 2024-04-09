import express from "express";
import User from "../models/user.js";
import Subscription from "../models/subscription.js";
import { errorResponse, successReponse } from "../../utils/response_format.js";
import { TransporterService } from "../services/transporter.js";
import dotenv from "dotenv";

dotenv.config();
const generateToken = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  const length = 50; // Length of the token

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }

  return token;
};

const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: "Weather <huyy.802@gmail.com>",
    to: email,
    subject: "Weather - Xác minh địa chỉ email",
    html: `<!DOCTYPE html>
        <html>
        <head>
        
          <meta charset="utf-8">
          <meta http-equiv="x-ua-compatible" content="ie=edge">
          <title>Email Confirmation</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
          /**
           * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
           */
          /* @media screen {
            @font-face {
              font-family: 'Source Sans Pro';
              font-style: normal;
              font-weight: 400;
              src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
            }
            @font-face {
              font-family: 'Source Sans Pro';
              font-style: normal;
              font-weight: 700;
              src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
            }
          } */
          /**
           * Avoid browser level font resizing.
           * 1. Windows Mobile
           * 2. iOS / OSX
           */
          body,
          table,
          td,
          a {
            -ms-text-size-adjust: 100%; /* 1 */
            -webkit-text-size-adjust: 100%; /* 2 */
          }
          /**
           * Remove extra space added to tables and cells in Outlook.
           */
          table,
          td {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
          }
          /**
           * Better fluid images in Internet Explorer.
           */
          img {
            -ms-interpolation-mode: bicubic;
          }
          /**
           * Remove blue links for iOS devices.
           */
          a[x-apple-data-detectors] {
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            text-decoration: none !important;
          }
          /**
           * Fix centering issues in Android 4.4.
           */
          div[style*="margin: 16px 0;"] {
            margin: 0 !important;
          }
          body {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /**
           * Collapse table borders to avoid space between cells.
           */
          table {
            border-collapse: collapse !important;
          }
          a {
            color: #1a82e2;
          }
          img {
            height: auto;
            line-height: 100%;
            text-decoration: none;
            border: 0;
            outline: none;
          }
          </style>
        
        </head>
        <body style="background-color: #e9ecef;">
        
          <!-- start preheader -->
          <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
          👋Để hoàn tất đăng ký, chúng tôi cần xác minh địa chỉ email của bạn.
          </div>
          <!-- end preheader -->
        
          <!-- start body -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
        
            <!-- start logo -->
            <tr>
              <td align="center" bgcolor="#e9ecef">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end logo -->
        
            <!-- start hero -->
            <tr>
              <td align="center" bgcolor="#e9ecef">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                      <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Xác minh địa chỉ email của bạn</h1>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end hero -->
        
            <!-- start copy block -->
            <tr>
              <td align="center" bgcolor="#e9ecef">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                
        
                  <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                      <div style="display: flex; align-items: center;">    
                        <p style="margin: 0;">Xin chào</p>
                        <img src="https://raw.githubusercontent.com/ABSphreak/ABSphreak/master/gifs/Hi.gif" alt="Hi" style="width: 30px; height: 30px; margin-right: 0px;">
                        <p style="margin: 0;">,</p>
                      </div>
                      <p style="margin: 0;">Click vào link dưới để xác nhận subscription.</p>
                    </td>
                  </tr>
                  
                  <!-- end copy -->
                  <!-- start button -->
                  <tr>
                    <td align="left" bgcolor="#ffffff">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                              <td style="font-size: 15px; padding: 14px 32px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;text-align: center; border-radius: 19px; display: block; border: 3px solid #e9ecef; background: 0% repeat #ffffff;">
                                <span style="font-size: 26px; line-height: 21px; color: #ffffff;">
                                  <span style="font-weight: 700; margin-left: 0px; margin-right: 0px;">${process.env.BASE_URL}subscription/confirm-email/${verificationToken}</span>
                                </span>
                              </td>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- end button -->
        
                  <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                      <p style="margin: 0;">Nếu hành động này không phải của bạn, vui lòng xóa email này hoặc liên hệ với chúng tôi.</p>
                    </td>
                  </tr>
                  <!-- end copy -->
        
                  <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                      <p style="margin: 0;">Thân ái./.<br>Weather</p>
                    </td>
                  </tr>
                  <!-- end copy -->
        
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end copy block -->
        
            <!-- start footer -->
            <tr>
              <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
        
                  <!-- start permission -->
                  <tr>
                    <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 20px; color: #666;">
                      <p style="margin: 0;">Bạn nhận được email này vì chúng tôi đã nhận được yêu cầu xác thực cho tài khoản của bạn. Nếu bạn không phải người yêu cầu xác thực này, xin vui lòng trả lời email này để thông báo cho chúng tôi.</p>
                    </td>
                  </tr>
                  <!-- end permission -->
        
                  <!-- start unsubscribe -->
                  <tr>
                    <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 11px; line-height: 20px; color: #666;">
                      <p style="margin: 0;">Linh Trung Ward, Thu Duc City, Ho Chi Minh City</p>
                      <p style="margin: 0;">© 2024 Huy Weather</p>
                    </td>
                  </tr>
                  <!-- end unsubscribe -->
        
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end footer -->
        
          </table>
          <!-- end body -->
        
        </body>
        </html>`,
  };
  TransporterService.transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return false;
    } else {
      console.log(
        `Verification email sent to ${email} with token: ${verificationToken}`
      );
      return true;
    }
  });
};

export const SubscriptionController = {
  sendVerificationEmail: async (req, res) => {
    try {
      const { email, location } = req.body;

      const existingSubscription = await Subscription.findOne({ email });

      if (!existingSubscription) {
        const existingUser = await User.findOne({ email });
        const verificationToken = generateToken();
        if (!existingUser) {
          const newUser = await User.create({
            email: email,
            location: location,
          });
          newUser.verificationToken = verificationToken;
          await newUser.save();
        } else {
          existingUser.location = location;
          existingUser.verificationToken = verificationToken;
          await existingUser.save();
        }
        await sendVerificationEmail(email, verificationToken);
        res
          .status(200)
          .json({ message: "Verification email sent successfully" });
      } else {
        res.status(400).json({ error: "Email is already registered" });
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  confirmEmail: async (req, res) => {
    try {
      const { verificationToken } = req.params;
      console.log(verificationToken);
      const user = await User.findOne({ verificationToken });

      if (!user) {
        throw new Error("Invalid verification token");
      }
      user.emailVerified = true;
      user.verificationToken = null;
      await user.save();
      await Subscription.create({ email: user.email, location: user.location });
      // res.status(200).json(successReponse("Email confirmed successfully"));
      const successMessage = `
            <html>
            <head>
                <title>Email Confirmation</title>
            </head>
            <body>
                <h1>Confirmation Successful</h1>
                <p>You will now receive weather updates via email every day.</p>
            </body>
            </html>
        `;

      res.status(200).send(successMessage);
    } catch (error) {
      console.error("Error confirming email:", error);
      res.status(500).json(errorResponse(500, "Internal Server Error"));
    }
  },
  unsubscribe: async (req, res) => {
    try {
      const { verificationToken } = req.params;
      const subscription = await Subscription.findOne({ verificationToken });

      if (subscription) {
        await Subscription.findOneAndDelete({ verificationToken });
        const successMessage = `
                <html>
                <head>
                    <title>Unsubscription Successful</title>
                </head>
                <body>
                    <h1>Unsubscription Successful</h1>
                    <p>You have successfully unsubscribed from weather updates.</p>
                </body>
                </html>
            `;
        res.status(200).send(successMessage);
      } else {
        res.status(404).json({ error: "Subscription not found" });
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
