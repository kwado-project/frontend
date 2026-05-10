import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Brain, Target, TrendingUp, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Diagnostic",
    description: "Our adaptive engine identifies your exact weak points across all your JAMB subjects before you even start studying.",
  },
  {
    icon: Target,
    title: "Personalized Roadmap",
    description: "Stop guessing what to study. Get a day-by-day, topic-by-topic study plan optimized for your exam date.",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Track your mastery of every topic. Watch your predicted score climb as you complete your daily tasks.",
  },
  {
    icon: ShieldCheck,
    title: "Real Exam Simulation",
    description: "Practice with standard JAMB questions in an interface that perfectly mimics the actual CBT environment.",
  },
];

const testimonials = [
  {
    quote: "Kwado AI completely changed how I prepared. The roadmap told me exactly what to read each day. I scored 315 and got into Unilag.",
    author: "Chinedu Okafor",
    score: "315",
    university: "University of Lagos",
  },
  {
    quote: "I was struggling with Physics until the diagnostic test showed me I specifically needed to work on Optics and Waves. Incredible tool.",
    author: "Aisha Mohammed",
    score: "298",
    university: "Ahmadu Bello University",
  },
  {
    quote: "The interface is so clean and the analytics kept me motivated. It felt like having a private tutor in my pocket.",
    author: "Emmanuel Ojo",
    score: "305",
    university: "University of Ibadan",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              K
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">Kwado AI</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Success Stories</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Button asChild className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/register">Start for Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          <div className="container mx-auto px-4 md:px-8 text-center max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                The ultimate JAMB prep companion
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                Your guaranteed path to <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">your dream university.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Kwado AI analyzes your strengths, identifies your exact weak points, and builds a day-by-day roadmap to help you score 300+ in your JAMB examination.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button size="lg" asChild className="rounded-full px-8 h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 w-full sm:w-auto">
                  <Link href="/register">
                    Start Your Assessment
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full px-8 h-14 text-lg border-border hover:bg-muted w-full sm:w-auto">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">Join 10,000+ students already preparing with Kwado AI</p>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why top students choose Kwado AI</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">We've replaced generic study methods with targeted, data-driven preparation.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">The path to 300+</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">A proven methodology to maximize your JAMB score.</p>
            </div>

            <div className="space-y-16">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">1</div>
                  <h3 className="text-2xl font-bold text-foreground">Take the Diagnostic</h3>
                  <p className="text-lg text-muted-foreground">Start with a comprehensive test across your 4 chosen subjects. Our AI analyzes your responses to map your exact knowledge baseline.</p>
                </div>
                <div className="flex-1 bg-muted rounded-3xl p-8 aspect-video flex items-center justify-center border border-border">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
                    <p className="font-medium text-foreground">Analyzing Performance...</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                <div className="flex-1 space-y-6">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">2</div>
                  <h3 className="text-2xl font-bold text-foreground">Follow your Roadmap</h3>
                  <p className="text-lg text-muted-foreground">Receive a personalized daily study plan leading up to your exam day. We prioritize the high-yield topics you're weakest in.</p>
                </div>
                <div className="flex-1 bg-muted rounded-3xl p-8 aspect-video border border-border relative overflow-hidden">
                   <div className="absolute inset-x-8 top-8 bottom-0 bg-background rounded-t-xl border border-b-0 border-border p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-12 bg-muted rounded"></div>
                      <div className="h-12 bg-primary/10 border border-primary/20 rounded"></div>
                      <div className="h-12 bg-muted rounded"></div>
                   </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">3</div>
                  <h3 className="text-2xl font-bold text-foreground">Track Mastery</h3>
                  <p className="text-lg text-muted-foreground">Watch your subject mastery grow through daily quizzes and analytics. See your predicted score climb as you put in the work.</p>
                </div>
                <div className="flex-1 bg-muted rounded-3xl p-8 aspect-video flex items-end justify-center gap-4 border border-border pb-12">
                  <div className="w-8 bg-primary/40 rounded-t-md h-12"></div>
                  <div className="w-8 bg-primary/60 rounded-t-md h-24"></div>
                  <div className="w-8 bg-primary/80 rounded-t-md h-32"></div>
                  <div className="w-8 bg-primary rounded-t-md h-48 relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-primary">315</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Real results from real students</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Don't just take our word for it.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-card p-8 rounded-3xl border border-border flex flex-col h-full"
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-emerald-500 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground italic mb-8 flex-1">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-primary font-medium">Scored {testimonial.score} • {testimonial.university}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section id="pricing" className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <div className="bg-gradient-to-br from-primary/10 to-background border border-primary/20 rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Simple, transparent pricing</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">Everything you need to crush your JAMB exams, for less than the cost of a textbook.</p>
              
              <div className="bg-card rounded-2xl p-8 border border-border max-w-md mx-auto shadow-xl shadow-primary/5">
                <div className="text-5xl font-bold text-foreground mb-2">₦1,550<span className="text-xl text-muted-foreground font-normal">/mo</span></div>
                <p className="text-muted-foreground mb-8">Cancel anytime. No hidden fees.</p>
                
                <ul className="space-y-4 mb-8 text-left">
                  {[
                    "Full diagnostic assessment",
                    "Personalized daily roadmap",
                    "Unlimited practice questions",
                    "Detailed performance analytics",
                    "Real exam CBT simulation"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button size="lg" className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <Link href="/register">Start Preparing Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-muted py-12 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  K
                </div>
                <span className="font-bold text-lg text-foreground">Kwado AI</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs">
                Premium AI-powered JAMB preparation for Nigerian students aiming for excellence.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Log in</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kwado AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
