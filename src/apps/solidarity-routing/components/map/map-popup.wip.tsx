import { FC } from 'react';
import { useDeleteJob } from '~/apps/solidarity-routing/hooks/jobs/CRUD/use-delete-job';
import { useDeleteDriver } from "../../hooks/drivers/CRUD/use-delete-driver";

interface IStopProps {
  name: string;
  address: string;
  id: string;
  kind: string;
}

// should really have a common interface for this and reuse 
const driver = "DRIVER"
const client = "CLIENT"

export const MapPopup: FC<IStopProps> = ({ name, address, id, kind }) => {
  const { deleteJobFromRoute } = useDeleteJob();
  const { deleteDriverFromRoute } = useDeleteDriver() // Use the hook to get the deletion function

  const handleDelete = () => {

    console.log(
      'trying to delete ',
      kind,
      id,
      name,
      address
    )

    if(kind == client){
      deleteJobFromRoute({ id });
    }

    if(kind == driver){
      deleteDriverFromRoute({ vehicleId: id });
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <span className="block text-base font-bold capitalize">
        {name}
      </span>
      <span className="block">
        <span className="block font-semibold text-slate-600">
          Location
        </span>
        {address}
      </span>
      <span className="block mt-auto text-red-600 cursor-pointer" onClick={handleDelete}>
        Delete
      </span>
    </div>
  );
};