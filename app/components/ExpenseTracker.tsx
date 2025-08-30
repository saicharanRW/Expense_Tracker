"use client";

import { useState, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "../contexts/AuthContext";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import {
  Plus,
  DollarSign,
  TrendingUp,
  Filter,
  TrendingDown,
  LogOut,
  User,
  CheckCircle,
} from "lucide-react";

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Other",
];

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088fe",
  "#00c49f",
  "#ffbb28",
  "#ff8042",
];

export default function ExpenseTracker() {
  const { user, logout } = useAuth();
  const expenses =
    useQuery(
      api.getExpenses.getExpenses,
      user ? { userId: user._id as Id<"users"> } : "skip"
    ) || [];
  const addExpenseMutation = useMutation(api.addExpense.addExpense);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM format

  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    return (
      newExpense.amount.trim() !== "" &&
      newExpense.category !== "" &&
      newExpense.description.trim() !== "" &&
      newExpense.date !== "" &&
      parseFloat(newExpense.amount) > 0
    );
  }, [newExpense]);

  const addExpense = async () => {
    if (isFormValid && user && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await addExpenseMutation({
          userId: user._id as Id<"users">,
          amount: Number.parseFloat(newExpense.amount),
          category: newExpense.category,
          description: newExpense.description,
          date: newExpense.date,
        });

        // Reset form after successful addition
        setNewExpense({
          amount: "",
          category: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
        });

        // Show success message
        setShowSuccessMessage(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } catch (error) {
        console.error("Failed to add expense:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Generate available months for the filter
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    expenses.forEach((expense) => {
      const month = expense.date.slice(0, 7); // YYYY-MM
      monthsSet.add(month);
    });

    // Add current month if not present
    const currentMonth = new Date().toISOString().slice(0, 7);
    monthsSet.add(currentMonth);

    return Array.from(monthsSet).sort().reverse();
  }, [expenses]);

  // Filter expenses by selected month
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => expense.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // Calculate totals and analytics for selected month
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const selectedMonthExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calculate days in selected month for daily average
  const daysInSelectedMonth = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    return new Date(year, month, 0).getDate();
  }, [selectedMonth]);

  const dailyAverage = selectedMonthExpenses / daysInSelectedMonth;

  // Category breakdown for pie chart (selected month only)
  const categoryData = useMemo(() => {
    return categories
      .map((category) => {
        const categoryExpenses = filteredExpenses.filter(
          (expense) => expense.category === category
        );
        const total = categoryExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        return {
          name: category,
          value: total,
          count: categoryExpenses.length,
        };
      })
      .filter((item) => item.value > 0);
  }, [filteredExpenses]);

  // Monthly trend data for bar chart (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthExpenses = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === date.getMonth() &&
          expenseDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      amount: Math.round(monthExpenses * 100) / 100,
      year: date.getFullYear(),
    };
  }).reverse();

  // Daily spending trend for the selected month
  const dailySpendingData = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${selectedMonth}-${day.toString().padStart(2, "0")}`;

      const dayExpenses = filteredExpenses
        .filter((expense) => expense.date === dateStr)
        .reduce((sum, expense) => sum + expense.amount, 0);

      return {
        day,
        amount: Math.round(dayExpenses * 100) / 100,
        date: new Date(year, month - 1, day).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    });
  }, [filteredExpenses, selectedMonth]);

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-200 flex items-center gap-3 whitespace-nowrap">
              <CheckCircle className="h-6 w-6 flex-shrink-0" />
              <span className="font-medium text-base">
                Expense added successfully!
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-2 sm:gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Expense Tracker
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Track and analyze your spending habits
            </p>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
            {/* Month Selector - appears first on mobile, inline on desktop */}
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full md:w-[140px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {new Date(month + "-01").toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* User Info and Logout - second row on mobile, inline on desktop */}
            <div className="flex items-center gap-2">
              {/* User Info */}
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg flex-1 md:flex-none">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium truncate">
                  {user?.email}
                </span>
              </div>

              {/* Logout Button */}
              <Button variant="outline" onClick={handleLogout} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Expenses
              </CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                ₹{totalExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">All time spending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                This Month
              </CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                ₹{selectedMonthExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(selectedMonth + "-01").toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}{" "}
                spending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Daily Average
              </CardTitle>
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                ₹{dailyAverage.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Average per day</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Categories
              </CardTitle>
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                {categoryData.length}
              </div>
              <p className="text-xs text-muted-foreground">Active categories</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="add-expense" className="text-xs sm:text-sm">
              Add Expense
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs sm:text-sm">
              All Expenses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            {expenses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <DollarSign className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No expenses yet
                  </h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Start by adding your first expense to see insights and
                    analytics
                  </p>
                  <Button
                    onClick={() =>
                      (
                        document.querySelector(
                          '[value="add-expense"]'
                        ) as HTMLButtonElement
                      )?.click()
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Expense
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-4 lg:grid-cols-3">
                  {/* Monthly Spending Bar Chart */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">
                        Monthly Spending Trend
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Your spending over the last 6 months
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px] sm:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={monthlyData}
                            margin={{ left: -20, right: 0, top: 5, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" fontSize={12} />
                            <YAxis />
                            <Tooltip
                              formatter={(value) => [`₹${value}`, "Amount"]}
                            />
                            <Bar
                              dataKey="amount"
                              fill="#8884d8"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Category Breakdown Pie Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">
                        Spending by Category
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Breakdown of expenses for{" "}
                        {new Date(selectedMonth + "-01").toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px] sm:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) =>
                                `${name.split(" ")[0]} ${(
                                  percent * 100
                                ).toFixed(0)}%`
                              }
                              outerRadius={
                                typeof window !== "undefined" &&
                                window.innerWidth < 640
                                  ? 60
                                  : 80
                              }
                              fill="#8884d8"
                              dataKey="value"
                              fontSize={10}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [`₹${value}`, "Amount"]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Daily spending trend chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">
                      Daily Spending Pattern
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Your daily expenses for{" "}
                      {new Date(selectedMonth + "-01").toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] sm:h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={dailySpendingData}
                          margin={{ left: -20, right: 0, top: 5, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" fontSize={10} />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [`₹${value}`, "Amount"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">
                        Recent Expenses
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Your latest spending activity in{" "}
                        {new Date(selectedMonth + "-01").toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 sm:space-y-4">
                        {filteredExpenses.slice(0, 5).map((expense) => (
                          <div
                            key={expense._id}
                            className="flex items-center justify-between border-b pb-2"
                          >
                            <div className="space-y-1 flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {expense.description}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">
                                  {expense.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {expense.date}
                                </span>
                              </div>
                            </div>
                            <div className="text-right ml-2">
                              <p className="text-sm font-semibold text-foreground">
                                ₹{expense.amount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">
                        Top Categories
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Your highest spending categories in{" "}
                        {new Date(selectedMonth + "-01").toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 sm:space-y-4">
                        {categoryData
                          .sort((a, b) => b.value - a.value)
                          .slice(0, 5)
                          .map((category, index) => (
                            <div
                              key={category.name}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                  className="w-3 h-3 rounded-full flex-shrink-0"
                                  style={{
                                    backgroundColor:
                                      COLORS[index % COLORS.length],
                                  }}
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {category.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {category.count} transactions
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm font-semibold ml-2">
                                ₹{category.value.toFixed(2)}
                              </p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="add-expense">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Add New Expense
                </CardTitle>
                <CardDescription className="text-sm">
                  Record a new expense to track your spending
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm">
                      Amount *
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, amount: e.target.value })
                      }
                      className="text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm">
                      Category *
                    </Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) =>
                        setNewExpense({ ...newExpense, category: value })
                      }
                      required
                    >
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm">
                    Description *
                  </Label>
                  <Input
                    id="description"
                    placeholder="What did you spend on?"
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        description: e.target.value,
                      })
                    }
                    className="text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm">
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    className="text-base"
                    required
                  />
                </div>
                <Button
                  onClick={addExpense}
                  className="w-full text-base py-6 sm:py-4"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Adding Expense...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Expense
                    </>
                  )}
                </Button>
                {!isFormValid && (
                  <p className="text-sm text-muted-foreground text-center">
                    Please fill in all required fields to add an expense
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  All Expenses
                </CardTitle>
                <CardDescription className="text-sm">
                  Complete list of your recorded expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No expenses recorded
                    </h3>
                    <p className="text-muted-foreground text-center">
                      Add your first expense to see it listed here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {expenses.map((expense) => (
                      <div
                        key={expense._id}
                        className="flex items-center justify-between border-b pb-3 sm:pb-4"
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm sm:text-base truncate">
                            {expense.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {expense.category}
                            </Badge>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {expense.date}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <p className="text-base sm:text-lg font-semibold text-foreground">
                            ₹{expense.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
