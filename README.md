🎬 Virtual Movie Party
Virtual Movie Party is a web application that enables users to watch movies together in real-time, fostering a shared viewing experience regardless of physical distance.

🚀 Features
Real-Time Synchronization: Watch movies simultaneously with friends.

User Authentication: Secure sign-up and login functionality.

Room Management: Create and join virtual rooms for movie sessions.

Chat Functionality: Communicate with participants during the movie.

Responsive Design: Optimized for various devices and screen sizes.

🛠️ Tech Stack
Frontend: React, TypeScript, Tailwind CSS

Backend: Supabase (Authentication, Database, Realtime)

Build Tool: Vite

State Management: React Context API / Redux (based on your implementation)

📂 Project Structure
bash
Copy
Edit
virtual-movie-party/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page components (e.g., Home, Login, Register)
│   ├── lib/               # Utility functions and libraries
│   ├── superbaseClient.ts # Supabase client configuration
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── supabase/              # Supabase configuration and migrations
├── .env                   # Environment variables
├── package.json           # Project metadata and dependencies
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.ts         # Vite configuration
🧪 Getting Started
Prerequisites
Node.js (v14 or later)

npm or yarn

Supabase account

Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/Abhinaybethi/virtual-movie-party.git
cd virtual-movie-party
Install dependencies:

bash
Copy
Edit
npm install
# or
yarn install
Configure environment variables:

Create a .env file in the root directory and add your Supabase credentials:

env
Copy
Edit
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
Run the development server:

bash
Copy
Edit
npm run dev
# or
yarn dev
The application will be available at http://localhost:5173.

🔧 Supabase Configuration
Set up a new project on Supabase.

Create the necessary tables:

Users: Handles user authentication.

Rooms: Stores information about movie rooms.

Messages: Stores chat messages within rooms.

Enable Realtime:

Ensure that Realtime is enabled for the tables to allow real-time updates.

📦 Deployment
To deploy the application, consider using platforms like Vercel or Netlify.

Build the application:

bash
Copy
Edit
npm run build
# or
yarn build
Deploy:

Follow the deployment instructions specific to your chosen platform.

🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

📄 License
This project is licensed under the MIT License.

📧 Contact
For any inquiries or feedback, please contact abhinaybethi26@gmail.com.
