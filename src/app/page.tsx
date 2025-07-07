import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import Image from 'next/image';

export default function Home() {
  return (
    // Main container for the whole page
    <main className="flex flex-col items-center bg-white text-black">

      {/* =================================================================== */}
      {/* HEADER / TOP NAVIGATION BAR */}
      {/* =================================================================== */}
      <header className="w-full absolute top-0 left-0 py-4 px-8 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left Side: Logo and Name */}
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="Ten99 Logo" width={32} height={32} />
            <span className="font-bold text-xl tracking-tight">Ten99</span>
          </Link>
          
          {/* Right Side: Sign In / Dashboard Button */}
          <div>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="font-semibold text-gray-600 hover:text-black transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Dashboard
                </button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>


      {/* =================================================================== */}
      {/* Hero Section */}
      {/* =================================================================== */}
      <section className="w-full text-center pt-40 pb-24 px-6 bg-gray-50">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Your Freelancing, Simplified.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Everything you need to manage your clients, calendar, and payments—all in one simple place.
        </p>
        
        <div className="flex justify-center">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white font-bold py-3 px-10 rounded-lg text-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className="bg-blue-600 text-white font-bold py-3 px-10 rounded-lg text-lg hover:bg-blue-700 transition-colors">
                Go to Your Dashboard
              </button>
            </Link>
          </SignedIn>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          From inbox to invoice, effortlessly.
        </p>
      </section>

      {/* =================================================================== */}
      {/* "You Handle the Work" Section */}
      {/* =================================================================== */}
      <section className="w-full text-center py-24 px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">You Handle the Work. Ten99 Handles the Rest.</h2>
        {/* === APOSTROPHE FIXES ARE IN THIS PARAGRAPH === */}
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          Being a freelancer means wearing every hat. From booking jobs to sending invoices to remembering who&apos;s paid you—and who hasn&apos;t—it&apos;s easy to feel buried in admin work. Ten99 brings it all together into one smart, simple place.
        </p>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          <div className="p-2"><span className="text-green-500 mr-2">✅</span>View your whole schedule at a glance</div>
          <div className="p-2"><span className="text-green-500 mr-2">✅</span>Stay on top of every client and detail</div>
          <div className="p-2"><span className="text-green-500 mr-2">✅</span>Track income, mileage, and expenses</div>
          <div className="p-2"><span className="text-green-500 mr-2">✅</span>Send polished invoices in seconds</div>
        </div>
      </section>
      
      {/* =================================================================== */}
      {/* "Meet Alex" Story Section */}
      {/* =================================================================== */}
      <section className="w-full py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Alex. (Or Meet Yourself).</h2>
            <p className="text-lg text-gray-600">
                Alex is a freelance designer. Every week, they juggle emails from clients, last-minute reschedules, chasing payments, and wondering how much to save for taxes. You didn’t go freelance to spend your evenings formatting spreadsheets.
            </p>
            <p className="mt-8 text-xl font-medium">
                Ten99 was built for Alex—and for you.
            </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* REWRITTEN "FEATURES" SECTION */}
      {/* =================================================================== */}
       <section className="w-full text-center py-24 px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">The Power of an Entirely Unified Workflow.</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 text-left">
          
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">Simple, Not Simplistic</h3>
            <p className="text-gray-600">Ten99 is powerful enough to run your entire business, yet simple enough to set up in minutes. It enhances your workflow, not overhauls it.</p>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">Total Financial Clarity</h3>
            <p className="text-gray-600">Consolidate every income stream—W2, 1099, and more—into one clear dashboard. Understand your real earnings and cash flow at a glance.</p>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">Built for the Modern Freelancer</h3>
            <p className="text-gray-600">Every feature, from smart expense tracking to centralized client notes, was designed to solve the real-world challenges of independent work.</p>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">Tax Season, Without the Stress</h3>
            <p className="text-gray-600">Smart expense categorization and real-time tax estimates mean you&apos;re always prepared. Say goodbye to year-end surprises and hello to confidence.</p>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* Final Call to Action Section */}
      {/* =================================================================== */}
      <section className="w-full text-center py-24 px-6 bg-gray-900 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Stop Juggling. Start Thriving.</h2>
        <p className="text-lg max-w-3xl mx-auto mb-8">
          Take the stress out of self-employment and get back to the work you love.
        </p>
        <div className="flex justify-center">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-white text-blue-600 font-bold py-3 px-10 rounded-lg text-lg hover:bg-gray-200 transition-colors">
                Create Your Account Now
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className="bg-white text-blue-600 font-bold py-3 px-10 rounded-lg text-lg hover:bg-gray-200 transition-colors">
                Go to Your Dashboard
              </button>
            </Link>
          </SignedIn>
        </div>
      </section>

    </main>
  );
}
