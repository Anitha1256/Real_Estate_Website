# GitHub Repository Setup

This document explains how to push your local project to GitHub.

## Initial Setup

1. **Create Repository**: Go to [github.com/new](https://github.com/new) and create a repository named `estate-pro`.
2. **Open Terminal**: Navigate to your project root.
   ```bash
   cd d:/guvi/estate-pro
   ```
3. **Initialize Git**:
   ```bash
   git init
   ```
4. **Add Ignore Files**: Ensure you have `.gitignore` in both `frontend` and `backend` (or one at the root).
   - The Root `.gitignore` should include:
     ```
     node_modules/
     .env
     dist/
     .DS_Store
     ```
5. **Add Files**:
   ```bash
   git add .
   ```
6. **Commit**:
   ```bash
   git commit -m "Initial commit: Real Estate MERN application"
   ```
7. **Link Remote**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/estate-pro.git
   ```
8. **Push**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

## Best Practices
- **Never push `.env` files**: They contain sensitive secrets. Use environment variables in Netlify/Render dashboards instead.
- **Use Feature Branches**: If working in a team, create branches for new features (`git checkout -b feature-name`).
- **Regular Commits**: Commit small, logical chunks of work with descriptive messages.
