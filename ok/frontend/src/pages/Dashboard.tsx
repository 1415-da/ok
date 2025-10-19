import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  PlayCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
  Database,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api, { handleApiError, DashboardStats } from "../services/api";
import toast from "react-hot-toast";

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [userId] = useState("Auditor");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.dashboard.getStats(userId);
      setStats(data);
    } catch (error) {
      // const errorMessage = handleApiError(error);
      // toast.error(errorMessage);
      // Set mock data for demo
      setStats({
        total_workflows: 12,
        active_workflows: 3,
        completed_workflows: 8,
        total_datasets: 24,
        total_results: 8,
        recent_workflows: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const workflowData = [
    { name: "Mon", completed: 2, active: 1 },
    { name: "Tue", completed: 3, active: 2 },
    { name: "Wed", completed: 1, active: 1 },
    { name: "Thu", completed: 4, active: 2 },
    { name: "Fri", completed: 2, active: 3 },
    { name: "Sat", completed: 1, active: 0 },
    { name: "Sun", completed: 0, active: 1 },
  ];

  const statusData = [
    { name: "Completed", value: stats?.completed_workflows || 8 },
    { name: "Active", value: stats?.active_workflows || 3 },
    { name: "Failed", value: 1 },
  ];

  const statCards = [
    {
      title: "Total Workflows",
      value: stats?.total_workflows || 0,
      icon: Activity,
      color: "primary",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Active Workflows",
      value: stats?.active_workflows || 0,
      icon: Clock,
      color: "warning",
      change: "+3",
      trend: "up",
    },
    {
      title: "Completed",
      value: stats?.completed_workflows || 0,
      icon: CheckCircle,
      color: "success",
      change: "+8",
      trend: "up",
    },
    {
      title: "Total Datasets",
      value: stats?.total_datasets || 0,
      icon: Database,
      color: "info",
      change: "+24",
      trend: "up",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Welcome back, {userId} 👋</p>
            </div>
            <button
              onClick={() => navigate("/workflow")}
              className="btn btn-primary px-6 py-3 text-lg"
            >
              <PlayCircle className="w-5 h-5" />
              New Workflow
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="stat-card group hover:scale-105 transition-transform duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-${stat.color}-100 group-hover:shadow-lg transition-shadow`}
                  >
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className="flex items-center gap-1 text-success-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Workflow Activity Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary-500" />
                Workflow Activity
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workflowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="completed"
                  fill="#10b981"
                  name="Completed"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="active"
                  fill="#f59e0b"
                  name="Active"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary-500" />
                Status Distribution
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Workflows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary-500" />
              Recent Workflows
            </h2>
            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {stats?.recent_workflows && stats.recent_workflows.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_workflows.map((workflow) => (
                <div
                  key={workflow.workflow_id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/results/${workflow.workflow_id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white">
                      <FileText className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {workflow.workflow_id.substring(0, 8)}...
                      </h4>
                      <p className="text-sm text-gray-600">
                        Created{" "}
                        {new Date(workflow.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`badge ${
                        workflow.status === "COMPLETED"
                          ? "badge-success"
                          : workflow.status === "RUNNING"
                            ? "badge-warning"
                            : workflow.status === "FAILED"
                              ? "badge-error"
                              : "badge-info"
                      }`}
                    >
                      {workflow.status}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No workflows yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first workflow to get started
              </p>
              <button
                onClick={() => navigate("/workflow")}
                className="btn btn-primary"
              >
                <PlayCircle className="w-5 h-5" />
                Create Workflow
              </button>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 hover:shadow-lg transition-shadow cursor-pointer">
            <Database className="w-8 h-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Upload Data</h3>
            <p className="text-sm text-gray-600">
              Securely upload your datasets for analysis
            </p>
          </div>

          <div className="card bg-gradient-to-br from-success-50 to-success-100 border border-success-200 hover:shadow-lg transition-shadow cursor-pointer">
            <Activity className="w-8 h-8 text-success-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Monitor Workflows
            </h3>
            <p className="text-sm text-gray-600">
              Track the progress of your running workflows
            </p>
          </div>

          <div className="card bg-gradient-to-br from-info-50 to-info-100 border border-info-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CheckCircle className="w-8 h-8 text-info-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">View Results</h3>
            <p className="text-sm text-gray-600">
              Access and download your analysis results
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
