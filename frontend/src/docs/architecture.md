# 🏗️ Kofi Solutions Dashboard — Architecture Overview

This document provides a high‑level overview of the system architecture for the **Kofi Solutions Dashboard**.

---

## 🔷 Frontend Architecture

### **Framework**
- React 18  
- Material UI (MUI v5)  
- Recharts  
- React Router  

### **Key Components**
- **HeaderShell**  
  - Fixed header  
  - Banner  
  - Live ticker  
  - Drawer navigation  
  - ResizeObserver height measurement  

- **MainBar**  
  - Secondary navigation  
  - Supports custom banners  

- **FeedHealthDashboard**  
  - Displays backend feed status  
  - Normalized against FEEDS map  

- **MarketChart**  
  - Recharts line chart  
  - 1D snapshot  
  - ResponsiveContainer  

- **RSSFeed / FeedCard**  
  - Unified feed rendering  
  - Supports fallback images, timestamps, summaries  

---

## 🔷 Backend Architecture

### **Platform**
- AWS Lambda (Node 18)  
- API Gateway (REST)  
- CloudWatch logging  

### **Handlers**
- `RSSProxyAggregator`  
  - Fetches RSS feeds  
  - Fetches JSON feeds  
  - Normalizes output  
  - Supports `mode=health`  

### **Health Endpoint**
- Validates URLs  
- Handles fallback + JSON feeds  
- Uses safe fetch with timeout  
- Returns normalized status map  

---

## 🔷 FEEDS Routing Layer

The backend FEEDS map contains only:

- RSS URLs  
- `json:<handler>`  
- `fallback:<feedKey>`  

This ensures predictable routing and stable health checks.

---

## 🔷 Data Flow

