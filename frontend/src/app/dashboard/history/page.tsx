"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface Disease {
  name: string;
  probability: number;
  disease_details?: {
    local_name: string;
    language: string;
  };
}

interface Treatment {
  immediate?: {
    steps?: Array<{
      action: string;
      description: string;
    }>;
  };
  immediate_steps?: Array<{
    step: string;
    description: string;
  }>;
  long_term_prevention?:
    | {
        strategies?: Array<{
          strategy: string;
          description: string;
        }>;
      }
    | Array<{
        strategy: string;
        description: string;
      }>;
  organic_alternatives?:
    | Array<{
        treatment: string;
        description: string;
      }>
    | {
        treatments?: Array<{
          treatment: string;
          description: string;
        }>;
      };
  chemical_solutions?:
    | Array<{
        treatment: string;
        description: string;
      }>
    | {
        treatments?: Array<{
          treatment: string;
          description: string;
        }>;
        caveat?: string;
      };
}

interface Assessment {
  imageUrl: string;
  results: {
    health_assessment: {
      is_healthy: boolean;
      is_healthy_probability: number;
      diseases: Disease[];
    };
    treatment_plan: {
      diagnosis: {
        primary: string;
        secondary: string;
        confidence?: Record<string, string>;
      };
      treatment?: Treatment;
      treatment_plan?: Treatment;
    };
  };
  createdAt: string;
  _id: string;
}

interface FarmerProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  healthAssessments: Assessment[];
  createdAt: string;
}

