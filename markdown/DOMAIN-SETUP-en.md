# Domain Setup for the project

## Local Development

For local development with your domain, you need to edit your local hosts file:

### On MacOS/Linux:

1. Open a terminal
2. Run the following command: `sudo nano /etc/hosts`
3. Add the following line:

```
127.0.0.1    your-domain.de
```

4. Save the file (in nano: Ctrl+O, then Enter, then Ctrl+X)

### On Windows:

1. Open Notepad as Administrator
2. Open the file: `C:\Windows\System32\drivers\etc\hosts`
3. Add the following line:

```
127.0.0.1    your-domain.de
```

4. Save the file

## Local Development Server

Start the development server with:

```bash
npm run dev
```

Now you can use the following URL in your browser:

- Frontend: http://your-domain.de:3000

## Production Setup

For production, you need to:

1. Configure the domain with your DNS provider to point to your server
2. Set up HTTPS with SSL certificate for the domain
3. Configure a reverse proxy (like Nginx) that forwards requests to your Next.js application

### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.de www.your-domain.de;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.de www.your-domain.de;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.pem;
    ssl_certificate_key /path/to/your/private_key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
