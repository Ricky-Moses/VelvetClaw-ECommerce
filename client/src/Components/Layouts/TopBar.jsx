import { FaFacebook } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

const TopBar = () => {
    return (
        <section className="top-bar bg-main-theme text-white">
            <div className="container  flex items-center justify-between !py-3 !px-4 !mx-auto">
                <div className="hidden md:flex items-center space-x-4">
                    <a href="" className="">
                        <FaFacebook className="w-5 h-5" />
                    </a>
                    <a href="" className="">
                        <FaLinkedin className="w-5 h-5" />
                    </a>
                    <a href="" className="">
                        <FaGithub className="w-5 h-5" />
                    </a>
                </div>
                <div className=" flex-grow font-bold text-center">
                    <h1 className="">We Ship Worldwide ── Fast and Reliable Shipping!</h1>
                </div>
                <div className=" hidden md:block font-bold">
                    <a href="tel:+919384956809">
                        +91 938 495 6809
                    </a>
                </div>
            </div>
        </section>
    )
}

export default TopBar