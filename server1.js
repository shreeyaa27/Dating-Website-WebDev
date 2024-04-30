const http = require('http');
const fs = require('fs');
const path = require('path');
// const url = require('url');

const server = http.createServer((req, res) => {

    
    if (req.method === 'POST' && req.url === '/createProfile') {
        // Handle the POST request to create a new profile
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            // Parse the request body
            const profileData = JSON.parse(body);
            console.log('Received profile data:', profileData);

            // Append the profile data to login.json
            fs.readFile('login.json', 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading login.json:', err);
                    res.writeHead(500);
                    res.end('Server Error');
                    return;
                }

                let logins = [];
                try {
                    // Parse the existing JSON data
                    logins = JSON.parse(data);
                } catch (error) {
                    console.error('Error parsing login.json:', error);
                    res.writeHead(500);
                    res.end('Server Error');
                    return;
                }

                // Add the new profile data to the logins array
                logins.push(profileData);

                // Write the updated data back to login.json
                fs.writeFile('login.json', JSON.stringify(logins, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing to login.json:', err);
                        res.writeHead(500);
                        res.end('Server Error');
                        return;
                    }
                    console.log('New profile added successfully.');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Profile created successfully' }));
                });
            });
        });
    }
    else {

        // const parsedUrl = url.parse(req.url);
        let filePath = '.' + req.url;
        console.log('Requested:', req.url);

        if (filePath === './') {
            filePath = './login.html'; // Default to serving login.html
        }

        // Determine the content type based on file extension
        const extname = path.extname(filePath);
        let contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.jpg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
        }

        // Read the file and serve it
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // File not found
                    res.writeHead(404);
                    res.end('404 Not Found');
                    console.log('jp bhi')
                } else {
                    // Server error
                    res.writeHead(500);
                    res.end('Server Error');
                }
            } else {
                // File found, serve content
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});



const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
