import axios from "axios";
import Cookies from "js-cookie";

interface FilterData {
  page?: number | string | null;
  search?: string | number | null;
}

const API_URL = process.env.NEXT_PUBLIC_REACT_APP_BASEURL;

interface SigninApi {
  email: string;
  password?: string;
}

export const signinApi = async (value: SigninApi) => {
  console.log(value);
  console.log(API_URL);
  console.log("fffffffffffffffffffffffffffddddddddddddddddddddddddddddddddddddddddd")
  try {
    const response = await axios.post(`${API_URL}/apis/user/login`, value);
    return response;
  } catch (error) {
    return error;
  }
};

interface SignupApi {
  email: string | null;
  password?: string | null;
  username: string | null;
  profileImage?: string | null;
  name: string | null;
  phone?: string | null; // Mark phone as optional
}

export const signupApi = async (value: SignupApi) => {
  try {
    const requestData = { ...value }; // Copy value to avoid mutation
    if (!requestData.phone) {
      delete requestData.phone; // Remove phone if it's an empty string or undefined
    }

    const response = await axios.post(
      `${API_URL}/apis/user/create`,
      requestData
    );
    return response;
  } catch (error) {
    return error;
  }
};

interface SigninAgentApi {
  name?: string | null;
  email?: string | null;
  password?: string | null;
}

export const signinAgentApi = async (value: SigninAgentApi) => {
  try {
    const response = await axios.post(`${API_URL}/apis/agent/login`, value);
    return response;
  } catch (error) {
    return error;
  }
};

interface SignupAgentApi {
  email?: string | null;
  password?: string | null;
  name?: string | null;
  phone?: string | null; // Mark phone as optional
  agentType?: string | null;
  profileImage?: string | null; // Mark profileImage as optional
  agentStatus?: string | null; // Mark agentStatus as optional
}

export const signupAgentApi = async (value: SignupAgentApi) => {
  try {
    if (value.phone === "") {
      delete value.phone;
    }
    const response = await axios.post(`${API_URL}/apis/agent/create`, value);
    return response;
  } catch (error) {
    return error;
  }
};

interface ForgetPasswordApi {
  email: string;
  link: string;
}

