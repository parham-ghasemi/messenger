# Messenger

Messenger is a modern web application designed for real-time messaging, enabling users to communicate seamlessly. Built with cutting-edge technologies, it delivers a smooth and efficient user experience.

## Features

- **Real-time Messaging**: Instant communication with friends and groups.
- **User Authentication**: Secure login and registration.
- **Group Chats**: Create and manage group conversations.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Modern UI/UX**: Sleek and intuitive interface for easy navigation.

## Tech Stack

- **Frontend**: React.js, Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time Updates**: Pusher
- **Authentication**: JWT (JSON Web Tokens)

## Installation

### Prerequisites

- Node.js (v14 or newer)
- MongoDB instance
- Pusher account (or alternative real-time service)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/parham-ghasemi/messenger.git
   cd messenger
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PUSHER_APP_ID=your_pusher_app_id
   PUSHER_KEY=your_pusher_key
   PUSHER_SECRET=your_pusher_secret
   PUSHER_CLUSTER=your_pusher_cluster
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

## Usage

1. Register or log in with your credentials.
2. Start a conversation with friends or create a group chat.
3. Enjoy real-time messaging with instant updates.

## Contact

For any inquiries or support, please reach out to [Parham Ghasemi](mailto:parham.ghasemi.1388@gmail.com) or open an issue in this repository.

---

Thank you for using Messenger! We hope you enjoy the app.

