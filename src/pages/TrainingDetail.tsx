import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
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

  const training = trainingsData[Number(id)];

  if (!training) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
          <Link to="/training">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Programs
            </Button>
          </Link>
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
      {/* Breadcrumb */}
      <section className="pt-24 pb-4 bg-muted/50">
        <div className="container mx-auto px-4">
          <Link 
            to="/training" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Programs
          </Link>
        </div>
      </section>

      {/* Hero */}
      <section className="pb-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Badge className="mb-4">{training.badge}</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              {training.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {training.longDescription}
            </p>
            
            {/* Meta */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <span>{training.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <span>{training.enrolled} enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                <span>Next batch: Feb 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Curriculum */}
              <div>
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-accent" />
                  Curriculum
                </h2>
                <ul className="space-y-3">
                  {training.curriculum.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-sm font-medium flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prerequisites */}
              <div>
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6 flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-accent" />
                  Prerequisites
                </h2>
                <ul className="space-y-2">
                  {training.prerequisites.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div>
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-accent" />
                  What You'll Achieve
                </h2>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {training.outcomes.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column - Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-2xl bg-card border border-border shadow-lg">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-1 text-3xl font-bold text-foreground mb-1">
                    <IndianRupee className="w-7 h-7" />
                    {training.price.toLocaleString("en-IN")}
                  </div>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>

                <Button 
                  variant="accent" 
                  size="lg" 
                  className="w-full mb-4"
                  onClick={() => setIsEnrollOpen(true)}
                >
                  Enroll Now
                </Button>

                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Certificate of Completion
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Hands-on Projects
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Expert Instructors
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Lifetime Access to Materials
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Modal */}
      <Dialog open={isEnrollOpen} onOpenChange={setIsEnrollOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enroll in {training.title}</DialogTitle>
            <DialogDescription>
              Fill in your details to proceed with enrollment.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEnrollSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
              />
            </div>
            <div className="space-y-3">
              <Label>I am a</Label>
              <RadioGroup
                value={formData.userType}
                onValueChange={(value) => setFormData({ ...formData, userType: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="professional" />
                  <Label htmlFor="professional" className="font-normal">Professional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="font-normal">Student</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" variant="accent" className="w-full">
              Proceed to Payment
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default TrainingDetail;
