const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const BUDGETS_TABLE = process.env.BUDGETS_TABLE_NAME;

exports.handler = async (event) => {
  console.log('Budgets Lambda Event:', JSON.stringify(event, null, 2));
  
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

    const httpMethod = event.requestContext?.http?.method || event.httpMethod;
    const pathParameters = event.pathParameters;
    const body = event.body;
    const budgetId = pathParameters?.id;

    console.log('HTTP Method:', httpMethod);
    console.log('Path Parameters:', pathParameters);
    console.log('Body:', body);

    switch (httpMethod) {
      case 'GET':
        if (budgetId) {
          // Get single budget
          const result = await dynamodb.get({
            TableName: BUDGETS_TABLE,
            Key: { budgetId }
          }).promise();
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result.Item || {})
          };
        } else {
          // Get all budgets for user
          const result = await dynamodb.query({
            TableName: BUDGETS_TABLE,
            IndexName: 'UserIdIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId
            }
          }).promise();
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result.Items || [])
          };
        }

      case 'POST':
        const newBudget = JSON.parse(body);
        const newBudgetId = `budget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const budget = {
          budgetId: newBudgetId,
          userId,
          category: newBudget.category,
          amount: parseFloat(newBudget.amount),
          alertThreshold: parseInt(newBudget.alertThreshold),
          period: newBudget.period,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await dynamodb.put({
          TableName: BUDGETS_TABLE,
          Item: budget
        }).promise();

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(budget)
        };

      case 'PUT':
        const updatedBudget = JSON.parse(body);
        
        await dynamodb.update({
          TableName: BUDGETS_TABLE,
          Key: { budgetId },
          UpdateExpression: 'SET #category = :category, #amount = :amount, #alertThreshold = :alertThreshold, #period = :period, updatedAt = :updatedAt',
          ExpressionAttributeNames: {
            '#category': 'category',
            '#amount': 'amount',
            '#alertThreshold': 'alertThreshold',
            '#period': 'period'
          },
          ExpressionAttributeValues: {
            ':category': updatedBudget.category,
            ':amount': parseFloat(updatedBudget.amount),
            ':alertThreshold': parseInt(updatedBudget.alertThreshold),
            ':period': updatedBudget.period,
            ':updatedAt': new Date().toISOString()
          }
        }).promise();

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Budget updated successfully' })
        };

      case 'DELETE':
        await dynamodb.delete({
          TableName: BUDGETS_TABLE,
          Key: { budgetId }
        }).promise();

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Budget deleted successfully' })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
