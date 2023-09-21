import type { Survey } from "@prisma/client";

import type { GetServerSidePropsContext } from "next";
import type { Session } from "next-auth";
import { type FC } from "react";

import { SurveyForm } from "~/components/profile/survey-form";
import PageLoader from "~/components/ui/page-loader";

import ProfileLayout from "~/layouts/profile-layout";
import { prisma } from "~/server/db";
import { authenticateSession } from "~/utils/auth";

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
  const session = (await authenticateSession(ctx)) as Session;

  const userId = session?.user?.id;

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
