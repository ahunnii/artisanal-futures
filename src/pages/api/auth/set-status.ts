export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { yourParameter } = req.query;
  res.setHeader(
    "set-cookie",
    `yourParameter=${yourParameter}; path=/; samesite=lax; httponly;`
  );
  res.redirect("/");
}
