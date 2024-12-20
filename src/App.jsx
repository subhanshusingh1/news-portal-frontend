import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import Navbar from "./pages/Navbar";
import HighlightedNews from "./pages/HighlightedNews.jsx";
import EditorsPicks from "./pages/EditorsPicks";
import Dashboard from "./pages/Dashboard.jsx";
import { SignedIn } from "@clerk/clerk-react"; // Import SignedIn for protected route
import NewsSection from "./pages/NewsSection.jsx";
import Events from "./pages/Events.jsx";
import AuthPage from "./pages/AuthPage"; // Import the new AuthPage component
import AboutUs from "./pages/AboutUs.jsx"; // Import the new AuthPage component
import Region from "./pages/Region.jsx";
import Footer from "./pages/footer/Footer.jsx";
import CreateNews from "./pages/createNews.jsx";

function App() {
  return (
    <Router>
      {/* Navbar is always visible */}
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <>
              <HighlightedNews /> {/* Visible to everyone */}
              <EditorsPicks /> {/* Visible to everyone */}
            </>
          }
        />
        <Route path="/events/:eventId" element={<Events />} />
        <Route path="/news/:newsId" element={<NewsSection/>} />
        <Route path="/about" element={<AboutUs />} />

        <Route path="/region/:regionType/:id" element={<Region />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <Dashboard /> {/* Only visible when signed in */}
            </SignedIn>
          }
        />

        {/* Auth-related routes */}
        <Route path="/sign-in" element={<AuthPage isSignUp={false} />} />
        <Route path="/sign-up" element={<AuthPage isSignUp={true} />} />


        <Route path="/create-news" element={<CreateNews />} />


           {/* Catch-all route for invalid paths */}
           <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
