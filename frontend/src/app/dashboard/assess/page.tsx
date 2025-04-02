"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/page";
interface AssessmentResponse {
  health_assessment: {
    is_healthy: boolean;
    is_healthy_probability: number;
    diseases: Array<{
      name: string;
      probability: number;
      disease_details?: {
        local_name: string;
        language: string;
      };
    }>;
  };
  treatment_plan: {
    diagnosis: {
      primary: string;
      secondary: string;
      confidence: Record<string, string>;
    };
    treatment?: {
      immediate?: {
        steps?: Array<{
          action: string;
          description: string;
        }>;
      };
      long_term_prevention?: {
        strategies?: Array<{
          strategy: string;
          description: string;
        }>;
      };
      organic_alternatives?: {
        treatments?: Array<{
          treatment: string;
          description: string;
        }>;
      };
    };
    treatment_plan?: {
      immediate?: {
        steps?: Array<{
          action: string;
          description: string;
        }>;
      };
      long_term_prevention?: {
        strategies?: Array<{
          strategy: string;
          description: string;
        }>;
      };
      organic_alternatives?: {
        treatments?: Array<{
          treatment: string;
          description: string;
        }>;
      };
    };
  };
}

export default function Assess() {
  const farmerId = localStorage.getItem("farmerId");
  const token = localStorage.getItem("token");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AssessmentResponse | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setInitialLoading(false);
  }, [router]);

  if (initialLoading) {
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
            Preparing assessment tool...
          </p>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("farmerId", farmerId || "");

      const response = await axios.post(
        "http://localhost:3001/api/assess-plant",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
      // Scroll to results after a short delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to assess plant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-10">
          <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-400"></div>
          <div className="p-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 mb-8">
              Plant Health Assessment
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700">
                  Upload Plant Image
                </label>
                <div className="mt-1 flex justify-center p-8 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors">
                  <div className="space-y-2 text-center">
                    {preview ? (
                      <div className="relative">
                        <img
                          src={preview}
                          alt="Preview"
                          className="mx-auto h-64 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreview(null);
                            setImage(null);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-red-500 hover:bg-red-100 focus:outline-none"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <svg
                        className="mx-auto h-16 w-16 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer py-2 px-4 rounded-md font-medium text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 transition-colors"
                      >
                        <span>Upload an image</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    {!preview && (
                      <p className="text-gray-500 text-sm mt-4">
                        Upload a clear image of the plant for best results
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 p-4 rounded-lg text-red-600 text-sm border border-red-200">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !image}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white ${
                  loading || !image
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transform hover:-translate-y-0.5"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Analyzing plant...
                  </div>
                ) : (
                  <div className="flex items-center">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    Assess Plant
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div
            ref={resultsRef}
            className="bg-white rounded-2xl shadow-md overflow-hidden mb-10"
          >
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-400"></div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Assessment Results
              </h2>

              {/* Health Status */}
              <div className="mb-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      result.health_assessment.is_healthy
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <h3 className="text-xl font-semibold">
                    {result.health_assessment.is_healthy
                      ? "Healthy Plant"
                      : "Unhealthy Plant"}
                  </h3>
                  <div
                    className={`ml-auto text-lg font-bold ${
                      result.health_assessment.is_healthy
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(
                      result.health_assessment.is_healthy_probability * 100
                    ).toFixed(1)}
                    %
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      result.health_assessment.is_healthy
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                    style={{
                      width: `${
                        result.health_assessment.is_healthy_probability * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Diagnosis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Primary Issue
                    </h4>
                    <p className="text-gray-800">
                      {result.treatment_plan.diagnosis.primary}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-indigo-500 shadow-sm">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Secondary Issue
                    </h4>
                    <p className="text-gray-800">
                      {result.treatment_plan.diagnosis.secondary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Diseases */}
              {result.health_assessment.diseases.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Detected Diseases
                  </h3>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Disease
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Probability
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.health_assessment.diseases.map(
                            (disease, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {disease.name}
                                  </div>
                                  {disease.disease_details?.local_name && (
                                    <div className="text-sm text-gray-500">
                                      {disease.disease_details.local_name} (
                                      {disease.disease_details.language})
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900 mr-2">
                                      {(disease.probability * 100).toFixed(1)}%
                                    </span>
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{
                                          width: `${
                                            disease.probability * 100
                                          }%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Treatment Plan */}
              {(() => {
                // Get the treatment object from either possible structure
                const treatmentObj =
                  result.treatment_plan.treatment ||
                  result.treatment_plan.treatment_plan;

                if (!treatmentObj) {
                  return (
                    <div className="space-y-8">
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-green-600"
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
                        Treatment Plan
                      </h3>
                      <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 text-center">
                        <p className="text-gray-700">
                          No detailed treatment plan is available for this
                          assessment.
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-600"
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
                      Treatment Plan
                    </h3>

                    {/* Immediate Steps */}
                    {treatmentObj.immediate?.steps &&
                      treatmentObj.immediate.steps.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-4 text-green-700">
                            Immediate Steps
                          </h4>
                          <div className="space-y-4">
                            {treatmentObj.immediate.steps.map((step, index) => (
                              <div
                                key={index}
                                className="bg-green-50 p-5 rounded-xl border-l-4 border-green-500 shadow-sm"
                              >
                                <h5 className="font-semibold text-gray-800">
                                  {step.action}
                                </h5>
                                <p className="text-gray-600 mt-2">
                                  {step.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Long-term Prevention */}
                    {treatmentObj.long_term_prevention?.strategies &&
                      treatmentObj.long_term_prevention.strategies.length >
                        0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-4 text-blue-700">
                            Long-term Prevention
                          </h4>
                          <div className="space-y-4">
                            {treatmentObj.long_term_prevention.strategies.map(
                              (strategy, index) => (
                                <div
                                  key={index}
                                  className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500 shadow-sm"
                                >
                                  <h5 className="font-semibold text-gray-800">
                                    {strategy.strategy}
                                  </h5>
                                  <p className="text-gray-600 mt-2">
                                    {strategy.description}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Organic Alternatives */}
                    {treatmentObj.organic_alternatives?.treatments &&
                      treatmentObj.organic_alternatives.treatments.length >
                        0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-4 text-emerald-700">
                            Organic Solutions
                          </h4>
                          <div className="space-y-4">
                            {treatmentObj.organic_alternatives.treatments.map(
                              (treatment, index) => (
                                <div
                                  key={index}
                                  className="bg-emerald-50 p-5 rounded-xl border-l-4 border-emerald-500 shadow-sm"
                                >
                                  <h5 className="font-semibold text-gray-800">
                                    {treatment.treatment}
                                  </h5>
                                  <p className="text-gray-600 mt-2">
                                    {treatment.description}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* No treatment plan message */}
                    {!treatmentObj.immediate?.steps?.length &&
                      !treatmentObj.long_term_prevention?.strategies?.length &&
                      !treatmentObj.organic_alternatives?.treatments
                        ?.length && (
                        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 text-center">
                          <p className="text-gray-700">
                            No detailed treatment plan is available for this
                            assessment.
                          </p>
                        </div>
                      )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
