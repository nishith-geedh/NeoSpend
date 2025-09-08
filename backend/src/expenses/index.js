const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const EXPENSES_TABLE = process.env.EXPENSES_TABLE_NAME;

exports.handler = async (event) => {
  console.log('=== EXPENSES LAMBDA FUNCTION CALLED ===');
  console.log('Expenses Lambda Event:', JSON.stringify(event, null, 2));
  
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
    const expenseId = pathParameters?.id;

    console.log('HTTP Method:', httpMethod);
    console.log('Path Parameters:', pathParameters);
    console.log('Body:', body);

    switch (httpMethod) {
      case 'GET':
        if (expenseId) {
          // Get single expense
          const result = await dynamodb.get({
            TableName: EXPENSES_TABLE,
            Key: { expenseId }
          }).promise();
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result.Item || {})
          };
        } else {
          // Get all expenses for user
          console.log('Querying DynamoDB for user:', userId);
          console.log('Table name:', EXPENSES_TABLE);
          
          try {
            const result = await dynamodb.query({
              TableName: EXPENSES_TABLE,
              IndexName: 'UserIdIndex',
              KeyConditionExpression: 'userId = :userId',
              ExpressionAttributeValues: {
                ':userId': userId
              }
            }).promise();
            
            console.log('DynamoDB query result:', JSON.stringify(result, null, 2));
            
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify(result.Items || [])
            };
          } catch (dbError) {
            console.error('DynamoDB query error:', dbError);
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({ error: 'Database query failed', details: dbError.message })
            };
          }
        }

      case 'POST':
        const newExpense = JSON.parse(body);
        const newExpenseId = `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const expense = {
          expenseId: newExpenseId,
          userId,
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
          description: newExpense.description,
          date: newExpense.date,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await dynamodb.put({
          TableName: EXPENSES_TABLE,
          Item: expense
        }).promise();

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(expense)
        };

      case 'PUT':
        const updatedExpense = JSON.parse(body);
        
        await dynamodb.update({
          TableName: EXPENSES_TABLE,
          Key: { expenseId },
          UpdateExpression: 'SET #amount = :amount, #category = :category, #description = :description, #date = :date, updatedAt = :updatedAt',
          ExpressionAttributeNames: {
            '#amount': 'amount',
            '#category': 'category',
            '#description': 'description',
            '#date': 'date'
          },
          ExpressionAttributeValues: {
            ':amount': parseFloat(updatedExpense.amount),
            ':category': updatedExpense.category,
            ':description': updatedExpense.description,
            ':date': updatedExpense.date,
            ':updatedAt': new Date().toISOString()
          }
        }).promise();

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Expense updated successfully' })
        };

      case 'DELETE':
        await dynamodb.delete({
          TableName: EXPENSES_TABLE,
          Key: { expenseId }
        }).promise();

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Expense deleted successfully' })
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
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack 
      })
    };
  }
};
