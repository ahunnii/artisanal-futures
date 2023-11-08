import { Eye, Users } from "lucide-react";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { Overview } from "~/components/admin/overview";
import { RecentMembers } from "~/components/admin/recent-members";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import PageLoader from "~/components/ui/page-loader";
import { Separator } from "~/components/ui/separator";
import AdminLayout from "~/layouts/admin-layout";
import { authenticateUser } from "~/utils/auth";

import { Role, User } from "@prisma/client";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AlertModal } from "~/components/admin/modals/alert-modal";
import { UserClient } from "~/components/admin/users/client";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { DataTablePagination } from "~/components/ui/data-table-pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
interface IProps {
  users: User[];
  status: "authorized" | "unauthorized";
}

import { columns } from "~/components/admin/users/columns";

// export const columns: ColumnDef<User>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={table.getIsAllPageRowsSelected()}
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "role",
//     header: "Role",
//     cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
//   },
//   {
//     accessorKey: "email",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Email
//           <CaretSortIcon className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
//   },
//   {
//     accessorKey: "name",
//     header: "Name",
//     cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
//   },

//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const payment = row.original;
//       const utils = api.useContext();
//       const { mutate: updateRole } = api.user.updateUserRole.useMutation({
//         onSuccess: async () => {
//           await utils.user.getAllUsers.invalidate();
//           toast.success("Role updated.");
//           //   router.reload();
//         },
//         onError: (error) => {
//           toast.error("Something went wrong");
//           console.error(error);
//         },
//       });

//       return (
//         <>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <DotsHorizontalIcon className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuItem
//                 onClick={() => void navigator.clipboard.writeText(payment.id)}
//               >
//                 Copy user ID
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuSub>
//                 <DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>
//                 <DropdownMenuSubContent>
//                   <DropdownMenuRadioGroup value={payment.role}>
//                     <DropdownMenuRadioItem
//                       value={"USER"}
//                       onClick={() =>
//                         updateRole({ role: "USER", id: payment.id })
//                       }
//                     >
//                       User
//                     </DropdownMenuRadioItem>
//                     <DropdownMenuRadioItem
//                       value={"ARTISAN"}
//                       onClick={() =>
//                         updateRole({ role: "ARTISAN", id: payment.id })
//                       }
//                     >
//                       Artisan
//                     </DropdownMenuRadioItem>{" "}
//                     <DropdownMenuRadioItem
//                       value={"ADMIN"}
//                       onClick={() =>
//                         updateRole({ role: "ADMIN", id: payment.id })
//                       }
//                     >
//                       Admin
//                     </DropdownMenuRadioItem>
//                   </DropdownMenuRadioGroup>
//                 </DropdownMenuSubContent>
//               </DropdownMenuSub>{" "}
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>View customer</DropdownMenuItem>
//               <DropdownMenuItem>Delete</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </>
//       );
//     },
//   },
// ];

const AdminUsersPage: FC<IProps> = ({ status }) => {
  // const { organizationList, isLoaded } = useOrganizationList();

  const { data: users } = api.user.getAllUsers.useQuery();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: users ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const onConfirm = () => {
    console.log("yeet");
  };

  return (
    <AdminLayout>
      {status === "unauthorized" ? (
        <>
          <p>
            You don&apos;t have the credentials to access this view. Please
            contact Artisanal Futures to elevate your role.
          </p>
        </>
      ) : (
        <>
          <div className="flex h-full flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
              {!users ? <PageLoader /> : <UserClient data={users} />}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const user = await authenticateUser(ctx);

  if (user.props!.user.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: user.props!.user,
      status: user.props!.user.role === "ADMIN" ? "authorized" : "unauthorized",
    },
  };
};
export default AdminUsersPage;
