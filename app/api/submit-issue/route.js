import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// For Next.js App Router, we need to export this config
export const dynamic = 'force-dynamic';

const issueTypeLabels = {
  charging_session: 'Charging session issues',
  payment: 'Payment issues',
  autocharge: 'Autocharge issue',
  rfid: 'RFID issue',
  account_validation: 'Account validation issues',
  inaccurate_position: 'Inaccurate charger position on the map',
  unavailable_charger: 'Charger is not available/unfunctional',
  damaged_charger: 'Damaged charger/connector',
  wrong_power_capacity: 'Wrong Charger Power Capacity in the App',
  wrong_connector_type: 'Wrong Connector Type in the App',
  wrong_price_info: 'Missing/Wrong price information in the App',
  other: 'Other issue'
};

export async function POST(request) {
  try {
    // Since we're using FormData in the client, we can directly access it
    const formData = await request.formData();
    
    // Extract form fields
    const operator = formData.get('operator');
    const issueType = formData.get('issueType');
    const otherIssueDescription = formData.get('otherIssueDescription');
    const chargerLabel = formData.get('chargerLabel');
    const chargerLocation = formData.get('chargerLocation');
    const connectorType = formData.get('connectorType');
    const email = formData.get('email');
    const phoneNumber = formData.get('phoneNumber');
    const dateOfIssue = formData.get('dateOfIssue');
    const stationId = formData.get('stationId');
    const name = formData.get('name');
    const location = formData.get('location');
    const description = formData.get('description');
    const consent = formData.get('consent');
    const fileCount = parseInt(formData.get('fileCount') || '0');

    // Get the issue type label
    const issueTypeLabel = issueTypeLabels[issueType] || 'Unknown Issue Type';

    // Generate ticket number: operator-YYYYMMDD-randomNumber
    const date = new Date(dateOfIssue);
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ''); // Format: YYYYMMDD
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    const ticketNumber = `${operator || 'XX'}-${dateStr}-${randomNum}`;

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@example.com',
        pass: process.env.EMAIL_PASSWORD || 'your-password',
      },
    });

    // Prepare email attachments
    const attachments = [];
    
    // Process file uploads
    for (let i = 0; i < fileCount; i++) {
      const file = formData.get(`file${i}`);
      if (file && file instanceof Blob) {
        const buffer = Buffer.from(await file.arrayBuffer());
        attachments.push({
          filename: file.name || `attachment-${i + 1}.${file.type.split('/')[1] || 'png'}`,
          content: buffer,
          contentType: file.type || 'application/octet-stream',
        });
      }
    }

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: process.env.EMAIL_TO || 'support@eldrive.eu',
      replyTo: email,
      subject: `Issue Type (${operator}): ${issueTypeLabel} - Ticket #${ticketNumber}`,
      text: `
Ticket Number: ${ticketNumber}

Issue Type: ${issueTypeLabel}
${issueType === 'other' ? `Other Issue Description: ${otherIssueDescription || 'Not provided'}\n` : ''}
${chargerLabel ? `Charger Label: ${chargerLabel}\n` : ''}${chargerLocation ? `Charger Location: ${chargerLocation}\n` : ''}${connectorType ? `Connector Type: ${connectorType}\n` : ''}
Email Address: ${email}
Phone number: ${phoneNumber || 'Not provided'}
Date of Issue: ${dateOfIssue}
Station ID: ${stationId || 'Not provided'}
Name: ${name || 'Not provided'}
Location: ${location || 'Not provided'}

Describe the Issue:
${description}

${attachments.length > 0 ? `Attachments: ${attachments.length} file(s) attached\n` : ''}

From AMPECO
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #2196f3; color: white; padding: 15px; text-align: center; margin-bottom: 20px; border-radius: 4px;">
    <h2 style="margin: 0;">Ticket #${ticketNumber}</h2>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee; width: 150px;"><strong>Issue Type:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">
        <span style="display: inline-block; padding: 4px 8px; background-color: #e3f2fd; color: #1e88e5; border-radius: 4px; font-size: 14px;">
          ${issueTypeLabel}
        </span>
      </td>
    </tr>
    ${issueType === 'other' ? `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Other Issue Description:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${otherIssueDescription || 'Not provided'}</td>
    </tr>
    ` : ''}
    ${chargerLabel ? `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Charger Label:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${chargerLabel}</td>
    </tr>
    ` : ''}
    ${chargerLocation ? `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Charger Location:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${chargerLocation}</td>
    </tr>
    ` : ''}
    ${connectorType ? `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Connector Type:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${connectorType}</td>
    </tr>
    ` : ''}
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee; width: 150px;"><strong>Email Address:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone number:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${phoneNumber || 'Not provided'}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date of Issue:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${dateOfIssue}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Station ID:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${stationId || 'Not provided'}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${name || 'Not provided'}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Location:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${location || 'Not provided'}</td>
    </tr>
    ${attachments.length > 0 ? `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Attachments:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${attachments.length} file(s) attached</td>
    </tr>
    ` : ''}
  </table>
  
  <h3 style="color: #555;">Issue Description</h3>
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-top: 20px;">
    <p style="white-space: pre-line; margin: 0;">${description}</p>
  </div>
  
  <div style="margin-top: 20px; padding: 10px; border-left: 4px solid #2196f3; background-color: #e3f2fd;">
    <p style="margin: 0; font-size: 14px;">
      <strong>From AMPECO</strong>
    </p>
  </div>
</div>
      `,
      attachments,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Issue reported successfully', messageId: info.messageId, ticketNumber },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}
