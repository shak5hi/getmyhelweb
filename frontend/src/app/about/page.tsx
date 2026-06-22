import Header from "@/components/Header";
import WaitlistForm from "@/components/WaitlistForm";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-[#faf9fe] text-zinc-900 font-sans selection:bg-purple-200 selection:text-purple-900">
      <Header />

      <main className="flex-1 w-full pt-32 pb-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto flex flex-col gap-32 relative">
        {/* Subtle Background Glows */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-40 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10"></div>
        
        {/* Hero Typography Section */}
        <section className="flex flex-col items-center text-center gap-8 relative z-10 pt-10">
          <div className="inline-flex items-center gap-2 bg-purple-100/60 border border-purple-200/50 px-4 py-2 rounded-full shadow-sm">
            <span className="text-xs font-bold tracking-widest text-[#7c3aed] uppercase">
              Our Mission
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-[#1a082e] leading-[0.9]">
            ABOUT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-indigo-400">US</span>
          </h1>
          
          <div className="mt-8 flex flex-col gap-6 max-w-3xl">
            <p className="text-2xl md:text-3xl lg:text-4xl text-[#1a082e] font-bold leading-tight tracking-tight">
              At GetMyHelp.in, we believe that a peaceful home starts with dependable support.
            </p>
            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium">
              Yet, for most Indian families, managing domestic help has always been challenging — irregular attendance, sudden unavailability, difficult replacements, and inconsistent salary expectations can cause daily stress.
            </p>
            <p className="text-2xl md:text-3xl font-black text-[#7c3aed] mt-4">
              We are here to change that.
            </p>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="bg-white rounded-[3rem] p-10 md:p-20 shadow-[0_20px_50px_rgba(124,58,237,0.05)] border border-purple-100/50 relative overflow-hidden z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#7c3aed]/10 to-transparent rounded-bl-full -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-tr-full -z-10"></div>
          
          <div className="max-w-4xl mx-auto flex flex-col gap-16">
            <h2 className="text-5xl md:text-7xl font-black text-[#1a082e] tracking-tight">
              Who We Are
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="flex flex-col gap-8 group">
                <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#7c3aed] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm border border-purple-100/50">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-lg md:text-xl text-zinc-600 leading-relaxed font-medium">
                  <span className="font-bold text-[#1a082e] border-b-2 border-purple-200 pb-0.5">GetMyHelp.in</span> is a managed domestic staffing service built for modern Indian households. We hire, train, verify, and manage domestic helpers from within local neighborhoods and societies, ensuring families receive reliable, consistent and professional support every day.
                </p>
              </div>
              
              <div className="flex flex-col gap-8 group">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-sm border border-indigo-100/50">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                   </svg>
                </div>
                <p className="text-lg md:text-xl text-zinc-600 leading-relaxed font-medium">
                  Our helpers are not freelancers or unverified outsiders — <span className="font-bold text-[#1a082e]">they are our employees</span>, trusted, trained, and cared for by us. Families simply subscribe to the service and enjoy a <span className="text-[#7c3aed] font-bold">worry-free experience</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Form Section */}
        <section className="flex flex-col items-center justify-center pt-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-[#1a082e] mb-4">Ready to experience the difference?</h2>
            <p className="text-zinc-500 font-medium">Join our exclusive waitlist today.</p>
          </div>
          <WaitlistForm />
        </section>

      </main>

      {/* Minimal Footer */}
      <footer className="w-full bg-white text-zinc-400 py-8 text-center text-xs border-t border-purple-100/50 z-10 relative mt-auto">
        <p>© {new Date().getFullYear()} GetMyHelp.in. All rights reserved.</p>
      </footer>
    </div>
  );
}
