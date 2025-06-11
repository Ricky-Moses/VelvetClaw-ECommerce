import { useForm } from "react-hook-form";
import RegisterImg from "../Assets/register.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../Redux/Slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { mergeCart } from "../Redux/Slice/cartSlice";

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error, user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    watch,
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
  }, [
    cart?.products,
    dispatch,
    guestId,
    isCheckoutRedirect,
    navigate,
    user,
    hasMergedCart,
  ]);

  const onSubmit = async (data) => {
    // console.log("Login Data", data);
    // Add registration logic (API calls)
    try {
      const resultAction = await dispatch(registerUser(data));

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success("Registered successful!", { duration: 2000 });
        reset(); // Reset form only on success
      } else {
        toast.error(
          resultAction.payload?.message ||
            "Registration failed. Please try again.",
          {
            duration: 2000,
          }
        );
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.", {
        duration: 2000,
      });
      console.error("Unexpected error:", err);
    }
  };

  const password = watch("password");
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
            Fill out the form below to create an account
          </p>

          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="input w-full bg-neutral-200 focus:outline-main-theme"
              placeholder="Enter you name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-700 mt-1">{errors.name.message}</p>
            )}
          </div>

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
                  value: /^\S+@\S/i,
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
              placeholder="Create a Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-700 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              className="input w-full bg-neutral-200 focus:outline-main-theme"
              placeholder="Re-enter your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-700 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="">
            {loading ? (
              <button type="button" className="btn w-full bg-success border-0">
                <span className="loading"></span>
                Loading...
              </button>
            ) : error ? (
              <button
                type="button"
                className="btn w-full border-0 disabled:bg-red-800"
              >
                Register Failed
              </button>
            ) : (
              <button
                type="submit"
                className="btn w-full bg-main-theme border-0"
              >
                Register
              </button>
            )}
          </div>
          <p className="mt-6 text-center text-sm">
            Don't have an account?
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-main-theme">
              {" "}
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden lg:block w-1/2">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            className="w-full h-[700px] object-cover object-top"
            src={RegisterImg}
            alt="Register img"
          />
        </div>
      </div>
    </section>
  );
};

export default Register;
