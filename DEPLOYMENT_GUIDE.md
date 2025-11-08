# AWS Deployment Guide - Step by Step

## Prerequisites
- AWS Account
- GitHub Account
- Docker installed locally (for testing)

---

## PHASE 1: Test Docker Locally (15 minutes)

### Step 1.1: Build and Test Docker Image

```bash
# Build the Docker image
docker build -t cyberacademy-app .

# Test the image locally (without database first)
docker run -p 3000:3000 cyberacademy-app
```

### Step 1.2: Test with Docker Compose (Full Stack)

```bash
# Start database + app together
docker-compose up

# Open browser: http://localhost:3000
# App should work exactly like before!
```

### Step 1.3: Stop Containers

```bash
# Stop all containers
docker-compose down

# Remove volumes (clean database)
docker-compose down -v
```

✅ **Checkpoint:** If Docker works locally, you're ready for AWS!

---

## PHASE 2: AWS RDS Database Setup (20 minutes)

### Step 2.1: Create RDS PostgreSQL Database

1. Go to **AWS Console** → **RDS**
2. Click **"Create database"**

**Settings:**
```
Engine type: PostgreSQL
Version: PostgreSQL 15.x
Template: Free tier ✅

DB instance identifier: cyberacademy-db
Master username: postgres
Master password: [Create strong password - SAVE IT!]

Instance configuration:
- db.t3.micro (free tier eligible)

Storage:
- 20 GB gp3

Connectivity:
- Public access: Yes (for now)
- VPC security group: Create new
  Name: cyberacademy-rds-sg

Additional configuration:
- Initial database name: cyberacademy
```

3. Click **"Create database"**
4. Wait 5-10 minutes for creation

### Step 2.2: Configure Security Group

1. Go to **EC2** → **Security Groups**
2. Find **cyberacademy-rds-sg**
3. Edit **Inbound rules**:
   - Type: PostgreSQL
   - Port: 5432
   - Source: Anywhere (0.0.0.0/0) - ⚠️ We'll restrict this later

4. Save rules

### Step 2.3: Get RDS Endpoint

1. Go to **RDS** → **Databases** → **cyberacademy-db**
2. Copy **Endpoint** (looks like: `cyberacademy-db.xxxxx.us-east-1.rds.amazonaws.com`)
3. Save it - you'll need this!

### Step 2.4: Create DATABASE_URL

Format:
```
postgresql://postgres:YOUR_PASSWORD@YOUR_ENDPOINT:5432/cyberacademy
```

Example:
```
postgresql://postgres:MyPass123@cyberacademy-db.abc123.us-east-1.rds.amazonaws.com:5432/cyberacademy
```

✅ **Checkpoint:** Save your DATABASE_URL securely!

---

## PHASE 3: AWS EC2 Setup (30 minutes)

### Step 3.1: Launch EC2 Instance

1. Go to **AWS Console** → **EC2** → **Launch Instance**

**Settings:**
```
Name: cyberacademy-app

Application and OS Images:
- Ubuntu Server 22.04 LTS (free tier eligible)

Instance type:
- t2.micro (free tier eligible)

Key pair:
- Create new key pair
- Name: cyberacademy-key
- Type: RSA
- Format: .pem
- 💾 DOWNLOAD AND SAVE THE .pem FILE!

Network settings:
- Create security group
- Name: cyberacademy-ec2-sg
- Allow SSH from: My IP
- Allow HTTP from: Anywhere
- Allow HTTPS from: Anywhere

Storage:
- 20 GB gp3
```

2. Click **"Launch instance"**
3. Wait 2 minutes

### Step 3.2: Allocate Elastic IP

1. **EC2** → **Elastic IPs** → **Allocate Elastic IP address**
2. Click **"Allocate"**
3. Select the IP → **Actions** → **Associate Elastic IP address**
4. Select your instance: **cyberacademy-app**
5. Click **"Associate"**

💾 **Save your Elastic IP** - this is your server's permanent address!

### Step 3.3: Connect to EC2

**Windows (using Git Bash or PowerShell):**
```bash
# Move to where you downloaded the .pem file
cd Downloads

# Set permissions
chmod 400 cyberacademy-key.pem

# Connect
ssh -i cyberacademy-key.pem ubuntu@YOUR_ELASTIC_IP
```

**Mac/Linux:**
```bash
chmod 400 cyberacademy-key.pem
ssh -i cyberacademy-key.pem ubuntu@YOUR_ELASTIC_IP
```

✅ **Checkpoint:** You should see Ubuntu welcome message!

---

## PHASE 4: Install Docker on EC2 (10 minutes)

### Step 4.1: Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### Step 4.2: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to docker group
sudo usermod -aG docker ubuntu

# Exit and reconnect for group to take effect
exit

