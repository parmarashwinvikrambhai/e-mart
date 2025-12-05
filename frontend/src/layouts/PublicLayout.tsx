import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PublicLayout() {
  return (
    <div className="max-w-7xl mx-auto px-10">
      <Navbar />
      <main>
        <Outlet /> {/* yahan child pages render honge */}
      </main>
      <Footer />
    </div>
  );
}
