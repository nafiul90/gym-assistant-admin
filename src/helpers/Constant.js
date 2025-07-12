// const API_VERSION = "1.0.0";
export const SITE_NAME = "GMS Admin";
export const CURRENCY = "৳";
// export const ROOT_URL = "http://localhost:8087";
// export const ROOT_URL = "http://localhost:3001/api/v/1.0.0";
export const ROOT_URL = "https://api.gymassistant.xyz/api/v/1.0.0";
export const IMAGE_URL = `https://api.gymassistant.xyz`;
export const FILE_URL = `https://api.gymassistant.xyz`;

const API_URL = `${ROOT_URL}`;

export const UPLOAD_IMAGE_URL = `${API_URL}/upload-image`;
export const UPLOAD_FILE_URL = `${API_URL}/upload-file`;

// auth
export const LOGIN_URL = `${API_URL}/auth/login`;
export const REFRESH_TOKEN = `${API_URL}/login/refresh-token`;
export const SWITCH_GYM = `${API_URL}/users/switch-gym`;

// user
export const GET_ALL_USER = `${API_URL}/users`;
export const GET_USER_PROFILE = `${API_URL}/users/profile`;
export const GET_USER_BY_ID = `${API_URL}/users/id`;
export const CREATE_USER_URL = `${API_URL}/users/create`;
export const UPDATE_USER_URL = `${API_URL}/users/update`;
export const CHANGE_PASSWORD_URL = `${API_URL}/users/change-user-password`;
export const DELETE_USER_URL = `${API_URL}/users/delete`;
export const UPLOAD_PROFILE_IMAGE = `${API_URL}/upload/profile-image`;

// static page
export const GET_ALL_STATIC_PAGES = `${API_URL}/static-page`;
export const GET_STATIC_PAGE_BY_ID = `${API_URL}/static-page/id`;
export const CREATE_STATIC_PAGE_URL = `${API_URL}/static-page/create`;
export const UPDATE_STATIC_PAGE_URL = `${API_URL}/static-page/update`;
export const DELETE_STATIC_PAGE_URL = `${API_URL}/static-page/delete`;
export const UPLOAD_STATIC_PAGE_IMAGE_URL = `${API_URL}/upload-image`;

// site config
export const GET_ALL_SITE_CONFIGS = `${API_URL}/global-configs`;
export const GET_SITE_CONFIG_BY_ID = `${API_URL}/global-configs/id`;
export const CREATE_SITE_CONFIG_URL = `${API_URL}/global-configs/create`;
export const UPDATE_SITE_CONFIG_URL = `${API_URL}/global-configs/update`;
export const DELETE_SITE_CONFIG_URL = `${API_URL}/global-configs/delete`;
export const UPLOAD_SITE_CONFIG_LOGO_URL = `${API_URL}/upload-image`;

// book
export const GET_ALL_BOOK = `${API_URL}/book`;
export const GET_BOOK_BY_ID = `${API_URL}/book/id`;
export const CREATE_BOOK_URL = `${API_URL}/book/create`;
export const UPDATE_BOOK_URL = `${API_URL}/book/update`;
export const DELETE_BOOK_URL = `${API_URL}/book/delete`;

// bookOrder
export const GET_ALL_BOOKORDER = `${API_URL}/book-orders`;
export const GET_BOOKORDER_BY_ID = `${API_URL}/book-orders/id`;
export const CREATE_BOOKORDER_URL = `${API_URL}/book-orders/create`;
export const UPDATE_BOOKORDER_URL = `${API_URL}/book-orders/update`;
export const DELETE_BOOKORDER_URL = `${API_URL}/book-orders/delete`;
// gym

export const GET_ALL_GYM = `${API_URL}/gyms`;
export const GET_GYM_BY_ID = `${API_URL}/gyms/id`;
export const CREATE_GYM_URL = `${API_URL}/gyms/create`;
export const UPDATE_GYM_URL = `${API_URL}/gyms/update`;
export const DELETE_GYM_URL = `${API_URL}/gyms/delete`;
export const CHECK_DEVICES_URL = `${API_URL}/users/check-devices`;
export const CHECK_EXPIRED_USERS_DEVICES_STATUS_URL = `${API_URL}/users/check-expired-users-device-status`;
export const NOT_EXPIRED_NOT_ACTIVE = `${API_URL}/users/not-expired-not-active`;
export const ENABLE_MISSING_USERS_API = `${API_URL}/users/enable-missing-users`;
// invoice

export const GET_ALL_INVOICE = `${API_URL}/invoice`;
export const GET_INVOICE_BY_ID = `${API_URL}/invoice/id`;
export const CREATE_INVOICE_URL = `${API_URL}/invoice/create`;
export const UPDATE_INVOICE_URL = `${API_URL}/invoice/update`;
export const DELETE_INVOICE_URL = `${API_URL}/invoice/delete`;
export const DOWNLOAD_INVOICE_URL = `${API_URL}/invoice/download`;
// gymPayment

export const GET_ALL_GYMPAYMENT = `${API_URL}/gymPayment`;
export const GET_GYMPAYMENT_BY_ID = `${API_URL}/gymPayment/id`;
export const CREATE_GYMPAYMENT_URL = `${API_URL}/gymPayment/create`;
export const UPDATE_GYMPAYMENT_URL = `${API_URL}/gymPayment/update`;
export const DELETE_GYMPAYMENT_URL = `${API_URL}/gymPayment/delete`;

export const DISABLE_ALL_EXPIRED_USER = `${API_URL}/users/disable-all-expired-users-fingerprint`;

// device

export const GET_ALL_DEVICE_USERS = `${API_URL}/device/all-users`;
export const GET_DEVICE_BY_ID = `${API_URL}/device/id`;
export const CREATE_DEVICE_URL = `${API_URL}/device/create`;
export const UPDATE_DEVICE_URL = `${API_URL}/device/update`;
export const DELETE_DEVICE_URL = `${API_URL}/device/delete`;
// smsRecords

export const GET_ALL_SMSRECORDS = `${API_URL}/sms-records`;
export const GET_SMSRECORDS_BY_ID = `${API_URL}/sms-records/id`;
export const CREATE_SMSRECORDS_URL = `${API_URL}/sms-records/create`;
export const UPDATE_SMSRECORDS_URL = `${API_URL}/sms-records/update`;
export const DELETE_SMSRECORDS_URL = `${API_URL}/sms-records/delete`;

export const EXTENDED_USER_API_URL = `${API_URL}/payments/extended-users`;
export const USER_WITH_NO_PAYMENT_API_URL = `${API_URL}/payments/users-with-no-payment`;

// CONSTANT_EXPORTS_AREA
export const ACCESS_TOKEN = "x-auth-token";
export const PROFILE = "e-book-profile";
export const ORDER_STATE_COLOR = {
    INITIATED: "",
    SUPPLIER_ACCEPTED: "cyan",
    DELIVERY_MAN_PICKED: "blue",
    COMPLETED: "green",
    CANCELED: "red",
};
export const GENDER_COLOR = {
    MALE: "blue",
    FEMALE: "green",
    OTHERS: "purple",
};
export const COMPANY = {
    name: "URELAA",
    address: "Dhaka Division, Bangladesh",
};
export const BACK_BUTTON_COLOR = "#3390FF";
// end