# Reconnect
ssh -i cyberacademy-key.pem ubuntu@YOUR_ELASTIC_IP
```

### Step 4.3: Verify Docker

```bash
docker --version
# Should show: Docker version 24.x.x

docker ps
# Should work without sudo
```

### Step 4.4: Install Docker Compose

```bash
sudo apt install docker-compose-plugin -y

docker compose version
# Should show: Docker Compose version v2.x.x
```

✅ **Checkpoint:** Docker is ready!

---

## PHASE 5: Deploy Application (20 minutes)

### Step 5.1: Clone Repository

```bash
# Install git if not installed
sudo apt install git -y

# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### Step 5.2: Create Environment File

```bash
# Create .env file
nano .env
```

**Add these variables:**
```env
# Database
DATABASE_URL=postgresql://postgres:YOUR_RDS_PASSWORD@YOUR_RDS_ENDPOINT:5432/cyberacademy

# Next.js
NEXTAUTH_URL=http://YOUR_ELASTIC_IP:3000
NEXTAUTH_SECRET=generate-random-string-here-use-openssl

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-public-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Email (if using)
RESEND_API_KEY=your-resend-key
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

Save and exit (Ctrl+X, Y, Enter)

### Step 5.3: Build Docker Image

```bash
docker build -t cyberacademy-app .
```

This will take 5-10 minutes.

### Step 5.4: Run Database Migrations

```bash
# Run migrations on RDS
docker run --rm --env-file .env cyberacademy-app npx prisma migrate deploy
```

### Step 5.5: Start Application

```bash
docker run -d \
  --name cyberacademy \
  --restart unless-stopped \
  -p 80:3000 \
  --env-file .env \
  cyberacademy-app
```

### Step 5.6: Check Logs

```bash
# View logs
docker logs cyberacademy

# Follow logs (Ctrl+C to exit)
docker logs -f cyberacademy
```

✅ **Checkpoint:** Open browser: `http://YOUR_ELASTIC_IP`
Your site should be live!

---

## PHASE 6: Setup Domain & SSL (Optional - 30 minutes)

### Step 6.1: Point Domain to EC2

In your domain registrar (Namecheap, GoDaddy, etc.):
```
Type: A Record
Name: @ (or subdomain)
Value: YOUR_ELASTIC_IP
TTL: 300
```

Wait 5-10 minutes for DNS propagation.

### Step 6.2: Install Nginx

```bash
sudo apt install nginx -y
```

### Step 6.3: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/cyberacademy
```

**Add:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/cyberacademy /etc/nginx/sites-enabled/

# Remove default
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 6.4: Install SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS
```

### Step 6.5: Update Environment

```bash
# Stop container
docker stop cyberacademy
docker rm cyberacademy

# Update .env
nano .env
# Change NEXTAUTH_URL to https://your-domain.com

# Restart
docker run -d \
  --name cyberacademy \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  cyberacademy-app
```

✅ **Checkpoint:** Visit `https://your-domain.com` - SSL should work!

---

## Useful Commands

### Docker Management
```bash
# View running containers
docker ps

# Stop app
docker stop cyberacademy

# Start app
docker start cyberacademy

# Restart app
docker restart cyberacademy

# View logs
docker logs cyberacademy

# Shell into container
docker exec -it cyberacademy sh
```

### Updates
```bash
# Pull latest code
cd ~/YOUR_REPO
git pull

# Rebuild image
docker build -t cyberacademy-app .

# Stop old container
docker stop cyberacademy
docker rm cyberacademy

# Run new version
docker run -d \
  --name cyberacademy \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  cyberacademy-app
```

### Database
```bash
# Run migrations
docker run --rm --env-file .env cyberacademy-app npx prisma migrate deploy

# Access database
docker exec -it cyberacademy npx prisma studio
```

---

## Troubleshooting

**App not starting:**
```bash
docker logs cyberacademy
```

**Database connection error:**
- Check RDS security group allows EC2 IP
- Verify DATABASE_URL is correct

**Port already in use:**
```bash
sudo netstat -tulpn | grep :3000
sudo kill -9 <PID>
```

**Out of memory:**
- Upgrade to t3.small ($15/month)

---

## Next Steps

After everything works:
1. Setup GitHub Actions for automated deployments
2. Add CloudWatch monitoring
3. Setup automated backups
4. Consider moving to ECS Fargate for easier management

---

## Cost Summary

**Free Tier (First 12 months):**
- EC2 t2.micro: FREE
- RDS db.t3.micro: FREE (750 hours/month)
- S3: 5GB FREE
- Data transfer: 1GB FREE
- **Total: $0-5/month**

**After Free Tier:**
- EC2 t3.small: $15/month
- RDS db.t4g.micro: $13/month
- S3 + Data: $5-10/month
- **Total: $35/month**
