# 🚀 NeoSpend - Complete AWS Amplify Deployment Guide

## 📋 **Prerequisites Checklist**

### ✅ **Backend Must Be Deployed First**
- [ ] AWS SAM backend is deployed and running
- [ ] API Gateway URL is available
- [ ] Cognito User Pool is configured
- [ ] DynamoDB tables are created

### ✅ **Required Information**
- [ ] API Gateway URL: `https://jwb4pqyt4e.execute-api.ap-south-1.amazonaws.com/prod`
- [ ] Cognito User Pool ID: `ap-south-1_iZLrzxuJs`
- [ ] Cognito Client ID: `64sna9dpaatssavs22n27up8ji`
- [ ] Cognito Client Secret: `5n2hpeotdbi03jai356l4kb2r0th43kdht35jhf7snvovdd2gu6`
- [ ] Cognito Issuer: `https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_iZLrzxuJs`

---

## 🎯 **Step-by-Step Amplify Deployment**

### **Step 1: Connect GitHub Repository**

1. **Go to AWS Amplify Console**
   - Navigate to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click **"New app"** → **"Host web app"**

2. **Connect Repository**
   - Select **"GitHub"** as source
   - Authorize GitHub if needed
   - Select repository: **`nishith-geedh/NeoSpend`**
   - Select branch: **`main`**

### **Step 2: Configure Build Settings**

The build settings are already configured in `amplify.yml`, but verify:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - cd frontend
        - npm run build
  artifacts:
    baseDirectory: frontend/.next
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
      - frontend/.next/cache/**/*
```

### **Step 3: Set Environment Variables**

In Amplify Console, add these environment variables:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=https://main.d1234567890.amplifyapp.com
NEXTAUTH_SECRET=TEI4exhmWHiS9IgGz2IA+Dk8eYH5GUPmjLd5LDuqEqs=

# AWS Cognito Configuration
COGNITO_CLIENT_ID=64sna9dpaatssavs22n27up8ji
COGNITO_CLIENT_SECRET=5n2hpeotdbi03jai356l4kb2r0th43kdht35jhf7snvovdd2gu6
COGNITO_ISSUER=https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_iZLrzxuJs
COGNITO_USER_POOL_ID=ap-south-1_iZLrzxuJs

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://jwb4pqyt4e.execute-api.ap-south-1.amazonaws.com/prod
```

**⚠️ Important**: Update `NEXTAUTH_URL` with your actual Amplify domain after deployment.

### **Step 4: Deploy**

1. **Review Settings**
   - Verify build settings
   - Check environment variables
   - Confirm repository connection

2. **Start Deployment**
   - Click **"Save and deploy"**
   - Wait for build to complete (5-10 minutes)

### **Step 5: Update Cognito Callback URLs**

After deployment, update Cognito callback URLs:

1. **Go to AWS Cognito Console**
2. **Select User Pool**: `ap-south-1_iZLrzxuJs`
3. **Go to App Integration** → **App client settings**
4. **Update Callback URLs**:
   ```
   https://main.d1234567890.amplifyapp.com/api/auth/callback/cognito
   ```
5. **Update Sign-out URLs**:
   ```
   https://main.d1234567890.amplifyapp.com
   ```

### **Step 6: Update Environment Variables**

1. **Go back to Amplify Console**
2. **App Settings** → **Environment Variables**
3. **Update NEXTAUTH_URL** with your actual domain:
   ```
   NEXTAUTH_URL=https://main.d1234567890.amplifyapp.com
   ```
4. **Redeploy** the application

---

## 🔧 **Troubleshooting**

### **Build Failures**
- Check build logs in Amplify Console
- Verify Node.js version (should be 18.x)
- Ensure all dependencies are in package.json

### **Authentication Issues**
- Verify Cognito callback URLs are updated
- Check environment variables are set correctly
- Ensure NEXTAUTH_URL matches your domain

### **API Connection Issues**
- Verify API Gateway URL is correct
- Check CORS settings in API Gateway
- Ensure Lambda functions are deployed

### **Environment Variables Not Loading**
- Check variable names match exactly
- Ensure no extra spaces or quotes
- Redeploy after changing variables

---

## 🎉 **Post-Deployment Checklist**

- [ ] Application loads without errors
- [ ] Login/signup works with Cognito
- [ ] Dashboard displays correctly
- [ ] Expenses can be added/edited/deleted
- [ ] Budgets can be created and tracked
- [ ] Analytics charts display data
- [ ] All pages are responsive
- [ ] Dark/light theme toggle works

---

## 📱 **Access Your Application**

After successful deployment, your NeoSpend application will be available at:
```
https://main.d1234567890.amplifyapp.com
```

Replace `d1234567890` with your actual Amplify app ID.

---

## 🔄 **Future Updates**

To update your application:
1. Push changes to GitHub `main` branch
2. Amplify will automatically trigger a new deployment
3. Monitor build logs for any issues

---

**🎯 Your NeoSpend application will be live and fully functional on AWS Amplify!**