export const forgetPasswordApi = async (value: ForgetPasswordApi) => {
  try {
    value.link = `${process.env.NEXT_PUBLIC_FRONT_END_BASEURL}/reset-password`;
    const response = await axios.post(
      `${API_URL}/apis/user/forgetPassword`,
      value
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const forgetPasswordAgentApi = async (value: ForgetPasswordApi) => {
  try {
    value.link = `${process.env.NEXT_PUBLIC_FRONT_END_BASEURL}/agent/auth/reset-password`;
    const response = await axios.post(
      `${API_URL}/apis/agent/forgetPassword`,
      value
    );
    return response;
  } catch (error) {
    return error;
  }
};



interface ResetPasswordApi {
  password: string;
  confirmPassword: string;
  token: string;
}

export const resetPasswordApi = async (value: ResetPasswordApi) => {
  try {
    const response = await axios.post(
      `${API_URL}/apis/user/forgetPassword`,
      value
    );
    return response;
  } catch (error) {
    return error;
  }
};

interface UpdatePasswordApi {
  password?: string | null;
  confirmPassword?: string | null;
  token?: string | null;
  id?: string | null;
}

export const updatePasswordApi = async (
  value: UpdatePasswordApi,
  id: string
) => {
  try {
    value.id = id;
    const response = await axios.post(
      `${API_URL}/apis/user/updatePassword`,
      value
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const updatePasswordAgentApi = async (value: UpdatePasswordApi, id: string) => {
  try {
    value.id = id;
    const response = await axios.post(
      `${API_URL}/apis/agent/updatePassword`,
      value
    );
    return response;
  } catch (error) {
    return error;
  }
};


interface Agent {
  username?: string | null;
  paymentId?: string | null;
  countryCode?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  companyRole?: string | null;
  warehouseLocation?: string | null;
  warehouseSize?: string | null;
  warehouse?: number | null;
  orderPerDay?: number | null;
  currentOrder?: number | null;
  maxOrder?: number | null;
  city?: string | null;
  timeToMax?: string | null;
  customer?: number | null;
  profileImage?: File | string | null;
  coverImage?: File | string | null;
  about?: string | null;
  headline?: string | null;
  experience?: string | null;
  email?: string | null; // Required and unique
  phone?: string | null;
  catchphrase?: string | null;
  password?: string | null; // Required
}

export const updateAgentdApi = async (value: Agent) => {
  const cookies = Cookies.get("agentAccess");
  const config = {
    headers: {
      Authorization: `Bearer ${cookies}`,
    },
  };

  try {
    const response = await axios.post(
      `${API_URL}/apis/agent/update`,
      value,
      config
    );

    console.log(response);

    return response;
  } catch (error) {
    return error;
  }
};
export const updateAgentFormApi = async (value: FormData) => {
  const cookies = Cookies.get("agentAccess");
  const config = {
    headers: {
      Authorization: `Bearer ${cookies}`,
    },
  };

  try {
    const response = await axios.post(
      `${API_URL}/apis/agent/update`,
      value,
      config
    );

    console.log(response);

    return response;
  } catch (error) {
    return error;
  }
};

export const updateAgentFormdApi = async (value: FormData) => {
  const cookies = Cookies.get("agentAccess");
  const config = {
    headers: {
      Authorization: `Bearer ${cookies}`,
      'Content-Type': 'multipart/form-data'
    },
  };

  try {
    const response = await axios.post(
      `${API_URL}/apis/agent/update`,
      value,
      config
    );

    console.log(response);

    return response;
  } catch (error) {
    return error;
  }
};

export const updateDropshipperApi = async (value: FormData) => {
  const cookies = Cookies.get("access");
  const config = {
    headers: {
      Authorization: `Bearer ${cookies}`,
    },
  };

  try {
    const response = await axios.post(
      `${API_URL}/apis/user/update`,
      value,
      config
    );

    console.log(response);

    return response;
  } catch (error) {
    return error;
  }
};

export const AgentdGetApi = async () => {
  const cookies = Cookies.get("agentAccess");
  const config = {
    headers: {
      Authorization: `Bearer ${cookies}`,
    },
  };

  try {
    const response = await axios.get(`${API_URL}/apis/agent/get`, config);

    console.log(response);

    return response;
  } catch (error) {
    return error;
  }
};
export const DropShipperGetApi = async () => {
  const cookies = Cookies.get("access");
  const config = {
    headers: {
      Authorization: `Bearer ${cookies}`,
    },
  };

  try {
    const response = await axios.get(`${API_URL}/apis/user/get`, config);

    console.log(response);

    return response;
  } catch (error) {
    return error;
  }
};

// interface Product {
//   orderPerDay?: string;
//   platform?: string;
//   imageLink?: string;
//   image?: string;
//   type?: string;
//   quotationCount?: number; // Default is 0
//   token?: string; // Default is 0
//   destination?: string;
//   note?: string;
//   productName?: string;
//   userId?: string; // Referencing the User model
// }

interface filterdata {
  minOrderPerDay: number;
  maxOrderPerDay: number;
  platform: string;
  destination: string;
  startDate: string;
  endDate: string;
}

export const fetchProducts = async (params: filterdata) => {
  const cookies = Cookies.get("agentAccess");
  const config = {
    headers: {
      Authorization: `Bearer ${cookies}`,
    },
  };

  try {
    const response = await axios.get(`${API_URL}/apis/product/getAllByAgent`, {
      params: {
        maxOrderPerDay: params.maxOrderPerDay || 20,
        minOrderPerDay: params.minOrderPerDay || 0,
        platform: params.platform || "",
        destination: params.destination || "",
        startDate: params.startDate || new Date().toISOString().split("T")[0],
        endDate: params.endDate || new Date().toISOString().split("T")[0],
      },
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProductsRank = async (params: QuotationData) => {
  const cookies = Cookies.get("agentAccess");
  const config = {
    headers: {
      Authorization: `Bearer ${cookies}`,
    },
  };

  try {
    const response = await axios.get(`${API_URL}/apis/rank/getAllByAgentState/${params.type}`, {
      params: {
        page:1,
        maxOrderPerDay: params.maxOrderPerDay || 20,
        minOrderPerDay: params.minOrderPerDay || 0,
        platform: params.platform || "",
        destination: params.destination || "",
        startDate: params.startDate || new Date().toISOString().split("T")[0],
        endDate: params.endDate || new Date().toISOString().split("T")[0],
      },
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const customerQuotesViewApi = async (
  value: FilterData,
  id: string | null | undefined
) => {
  console.log(id, value);

  try {
    const response = await axios.get(`${API_URL}/apis/quotation/getAll/${id}`);

    console.log(response);

    return response;
  } catch (error) {
    return error;
  }
};

interface SigninAgentApiNew {
  name: string | null;
  email: string | null;
  image: string | null;
}

interface SigninAgentApiNew2 {
  firstname: string | null;
  email: string | null;
  image: string | null;
}

export const googleApi = async (value: SigninAgentApiNew) => {
  try {
    const response = await axios.post(`${API_URL}/apis/user/getEmail`, value);
    console.log(response);

    return response;
  } catch (error) {
    return error;
  }
};

export const agentgoogleApi = async (value: SigninAgentApiNew2) => {
  try {
    const response = await axios.post(`${API_URL}/apis/agent/getEmail`, value);
    console.log(response);

    return response;
  } catch (error) {
    return error;
  }
};

export const uploadProductApi = async (formData: FormData) => {
  try {
    const cookies = Cookies.get("access");

    console.log(cookies);
    console.log(formData);

    const config = {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    };
    const response = await axios.post(
      `${API_URL}/apis/product/create`,
      formData,
      config
    );

    return response;
  } catch (error) {
    console.error("Error during API request:", error);
    return error;
  }
};

export const getProductApi = async (value: FilterData) => {
  try {
    const cookies = Cookies.get("access");
    const config = {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    };
    const response = await axios.get(
      `${API_URL}/apis/product/getAll?page=${
        value.page ? value.page : 1
      }&search=${value.search && value.search}`,
      config
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getCustomerApi = async (value: FilterData) => {
  try {
    const cookies = Cookies.get("agentAccess");
    const config = {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    };
    const response = await axios.get(
      `${API_URL}/apis/product/getAllByAgent?page=${
        value.page ? value.page : 1
      }&search=${value.search && value.search}`,
      config
    );
    return response;
  } catch (error) {
    return error;
  }
};

interface Quotation {
  quantity: number;
  price: number;
  shippingPickupPrice: number;
  shippingDoorPrice: number;
  totalShippingPickupPrice: number;
  totalShippingDoorPrice: number;
  agentId: string | null;
  userId: string | undefined;
  productId: string | undefined;
}

interface QuotationData {
  type?: string | null;
  page?: number | null;
  search?: string | null;
  minOrderPerDay?: number | null | undefined;
  maxOrderPerDay?: number | null;
  platform?: string | null;
  destination?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export const getCustomerTypeApi = async (value: QuotationData) => {
  try {
    const cookies = Cookies.get("agentAccess");
    console.log("cookies", cookies);

    const config = {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    };
    

    const response = await axios.get(
      `${API_URL}/apis/rank/getAllByAgentState/${value?.type}?page=${
        value.page ? value.page : 1
      }&search=${value.search && value.search}`,
      config
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const AgentQuotationApi = async (value: Quotation) => {
  try {
    const cookies = Cookies.get("agentAccess");
    const config = {
      headers: {
        Authorization: `Bearer ${cookies}`,
      },
    };
    const response = await axios.post(
      `${API_URL}/apis/quotation/create`,
      value,
      config
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const fn_checkToken = async (token: string | null) => {
  try {
    if(token === null) return null;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_URL}/apis/user/verify`, config);
    return response;
  } catch (error) {
    return error;
  }
};
