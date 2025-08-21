import { useLoading } from "@/components/dialog/loadingProvider";
import { usePopup } from "@/components/dialog/popupProvider";
import { useToast } from "@/components/dialog/useToast";
import { useState } from "react";

export const useFeedback = () => {
    const { showToast } = useToast();
    const { showPopup } = usePopup();
    const { show, hide } = useLoading();
    const [loading, setIsLoading] = useState<boolean>(false);
    const setLoading = (loading: boolean, isHide: boolean = false, message: string = '') => {
        setIsLoading(loading);
        // eslint-disable-next-line no-unused-expressions
        !isHide && (loading ? show(message) : hide());
    }
    return {
        showToast, showPopup, show, hide, loading, setLoading
    }
}