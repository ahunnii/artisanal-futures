/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import MainNav from "~/components/main-nav";
import NavbarActions from "~/components/navbar-actions";
import Container from "~/components/ui/container";

const Navbar = () => {
  const categories = [
    {
      id: "shops",
      name: "Shops",
    },
    {
      id: "products",
      name: "Products",
    },
    {
      id: "forum",
      name: "Forum",
    },
    {
      id: "tools",
      name: "Tools",
    },
  ];

  return (
    <div className="border-b">
      <Container>
        <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className=" flex items-center gap-x-2 lg:ml-0">
            <Image
              className=" block  h-5 lg:hidden"
              src="/img/logo_mobile.png"
              alt="Artisanal Futures logo"
              width={20}
              height={20}
            />
            <img
              className="hidden h-5 w-auto lg:block"
              src="/img/logo.png"
              alt="Artisanal Futures logo"
            />
          </Link>
          {categories && <MainNav data={categories} />}
          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
