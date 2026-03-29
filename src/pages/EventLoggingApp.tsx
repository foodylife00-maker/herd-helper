import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ActualRecord } from "@/lib/herdCalculations";
import {
  Leaf, Plus, History, TrendingUp, TrendingDown, ArrowUpRight,
  Trash2, Pencil, Check, X, ClipboardList, RotateCcw, Skull, ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MAX_YEAR = 20;

const EventLoggingApp = () => {
  const [records, setRecords, clearRecords] = useLocalStorage<ActualRecord[]>("event-records", []);
  const [editingYear, setEditingYear] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ births: 0, deaths: 0, sales: 0 });
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Form state
  const [year, setYear] = useState<number>(1);
  const [births, setBirths] = useState<number>(0);
  const [deaths, setDeaths] = useState<number>(0);
  const [sales, setSales] = useState<number>(0);

  const availableYears = Array.from({ length: MAX_YEAR }, (_, i) => i + 1).filter(
    y => !records.some(r => r.year === y)
  );

  const handleAdd = () => {
    if (year > 0 && year <= MAX_YEAR && !records.some(r => r.year === year)) {
      setRecords(prev => [...prev, { year, births, deaths, sales }]);
      setBirths(0);
      setDeaths(0);
      setSales(0);
      toast.success(`Year ${year} recorded.`);
    }
  };

  const handleRemove = (y: number) => {
    setRecords(prev => prev.filter(r => r.year !== y));
    toast.success(`Year ${y} removed.`);
  };

  const startEdit = (record: ActualRecord) => {
    setEditingYear(record.year);
    setEditValues({ births: record.births, deaths: record.deaths, sales: record.sales });
  };

  const confirmEdit = () => {
    if (editingYear !== null) {
      setRecords(prev => prev.map(r => r.year === editingYear ? { year: editingYear, ...editValues } : r));
      toast.success(`Year ${editingYear} updated.`);
      setEditingYear(null);
    }
  };

  const cancelEdit = () => setEditingYear(null);

  const handleClearAll = () => {
    clearRecords();
    setBirths(0);
    setDeaths(0);
    setSales(0);
    setShowClearDialog(false);
    toast.success("All records cleared.");
  };

  const totalBirths = records.reduce((sum, r) => sum + r.births, 0);
  const totalDeaths = records.reduce((sum, r) => sum + r.deaths, 0);
  const totalSales = records.reduce((sum, r) => sum + r.sales, 0);
  const netChange = totalBirths - totalDeaths - totalSales;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Event Logging</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Track births, deaths & sales</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {records.length > 0 && (
              <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setShowClearDialog(true)}>
                <RotateCcw className="h-3.5 w-3.5" />
                Clear All
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl font-display flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Record Event
                </CardTitle>
                <CardDescription>
                  Log births, deaths, and sales for a given year
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableYears.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableYears.map(y => (
                              <SelectItem key={y} value={y.toString()}>Year {y}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <Leaf className="h-3 w-3 text-green-600" /> Births
                        </Label>
                        <Input type="number" min={0} value={births} onChange={(e) => setBirths(parseInt(e.target.value) || 0)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <Skull className="h-3 w-3 text-red-600" /> Deaths
                        </Label>
                        <Input type="number" min={0} value={deaths} onChange={(e) => setDeaths(parseInt(e.target.value) || 0)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3 text-amber-600" /> Sales
                        </Label>
                        <Input type="number" min={0} value={sales} onChange={(e) => setSales(parseInt(e.target.value) || 0)} />
                      </div>
                    </div>
                    <Button onClick={handleAdd} className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Add Record
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    All {MAX_YEAR} years have been recorded.
                  </p>
                )}

                {/* Compact recorded badges */}
                {records.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <Label className="text-xs text-muted-foreground">Quick View</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {[...records].sort((a, b) => a.year - b.year).map(r => (
                        <Badge key={r.year} variant="secondary" className="text-xs gap-1 px-2 py-1">
                          Y{r.year}: <span className="text-green-600">+{r.births}</span>
                          <span className="text-red-600">-{r.deaths}</span>
                          {r.sales > 0 && <span className="text-amber-600">↗{r.sales}</span>}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary & History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            {records.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-1.5 text-xs">
                        <Leaf className="h-3.5 w-3.5 text-green-600" /> Births
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-display font-bold text-green-600">+{totalBirths}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-1.5 text-xs">
                        <Skull className="h-3.5 w-3.5 text-red-600" /> Deaths
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-display font-bold text-red-600">-{totalDeaths}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-1.5 text-xs">
                        <ShoppingCart className="h-3.5 w-3.5 text-amber-600" /> Sales
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-display font-bold text-amber-600">↗{totalSales}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-1.5 text-xs">
                        <TrendingUp className="h-3.5 w-3.5" /> Net Change
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-2xl font-display font-bold ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {netChange >= 0 ? '+' : ''}{netChange}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Event History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <History className="h-5 w-5 text-primary" />
                      Event History
                    </CardTitle>
                    <CardDescription>
                      {records.length} year{records.length !== 1 ? 's' : ''} recorded — click pencil to edit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[...records].sort((a, b) => a.year - b.year).map((record) => (
                        <div key={record.year} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          {editingYear === record.year ? (
                            <>
                              <div className="flex items-center gap-2 flex-1 flex-wrap">
                                <Badge variant="outline" className="font-mono text-xs">Y{record.year}</Badge>
                                <div className="flex gap-2 items-center">
                                  <div className="flex items-center gap-1">
                                    <Leaf className="h-3 w-3 text-green-600" />
                                    <Input type="number" min={0} value={editValues.births}
                                      onChange={(e) => setEditValues(v => ({ ...v, births: parseInt(e.target.value) || 0 }))}
                                      className="h-7 w-16 px-1.5 text-xs" />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Skull className="h-3 w-3 text-red-600" />
                                    <Input type="number" min={0} value={editValues.deaths}
                                      onChange={(e) => setEditValues(v => ({ ...v, deaths: parseInt(e.target.value) || 0 }))}
                                      className="h-7 w-16 px-1.5 text-xs" />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <ShoppingCart className="h-3 w-3 text-amber-600" />
                                    <Input type="number" min={0} value={editValues.sales}
                                      onChange={(e) => setEditValues(v => ({ ...v, sales: parseInt(e.target.value) || 0 }))}
                                      className="h-7 w-16 px-1.5 text-xs" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={confirmEdit}>
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={cancelEdit}>
                                  <X className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="font-mono text-xs">Y{record.year}</Badge>
                                <div className="flex gap-3 text-sm">
                                  <span className="text-green-600 font-medium flex items-center gap-1">
                                    <Leaf className="h-3 w-3" /> +{record.births}
                                  </span>
                                  <span className="text-red-600 font-medium flex items-center gap-1">
                                    <Skull className="h-3 w-3" /> -{record.deaths}
                                  </span>
                                  {record.sales > 0 && (
                                    <span className="text-amber-600 font-medium flex items-center gap-1">
                                      <ShoppingCart className="h-3 w-3" /> {record.sales}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={record.births - record.deaths - record.sales >= 0 ? "default" : "destructive"} className="text-xs">
                                  Net: {record.births - record.deaths - record.sales >= 0 ? '+' : ''}{record.births - record.deaths - record.sales}
                                </Badge>
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(record)}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 hover:text-destructive" onClick={() => handleRemove(record.year)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <ClipboardList className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">No Events Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Use the form to start logging births, deaths, and sales. Your history and summary stats will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Clear All Confirmation */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all records?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {records.length} recorded events. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll}>Clear All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventLoggingApp;
