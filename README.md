# Question Paper Hub

Question Paper Hub is a community-driven platform designed to help students share and access previous years' question papers. Built with React and Firebase, it offers a seamless experience for uploading, searching, and downloading academic resources.

## Features

- **Browse & Search**: Easily find question papers by branch, year, or subject.
- **Upload Papers**: Contribute to the community by uploading question papers (supports images and PDFs).
- **Download**: Download papers for offline study.
- **User Accounts**: Secure login and signup functionality using Firebase Authentication.
- **My Uploads**: Manage the papers you have contributed.
- **Responsive Design**: Accessible on both desktop and mobile devices.

## Tech Stack

- **Frontend**: React, Vite
- **Backend & Database**: Firebase (Firestore, Storage, Authentication)
- **Styling**: CSS / Tailwind CSS
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- A Firebase project set up with Authentication, Firestore, and Storage enabled.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Chirag6722/QuestionPaperHub.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd QuestionPaperHub
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Configuration

1.  Create a `.env` file in the root directory.
2.  Add your Firebase configuration keys:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
