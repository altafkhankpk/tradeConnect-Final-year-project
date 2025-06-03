"use client";
import React, { useState, useEffect, useRef } from "react";
// import "./chat.css"; // Ensure this path is correct based on your project structure
import axios from "axios";
import { useSearchParams } from "next/navigation";

import io from 'socket.io-client';
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store/store";






import Cookies from "js-cookie";
import { setChatOpen } from "@/features/agentFeatures";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import PricMessage from "../ChatComponents/PriceMessageUI";



const token = Cookies.get("agentAccess");
const API_URL = process.env.NEXT_PUBLIC_REACT_APP_BASEURL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_BASEURL;
// 167.71.81.153:8000
const socket = io(`${SOCKET_URL}/apis/agent`, {
  'transports': ['websocket'],
  query: {
    token: `${token}`

  }
});



type SocketCallBack = {
  success: boolean
};

// let userId = localStorage.getItem("userId")
interface UserType {
  userId: {
    _id: string
  }
  sendBy: string;
  message: string;
  data: {
    updatedAt: string;
    userId: {
      lastMessageTime: string;
      _id: string;
      username: string;
      profileImage: string;
      lastSeen: string;
    };
  } & { [key: string]: string }; // Allows other string properties without conflicting with userId
  _id: string;
  username: string;
  lastSeen: string;
  profileImage: string;
  lastMessage: string | null;
  lastMessageTime: Date;
  unseen: number;
}




type AgentType = {
  data: {
    userId: {
      _id: string;
      username: string,
      profileImage: string;
      lastSeen: string;


    }

  },
  _id: string;
  username: string;
  lastSeen: string;
  profileImage: string;
  lastMessage: string | null
  lastMessageTime: Date
  unseen: number

};
interface UserData {
  _id: string;
  username: string;
  profileImage: string;
  name: string;
  email: string;
  // Add other fields as necessary
};

interface Item extends HTMLDivElement {
  clientHeight: number;      // Number type for clientHeight
  scrollTop: number;         // Number type for scrollTop
  scrollHeight: number;      // Number type for scrollHeight
  current: object;           // Use 'object' if 'current' is any non-null object
  onscroll: (event: Event) => void;  // Correctly type onscroll
}
// types.ts (or at the top of chat.tsx)
export interface Message {
  docType?: string;
  sendBy: string;
  userId: string | undefined;
  agentId: string;
  productId: string | null;
  message: string;
  typeDate: string; // ISO string or Date object
  type: string;
  status: string;
  chatState: string;
  seen: boolean;
  doc: string; // Allow doc to be File or null
  profileImage: string | undefined; // Change String to string (for consistency)
  replyToMessageId?: string | undefined;
  amount: string | undefined;
  description: string | undefined

