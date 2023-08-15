import Link from "next/link";

// import getCategories from "~/actions/app/get-categories";
import MainNav from "~/components/main-nav";
import NavbarActions from "~/components/navbar-actions";
import Container from "~/components/ui/container";
// import { api } from "~/utils/api";

const Navbar = () => {
  //   const { data: categories } = api.categories.getAllCategories.useQuery({
  //     storeId: process.env.NEXT_PUBLIC_STORE_ID!,
  //   });

  const categories = [
    {
      id: "artisans",
      name: "Artisans",
    },
    {
      id: "shops",
      name: "Shops",
    },
    {
      id: "products",
      name: "Products",
    },
    {
      id: "forums",
      name: "Forums",
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
          <Link href="/" className="ml-4 flex gap-x-2 lg:ml-0">
            <img
              className="block h-5 w-auto lg:hidden"
              src="/img/logo.png"
              alt="Artisanal Futures logo"
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
