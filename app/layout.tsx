 import "./globals.css";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export const metadata = {
  title: "Visnec Nexus - Digital Innovation Hub",
  description:
    "Explore AI-driven tools, platforms, and immersive experiences shaping the future of innovation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <Navigation />
        <main className="pt-24 md:pt-28 max-w-7xl mx-auto px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
