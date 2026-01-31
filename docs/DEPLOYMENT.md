# Deployment Guide

The project is configured for Vercel deployment.

## Steps
1. Push `main` branch to GitHub.
2. Link repository to Vercel.
3. Configure Environment Variables (if any).
4. Deploy.

## CI/CD
- **Testing**: Github Action `ci-test.yml` runs on every push.
- **Production**: Github Action `deploy.yml` triggers on push to `main`.
