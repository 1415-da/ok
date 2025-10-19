import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  CheckCircle,
  ArrowLeft,
  Loader2,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Eye,
  Award,
  ShieldAlert,
} from "lucide-react";
import Papa from "papaparse";
import toast from "react-hot-toast";

interface CSVRow {
  [key: string]: string | number;
}

interface ResultData {
  beneficiaryId: string;
  scoreB: number;
  scoreR: number;
  scoreD: number;
  scoreA: number;
  metaProb: number;
  ruleRiskScore: number;
  finalFraudScore: number;
  riskLevel: "High" | "Medium" | "Low";
}

export default function ResultsPage() {
  const { workflowId } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ResultData[]>([]);
  const [viewMode, setViewMode] = useState<"summary" | "detail">("summary");
  const [selectedResult, setSelectedResult] = useState<ResultData | null>(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);

      // Load the final_score.csv from assets
      const response = await fetch("/assets/final_score.csv");
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (parsed) => {
          const data: ResultData[] = parsed.data.map((row: any) => {
            const finalScore = parseFloat(
              row["final_fraud_score"] || row["final_fraud_score"] || 0,
            );
            return {
              beneficiaryId:
                row["Beneficiary ID"] || row["beneficiary_id"] || "N/A",
              scoreB: parseFloat(row["score_b"] || 0),
              scoreR: parseFloat(row["score_r"] || 0),
              scoreD: parseFloat(row["score_d"] || 0),
              scoreA: parseFloat(row["score_a"] || 0),
              metaProb: parseFloat(row["meta_prob"] || 0),
              ruleRiskScore: parseFloat(row["rule_risk_score"] || 0),
              finalFraudScore: finalScore,
              riskLevel:
                finalScore > 50 ? "High" : finalScore > 30 ? "Medium" : "Low",
            };
          });
          setResults(data);
          toast.success("Results loaded successfully!");
        },
        error: (error) => {
          // console.error("CSV Parse Error:", error);
          toast.error("Failed to parse results");
        },
      });
    } catch (error) {
      // console.error("Error loading results:", error);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-error-600 bg-error-50 border-error-200";
      case "Medium":
        return "text-warning-600 bg-warning-50 border-warning-200";
      case "Low":
        return "text-success-600 bg-success-50 border-success-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "High":
        return <ShieldAlert className="w-5 h-5" />;
      case "Medium":
        return <AlertTriangle className="w-5 h-5" />;
      case "Low":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const calculateStats = () => {
    const high = results.filter((r) => r.riskLevel === "High").length;
    const medium = results.filter((r) => r.riskLevel === "Medium").length;
    const low = results.filter((r) => r.riskLevel === "Low").length;
    const avgScore =
      results.reduce((sum, r) => sum + r.finalFraudScore, 0) / results.length ||
      0;

    return { high, medium, low, avgScore };
  };

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(results);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fraud_analysis_results_${workflowId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Results downloaded!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-success-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-ghost mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Fraud Detection Results
              </h1>
              <p className="text-gray-600 text-lg">
                Workflow ID:{" "}
                <span className="font-mono text-primary-600">
                  {workflowId?.substring(0, 12)}...
                </span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-success-50 rounded-lg border border-success-200">
                <CheckCircle className="w-5 h-5 text-success-600" />
                <span className="text-success-700 font-medium">Completed</span>
              </div>
              <button onClick={handleDownloadCSV} className="btn btn-primary">
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-info-100">
                <BarChart3 className="w-6 h-6 text-info-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Records
            </h3>
            <p className="text-3xl font-bold text-gray-900">{results.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-error-100">
                <ShieldAlert className="w-6 h-6 text-error-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              High Risk
            </h3>
            <p className="text-3xl font-bold text-error-600">{stats.high}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-warning-100">
                <AlertTriangle className="w-6 h-6 text-warning-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Medium Risk
            </h3>
            <p className="text-3xl font-bold text-warning-600">
              {stats.medium}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-success-100">
                <Award className="w-6 h-6 text-success-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Low Risk</h3>
            <p className="text-3xl font-bold text-success-600">{stats.low}</p>
          </motion.div>
        </div>

        {/* Average Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Average Fraud Score
              </h3>
              <p className="text-4xl font-bold text-primary-600">
                {stats.avgScore.toFixed(2)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/50">
              <TrendingUp className="w-12 h-12 text-primary-600" />
            </div>
          </div>
        </motion.div>

        {/* Results Table or Detail View */}
        {viewMode === "summary" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary-500" />
                Detailed Results
              </h2>
              <div className="text-sm text-gray-600">
                Showing {results.length} beneficiaries
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Beneficiary ID</th>
                    <th>Final Score</th>
                    <th>Risk Level</th>
                    <th>Meta Prob</th>
                    <th>Rule Risk</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 50).map((result, index) => (
                    <tr key={index}>
                      <td>
                        <span className="font-mono text-sm">
                          {result.beneficiaryId}
                        </span>
                      </td>
                      <td>
                        <span className="font-bold">
                          {result.finalFraudScore.toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${getRiskColor(result.riskLevel)} flex items-center gap-1 w-fit`}
                        >
                          {getRiskIcon(result.riskLevel)}
                          {result.riskLevel}
                        </span>
                      </td>
                      <td>{(result.metaProb * 100).toFixed(2)}%</td>
                      <td>{(result.ruleRiskScore * 100).toFixed(0)}%</td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedResult(result);
                            setViewMode("detail");
                          }}
                          className="btn btn-ghost text-primary-600 hover:bg-primary-50 py-1 px-2 text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {results.length > 50 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
                Showing first 50 of {results.length} results. Download CSV for
                complete data.
              </div>
            )}
          </motion.div>
        ) : (
          /* Detail View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="card">
              <button
                onClick={() => {
                  setViewMode("summary");
                  setSelectedResult(null);
                }}
                className="btn btn-ghost mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to List
              </button>

              {selectedResult && (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Beneficiary: {selectedResult.beneficiaryId}
                    </h2>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getRiskColor(selectedResult.riskLevel)}`}
                    >
                      {getRiskIcon(selectedResult.riskLevel)}
                      <span className="font-semibold">
                        {selectedResult.riskLevel} Risk
                      </span>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                      <p className="text-xs text-blue-700 mb-1 uppercase tracking-wide">
                        Score B
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {(selectedResult.scoreB * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                      <p className="text-xs text-purple-700 mb-1 uppercase tracking-wide">
                        Score R
                      </p>
                      <p className="text-2xl font-bold text-purple-900">
                        {(selectedResult.scoreR * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                      <p className="text-xs text-green-700 mb-1 uppercase tracking-wide">
                        Score D
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {(selectedResult.scoreD * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                      <p className="text-xs text-orange-700 mb-1 uppercase tracking-wide">
                        Score A
                      </p>
                      <p className="text-2xl font-bold text-orange-900">
                        {(selectedResult.scoreA * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* Main Scores */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-error-50 to-error-100 border border-error-200">
                      <p className="text-sm text-error-700 mb-2 font-medium">
                        Final Fraud Score
                      </p>
                      <p className="text-4xl font-bold text-error-900">
                        {selectedResult.finalFraudScore.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-warning-50 to-warning-100 border border-warning-200">
                      <p className="text-sm text-warning-700 mb-2 font-medium">
                        Meta Probability
                      </p>
                      <p className="text-4xl font-bold text-warning-900">
                        {(selectedResult.metaProb * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-info-50 to-info-100 border border-info-200">
                      <p className="text-sm text-info-700 mb-2 font-medium">
                        Rule Risk Score
                      </p>
                      <p className="text-4xl font-bold text-info-900">
                        {(selectedResult.ruleRiskScore * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Risk Assessment */}
            <div className="card bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Risk Assessment Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-error-500 mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Fraud Detection Score
                    </p>
                    <p className="text-sm text-gray-600">
                      Based on multiple behavioral and transactional patterns
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-warning-500 mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Meta-Learning Probability
                    </p>
                    <p className="text-sm text-gray-600">
                      Ensemble model prediction confidence
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-info-500 mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Rule-Based Risk
                    </p>
                    <p className="text-sm text-gray-600">
                      Compliance and policy violation indicators
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
