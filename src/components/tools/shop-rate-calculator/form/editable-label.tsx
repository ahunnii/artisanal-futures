// import {
//   ButtonGroup,
//   Center,
//   Editable,
//   EditableInput,
//   EditablePreview,
//   IconButton,
//   Input,
//   Tooltip,
//   useEditableControls,
// } from "@chakra-ui/react";

// import { Check, X } from "lucide-react";

// function EditableControls() {
//   const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
//     useEditableControls();

//   return isEditing ? (
//     <ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
//       <IconButton
//         icon={<Check />}
//         {...getSubmitButtonProps()}
//         aria-label="Approve Change"
//       />
//       <IconButton
//         icon={<X boxSize={3} />}
//         {...getCancelButtonProps()}
//         aria-label="Deny Change"
//       />
//     </ButtonGroup>
//   ) : null;
// }

// const EditableLabel = () => {
//   return (
//     <Editable
//       defaultValue={`New Expense  ✏️`}
//       isPreviewFocusable={true}
//       selectAllOnFocus={true}
//       textAlign="left"
//       w={"100%"}
//     >
//       <Tooltip label="Click to edit">
//         <Center>
//           <EditablePreview
//             py={2}
//             px={4}
//             _hover={{
//               background: "gray.100",
//             }}
//             w={"100%"}
//           ></EditablePreview>
//         </Center>
//       </Tooltip>
//       <Input as={EditableInput} />
//       <EditableControls />
//     </Editable>
//   );
// };
// export default EditableLabel;

import { Popover, Transition } from "@headlessui/react";
import { Check, X } from "lucide-react";
import { useRef, useState } from "react";

const EditableLabel = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("New Expense ✏️");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    setIsEditing(false);
    // Handle other logic for saving the value if needed
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue("New Expense ✏️"); // Resetting to the initial value
  };

  return (
    <div className="relative w-full">
      {!isEditing ? (
        <div
          onClick={() => setIsEditing(true)}
          className="w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
        >
          {value}
        </div>
      ) : (
        <div className="w-full">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-2 w-full rounded border px-2 py-1"
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={handleSubmit}
              className="rounded bg-green-500 p-2 text-white"
            >
              <Check />
            </button>
            <button
              onClick={handleCancel}
              className="rounded bg-red-500 p-2 text-white"
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableLabel;
