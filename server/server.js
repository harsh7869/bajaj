const express = require('express');
const bodyParser = require('body-parser');
const { isBase64 } = require('is-base64');
const atob = require('atob');
const cors = require("cors")
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Utility Functions
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};


const sanitizeBase64 = (base64String) => {
    // Remove the prefix (data:image/png;base64,) if present
    const base64Clean = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
    // Remove any unwanted spaces or line breaks
    return base64Clean.replace(/\s+/g, '');
};
const processFile = (fileB64) => {
    if (!fileB64) {
        return { file_valid: false, error: 'No file provided' };
    }

    try {
        // Sanitize and remove prefix
        const base64Data = sanitizeBase64(fileB64.includes(',') ? fileB64.split(',')[1] : fileB64);

        // Decode Base64 string
        const buffer = Buffer.from(base64Data, 'base64');

        // Debugging
        console.log('Decoded Buffer Length:', buffer.length);
        console.log('Decoded Buffer Header:', buffer.toString('hex', 0, 4));

        // Check file type by header
        const fileHeader = buffer.toString('hex', 0, 4);
        let mimeType = '';
        switch (fileHeader) {
            case 'ffd8ffe0':
            case 'ffd8ffe1':
            case 'ffd8ffe2':
                mimeType = 'image/jpeg';
                break;
            case '89504e47':
                mimeType = 'image/png';
                break;
            default:
                mimeType = 'unknown';
        }

        return {
            file_valid: mimeType !== 'unknown',
            file_mime_type: mimeType,
            file_size_kb: Math.round(buffer.length / 1024),
        };
    } catch (error) {
        console.error('Error decoding Base64:', error.message);
        return { file_valid: false, error: 'Invalid Base64 string' };
    }
};

app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    if (!Array.isArray(data)) {
        return res.status(400).json({ is_success: false, error: 'Invalid data format' });
    }

    const numbers = [];
    const alphabets = [];
    let highestLowercase = '';
    let isPrimeFound = false;

    data.forEach((item) => {
        if (!isNaN(item)) {
            numbers.push(item);
            if (isPrime(Number(item))) isPrimeFound = true;
        } else if (typeof item === 'string') {
            alphabets.push(item);
            if (item >= 'a' && item <= 'z' && item > highestLowercase) {
                highestLowercase = item;
            }
        }
    });

    const fileData = processFile(file_b64);

    res.status(200).json({
        is_success: true,
        user_id: 'harsh_shukla_11042003', 
        email: 'harshshukla210447@acropolis.in', 
        roll_number: '0827CS21092', 
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
        is_prime_found: isPrimeFound,
        ...fileData,
    });
});


app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});


app.listen(PORT, () => {
    console.log(   `Server is running on http://localhost:${PORT}`);
});