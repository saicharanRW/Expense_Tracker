"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Database, Trash2 } from "lucide-react";

export default function AdminPage() {
  const [migrationResult, setMigrationResult] = useState("");
  const [cleanupResult, setCleanupResult] = useState("");
  const [isMigrating, setIsMigrating] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  const migrateExpensesMutation = useMutation(api.migrateExpenses.migrateExpenses);
  const cleanupOrphanedExpensesMutation = useMutation(api.cleanupOrphanedExpenses.cleanupOrphanedExpenses);

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationResult("");
    
    try {
      const result = await migrateExpensesMutation({});
      setMigrationResult(`Migration completed: ${result.message}. Total expenses: ${result.totalExpenses}`);
    } catch (error) {
      setMigrationResult(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleCleanup = async () => {
    setIsCleaning(true);
    setCleanupResult("");
    
    try {
      const result = await cleanupOrphanedExpensesMutation({});
      setCleanupResult(`Cleanup completed: ${result.message}`);
    } catch (error) {
      setCleanupResult(`Cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Database Admin</h1>
          <p className="text-muted-foreground mt-2">
            Manage database migrations and cleanup operations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Migration Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Migrate Expenses
              </CardTitle>
              <CardDescription>
                Update existing expense records with missing fields (createdAt, userId)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleMigration}
                disabled={isMigrating}
                className="w-full"
              >
                {isMigrating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Migrating...
                  </>
                ) : (
                  "Run Migration"
                )}
              </Button>
              
              {migrationResult && (
                <Alert>
                  <AlertDescription>{migrationResult}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Cleanup Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Cleanup Orphaned Expenses
              </CardTitle>
              <CardDescription>
                Remove expense records that don't have a userId (legacy data)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleCleanup}
                disabled={isCleaning}
                variant="destructive"
                className="w-full"
              >
                {isCleaning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cleaning...
                  </>
                ) : (
                  "Cleanup Orphaned Data"
                )}
              </Button>
              
              {cleanupResult && (
                <Alert>
                  <AlertDescription>{cleanupResult}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Run Migration First</h4>
              <p className="text-sm text-muted-foreground">
                This will update existing expense records with missing fields. It's safe to run multiple times.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">2. Cleanup Orphaned Data (Optional)</h4>
              <p className="text-sm text-muted-foreground">
                This will remove expense records that don't have a userId. Only run after migration is complete.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">3. Test the Application</h4>
              <p className="text-sm text-muted-foreground">
                After running these operations, test the login and expense tracking functionality.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