export default function History() {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(
    null
  );
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/farmer/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(response.data.farmer);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

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
            Loading assessment history...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  const TreatmentModal = ({
    treatment,
    onClose,
  }: {
    treatment: Treatment;
    onClose: () => void;
  }) => {
    const isStepItem = (
      item: any
    ): item is { step: string; description: string } => {
      return "step" in item;
    };

    const getImmediateSteps = () => {
      if (treatment?.immediate_steps) return treatment.immediate_steps;
      if (treatment?.immediate?.steps) return treatment.immediate.steps;
      return [];
    };

    const getLongTermStrategies = () => {
      if (Array.isArray(treatment?.long_term_prevention)) {
        return treatment.long_term_prevention;
      }
      return treatment?.long_term_prevention?.strategies || [];
    };

    const getOrganicTreatments = () => {
      if (Array.isArray(treatment?.organic_alternatives)) {
        return treatment.organic_alternatives;
      }
      return treatment?.organic_alternatives?.treatments || [];
    };

    const getChemicalTreatments = () => {
      if (Array.isArray(treatment?.chemical_solutions)) {
        return treatment.chemical_solutions;
      }
      return treatment?.chemical_solutions?.treatments || [];
    };

    if (!treatment) {
      return (
        <div className="py-12 text-center">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-gray-600 text-lg font-medium">
            No treatment plan available for this assessment.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Immediate Steps */}
        {getImmediateSteps().length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Immediate Steps
            </h3>
            <div className="space-y-4">
              {getImmediateSteps().map((item, index) => (
                <div
                  key={index}
                  className="bg-green-50 p-5 rounded-xl border-l-4 border-green-500 shadow-sm"
                >
                  <h4 className="font-semibold text-gray-800">
                    {isStepItem(item) ? item.step : item.action}
                  </h4>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Long-term Prevention */}
        {getLongTermStrategies().length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Long-term Prevention
            </h3>
            <div className="space-y-4">
              {getLongTermStrategies().map((item, index) => (
                <div
                  key={index}
                  className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500 shadow-sm"
                >
                  <h4 className="font-semibold text-gray-800">
                    {item.strategy}
                  </h4>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Organic Alternatives */}
        {getOrganicTreatments().length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-700 flex items-center">
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
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Organic Solutions
            </h3>
            <div className="space-y-4">
              {getOrganicTreatments().map((item, index) => (
                <div
                  key={index}
                  className="bg-emerald-50 p-5 rounded-xl border-l-4 border-emerald-500 shadow-sm"
                >
                  <h4 className="font-semibold text-gray-800">
                    {item.treatment}
                  </h4>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chemical Solutions */}
        {getChemicalTreatments().length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-700 flex items-center">
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
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              Chemical Solutions
            </h3>
            <div className="space-y-4">
              {getChemicalTreatments().map((item, index) => (
                <div
                  key={index}
                  className="bg-amber-50 p-5 rounded-xl border-l-4 border-amber-500 shadow-sm"
                >
                  <h4 className="font-semibold text-gray-800">
                    {item.treatment}
                  </h4>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </div>
              ))}
              {!Array.isArray(treatment.chemical_solutions) &&
                treatment.chemical_solutions?.caveat && (
                  <div className="bg-amber-100 p-4 rounded-lg border border-amber-300 text-amber-700 text-sm">
                    <strong className="font-semibold">Note:</strong>{" "}
                    {treatment.chemical_solutions.caveat}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Show if no treatment data is available */}
        {!getImmediateSteps().length &&
          !getLongTermStrategies().length &&
          !getOrganicTreatments().length &&
          !getChemicalTreatments().length && (
            <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 text-center">
              <p className="text-gray-700">
                No detailed treatment plan is available for this assessment.
              </p>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
            Assessment History
          </h1>
          <div className="mt-4 md:mt-0 bg-white px-5 py-2 rounded-full shadow-sm text-gray-600 font-medium ring-1 ring-green-100">
            Total Assessments: {profile?.healthAssessments.length || 0}
          </div>
        </div>

        {!profile?.healthAssessments?.length ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
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
              No assessment history found.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Upload a plant image to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profile.healthAssessments.map((assessment) => (
              <div
                key={assessment._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-56">
                  <img
                    src={`http://localhost:3000${assessment.imageUrl}`}
                    alt="Plant Assessment"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-plant.jpg";
                    }}
                  />
                  <div
                    className={`absolute top-4 right-4 px-4 py-1.5 rounded-full ${
                      assessment.results.health_assessment.is_healthy
                        ? "bg-gradient-to-r from-green-500 to-emerald-400"
                        : "bg-gradient-to-r from-red-500 to-rose-400"
                    } text-white text-sm font-semibold shadow-md`}
                  >
                    {assessment.results.health_assessment.is_healthy
                      ? "Healthy"
                      : "Unhealthy"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-5">
                    <div className="text-sm text-gray-500 mb-2 flex items-center">
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
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Health Score
                      </h3>
                      <div
                        className={`text-lg font-bold ${
                          assessment.results.health_assessment.is_healthy
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {(
                          assessment.results.health_assessment
                            .is_healthy_probability * 100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Primary Issue */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-600 mb-1">
                        Primary Issue
                      </h4>
                      <p className="text-gray-800 font-medium">
                        {assessment.results.treatment_plan.diagnosis.primary}
                      </p>
                    </div>

                    {/* Secondary Issue */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-600 mb-1">
                        Secondary Issue
                      </h4>
                      <p className="text-gray-800 font-medium">
                        {assessment.results.treatment_plan.diagnosis.secondary}
                      </p>
                    </div>

                    {/* Top Disease */}
                    {assessment.results.health_assessment.diseases[0] && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-600 mb-1">
                          Top Disease
                        </h4>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-800 font-medium">
                            {
                              assessment.results.health_assessment.diseases[0]
                                .name
                            }
                          </p>
                          <span className="text-amber-600 font-semibold">
                            {(
                              assessment.results.health_assessment.diseases[0]
                                .probability * 100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => {
                      const treatmentData =
                        assessment.results.treatment_plan.treatment ||
                        assessment.results.treatment_plan.treatment_plan;
                      if (treatmentData) {
                        setSelectedTreatment(treatmentData);
                      } else {
                        // Create a default empty treatment object if neither property exists
                        setSelectedTreatment({});
                      }
                    }}
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    View Treatment Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedTreatment && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                  Treatment Plan
                </h2>
                <button
                  onClick={() => setSelectedTreatment(null)}
                  className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <TreatmentModal
                treatment={selectedTreatment}
                onClose={() => setSelectedTreatment(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
