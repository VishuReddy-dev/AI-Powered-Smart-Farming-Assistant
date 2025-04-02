"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [farmer, setFarmer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Get farmer data from localStorage
    const farmerData = localStorage.getItem("farmer");
    console.log("Raw farmer data:", farmerData);
    if (farmerData) {
      try {
        const parsed = JSON.parse(farmerData);
        console.log("Parsed farmer data:", parsed);
        setFarmer(parsed);
      } catch (error) {
        console.error("Error parsing farmer data:", error);
      }
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-green-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg text-gray-600 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                Welcome back, {farmer?.name || "Farmer"}! 👋
              </h2>
              <p className="text-gray-600 text-lg">
                What would you like to do today?
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => router.push("/dashboard/assess")}
                className="inline-flex items-center px-5 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all duration-200 transform hover:-translate-y-1"
              >
                <svg
                  className="w-5 h-5 mr-2"
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
                New Assessment
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Plant Assessment Card */}
          <div
            onClick={() => router.push("/dashboard/assess")}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-400"></div>
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <svg
                    className="w-8 h-8 text-green-600"
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
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-800">
                  New Assessment
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Upload a plant image to get instant disease detection and
                treatment recommendations.
              </p>
              <div className="flex justify-end">
                <span className="text-green-600 font-medium flex items-center">
                  Get started
                  <svg
                    className="w-5 h-5 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* History Card */}
          <div
            onClick={() => router.push("/dashboard/history")}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-400"></div>
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <svg
                    className="w-8 h-8 text-blue-600"
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
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-800">
                  Assessment History
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                View your past assessments, track plant health over time, and
                access treatment plans.
              </p>
              <div className="flex justify-end">
                <span className="text-blue-600 font-medium flex items-center">
                  View history
                  <svg
                    className="w-5 h-5 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div
            onClick={() => router.push("/dashboard/profile")}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="h-3 bg-gradient-to-r from-purple-500 to-violet-400"></div>
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-4 rounded-full">
                  <svg
                    className="w-8 h-8 text-purple-600"
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
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-800">
                  Profile Settings
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Update your personal information, manage preferences, and view
                account details.
              </p>
              <div className="flex justify-end">
                <span className="text-purple-600 font-medium flex items-center">
                  Edit profile
                  <svg
                    className="w-5 h-5 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Activity</h3>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
            <div className="p-8 text-center">
              <span className="text-4xl font-bold text-green-600 block mb-2">
                {farmer?.healthAssessments?.length || 0}
              </span>
              <p className="text-gray-600 font-medium">Total Assessments</p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: farmer?.healthAssessments?.length
                        ? `${Math.min(
                            farmer.healthAssessments.length * 10,
                            100
                          )}%`
                        : "0%",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Location section */}
            <div className="p-8 text-center">
              <div className="flex justify-center mb-2">
                <svg
                  className="w-10 h-10 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Location</p>
              <p className="text-lg font-semibold mt-2">
                {farmer?.location || "Not set"}
              </p>
            </div>

            {/* Member Since section */}
            <div className="p-8 text-center">
              <span className="text-sm font-medium text-gray-500 block mb-2">
                Member Since
              </span>
              <p className="text-lg font-semibold">
                {farmer?.createdAt
                  ? new Date(farmer.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
              <div className="mt-4 inline-block bg-green-100 px-3 py-1 rounded-full text-sm text-green-800 font-medium">
                Active Account
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
