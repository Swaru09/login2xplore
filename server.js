const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// JSONPowerDB Credentials
const jpdbBaseURL = 'http://api.login2explore.com:5577';
const dbName = 'SCHOOL-DB';
const relationName = 'STUDENT_TABLE';
const token = '90932072|-31949218794210813|90961957'; // Replace with your actual JPDB token

// Check if Roll No exists
app.get('/check_student', async (req, res) => {
    const rollNo = req.query.rollNo;

    // Replace with your actual JSONPowerDB URL
    const url = `https://api.jsonpowerdb.com/api/irl/getByKey`;

    const requestData = {
        token,
        dbName,
        rel: relationName,
        cmd: "GET_BY_KEY",
        key: rollNo
    };

    try {
        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = response.data;

        if (data.status === 200) {
            res.json(data.data);
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Error while fetching student data:', error.message);
        res.status(500).json({ error: 'Error while fetching student data' });
    }
});



// Save new student data
app.post('/save_student', async (req, res) => {
    const { rollNo, fullName, class: studentClass, birthDate, address, enrollmentDate } = req.body;
    const url = `${jpdbBaseURL}/api/iml`;

    const requestData = {
        token,
        dbName,
        cmd: "PUT",
        rel: relationName,
        jsonStr: {
            Roll_No: rollNo,
            Full_Name: fullName,
            Class: studentClass,
            Birth_Date: birthDate,
            Address: address,
            Enrollment_Date: enrollmentDate
        }
    };

    try {
        const response = await axios.post(url, requestData);
        if (response.data.status === 200) {
            res.send('Record saved successfully.');
        } else {
            res.status(500).send('Error while saving student data');
        }
    } catch (error) {
        res.status(500).send('Error while saving student data');
    }
});

// Update existing student data
app.post('/update_student', async (req, res) => {
    const { rollNo, fullName, class: studentClass, birthDate, address, enrollmentDate } = req.body;
    const url = `${jpdbBaseURL}/api/iml`;

    const requestData = {
        token,
        dbName,
        cmd: "UPDATE",
        rel: relationName,
        jsonStr: {
            Roll_No: rollNo,
            Full_Name: fullName,
            Class: studentClass,
            Birth_Date: birthDate,
            Address: address,
            Enrollment_Date: enrollmentDate
        }
    };

    try {
        const response = await axios.post(url, requestData);
        if (response.data.status === 200) {
            res.send('Record updated successfully.');
        } else {
            res.status(500).send('Error while updating student data');
        }
    } catch (error) {
        res.status(500).send('Error while updating student data');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
