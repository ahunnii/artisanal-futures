import { hasCookie, setCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(true);

  useEffect(() => {
    setShowConsent(hasCookie("localConsent"));
  }, []);

  const acceptCookie = () => {
    setShowConsent(true);
    setCookie("localConsent", "true", {});
  };

  if (showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-700 bg-opacity-70">
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-gray-100 px-4 py-8">
        <span className="text-dark mr-16 text-base">
          This website uses cookies to improve user experience. By using our
          website you consent to all cookies in accordance with our{" "}
          <Link href="/legal/cookie-policy" target="_blank">
            <Button variant={"link"} className="m-0 p-0 text-blue-500">
              Cookie Policy
            </Button>
          </Link>
          .
        </span>
        <Button variant={"default"} onClick={acceptCookie}>
          Accept
        </Button>
      </div>
    </div>
  );
};

export default CookieConsent;
