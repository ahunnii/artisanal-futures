import { getAuth } from "@clerk/nextjs/server";
import type { Survey } from "@prisma/client";

import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { SurveyForm } from "~/components/profile/survey-form";
import PageLoader from "~/components/ui/page-loader";

import ProfileLayout from "~/layouts/profile-layout";
import { prisma } from "~/server/db";

interface IProps {
  survey: Survey;
}
const ProfileSurveyPage: FC<IProps> = ({ survey }) => {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        {typeof survey === "undefined" && <PageLoader />}

        {typeof survey === "object" && <SurveyForm initialData={survey} />}
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
          processes: survey.processes ?? "",
          materials: survey.materials ?? "",
          principles: survey.principles ?? "",
          description: survey.description ?? "",
        },
      },
    };
  }

  const newSurvey = await prisma.survey.create({
    data: {
      ownerId: userId,
      shopId: shop.id,
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
