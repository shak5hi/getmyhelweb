import Header from "@/components/Header";
import WaitlistForm from "@/components/WaitlistForm";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-[#ececec] text-zinc-900 font-sans selection:bg-purple-200 selection:text-purple-900">
      <Header />

      <main className="flex-1 w-full pt-40 pb-20 px-6 md:px-12 lg:px-32 max-w-7xl mx-auto flex flex-col gap-24 relative">
        
        {/* Contact Layout mimicking the provided image */}
        <section className="flex flex-col gap-16 relative z-10">
          <div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tight text-[#2d2e33] leading-none mb-12">
              CONTACT US
            </h1>
            <div className="w-32 h-5 bg-[#2d2e33] mb-16"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl md:text-2xl font-black text-[#1a1b1e] uppercase">
                CONTACTS
              </h3>
              <div className="flex flex-col gap-3 text-lg md:text-xl text-[#3a3b40] font-medium mt-2">
                <a href="tel:+919818595170" className="hover:text-[#7c3aed] transition-colors">+91 9818595170</a>
                <a href="mailto:support@getmyhelp.in" className="hover:text-[#7c3aed] transition-colors">support@getmyhelp.in</a>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-xl md:text-2xl font-black text-[#1a1b1e] uppercase">
                ADDRESS
              </h3>
              <div className="flex flex-col gap-3 text-lg md:text-xl text-[#3a3b40] font-medium mt-2">
                <p>Ghaziabad, India</p>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Form Section */}
        <section className="flex flex-col items-start pt-10">
          <div className="mb-10 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-black text-[#1a082e] mb-4">Want early access?</h2>
            <p className="text-zinc-600 font-medium text-lg">Join our exclusive waitlist today and we'll reach out to you.</p>
          </div>
          <div className="w-full max-w-md">
            <WaitlistForm />
          </div>
        </section>

      </main>

      {/* Minimal Footer */}
      <footer className="w-full text-zinc-500 py-8 text-center text-xs border-t border-zinc-300 z-10 relative mt-auto">
        <p>© {new Date().getFullYear()} GetMyHelp.in. All rights reserved.</p>
      </footer>
    </div>
  );
}
