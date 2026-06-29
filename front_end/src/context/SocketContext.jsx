import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import { isDemoMode } from "../libs/config";
import { createDemoSocket } from "../libs/demoApi";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			if (isDemoMode) {
				const demoSocket = createDemoSocket(authUser._id);
				setSocket(demoSocket);
				demoSocket.on("getOnlineUsers", (users) => {
					setOnlineUsers(users);
				});
				return () => demoSocket.close();
			}

			const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
			const socket = io(socketUrl, {
				query: {
					userId: authUser._id,
				},
			});

			setSocket(socket);

			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
