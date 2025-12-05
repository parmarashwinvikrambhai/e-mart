import { assets } from "../assets/assets";

export default function Contact() {
  return (
    <>
      <hr className="border-t border-gray-300" />
      <div className="max-w-6xl mx-auto mt-14 px-4">
        <div className="flex gap-2 items-center justify-center mb-10">
          <h1 className="text-2xl uppercase flex gap-2 tracking-wide">
            <span className="text-gray-400">contact</span>
            <span>us</span>
          </h1>
          <div className="w-10 h-0.5 bg-black"></div>
        </div>
        <div className="flex gap-10">
          <div className="w-[40%]">
            <img src={assets.contact_img} alt="contact us" />
          </div>
          <div className="flex items-center">
            <div className="flex flex-col gap-4">
              <h1 className="text-gray-500 font-bold text-xl">Our Store</h1>
              <div className="text-gray-500">
                <span className="block">54709 Willms Station Suite 350,</span>
                <span className="block">Washington, USA</span>
              </div>
              <div className="text-gray-500">
                <span className="block">Tel: (415) 555-0132</span>
                <span className="block">Email: ashwinparmar.com</span>
              </div>
              <div className="flex flex-col gap-4">
                <h1 className="text-gray-500 font-bold text-xl">
                  Careers at Forever
                </h1>
                <span className="block text-gray-500">
                  Learn more about our teams and job openings.
                </span>
                <div>
                  <button className="border p-3 hover:bg-black hover:text-white transition-all duration-700">
                    Explore job
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-35 flex flex-col justify-center items-center gap-5 mb-32">
          <h1 className="font-bold text-3xl">Subscribe now & get 20% off</h1>
          <span className="block text-gray-500">
            Elevate your everyday style with fashion that feels modern, premium,
            and uniquely you.
          </span>
        </div>
      </div>
    </>
  );
}
