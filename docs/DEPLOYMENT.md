# Deployment Guide

## Docker Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Set production environment variables
export JWT_SECRET="your-production-secret-minimum-32-chars"
export DB_PASSWORD="your-secure-db-password"

# Start services
docker-compose up -d

# Run database seed (first deployment only)
docker-compose exec backend npm run seed
```

## Environment Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string (32+ chars)
- [ ] Change database password to something secure
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS `FRONTEND_URL` to your domain
- [ ] Set up SSL/TLS (reverse proxy like nginx/traefik)
- [ ] Enable PostgreSQL SSL connections
- [ ] Set up database backups
- [ ] Configure log rotation

## Reverse Proxy (nginx)

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Authorization $http_authorization;
    }
}
```

## Health Checks

- Backend: `GET /health`
- Database: PostgreSQL `pg_isready`
