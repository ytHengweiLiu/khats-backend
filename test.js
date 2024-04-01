const request = require('sync-request');

const fs = require('fs');

const filePath = './uploads/invoice.xml';

var data;
try {
  data = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  console.error('Error reading file:', err);
}

describe('GET /', () => {
  test('responds with JSON message "hello world"', () => {
    const response = request('GET', 'http://localhost:3001/');
    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.getBody('utf8'));
    expect(responseBody.msg).toBe('hello world');
  });
});

describe('POST /invoice-validator/upload-invoice', () => {
    test('responds with status 413 if no file is uploaded', () => {
      const response = request('POST', 'http://localhost:3001/invoice-validator/upload-invoice');
      expect(response.statusCode).toBe(413);
    });
});


describe('GET /invoice-validator/validate-invoice', () => {

    // test('responds with status 201 if file uploaded is XML', () => {
    //     const formData = {
    //     file: {
    //         value: data,
    //         options: {
    //         filename: 'test.xml',
    //         contentType: 'application/xml'
    //         }
    //     }
    //     };
    // const response = request('POST', 'http://localhost:3001/invoice-validator/upload-invoice', { formData });
    // expect(response.statusCode).toBe(201);
    // });

    test('responds with validation errors for a given filename', () => {
        const response = request('GET', 'http://localhost:3001/invoice-validator/validate-invoice?filename=invoice.xml');
        expect(response.statusCode).toBe(200);
    });

    test('responds with status 500 if validation fails', () => {
        const response = request('GET', 'http://localhost:3001/invoice-validator/validate-invoice?filename=nonexistent.xml');
        expect(response.statusCode).toBe(500);
    });
});



