
export interface AddReviewRequest {
    fid: number;
    mid: string;
    cont: string;
    star: number;
    accessToken: string;
};

export interface DeleteReviewRequest {
    seq: number;
    accessToken: string;
};

export async function addReview(params: AddReviewRequest) {
    const { fid, mid, cont, star, accessToken } = params;

    try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/review`;
        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({fid, mid, cont, star}),
            credentials: 'include',
        });

        if (!resp.ok) return false;

        return true;
    } catch (error) {
        console.error('리뷰 저장 실패:', error);
        return null;
    }
}

export async function deleteReview(params: DeleteReviewRequest) {
    const { seq, accessToken } = params;
    try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/${seq}`;
        const resp = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });

        if (!resp.ok) return false;

        return true;
    } catch (error) {
        console.error('리뷰 삭제 실패:', error);
        return null;
    }
}
