import Link from "next/link";
import Container from "./ui/container";

const Footer = () => {
  return (
    <footer className="mt-16 border-t bg-slate-50 text-slate-700">
      <Container>
        <section className="mx-auto flex w-full max-w-6xl p-4 py-10 ">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="flex-start flex flex-col gap-2">
              <h5 className="pb-2 text-lg font-semibold">Products</h5>
              <Link href="/products">All</Link>
              <Link href="/shops">Shops</Link>
              <Link href="/tools">Tools</Link>
            </div>
            <div className="flex-start flex flex-col gap-2">
              <h5 className="pb-2 text-lg font-semibold">The Collective</h5>
              <a href="#!">About Us</a>
              <a href="/registration">Become an Artisan</a>
              <a href="/contact">Contact Us</a>
            </div>
            <div className="flex-start flex flex-col gap-2">
              <h5 className="pb-2 text-lg font-semibold">Legal</h5>
              <Link href="/legal/collective-agreement">
                The Artisanal Futures Collective Agreement
              </Link>
              <Link href="/legal/privacy">Privacy Policy</Link>
              <Link href="/legal/terms-of-service">Terms of Service</Link>
            </div>
            <div className="flex-start flex flex-col gap-2">
              <h5 className="pb-2 text-lg font-semibold">Follow Us</h5>
              <a href="#!">Facebook</a>
              <a href="#!">Twitter</a>
              <a href="#!">Instagram</a>
            </div>
          </div>
        </section>
      </Container>
      <div className="mx-auto py-10">
        <p className="text-center text-sm text-black">
          &copy; 2023 Artisanal Futures. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
