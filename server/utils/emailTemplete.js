// defaultTemplates.js

const defaultTemplates = [
  {
    name: 'registration-verification-code',
    subject: 'Confirm Your Account: Verification Code Inside',
    category: 'verification',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Verification</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <div style="background-color: #4CAF50; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 26px;">Welcome to {{companyName}} 🌱</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <h2 style="color: #4CAF50;">Hello {{firstName}},</h2>
          
          <p>Thank you for registering! To activate your account and begin your journey, please use the following 6-digit code on the verification screen.</p>
          
          <div style="margin: 25px 0; text-align: center;">
            <p style="font-size: 14px; color: #666; margin-bottom: 5px;">Your Unique Leader ID:</p>
            <p style="font-size: 18px; font-weight: bold; color: #000;">{{uniqueUserId}}</p>

            <p style="font-size: 14px; color: #666; margin-top: 20px; margin-bottom: 5px;">Your Verification Code:</p>
            <div style="background-color: #E8F5E9; color: #1B5E20; padding: 15px 25px; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; display: inline-block;">
              {{verificationCode}}
            </div>
          </div>
          
          <p>This code is valid for <b>{{expiryMinutes}} minutes</b>. If you did not request this, please ignore this email.</p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            You are receiving this because you signed up for an account with {{companyName}}.
            <br>© {{currentYear}} {{companyName}}. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `,
    textContent: `
      Welcome to {{companyName}}!

      Hello {{firstName}},

      Thank you for registering! To activate your account, please use the following details:

      Your Unique Leader ID: {{uniqueUserId}}
      Your Verification Code: {{verificationCode}}

      This code is valid for {{expiryMinutes}} minutes. If you did not request this, please ignore this email.

      © {{currentYear}} {{companyName}}. All rights reserved.
    `,
    variables: [
      { name: 'firstName', description: 'The first name of the user', required: true },
      { name: 'uniqueUserId', description: 'The unique permanent ID assigned to the user (LDR-XXX-ORG)', required: true },
      { name: 'verificationCode', description: 'The temporary 6-digit code for verification', required: true },
      { name: 'expiryMinutes', description: 'The number of minutes before the verification code expires (e.g., 10)', required: true },
      { name: 'companyName', description: 'The name of your organization/platform', required: true },
      { name: 'currentYear', description: 'The current year (e.g., 2025)', required: true }
    ]
  },
  {
    name: 'welcome-onboarding',
    subject: 'Welcome to {{companyName}}! You Are Ready to Lead',
    category: 'welcome',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to {{companyName}}</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <div style="background-color: #007bff; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 26px;">Your Journey Starts Now! 🚀</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <h2 style="color: #007bff;">Hello {{firstName}},</h2>
          
          <p>Your account is now fully verified and active. You are officially part of the {{organizationName}} community!</p>

          <p>Here are your account details:</p>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px;">👤 <b>Your Role:</b> <span style="font-weight: bold; color: #333;">{{role}}</span></li>
            <li style="margin-bottom: 10px;">🆔 <b>Leader ID:</b> <span style="font-weight: bold; color: #333;">{{uniqueUserId}}</span></li>
          </ul>
          
          <p>Ready to start earning Eco-Points? Click below to explore your first learning path:</p>

          <div style="text-align: center; margin: 25px 0;">
            <a href="{{loginUrl}}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            If you have any questions, please reply to this email.
            <br>© {{currentYear}} {{companyName}}. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `,
    textContent: `
      Welcome to {{companyName}}!

      Hello {{firstName}},

      Your account is now fully verified and active. You are officially part of the {{organizationName}} community!

      Your Role: {{role}}
      Leader ID: {{uniqueUserId}}

      Ready to start earning Eco-Points? Go to your dashboard: {{loginUrl}}

      © {{currentYear}} {{companyName}}. All rights reserved.
    `,
    variables: [
      { name: 'firstName', description: 'The first name of the user', required: true },
      { name: 'organizationName', description: 'The name of the user’s organization (e.g., School or Club)', required: true },
      { name: 'uniqueUserId', description: 'The unique permanent ID assigned to the user', required: true },
      { name: 'role', description: 'The user’s assigned role (e.g., Student, Team Leader)', required: true },
      { name: 'loginUrl', description: 'URL to the application dashboard/login page', required: true },
      { name: 'companyName', description: 'The name of your platform', required: true },
      { name: 'currentYear', description: 'The current year', required: true }
    ]
  },

  {
    name: 'team-invitation-code',
    subject: 'You Are Invited to Join the {{teamName}} Team!',
    category: 'team_invite_code',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Team Invitation</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <div style="background-color: #3F51B5; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 26px;">Team Up for Victory! 🏅</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <h2 style="color: #3F51B5;">Hi {{firstName}},</h2>
          
          <p>You have been invited by <b>{{inviterName}}</b> to join the competitive team:</p>
          <h3 style="text-align: center; color: #333; margin: 15px 0;">{{teamName}} (Organization: {{organizationName}})</h3>

          <p>To join the team and contribute your Eco-Score, use the unique code below in the "Join Team" section of the app:</p>

          <div style="margin: 25px 0; text-align: center;">
            <p style="font-size: 14px; color: #666; margin-bottom: 5px;">Your Team Join Code:</p>
            <div style="background-color: #E8EAF6; color: #1A237E; padding: 15px 25px; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; display: inline-block;">
              {{teamCode}}
            </div>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="{{appUrl}}/join-team" style="background-color: #3F51B5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Join Team Now
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            If you did not expect this invitation, you can safely ignore this email.
          </p>
        </div>
      </body>
      </html>
    `,
    textContent: `
      Team Invitation from {{inviterName}}!

      Hi {{firstName}},

      You have been invited to join the team: {{teamName}} (Organization: {{organizationName}})

      To join, use this unique code in the "Join Team" section of the app:

      Team Code: {{teamCode}}

      Join Team URL: {{appUrl}}/join-team

      © {{currentYear}} {{companyName}}. All rights reserved.
    `,
    variables: [
      { name: 'firstName', description: 'The first name of the invited user', required: true },
      { name: 'inviterName', description: 'The name of the leader/instructor who sent the invitation', required: true },
      { name: 'teamName', description: 'The name of the team being invited to', required: true },
      { name: 'organizationName', description: 'The organization the team belongs to', required: true },
      { name: 'teamCode', description: 'The unique 6-digit code needed to join the team', required: true },
      { name: 'appUrl', description: 'The base URL for the application', required: true }
    ]
  },

  {
    name: 'generic-notification',
    subject: ' {{notificationSubject}}',
    category: 'notification',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>System Notification</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <div style="background-color: #FFC107; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="color: #333; margin: 0; font-size: 22px;">{{notificationSubject}}</h2>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <p>Hello {{firstName}},</p>
          
          <div style="background-color: #fff9e6; border-left: 4px solid #FFC107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0;">{{notificationBody}}</p>
          </div>
          
          <p>You can find more details in your dashboard:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="{{dashboardUrl}}" style="background-color: #FFC107; color: #333; padding: 10px 20px; text-decoration: none; border-radius: 20px; font-weight: bold; display: inline-block;">
              View Details
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated notification from {{companyName}}.
          </p>
        </div>
      </body>
      </html>
    `,
    textContent: `
      Notification: {{notificationSubject}}

      Hello {{firstName}},

      {{notificationBody}}

      View Details: {{dashboardUrl}}

      This is an automated notification from {{companyName}}.
    `,
    variables: [
      { name: 'firstName', description: 'The first name of the recipient', required: true },
      { name: 'notificationSubject', description: 'The subject line of the notification content', required: true },
      { name: 'notificationBody', description: 'The main content/message of the notification', required: true },
      { name: 'dashboardUrl', description: 'URL to the relevant section of the user dashboard', required: true },
      { name: 'companyName', description: 'The name of your platform', required: true }
    ]
  },
  {
    name: 'support-ticket-update',
    subject: 'Ticket Update: [{{ticketId}}] {{ticketSubject}}',
    category: 'support',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Support Ticket Update</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <div style="background-color: #607D8B; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 26px;">Support Update 🛠️</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <p>Dear {{firstName}},</p>
          
          <p>This is an update regarding your support request:</p>
          
          <ul style="color: #666; padding-left: 20px;">
            <li><b>Ticket ID:</b> {{ticketId}}</li>
            <li><b>Subject:</b> {{ticketSubject}}</li>
            <li><b>Current Status:</b> <span style="font-weight: bold; color: #E91E63;">{{ticketStatus}}</span></li>
          </ul>

          <h3 style="color: #607D8B; margin-top: 25px;">Latest Response:</h3>
          <div style="background-color: #f0f4f7; padding: 15px; border-radius: 5px;">
            <p>{{latestMessage}}</p>
          </div>
          
          <p>To view the full conversation or add a reply, please visit the ticket portal:</p>

          <div style="text-align: center; margin: 20px 0;">
            <a href="{{ticketUrl}}" style="background-color: #607D8B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 20px; font-weight: bold; display: inline-block;">
              View Ticket
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            {{companyName}} Support Team.
          </p>
        </div>
      </body>
      </html>
    `,
    textContent: `
      Support Ticket Update [{{ticketId}}]

      Dear {{firstName}},

      Your support ticket has been updated.
      
      Ticket ID: {{ticketId}}
      Subject: {{ticketSubject}}
      Current Status: {{ticketStatus}}

      Latest Response:
      {{latestMessage}}

      View Ticket: {{ticketUrl}}

      {{companyName}} Support Team.
    `,
    variables: [
      { name: 'firstName', description: 'The first name of the user', required: true },
      { name: 'ticketId', description: 'The unique support ticket reference number', required: true },
      { name: 'ticketSubject', description: 'The subject line of the original ticket', required: true },
      { name: 'ticketStatus', description: 'The current status (e.g., Open, Awaiting User Reply, Closed)', required: true },
      { name: 'latestMessage', description: 'The latest message/response from the support agent', required: true },
      { name: 'ticketUrl', description: 'Direct URL to view the ticket online', required: true },
      { name: 'companyName', description: 'The name of your platform', required: true }
    ]
  }
];

module.exports = { defaultTemplates };