import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { VscCallIncoming } from "react-icons/vsc";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You subscribed to VelvetClaw Online Grand Shopping Mart!");
    setEmail(""); // Clear input field
  };

  return (
    <footer className="border-t border-gray-300 py-12">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start lg:place-items-center !px-4">
        {/* Industrial News */}
        <div className="">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Newsletter</h3>
          <p className="text-gray-500 mb-4">
            Be the first to hear about new products, exclusive events, and
            online offers.
          </p>
          <p className="font-bold">Sign Up and get 10% off your first order.</p>
          {/* Newsletter form */}
          <form
            className="flex items-center gap-1 mt-2"
            onSubmit={handleSubscribe}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="input bg-neutral-200 focus:outline-main-theme"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn bg-main-theme border-none">
              Subscribe
            </button>
          </form>
        </div>
        {/* Shop Links */}
        <div className="">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Shop</h3>
          <ul>
            <li>
              <Link to="/" className="hover:text-main-theme">
                Men's top wear
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-main-theme">
                Women's top wear
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-main-theme">
                Men's bottom wear
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-main-theme">
                Women's top wear
              </Link>
            </li>
          </ul>
        </div>
        {/* Support Links */}
        <div className="">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Support</h3>
          <ul>
            <li>
              <Link to="/" className="hover:text-main-theme">
                Contact US
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-main-theme">
                About US
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-main-theme">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-main-theme">
                Features
              </Link>
            </li>
          </ul>
        </div>
        {/* Follow US */}
        <div className="">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Follow</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-main-theme"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-main-theme"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-main-theme"
            >
              <FaGithub className="w-5 h-5" />
            </a>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Call Us</h3>
          <div className="flex items-center gap-2">
            <span className="">
              <VscCallIncoming className="w-5 h-5" />
            </span>
            <p className="">+91 938 495 6809</p>
          </div>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="container border-t border-gray-200 grid place-items-center mt-12 pt-6">
        <p className="text-gray-500 text-md tracking-wide">
          © 2025, CompileTab, All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
