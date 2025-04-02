"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Function to check auth state
  const checkAuthState = () => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);

      // Get user name from localStorage if available
      try {
        const farmerData = localStorage.getItem("farmer");
        if (farmerData) {
          const farmer = JSON.parse(farmerData);
          setUserName(farmer.name || "");
        }
      } catch (error) {
        console.error("Error parsing farmer data:", error);
      }
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
    setIsLoading(false);
  };

  // Check auth state on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  // Add a focus event listener to recheck auth when the window regains focus
  useEffect(() => {
    const handleFocus = () => {
      checkAuthState();
    };

    window.addEventListener("focus", handleFocus);

    // Custom event for auth state changes
    window.addEventListener("authChange", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("authChange", handleFocus);
    };
  }, []);

  function handleClick() {
    router.push("/");
  }

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1
              className="text-2xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400"
              onClick={handleClick}
            >
              FarmAssist
            </h1>
          </div>

          {!isLoading && (
            <>
              {isLoggedIn ? (
                <div className="flex items-center">
                  {/* Welcome message on larger screens */}
                  {userName && (
                    <span className="hidden md:block mr-4 text-gray-600">
                      Welcome,{" "}
                      <span className="font-medium text-green-600">
                        {userName}
                      </span>
                    </span>
                  )}

                  <div className="flex items-center space-x-1">
                    <NavLink
                      href="/dashboard"
                      label="Dashboard"
                      icon={
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      }
                    />

                    <NavLink
                      href="/dashboard/assess"
                      label="Assess"
                      icon={
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      }
                    />

                    <NavLink
                      href="/dashboard/history"
                      label="History"
                      icon={
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      }
                    />

                    <NavLink
                      href="/dashboard/profile"
                      label="Profile"
                      icon={
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      }
                    />

                    <button
                      onClick={() => {
                        localStorage.clear();
                        setIsLoggedIn(false);
                        router.push("/login");
                      }}
                      className="inline-flex items-center px-4 py-2 ml-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-400 hover:from-red-600 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-all duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="hidden md:block">
                    <span className="text-gray-600 mr-4">
                      Ready to get started?
                    </span>
                  </div>
                  <button
                    onClick={() => router.push("/login")}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Login
                  </button>
                  <button
                    onClick={() => router.push("/register")}
                    className="inline-flex items-center px-4 py-2 border border-green-500 rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Register
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// Helper component for navigation links
function NavLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
    >
      {icon}
      <span className="ml-2 hidden md:block">{label}</span>
    </button>
  );
}
