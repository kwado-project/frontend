import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetAdminQuestions, getGetAdminQuestionsQueryKey, useCreateQuestion, useDeleteQuestion, useUpdateQuestion, QuestionDifficulty } from "@/lib/hooks";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const SUBJECTS = [
  "All", "English", "Mathematics", "Physics", "Chemistry", "Biology",
  "Economics", "Government", "Literature", "CRS", "IRS",
  "Commerce", "Accounting", "Geography", "Agricultural Science"
];

export default function AdminQuestions() {
  const [page, setPage] = useState(1);
  const [subject, setSubject] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    subject: "English",
    text: "",
    options: ["", "", "", ""],
    correctOption: 0,
    explanation: "",
    difficulty: QuestionDifficulty.medium
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

  const querySubject = subject === "All" ? undefined : subject;

  const { data, isLoading } = useGetAdminQuestions({
    page,
    subject: querySubject
  }, {
    query: { queryKey: getGetAdminQuestionsQueryKey({ page, subject: querySubject }) }
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast({ title: "Question deleted" });
      queryClient.invalidateQueries({ queryKey: getGetAdminQuestionsQueryKey({ page, subject: querySubject }) });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: formData });
        toast({ title: "Question updated" });
      } else {
        await createMutation.mutateAsync({ data: formData });
        toast({ title: "Question created" });
      }
      setIsDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: getGetAdminQuestionsQueryKey({ page, subject: querySubject }) });
    } catch (error) {
      toast({ variant: "destructive", title: "Operation failed" });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      subject: "English",
      text: "",
      options: ["", "", "", ""],
      correctOption: 0,
      explanation: "",
      difficulty: QuestionDifficulty.medium
    });
  };

  const handleEdit = (q: any) => {
    setEditingId(q.id);
    setFormData({
      subject: q.subject,
      text: q.text,
      options: [...q.options, "", "", "", ""].slice(0, 4),
      correctOption: q.correctOption,
      explanation: q.explanation || "",
      difficulty: q.difficulty
    });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Question Bank</h1>
            <p className="text-slate-500">Manage questions for diagnostics and practice.</p>
          </div>
          <div className="flex gap-3">
            <Select value={subject} onValueChange={(val) => { setSubject(val); setPage(1); }}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="w-4 h-4 mr-2" /> Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Question" : "Create New Question"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Select value={formData.subject} onValueChange={(val) => setFormData({...formData, subject: val})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SUBJECTS.filter(s => s !== "All").map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select value={formData.difficulty} onValueChange={(val: any) => setFormData({...formData, difficulty: val})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Textarea required value={formData.text} onChange={(e) => setFormData({...formData, text: e.target.value})} rows={3} />
                  </div>

                  <div className="space-y-3">
                    <Label>Options</Label>
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input
                          required
                          value={formData.options[i]}
                          onChange={(e) => {
                            const newOpts = [...formData.options];
                            newOpts[i] = e.target.value;
                            setFormData({...formData, options: newOpts});
                          }}
                          placeholder={`Option ${i + 1}`}
                        />
                        <Button
                          type="button"
                          variant={formData.correctOption === i ? "default" : "outline"}
                          className={formData.correctOption === i ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                          onClick={() => setFormData({...formData, correctOption: i})}
                        >
                          Correct
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Explanation (Optional)</Label>
                    <Textarea value={formData.explanation} onChange={(e) => setFormData({...formData, explanation: e.target.value})} rows={2} />
                  </div>

                  <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Question"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

          </div>
        </div>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-24">Subject</TableHead>
                  <TableHead>Question Text</TableHead>
                  <TableHead className="w-24">Difficulty</TableHead>
                  <TableHead className="text-right w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-6 bg-slate-100 rounded animate-pulse w-20"></div></TableCell>
                      <TableCell><div className="h-6 bg-slate-100 rounded animate-pulse w-full max-w-md"></div></TableCell>
                      <TableCell><div className="h-6 bg-slate-100 rounded animate-pulse w-16"></div></TableCell>
                      <TableCell><div className="h-8 bg-slate-100 rounded animate-pulse w-16 ml-auto"></div></TableCell>
                    </TableRow>
                  ))
                ) : data?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">No questions found.</TableCell>
                  </TableRow>
                ) : (
                  data?.data?.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell>
                        <span className="inline-flex px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">
                          {q.subject}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="line-clamp-2 text-sm text-slate-900 max-w-xl" title={q.text}>
                          {q.text}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium capitalize ${
                          q.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                          q.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {q.difficulty}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 mr-1" onClick={() => handleEdit(q)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(q.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {data && data.total > data.limit && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm">
              <span className="text-slate-500">
                Showing {((page - 1) * data.limit) + 1} to {Math.min(page * data.limit, data.total)} of {data.total}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * data.limit >= data.total}>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
