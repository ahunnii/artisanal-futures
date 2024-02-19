import type { Survey } from "@prisma/client";

import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import { type FC } from "react";

import { SurveyForm } from "~/apps/account/components/survey-form";
import PageLoader from "~/components/ui/page-loader";

import ProfileLayout from "~/apps/account/profile-layout";
import { prisma } from "~/server/db";

import { api } from "~/utils/api";
import { authenticateUserServerSide } from "~/utils/authentication/server";

interface IProps {
  survey: Survey;
}
const ProfileSurveyPage: FC<IProps> = () => {
  const { data: shop } = api.shops.getCurrentUserShop.useQuery();
  const { data: survey, isLoading } =
    api.surveys.getCurrentUserShopSurvey.useQuery({
      shopId: shop?.id ?? "",
    });

  if (isLoading)
    return (
      <ProfileLayout>
        <PageLoader />
      </ProfileLayout>
    );

  return (
    <ProfileLayout>
      <div className="space-y-6">
        {typeof survey !== "undefined" && typeof shop !== "undefined" && (
          <SurveyForm initialData={survey ?? null} shop={shop!} />
        )}
      </div>
    </ProfileLayout>
  );
};

const handleSurveyServerSide = async (user: User) => {
  const userId = user.id;

  const shop = await prisma.shop.findFirst({
    where: {
      ownerId: userId,
    },
  });

  if (!shop)
    return {
      redirect: {
        destination: "/profile/shop",
        permanent: false,
      },
    };

  return { props: {} };
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  authenticateUserServerSide(ctx, handleSurveyServerSide);

export default ProfileSurveyPage;
