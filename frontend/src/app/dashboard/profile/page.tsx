"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";

interface Assessment {
  imageUrl: string;
  results: {
    health_assessment: {
      diseases: Array<{
        name: string;
        probability: number;
      }>;
    };
    treatment_plan: any;
  };
  createdAt: string;
}

interface Farmer {
  name: string;
  email: string;
  phone: string;
  location: string;
  healthAssessments: Assessment[];
  createdAt: string;
}

export default function Profile() {
  const router = useRouter();
  const token = localStorage.getItem("token");
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/farmer/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFarmer(response.data.farmer);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, token]);

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
            Loading profile information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-10">
          <div className="h-3 bg-gradient-to-r from-purple-500 to-violet-400"></div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-8 mb-8">
              <div className="bg-purple-100 p-6 rounded-full mb-4 md:mb-0">
                <svg
                  className="w-16 h-16 text-purple-600"
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
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-400 mb-2">
                  {farmer?.name}
                </h1>
                <p className="text-gray-600 flex items-center">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Member since{" "}
                  {new Date(farmer?.createdAt || "").toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  Contact Information
                </h2>
                <div className="space-y-5">
                  <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                    <svg
                      className="w-6 h-6 text-gray-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">
                        {farmer?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                    <svg
                      className="w-6 h-6 text-gray-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-800">
                        {farmer?.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                    <svg
                      className="w-6 h-6 text-gray-500 mr-3"
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
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-800">
                        {farmer?.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Assessment Statistics
                </h2>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-purple-600 mb-3">
                    {farmer?.healthAssessments?.length || 0}
                  </div>
                  <p className="text-purple-800 font-medium mb-4">
                    Total Assessments
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          (farmer?.healthAssessments?.length || 0) * 10,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <div className="text-center mt-2">
                    <button
                      onClick={() => router.push("/dashboard/assess")}
                      className="inline-flex items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      New Assessment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Assessments */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-green-600"
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
          Recent Assessments
        </h2>

        {farmer?.healthAssessments?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="mt-4 text-gray-600 font-medium">
              No assessments found.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Start by assessing your first plant!
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/dashboard/assess")}
                className="inline-flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                New Assessment
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {farmer &&
              farmer.healthAssessments.slice(0, 6).map((assessment, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-56">
                    <img
                      src={`http://localhost:3000${assessment.imageUrl}`}
                      alt={`Plant Assessment ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-plant.jpg";
                      }}
                    />
                    <div
                      className={`absolute top-4 right-4 px-4 py-1.5 rounded-full ${
                        assessment.results.health_assessment.diseases.length ===
                        0
                          ? "bg-gradient-to-r from-green-500 to-emerald-400"
                          : "bg-gradient-to-r from-red-500 to-rose-400"
                      } text-white text-sm font-semibold shadow-md`}
                    >
                      {assessment.results.health_assessment.diseases.length ===
                      0
                        ? "Healthy"
                        : "Unhealthy"}
                    </div>
                  </div>

                  {/* Assessment Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          Assessment #{index + 1}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(assessment.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Disease Information */}
                    <div className="bg-gray-50 p-4 rounded-lg mt-4 mb-4">
                      <p className="text-sm text-gray-600 mb-1">Top Disease:</p>
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-800">
                          {assessment.results.health_assessment.diseases[0]
                            ?.name || "None"}
                        </p>
                        {assessment.results.health_assessment.diseases[0] && (
                          <span className="text-amber-600 font-semibold">
                            {(
                              assessment.results.health_assessment.diseases[0]
                                .probability * 100
                            ).toFixed(1)}
                            %
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => router.push(`/dashboard/history`)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-green-600 transition-colors shadow-sm font-medium flex items-center justify-center"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {farmer && farmer.healthAssessments.length > 6 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/dashboard/history")}
              className="inline-flex items-center py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              View All Assessments
              <svg
                className="w-4 h-4 ml-2"
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
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
