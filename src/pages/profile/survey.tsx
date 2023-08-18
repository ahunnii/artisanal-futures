import { getAuth } from "@clerk/nextjs/server";
import { Survey } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import type { GetServerSidePropsContext } from "next";
import { FC, useEffect } from "react";
import { ProfileForm } from "~/components/profile/profile-form";
import { SurveyForm } from "~/components/profile/survey-form";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useShopModal } from "~/hooks/use-shop-modal";
import ProfileLayout from "~/layouts/profile-layout";
import { prisma } from "~/server/db";

interface IProps {
  survey: Survey;
}
const ProfileSurveyPage: FC<IProps> = ({ survey }) => {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        <SurveyForm initialData={survey} />
      </div>
    </ProfileLayout>
  );
};
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  const shop = await prisma.shop.findFirst({
    where: {
      ownerId: userId,
    },
  });
  if (!shop) {
    return {
      redirect: {
        destination: "/profile/shop",
        permanent: false,
      },
    };
  }

  const survey = await prisma.survey.findFirst({
    where: {
      ownerId: userId,
    },
  });

  if (survey) {
    return {
      props: {
        survey: {
          ...survey,
          createdAt: survey.createdAt.toISOString(),
          updatedAt: survey.updatedAt.toISOString(),
        },
      },
    };
  }

  const newSurvey = await prisma.survey.create({
    data: {
      ownerId: userId,
      shopId: shop.id,
      processes: "",
      materials: "",
      principles: "",
    },
  });

  return {
    props: {
      survey: {
        ...newSurvey,
        createdAt: newSurvey.createdAt.toISOString(),
        updatedAt: newSurvey.updatedAt.toISOString(),
      },
    },
  };
}
export default ProfileSurveyPage;
