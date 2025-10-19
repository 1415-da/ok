import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  PlayCircle,
  CheckCircle2,
  Loader2,
  FileText,
  AlertCircle,
  Database,
  Users,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

type ProcessingStep =
  | "idle"
  | "uploading"
  | "encrypting"
  | "processing"
  | "completed"
  | "error";

type UserRole = "auditor" | "collaborator";

export default function WorkflowPage() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole>("auditor");
  const [userId, setUserId] = useState("Auditor");
  const [collaborators, setCollaborators] = useState("ClientB");
  const [accountsFile, setAccountsFile] = useState<File | null>(null);
  const [transactionsFile, setTransactionsFile] = useState<File | null>(null);
  const [workflowId] = useState<string>(uuidv4());
  const [currentStep, setCurrentStep] = useState<ProcessingStep>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  const handleFileChange =
    (type: "accounts" | "transactions") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (type === "accounts") {
          setAccountsFile(file);
          addLog(
            `✓ Selected accounts file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
          );
        } else {
          setTransactionsFile(file);
          addLog(
            `✓ Selected transactions file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
          );
        }
        toast.success(
          `${type === "accounts" ? "Accounts" : "Transactions"} file selected`,
        );
      }
    };

  const simulateProcessing = async () => {
    const roleMessage =
      userRole === "auditor" ? "workflow" : "data contribution";

    // Step 1: Uploading
    setCurrentStep("uploading");
    setProcessingMessage(`Uploading files to secure environment...`);
    setUploadProgress(0);
    addLog(`📤 Starting ${roleMessage}...`);
    if (userRole === "collaborator") {
      addLog(`👥 Collaborator: ${userId}`);
    } else {
      addLog(`👤 Auditor: ${userId}`);
      addLog(`🤝 Collaborators: ${collaborators}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 800));
    setUploadProgress(20);
    addLog("✓ Accounts file uploaded");

    await new Promise((resolve) => setTimeout(resolve, 800));
    setUploadProgress(40);
    addLog("✓ Transactions file uploaded");

    // Step 2: Encrypting
    setCurrentStep("encrypting");
    setProcessingMessage("Encrypting data with AES-256...");
    setUploadProgress(50);
    addLog("🔒 Encrypting datasets...");
    if (userRole === "collaborator") {
      addLog("🔐 Data will remain private during analysis");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUploadProgress(60);
    addLog("✓ Data encrypted successfully");

    // Step 3: Processing
    setCurrentStep("processing");
    if (userRole === "collaborator") {
      setProcessingMessage(
        "Securely combining data with other participants...",
      );
      addLog("🤝 Joining confidential clean room...");
    } else {
      setProcessingMessage(
        "Analyzing fraud patterns in confidential clean room...",
      );
      addLog("⚙️ Starting fraud detection analysis...");
    }
    setUploadProgress(70);

    await new Promise((resolve) => setTimeout(resolve, 800));
    addLog("📊 Processing account data...");

    await new Promise((resolve) => setTimeout(resolve, 800));
    setUploadProgress(80);
    addLog("📊 Processing transaction data...");

    await new Promise((resolve) => setTimeout(resolve, 800));
    addLog("🧮 Calculating fraud scores...");

    await new Promise((resolve) => setTimeout(resolve, 800));
    setUploadProgress(90);
    addLog("🎯 Generating risk assessments...");

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUploadProgress(95);
    addLog("✓ Analysis completed successfully");

    // Step 4: Completed
    setCurrentStep("completed");
    setUploadProgress(100);
    if (userRole === "collaborator") {
      setProcessingMessage("Data submitted successfully!");
      addLog("✅ Your contribution has been securely processed");
    } else {
      setProcessingMessage("Analysis completed! Generating results...");
      addLog("✅ Results generated successfully");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store results in localStorage for the results page
    const mockResults = {
      workflowId,
      timestamp: new Date().toISOString(),
      files: {
        accounts: accountsFile?.name,
        transactions: transactionsFile?.name,
      },
      status: "completed",
      role: userRole,
      userId,
    };
    localStorage.setItem("workflow_results", JSON.stringify(mockResults));

    if (userRole === "auditor") {
      toast.success("Analysis completed! Redirecting to results...");
      // Navigate to results page
      setTimeout(() => {
        navigate(`/results/${workflowId}`);
      }, 1500);
    } else {
      toast.success("Data submitted successfully! ✅");
      addLog("🎉 Thank you for your contribution!");
      addLog("⏳ Waiting for auditor to complete the analysis...");
      // Collaborators see a success message but don't navigate
      setTimeout(() => {
        // Keep the completed state visible for collaborators
        setProcessingMessage(
          "Data submitted! Auditor will run the final analysis.",
        );
      }, 2000);
    }
  };

  const handleStartProcessing = async () => {
    if (!accountsFile || !transactionsFile) {
      toast.error("Please upload both accounts and transactions files");
      return;
    }

    setLogs([]);
    addLog("🚀 Starting workflow...");
    addLog(`📋 Workflow ID: ${workflowId.substring(0, 8)}...`);

    try {
      await simulateProcessing();
    } catch (error) {
      setCurrentStep("error");
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setProcessingMessage(`Error: ${errorMessage}`);
      addLog(`❌ Error: ${errorMessage}`);
      toast.error(errorMessage);
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case "uploading":
      case "encrypting":
      case "processing":
        return <Loader2 className="w-8 h-8 animate-spin text-primary-500" />;
      case "completed":
        return <CheckCircle2 className="w-8 h-8 text-success-500" />;
      case "error":
        return <AlertCircle className="w-8 h-8 text-error-500" />;
      default:
        return <Upload className="w-8 h-8 text-gray-400" />;
    }
  };

  const isProcessing = ["uploading", "encrypting", "processing"].includes(
    currentStep,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-3">
            Welfare Fraud Detection
          </h1>
          <p className="text-gray-600 text-lg">
            Upload your data files to analyze fraud patterns in a secure
            confidential clean room
          </p>
        </motion.div>

        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="card max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Select Your Role
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => {
                  setUserRole("auditor");
                  setUserId("Auditor");
                  setAccountsFile(null);
                  setTransactionsFile(null);
                  setLogs([]);
                }}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                  userRole === "auditor"
                    ? "border-primary-500 bg-primary-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <User
                  className={`w-8 h-8 ${userRole === "auditor" ? "text-primary-600" : "text-gray-400"}`}
                />
                <div className="text-center">
                  <h3
                    className={`font-semibold ${userRole === "auditor" ? "text-primary-900" : "text-gray-700"}`}
                  >
                    Auditor
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Create and run workflows
                  </p>
                </div>
                {userRole === "auditor" && (
                  <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => {
                  setUserRole("collaborator");
                  setUserId("ClientB");
                  setAccountsFile(null);
                  setTransactionsFile(null);
                  setLogs([]);
                }}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                  userRole === "collaborator"
                    ? "border-secondary-500 bg-secondary-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Users
                  className={`w-8 h-8 ${userRole === "collaborator" ? "text-secondary-600" : "text-gray-400"}`}
                />
                <div className="text-center">
                  <h3
                    className={`font-semibold ${userRole === "collaborator" ? "text-secondary-900" : "text-gray-700"}`}
                  >
                    Collaborator
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Contribute data to workflows
                  </p>
                </div>
                {userRole === "collaborator" && (
                  <div className="w-6 h-6 rounded-full bg-secondary-500 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            </div>

            {/* User ID Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {userRole === "auditor"
                    ? "Your ID (Auditor)"
                    : "Your ID (Collaborator)"}
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="input"
                  placeholder={userRole === "auditor" ? "Auditor" : "ClientB"}
                />
              </div>

              {userRole === "auditor" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collaborator IDs (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={collaborators}
                    onChange={(e) => setCollaborators(e.target.value)}
                    className="input"
                    placeholder="ClientB, ClientC"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter IDs of collaborators who will contribute data
                  </p>
                </div>
              )}

              {/* Mode Info */}
              <div
                className={`p-4 rounded-lg border ${
                  userRole === "auditor"
                    ? "bg-primary-50 border-primary-200"
                    : "bg-secondary-50 border-secondary-200"
                }`}
              >
                <h4
                  className={`font-semibold mb-2 ${
                    userRole === "auditor"
                      ? "text-primary-900"
                      : "text-secondary-900"
                  }`}
                >
                  {userRole === "auditor"
                    ? "👤 Auditor Mode"
                    : "👥 Collaborator Mode"}
                </h4>
                <ul
                  className={`text-sm space-y-1 ${
                    userRole === "auditor"
                      ? "text-primary-800"
                      : "text-secondary-800"
                  }`}
                >
                  {userRole === "auditor" ? (
                    <>
                      <li>✓ Create and manage workflows</li>
                      <li>✓ Upload training datasets</li>
                      <li>✓ View complete analysis results</li>
                      <li>✓ Invite collaborators to contribute</li>
                    </>
                  ) : (
                    <>
                      <li>✓ Contribute encrypted data</li>
                      <li>✓ Maintain data privacy</li>
                      <li>✓ Participate in secure analysis</li>
                      <li>✓ No access to other parties' data</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: File Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary-500" />
                  Upload Dataset Files
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                  <User className="w-4 h-4" />
                  {userId}
                </div>
              </div>

              {/* Accounts File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accounts Training Data (CSV)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange("accounts")}
                    disabled={isProcessing}
                    className="hidden"
                    id="accounts-upload"
                  />
                  <label
                    htmlFor="accounts-upload"
                    className={`flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      accountsFile
                        ? "border-success-500 bg-success-50"
                        : "border-gray-300 hover:border-primary-400 hover:bg-primary-50"
                    } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {accountsFile ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-success-500" />
                        <span className="text-success-700 font-medium">
                          {accountsFile.name}
                        </span>
                        <span className="text-sm text-success-600">
                          ({(accountsFile.size / 1024).toFixed(2)} KB)
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">
                          Click to upload accounts_train.csv
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Transactions File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transactions Training Data (CSV)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange("transactions")}
                    disabled={isProcessing}
                    className="hidden"
                    id="transactions-upload"
                  />
                  <label
                    htmlFor="transactions-upload"
                    className={`flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      transactionsFile
                        ? "border-success-500 bg-success-50"
                        : "border-gray-300 hover:border-primary-400 hover:bg-primary-50"
                    } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {transactionsFile ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-success-500" />
                        <span className="text-success-700 font-medium">
                          {transactionsFile.name}
                        </span>
                        <span className="text-sm text-success-600">
                          ({(transactionsFile.size / 1024).toFixed(2)} KB)
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">
                          Click to upload transactions_train.csv
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartProcessing}
                disabled={
                  !accountsFile ||
                  !transactionsFile ||
                  isProcessing ||
                  (currentStep === "completed" && userRole === "collaborator")
                }
                className="btn btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : currentStep === "completed" &&
                  userRole === "collaborator" ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Data Submitted Successfully
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    {userRole === "auditor"
                      ? "Start Analysis"
                      : "Approve & Submit Data"}
                  </>
                )}
              </button>

              {userRole === "collaborator" && (
                <div className="mt-4 p-4 bg-info-50 border border-info-200 rounded-lg">
                  <p className="text-sm text-info-800">
                    <strong>Note:</strong> As a collaborator, your data will be
                    encrypted and combined with the auditor's data for secure
                    analysis.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Status & Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Processing Status
              </h3>

              <div className="flex flex-col items-center justify-center py-6">
                <motion.div
                  animate={isProcessing ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {getStepIcon()}
                </motion.div>

                <p className="mt-4 text-center font-medium text-gray-700">
                  {processingMessage || "Ready to process"}
                </p>

                {isProcessing && (
                  <div className="w-full mt-4">
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-2">
                      {uploadProgress}% Complete
                    </p>
                  </div>
                )}
              </div>

              {/* Step Indicators */}
              <div className="space-y-2 mt-6">
                {[
                  { key: "uploading", label: "Upload & Encrypt", icon: Upload },
                  {
                    key: "encrypting",
                    label: "Secure Transfer",
                    icon: Database,
                  },
                  { key: "processing", label: "Analyze Data", icon: Loader2 },
                  {
                    key: "completed",
                    label: "Generate Results",
                    icon: CheckCircle2,
                  },
                ].map((step, index) => {
                  const isActive = currentStep === step.key;
                  const stepIndex = [
                    "uploading",
                    "encrypting",
                    "processing",
                    "completed",
                  ].indexOf(currentStep);
                  const isPassed = stepIndex > index;
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary-50"
                          : isPassed
                            ? "bg-success-50"
                            : "bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isActive
                            ? "bg-primary-500 text-white"
                            : isPassed
                              ? "bg-success-500 text-white"
                              : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isActive ? (
                          <StepIcon className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isActive || isPassed
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info Card */}
            <div className="card bg-gradient-to-br from-info-50 to-info-100 border border-info-200">
              <h4 className="font-semibold text-info-900 mb-2 flex items-center gap-2">
                🔒 Secure Processing
              </h4>
              <p className="text-sm text-info-800 mb-3">
                Your data is encrypted before upload and processed in a
                confidential computing environment. No plaintext data leaves
                your device.
              </p>
              {userRole === "collaborator" && (
                <div className="pt-3 border-t border-info-200">
                  <p className="text-sm text-info-800">
                    <strong>Collaborative Mode:</strong> Your data will be
                    securely combined with other participants while maintaining
                    privacy.
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            {(accountsFile || transactionsFile) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card bg-gradient-to-br from-success-50 to-success-100 border border-success-200"
              >
                <h4 className="font-semibold text-success-900 mb-3">
                  Files Ready
                </h4>
                <div className="space-y-2">
                  {accountsFile && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-success-700">Accounts:</span>
                      <span className="font-medium text-success-900">
                        {(accountsFile.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  )}
                  {transactionsFile && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-success-700">Transactions:</span>
                      <span className="font-medium text-success-900">
                        {(transactionsFile.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Logs Section */}
        <AnimatePresence>
          {logs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 card bg-gray-900 text-gray-100"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-400" />
                Execution Logs
              </h3>
              <div className="bg-black rounded-lg p-4 max-h-64 overflow-y-auto font-mono text-sm no-scrollbar">
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-gray-300 mb-1"
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
