# 🎥 VideoTube Backend - Professional YouTube-Inspired Platform

A robust, scalable backend API for a video streaming platform built with modern Node.js technologies. This project demonstrates production-ready backend development practices, including secure authentication, file handling, database optimization, and RESTful API design.

## 🚀 Project Overview

VideoTube Backend is a comprehensive server-side application that replicates core YouTube functionalities with enterprise-level code quality and architecture. Built as a showcase of full-stack development expertise and backend engineering best practices.

## ✨ Key Features

### 🔐 Advanced Authentication System

-   JWT-based authentication with refresh token rotation
-   Secure password hashing using bcrypt
-   Protected routes with middleware authentication
-   HTTP-only cookie implementation for enhanced security

### 📁 Professional File Management

-   Multi-file upload handling with Multer
-   Cloud storage integration with Cloudinary
-   Automatic file cleanup and error handling
-   Optimized image/video processing pipeline

### 🎬 Core Video Platform Features

-   User registration and profile management
-   Video upload, metadata management, and streaming
-   Channel subscriptions and subscriber tracking
-   Watch history and personalized recommendations
-   Comment system with nested replies
-   Like/dislike functionality across content types
-   Playlist creation and management

### 🏗️ Enterprise Architecture

-   Clean separation of concerns (MVC pattern)
-   Centralized error handling with custom error classes
-   Standardized API responses and status codes
-   Comprehensive input validation and sanitization
-   Mongoose schema design with proper relationships

## 🛠️ Technology Stack

### Backend Core

-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Database:** MongoDB with Mongoose ODM
-   **Authentication:** JSON Web Tokens (JWT)

### File & Media Processing

-   **File Upload:** Multer
-   **Cloud Storage:** Cloudinary
-   **Image/Video Processing:** Cloudinary API

### Security & Middleware

-   **Password Hashing:** bcrypt
-   **CORS:** Cross-Origin Resource Sharing
-   **Cookie Parser:** Secure cookie handling
-   **Input Validation:** Custom middleware

### Development Tools

-   **Code Formatting:** Prettier
-   **Environment Management:** dotenv
-   **Development Server:** Node.js --watch flag

## 📂 Professional Project Structure

```
videoTubeBackend/
├── src/
│   ├── controllers/          # Business logic layer
│   │   ├── user.controller.js
│   │   └── healthcheck.controller.js
│   ├── middlewares/          # Custom middleware functions
│   │   ├── auth.middlewares.js
│   │   ├── error.middlewares.js
│   │   └── multer.middlewares.js
│   ├── models/              # Database schema definitions
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   ├── subscription.model.js
│   │   ├── comment.models.js
│   │   ├── like.models.js
│   │   ├── playlist.model.js
│   │   └── tweets.model.js
│   ├── routes/              # API endpoint definitions
│   │   ├── user.routes.js
│   │   └── healthCheck.routes.js
│   ├── utils/               # Utility functions
│   │   ├── APIResponse.js
│   │   ├── APIErrors.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.js
│   ├── db/                  # Database configuration
│   │   └── index.js
│   ├── app.js              # Express application setup
│   ├── index.js            # Server entry point
│   └── constants.js        # Application constants
├── public/temp/            # Temporary file storage
├── .env.sample            # Environment variables template
├── .gitignore            # Git ignore rules
├── .prettierrc           # Code formatting configuration
└── package.json          # Project dependencies and scripts
```

## 🔧 Installation & Setup

### Prerequisites

-   Node.js (v18+ recommended)
-   MongoDB database
-   Cloudinary account for file storage

### Quick Start

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd videoTubeBackend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Configuration**

    ```bash
    cp .env.sample .env
    # Configure your environment variables in .env
    ```

4. **Configure Environment Variables**

    ```env
    PORT=8080
    MONGODB_URI=your_mongodb_connection_string
    ACCESS_TOKEN_SECRET=your_access_token_secret
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_name
    CLOUDINARY_API_KEY=your_cloudinary_key
    CLOUDINARY_API_SECRET=your_cloudinary_secret
    ```

5. **Start Development Server**
    ```bash
    npm run dev
    ```

## 📋 API Endpoints

### Authentication & Users

-   `POST /api/v1/users/register` - User registration
-   `POST /api/v1/users/login` - User authentication
-   `POST /api/v1/users/logout` - Secure logout
-   `POST /api/v1/users/refresh-token` - Token refresh
-   `GET /api/v1/users/current-user` - Get current user profile
-   `PATCH /api/v1/users/update-account` - Update account details
-   `PATCH /api/v1/users/avatar` - Update user avatar
-   `PATCH /api/v1/users/cover-image` - Update cover image

### System Health

-   `GET /api/v1/healthcheck` - System health monitoring

## 🎯 Key Technical Achievements

### Security Implementation

-   Implemented JWT refresh token rotation for enhanced security
-   Secure password hashing with salt rounds
-   HTTP-only cookies to prevent XSS attacks
-   Input validation and sanitization middleware
-   CORS configuration for cross-origin security

### Database Design

-   Optimized MongoDB schema design with proper indexing
-   Complex aggregation pipelines for data analytics
-   Efficient relationship modeling between users, videos, and interactions
-   Database connection pooling and error handling

### File Management

-   Robust file upload system with validation
-   Cloud storage integration with automatic cleanup
-   Error handling for failed uploads
-   Support for multiple file formats and sizes

### Code Quality

-   Consistent error handling with custom error classes
-   Standardized API response format
-   Comprehensive input validation
-   Clean code architecture with separation of concerns
-   Professional logging and debugging

## 🏆 Professional Highlights

-   **Scalable Architecture:** Designed for horizontal scaling with proper separation of concerns
-   **Production Ready:** Comprehensive error handling, logging, and security measures
-   **Best Practices:** Following industry standards for Node.js and MongoDB development
-   **Performance Optimized:** Efficient database queries and file handling
-   **Maintainable Code:** Clean, documented, and well-structured codebase

## 📱 Frontend Integration Ready

This backend is designed to seamlessly integrate with modern frontend frameworks:

-   RESTful API design
-   JSON response format
-   CORS enabled for web applications
-   Mobile-friendly authentication flow
-   Comprehensive API documentation

## 🔮 Future Enhancements

-   Real-time notifications with WebSocket integration
-   Advanced search functionality with Elasticsearch
-   Video transcoding and multiple quality options
-   Analytics dashboard and reporting
-   Content recommendation algorithms
-   Social features (friends, sharing, etc.)

## 👨‍💻 Developer

**Piyush Satiya**

-   Full-Stack Developer
-   Specializing in Node.js, Express.js, and MongoDB
-   Passionate about building scalable web applications

---

_This project demonstrates professional backend development skills including API design, database optimization, security implementation, and production-ready code architecture._
