import { lazy } from "react";
import ChatPage from "../components/pages/chat/ChatPage";
import Permission from "../helpers/Permission";
import * as PATH from "./Slugs";
const ProfileDetails = lazy(
    () => import("../components/pages/profile/ProfileDetails"),
);
const Dashboard = lazy(() => import("../components/pages/dashboard/dashboard"));
// user
const UserListView = lazy(
    () => import("../components/pages/user/UserListView"),
);
const AddUser = lazy(() => import("../components/pages/user/AddUser"));
const EditUser = lazy(() => import("../components/pages/user/EditUser"));

// static page
const StaticPageListView = lazy(
    () => import("../components/pages/static_page/StaticPageListView"),
);
const AddStaticPage = lazy(
    () => import("../components/pages/static_page/AddStaticPage"),
);
const EditStaticPage = lazy(
    () => import("../components/pages/static_page/EditStaticPage"),
);

// site config
const SiteConfigListView = lazy(
    () => import("../components/pages/site_config/SiteConfigListView"),
);
const AddSiteConfig = lazy(
    () => import("../components/pages/site_config/AddSiteConfig"),
);
const EditSiteConfig = lazy(
    () => import("../components/pages/site_config/EditSiteConfig"),
);

// book list
const BookListView = lazy(
    () => import("../components/pages/book/BookListView"),
);
const AddBook = lazy(() => import("../components/pages/book/AddBook"));
const EditBook = lazy(() => import("../components/pages/book/EditBook"));

// book order
const BookOrderListView = lazy(
    () => import("../components/pages/bookorder/BookOrderListView"),
);
const AddBookOrder = lazy(
    () => import("../components/pages/bookorder/AddBookOrder"),
);
const EditBookOrder = lazy(
    () => import("../components/pages/bookorder/EditBookOrder"),
);
const GymListView = lazy(() => import("../components/pages/gym/GymListView"));
const AddGym = lazy(() => import("../components/pages/gym/AddGym"));
const EditGym = lazy(() => import("../components/pages/gym/EditGym"));
const InvoiceListView = lazy(
    () => import("../components/pages/invoice/InvoiceListView"),
);
const AddInvoice = lazy(() => import("../components/pages/invoice/AddInvoice"));
const EditInvoice = lazy(
    () => import("../components/pages/invoice/EditInvoice"),
);
const GymPaymentListView = lazy(
    () => import("../components/pages/gympayment/GymPaymentListView"),
);
const AddGymPayment = lazy(
    () => import("../components/pages/gympayment/AddGymPayment"),
);
const EditGymPayment = lazy(
    () => import("../components/pages/gympayment/EditGymPayment"),
);
const DeviceListView = lazy(
    () => import("../components/pages/device/DeviceListView"),
);
const AddDevice = lazy(() => import("../components/pages/device/AddDevice"));
const EditDevice = lazy(() => import("../components/pages/device/EditDevice"));
const SmsRecordsListView = lazy(
    () => import("../components/pages/smsrecords/SmsRecordsListView"),
);
const AddSmsRecords = lazy(
    () => import("../components/pages/smsrecords/AddSmsRecords"),
);
const EditSmsRecords = lazy(
    () => import("../components/pages/smsrecords/EditSmsRecords"),
);
const PaymentsListView = lazy(
    () => import("../components/pages/payments/PaymentsListView"),
);
const AddPayments = lazy(
    () => import("../components/pages/payments/AddPayments"),
);
const EditPayments = lazy(
    () => import("../components/pages/payments/EditPayments"),
);
const PartnerListView = lazy(
    () => import("../components/pages/partner/PartnerListView"),
);
const AddPartner = lazy(() => import("../components/pages/partner/AddPartner"));
const EditPartner = lazy(
    () => import("../components/pages/partner/EditPartner"),
);
const BusinessExpenseListView = lazy(() =>
    import("../components/pages/businessexpense/BusinessExpenseListView")
);
const AddBusinessExpense = lazy(() =>
    import("../components/pages/businessexpense/AddBusinessExpense")
);
const EditBusinessExpense = lazy(() =>
    import("../components/pages/businessexpense/EditBusinessExpense")
);
// ROUTE_IMPORTS_AREA

