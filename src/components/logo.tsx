import Image from "next/image";
import { cn } from "~/utils/styles";

const Logo = ({ className }: { className: string }) => {
  return (
    // <Link href="/" className="  flex items-center gap-x-2 ">
    <>
      <Image
        className=" block  h-5 lg:hidden"
        src="/img/logo_mobile.png"
        alt="Artisanal Futures logo"
        width={20}
        height={20}
      />
      <div
        className={cn(
          "relative hidden h-8 w-full overflow-hidden  lg:block",
          className
        )}
      >
        <Image
          src="/img/logo.png"
          alt="Artisanal Futures logo"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </>
    // </Link>
  );
};

export default Logo;
// 230.844 x 32
