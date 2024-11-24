import React, { ReactNode } from "react";
import { AiOutlineCloudUpload, AiOutlineSafety, AiOutlineTeam } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="font-sans bg-gray-100">
      {/* Hero Section */}
      <header className="bg-teal-600 text-white py-12">
        <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center justify-between">
          {/* Hero Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold lg:text-6xl">
              Manage Your Drives in One Place
            </h1>
            <p className="mt-4 text-lg lg:text-xl">
              Simplify file management, secure your data, and stay organized with InfySpace.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-white text-teal-600 px-6 py-3 rounded-md text-lg font-medium hover:bg-teal-50">
                Get Started for Free
              </button>
              <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-teal-700">
                Learn More
              </button>
            </div>
          </div>

          {/* Login Button */}
          <div className="mt-8 lg:mt-0">
            <button className="bg-teal-800 hover:bg-teal-900 text-white px-6 py-3 rounded-md font-medium" onClick={()=>{navigate("/login")}}>
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-teal-700">Why Choose InfySpace?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<AiOutlineCloudUpload className="text-teal-600 text-5xl" />}
            title="Unified Drive Management"
            description="Connect and manage Google Drive, OneDrive, Dropbox, and more in one place."
          />
          <FeatureCard
            icon={<AiOutlineSafety className="text-teal-700 text-5xl" />}
            title="Enhanced Security"
            description="Your data is encrypted and securely stored with cutting-edge protocols."
          />
          <FeatureCard
            icon={<AiOutlineTeam className="text-teal-800 text-5xl" />}
            title="Team Collaboration"
            description="Share files and collaborate seamlessly with your team or clients."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-200 py-16">
        <div className="container mx-auto px-6 lg:px-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-teal-700">How It Works</h2>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <StepCard
              number="1"
              title="Sign Up"
              description="Create your free account and start connecting your drives instantly."
            />
            <StepCard
              number="2"
              title="Connect Drives"
              description="Link all your cloud storage accounts to access them in one dashboard."
            />
            <StepCard
              number="3"
              title="Organize Files"
              description="Manage, share, and collaborate on files with ease from a unified interface."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto py-16 px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-teal-700">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard
            user="Jane Doe"
            quote="InfySpace has made managing my drives effortless. Highly recommend it!"
          />
          <TestimonialCard
            user="John Smith"
            quote="The best platform for file management. Security and simplicity at its finest!"
          />
          <TestimonialCard
            user="Emma Wilson"
            quote="Collaborating with my team has never been easier. InfySpace is a lifesaver!"
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-teal-600 text-white py-16">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <h2 className="text-3xl font-bold mb-8">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Basic"
              price="$0/month"
              features={["5GB Storage", "Single Drive Support", "Basic Features"]}
            />
            <PricingCard
              title="Pro"
              price="$9.99/month"
              features={["Unlimited Storage", "Multiple Drives", "Advanced Features"]}
              highlight
            />
            <PricingCard
              title="Enterprise"
              price="Custom Pricing"
              features={["Team Accounts", "Priority Support", "Custom Integrations"]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} InfySpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

/* Helper Components */
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white shadow-md rounded-lg p-6 text-center">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => (
  <div className="flex-1 text-center">
    <div className="bg-teal-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4">
      {number}
    </div>
    <h4 className="text-lg font-semibold mb-2">{title}</h4>
    <p className="text-gray-600">{description}</p>
  </div>
);

interface TestimonialCardProps {
  user: string;
  quote: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ user, quote }) => (
  <div className="bg-white shadow-md rounded-lg p-6 text-center">
    <p className="text-gray-600 italic">"{quote}"</p>
    <h4 className="text-lg font-semibold mt-4">{user}</h4>
  </div>
);

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  highlight?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, features, highlight }) => (
  <div
    className={`p-6 rounded-lg text-center ${
      highlight ? "bg-teal-700 text-white" : "bg-white text-gray-800 shadow-md"
    }`}
  >
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-3xl font-bold mb-4">{price}</p>
    <ul className="text-sm mb-6">
      {features.map((feature, index) => (
        <li key={index} className="mb-2">
          {feature}
        </li>
      ))}
    </ul>
    <button
      className={`px-6 py-3 rounded-md font-medium ${
        highlight ? "bg-white text-teal-700" : "bg-teal-600 text-white"
      }`}
    >
      {highlight ? "Get Pro" : "Select"}
    </button>
  </div>
);

export default LandingPage;
