"use client";
import React, { useState, useEffect, useRef } from "react";
// import "./chat.css"; // Ensure this path is correct based on your project structure
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

import io from 'socket.io-client';
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/store/store";

import Cookies from "js-cookie";
import { setChatOpen, setKeForMessage } from "@/features/agentFeatures";
import "./chat.css";

import LoadingScreen from "../LoadingScreen/LoadingScreen";


const token = Cookies.get("access");
// const token = process.env.NEXT_PUBLIC_JWT_TOKEN
const API_URL = process.env.NEXT_PUBLIC_REACT_APP_BASEURL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_BASEURL
// 167.71.81.153:8000
const socket = io(`${SOCKET_URL}/apis/user`, {
    'transports': ['websocket'],
    query: {
        token: `${token}`

    }
});




let userId: string | null = null;

if (typeof window !== 'undefined') {
    // We're on the client-side, it's safe to access localStorage
    userId = localStorage.getItem("userId");
}
interface UserType {
    _id: string,
    agent: AgentType
    username: string;
    lastSeen: string;
    profileImage: string;
    lastMessage: string | null
    lastMessageTime: Date
    unseen: number; // Add unseen property

}
type AgentType = {
    _id: string;
    username: string;
    lastSeen: string;
    profileImage: string;
    lastMessage: string | null
    lastMessageTime: Date
    unseen: number
};
type SocketCallBack = {
    success: boolean
};

interface Item extends HTMLDivElement {
    clientHeight: number;      // Number type for clientHeight
    scrollTop: number;         // Number type for scrollTop
    scrollHeight: number;      // Number type for scrollHeight
    current: object;           // Use 'object' if 'current' is any non-null object
    onscroll: (event: Event) => void;  // Correctly type onscroll
}


interface UserData {
    _id: string;
    username: string;
    profileImage: string;
    name: string;
    email: string;
    // Add other fields as necessary
}
// types.ts (or at the top of chat.tsx)
export interface Message {
    // _id: string;
    userId: string | undefined;
    agentId: string;
    productId: string | null;
    sendBy: string;
    message: string;
    typeDate: string; // ISO string or Date object
    type: string;
    status: string;
    chatState: string;
    seen: boolean;

    doc: string; // Allow doc to be File or null

    profileImage: string | undefined; // Change String to string (for consistency)
    replyToMessageId?: string | undefined;

    paymentRequest?: PaymentRequestType | undefined; // Optional field for payment request
}


type PaymentRequestType = {
    amount: string;
    currency: string;
    requestId: string;
    productQuantity: number;
    productDescription?: string;
};

export default function ReduxProvider() {
    return <Provider store={store}>
        <Chat></Chat>
    </Provider>
}



