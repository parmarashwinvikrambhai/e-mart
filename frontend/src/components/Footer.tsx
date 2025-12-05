import { Instagram, Mail, PhoneCall } from "lucide-react";
import { assets } from "../assets/assets";

function Footer() {
  return (
    <div className="grid grid-cols-3 gap-5 py-8 text-sm">
      <div className="flex flex-col gap-4">
        <img src={assets.logo} alt="Logo" className="w-36" />
        <span className="text-sm text-gray-600 leading-6">
          Where premium fashion meets modern elegance. Where every trend is
          crafted with perfection. Where style becomes your everyday statement.
          And you discover a new you in every look.
        </span>
      </div>

      <div className="flex flex-col items-center gap-4">
        <h3 className="font-semibold text-lg uppercase">Company</h3>
        <div className="flex flex-col text-gray-700">
          <span>Home</span>
          <span>Contact</span>
          <span>Careers</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-start">
        <h3 className="font-semibold text-lg uppercase">GET IN TOUCH</h3>
        <div className="flex flex-col text-gray-700">
          <div className="flex items-center gap-2">
            <PhoneCall size={18} />
            <span>+1-000-000-0000</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={18} />
            <span>ashwinparmar@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Instagram size={18} />
            <span>Instagram</span>
          </div>
        </div>
      </div>
      <hr className="col-span-3 border-t border-gray-300" />
        <div className="flex col-span-3 justify-center">
        <span>
          Copyright 2024@ ashwinparmar.dev - All Right Reserved.
        </span>
      </div>
    </div>
  );
}

export default Footer;
