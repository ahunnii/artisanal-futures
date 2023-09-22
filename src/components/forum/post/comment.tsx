import { AuthorWithDate } from "~/components/forum/author-with-date";
import { Avatar } from "~/components/forum/avatar";

import { HtmlView } from "~/components/forum/html-view";
import { IconButton } from "~/components/forum/icon-button";
import { DotsIcon } from "~/components/forum/icons";

import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItems,
  MenuItemsContent,
} from "~/components/forum/menu";

import { type RouterOutputs } from "~/utils/api";

import { useSession } from "next-auth/react";

import { useState, type FC } from "react";

import ConfirmDeleteCommentDialog from "./confirm-delete-comment-dialog";
import EditCommentForm from "./edit-comment-form";

interface IProps {
  postId: number;
  comment: RouterOutputs["post"]["detail"]["comments"][number];
}
const Comment: FC<IProps> = ({ postId, comment }) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);

  const commentBelongsToUser = comment.author.id === session!.user.id;

  if (isEditing) {
    return (
      <div className="flex items-start gap-4">
        <Avatar name={comment.author.name!} src={comment.author.image} />
        <EditCommentForm
          postId={postId}
          comment={comment}
          onDone={() => {
            setIsEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <AuthorWithDate author={comment.author} date={comment.createdAt} />
        {commentBelongsToUser && (
          <Menu>
            <MenuButton as={IconButton} variant="secondary" title="More">
              <DotsIcon className="h-4 w-4" />
            </MenuButton>

            <MenuItems className="w-28">
              <MenuItemsContent>
                <MenuItemButton
                  className="hover:text-white"
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  Edit
                </MenuItemButton>
                <MenuItemButton
                  className="!text-forum-red hover:text-white"
                  onClick={() => {
                    setIsConfirmDeleteDialogOpen(true);
                  }}
                >
                  Delete
                </MenuItemButton>
              </MenuItemsContent>
            </MenuItems>
          </Menu>
        )}
      </div>

      <div className="mt-4 pl-11 sm:pl-16">
        <HtmlView html={comment.contentHtml} />
      </div>

      <ConfirmDeleteCommentDialog
        postId={postId}
        commentId={comment.id}
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => {
          setIsConfirmDeleteDialogOpen(false);
        }}
      />
    </div>
  );
};

export default Comment;
