# AWS Amplify Deployment Guide for NeoSpend

This guide will help you deploy the NeoSpend frontend to AWS Amplify.

## Prerequisites

- AWS Account with appropriate permissions
- GitHub repository with your NeoSpend code
- Backend already deployed using AWS SAM

## Step 1: Connect Repository to Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your NeoSpend repository
5. Choose the main branch
6. Click "Next"

## Step 2: Configure Build Settings

1. In the "Build settings" section, select "Use a buildspec YAML file"
2. The `amplify.yml` file is already configured in the frontend directory
3. Click "Next"

## Step 3: Configure Environment Variables

Add the following environment variables in the Amplify console:

### Required Environment Variables:

```
NEXTAUTH_URL=https://your-amplify-domain.amplifyapp.com
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.execute-api.ap-south-1.amazonaws.com/Prod
COGNITO_CLIENT_ID=your-cognito-client-id
COGNITO_CLIENT_SECRET=your-cognito-client-secret
COGNITO_ISSUER=https://cognito-idp.ap-south-1.amazonaws.com/your-user-pool-id
NEXT_PUBLIC_APP_URL=https://your-amplify-domain.amplifyapp.com
```

### How to find these values:

1. **NEXTAUTH_SECRET**: Generate a random string (32+ characters)
2. **NEXT_PUBLIC_API_BASE_URL**: From your SAM deployment outputs
3. **COGNITO_CLIENT_ID**: From your SAM deployment outputs
4. **COGNITO_CLIENT_SECRET**: From your SAM deployment outputs
5. **COGNITO_ISSUER**: From your SAM deployment outputs

## Step 4: Update Cognito User Pool Settings

1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
2. Find your NeoSpend User Pool
3. Go to "App integration" → "Domain"
4. Update callback URLs to include your Amplify domain:
   - Add: `https://your-amplify-domain.amplifyapp.com/api/auth/callback/cognito`
5. Update logout URLs:
   - Add: `https://your-amplify-domain.amplifyapp.com`

## Step 5: Deploy

1. Click "Save and deploy" in Amplify
2. Wait for the build to complete (5-10 minutes)
3. Your app will be available at the provided Amplify URL

## Step 6: Custom Domain (Optional)

1. In Amplify console, go to "Domain management"
2. Click "Add domain"
3. Enter your custom domain
4. Follow the DNS configuration instructions
5. Update Cognito settings with your custom domain

## Troubleshooting

### Build Failures
- Check that all environment variables are set correctly
- Verify that the `amplify.yml` file is in the frontend directory
- Check the build logs for specific errors

### Authentication Issues
- Ensure Cognito callback URLs include your Amplify domain
- Verify that environment variables match your backend configuration
- Check that the Cognito User Pool is in the same region

### API Connection Issues
- Verify that your API Gateway is deployed and accessible
- Check that CORS is properly configured for your Amplify domain
- Ensure Lambda functions have proper permissions

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| NEXTAUTH_URL | Your Amplify app URL | https://main.d1234567890.amplifyapp.com |
| NEXTAUTH_SECRET | Random secret for NextAuth | your-32-char-secret-string |
| NEXT_PUBLIC_API_BASE_URL | Your API Gateway URL | https://abc123.execute-api.ap-south-1.amazonaws.com/Prod |
| COGNITO_CLIENT_ID | Cognito App Client ID | abc123def456ghi789 |
| COGNITO_CLIENT_SECRET | Cognito App Client Secret | your-client-secret |
| COGNITO_ISSUER | Cognito User Pool Issuer URL | https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_ABC123DEF |

## Post-Deployment

1. Test all functionality:
   - User registration/login
   - Expense tracking
   - Budget management
   - Analytics dashboard
2. Monitor CloudWatch logs for any errors
3. Set up monitoring and alerts as needed

Your NeoSpend application is now live on AWS Amplify! 🚀