import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Index from "./general/Index";
import Header from "./general/partials/header";
import Footer from "./general/partials/footer";
import Portfolio from "./general/portfolio";
import Contact from "./general/contact";
import AboutUs from "./general/aboutUs";
import Adminroute from "./route/adminRoute";
import PrivateRoute from "./utilities/authPrivate";
import { AuthProvider } from "./utilities/authContext";
import HireUs from "./general/hireUs";
import Pricing from "./general/pricing";
import NotFound from "./general/notFound";
import Login from "./auth/login";
import Page from "./general/page";
import Book from "./general/book";
import Blog from "./general/blog";

// Layout wrapper to conditionally hide header/footer
function Layout({ children }) {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/admin/login" ||
   location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/hire-us" element={<HireUs />} />
          <Route path="/page/:slug" element={<Page />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/book-a-consultation" element={<Book />} />
          <Route path="/admin/login" element={<Login />} />
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
          {/* Protected Admin Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard/*" element={<Adminroute />} />
              </Route>
        </Routes>
      </Layout>
      </AuthProvider>
    </Router>
  );
}
