import { hasCookie, setCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

import { CookieIcon } from "lucide-react";
import { cn } from "~/utils/styles";

// const CookieConsent = () => {
//   const [showConsent, setShowConsent] = useState(true);

//   useEffect(() => {
//     setShowConsent(hasCookie("localConsent"));
//   }, []);

//   const acceptCookie = () => {
//     setShowConsent(true);
//     setCookie("localConsent", "true", {});
//   };

//   if (showConsent) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 bg-slate-700 bg-opacity-70">
//       <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-gray-100 px-4 py-8">
//         <span className="text-dark mr-16 text-base">
//           This website uses cookies to improve user experience. By using our
//           website you consent to all cookies in accordance with our{" "}
//           <Link href="/legal/cookie-policy" target="_blank">
//             <Button variant={"link"} className="m-0 p-0 text-blue-500">
//               Cookie Policy
//             </Button>
//           </Link>
//           .
//         </span>
//         <Button variant={"default"} onClick={acceptCookie}>
//           Accept
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default CookieConsent;

export default function CookieConsent({
  demo = false,
  onAcceptCallback = () => void 0,
  onDeclineCallback = () => void 0,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hide, setHide] = useState(false);

  const accept = () => {
    setIsOpen(false);
    document.cookie =
      "cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    setTimeout(() => {
      setHide(true);
    }, 700);
    onAcceptCallback();
  };

  const decline = () => {
    setIsOpen(false);
    setTimeout(() => {
      setHide(true);
    }, 700);
    onDeclineCallback();
  };

  useEffect(() => {
    try {
      setIsOpen(true);
      if (document.cookie.includes("cookieConsent=true")) {
        if (!demo) {
          setIsOpen(false);
          setTimeout(() => {
            setHide(true);
          }, 700);
        }
      }
    } catch (e) {
      // console.log("Error: ", e);
    }
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[200] w-full transition-transform duration-700 sm:bottom-4 sm:left-4 sm:max-w-md",
        !isOpen
          ? "translate-y-8 opacity-0 transition-[opacity,transform]"
          : "translate-y-0 opacity-100 transition-[opacity,transform]",
        hide && "hidden"
      )}
    >
      <div className="m-2 rounded-md border bg-secondary shadow">
        <div className="grid gap-2">
          <div className="flex h-14 items-center justify-between border-b border-border p-4">
            <h1 className="text-lg font-medium">We use cookies</h1>
            <CookieIcon className="h-[1.2rem] w-[1.2rem]" />
          </div>
          <div className="p-4">
            <p className="text-sm font-normal">
              By using our website and services you agree to the use of cookies
              as described in our cookie policy. policy. For more information on
              how we use cookies, please see our cookie policy.
              <br />
              <br />
              <span className="text-xs">
                By clicking &quot;
                <span className="font-medium opacity-80">Accept</span>&quot;,
                you agree to our use of cookies.
              </span>
              <br />
              <Link
                href="/legal/cookies"
                className="text-xs underline"
                target="_blank"
              >
                Learn more.
              </Link>
            </p>
          </div>
          <div className="flex gap-2 border-t border-border bg-background/20 p-4 py-5">
            <Button onClick={accept} className="w-full">
              Accept
            </Button>
            {/* <Button onClick={decline} className="w-full" variant="secondary">
              Decline
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
