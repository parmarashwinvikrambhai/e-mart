import { assets } from "../assets/assets";

function Banner() {
  return (
    <div className="border border-gray-400 grid grid-cols-2 mt-6">
      <div className="flex justify-center flex-col items-start m-auto gap-2">
        <div className=" flex flex-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-px bg-black "></div>
            <span className="text-gray-800 font-medium  uppercase">
              our bestsellers
            </span>
          </div>
        </div>
        <div>
          <h1 className="capitalize text-5xl font-serif text-gray-700 font-medium">
            latest arrivals
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="uppercase text-gray-800 font-medium">shop now</span>
          <div className="w-10 h-px bg-black "></div>
        </div>
      </div>
      <div>
        <img
          src={assets.hero_img}
          alt="image"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Banner