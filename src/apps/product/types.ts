export type Product = {
  name: string;
  description: string;
  principles: string;
  the_artisan: string;
  url: string;
  image: string;
  craftID: string;
  assessment: Assessment[];
  id: number;
};

type Assessment = {
  type: string;
  version: number;
  description: string;
  data: string;
  data_reference: string;
  extra: string;
};
