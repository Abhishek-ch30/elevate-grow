import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Clock, 
  Users, 
  IndianRupee, 
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
  Calendar,
  Award,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app this would come from database
const trainingsData: Record<number, {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  duration: string;
  price: number;
  enrolled: number;
  badge: string;
  curriculum: string[];
  prerequisites: string[];
  outcomes: string[];
}> = {
  1: {
    id: 1,
    title: "React.js Masterclass",
    description: "Build modern, scalable web applications with React, Redux, TypeScript, and modern tooling.",
    longDescription: "This comprehensive React.js course takes you from fundamentals to advanced concepts. You'll learn to build production-ready applications using modern React patterns, TypeScript, state management with Redux Toolkit, and testing with React Testing Library. By the end, you'll be confident in building complex, scalable frontend applications.",
    duration: "8 weeks",
    price: 15000,
    enrolled: 45,
    badge: "Popular",
    curriculum: [
      "React Fundamentals & JSX",
      "Hooks Deep Dive (useState, useEffect, useContext, useReducer)",
      "TypeScript with React",
      "State Management with Redux Toolkit",
      "React Router for Navigation",
      "API Integration & Data Fetching",
      "Testing with React Testing Library",
      "Performance Optimization",
    ],
    prerequisites: [
      "Basic JavaScript knowledge",
      "HTML & CSS fundamentals",
      "Understanding of ES6+ features",
    ],
    outcomes: [
      "Build complete React applications from scratch",
      "Implement complex state management",
      "Write maintainable, type-safe code",
      "Deploy applications to production",
    ],
  },
  2: {
    id: 2,
    title: "Cloud Architecture with AWS",
    description: "Design and deploy scalable cloud infrastructure on Amazon Web Services.",
    longDescription: "Master Amazon Web Services and learn to architect scalable, secure, and cost-effective cloud solutions. This hands-on course covers core AWS services, infrastructure as code, security best practices, and real-world architecture patterns. Perfect for developers looking to transition into cloud roles or enhance their DevOps skills.",
    duration: "10 weeks",
    price: 25000,
    enrolled: 32,
    badge: "Advanced",
    curriculum: [
      "AWS Fundamentals & IAM",
      "EC2, VPC & Networking",
      "S3 & Storage Solutions",
      "RDS & DynamoDB",
      "Lambda & Serverless",
      "CloudFormation & Terraform",
      "CI/CD with CodePipeline",
      "Security & Compliance",
      "Cost Optimization",
      "Architecture Patterns",
    ],
    prerequisites: [
      "Basic understanding of networking",
      "Command line familiarity",
      "Programming experience in any language",
    ],
    outcomes: [
      "Design scalable AWS architectures",
      "Implement infrastructure as code",
      "Optimize cloud costs",
      "Prepare for AWS certifications",
    ],
  },
  3: {
    id: 3,
    title: "Full Stack Development",
    description: "Comprehensive training covering React, Node.js, databases, and deployment.",
    longDescription: "Become a complete full-stack developer with this intensive program. You'll master frontend development with React, backend with Node.js and Express, databases (SQL and NoSQL), and modern deployment practices. Build real-world projects that demonstrate your ability to create production-ready applications.",
    duration: "12 weeks",
    price: 35000,
    enrolled: 28,
    badge: "Comprehensive",
    curriculum: [
      "HTML, CSS & JavaScript Fundamentals",
      "React.js & State Management",
      "Node.js & Express",
      "RESTful API Design",
      "PostgreSQL & MongoDB",
      "Authentication & Authorization",
      "Testing Strategies",
      "Docker & Containerization",
      "CI/CD Pipelines",
      "Cloud Deployment",
      "Capstone Project",
    ],
    prerequisites: [
      "Basic programming knowledge",
      "Problem-solving mindset",
      "Commitment to intensive learning",
    ],
    outcomes: [
      "Build full-stack applications independently",
      "Understand the complete software development lifecycle",
      "Deploy and maintain production applications",
      "Prepare for full-stack developer roles",
    ],
  },
};

// Add more training data for other IDs
for (let i = 4; i <= 8; i++) {
  trainingsData[i] = {
    id: i,
    title: `Training Program ${i}`,
    description: "A comprehensive training program designed for professionals.",
    longDescription: "This program offers in-depth training on modern technologies and best practices. You'll gain hands-on experience through practical projects and real-world scenarios.",
    duration: "8 weeks",
    price: 15000 + (i * 2000),
    enrolled: 20 + i,
    badge: "Available",
    curriculum: ["Module 1", "Module 2", "Module 3", "Module 4"],
    prerequisites: ["Basic knowledge required"],
    outcomes: ["Skill 1", "Skill 2", "Skill 3"],
  };
}

const TrainingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    userType: "professional",
  });
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const training = trainingsData[Number(id)];

  if (!training) {
    return (
      <PageLayout>
        <div className="relative min-h-screen circuit-board-bg overflow-hidden">
          {/* BACKGROUND ELEMENTS */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float animation-delay-500" />
          </div>

          {/* 🔥 SINGLE GLASS OVERLAY */}
          <div className="container mx-auto max-w-7xl relative z-10 px-4 sm:px-6 lg:px-8 mt-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/15 shadow-2xl p-8 sm:p-12 lg:p-16">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Program Not Found</h1>
                <Link to="/training">
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white/90 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group">
                    <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform duration-300" />
                    <span className="font-medium">Back to Programs</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would submit to backend
    toast({
      title: "Enrollment Initiated!",
      description: "Redirecting to payment...",
    });
    setIsEnrollOpen(false);
    // Would navigate to payment page
  };

  return (
    <PageLayout>
      <div className="relative min-h-screen circuit-board-bg overflow-hidden">
        {/* BACKGROUND ELEMENTS */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float animation-delay-500" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* 🔥 SINGLE GLASS OVERLAY */}
        <div className="container mx-auto max-w-7xl relative z-10 px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/15 shadow-2xl p-8 sm:p-12 lg:p-16">
          
          {/* Breadcrumb */}
          <section className="mb-8">
            <Link 
              to="/training" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white/90 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform duration-300" />
              <span className="font-medium">Back to All Programs</span>
            </Link>
          </section>

          {/* Hero */}
          <section className="mb-16">
            <div className="max-w-4xl">
              <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4">
                {training.badge}
              </div>
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                style={{ fontFamily: "'Nasalization', sans-serif" }}
              >
                {training.title}
              </h1>
              <p className="text-lg text-white/70 mb-6">
                {training.longDescription}
              </p>
              
              {/* Meta */}
              <div className="flex flex-wrap gap-6 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span>{training.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>{training.enrolled} enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span>Next batch: Feb 2024</span>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="mb-16">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Left Column - Curriculum Only */}
              <div className="lg:col-span-2">
                {/* Curriculum */}
                <div>
                  <h2 
                    className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center gap-3"
                    style={{ fontFamily: "'Nasalization', sans-serif" }}
                  >
                    <BookOpen className="w-6 h-6 text-cyan-400" />
                    Curriculum
                  </h2>
                  <ul className="space-y-3">
                    {training.curriculum.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 p-4 rounded-xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-white/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column - Prerequisites and Outcomes */}
              <div className="lg:col-span-1 space-y-16">
                {/* Prerequisites */}
                <div className="mt-8">
                  <h2 
                    className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center gap-3"
                    style={{ fontFamily: "'Nasalization', sans-serif" }}
                  >
                    <GraduationCap className="w-6 h-6 text-cyan-400" />
                    Prerequisites
                  </h2>
                  <ul className="space-y-2">
                    {training.prerequisites.map((item, index) => (
                      <li key={index} className="flex items-center gap-3 text-white/70">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcomes */}
                <div>
                  <h2 
                    className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center gap-3"
                    style={{ fontFamily: "'Nasalization', sans-serif" }}
                  >
                    <Award className="w-6 h-6 text-cyan-400" />
                    What You'll Achieve
                  </h2>
                  <ul className="space-y-3">
                    {training.outcomes.map((item, index) => (
                      <li key={index} className="flex items-center gap-3 text-white/70">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Enrollment Card - Full Width */}
          <section className="mb-16">
            <div className="p-8 rounded-2xl bg-black/40 backdrop-blur-md border-2 border-cyan-500/50 cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-4xl md:text-5xl font-bold text-white mb-2">
                    <IndianRupee className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
                    {training.price.toLocaleString("en-IN")}
                  </div>
                  <p className="text-base md:text-lg text-white/60">One-time payment</p>
                </div>
                
                <div className="text-center md:text-right">
                  <button
                    onClick={() => setIsEnrollOpen(true)}
                    className="inline-flex items-center justify-center gap-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 py-4 px-8 rounded-xl hover:bg-cyan-500/30 hover:border-cyan-400 transition-all duration-300 font-medium text-lg md:text-xl"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mt-8">
                <div className="flex items-center gap-3 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-sm">Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-sm">Hands-on Projects</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-sm">Expert Instructors</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-sm">Lifetime Access to Materials</span>
                </div>
              </div>
            </div>
          </section>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      <Dialog open={isEnrollOpen} onOpenChange={setIsEnrollOpen}>
        <DialogContent className="sm:max-w-md bg-white/5 backdrop-blur-xl border border-white/15">
          <DialogHeader>
            <DialogTitle className="text-white">Enroll in {training.title}</DialogTitle>
            <DialogDescription className="text-white/70">
              Fill in your details to proceed with enrollment.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEnrollSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/80 text-sm">Full Name</Label>
              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400">
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-transparent border-none text-white placeholder:text-white/60 w-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80 text-sm">Email</Label>
              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-transparent border-none text-white placeholder:text-white/60 w-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-white/80 text-sm">Mobile Number</Label>
              <div className="flex items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 focus-within:border-cyan-400">
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="bg-transparent border-none text-white placeholder:text-white/60 w-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-white/80 text-sm">I am a</Label>
              <RadioGroup
                value={formData.userType}
                onValueChange={(value) => setFormData({ ...formData, userType: value })}
                className="text-white"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="professional" className="border-cyan-500/30 text-cyan-400" />
                  <Label htmlFor="professional" className="font-normal text-white/80">Professional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" className="border-cyan-500/30 text-cyan-400" />
                  <Label htmlFor="student" className="font-normal text-white/80">Student</Label>
                </div>
              </RadioGroup>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 py-3 px-4 rounded-lg hover:bg-cyan-500/30 hover:border-cyan-400 transition-all duration-300 font-medium"
            >
              Proceed to Payment
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default TrainingDetail;
