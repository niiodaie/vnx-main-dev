import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SpeedTestPanel from "@/components/netscan/SpeedTestPanel";

export const metadata = {
  title: "VNX Speed Test | Internet Speed & Latency Checker",
  description: "Test your connection with VNX-Netscan’s diagnostic engine.",
};

export default function SpeedTestPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <SpeedTestPanel />
      </main>
      <Footer />
    </div>
  );
}
