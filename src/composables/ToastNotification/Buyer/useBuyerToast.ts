import { toast } from 'vue3-toastify';
import type { ToastOptions } from 'vue3-toastify';

import 'vue3-toastify/dist/index.css';

export function useBuyerToast() {
    const showBuyerToast = (
        message: string,
        type: 'success' | 'info' | 'error',
        options?: ToastOptions
    ) => {
        const defaultOptions: ToastOptions = {
            autoClose: false,
            closeOnClick: false,
            theme: 'colored',
            ...options
        };

        switch (type) {
            case 'success':
                toast.success(message, defaultOptions);
                break;
            case 'info':
                toast.info(message, defaultOptions);
                break;
            case 'error':
                toast.error(message, defaultOptions);
                break;
            default:
                toast(message, defaultOptions);
        }
    };

    return { showBuyerToast };
}
