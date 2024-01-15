import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const DevelopmentChangeRole = () => {
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
    <section>
      <h3 className="text-2xl font-semibold">Test Roles</h3>
      <p className="text-muted-foreground">
        This changes your current role. Meant for development.{" "}
      </p>
      <div className="flex gap-4 py-4">
        <Button onClick={() => updateRole({ role: "USER" })}>
          Set to USER
        </Button>
        <Button onClick={() => updateRole({ role: "ADMIN" })}>
          Set to ADMIN
        </Button>
        <Button onClick={() => updateRole({ role: "ARTISAN" })}>
          Set to ARTISAN
        </Button>
      </div>
    </section>
  );
};

export default DevelopmentChangeRole;
