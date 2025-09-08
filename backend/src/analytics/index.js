const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const EXPENSES_TABLE = process.env.EXPENSES_TABLE_NAME;
const BUDGETS_TABLE = process.env.BUDGETS_TABLE_NAME;

exports.handler = async (event) => {
  console.log('Analytics Lambda Event:', JSON.stringify(event, null, 2));
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }

  try {
    // Extract user ID from Cognito authorizer or Authorization header
    console.log('Full event:', JSON.stringify(event, null, 2));
    console.log('Request context:', JSON.stringify(event.requestContext, null, 2));
    console.log('Authorizer:', JSON.stringify(event.requestContext?.authorizer, null, 2));
    
    let userId = 'test-user-123';
    
    // Try to get user ID from authorizer first
    if (event.requestContext?.authorizer?.claims?.sub) {
      userId = event.requestContext.authorizer.claims.sub;
    } else if (event.headers?.Authorization) {
      // If no authorizer claims, try to extract from Authorization header
      const token = event.headers.Authorization.replace('Bearer ', '');
      try {
        // Decode JWT token to get user ID (without verification for now)
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        userId = payload.sub || 'test-user-123';
        console.log('Extracted user ID from token:', userId);
      } catch (error) {
        console.log('Error decoding token:', error);
        userId = 'test-user-123';
      }
    }
    
    console.log('Final User ID:', userId);

    // Get all expenses for user
    const expensesResult = await dynamodb.query({
      TableName: EXPENSES_TABLE,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();

    const expenses = expensesResult.Items || [];
    
    // Calculate analytics
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Monthly expenses (current month)
    const currentMonth = new Date().toISOString().substring(0, 7);
    const monthlyExpenses = expenses
      .filter(expense => expense.date.startsWith(currentMonth))
      .reduce((sum, expense) => sum + expense.amount, 0);

    // Category breakdown
    const categoryBreakdown = {};
    expenses.forEach(expense => {
      if (categoryBreakdown[expense.category]) {
        categoryBreakdown[expense.category].amount += expense.amount;
        categoryBreakdown[expense.category].count += 1;
      } else {
        categoryBreakdown[expense.category] = {
          name: expense.category,
          amount: expense.amount,
          count: 1
        };
      }
    });

    // Convert to array and calculate percentages
    const categoryBreakdownArray = Object.values(categoryBreakdown).map(category => ({
      ...category,
      percentage: totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0
    }));

    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().substring(0, 7);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const monthExpenses = expenses
        .filter(expense => expense.date.startsWith(monthKey))
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      monthlyTrend.push({
        month: monthName,
        amount: monthExpenses
      });
    }

    // Daily trend (last 7 days)
    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayKey = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayExpenses = expenses
        .filter(expense => expense.date === dayKey)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      dailyTrend.push({
        label: dayName,
        amount: dayExpenses
      });
    }

    // Weekly trend (last 4 weeks)
    const weeklyTrend = [];
    for (let i = 3; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      
      // Get start of week (Monday)
      const weekStart = new Date(date);
      const dayOfWeek = weekStart.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, Monday = 1
      weekStart.setDate(date.getDate() - daysToMonday);
      weekStart.setHours(0, 0, 0, 0);
      
      // Get end of week (Sunday)
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const weekExpenses = expenses
        .filter(expense => {
          const expenseDate = new Date(expense.date + 'T00:00:00');
          return expenseDate >= weekStart && expenseDate <= weekEnd;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      const weekLabel = i === 0 ? 'This Week' : `${i} week${i > 1 ? 's' : ''} ago`;
      
      weeklyTrend.push({
        label: weekLabel,
        amount: weekExpenses
      });
    }

    // Annual trend (last 4 years)
    const annualTrend = [];
    for (let i = 3; i >= 0; i--) {
      const date = new Date();
      date.setFullYear(date.getFullYear() - i);
      const yearKey = date.getFullYear().toString();
      
      const yearExpenses = expenses
        .filter(expense => expense.date.startsWith(yearKey))
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      annualTrend.push({
        label: yearKey,
        amount: yearExpenses
      });
    }

    // Top categories
    const topCategories = categoryBreakdownArray
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const analytics = {
      totalExpenses,
      monthlyExpenses,
      categoryBreakdown: categoryBreakdownArray,
      monthlyTrend: monthlyTrend.map(m => ({ label: m.month, amount: m.amount })),
      dailyTrend,
      weeklyTrend,
      annualTrend,
      topCategories
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(analytics)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
