import { useRouter } from "next/router";

import { toast } from "react-hot-toast";

import { Button } from "~/components/ui/button";

import { api } from "~/utils/api";

const RoleButton = ({ type }: { type: string }) => {
  const router = useRouter();

  const { mutate: updateRole } = api.auth.changeRole.useMutation({
    onSuccess: () => {
      toast.success("Role updated.");
      router.reload();
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    },
  });

  return (
    <Button onClick={() => updateRole({ role: type })}>Set to {type}</Button>
  );
};

export default RoleButton;
