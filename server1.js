const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    console.log(filePath);
    if (filePath === './') {
        filePath = './login.html'; // Default to serving login.html
    }  
    if (/^\.\/dating.html\?/.test(req.url)){
        filePath = './match.html'
    }

    // if (filePath === './login.html' && req.method === 'POST') {
    //     // Handle form submission from login.html
    //     handleLogin(req, res);
    //     return; // Stop execution of further code
    // }

    // if (filePath === './dating.html' && !userIsAuthenticated(req)) {
    //     // If user is not authenticated, redirect to login page
    //     res.writeHead(302, { 'Location': '/login.html' });
    //     res.end();
    //     return; // Stop execution of further code
    // }

    // if (filePath === './match.html' && !userIsAuthenticated(req)) {
    //     // If user is not authenticated, redirect to login page
    //     res.writeHead(302, { 'Location': '/login.html' });
    //     res.end();
    //     return; // Stop execution of further code
    // }


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
});

// Function to check if user is authenticated
function userIsAuthenticated(req) {
    // Here you would implement your authentication logic
    // For demonstration purposes, let's assume the user is authenticated if there is a valid session cookie
    // You can use cookies or session tokens for authentication
    const sessionCookie = req.headers.cookie;
    // Check if sessionCookie contains valid authentication information
    // Return true if authenticated, false otherwise
    return true; // For demonstration purposes
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
