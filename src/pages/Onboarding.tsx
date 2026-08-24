import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitOnboarding, getGetMeQueryKey, useGetSubjects } from "@/lib/hooks";
import { useAuth } from "@/store/auth";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Brain, BookOpen, Calendar, Clock, Sparkles } from "lucide-react";

//   subjects: z.array(z.string()).length(4, "You must select exactly 4 subjects for JAMB"),
//   examDate: z.string().min(1, "Exam date is required"),
//   dailyStudyHours: z.number().min(1).max(12),
// });

const onboardingSchema = z.object({
  subjects: z.array(z.string()).length(4, "You must select exactly 4 subjects for JAMB"),
  examDate: z.string().min(1, "Exam date is required"),
  dailyStudyHours: z.number().min(1).max(12),
});

type OnboardingStep = "welcome" | "subjects" | "examDate" | "studyHours" | "review";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const submitMutation = useSubmitOnboarding();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const { data: subjectItems, isLoading: isLoadingSubjects, error: subjectsError } = useGetSubjects();

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      subjects: [],
      examDate: "",
      dailyStudyHours: 4,
    },
  });

  const subjects = form.watch("subjects");
  const dailyStudyHours = form.watch("dailyStudyHours");
  const subjectNames = subjectItems?.map((item) => item.name) ?? [];

  // async function onSubmit(values: z.infer<typeof onboardingSchema>) {
  //   try {
  //     await submitMutation.mutateAsync({ data: values });

  //     if (user) {
  //       const updatedUser = { ...user, onboardingComplete: true };
  //       setUser(updatedUser);
  //       queryClient.setQueryData(getGetMeQueryKey(), updatedUser);
  //     }

  //     toast({
  //       title: "Profile configured",
  //       description: "Your personalized study environment is ready.",
  //     });

  //     setLocation("/subscribe");
  //   } catch (error: any) {
  //     toast({
  //       variant: "destructive",
  //       title: "Setup failed",
  //       description: error.response?.data?.message || "An error occurred during setup.",
  //     });
  //   }
  // }
  async function onSubmit(values: z.infer<typeof onboardingSchema>) {
    if (!values.examDate) {
      form.setError("examDate", {
        type: "manual",
        message: "Exam date is required",
      });
      return;
    }

    try {
      await submitMutation.mutateAsync({ data: values });

      if (user) {
        const updatedUser = { ...user, onboardingComplete: true };
        setUser(updatedUser);
        queryClient.setQueryData(getGetMeQueryKey(), updatedUser);
      }

      toast({
        title: "Profile configured",
        description: "Your personalized study environment is ready.",
      });

      setLocation("/subscribe");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Setup failed",
        description:
          error?.message ||
          "An error occurred during setup.",
      });
    }
  }
  const handleNext = (nextStep: OnboardingStep, fieldsToValidate?: (keyof z.infer<typeof onboardingSchema>)[]) => {
    if (fieldsToValidate) {
      form.trigger(fieldsToValidate).then((isValid) => {
        if (isValid) setStep(nextStep);
      });
    } else {
      setStep(nextStep);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-2 w-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500 ease-in-out"
          style={{
            width: step === 'welcome' ? '20%' :
                   step === 'subjects' ? '40%' :
                   step === 'examDate' ? '60%' :
                   step === 'studyHours' ? '80%' : '100%'
          }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">

                {step === "welcome" && (
                  <motion.div
                    key="welcome"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="p-12 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto border border-primary/20">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Welcome to Kwado AI, {user?.fullName?.split(' ')[0] || 'Student'}</h1>
                    <p className="text-xl text-muted-foreground max-w-md mx-auto">
                      Let's configure your personalized learning environment. We need a few details to build your custom roadmap.
                    </p>
                    <div className="pt-8">
                      <Button size="lg" className="px-8 h-14 text-lg rounded-full" onClick={() => handleNext("subjects")} type="button">
                        Let's Go
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === "subjects" && (
                  <motion.div
                    key="subjects"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="p-8 md:p-12"
                  >
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="text-primary w-6 h-6" />
                        <h2 className="text-2xl font-bold text-foreground">Select your subjects</h2>
                      </div>
                      <p className="text-muted-foreground">Choose exactly 4 subjects for your JAMB examination.</p>
                    </div>

                    {isLoadingSubjects ? (
                      <div className="rounded-2xl border border-border p-8 text-center text-muted-foreground">
                        Loading subjects...
                      </div>
                    ) : subjectsError ? (
                      <div className="rounded-2xl border border-destructive/40 p-8 text-center text-destructive">
                        <p className="font-medium mb-2">Unable to load subjects</p>
                        <p className="text-sm">Please refresh the page or try again later.</p>
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="subjects"
                        render={() => (
                          <FormItem>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                              {subjectNames.length > 0 ? subjectNames.map((subject) => (
                                <FormField
                                  key={subject}
                                  control={form.control}
                                  name="subjects"
                                  render={({ field }) => {
                                    const isSelected = field.value?.includes(subject);
                                    const isDisabled = !isSelected && field.value?.length >= 4;

                                    return (
                                      <FormItem
                                        key={subject}
                                        className={`flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 cursor-pointer transition-colors ${
                                          isSelected ? 'bg-primary/5 border-primary shadow-sm' : 'hover:bg-muted border-border'
                                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={isSelected}
                                            disabled={isDisabled}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, subject])
                                                : field.onChange(field.value?.filter((value) => value !== subject))
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-medium cursor-pointer">
                                          {subject}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              )) : (
                                <div className="rounded-2xl border border-border p-8 text-center text-muted-foreground">
                                  No subjects found. Please contact support.
                                </div>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="flex justify-between pt-6 border-t border-border mt-8">
                      <Button variant="ghost" onClick={() => setStep("welcome")} type="button">Back</Button>
                      <Button
                        onClick={() => handleNext("examDate", ["subjects"])}
                        type="button"
                        disabled={subjects.length !== 4}
                      >
                        Continue
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === "examDate" && (
                  <motion.div
                    key="examDate"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="p-8 md:p-12"
                  >
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="text-primary w-6 h-6" />
                        <h2 className="text-2xl font-bold text-foreground">When is your exam?</h2>
                      </div>
                      <p className="text-muted-foreground">We use this to pace your study roadmap correctly.</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="examDate"
                      render={({ field }) => (
                        <FormItem className="max-w-md">
                          <FormLabel>Target Exam Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between pt-6 border-t border-border mt-12">
                      <Button variant="ghost" onClick={() => setStep("subjects")} type="button">Back</Button>
                      {/* <Button onClick={() => handleNext("studyHours", ["examDate"])} type="button">Continue</Button> */}
                      <Button
                          type="button"
                          onClick={() => {
                            const examDate = form.getValues("examDate");

                            if (!examDate) {
                              form.setError("examDate", {
                                type: "manual",
                                message: "Exam date is required",
                              });
                              return;
                            }

                            setStep("studyHours");
                          }}
                        >
                          Continue
                        </Button>
                    </div>
                  </motion.div>
                )}

                {step === "studyHours" && (
                  <motion.div
                    key="studyHours"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="p-8 md:p-12"
                  >
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="text-primary w-6 h-6" />
                        <h2 className="text-2xl font-bold text-foreground">Daily commitment</h2>
                      </div>
                      <p className="text-muted-foreground">How many hours can you dedicate to studying each day?</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="dailyStudyHours"
                      render={({ field }) => (
                        <FormItem className="max-w-md mx-auto py-8">
                          <div className="text-center mb-8">
                            <span className="text-6xl font-bold text-primary">{field.value}</span>
                            <span className="text-xl text-muted-foreground ml-2">hours/day</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={1}
                              max={12}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              className="py-4"
                            />
                          </FormControl>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>1 hr</span>
                            <span>12 hrs</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between pt-6 border-t border-border mt-12">
                      <Button variant="ghost" onClick={() => setStep("examDate")} type="button">Back</Button>
                      <Button onClick={() => handleNext("review")} type="button">Review Plan</Button>
                    </div>
                  </motion.div>
                )}

                {step === "review" && (
                  <motion.div
                    key="review"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="p-8 md:p-12"
                  >
                    <div className="mb-8 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                        <Brain className="w-8 h-8" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">Your Plan is Ready</h2>
                      <p className="text-muted-foreground">Review your details before we generate your roadmap.</p>
                    </div>

                    <div className="bg-muted rounded-2xl p-6 space-y-6 border border-border">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Selected Subjects</p>
                        <div className="flex flex-wrap gap-2">
                          {subjects.map(s => (
                            <span key={s} className="px-3 py-1 bg-background rounded-md text-sm font-medium border border-border">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Target Date</p>
                          <p className="font-medium text-foreground">{form.getValues("examDate")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Daily Commitment</p>
                          <p className="font-medium text-foreground">{dailyStudyHours} hours</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-8">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-14 text-lg"
                        disabled={submitMutation.isPending}
                        data-testid="button-submit-onboarding"
                      >
                        {submitMutation.isPending ? "Configuring..." : "Confirm & Continue"}
                      </Button>
                      <Button variant="ghost" onClick={() => setStep("studyHours")} type="button">Go Back</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
