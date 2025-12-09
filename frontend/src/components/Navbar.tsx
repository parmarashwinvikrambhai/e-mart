import { assets } from "../assets/assets";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Handbag, Search, UserRound } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../services/apiClient";
import toast from "react-hot-toast";
import { logoutUser } from "../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { setCart } from "../redux/slices/cartSlice";

interface RootState {
  auth: {
    isAuthenticated: boolean; 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
  };
  cart: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[];
  };
}

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access the authentication status from the Redux store
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axiosInstance.get("/cart", {
          withCredentials: true,
        });
        dispatch(setCart(res.data.cartData || res.data.cart));
      } catch (err) {
        
        console.error("Failed to fetch cart:", err);
      }
    };

    //  CONDITIONALLY call fetchCart only if the user is authenticated (Fixes 401 Cart Fetch issue)
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear the cart state in Redux if the user is logged out
      dispatch(setCart([]));
    }
  }, [dispatch, isAuthenticated]);

  const cartCount = useSelector((state: RootState) =>
    state.cart.items // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((item: any) => item.quantity > 0) // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((acc: number, item: any) => acc + item.quantity, 0)
  );

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(logoutUser());
      // Also ensure cart is cleared on successful logout
      dispatch(setCart([]));
      toast.success("Logout successfully", {
        style: {
          borderRadius: "8px",
          background: "#1e40af",
          color: "#fff",
          fontWeight: 600,
          padding: "12px 16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#1e40af",
        },
      });
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-10 py-3 flex items-center justify-between mt-5">
      <div>
        <img src={assets.logo} alt="Logo" className="w-36" />
      </div>

      {/* Middle Links */}
      <ul className="flex gap-10">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => `relative inline-block pb-1 ${
              isActive
                ? "text-black font-semibold after:w-full"
                : "text-gray-700 hover:text-black after:w-0 hover:after:w-full"
            }
                          after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-black 
                          after:transition-all after:duration-300`}
          >
            HOME
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/collection"
            className={({ isActive }) => `relative inline-block pb-1 ${
              isActive
                ? "text-black font-semibold after:w-full"
                : "text-gray-700 hover:text-black after:w-0 hover:after:w-full"
            }
                          after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-black 
                          after:transition-all after:duration-300`}
          >
            COLLECTION
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => `relative inline-block pb-1 ${
              isActive
                ? "text-black font-semibold after:w-full"
                : "text-gray-700 hover:text-black after:w-0 hover:after:w-full"
            }
                          after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-black 
                          after:transition-all after:duration-300`}
          >
            ABOUT
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) => `relative inline-block pb-1 ${
              isActive
                ? "text-black font-semibold after:w-full"
                : "text-gray-700 hover:text-black after:w-0 hover:after:w-full"
            }
                          after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-black 
                          after:transition-all after:duration-300`}
          >
            CONTACT
          </NavLink>
        </li>
      </ul>

      {/* Search + Icons */}
      <div className="flex gap-5 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            className="border border-gray-400 p-2 w-[350px] rounded outline-none pl-10 text-gray-600"
          />
        </div>

        {/* USER ICON DROPDOWN USING HEADLESS UI */}
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button>
            <UserRound className="cursor-pointer focus:outline-none" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-1 mt-3 w-40 origin-top-right bg-white border border-gray-400 rounded-md shadow-lg focus:outline-none">
              <div className="py-1">
                {/* CONDITIONAL RENDERING STARTS HERE */}
                {isAuthenticated ? (
                  <>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`block px-4 py-2 text-sm ${
                            active ? "bg-gray-100" : ""
                          }`}
                        >
                          Profile
                        </Link>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/orders"
                          className={`block px-4 py-2 text-sm ${
                            active ? "bg-gray-100" : ""
                          }`}
                        >
                          Orders
                        </Link>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            active ? "bg-gray-100" : ""
                          }`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </>
                ) : (
                  // Logged Out State: Show Login/Sign Up
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/login"
                        className={`block px-4 py-2 text-sm ${
                          active ? "bg-gray-100" : ""
                        }`}
                      >
                        Login / Sign Up
                      </Link>
                    )}
                  </Menu.Item>
                )}
                {/* CONDITIONAL RENDERING ENDS HERE */}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* CART ICON */}
        <div className="relative cursor-pointer">
          <div onClick={() => navigate("/cart")} className="cursor-pointer">
            <Handbag />
          </div>

          <span className="absolute -top-3 -right-3 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
