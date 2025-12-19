import { useEffect } from 'react';
import { vscode } from '../lib/vscode';

/**
 * Hook to send messages to the VS Code Extension
 */
export const usePostMessage = () => {
    return (message: any) => {
        vscode.postMessage(message);
    };
};

/**
 * Hook to listen for messages from the VS Code Extension
 * @param handler Function to handle incoming messages
 * @param deps Dependencies for the useEffect
 */
export const useReceiveMessage = (handler: (message: any) => void, deps: any[] = []) => {
    useEffect(() => {
        const eventHandler = (event: MessageEvent) => {
            const message = event.data;
            if (message) {
                handler(message);
            }
        };

        window.addEventListener('message', eventHandler);
        
        return () => {
            window.removeEventListener('message', eventHandler);
        };
    }, deps);
};
