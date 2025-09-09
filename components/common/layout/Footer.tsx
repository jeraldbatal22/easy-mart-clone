import Image from "next/image";

export const Footer = () => {
  const footerLinks = {
    about: [
      { name: "About Us", href: "#" },
      { name: "Our Branches", href: "#" },
      { name: "Changelog", href: "#" }
    ],
    quickLinks: [
      { name: "FAQs", href: "#" },
      { name: "Recipes", href: "#" },
      { name: "Contact Us", href: "#" }
    ],
    helpSupport: [
      { name: "Terms of Privacy", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Security", href: "#" }
    ],
    company: [
      { name: "Blog", href: "#" },
      { name: "Contact", href: "#" }
    ],
    social: [
      { name: "Facebook", href: "#" },
      { name: "Instagram", href: "#" },
      { name: "Twitter", href: "#" }
    ]
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Logo */}
          <Image src="/assets/icons/logo.png" alt="logo" height={50} width={50}/>

          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-600 hover:text-purple-600 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-600 hover:text-purple-600 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Help & Support</h3>
            <ul className="space-y-2">
              {footerLinks.helpSupport.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-600 hover:text-purple-600 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-600 hover:text-purple-600 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Social</h3>
            <ul className="space-y-2">
              {footerLinks.social.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-600 hover:text-purple-600 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            All rights reserved © 2024 Emastudio
          </p>
        </div>
      </div>
    </footer>
  );
};
