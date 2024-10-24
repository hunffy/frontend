import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';

interface Props {
    commentAuthor: string;
    commentContent: string;
    commentId: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
}
interface UpdateProps {
    commentId: number;
    comment: string;
    rating: number;
}
interface EditBtnProps {
    recipeId?: string;
    review: Props;
    isEditing: boolean;
    commentId?: number;
    updateRate: number;
    updateComment: string;
    handleClickEdit: ({ comments, commentId, commentRate }: { comments: string; commentId: number; commentRate: number }) => void;
    updateCommentHandler: ({ commentId, comment, rating }: UpdateProps, recipeId: string) => Promise<void>;
    deleteCommentHandler: (commentId: number, recipeId: string) => Promise<void>;
}

export default function CommentEditBtn({
    recipeId,
    review,
    isEditing,
    commentId,
    updateRate,
    updateComment,
    handleClickEdit,
    updateCommentHandler,
    deleteCommentHandler,
}: EditBtnProps) {
    const nickname = useSelector((state: RootState) => state.user.value.nickname);

    return (
        <>
            {isEditing
                ? commentId == review.commentId && (
                      <>
                          {commentId !== undefined && updateRate != undefined && recipeId !== undefined && (
                              <button
                                  onClick={() =>
                                      updateCommentHandler(
                                          {
                                              commentId: commentId,
                                              comment: updateComment,
                                              rating: updateRate,
                                          },
                                          recipeId,
                                      )
                                  }
                              >
                                  완료
                              </button>
                          )}
                      </>
                  )
                : nickname == review.commentAuthor && (
                      <div>
                          <button
                              onClick={() => {
                                  handleClickEdit({
                                      comments: review.commentContent,
                                      commentId: review.commentId,
                                      commentRate: review.rating,
                                  });
                              }}
                          >
                              수정
                          </button>
                          {recipeId !== undefined && (
                              <button
                                  onClick={() => {
                                      deleteCommentHandler(review.commentId, recipeId);
                                  }}
                              >
                                  삭제
                              </button>
                          )}
                      </div>
                  )}
        </>
    );
}
