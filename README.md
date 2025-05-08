# HeyRoomie - Roommate Matching Platform

A modern web application for matching young professionals looking for roommates in NYC based on lifestyle preferences and compatibility.

1. **Install MongoDB**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```
   > **Note:** MongoDB must be installed and running locally before starting the application. The application uses Mongoose as an ODM but requires MongoDB to be installed separately.

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   A `.env.local` file has been created in the project root with the following variables:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```
   
   > **Note:** You need to use a MongoDB Atlas connection string or a local MongoDB URI.

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
/heyroomie
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/             # Authentication API endpoints
│   │   │   │   ├── [...nextauth] # NextAuth configuration
│   │   │   │   └── register/     # User registration endpoint
│   │   │   ├── profile/          # User profile API
│   │   │   └── matches/          # Roommate matching API
│   │   ├── login/                # Login page
│   │   ├── signup/               # Signup page
│   │   ├── profile/              # User profile page
│   │   ├── matches/              # Matches display page
│   │   ├── layout.tsx            # Root layout component
│   │   ├── globals.css           # Global styles
│   │   └── page.tsx              # Landing page
│   ├── components/               # Reusable UI components
│   │   ├── auth/                 # Authentication components
│   │   │   └── SessionProvider.tsx # NextAuth session provider
│   │   └── layout/               # Layout components
│   │       └── Navbar.tsx        # Navigation bar
│   ├── lib/                      # Utility functions and libraries
│   │   └── db/                   # Database connection
│   │       └── mongoose.ts       # MongoDB connection utility
│   └── models/                   # MongoDB models
│       └── User.ts               # User model with preferences schema
├── package.json                  # Dependencies and scripts
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── .env.local                    # Environment variables
```

## Features

### 1. Landing Page (`/src/app/page.tsx`)
- Modern, responsive homepage with light theme and gold-to-teal gradients
- Engaging call-to-action buttons for sign-up and login
- Information about the roommate matching process
- Visually appealing UI with consistent design elements

### 2. Authentication System

**Files:**
- `/src/app/api/auth/[...nextauth]/route.ts` - NextAuth.js configuration
- `/src/app/api/auth/register/route.ts` - User registration API
- `/src/app/login/page.tsx` - Login page
- `/src/app/signup/page.tsx` - Signup page
- `/src/components/auth/SessionProvider.tsx` - Session provider wrapper
- `/src/components/auth/LoginModal.tsx` - Enhanced modal login component

**Features:**
- User registration with email/password
- Secure login with credentials
- Password hashing using bcrypt
- JWT session management
- Protected routes redirecting to login
- Automatic login after registration
- Streamlined user flow from signup to onboarding

### 3. User Onboarding

**Files:**
- `/src/components/onboarding/PreferenceQuiz.tsx` - Interactive preference quiz
- `/src/app/signup/page.tsx` - Signup page with redirection logic
- `/src/app/profile/page.tsx` - Profile detection for new users

**Features:**
- Streamlined onboarding flow for new users
- Interactive quiz that collects essential profile information
- Visual neighborhood selection with images
- Seamless transition from signup to profile completion
- Automatic detection of first-time users
- Direct saving of quiz responses to user profile
- User-friendly form controls with appropriate validation

### 4. User Profile & Preferences (`/src/app/profile/page.tsx`)

**Files:**
- `/src/app/profile/page.tsx` - Enhanced profile form UI with improved validation
- `/src/app/api/profile/route.ts` - Profile API endpoints with user-friendly error handling
- `/src/models/User.ts` - User model with preference fields
- `/src/components/onboarding/PreferenceQuiz.tsx` - Interactive onboarding quiz for new users

**Form Sections:**
- Personal Information (name, age, gender, occupation, bio)
- Location & Budget (neighborhood selection with images, budget range)
- Living Preferences:
  - Sleep Schedule (early bird, night owl, flexible)
  - Cleanliness (1-5 scale)
  - Smoking, Drinking, and Pets preferences
  - Guest and Noise preferences

### 4. Matching Algorithm (`/src/app/api/matches/route.ts`)

**How It Works:**
1. Retrieves all users with completed profiles (excluding current user)
2. For each potential match, calculates compatibility scores across categories:
   - **Lifestyle** (sleep schedule, cleanliness, smoking, etc.)
   - **Location** (neighborhood preferences)
   - **Financial** (budget range overlap)
   - **Personality** (age and other personal factors)
3. Generates an overall compatibility percentage
4. Creates a matching summary explaining why users match
5. Returns sorted matches by compatibility

**Scoring Logic:**
- Each preference dimension contributes to the overall score
- Exact matches get full points
- Close matches get partial points
- Opposite preferences get minimal points
- Weighted scoring prioritizes important factors

**Vector Similarity and MongoDB Vector Search:**
The algorithm in `/src/app/api/matches/route.ts` uses vector similarity (cosine similarity) and MongoDB's vector search capabilities to calculate compatibility scores. Each user's preferences are converted into a normalized vector representation, allowing for efficient similarity calculations.

### Vector Representation
User preferences are converted into normalized vectors where each dimension represents a different preference category:
- Lifestyle preferences (sleep schedule, cleanliness, etc.)
- Location preferences
- Budget range
- Personality traits
- Other compatibility factors

### Similarity Calculation
The matching algorithm uses cosine similarity to calculate the similarity between users' preference vectors:
- Cosine similarity ranges from -1 to 1, where:
  - 1 indicates perfect alignment
  - 0 indicates no correlation
  - -1 indicates complete opposition
- The final compatibility score is normalized to a 0-100 scale for user-friendly display

### MongoDB Vector Search
The application leverages MongoDB's vector search capabilities to:
- Efficiently store and index user preference vectors
- Perform fast similarity searches across the user database
- Scale matching operations as the user base grows

The algorithm calculates scores for different compatibility dimensions:

1. **Lifestyle Compatibility (100 points possible)**
   - Sleep schedule (20 points)
   - Smoking preferences (15 points)
   - Drinking habits (10 points)
   - Pet preferences (10 points)
   - Noise tolerance (15 points)
   - Guest frequency (10 points)
   - Cleanliness (20 points)

2. **Location Compatibility (100 points possible)**
   - Same neighborhood (100 points)
   - Different neighborhood (50 points)

3. **Financial Compatibility (100 points possible)**
   - Budget range overlap (0-100 points, proportional to overlap)

4. **Personality Compatibility (50 points possible)**
   - Age difference (50 points for close ages, scaled down for larger gaps)

The overall compatibility is calculated as a weighted average of all categories.

### 5. Matches Display Page (`/src/app/matches/page.tsx`)

**Features:**
- Shows matched users sorted by compatibility percentage
- Displays user details and compatibility breakdown
- Visual representation of match categories (lifestyle, location, etc.)
- Lists reasons for compatibility in each match card
- Responsive grid layout for different screen sizes

### 6. Navigation & Layout

**Files:**
- `/src/components/layout/Navbar.tsx` - Navigation component
- `/src/app/layout.tsx` - Root layout with authentication wrapper

**Features:**
- Responsive navigation with mobile menu
- Context-aware links (different for logged in/out users)
- Persistent authentication state across pages


## 🔐 Authentication Flow

1. **User Registration:**
   - User submits signup form
   - Password is hashed before storage
   - User record created in MongoDB
   - Redirected to login

2. **User Login:**
   - User enters credentials
   - NextAuth verifies credentials against database
   - JWT session created on successful login
   - Redirected to profile page

3. **Protected Routes:**
   - Session checked on restricted pages
   - Unauthenticated users redirected to login
   - User-specific data protected by session checks

## 💻 User Journey

1. **First Visit:**
   - User lands on homepage
   - Signs up for an account
   - Logs in with credentials

2. **Profile Creation:**
   - After login, redirected to profile page
   - Fills out personal info, budget, and preferences
   - Saves profile

3. **Viewing Matches:**
   - Once profile is complete, views matches page
   - Browses potential roommates sorted by compatibility
   - Sees why they match with each person

## 🧠 Matching Algorithm Details

The algorithm in `/src/app/api/matches/route.ts` uses vector similarity (cosine similarity) and MongoDB's vector search capabilities to calculate compatibility scores. Each user's preferences are converted into a normalized vector representation, allowing for efficient similarity calculations.

### Vector Representation
User preferences are converted into normalized vectors where each dimension represents a different preference category:
- Lifestyle preferences (sleep schedule, cleanliness, etc.)
- Location preferences
- Budget range
- Personality traits
- Other compatibility factors

### Similarity Calculation
The matching algorithm uses cosine similarity to calculate the similarity between users' preference vectors:
- Cosine similarity ranges from -1 to 1, where:
  - 1 indicates perfect alignment
  - 0 indicates no correlation
  - -1 indicates complete opposition
- The final compatibility score is normalized to a 0-100 scale for user-friendly display

### MongoDB Vector Search
The application leverages MongoDB's vector search capabilities to:
- Efficiently store and index user preference vectors
- Perform fast similarity searches across the user database
- Scale matching operations as the user base grows

The algorithm calculates scores for different compatibility dimensions:

1. **Lifestyle Compatibility (100 points possible)**
   - Sleep schedule (20 points)
   - Smoking preferences (15 points)
   - Drinking habits (10 points)
   - Pet preferences (10 points)
   - Noise tolerance (15 points)
   - Guest frequency (10 points)
   - Cleanliness (20 points)

2. **Location Compatibility (100 points possible)**
   - Same neighborhood (100 points)
   - Different neighborhood (50 points)

3. **Financial Compatibility (100 points possible)**
   - Budget range overlap (0-100 points, proportional to overlap)

4. **Personality Compatibility (50 points possible)**
   - Age difference (50 points for close ages, scaled down for larger gaps)

The overall compatibility is calculated as a weighted average of all categories.

## 🔧 MongoDB Data Models

### User Model (`/src/models/User.ts`)

```typescript
{
  name: string;               // User's full name
  email: string;              // Email address (unique)
  password: string;           // Hashed password
  bio?: string;               // Optional user description
  age?: number;               // User's age
  gender?: string;            // Gender identity
  occupation?: string;        // Job or profession
  neighborhood?: string;      // Preferred NYC neighborhood
  budget?: {                  // Monthly budget range
    min: number;              
    max: number;
  };
  preferences?: {             // Living style preferences
    sleepSchedule?: string;   // early_bird, night_owl, flexible
    cleanliness?: number;     // 1-5 scale
    smoking?: boolean;        // Smoking preference
    drinking?: string;        // never, occasionally, frequently
    pets?: boolean;           // Pet preference
    guests?: string;          // rarely, occasionally, frequently
    noise?: string;           // quiet, moderate, loud
  };
}
```

## Deployment

This app can be deployed to Vercel or other Next.js-friendly platforms:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Set up the following environment variables:
   ```
   MONGODB_URI=your-mongodb-connection-string
   NEXTAUTH_SECRET=generated-secret-key
   NEXTAUTH_URL=https://your-deployed-url.com
   ```
4. Deploy!

## 🛠️ Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **MongoDB**: NoSQL database for user data
- **Mongoose**: MongoDB object modeling
- **NextAuth.js**: Authentication for Next.js
- **bcryptjs**: Password hashing

## Final Project Requirements

This project meets the following requirements:

### Frontend/UI
- ✅ **Minimum**: Standards-conform HTML and responsive CSS
  - Well-structured semantic HTML
  - Responsive design for mobile, tablet, and desktop
  - No content cutoff on different screen sizes
  
- ✅ **Expected**: Consistent component styling
  - Tailwind utility classes and custom component styles
  - Consistent color scheme and typography
  - Form elements and cards share visual language

### Backend/Server
- ✅ **Minimum**: Publicly accessible web application
  - Ready to deploy to Vercel or similar platforms
  
- ✅ **Expected**: Server component with centralized data
  - Next.js API routes handle server-side logic
  - MongoDB provides centralized data storage
  - Server-side validation and processing

### Authentication
- ✅ **Minimum**: User data persistence and privacy
  - Data saved to MongoDB
  - Protected routes and API endpoints
  
- ✅ **Expected**: User account system
  - NextAuth.js authentication
  - JWT sessions and secure password handling
  - User-specific data access controls

## 🔮 Future Enhancements

Possible improvements to consider:

1. **Messaging System** - Add direct communication between matched users
2. ~~**Profile Photos**~~ ✅ **IMPLEMENTED!** - Users can now upload and display profile pictures
3. **Advanced Filtering** - Let users filter matches by specific criteria
4. **Notifications** - Alert users of new matches or messages
5. **Social Login** - Add Google, Facebook login options


**Files:**
- `/src/app/api/upload/profile-picture/route.ts` - Handles profile picture uploads
- `/src/app/api/profile-picture/[id]/route.ts` - Serves profile pictures from MongoDB
- `/src/components/profile/ProfilePictureUpload.tsx` - UI component for image uploads
- `/src/app/matches/page.tsx` - Redesigned matches page with profile pictures
- `/src/components/matches/RoommateModal.tsx` - New interactive modal component