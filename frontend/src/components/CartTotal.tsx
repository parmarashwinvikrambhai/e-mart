import { useNavigate } from "react-router-dom";

interface CartTotalProps {
  subtotal?: number; // make optional just in case
  redirectTo: string;
  btnText: string;
  onClick?: () => Promise<boolean>;
}

function CartTotal({ subtotal = 0, redirectTo, btnText,onClick}: CartTotalProps) {
  const navigate = useNavigate();

  // Hardcoded shipping for simplicity
  const shippingFee = 10;
  const total = subtotal + shippingFee;

  const handleClick = async () => {
    if (onClick) {
      const success = await onClick(); 
      if (!success) return;
    }
    navigate(redirectTo); 
  };

 return (
    <div className="flex flex-col items-end mb-32 mr-10">
      <div className="w-full max-w-lg flex flex-col p-6 shadow-md bg-white">
        <div className="flex gap-2 items-center mb-6">
          <h1 className="text-2xl uppercase flex gap-2 tracking-wide font-semibold text-gray-800">
            <span>cart</span>
            <span className="text-gray-400">total</span>
          </h1>
          <div className="w-10 h-0.5 bg-black"></div>
        </div>

        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-base text-gray-700 font-medium">Subtotal</span>
          <span className="text-base text-gray-900 font-semibold">
            $ {subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between py-2 border-b border-gray-100 mt-2">
          <span className="text-base text-gray-700 font-medium">
            Shipping Fee
          </span>
          <span className="text-base text-gray-900 font-semibold">
            $ {shippingFee.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between mt-4">
          <span className="text-lg font-bold">Total</span>
          <span className="text-lg font-medium text-red-600">
            $ {total.toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col items-end mt-8">
          <button
            onClick={handleClick}
            className="py-3 px-2 bg-black text-white uppercase font-bold rounded-md hover:bg-gray-800 transition duration-300"
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartTotal;
