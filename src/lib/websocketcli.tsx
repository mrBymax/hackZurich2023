import { forwardRef, useEffect, useImperativeHandle } from 'react';
import io from 'socket.io-client';

const WebSocketClient = forwardRef(({ onDataReceived }: any, ref) => {

    useImperativeHandle(ref, () => ({
        send: (message: any) => {
            const socket = io('ws://localhost:8327');
            console.log('WebSocket connected');
            socket.emit('message', message);
            return () => {
                socket.disconnect();
            }
        },
    }));

    useEffect(() => {
        const socket = io('ws://localhost:8327');

        socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        socket.on('rt-openbci', (data) => {
            console.dir(data);
            onDataReceived({ type: 'rt-openbci', data: data });
        });

        socket.on('openbci', (data) => {
            console.dir(data);
            onDataReceived({ type: 'openbci', data: data });
        });

        socket.on('mouse', (data) => {
            console.dir(data);
            onDataReceived({ type: 'mouse', data: data });
        });

        socket.on('gaze_mouse', (data) => {
            console.dir(data);
            onDataReceived({ type: 'gaze', data: data.gaze });
            onDataReceived({ type: 'mouse', data: data.mouse });
        });

        socket.on('activity', (data) => {
            console.dir(data);
            onDataReceived({ type: 'activity', data: data });
        });

        socket.on('gaze', (data) => {
            console.dir(data);
            onDataReceived({ type: 'gaze', data: data });
        });


        socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        return () => {
            socket.disconnect();
        };
    }, [onDataReceived]);

    return null;
});

export default WebSocketClient;