function Chat() {

    const [fileIcon, setFileIcon] = useState<JSX.Element | null>(null);

    const [SeletedAgent, setSeletedAgent] = useState<AgentType | null>(null);
    const [isInterested, setIsInterested] = useState<boolean>(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    // const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [activeButton, setActiveButton] = useState('users');


    const [AgentToShow, setAgentToShow] = useState<UserType[]>([]); // Default to UserType[]
    const [usersToShow, setAUsersToShow] = useState<UserType[]>([]); // Default to UserType[]


    const [userMessages, setUserMessages] = useState<Message[]>([]);

    const searchParams = useSearchParams(); // Use the new hook to get search parameters
    const [loading, setLoading] = useState(true); // State for loading spinner

    const [page1, setpage1] = useState(1)
    const [page2, setpage2] = useState(1)
    const [page3, setpage3] = useState(1)

    const allAgentContainer = useRef<Item | null>(null);
    const activeAgentContainer = useRef<Item | null>(null);
    // let messScrollContainer=useRef<Item |null>(null);
    const messScrollContainer = useRef<HTMLDivElement>(null);


    // let messDiv = useRef<Item | null>(null);

    const activeAgentScroll = () => {
        const bottom = (activeAgentContainer.current?.scrollHeight || 0) === (activeAgentContainer.current?.scrollTop || 0) + (activeAgentContainer.current?.clientHeight || 0);

        console.log(usersToShow);

        if (bottom) {

            setpage1((prev) => prev + 1); // Load next page2
        }

    }


    const allAgentScroll = () => {
        const bottom = (allAgentContainer.current?.scrollHeight || 0) === (allAgentContainer.current?.scrollTop || 0) + (allAgentContainer.current?.clientHeight || 0);

        if (bottom) {
            setpage2((prev) => prev + 1); // Load next page2
        }
    }
    const messageTopScroll = () => {
        const atTop = messScrollContainer.current?.scrollTop === 0;
        if (atTop) {
            // Trigger your logic for loading more messages or agents
            setpage3((prev) => prev + 1); // Example: Load the next page of agents
        }
    };
    useEffect(() => {
        // all users ko mngwata
        if (SeletedAgent) {
            console.log("thsi is seleted adget ")
            console.log(SeletedAgent);
            handleUserClick(SeletedAgent, page3, false);
        }
    }, [page3]);
    useEffect(() => {
        // all users ko mngwata
        handleShowAllUsers(page2, false);
    }, [page2]);

    useEffect(() => {
        // yeh agents ki chat mngwata
        handleShowAgents(page1, false);
    }, [page1])
    const handleTagClick = (agentID: string) => {
        // setUserMessages([])
        setSeletedAgent(null)
        setLoading(true)
        try {
            axios.post(
                `${API_URL}/apis/chat/mark/${agentID}`, // Include agentId in the URL
                {},
                {
                    headers: {

                        Authorization: `Bearer ${token}`,
                        // token: `Bearer ${token}`,
                        // token: `${token}`,
                    },
                }
            ).then((resp) => {
                if (activeButton == "agents") {
                    setAgentToShow(AgentToShow.filter(i => i._id != agentID));
                } else if (activeButton == "users") {
                    setAUsersToShow(usersToShow.filter(i => i._id != agentID));
                }
                setLoading(false)
                console.log(resp.data)
                console.log('Chat marked successfully:');
            });

        } catch (error) {
            console.error('Error marking chat:', error);
        }
        console.log(isInterested);
        setIsInterested(!isInterested);
        const currentValue = !isInterested ? 'Interested' : 'Active Customers';
        console.log('Current value:', currentValue);
    };
    const productId = searchParams.get('productId');
    const agentId = searchParams.get('agentId');
    const messageKey = useSelector((store: RootState) => {
        return store.agentFeatures.keyForMessage;
    })
     
     
    const hasSentRef = useRef(false);

    //    const hasSentRef = useRef(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!agentId || !messageKey || hasSentRef.current) return;

            hasSentRef.current = true;

            // STEP 1: First call the API to get dummy quotation data
            // `${API_URL}/apis/quotation/create`,
            axios
                .get(`${API_URL}/apis/quotation/get/${agentId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    const productList = res.data?.data; // Array of products
                    console.log("Fetched product list from Quotation:", productList);
                    const product = productList.find((item: any) => item.productId === productId);
                    console.log(productId, "Product ID from search params");
                    console.log("Selected product:", product);
                    // STEP 2: Create paymentRequest — could use dummyData fields if needed
                    const paymentRequest = {
                        amount: product?.totalShippingDoorPrice || "0", // Default to 1000 if price is not available
                        currency: "PKR",
                        requestId: Date.now().toString(),
                        productQuantity: product?.quantity || 1, // Default to 1 if quantity is not available
                        // productDescription: `Premium leather watches\nAvailable in bulk\nDelivery in 7 days`,
                        // You can include dummyData values here if needed
                        // e.g., productDescription: dummyData?.description || default text
                    };

                    // STEP 3: Send message with this data
                    return sendMessage("", agentId, paymentRequest);
                })
                .then((success) => {
                    if (!success) return;

                    // STEP 4: Load agent tab data
                    return axios.get(`${API_URL}/apis/chat/getAgentTab`, {
                        params: { agentId },
                        headers: { Authorization: `Bearer ${token}` },
                    });
                })
                .then((resp) => {
                    if (!resp) return;

                    // STEP 5: Determine tab and set agent
                    if (resp.data.data === "users") {
                        setActiveButton("users");
                        handleShowAllUsers(page2, true).then((users: UserType[]) => {
                            const agent = users.find((user) => user._id === agentId);
                            setSeletedAgent(agent || null);
                        });
                    } else {
                        setActiveButton("agents");
                        handleShowAgents(1, true);
                        const agent = AgentToShow.find((user) => user._id === agentId);
                        if (agent) setSeletedAgent(agent);
                    }
                })
                .catch((error) => {
                    console.error("Error during quotation message flow:", error);
                })
                .finally(() => {
                    dispatch(setKeForMessage(false));
                });
        }, 100);

        return () => clearTimeout(timeout);
    }, [agentId, productId]);

    useEffect(() => {
        //     allChatAgent(page2, true);
        axios.get(`${API_URL}/apis/user/get`, {
            headers: {
                Authorization: `Bearer ${token}`, // Add your token here
            },
        }).then((resp) => {
            console.log("this is user detail");
            console.log(resp.data)
            console.log(resp.data.data);
            if (resp.data.status === 'ok') {
                setUser(resp.data.data); // Update state with user data
            }
        }).catch((error) => {
            console.error("Error fetching user data:", error);
        });
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const handleShowAllUsers = async (page: number, reset: boolean): Promise<UserType[]> => {
        return new Promise(async (c) => {
            try {

                if (reset) {
                    setAgentToShow([]); // Clear the current agents list before fetching new data
                }
                const response = await axios.get(`${API_URL}/apis/agent/getAll`, {
                    params: {
                        page: page,
                        limit: 10
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,  // Include the token here
                    }
                });
                console.log("All agent chats with last message successful");
                const agentsWithLastMessage = response.data.data; // Assuming this is an array
                console.log(agentsWithLastMessage);
                setAUsersToShow(agentsWithLastMessage)


                 

            } catch (error) {
                console.error('Error fetching all agents last chat:', error);
            }

            // Update active button state
            setLoading(false); // Stop loading when the request is done

        });

    }
    const handleShowAgents = (page: number, reset: boolean) => {
        try {
            if (reset) {
                setAgentToShow([]); // Clear the current agents list before fetching new data
            }
            setLoading(true);
            axios.get(`${API_URL}/apis/chat/getActiveAgentLastChat`, {
                params: {
                    page: page,
                    limit: 10
                },
                headers: {
                    Authorization: `Bearer ${token}`  // Include the token here
                }
            }).then(function (resp) {
                console.log(resp.data);
                const agentsWithLastMessage = resp.data.data; // Assuming this is an array


                console.log(agentsWithLastMessage);
                const agents: UserType[] = agentsWithLastMessage.map((item: UserType) => ({
                    _id: item.agent._id, // Assuming agent has _id
                    username: item.agent.username, // Assumingons agent has username
                    lastSeen: item.agent.lastSeen, // Assuming agent has lastSeen
                    profileImage: item.agent.profileImage, // Assuming agent has profileImageonsc
                    lastMessage: item.lastMessage ? item.lastMessage : 'No message', // Get last message from item
                    // Convert lastMessageTime to Date or fallback to a very old date
                    lastMessageTime: item.lastMessageTime ? new Date(item.lastMessageTime) : new Date(0),
                    unseen: item.unseen || 0,
                }));


                // Sort agents by lastMessageTime in descending order (latest messages first)
                const sortedAgents = agents.sort((a, b) => {
                    return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
                });


                if (reset) {
                    setAgentToShow([...sortedAgents]);
                } else {
                    setAgentToShow([...AgentToShow, ...sortedAgents]);
                }
                // setAgentToShow(sortedAgents);
            });
        } catch (error) {
            console.error('Error fetching active agent last chat:', error);
        }
        setLoading(false); // Stop loading when the request is done

        // setActiveButton('agents');
    }

    
    const [fileName, setFileName] = useState("");
    const handleUserClick = (agent: AgentType, page: number, reset: boolean) => {
        // if (reset) {
        //     setUserMessages([]); // Clear the current agents list before fetching new data
        // }
        // setpage3(1)
        console.log("this is user id");
        console.log(userId);
        setSeletedAgent(agent)

        axios.get(`${API_URL}/apis/chat/getAgentChat`,
            {
                params: {
                    agentId: agent._id,//this i agent id 
                    limit: 20,
                    page: page
                }, headers: {
                    Authorization: `Bearer ${token}`
                    // Authorization:"Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Zjk1M2M2MTlmN2I3YTU4NzIyYTkyMSIsImlhdCI6MTcyNzYxNTk0MiwiZXhwIjoxNzI3Nzg4NzQyfQ.ynQ1P6bMrwBjEZIvzT7FR1cqVWhgY4PsM5UyyHgnfDg"
                }
            }
        ).then((resp) => {
            console.log("ohohohohohohohohohohohohoh");

            console.log(resp.data.data)
            setUserMessages(resp.data.data);

            setSeletedAgent(agent);

            console.log("pppppppppppppppppp")

            if (reset) {
                setUserMessages([...resp.data.data])
            } else {
                setUserMessages([...userMessages, ...resp.data.data])
            }

        })
        const data = new FormData()
        data.append("openChat", agent._id);
        axios.post(`${API_URL}/apis/user/update`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((resp) => {
            console.log("ohohohohohohohohohohohohoh")
            console.log(resp.data.data)
        })
    };
    function isImage(path: string | undefined | null): boolean {
        if (typeof path !== 'string') return false;

        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

        const extension = path.split('.').pop()?.toLowerCase();

        return imageExtensions.includes(extension || '');
    }

    const getFileIcon = (fileUrl: string | undefined | null) => {
        if (typeof fileUrl !== 'string') {
            return <i className="fa-solid fa-file text-gray-500"></i>; // Default icon
        }

        const extension = fileUrl.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'pdf':
                return <i className="fa-solid fa-file-pdf text-red-500"></i>;

            case 'xlsx':
            case 'xls':
                return <i className="fa-solid fa-file-excel text-green-500"></i>;

            case 'doc':
            case 'docx':
                return <i className="fa-solid fa-file-word text-blue-500"></i>;

            case 'ppt':
            case 'pptx':
                return <i className="fa-solid fa-file-powerpoint text-orange-500"></i>;

            case 'png':
            case 'jpg':
            case 'jpeg':
                return <i className="fa-solid fa-file-image text-yellow-500"></i>;

            default:
                return <i className="fa-solid fa-file text-gray-500"></i>;
        }
    };

    function getLastSeenTime(lastSeen: string | Date): string {
        const now = new Date();
        const lastSeenDate = new Date(lastSeen);
        const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60)); // Convert milliseconds to minutes
        if (diffInMinutes < 1) return "just now";
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInMinutes < 24 * 60) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return `${Math.floor(diffInMinutes / (24 * 60))} days ago`;
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const fileType = selectedFile.type;

            // Determine the icon based on the file type
            let icon;
            if (fileType === 'application/pdf') {
                icon = <i className="fa-solid fa-file-pdf text-red-500"></i>;
            } else if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                icon = <i className="fa-solid fa-file-excel text-green-500"></i>;
            } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                icon = <i className="fa-solid fa-file-word text-blue-500"></i>;
            } else {
                icon = <i className="fa-solid fa-file text-gray-500"></i>;
            }

            setFile(selectedFile);
            setFileName(selectedFile.name);
            setFileIcon(icon); // Set the icon to display
        }
    };
    const handleCancel = () => {
        setFile(null);
        setFileName('');
        setFileIcon(null); // Clear the selected file information
    };
    const sendMessage = (
        msg: string,
        agentID: string,
        paymentRequest?: PaymentRequestType
    ) => {
        return new Promise((c) => {
            let messageStr;

            if (msg !== "________") {
                messageStr = msg;
            } else {
                messageStr = inputValue.trim();
            }

            if (!messageStr && !file && !paymentRequest) {
                return; // Don't send if all are empty
            }

            const messageToSend = messageStr;
            let docUrl = "";

            const emitMessage = (docUrl: string) => {
                const data: any = {
                    agentId: agentID || "",
                    userId: user?._id,
                    productId: productId,
                    message: messageToSend,
                    typeDate: new Date().toISOString(),
                    type: paymentRequest ? "priceMessage" : file ? "file" : "text",
                    status: "sent",
                    chatState: "active",
                    sendBy: "User",
                    seen: false,
                    doc: docUrl,
                    profileImage: user?.profileImage,
                };

                if (paymentRequest) {
                    data.paymentRequest = paymentRequest;
                }

                socket.emit("messageGet", data, (args: SocketCallBack) => {
                    c(args);
                });

                setUserMessages((prevMessages) => [...prevMessages, data]);
                setInputValue("");
                setFile(null);
                setFileName("");
            };

            if (file) {
                const formData = new FormData();
                formData.append("doc", file);
                formData.append("userId", user?._id || "");
                formData.append("agentId", agentID || "");
                formData.append("productId", productId || "");
                formData.append("message", messageToSend);
                formData.append("profileImage", user?.profileImage || "");
                formData.append("sendBy", "User");
                formData.append("type", paymentRequest ? "priceMessage" : "file");
                formData.append("typeDate", new Date().toISOString());

                if (paymentRequest) {
                    formData.append("paymentRequest", JSON.stringify(paymentRequest));
                }
                axios
                    .post(`${API_URL}/apis/chat/uploadDoc`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then(function (resp) {
                        docUrl = resp.data.data;
                        emitMessage(docUrl);
                    });
            } else {
                emitMessage("");
            }
        });
    };


    const dispatch = useDispatch();
    // const handleReplyClick = (message: Message) => {
    //     setReplyingTo(message);
    // };

    const handleViewQuote = (message: Message) => {
        alert(`Quote Details: ${message.paymentRequest?.productDescription}`);
    };
    const router = useRouter();

    const handlePayQuote = (message: Message) => {
        const amount = message.paymentRequest?.amount;
        if (amount) {
            router.push(`/payment?amount=${amount}`);
        } else {
            alert("No amount found for this quote.");
        }
    };
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) { // Check for Enter key without Shift
            event.preventDefault(); // Prevent default behavior of Enter (e.g., new line)
            sendMessage(inputValue, SeletedAgent ? SeletedAgent._id : ""); // Call your sendMessage function
            setInputValue(""); // Clear the input after sending
            scrollToBottom();
        }
    }
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [searchText, setSearchText] = useState("");
    const handleSearchValue = (value: string) => {
        setSearchText(value);
    };
    const [isAtBottom, setIsAtBottom] = useState(true);
    const checkIfAtBottom = () => {
        if (messScrollContainer.current) {
            const { scrollTop, scrollHeight, clientHeight } = messScrollContainer.current;
            // Check if user is within 100px from the bottom
            setIsAtBottom(scrollHeight - scrollTop - clientHeight < 100);
        }
    };
    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to bottom
        }
    };
    useEffect(() => {
        // Add scroll event listener to detect when the user scrolls up
        if (messScrollContainer.current) {
            messScrollContainer.current.addEventListener('scroll', checkIfAtBottom);
        }

        // If the user is at the bottom or a new message is sent, scroll to the bottom
        if (isAtBottom) {
            scrollToBottom(); // Scroll to bottom only if the user was already at the bottom
        }

        // Clean up the scroll listener when the component unmounts
        return () => {
            if (messScrollContainer.current) {
                messScrollContainer.current.removeEventListener('scroll', checkIfAtBottom);
            }
        };
    }, [userMessages, SeletedAgent, isAtBottom]); // This will trigger every time `userMessages` or `isAtBottom` updates

    // When a new message is sent, force scrolling to the bottom
    useEffect(() => {

        // scrollToBottom();

    }, [userMessages.length]); // Triguger when a new message is added (or length changes)

     


    return (
        <div className="flex flex-col h-[100vh] bg-[whitesmoke] rounded-[40px]">

            <div className="flex h-full overflow-hidden p-4 ">

                {(!isMobile || !SeletedAgent) && (
                    <div className="w-full md:w-1/3 min-w-[350px] ">
                        <div className="sticky top-0 bg-gray-100 ">
                            <h1 className="text-5xl font-bold mb-2">Chat</h1>
                            <span className="text-gray-500 mb-2">Get more information about your quotes</span>
                            {/* <button
                                className={`${activeButton === 'agents' ? "bg-red-600" : "bg-red-400"
                                    } text-white px-4 me-3 mt-3 py-2 rounded-lg mb-4`}
                                onClick={() => {
                                    setpage1(1);
                                    setpage2(1);
                                    setSeletedAgent(null)
                                    setUserMessages([])
                                    handleShowAgents(1, true);
                                    setIsInterested(true);
                                    setActiveButton('agents');
                                }}
                            >
                                Agents I am working with
                            </button> */}
                            <button
                                className={`${activeButton === 'users' ? "bg-red-600" : "bg-red-400"
                                    } text-white px-4 py-2 block rounded-lg mb-6`}
                                onClick={() => {
                                    setpage1(1);
                                    setpage2(1);
                                    setSeletedAgent(null)
                                    setUserMessages([])
                                    handleShowAllUsers(1, true);
                                    setIsInterested(false);
                                    setActiveButton('users');
                                }}
                            >
                                All chats  with Agents
                            </button>
                            <div className="search mb-4 sm:flex sm:items-center align-middle" >
                                <h2 className="text-2xl mt-2 items-center  "><b>Messages</b></h2>
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    className="text-[15px] font-[500] h-[43px] border px-[10px] sm:w-[200px] rounded-[10px] focus:outline focus:outline-[1px] focus:outline-[--red]"
                                    defaultValue={searchText}
                                    onChange={(e) => handleSearchValue(e.target.value)}
                                />
                                <i className="fa-solid fa-magnifying-glass text-3xl ms-2"></i>
                            </div>
                        </div>
                        {
                            activeButton == "agents" && <div ref={activeAgentContainer} onScroll={activeAgentScroll} className="  overflow-y-scroll  h-[60vh] ">
                                {
                                    loading ? (
                                        <LoadingScreen></LoadingScreen>
                                    ) : <div className="new-container">
                                        {
                                            AgentToShow
                                                .filter((user) => user.username && user.username.toLowerCase().includes(searchText.toLowerCase()))
                                                .map((user) => {
                                                    dispatch(setChatOpen(false));
                                                    // Filter messages for the current user
                                                    const messages = userMessages.filter(
                                                        (message) => message.userId === user._id || message.agentId === user._id
                                                    );
                                                    // Calculate unread messages only for messages that are received by the current user (i.e., sent by someone else)
                                                    const unreadCount = messages.filter(
                                                        (message) => !message.seen && message.sendBy !== "User" // Only count messages not sent by this user
                                                    ).length;
                                                    return (
                                                        <div
                                                            key={user._id}
                                                            className={`items-center justify-between mb-4 cursor-pointer p-2 hover:bg-gray-100 rounded-lg w-full ${SeletedAgent?._id === user._id ? "bg-gray-200" : ""
                                                                }`}

                                                            onClick={() => {
                                                                setpage3(1)
                                                                setUserMessages([])
                                                                handleUserClick(user, 1, true)
                                                            }
                                                            }
                                                        >
                                                            <div className="flex relative">
                                                                <img
                                                                    className="w-10 h-10 rounded-full mr-4"
                                                                    src={user.profileImage}
                                                                    alt={`${user.username}'s profile`}
                                                                />
                                                                <div className="items-center flex-1">
                                                                    <div>
                                                                        <div className="flex pb-3 justify-between items-center">
                                                                            <h2 className="text-lg font-bold">{user.username}</h2>
                                                                            <div className="text-xs ms-2">
                                                                                {/* Minimum Daily Order Requirement: { } */}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            {/* Display last message if available */}
                                                                            {user.lastMessage ? (
                                                                                <>
                                                                                    <p className="text-sm">
                                                                                        {
                                                                                            user.lastMessage ? user.lastMessage.length > 20 ? `${user.lastMessage.slice(0, 20)}...` : user.lastMessage : "No messages yet..."
                                                                                        }

                                                                                        {/* {user.lastMessage.split(" ").slice(0, 3).join(" ")}
                                                                                    {user.lastMessage.split(" ").length > 3 ? "..." : ""} */}
                                                                                    </p>
                                                                                </>
                                                                            ) : (
                                                                                <p className="text-sm text-gray-500">No messages yet.</p>
                                                                            )}
                                                                            {/* Show Last Seen */}
                                                                            <span className="text-sm text-gray-500">
                                                                                {getLastSeenTime(user.lastMessageTime)}
                                                                            </span>
                                                                        </div>
                                                                        {/* Unread Message Count */}
                                                                        {unreadCount > 0 && (
                                                                            <span className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                                                                {unreadCount}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                        }
                                    </div>
                                }
                            </div>}
                        {activeButton == "users" && <div ref={allAgentContainer} onScroll={allAgentScroll} className="  overflow-y-scroll  h-[60vh] ">
                            {
                                loading ? (
                                    // <LoadingSpinner></LoadingSpinner>
                                    <LoadingScreen></LoadingScreen>
                                ) : <div>
                                    {
                                        usersToShow
                                            .filter((user) => user.username?.toLowerCase().includes(searchText.toLowerCase()))
                                            .map((user) => {
                                                dispatch(setChatOpen(false));
                                                // Filter messages for the current user
                                                const messages = userMessages.filter(
                                                    (message) => message.userId === user._id || message.agentId === user._id
                                                );
                                                // Calculate unread messages only for messages that are received by the current user (i.e., sent by someone else)
                                                const unreadCount = messages.filter(
                                                    (message) => !message.seen && message.sendBy !== "User" // Only count messages not sent by this user
                                                ).length;

                                                return (
                                                    <div
                                                        key={user._id}
                                                        className={`items-center justify-between mb-4 cursor-pointer p-2 hover:bg-gray-100 rounded-lg w-full ${SeletedAgent?._id === user._id ? "bg-gray-200" : ""
                                                            }`}
                                                        onClick={() => {
                                                            setpage3(1)
                                                            setUserMessages([])
                                                            handleUserClick(user, 1, true)
                                                        }
                                                        }
                                                    >
                                                        <div className="flex relative">
                                                            <img
                                                                className="w-10 h-10 rounded-full mr-4"
                                                                src={user.profileImage}
                                                                alt={`${user.username}'s profile`}
                                                            />
                                                            <div className="items-center flex-1">
                                                                <div>
                                                                    <div className="flex pb-3 justify-between items-center">
                                                                        <h2 className="text-lg font-bold">{user.username}</h2>
                                                                        <div className="text-xs ms-2">
                                                                            {/* Minimum Daily Order Requirement: { } */}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        {/* Display last message if available */}
                                                                        {user.lastMessage ? (
                                                                            <>
                                                                                <p className="text-sm">
                                                                                    {
                                                                                        // user.lastMessage ? user.lastMessage.length > 20 ? `${user.lastMessage.slice(0, 20)}...` : user.lastMessage : "No messages yet..."
                                                                                    }
                                                                                    {/* {user.lastMessage.split(" ").slice(0, 3).join(" ")}
                                                                                    {user.lastMessage.split(" ").length > 3 ? "..." : ""} */}
                                                                                </p>
                                                                            </>
                                                                        ) : (
                                                                            <p className="text-sm text-gray-500"> </p>
                                                                        )}
                                                                        {/* Show Last Seen */}
                                                                        <span className="text-sm text-gray-500">
                                                                            {/* {getLastSeenTime(user.lastMessageTime)} */}
                                                                        </span>
                                                                    </div>
                                                                    {/* Unread Message Count */}
                                                                    {unreadCount > 0 && (
                                                                        <span className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                                                            {unreadCount}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                    }
                                </div>
                            }
                        </div>}

                    </div>

                )}
                {SeletedAgent ? (
                    <div className="w-full md:w-2/3 flex flex-col border   rounded-lg  ">

                        {isMobile && SeletedAgent && (
                            dispatch(setChatOpen(true)),
                            <div className="flex items-center justify-between p-2 bg-gray-200 border-b">
                                <div className="flex justify-start items-center">


                                    <button
                                        className="mr-2 p-2 rounded-full "
                                        onClick={() => setSeletedAgent(null)}
                                        aria-label="Back"
                                    >
                                        <i className="fa-solid fa-arrow-left text-lg"></i>
                                    </button>

                                    <img
                                        className="w-10 h-10 rounded-full mr-2"

                                        src={SeletedAgent.profileImage}
                                        alt={`${SeletedAgent} avatar`}
                                    />
                                    <div>
                                        <span className="font-bold text-lg">{SeletedAgent.username}</span>
                                        <p className="text-sm text-gray-400" style={{ fontSize: "11px" }}>
                                            {/* Last seen: {SeletedAgent.lastSeen ? new Date(SeletedAgent.lastSeen).toLocaleString() : "Unavailable"} */}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleTagClick(SeletedAgent._id)}


                                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                >
                                    {/* Toggle color based on 'isInterested' */}
                                    <i
                                        className={`fa-${isInterested ? 'solid' : 'regular'} fa-bookmark ${isInterested ? 'text-red-500' : ''
                                            }`}
                                    ></i>
                                </button>

                            </div>
                        )}
                        <div ref={messScrollContainer} onScroll={messageTopScroll} className="chat-messages flex-1 mt-4 ml-2 overflow-y-scroll h-[calc(100vh-160px)] custom-scrollbar">
                            {!isMobile && SeletedAgent && (

                                <div className="flex justify-between bg-gray-200 z-50  bg sticky top-0 p-2  items-center mb-2 border rounded-md pb-2">
                                    <div className="flex items-center ">
                                        <div className="border-r border-gray-300 pr-2"  >
                                            {/* <span className="font-bold ">{SeletedAgent._id}</span> */}
                                            <span><b>{SeletedAgent.username}</b></span>
                                            {/* <p className="text-sm text-gray-400">Last seen: {userLastSeen[SeletedAgent._id]}</p> */}
                                            <p className="text-sm text-gray-400" style={{ fontSize: "11px" }}>
                                                {/* Last seen: {SeletedAgent.lastSeen ? new Date(SeletedAgent.lastSeen).toLocaleString() : "Unavailable"} */}
                                            </p>

                                        </div>
                                        <span className="text-sm text-gray-400 ms-3">Local time: {new Date().toLocaleTimeString()}</span>
                                    </div>
                                   
                                </div>
                            )
                            }
                            {
                                loading ? (
                                  
                                    <LoadingScreen></LoadingScreen>
                                    // </div>
                                ) :

                                    [...userMessages].map((msg, index) => {
                                        const isCurrentUser = msg.sendBy === "User"; // Check if the message is sent by the user
                                        const profileImage = isCurrentUser ? user?.profileImage : SeletedAgent?.profileImage; // Display appropriate profile image
                                        return (
                                            <div className="message mb-4 mt-2 flex items-start"
                                                //  onClick={() => handleReplyClick(msg)} 
                                                key={index}>
                                                <img className="w-8 h-8 rounded-full mr-4" src={profileImage || ""} alt="Profile" />
                                                <div>
                                                    <div className="flex">
                                                        <p className="font-bold me-5">
                                                            <span className="text-sm text-gray-500">
                                                                {isCurrentUser ? 'ME' : SeletedAgent?.username} {/* Show ME or the agent's username */}
                                                            </span>
                                                        </p>
                                                        <span className="me-3">
                                                            {new Date(msg.typeDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })},{" "}
                                                            {new Date(msg.typeDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                        </span>
                                                    </div>
                                                    {/* Display the message content */}
                                                    {
                                                        msg.message &&
                                                        <p className="bg-gray-200  p-3 rounded-lg">{msg.message}</p>
                                                    }

                                                    {/* Display the attached document, if available */}

                                                    {msg.doc && (
                                                        <div className="my-1 max-w-xs">
                                                            {isImage(msg.doc) ? (
                                                                <div className="inline-block rounded-xl overflow-hidden shadow-lg border border-gray-300 relative max-w-[280px] max-h-[320px]">
                                                                    <img
                                                                        src={msg.doc}
                                                                        alt="chat image"
                                                                        className="block w-full h-auto object-cover"
                                                                        style={{ borderRadius: "12px" }}
                                                                    />
                                                                    {/* Optional: subtle hover zoom effect */}
                                                                    <style jsx>{`
          div:hover img {
            transform: scale(1.05);
            transition: transform 0.3s ease;
          }
        `}</style>
                                                                </div>
                                                            ) : (
                                                                // File display code unchanged
                                                                <div className="relative flex items-center h-[100px] bg-gray-100 space-x-2 w-full group p-2 rounded-lg shadow-sm border border-gray-300">
                                                                    <div className="relative w-20 h-20 flex items-center justify-center">
                                                                        <span className="text-4xl">{getFileIcon(msg.doc)}</span>
                                                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg"></div>
                                                                        <a
                                                                            href={msg.doc}
                                                                            download
                                                                            target="_blank"
                                                                            className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 text-4xl transition-transform duration-300 ease-in-out group-hover:scale-125"
                                                                        >
                                                                            <i className="fa-solid fa-download text-red-400"></i>
                                                                        </a>
                                                                    </div>
                                                                    <a
                                                                        href={msg.doc}
                                                                        download
                                                                        className="text-gray-600 truncate block max-w-[150px] transition-colors duration-300 ease-in-out group-hover:text-blue-500 group-hover:underline"
                                                                    >
                                                                        {typeof msg.doc === "string" ? msg.doc.split("/").pop() : "File"}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}








                                                    {/* Display the payment request, if available */}
                                                    {msg.paymentRequest && (
                                                        <div className="mt-2 p-3 bg-gray-200 rounded-lg border border-gray-200">
                                                            <p><b>Quote for {msg.paymentRequest.productQuantity} products</b></p>
                                                            <p>
                                                                {msg.paymentRequest?.productDescription ? (
                                                                    msg.paymentRequest.productDescription.split('\n').map((info, index) => (
                                                                        <span key={index}>
                                                                            {info}
                                                                            <br />
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span>No product description available</span>
                                                                )}
                                                            </p>
                                                            <div className="flex justify-end gap-5 mt-2">
                                                                <button onClick={() => handleViewQuote(msg)} className="px-3 py-1 rounded">View Quote</button>
                                                                <button onClick={() => handlePayQuote(msg)} className="bg-red-600 text-white px-3 py-1 rounded">Pay Quote</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            <div ref={chatEndRef} />

                        </div>


                        <div className="chat-input  p-2  items-center relative">
                            {fileName && (
                                <div className="flex items-center  h-[100px] space-x-2 mb-2 w-full justify-between">
                                    <div>

                                        <div className="text-4xl">
                                            {fileIcon && fileIcon} {/* Show the file-specific icon */}
                                            <span className="text-gray-600">{fileName}</span>
                                        </div>

                                    </div>
                                    {/* Cancel icon */}
                                    <button onClick={handleCancel} className="ml-2 text-red-500 text-4xl hover:text-red-700">
                                        <i className="fa-solid fa-times-circle"></i> {/* Cancel icon */}
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center border border-gray-300 rounded-lg py-2 w-full">
                                <input className={`flex-1 p-2 bg-gray-100 border-none focus:outline-none  }`} type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Send a message"
                                    onKeyPress={handleKeyPress}
                                />

                                <button className="ml-2    rounded-lg" onClick={() => {

                                    sendMessage("________", SeletedAgent._id);

                                    scrollToBottom();


                                }}>Send</button>
                                <input type="file" className="hidden " id="file-upload" onChange={handleFileChange} />
                                <label htmlFor="file-upload" className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg mr-2 text-gray-600">
                                    <i className="fa-solid fa-folder-plus"></i>
                                    {/* {fileName && <span className="text-gray-600">{fileName}</span>} */}
                                </label>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="hidden md:block w-full md:w-2/3 flex-col h-screen"  >
                        <div className="w-full p-6 flex flex-col justify-center items-center h-screen"  >
                            <h2 className="text-lg font-semibold"><b><i className="text-[32px]">Pick up where You left off</i></b></h2>
                            <span className='text-gray-500'><i><b>select a conversation and chat anyway</b></i></span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

