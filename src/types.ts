// type AccountData = {
// 	username: string;
// 	email: string;
// 	first_name: string;
// 	last_name: string;

// 	moderated_forum: boolean;
// 	unmoderated_forum: boolean;
// 	hidden_forum: boolean;
// 	private_forum: boolean;

// 	about_me: string;
// 	profile_image_file: any;
// 	profile_image_url: string;
// 	profile_image_media_id: number | null;
// 	supply_chain: boolean;
// };

// type NewUser = {
// 	username: string;
// 	password: string;
// 	email: string;
// 	access_code: string;
// };

// type ReturningUser = {
// 	username: string;
// 	password: string;
// };

// type ArtisanACF = {
// 	acf: any;
// 	slug: string;
// };
// type Product = {
// 	name: string;
// 	description: string;
// 	principles: string;
// 	the_artisan: string;
// 	url: string;
// 	image: string;
// 	craftID: string;
// 	assessment: any;
// 	id: number;
// };

// type Attribute = string;

// type Artisan = string;

// type FilterData = {
// 	searchTerm: string;
// 	tags: string[] | FormDataEntryValue[];
// };

// type CurrentUser = {
// 	token: string;
// 	user_nicename: string;
// };
// type BusinessData = {
// 	biz_name: string;
// 	biz_description: string;
// 	website: string;
// 	location: string;
// 	biz_email: string;
// 	phone: string;

// 	biz_processes: string;
// 	biz_materials: string;
// 	biz_principles: string;

// 	listing_image_file: any;
// 	listing_image_url: string;
// 	listing_image_media_id: number | null;
// };
// type AdminData = {
// 	slug: string;
// 	membership_id: number;
// 	user_id: number;
// 	first_time_setup: boolean;
// 	full_name: string;
// };

// type FormattedData = AdminData & AccountData & BusinessData;

// export type {
// 	AccountData,
// 	Artisan,
// 	ArtisanACF,
// 	Attribute,
// 	BusinessData,
// 	CurrentUser,
// 	FilterData,
// 	FormattedData,
// 	NewUser,
// 	Product,
// 	ReturningUser,
// };

interface Shop {
  id: string;
  owner_name: string;
  business_name: string;
  website?: string;
  cover_photo?: string;
}

interface Profile {
  id: string;
  owner_name: string;
  business_name: string;
  website?: string;
  profile_photo?: string;
  bio?: string;
}

export type { Profile, Shop };