const AppRoutes = [
    {
        path: PATH.PROFILE_PATH,
        exact: true,
        isPrivate: false,
        component: ProfileDetails,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.DASHBOARD_PATH,
        exact: true,
        isPrivate: false,
        component: Dashboard,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.CHAT_PAGE_PATH}`,
        exact: true,
        isPrivate: false,
        component: ChatPage,
        permissions: [Permission.ALL],
    },
    // user
    {
        path: PATH.USER_LIST_PATH,
        exact: true,
        isPrivate: false,
        component: UserListView,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.ADD_USER_PATH,
        exact: true,
        isPrivate: false,
        component: AddUser,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.EDIT_USER_PATH}/:id`,
        exact: true,
        isPrivate: false,
        component: EditUser,
        permissions: [Permission.ALL],
    },
    // Static page
    {
        path: PATH.STATIC_PAGE_LIST_PATH,
        exact: true,
        isPrivate: false,
        component: StaticPageListView,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.ADD_STATIC_PAGE_PATH,
        exact: true,
        isPrivate: false,
        component: AddStaticPage,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.EDIT_STATIC_PAGE_PATH}/:id`,
        exact: true,
        isPrivate: false,
        component: EditStaticPage,
        permissions: [Permission.ALL],
    },
    // site config
    {
        path: PATH.SITE_CONFIG_LIST_PATH,
        exact: true,
        isPrivate: false,
        component: SiteConfigListView,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.ADD_SITE_CONFIG_PATH,
        exact: true,
        isPrivate: false,
        component: AddSiteConfig,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.EDIT_SITE_CONFIG_PATH}/:id`,
        exact: true,
        isPrivate: false,
        component: EditSiteConfig,
        permissions: [Permission.ALL],
    },
    // book list
    {
        path: PATH.BOOK_LIST_PATH,
        exact: true,
        isPrivate: false,
        component: BookListView,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.ADD_BOOK_PATH,
        exact: true,
        isPrivate: false,
        component: AddBook,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.EDIT_BOOK_PATH}/:id`,
        exact: true,
        isPrivate: false,
        component: EditBook,
        permissions: [Permission.ALL],
    },
    // book order
    {
        path: PATH.BOOKORDER_LIST_PATH,
        exact: true,
        isPrivate: false,
        component: BookOrderListView,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.ADD_BOOKORDER_PATH,
        exact: true,
        isPrivate: false,
        component: AddBookOrder,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.EDIT_BOOKORDER_PATH}/:id`,
        exact: true,
        isPrivate: false,
        component: EditBookOrder,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.GYM_LIST_PATH,
        exact: true,
        isPrivate: false,
        component: GymListView,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.ADD_GYM_PATH,
        exact: true,
        isPrivate: false,
        component: AddGym,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.EDIT_GYM_PATH}/:id`,
        exact: true,
        isPrivate: false,
        component: EditGym,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.INVOICE_LIST_PATH,
        exact: true,
        isPrivate: false,
        component: InvoiceListView,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.ADD_INVOICE_PATH,
        exact: true,
        isPrivate: false,
        component: AddInvoice,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.EDIT_INVOICE_PATH}/:id`,
        exact: true,
        isPrivate: false,
        component: EditInvoice,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.GYMPAYMENT_LIST_PATH,
        exact: true,
        isPrivate: false,
        component: GymPaymentListView,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.ADD_GYMPAYMENT_PATH}/:invoice`,
        exact: true,
        isPrivate: false,
        component: AddGymPayment,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.EDIT_GYMPAYMENT_PATH}/:id`,
        exact: true,
        isPrivate: false,
        component: EditGymPayment,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.DEVICE_LIST_PATH}/:gym`,
        exact: true,
        isPrivate: false,
        component: DeviceListView,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.ADD_DEVICE_PATH,
        exact: true,
        isPrivate: false,
        component: AddDevice,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.EDIT_DEVICE_PATH}/:id`,
        exact: true,
        isPrivate: false,
        component: EditDevice,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.SMSRECORDS_LIST_PATH,
        exact: true,
        isPrivate: false,
        component: SmsRecordsListView,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.ADD_SMSRECORDS_PATH,
        exact: true,
        isPrivate: false,
        component: AddSmsRecords,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.EDIT_SMSRECORDS_PATH}/:id`,
        exact: true,
        isPrivate: false,
        component: EditSmsRecords,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.PAYMENTS_LIST_PATH,
        exact: true,
        isPrivate: false,
        component: PaymentsListView,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.ADD_PAYMENTS_PATH,
        exact: true,
        isPrivate: false,
        component: AddPayments,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.EDIT_PAYMENTS_PATH}/:id`,
        exact: true,
        isPrivate: false,
        component: EditPayments,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.PARTNER_LIST_PATH,
        exact: true,
        isPrivate: false,
        component: PartnerListView,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.ADD_PARTNER_PATH,
        exact: true,
        isPrivate: false,
        component: AddPartner,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.EDIT_PARTNER_PATH}/:id`,
        exact: true,
        isPrivate: false,
        component: EditPartner,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.BUSINESSEXPENSE_LIST_PATH,
        exact: true,
        isPrivate: false,
        component: BusinessExpenseListView,
        permissions: [Permission.ALL],
    },
    {
        path: PATH.ADD_BUSINESSEXPENSE_PATH,
        exact: true,
        isPrivate: false,
        component: AddBusinessExpense,
        permissions: [Permission.ALL],
    },
    {
        path: `${PATH.EDIT_BUSINESSEXPENSE_PATH}/:id`,
        exact: true,
        isPrivate: false,
        component: EditBusinessExpense,
        permissions: [Permission.ALL],
    },
    

    // ROUTE_DECLARATION_AREA
];
export default AppRoutes;
