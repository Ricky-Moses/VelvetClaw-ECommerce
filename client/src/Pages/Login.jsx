import { useForm } from "react-hook-form";
import LoginImg from "../Assets/login.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Redux/Slice/authSlice";
import { mergeCart } from "../Redux/Slice/cartSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error, user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [hasMergedCart, setHasMergedCart] = useState(false); // Track cart merge

  // Parse redirect URL with validation
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user && cart?.products?.length > 0 && guestId && !hasMergedCart) {
      dispatch(mergeCart({ guestId, user }))
        .then(() => {
          setHasMergedCart(true); // Prevent re-merging
          toast.success("Cart merged successfully!", { duration: 1000 });
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        })
        .catch((err) => {
          toast.error("Failed to merge cart. Please try again.", {
            duration: 2000,
          });
          console.error("Cart merge error:", err);
        });
    } else if (user && !cart?.products?.length) {
      navigate(isCheckoutRedirect ? "/checkout" : "/");
    }
  }, [cart?.products, dispatch, guestId, isCheckoutRedirect, navigate, user, hasMergedCart]);

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(loginUser(data));

      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Login successful!", { duration: 2000 });
        reset(); // Reset form only on success
      } else {
        toast.error(resultAction.payload?.message || "Login failed. Please try again.", {
          duration: 2000,
        });
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.", {
        duration: 2000,
      });
      console.error("Unexpected error:", err);
    }
  };

  return (
    <section className="flex">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-3xl font-bold text-main-theme small-caps">
              VelvetClaw
            </h2>
          </div>
          <h2 className="text-xl font-bold text-center mb-6">Hey there! 👋🏻</h2>
          <p className="text-center mb-6">
            Enter your username and password to login
          </p>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              className="input w-full bg-neutral-200 focus:outline-main-theme"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-700 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              className="input w-full bg-neutral-200 focus:outline-main-theme"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-700 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-700 text-center mb-4">
              {error.message || "Login failed. Please try again."}
            </p>
          )}

          <div>
            <button
              type="submit"
              className={`btn w-full border-0 ${loading
                ? "bg-success cursor-not-allowed"
                : error
                  ? "bg-red-800"
                  : "bg-main-theme"
                }`}
            >
              {loading ? (
                <>
                  <span className="loading"></span>
                  Loading...
                </>
              ) : error ? (
                "Try Again"
              ) : (
                "Login"
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-sm">
            Don't have an account?
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-main-theme"
            >
              {" "}
              Register
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden lg:block w-1/2">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            className="w-full h-[700px] object-cover object-top"
            src={LoginImg}
            alt="Login illustration"
          />
        </div>
      </div>
    </section>
  );
};

export default Login;