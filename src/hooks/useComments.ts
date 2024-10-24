import { useState, FormEvent, ChangeEvent } from 'react';
import instance from '../utils/api/instance';
import { useDispatch } from 'react-redux';
import { showModal } from '../redux/reducer/modalSlice';

interface CreateHandlerProps {
    recipeId: number;
    comment: string;
    rating: number;
}
interface UpdateHandlerProps {
    commentId: number;
    comment: string;
    rating: number;
}
interface EditingProps {
    commentId: number;
    comments: string;
    commentRate: number;
}
interface CommentDataProps {
    commentAuthor: string;
    commentContent: string;
    commentId: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export default function useComments() {
    const [editing, setEditing] = useState<boolean>(false); // 수정 중인지 check
    const [commentDataList, setCommentDataList] = useState<CommentDataProps[]>([]);
    const [recipeId, setRecipeId] = useState<number>();
    const [commentId, setCommentId] = useState<number>();
    const [createComment, setCreateComment] = useState<string>('');
    const [updateComment, setUpdateComment] = useState<string>('');
    const [currentRate, setCurrentRate] = useState<number>(0);
    const [updateRate, setupdateRate] = useState<number>(0);

    const dispatch = useDispatch();
    // get : recipeId
    const fetchCommentHandler = async (recipeId: string) => {
        try {
            const response: any = await instance.get(`/comments/${recipeId}`);
            if (response.data.code === 'OK') {
                console.log('response.data.data: ', response.data.data);
                setCommentDataList(response.data.data.comments);
            }
        } catch (err) {
            console.log(err);
            dispatch(showModal({ isOpen: true, content: '댓글을 가져오는데 실패했습니다.', onConfirm: null }));
        }
    };
    console.log('recipeId', recipeId);

    // create : recipeId, comment, rating
    const createCommentHandler = async (e: FormEvent<HTMLFormElement>, { recipeId, comment, rating }: CreateHandlerProps) => {
        e.preventDefault();
        setRecipeId(recipeId);
        setCurrentRate(rating);

        try {
            const response = await instance.post('/comments', {
                recipeId: recipeId,
                comment: comment,
                rating: rating,
            });

            if (response.data.code == 'CREATED') {
                console.log(response);
                dispatch(showModal({ isOpen: true, content: '댓글 작성 성공!', onConfirm: await fetchCommentHandler(recipeId.toString()) }));
                // 초기화
                setCreateComment('');
                setCurrentRate(0);
            }
        } catch (err: any) {
            if (err.message == 'No token') {
                dispatch(showModal({ isOpen: true, content: '로그인 후 이용바랍니다.', onConfirm: null }));
                window.location.href = '/login';
            } else {
                console.log('댓글작성 error: ', err);
                if (createComment == '') {
                    dispatch(showModal({ isOpen: true, content: '코멘트는 1글자 이상 300글자 이하로 작성해주세요.', onConfirm: null }));
                } else {
                    dispatch(showModal({ isOpen: true, content: '평점은 1.0이상 입력해주세요', onConfirm: null }));
                }
            }
        }
    };

    // update : commentId, comment, rating
    const updateCommentHandler = async ({ commentId, comment, rating }: UpdateHandlerProps, recipeId: string) => {
        setEditing(false); // 수정완료 시 false로 상태변경
        try {
            const response: any = await instance.put('/comments', {
                commentsId: commentId,
                comment: comment,
                rating: rating,
            });

            if (response.data.code === 'OK') {
                console.log(response);
                setUpdateComment('');
                setCommentId(0);
                dispatch(showModal({ isOpen: true, content: '댓글이 수정되었습니다.', onConfirm: await fetchCommentHandler(recipeId.toString()) }));
            }
        } catch (err) {
            console.log('댓글 수정 error: ', err);
            dispatch(showModal({ isOpen: true, content: '코멘트 수정시에는 1글자 이상 300글자 이하로 작성해주세요.', onConfirm: null }));
        }
    };

    // 코멘트, 평점 update / create 핸들러
    const handleCreateComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCreateComment(e.target.value);
    };
    const handleUpdateComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setUpdateComment(e.target.value);
    };
    const handleMakeRate = (rate: number) => {
        setCurrentRate(rate);
    };
    const handleUpdateRate = (rate: number) => {
        setupdateRate(rate);
    };

    // 코멘트 수정 버튼과 연결
    const handleClickEdit = ({ comments, commentId, commentRate }: EditingProps) => {
        setEditing(true);
        setCommentId(commentId); // 수정버튼 누른 commentId값 저장 => commentsDataList에서 같은 commentid값을 가진 코멘트 filter하기 위함
        setUpdateComment(comments);
        setupdateRate(commentRate);
    };

    const deleteCommentHandler = async (commentId: number, recipeId: string) => {
        try {
            const response: any = await instance.delete('/comments', {
                data: {
                    commentId: commentId,
                },
            });

            if (response.data.code == 'OK') {
                console.log(response);
                dispatch(showModal({ isOpen: true, content: '댓글이 삭제되었습니다.', onConfirm: await fetchCommentHandler(recipeId) }));
            }
        } catch (err) {
            console.log(err);
            dispatch(showModal({ isOpen: true, content: '댓글 삭제에 실패하였습니다.', onConfirm: null }));
        }
    };

    return {
        editing,
        handleClickEdit,
        commentId,
        currentRate,
        updateRate,
        createComment,
        updateComment,
        commentDataList,
        fetchCommentHandler,
        createCommentHandler,
        updateCommentHandler,
        deleteCommentHandler,
        handleCreateComment,
        handleUpdateComment,
        handleMakeRate,
        handleUpdateRate,
    };
}
