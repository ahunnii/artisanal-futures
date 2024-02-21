import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative mt-10 overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 border border-transparent bg-white pb-8 lg:w-full lg:max-w-2xl">
          <svg
            className="absolute bottom-0 right-0 top-0 hidden h-full w-48 translate-x-1/2 transform text-white lg:block "
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
          <div className="mx-auto my-6 max-w-7xl items-center px-4 sm:px-6 md:my-8 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="flex w-full flex-col items-center justify-center text-center lg:justify-start">
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Artisanal Futures
              </h1>
              <p className="mx-auto mt-3 text-lg text-slate-500 sm:mt-5 sm:max-w-xl md:mt-5 md:text-xl lg:mx-0">
                Shop worker-owned stores, share knowledge and tech, &
                participate in the transition to a decolonized circular economy.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <Link
                  className="rounded-md bg-slate-100 px-3 py-2 font-semibold transition-all hover:bg-slate-200 focus:bg-slate-300"
                  href={"/shops"}
                >
                  Browse Our Artisans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className=" block border border-solid border-transparent lg:absolute lg:bottom-0 lg:right-0 lg:top-0 lg:w-1/2">
        <div className="max-lg:aspect-[1.628] ">
          <Image
            width={200}
            height={160}
            src="/img/montage1.webp"
            id="fade-pic5"
            alt="Montage of artisans from African Futurist Collective"
            className="fade-pic absolute  aspect-auto h-full w-full object-center max-lg:object-cover"
            // loading="lazy"
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Image
            width={200}
            height={160}
            src="/img/montage2.webp"
            id="fade-pic4"
            alt="Montage of artisans from African Futurist Collective"
            className="fade-pic absolute  aspect-auto h-full w-full object-center max-lg:object-cover"
            placeholder="blur"
            blurDataURL={"/img/montage2.webp"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <Image
            width={200}
            height={160}
            src="/img/montage3.webp"
            id="fade-pic3"
            alt="Montage of artisans from African Futurist Collective"
            className="fade-pic absolute  aspect-auto h-full w-full object-center max-lg:object-cover"
            placeholder="blur"
            blurDataURL={"/img/montage3.webp"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Image
            width={200}
            height={160}
            src="/img/montage4.webp"
            id="fade-pic2"
            alt="Montage of artisans from African Futurist Collective"
            className="fade-pic object absolute  aspect-auto h-full w-full object-center max-lg:object-cover"
            placeholder="blur"
            blurDataURL={"/img/montage4.webp"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Image
            width={200}
            height={160}
            src="/img/montage5.webp"
            id="fade-pic1"
            alt="Montage of artisans from African Futurist Collective"
            className="fade-pic absolute  aspect-auto h-full w-full object-center max-lg:object-cover"
            placeholder="blur"
            blurDataURL={"/img/montage5.webp"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
