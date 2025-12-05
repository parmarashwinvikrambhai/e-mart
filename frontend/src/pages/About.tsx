import { assets } from "../assets/assets";

export default function About() {
  return (
    <>
      <hr className="border-t border-gray-300" />

      <div className="max-w-6xl mx-auto mt-14 px-4">
        {/* Heading */}
        <div className="flex gap-2 items-center justify-center mb-10">
          <h1 className="text-2xl uppercase flex gap-2 tracking-wide">
            <span className="text-gray-400">about</span>
            <span>us</span>
          </h1>
          <div className="w-10 h-0.5 bg-black"></div>
        </div>

        {/* Image + Content Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <img
              src={assets.about_img}
              alt="about"
              className="w-full h-auto rounded-md object-cover"
            />
          </div>

          <div className="text-gray-700 leading-7 text-[15px]">
            <p>
              Forever was born out of a passion for innovation and a desire to
              revolutionize the way people shop online. Our journey began with a
              simple idea: to provide a platform where customers can easily
              discover, explore, and purchase a wide range of products from the
              comfort of their homes.
            </p>

            <p className="mt-4">
              Since our inception, we've worked tirelessly to curate a diverse
              selection of high-quality products that cater to every taste and
              preference. From fashion and beauty to electronics and home
              essentials, we offer an extensive collection sourced from trusted
              brands and suppliers.
            </p>

            <h2 className="mt-5 font-semibold text-gray-900">Our Mission</h2>

            <p className="mt-2">
              Our mission at Forever is to empower customers with choice,
              convenience, and confidence. We're dedicated to providing a
              seamless shopping experience that exceeds expectations, from
              browsing and ordering to delivery and beyond.
            </p>
          </div>
        </div>
        <div className="mb-32">
          <div className="flex gap-2 items-center mb-10 mt-15">
            <h1 className="text-2xl uppercase flex gap-2 tracking-wide">
              <span className="text-gray-400">why </span>
              <span>choose us</span>
            </h1>
            <div className="w-10 h-0.5 bg-black"></div>
          </div>
          <div className="grid grid-cols-3">
            <div className="h-60 border border-gray-300 flex flex-col items-center justify-center p-10 gap-5">
              <h1 className="font-medium text-sm capitalize">
                Quality Assurance:
              </h1>
              <p className="text-sm text-gray-600 text-start">
                We meticulously select and vet each product to ensure it meets
                our stringent quality standards.
              </p>
            </div>
            <div className="h-60 border border-gray-300 flex flex-col items-center justify-center p-10 gap-5">
              <h1 className="font-medium text-sm capitalize">Convenience:</h1>
              <p className="text-sm text-gray-600 text-start">
                With our user-friendly interface and hassle-free ordering
                process, shopping has never been easier.
              </p>
            </div>
            <div className="h-60 border border-gray-300 flex flex-col items-center justify-center p-10 gap-5">
              <h1 className="font-medium text-sm capitalize">
                Exceptional Customer Service:
              </h1>
              <p className="text-sm text-gray-600 text-start">
                Our team of dedicated professionals is here to assist you the
                way, ensuring your satisfaction is our top priority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
