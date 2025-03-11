# Eldrive Issue Report Form

A Next.js application that provides a form for users to report issues with Eldrive services. The form includes validation and directly sends emails upon submission without requiring a separate backend service.

## Features

- Modern UI built with Material UI components
- Form validation using React Hook Form and Yup
- Email sending functionality using Nodemailer
- Responsive design
- Detailed user guidance and instructions

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nextjs-report-form
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables for email configuration:
```
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@eldrive.com
EMAIL_TO=support@eldrive.com
```

### Development

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the form.

### Building for Production

Build the application for production:
```bash
npm run build
# or
yarn build
```

Start the production server:
```bash
npm run start
# or
yarn start
```

## Email Configuration

The application uses Nodemailer to send emails. You need to configure the email settings in the `.env.local` file:

- `EMAIL_HOST`: SMTP server host (e.g., smtp.gmail.com)
- `EMAIL_PORT`: SMTP server port (usually 587 for TLS or 465 for SSL)
- `EMAIL_SECURE`: Set to 'true' for port 465, 'false' for other ports
- `EMAIL_USER`: Your email username/address
- `EMAIL_PASSWORD`: Your email password or app password
- `EMAIL_FROM`: The sender email address
- `EMAIL_TO`: The recipient email address (where issue reports will be sent)

### Using Gmail

If you're using Gmail, you'll need to:
1. Enable 2-Step Verification for your Google account
2. Create an App Password for the application
3. Use that App Password in the `EMAIL_PASSWORD` field

## Form Fields

The form includes the following fields:
- Name (required)
- Email (required, must be valid email format)
- Issue Title (required, 5-100 characters)
- Description (required, minimum 20 characters)
- Priority (required, dropdown: Low/Medium/High)
- Category (required, dropdown: Bug Report/Feature Request/Improvement/Other)

## Customization

You can customize the form by modifying the `components/ReportIssueForm.js` file. The styling uses a combination of Material UI components and Emotion styled components.

## Deployment

### Vercel Deployment (Recommended)

1. Create a [Vercel account](https://vercel.com/signup) if you don't have one
2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy your application:
   ```bash
   vercel
   ```

5. Add environment variables in the Vercel dashboard:
   - Go to your project settings
   - Navigate to the "Environment Variables" section
   - Add all the required email configuration variables from your `.env.local` file

### Netlify Deployment

1. Create a [Netlify account](https://app.netlify.com/signup)
2. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Login to Netlify:
   ```bash
   netlify login
   ```

4. Deploy your application:
   ```bash
   netlify deploy
   ```

5. Configure environment variables:
   - Go to your site settings in the Netlify dashboard
   - Navigate to "Build & deploy" → "Environment"
   - Add all the required email configuration variables

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| EMAIL_HOST | SMTP server host | smtp.gmail.com |
| EMAIL_PORT | SMTP server port | 587 |
| EMAIL_SECURE | Use TLS | false |
| EMAIL_USER | SMTP username | your-email@example.com |
| EMAIL_PASSWORD | SMTP password or app-specific password | your-password |
| EMAIL_FROM | Sender email address | noreply@example.com |
| EMAIL_TO | Support email address | support@example.com |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

A Next.js web application for reporting issues with charging stations. The form includes dynamic fields based on the issue type and sends formatted email notifications with ticket numbers.

## Features

- Dynamic form fields based on issue type
- Email notifications with HTML and plain text formats
- Ticket number generation with operator code and date
- Form validation and error handling
- Modern, responsive UI
- Conditional fields for different issue types
- Support for multiple operators (RO/LT/BG)

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- SMTP server credentials for email notifications

## Installation

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd report-issue-web-form
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your email configuration:
   ```env
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@example.com
   EMAIL_PASSWORD=your-app-specific-password
   EMAIL_FROM=noreply@example.com
   EMAIL_TO=support@example.com
   ```
