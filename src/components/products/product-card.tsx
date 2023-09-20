import type { FC } from "react";

import ProductDetails from "~/components/products/product-details";

interface IProps {
  name: string;
  image: string;
  the_artisan: string;
  principles: string;
  url: string;
  description: string;
  assessment: Array<unknown>;
}

const formatAttributes = (attributes: string) => {
  return attributes.replaceAll(",", "  ").trim().replaceAll("  ", " • ");
};

const ProductCard: FC<IProps> = (props) => {
  return (
    <ProductDetails {...props}>
      <div className="h-full max-w-sm cursor-pointer rounded-lg border shadow-lg hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-200 ">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={props.image}
          alt={`Image of ${props.name}`}
          className="aspect-square w-full rounded-t-lg object-cover"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = "/img/background-fallback.jpg";
          }}
        />

        <div className="flex flex-col p-6 ">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {formatAttributes(props.principles)}
          </p>

          <h3 className="mb-3 mt-3 font-semibold capitalize leading-3 ">
            {props.name}
          </h3>

          <span className="text-sm capitalize text-slate-600 ">
            {props.the_artisan}
          </span>
        </div>
      </div>
    </ProductDetails>
  );
};
export default ProductCard;
