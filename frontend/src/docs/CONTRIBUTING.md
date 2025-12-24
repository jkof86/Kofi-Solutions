# 🤝 Contributing to Kofi Solutions Dashboard

Thank you for your interest in contributing!  
This project is modular, scalable, and designed for clean collaboration.

## 🧱 Project Structure

```
src/
├── components/
│   ├── navigation/
│   ├── layouts/
│   ├── data/
│   ├── pages/
│   ├── utils/
├── backend/
│   ├── feedsMap.js
│   ├── handlers/
├── docs/
```

## 🧩 How to Contribute

### 1. Fork the repository
Create your own fork and clone it locally.

### 2. Create a feature branch

```bash
git checkout -b feature/my-new-feature
```

### 3. Follow coding standards

- Use functional React components
- Prefer MUI components over raw HTML
- Keep components modular and self-contained
- Avoid inline styles unless using `sx={{}}`
- Use descriptive variable names
- Document backend handlers clearly

### 4. Test your changes

- Run the frontend locally
- Test backend endpoints via Postman
- Validate feed health and chart rendering

### 5. Submit a pull request

Include:

- A clear description
- Screenshots (if UI changes)
- Notes on any breaking changes

## 🧪 Testing Guidelines

### Frontend

```bash
npm start
```

### Backend

Use:

```bash
GET /RSSProxyAggregator?mode=health
GET /RSSProxyAggregator?feed=<key>
```

Check CloudWatch logs for Lambda debugging.

## 🛡️ Code of Conduct

- Be respectful
- Keep discussions technical
- No spam or self-promotion
- Follow best practices

## 📝 License

This project is proprietary to **Kofi Solutions**.  
Do not redistribute without permission.