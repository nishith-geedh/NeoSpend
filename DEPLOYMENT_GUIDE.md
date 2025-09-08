# NeoSpend Deployment Guide

## 🚀 **DEPLOYMENT ORDER: Backend First, Then Frontend**

### **PHASE 1: Backend Deployment (CRITICAL - DO THIS FIRST)**

#### **Step 1: Deploy Backend Infrastructure**
```bash
cd backend
sam build
sam deploy
```

**What this creates:**
- DynamoDB tables: `NeoSpend-Expenses`, `NeoSpend-Budgets`, `NeoSpend-Categories`
- Lambda functions for all CRUD operations
- API Gateway with endpoints
- IAM roles and permissions

#### **Step 2: Get API Gateway URL**
After deployment, note the API Gateway URL from the output:
`https://abc123.execute-api.ap-south-1.amazonaws.com/Prod`

#### **Step 3: Create Environment File**
Create `frontend/.env.local` with:
```env
# AWS Cognito Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# AWS Cognito User Pool
COGNITO_CLIENT_ID=h6p99ffulekmkt7m69creatqt
COGNITO_CLIENT_SECRET=your-cognito-client-secret-here
COGNITO_ISSUER=https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_ABC123DEF
COGNITO_USER_POOL_ID=ap-south-1_ABC123DEF

# API Gateway URL (Update this after backend deployment)
NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.execute-api.ap-south-1.amazonaws.com/Prod
```

### **PHASE 2: Frontend Deployment**

#### **Step 1: Deploy to AWS Amplify**
1. Go to AWS Amplify Console
2. Connect your GitHub repository
3. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd frontend
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: frontend/.next
       files:
         - '**/*'
     cache:
       paths:
         - frontend/node_modules/**/*
   ```

#### **Step 2: Set Environment Variables in Amplify**
Add the same environment variables from `.env.local` in Amplify console.

### **PHASE 3: Testing**

#### **Test Backend APIs**
```bash
# Test expenses endpoint
curl -X GET https://your-api-gateway-url/expenses \
  -H "Authorization: Bearer your-jwt-token"

# Test budgets endpoint
curl -X GET https://your-api-gateway-url/budgets \
  -H "Authorization: Bearer your-jwt-token"
```

#### **Test Frontend**
1. Visit your Amplify URL
2. Test login with Cognito
3. Add/edit/delete expenses
4. Verify data is stored in DynamoDB

## 🔧 **Manual AWS Console Steps**

### **1. DynamoDB Tables (Created by SAM)**
- `NeoSpend-Expenses`
- `NeoSpend-Budgets` 
- `NeoSpend-Categories`

### **2. Lambda Functions (Created by SAM)**
- `NeoSpend-ExpensesFunction`
- `NeoSpend-BudgetsFunction`
- `NeoSpend-CategoriesFunction`
- `NeoSpend-AnalyticsFunction`

### **3. API Gateway (Created by SAM)**
- REST API with endpoints for all operations
- CORS enabled
- Authentication via Cognito

### **4. Amplify Hosting**
- Connect GitHub repository
- Configure build settings
- Set environment variables

## 📊 **Current Project Status**

### ✅ **COMPLETED:**
- User Authentication (AWS Cognito + NextAuth)
- Frontend Dashboard (React/Next.js with modern UI)
- Expense Management (Add/edit/delete)
- Budget Management (Set limits, track usage)
- Analytics (Basic charts and visualizations)
- Currency (All amounts in rupees)
- UI/UX (Modern, animated, gradient design)

### 🔄 **IN PROGRESS:**
- Backend API deployment
- DynamoDB integration
- Real data connection

### ❌ **PENDING:**
- Advanced analytics with Chart.js
- Spending limit alerts
- Production deployment
- Documentation

## 🎯 **Next Steps**

1. **Deploy backend** (sam deploy)
2. **Update API URL** in frontend
3. **Deploy frontend** to Amplify
4. **Test end-to-end** functionality
5. **Add advanced features** (alerts, better charts)

## 💡 **Why Backend First?**

- Frontend is already built and ready
- Backend provides the data layer
- Can test APIs independently
- Frontend needs real data to function properly
- Easier to debug issues step by step
