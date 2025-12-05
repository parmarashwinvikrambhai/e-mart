import { assets } from "../assets/assets";

function OurPolicy() {
  return (
    <div className=" flex justify-around">
      <div className="flex flex-col items-center gap-7">
        <img src={assets.exchange_icon} className="h-12 w-12" alt="exchange" />
        <div className="flex flex-col items-center">
          <span className="capitalize font-bold">Easy Exchange Policy</span>
          <span className="text-gray-400">
            We offer hassle free exchange policy
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-7">
        <img src={assets.quality_icon} className="h-12 w-12" alt="exchange" />
        <div className="flex flex-col items-center">
          <span className="capitalize font-bold">7 Days Return Policy</span>
          <span className="text-gray-400">
            We provide 7 days free return policy
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-7">
        <img src={assets.support_img} className="h-12 w-12" alt="exchange" />
        <div className="flex flex-col items-center">
          <span className="capitalize font-bold">Best customer support</span>
          <span className="text-gray-400">
            we provide 24/7 customer support
          </span>
        </div>
      </div>
    </div>
  );
}

export default OurPolicy;