  paymentRequest?: {
    amount: 150.00,
    currency: "USD",
    requestId: "req_123456",
    productQuantity: 3, // Added productQuantity
    productDescription: "Product A\nProduct B\nProduct C" // Added productDescription
  },
}
export default function ReduxProvider() {
  return <Provider store={store}>
    <Chat></Chat>
  </Provider>
}
function Chat() {
  const [fileIcon, setFileIcon] = useState<JSX.Element | null>(null);
  const [selectedUser, setSelectedUser] = useState<AgentType | null>(null);
  const [isInterested, setIsInterested] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  // const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [activeButton, setActiveButton] = useState('agents');

  const [usersToShow, setUsersToShow] = useState<UserType[]>([]); // Default to UserType[]
  const [agentToShow, setAgnetToShow] = useState<UserType[]>([]); // Default to UserType[]
  const [userMessages, setUserMessages] = useState<Message[]>([]);

  const searchParams = useSearchParams(); // Use the new hook to get search parameters
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true); // State for loading spinner
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [page1, setpage1] = useState(1)

  const [page2, setpage2] = useState(1)

  const [page3, setpage3] = useState(1)

  const chatEndRef = useRef<HTMLDivElement>(null);

  // let leftContainer = useRef<HTMLDivElement | null>(null);

  const leftContainer = useRef<Item | null>(null);

  const rightContainer = useRef<Item | null>(null);

  const messScrollContainer = useRef<HTMLDivElement>(null);



  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);

  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    data.type = "priceMessage";
    sendMessage("", selectedUser ? selectedUser._id : "", data);
    toggleModal();  // Close modal after submission
    reset()
  };

  // const messageKey = useSelector(function (store: any) {
  //   return store.agentFeatures.keyForMessage;
  // })
  const agentScroll = () => {

    const bottom = (leftContainer.current?.scrollHeight || 0) === (leftContainer.current?.scrollTop || 0) + (leftContainer.current?.clientHeight || 0);

    if (bottom) {
      setpage1((prev) => prev + 1); // Load next page2
    }

  }
  const userScroll = () => {
    const bottom = (rightContainer.current?.scrollHeight || 0) === (rightContainer.current?.scrollTop || 0) + (rightContainer.current?.clientHeight || 0);

    if (bottom) {
      setpage2((prev) => prev + 1); // Load next page2
    }
  }
  const messageTopScroll = () => {

    const atTop = messScrollContainer.current?.scrollTop === 0;

    if (atTop) {

      setpage3((prev) => prev + 1);

    }
  };
  useEffect(() => {
    // all users ko mngwata
    if (selectedUser) {
      console.log("thsi is seleted adget ")
      console.log(selectedUser);
      handleUserClick(selectedUser, page3, false);
    }
  }, [page3]);

  useEffect(() => {
    //right button mycustomer
    handleMyCustomer(page2, false);
  }, [page2]);

  useEffect(() => {
    // left button allChat
    handleAllChat(page1, false);
  }, [page1])


  const handleTagClick = (userId: string) => {
    setSelectedUser(null)
    try {
      axios.post(`${API_URL}/apis/chat/markAgent/${userId}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then(() => {
        console.log("Initial users and agents:");
        console.log("usersToShow:", usersToShow);
        console.log("agentToShow:", agentToShow);

        if (activeButton === "agents") {
          // Ensure you're accessing userId correctly (it might be inside data.userId)
          const updatedAgents = agentToShow.filter(i =>
            i.data && i.data.userId && i.data.userId._id !== userId
          );
          setAgnetToShow(updatedAgents); // Update the state with the new array
          console.log("Updated agent list:", updatedAgents);
        } else if (activeButton === "users") {
          const updatedUsers = usersToShow.filter(i =>
            i.data && i.data.userId && i.data.userId._id !== userId
          );
          setUsersToShow(updatedUsers); // Update the state with the new array
          console.log("Updated user list:", updatedUsers);
        }
      });
    } catch (error) {
      console.error('Error marking chat:', error);
    }

    console.log(isInterested);
    setIsInterested(!isInterested);
    const currentValue = !isInterested ? 'Interested' : 'Active Customers';
    console.log('Current value:', currentValue);
  };

  // const router = useRouter();

  const productId = searchParams.get('productId');
  const userId = searchParams.get('userId'); // Extract userId/ const productId = searchParams.get('productId');


  useEffect(() => {

    if (userId) {

    }


  }, [userId]);

  useEffect(() => {

    if (selectedUser) {
      console.log(20);
    }

  }, [selectedUser])


  // const userId = searchParams.get('userId');
  useEffect(() => {

    console.log("Response data:dddddddddddddddddddddd",);
    async function load() {
      try {
        const resp = await getUserMessges();
        console.log("Logging agentId and productId:");
        console.log("userId:", userId);  // Should log the agentId
        console.log("productId:", productId);  // Should log the productId
        if (userId && resp.data && !resp.data.data.length) {

          const resp = await sendMessage("Hello, who are you?", userId, null) as { status: boolean };
          if (resp.status == true) {
            const users = await handleAllChat(page1, true) as UserType[];

            const agent = users.find((i: UserType) =>
              i.data && i.data.userId && i.data.userId._id === userId
            );
            if (agent) {
              handleUserClick(agent, 1, true)
              setSelectedUser({ ...agent });
            }
          }
        } else if (resp.data.data.length >= 1) {

          const users = await handleAllChat(page1, true) as UserType[];

          const agent = users.find((i: UserType) =>
            i.data && i.data.userId && i.data.userId._id === userId
          );


          if (agent) {
            handleUserClick(agent, 1, true)
            setSelectedUser({ ...agent });
          }

        }

      } catch (e) {


      }
    }

    load();
  }, [userId, productId]); // Re-run effect when userId or productId changes

  const [searchText, setSearchText] = useState("");
  const handleSearchValue = (value: string) => {
    setSearchText(value);
  };
  useEffect(() => {
    socket.on('messageSend', (receivedMessage: Message) => {


      // Add the received message to the userMessages state
      // setUserMessages((prevMessages) => [receivedMessage,...prevMessages, ]);
    });

    // Clean up the socket listener when the component unmounts
    return () => {
      socket.off('messageSend');
      const data = new FormData()
      data.append("openChat", "");
      axios.post(`${API_URL}/apis/agent/update`, data, {
        headers: {
          Authorization: `Bearer ${token}`
          // Authorization:"Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Zjk1M2M2MTlmN2I3YTU4NzIyYTkyMSIsImlhdCI6MTcyNzYxNTk0MiwiZXhwIjoxNzI3Nzg4NzQyfQ.ynQ1P6bMrwBjEZIvzT7FR1cqVWhgY4PsM5UyyHgnfDg"
        }
      }).then((resp) => {
        console.log(resp.data.data)
      })


    };
  }, []);
  useEffect(() => {

    axios.get(`${API_URL}/apis/agent/get`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add your token here
      },
    }).then((resp) => {
      // Log the user details from the response

      if (resp.data.status === 'ok') {
        setUser(resp.data.data);  // Update state with user data


        // Log the _id from the response directly
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



  const handleAllChat = (page: number, reset: boolean) => {

    return new Promise((c) => {
      setLoading(true);
      try {

        if (reset) {
          setAgnetToShow([]); // Clear the current agents list before fetching new data
        }
        axios.get(`${API_URL}/apis/user/getAll`, {
          params: {
            page: page,
            limit: 5
          },
          headers: {
            Authorization: `Bearer ${token}` // Include the token here
          }
        }).then(function (resp) {
          console.log("///......dddddddddsssss")
          console.log(resp.data.data)
          setAgnetToShow(resp.data.data)


          // const sortedData = resp.data.data.sort((a: UserType, b: UserType) => {
          //   const timeA = new Date(a.data.updatedAt).getTime();
          //   const timeB = new Date(b.data.updatedAt).getTime();
          //   return timeB - timeA;  // Sort in descending order (most recent first)
          // });

          // // Debugging sorted data
          // sortedData.forEach((item: UserType) => {
          //   console.log("Sorted updatedAt:", item.data.updatedAt);
          // });
          // console.log(sortedData)

          // Set sorted data to state
          // setAgnetToShow(sortedData);

          // Set the sorted array to usersToShow
          // setUsersToShow(resp.data.data);
          // setActiveButton('agents');
          // if (reset) {
          //   const fresh = [...sortedData];
          //   setAgnetToShow(fresh);
          //   c(sortedData)
          // } else {
          //   const fresh = [...agentToShow, ...sortedData];
          //   setAgnetToShow(fresh);
          //   c(fresh)
          // }
        });
      } catch (error) {
        console.error('Error fetching active agent last chat:', error);
      }
      setLoading(false);
    });

  }


  const handleMyCustomer = async (page: number, reset: boolean) => {
    if (reset) {
      setUsersToShow([]); // Clear the current agents list before fetching new data
    }

    try {
      // Fetch all agents with their last messages
      axios.get(`${API_URL}/apis/chat/getActiveUserChat`, {
        params: {
          page: page,
          limit: 5
        },
        headers: {
          Authorization: `Bearer ${token}`,  // Include the token here
        }
      }).then(function (resp) {
        // Log the data for debugging
        console.log(resp.data.data);

        // Sort the data by 'updatedAt' (most recent time first)
        const sortedData = resp.data.data.sort((a: UserType, b: UserType) => {
          const timeA = new Date(a.data.updatedAt).getTime();
          const timeB = new Date(b.data.updatedAt).getTime();
          return timeB - timeA;  // Sort in descending order (most recent first)
        });

        // Debugging sorted data
        sortedData.forEach((item: UserType) => {
          console.log("Sorted updatedAt:", item.data.updatedAt);
        });
        if (reset) {
          setUsersToShow([...sortedData]);
        } else {
          setUsersToShow([...usersToShow, ...sortedData]);
        }
        // Set sorted data to state
        // setUsersToShow(sortedData);
        // setActiveButton('users');
      });

    } catch (error) {
      console.error('Error fetching all agents last chat:', error);
    }
  };







  // let [agent, setAgent] = useState<AgentType>({
  //     _id: "",
  //     username: "",
  //     lastSeen: "",
  //     profileImage: ""
  // });

  // let cUser = useSelector((store: any) => {
  //   return store.features.currentUser;
  // })

  const [fileName, setFileName] = useState("");

  const getUserMessges = () => {
    return axios
      .get(`${API_URL}/apis/user/getAll?`, {
        params: {
          page: 1,
          limit: 20,
          // Use the extracted userId for the API call
          userId: userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

  }

  const handleUserClick = (user: AgentType, page: number, reset: boolean) => {
    // setUserMessages([]);
    // if (reset) {
    //   setUserMessages([]);
    // }
    // setpage3(1)

    // The _id within userId



    // Create a new object that keeps the structure of AgentType
    const newSelectedUser: AgentType = {
      ...user, // Keep the other properties
      // data: {
      //   ...user.data, // Keep the other properties inside data
      //   userId: { ...user.data.userId } // Ensure we preserve the existing userId structure
      // }
    };
    // Set the selected user with the full structure
    setSelectedUser(newSelectedUser);
    const userId = user._id; // Extract userId for API call

    axios
      .get(`${API_URL}/apis/chat/getUserChat`, {
        params: {
          page: page,
          limit: 20,
          // Use the extracted userId for the API call
          userId: userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        console.log("this is messages of user");
        console.log(resp.data.data);
        // setUserMessages(resp.data.data);
        if (reset) {
          setUserMessages([...resp.data.data])
        } else {
          setUserMessages([...userMessages, ...resp.data.data])
        }
        // Update selected user after fetching messages (if needed)
        // setSelectedUser(newSelectedUser);
        // setReplyingTo(null); // Clear replying state
      })
    const data = new FormData()
    data.append("openChat", userId);
    axios.post(`${API_URL}/apis/agent/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`
        // Authorization:"Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Zjk1M2M2MTlmN2I3YTU4NzIyYTkyMSIsImlhdCI6MTcyNzYxNTk0MiwiZXhwIjoxNzI3Nzg4NzQyfQ.ynQ1P6bMrwBjEZIvzT7FR1cqVWhgY4PsM5UyyHgnfDg"
      }
    }).then((resp) => {
      console.log("ohohohohohohohohohohohohoh")
      console.log(resp.data.data)
    })
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

  const sendMessage = (msg: string, agentID: string, data: FieldValues | null) => {

    return new Promise((c) => {

      let messageStr;

      if (msg !== "______") {
        messageStr = msg;
      } else {
        messageStr = inputValue.trim();
      }

      if (!messageStr && !file && !data) {
        return; // Don't send if both input and file are empty
      }

      const messageToSend = messageStr;
      let docUrl
      // Add file to formData if it exists
      if (file) {
        const formData = new FormData();
        formData.append("doc", file); // Append the selected file if it exists
        formData.append("fileName", file.name); // Append the file name
        formData.append("userId", agentID); // Append the user ID
        formData.append("productId", productId || ""); // Append the product ID if it exists
        formData.append("message", messageToSend); // Append the message text
        formData.append("sendBy", "Agent"); // Append the sender type
        formData.append("type", file.type || ""); // Append the file type
        formData.append("typeDate", new Date().toISOString()); // Append the current date
        formData.append("status", "sent"); // Append the message status
        formData.append("chatState", "active"); // Append the chat state
        formData.append("seen", "false"); // Append the seen status
        formData.append("agentId", user?._id || ""); // Append the agent ID
        axios.post(`${API_URL}/apis/chat/uploadDoc`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
            // Authorization:"Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Zjk1M2M2MTlmN2I3YTU4NzIyYTkyMSIsImlhdCI6MTcyNzYxNTk0MiwiZXhwIjoxNzI3Nzg4NzQyfQ.ynQ1P6bMrwBjEZIvzT7FR1cqVWhgY4PsM5UyyHgnfDg"
          }
        }).then(function (resp) {
          console.log(resp.data.data);
          docUrl = resp.data.data
          emitMessage(docUrl, null)

        })

      } else {
        emitMessage("", null)
      }


      if (data && data.type === "priceMessage") {
        emitMessage("", data)
      }

      // Create the new message object to add immediately to the chat

      function emitMessage(docUrl: string, priceMessage: FieldValues | null) {
        let data: Message
        if (priceMessage && priceMessage.type === "priceMessage") {
          data = {
            userId: agentID || "",   // the ID of the recipient (agent ID)
            agentId: user?._id || "", // Ensure agentId is always a string
            productId: productId,
            sendBy: "Agent",
            message: "",
            typeDate: new Date().toISOString(),
            type: priceMessage.type, // Determine type based on file presence
            status: "sent",
            chatState: "active",
            seen: false,
            doc: docUrl,
            amount: priceMessage.price,
            description: priceMessage.description,
            profileImage: user?.profileImage,
          };
        } else {
          data = {
            userId: agentID || "",   // the ID of the recipient (agent ID)
            agentId: user?._id || "", // Ensure agentId is always a string
            productId: productId,
            sendBy: "Agent",
            message: messageToSend,
            typeDate: new Date().toISOString(),
            type: file ? "file" : "text", // Determine type based on file presence
            status: "sent",
            chatState: "active",
            seen: false,
            amount: "",
            description: "",
            doc: docUrl,  // Store the actual File object, not the file name
            profileImage: user?.profileImage,
          };
        }


        // if (isInterested) {
        //   handleMyCustomer()
        // } else {
        //   handleAllChat();
        // }
        if (activeButton == "users") {

          const index = usersToShow.findIndex((user: UserType) => user.data.userId._id === selectedUser?.data.userId._id);
          if (index > -1) {
            // Remove the user from the list
            const tempUser = usersToShow[index];
            tempUser.message = messageToSend;
            usersToShow.splice(index, 1);
            // Add the user to the top of the list
            usersToShow.unshift(tempUser);
            // Update the agent and users list to reflect the change
            setUsersToShow([...usersToShow]);
            // setAgent([...usersToShow]);
          }
        } else if (activeButton === "agents") {
          const index = agentToShow.findIndex((user: UserType) => user._id === selectedUser?._id);
          if (index > -1) {
            // Remove the user from the list
            const tempUser = agentToShow[index];
            tempUser.message = messageToSend;
            agentToShow.splice(index, 1);
            // Add the user to the top of the list
            agentToShow.unshift(tempUser);
            // Update the agent and users list to reflect the change
            setUsersToShow([...agentToShow]);
            // setAgent([...usersToShow]);
          }
        }
        socket.emit('messageGet', data, (args: SocketCallBack) => {

          c(args)
        })
        console.log("message send successfull")
        // Update user messages immediately
        console.log(data);
        setUserMessages((prevMessages) => [data, ...prevMessages]);

        // Clear input and reset states
        setInputValue("");
        setFile(null);
        setFileName("");
        // setReplyingTo(null);

      }
    })

  };




  function isImage(path: string | undefined | null): boolean {
        if (typeof path !== 'string') return false;

        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

        const extension = path.split('.').pop()?.toLowerCase();

        return imageExtensions.includes(extension || '');
    }

   





  // const handleReplyClick = (message: Message) => {
  //   setReplyingTo(message);
  // };

  const handleViewQuote = (message: Message) => {
    alert(`Quote Details: ${message.paymentRequest?.productDescription}`);
  };
  const handlePayQuote = (message: Message) => {
    alert(`Processing payment of $${message.paymentRequest?.amount}`);
    // setReplyingTo(null);
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Check for Enter key without Shift
      scrollToBottom();

      event.preventDefault(); // Prevent default behavior of Enter (e.g., new line)
      sendMessage(inputValue, selectedUser ? selectedUser._id : "", null); // Call your sendMessage function
      setInputValue(""); // Clear the input after sending
    }
  }

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
  }, [userMessages, selectedUser, isAtBottom]); // This will trigger every time `userMessages` or `isAtBottom` updates

  // When a new message is sent, force scrolling to the bottom
  useEffect(() => {
    // scrollToBottom();
  }, [userMessages.length]); // Trigger when a new message is added (or length changes)



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





  return (
    <div className="flex flex-col h-[100vh] bg-white rounded-[40px]">

      <div className="flex h-full overflow-hidden p-4 ">

        {(!isMobile || !selectedUser) && (


          <div className="w-full md:w-1/3 min-w-[350px]">

            <div className="sticky top-0 bg-white ">
              <h1 className="text-5xl font-bold mb-2">Chat</h1>
              <span className="text-gray-500 mb-2">Get more information about your quotes</span>
              <div>

                <button
                  className={`${activeButton === 'agents' ? "bg-red-600" : "bg-red-400"
                    } text-white px-4 me-3 mt-3 py-2 rounded-lg mb-4`}
                  onClick={() => {
                    setpage1(1);
                    setpage2(1);
                    setSelectedUser(null)
                    setUserMessages([])
                    handleAllChat(1, true);  // hhis is agent active button    agenttoshow
                    setIsInterested(false)
                    setActiveButton('agents');


                  }}
                >
                  All Chat
                </button>
                {/* <button
                  className={`${activeButton === 'users' ? "bg-red-600" : "bg-red-400"
                    } text-white px-4 py-2 rounded-lg mb-6`}
                  onClick={() => {
                    setpage1(1);
                    setpage2(1);
                    setSelectedUser(null);
                    setUserMessages([]);
                    handleMyCustomer(1, true);     //this is user active buttton   usertoshow
                    setIsInterested(true);
                    setActiveButton('users');
                  }}
                >
                  My customers
                </button> */}

              </div>


              <div className="search mb-4 sm:flex sm:items-center align-middle" >
                <h2 className="text-2xl mt-2 items-center  "><b>Messages</b></h2>
                <input
                  type="search"
                  placeholder="Search..."
                  className="text-[15px] font-[500] h-[43px] border px-[10px] sm:w-[200px] rounded-[10px] focus:outline focus:outline-[1px] focus:outline-[--red]"
                  // defaultValue={searchText}
                  onChange={(e) => handleSearchValue(e.target.value)}
                />
                <i className="fa-solid fa-magnifying-glass text-3xl ms-2"></i>
              </div>
            </div>
            {
              activeButton == "agents" && <div ref={leftContainer} onScroll={agentScroll} className="  overflow-y-scroll  h-[60vh] ">
                {
                  <>
                    {
                      loading && <div className="flex justify-center  items-center" >
                        <div className="loader h-12 w-12  border-6  border-t-transparent-red bg-red-600 rounded-full   border-red-500 animate-spin"></div>
                      </div>
                    }
                    <div>

                      {agentToShow

                        .filter((user) => user.username.toLowerCase().includes(searchText.toLowerCase()))
                        .map((user) => {
                          dispatch(setChatOpen(false))
                          // const messages = userMessages.filter(
                          //   (message) => message.sendBy === "User" || message.sendBy === "Agent"
                          // );
                          {
                            // console.log("this is user.data.message");
                            console.log(user.unseen)
                          }
                          // Calculate unread messages only for messages that are received by the current user (i.e., sent by someone else)
                          // const unreadCount = messages.filter(
                          //   (message) => !user.unseen && message.sendBy !== "Agent" // Only count messages not sent by this user
                          // ).length;

                          return (
                            <div
                              key={user._id}
                              className={`items-center justify-between mb-4 cursor-pointer p-2 hover:bg-gray-100 rounded-lg w-full ${selectedUser?._id === user._id ? "bg-white" : ""}`}
                              onClick={() => handleUserClick(user, 1, true)}
                            >
                              <div className="flex relative">
                                <img className="w-10 h-10 rounded-full mr-4" src={user.profileImage} alt={`${user.username}'s profile`} />
                                <div className="items-center flex-1">
                                  <div>
                                    <div className="flex pb-3 justify-between items-center">
                                      <h2 className="text-lg font-bold">{user.username}</h2>
                                      {/* <div className="text-xs ms-2">Minimum Daily Order Requirement: { }</div>   */}
                                    </div>
                                    <div className="flex justify-between">
                                      {/* Display last message if available */}
                                      <>
                                        <p className="text-sm">
                                          {/* Show the last message or a placeholder if no message exists */}
                                          {/* {user.data.message
                                            ? user.data.message.length > 20
                                              ? `${user.data.message.slice(0, 20)}...`
                                              : user.data.message
                                            : "No messages yet."
                                          } */}
                                        </p>
                                      </>
                                      {/* <span className="text-sm text-gray-500">{getLastSeenTime(user.updatedAt)}</span> */}
                                    </div>
                                    {/* Unread Message Count */}
                                    {user.unseen > 0 && (
                                      <span className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {user.unseen}
                                      </span>
                                    )}

                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </>
                }

              </div>
            }
            {
              activeButton == "users" && <div ref={rightContainer} onScroll={userScroll} className="  z-50 overflow-y-scroll  h-[60vh] ">
                {
                  <>
                    {loading &&
                      <div className="flex justify-center  items-center" >
                        <div className="loader h-12 w-12  border-6  border-t-transparent-red bg-red-600 rounded-full   border-red-500 animate-spin"></div>
                      </div>
                    }
                    <div>

                      {usersToShow
                        .filter((user) => user.data.userId.username.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
                        .map((user) => {
                          dispatch(setChatOpen(false))
                          // const messages = userMessages.filter(
                          //   (message) => message.sendBy === "User" || message.sendBy === "Agent"
                          // );
                          {
                            // console.log("this is user.data.message");
                            console.log(user.unseen)
                          }
                          // Calculate unread messages only for messages that are received by the current user (i.e., sent by someone else)
                          // const unreadCount = messages.filter(
                          //   (message) => !user.unseen && message.sendBy !== "Agent" // Only count messages not sent by this user
                          // ).length;

                          return (
                            <div
                              key={user._id}
                              className={(selectedUser && selectedUser._id == user._id ? "selected-user " : "") + `items-center justify-between mb-4 cursor-pointer p-2 hover:bg-gray-100 rounded-lg w-full ${selectedUser?._id === user._id ? "bg-white" : ""}`}
                              onClick={() => {
                                //  scrollToBottom();
                                handleUserClick(user, 1, true)
                              }

                              }
                            >
                              <div className="flex relative">
                                <img className="w-10 h-10 rounded-full mr-4" src={user.data.userId.profileImage} alt={`${user.username}'s profile`} />
                                <div className="items-center flex-1">
                                  <div>
                                    <div className="flex pb-3 justify-between items-center">
                                      <h2 className="text-lg font-bold">{user.data.userId.username}</h2>
                                      {/* <div className="text-xs ms-2">Minimum Daily Order Requirement: { }</div>   */}
                                    </div>
                                    <div className="flex justify-between">
                                      {/* Display last message if available */}
                                      <>
                                        <p className="text-sm">
                                          {/* Show the last message or a placeholder if no message exists */}
                                          {user.data.message
                                            ? user.data.message.length > 20
                                              ? `${user.data.message.slice(0, 20)}...`
                                              : user.data.message
                                            : "No messages yet."
                                          }
                                        </p>
                                      </>
                                      <span className="text-sm text-gray-500">{getLastSeenTime(user.data.updatedAt)}</span>
                                    </div>
                                    {/* Unread Message Count */}
                                    {user.unseen > 0 && (
                                      <span className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {user.unseen}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </>
                }

              </div>
            }

          </div>
        )}
        {selectedUser ? (
          <div className="w-full md:w-2/3 flex flex-col border   rounded-lg  ">

            {isMobile && selectedUser && (
              dispatch(setChatOpen(true)),
              <div className="flex justify-between z-50 items-center p-2 bg-gray-200 border-b">
                <div className="flex items-center">
                  <button
                    className="mr-2 p-2 rounded-full "
                    onClick={() => setSelectedUser(null)}
                    aria-label="Back"
                  >
                    <i className="fa-solid fa-arrow-left text-lg"></i>
                  </button>
                  <img
                    className="w-10 h-10 rounded-full mr-2"

                    src={selectedUser.profileImage}
                    alt={`${selectedUser} avatar`}
                  />
                  <div>
                    <span className="font-bold text-lg">{selectedUser.username}</span>
                    <p className="text-sm text-gray-400" style={{ fontSize: "11px" }}>
                      Last seen: {selectedUser.lastSeen ? new Date(selectedUser.lastSeen).toLocaleString() : "Unavailable"}
                    </p>
                  </div>

                  {/* <button
                  onClick={(e) => handleTagClick(selectedUser.data.userId._id)}
                  {
                  }
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                > */}
                  {/* Toggle color based on 'isInterested' */}
                </div>
                <i
                  onClick={() => handleTagClick(selectedUser._id)}

                  className={`p-2 bg-gray-200 rounded-full hover:bg-gray-300 fa-${isInterested ? 'solid' : 'regular'} fa-bookmark ${isInterested ? 'text-red-500' : ''
                    }`}
                ></i>

                {/* </button> */}

              </div>
            )}
            <div ref={messScrollContainer} onScroll={messageTopScroll} className="chat-messages flex-1 mt-4 ml-2 overflow-y-scroll h-[calc(100vh-160px)] custom-scrollbar">
              {!isMobile && selectedUser && (
                <div className="flex justify-between z-50 bg-gray-200  bg sticky top-0 p-2  items-center mb-2 border rounded-md pb-2">
                  <div className="flex items-center ">
                    <div className="border-r border-gray-300 pr-2">
                      {/* <span className="font-bold ">{selectedUser._id}</span> */}
                      <span><b>{selectedUser?.username}</b></span>
                      {/* <p className="text-sm text-gray-400">Last seen: {userLastSeen[selectedUser._id]}</p> */}
                      {/* <p className="text-sm text-gray-400" style={{ fontSize: "11px" }}> */}
                        {/* Last seen: {selectedUser.lastSeen ? new Date(selectedUser.lastSeen).toLocaleString() : "Unavailable"} */}
                      {/* </p> */}
                    </div>
                    <span className="text-sm text-gray-400 ms-3">Local time: {new Date().toLocaleTimeString()}</span>
                  </div>
                  {/* <button
                                        // onClick={handleTagClick}
                                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                    > */}
                  {/* Toggle color based on 'isInterested' */}
              
                  {/* </button> */}
                </div>
              )
              }
              {[...userMessages].reverse().map((msg, index) => {

                const isCurrentUser = msg.sendBy === "Agent"; // Check if the message is sent by the user
                const profileImage = isCurrentUser ? user?.profileImage : selectedUser?.profileImage; // Display appropriate profile image
                return (
                  <div key={index} className="message mb-4 mt-2 flex items-start"
                  // onClick={() => handleReplyClick(msg)}
                  >
                    <img className="w-8 h-8 rounded-full mr-4" src={profileImage || ""} alt="Profile" />
                    <div>
                      <div className="flex   ">
                        <p className="font-bold me-5">
                          {/* {isCurrentUser ? currentUser.name : selectedUser.name} */}
                          <span className="text-sm text-gray-500">{isCurrentUser ? 'ME' : selectedUser?.username}</span>
                        </p>
                        <span className="me-3">
                          {new Date(msg.typeDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })},{" "}
                          {new Date(msg.typeDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </span>
                      </div>
                      {/* {repliedToMessage && ( ... )} */}


                      {/* Message UI are shown here  */}



                      {msg.type === "text" && <p className="bg-gray-200 p-3 rounded-lg">{msg.message}</p>}
                      {msg.type == "priceMessage" &&
                        <PricMessage data={{
                          amount: msg?.paymentRequest?.amount !== undefined ? String(msg.paymentRequest.amount) : undefined,
                          description: msg?.paymentRequest?.productDescription,
                          customerId: msg.userId || "",
                          accountId: msg.agentId || ""
                        }} />}

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
                            {/* <button onClick={() => handlePayQuote(msg)} className="bg-red-600 text-white px-3 py-1 rounded">Pay Quote</button> */}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />


            </div>
            {/* <button className="ml-2    rounded-lg" onClick={(e) => {

sendMessage("______", selectedUser?.data.userId._id);

}}>Send</button> */}


            <div className="chat-input p-2 flex flex-col items-center relative">
              {/* File Name and Icon (shown above the input) */}
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

              {/* Chat Input and Buttons */}
              <div className="flex items-center border border-gray-300 rounded-lg py-2 w-full">
                <input className="flex-1 p-2   border-none focus:outline-none"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Send a message"
                  onKeyPress={e => {
                    handleKeyPress(e)

                  }}
                />

                <button className="ml-2 rounded-lg" onClick={() => {
                  sendMessage("______", selectedUser?._id, null);
                  scrollToBottom();

                }}>Send</button>

                {!isMobile ? (
                  <>
                    {/* <button
                      onClick={toggleModal}
                      className="ml-2 text-white pr-4 pl-4 bg-red-600 px-4 pt-1 pb-1 rounded-lg"
                    >
                      +Get Paid
                    </button> */}
                    <input type="file" className="hidden " id="file-upload" onChange={handleFileChange} />
                    <label htmlFor="file-upload" className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg mr-2 text-gray-600">
                      <i className="fa-solid fa-folder-plus"></i>
                      {/* {fileName && <span className="text-gray-600">{fileName}</span>} */}
                    </label>
                  </>
                ) : (
                  <div className="relative">
                    <div
                      className="cursor-pointer p-2 bg-gray-200 rounded-full"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <i className="fa-solid fa-caret-down"></i>
                    </div>
                    {isOpen && (
                      <div className="absolute bottom-full -right-[100px] mb-2 w-48 bg-white rounded-md shadow-lg">
                        <ul>
                          <li className="py-2 hover:bg-gray-100 cursor-pointer">
                            <button
                              onClick={toggleModal}
                              className="ml-2 text-white pl-4 bg-red-600 px-4 pt-1 pb-1 rounded-lg"
                            >
                              +Get Paid
                            </button>
                          </li>
                          <li className="px-3   hover:bg-gray-100  cursor-pointer">
                            <input type="file" className="hidden" id="file-upload" onChange={handleFileChange} />
                            <label htmlFor="file-upload" className="cursor-pointer bg-gray-200 px-4 py-2 rounded-lg mr-2 text-gray-600 flex items-center">
                              <i className="fa-solid fa-folder-plus mr-2"></i>
                              Upload
                            </label>
                          </li>

                        </ul>
                      </div>
                    )}
                  </div>
                )}
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

      <>
        {/* Modal toggle */}
        {/* <button
        onClick={toggleModal} // Handle click to toggle modal
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Toggle modal
      </button> */}

        {/* Main modal */}

        {isModalOpen && (
          <div
            tabIndex={-1}
            aria-hidden="true"
            className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-center w-full h-full bg-black bg-opacity-50"
          >
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add Amount Details
                  </h3>
                  <button onClick={toggleModal} className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg w-8 h-8">
                    {/* Close icon */}
                    <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1l6 6m0 0l6 6M7 7L1 1m6 6l6-6" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 md:p-5">
                  <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Price input */}
                    <div>
                      <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Amount
                      </label>
                      <input
                        type="number"
                        id="price"
                        // Capture price input
                        className="bg-gray-50 border text-gray-900 rounded-lg p-2.5 w-full"
                        placeholder="Enter price"
                        {...register("price", { required: true })}
                      />
                      {errors.price && <span className="text-red-500">Price is required</span>}
                    </div>
                    {/* Description input */}
                    <div>
                      <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Description
                      </label>
                      <textarea
                        id="description"
                        // Capture description input
                        className="bg-gray-50 border text-gray-900 rounded-lg p-2.5 w-full"
                        placeholder="Enter description"
                        rows={4}
                        {...register("description", { required: true })}
                      />
                      {errors.description && <span className="text-red-500">Description is required</span>}
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      className="text-white bg-red-600 px-4 py-1 rounded-lg"
                    // onClick={() => {

                    //   let str = "Description:" + description + "___Price:" + price;


                    // }}  // Trigger sendMessage on click
                    >
                      + Get Paid
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </>


    </div>
  );
}
