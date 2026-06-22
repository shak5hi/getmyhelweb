# Hostinger VPS Ubuntu Setup Guide

Follow these steps to prepare your fresh Ubuntu VPS for GetMyHelpWeb.

## 1. Initial Server Setup & Firewall (UFW)

Ensure your server is secure by configuring UFW (Uncomplicated Firewall) to allow only necessary traffic.

```bash
# Allow SSH access (vital - do not skip)
sudo ufw allow 22

# Allow HTTP and HTTPS traffic for Nginx
sudo ufw allow 80
sudo ufw allow 443

# Enable the firewall
sudo ufw enable

# Check firewall status
sudo ufw status
```

## 2. Install Node.js (v20)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 3. Install Process Manager (PM2) & Log Rotation

PM2 will keep the Node.js application running in the background and restart it if it crashes.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Install PM2 logrotate module to prevent logs from consuming all disk space
pm2 install pm2-logrotate

# Configure pm2 to start on server boot
pm2 startup
# (Run the command outputted by the above step)
```

## 4. Install Nginx & Certbot

Nginx acts as a reverse proxy, forwarding web traffic from port 80/443 to your Node.js app on port 3000. Certbot automatically provisions SSL certificates.

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

## 5. Configure Application

1. Clone your repository.
2. Copy `nginx.conf.example` contents to `/etc/nginx/sites-available/getmyhelp.in`.
3. Create a symlink:
   ```bash
   sudo ln -s /etc/nginx/sites-available/getmyhelp.in /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```
4. Copy `.env.example` to `.env.local` and populate your SMTP secrets.
5. Make deployment scripts executable:
   ```bash
   chmod +x deployment.sh update.sh rollback.sh
   ```
6. Run deployment:
   ```bash
   ./deployment.sh
   ```

## 6. Secure with SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d getmyhelp.in -d www.getmyhelp.in
```
