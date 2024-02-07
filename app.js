const express = require('express');
const multer = require('multer');
const { convertToCSV } = require('./converter');
const fs = require("fs")
const app = express();
const port = 3000;

// Set up multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Handle file upload and conversion
app.post('/upload', upload.single('asciiFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const asciiFilePath = req.file.path;
    const csvFilePath = 'converted.csv';
    try {
        await convertToCSV(asciiFilePath, csvFilePath);

        // Send CSV file to client
        res.download(csvFilePath, 'converted.csv', (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            } else {
                console.log('File sent successfully');
            }
        });


        fs.unlink(`./${asciiFilePath}`, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('CSV file deleted successfully');
            }
        })



    } catch (err) {
        res.sendFile(__dirname + "/public/index.html")
    }
    // Convert ASCII to CSV

});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});