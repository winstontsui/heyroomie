"use client";

export default function ContactPage() {
  return (
    <div className="container-responsive py-16 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="text-lg mb-4 text-center max-w-xl">
        For questions, feedback, or support regarding HeyRoomie, please contact one of the following team members:
      </p>
      <ul className="text-lg space-y-2 mb-8">
        <li>
          <a href="mailto:wt285@cornell.edu" className="text-gold-600 hover:underline">wt285@cornell.edu</a>
        </li>
        <li>
          <a href="mailto:jl4537@cornell.edu" className="text-gold-600 hover:underline">jl4537@cornell.edu</a>
        </li>
        <li>
          <a href="mailto:ab3237@cornell.edu" className="text-gold-600 hover:underline">ab3237@cornell.edu</a>
        </li>
      </ul>
      <p className="text-light-600 text-center max-w-xl">
        We aim to respond to all inquiries within 24 hours. Thank you for reaching out!
      </p>
    </div>
  );
} 