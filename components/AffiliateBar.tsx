"use client";
import React from "react";

interface AffiliateBarProps {
  category:
    | "speedtest"
    | "netscan"
    | "scamshield"
    | "faceup"
    | "rentcontrol"
    | "kazini"
    | "vmall"
    | "snap";
}

export default function AffiliateBar({ category }: AffiliateBarProps) {
  const affiliates = {
    speedtest: [
      {
        title: "Upgrade to WiFi 6",
        desc: "Boost range, speed & stability with the latest mesh routers.",
        img: "https://m.media-amazon.com/images/I/61f0pET2hCL._AC_SL1500_.jpg",
        link: "https://amzn.to/44mFp0h",
        color: "text-blue-600",
      },
      {
        title: "Protect Your Connection",
        desc: "Stay private and secure online with top-rated VPN services.",
        img: "https://upload.wikimedia.org/wikipedia/commons/7/7e/VPN_icon.svg",
        link: "https://payhip.com/affiliate-program",
        color: "text-cyan-600",
      },
      {
        title: "Support VNX Tools",
        desc: "Enjoy our tools? Help us expand diagnostics & features!",
        img: "https://cdn.buymeacoffee.com/buttons/bmc-new-logo.svg",
        link: "https://www.buymeacoffee.com/partners",
        color: "text-pink-600",
      },
    ],
    netscan: [
      {
        title: "Secure Your Network",
        desc: "Use a trusted VPN or firewall for enhanced protection.",
        img: "https://cdn-icons-png.flaticon.com/512/484/484613.png",
        link: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=101019",
        color: "text-cyan-600",
      },
      {
        title: "IP Intelligence API",
        desc: "Get accurate geolocation & WHOIS data with IPinfo.io.",
        img: "https://ipinfo.io/static/images/logo.svg",
        link: "https://ipinfo.io/signup?ref=visnec",
        color: "text-blue-600",
      },
    ],
    scamshield: [
      {
        title: "Stay Scam-Free",
        desc: "Protect yourself with advanced antivirus & identity guard tools.",
        img: "https://cdn-icons-png.flaticon.com/512/2910/2910768.png",
        link: "https://affiliate.norton.com/",
        color: "text-red-600",
      },
      {
        title: "Password Manager",
        desc: "Keep your passwords safe with 1Password or Bitwarden.",
        img: "https://upload.wikimedia.org/wikipedia/commons/2/2a/1Password_icon.svg",
        link: "https://1password.com/affiliates/",
        color: "text-slate-600",
      },
    ],
    faceup: [
      {
        title: "Shop SKKN by Kim",
        desc: "Discover clean beauty & skincare essentials.",
        img: "https://skknbykim.com/cdn/shop/files/SKKN-Logo_150x.png",
        link: "https://skknbykim.com/",
        color: "text-pink-600",
      },
      {
        title: "Beauty Lighting Kits",
        desc: "Professional lighting for your perfect selfie.",
        img: "https://m.media-amazon.com/images/I/61v7zP6N7aL._AC_SL1500_.jpg",
        link: "https://amzn.to/3AydGBo",
        color: "text-orange-600",
      },
    ],
    rentcontrol: [
      {
        title: "Smart Locks for Landlords",
        desc: "Secure your property with the latest IoT lock systems.",
        img: "https://m.media-amazon.com/images/I/61L9mW8bQ7L._AC_SL1500_.jpg",
        link: "https://amzn.to/3AydPgu",
        color: "text-slate-700",
      },
      {
        title: "QuickBooks for Renters",
        desc: "Simplify rent collection & accounting with QuickBooks.",
        img: "https://cdn.worldvectorlogo.com/logos/quickbooks-2.svg",
        link: "https://quickbooks.intuit.com/partners/affiliate/",
        color: "text-green-600",
      },
    ],
    kazini: [
      {
        title: "Relationship Growth Courses",
        desc: "Explore Payhip courses on trust, love, and communication.",
        img: "https://cdn-icons-png.flaticon.com/512/1077/1077035.png",
        link: "https://payhip.com/affiliate-program",
        color: "text-pink-600",
      },
      {
        title: "Support Couples Mode",
        desc: "Help us improve Truth Analyzer & couple features.",
        img: "https://cdn.buymeacoffee.com/buttons/bmc-new-logo.svg",
        link: "https://www.buymeacoffee.com/partners",
        color: "text-rose-600",
      },
    ],
    vmall: [
      {
        title: "Shop Global Essentials",
        desc: "Explore Africa-inspired products via Amazon Global Store.",
        img: "https://m.media-amazon.com/images/G/01/AMAZON_FASHION/2020/BRANDED_STORE_LOGOS/Amazon_Fashion_logo.png",
        link: "https://amzn.to/3AjVh9Q",
        color: "text-yellow-600",
      },
      {
        title: "Start Selling on Payhip",
        desc: "Launch your own Afro-inspired digital shop easily.",
        img: "https://cdn-icons-png.flaticon.com/512/7418/7418016.png",
        link: "https://payhip.com/affiliate-program",
        color: "text-blue-600",
      },
    ],
    snap: [
      {
        title: "Optimize Your Files",
        desc: "Compress, store, and manage assets with Paddle partners.",
        img: "https://cdn-icons-png.flaticon.com/512/1828/1828911.png",
        link: "https://www.paddle.com/partners",
        color: "text-sky-600",
      },
      {
        title: "Support Open Dev Tools",
        desc: "Help us build free productivity apps for creators.",
        img: "https://cdn.buymeacoffee.com/buttons/bmc-new-logo.svg",
        link: "https://www.buymeacoffee.com/partners",
        color: "text-yellow-600",
      },
    ],
  };

  const selected = affiliates[category] || [];

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        💡 Recommended Tools & Upgrades
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {selected.map((a, i) => (
          <a
            key={i}
            href={a.link}
            target="_blank"
            className="block bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center"
          >
            <img
              src={a.img}
              alt={a.title}
              className="w-20 h-20 mx-auto mb-4 object-contain"
            />
            <h3 className="font-semibold text-slate-800 mb-2">{a.title}</h3>
            <p className="text-sm text-slate-500 mb-3">{a.desc}</p>
            <span className={`${a.color} font-medium text-sm`}>
              Learn More →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
