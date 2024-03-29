console.log('# routes1')

// Layout Types
import { DefaultLayout,Nohf,Nof } from '#c/layouts/index';

// Route Views
import Profile from '#c/views/Profile';
import Link from '#c/views/Link';
import PlaceOrder from '#c/views/PlaceOrder';
import Product from '#c/views/Product';
import Post from '#c/views/Post';
import Page from '#c/views/Page';
import Home from '#c/views/Home';
import Login from '#c/views/Login';
import MyOrders from '#c/views/MyOrders';
import OrderDetails from '#c/views/OrderDetails';
import SubmitOrder from '#c/views/SubmitOrder';
import Transaction from '#c/views/Transaction';
import Transactions from '#c/views/Transactions';
import Checkout from '#c/views/Checkout';
import Order from '#c/views/Order';
import Test from '#c/views/Test';
import Best from '#c/views/Best';
import Wishlist from "./views/Wishlist";
import _404 from "./views/_404";
export default [
    {
        path: '/',
        exact: true,
        layout: Nohf,
        // element: () => <Navigate to="/blog-posts" />
        element: Home,
    },
    {
        path: '/best',
        exact: true,
        layout: DefaultLayout,
        element: Best,
    },
    {
        path: '/Wishlist',
        exact: true,
        layout: DefaultLayout,
        element: Wishlist,
    },
    {
        path: '/test',
        exact: true,
        layout: Nof,
        element: Test,
    },
    {
        path: '/category/:_id/:name',
        exact: true,
        layout: DefaultLayout,
        element: Home,
    },
    {
        path: '/category/:_id/:name/:bowl',
        exact: true,
        layout: DefaultLayout,
        element: Home,
    },
    {
        path: '/model/:_id/:name/:bowl',
        exact: true,
        layout: DefaultLayout,
        element: Home,
    },

    {
        path: '/profile',
        layout: DefaultLayout,
        element: Profile,
    },
    {
        path: '/my-orders',
        layout: DefaultLayout,
        element: MyOrders,
    },
    {
        path: '/order-details/:_id',
        layout: DefaultLayout,
        element: OrderDetails,
    },
    {
        path: '/order/:_id',
        layout: DefaultLayout,
        element: Order,
    },
    {
        path: '/link/:_id',
        layout: DefaultLayout,
        element: Link,
    },
    {
        path: '/customer/link/:_id',
        layout: DefaultLayout,
        element: Link,
    },
    {
        path: '/customer/transaction/order/:_token/:_id',
        layout: DefaultLayout,
        element: PlaceOrder,
    },

    {
        path: '/p/:_id/:title',
        layout: DefaultLayout,
        exact: true,
        element: Product,
    },
    {
        path: '/p/:_id/:title/:bowl',
        layout: DefaultLayout,
        exact: true,
        element: Product,
    },
    {
        path: '/post/:_id/:title/:bowl',
        layout: DefaultLayout,
        exact: true,
        element: Post,
    },
    {
        path: '/post/:_id/:title',
        layout: DefaultLayout,
        exact: true,
        element: Post,
    },
    {
        path: '/post/:_id',
        layout: DefaultLayout,
        exact: true,
        element: Post,
    },
    {
        path: '/login',
        layout: DefaultLayout,
        element: Login,
    },
    {
        path: '/login/:_state',
        layout: DefaultLayout,
        element: Login,
    },
    {
        path: '/privacy-policy',
        layout: DefaultLayout,
        element: Page,
    },
    {
        path: "/transactions",
        layout: DefaultLayout,
        element: Transactions
    },
    {
        path: "/transaction",
        layout: DefaultLayout,
        element: Transaction
    },
    {
        path: "/customer/transaction/order/:_token/:_id",
        layout: DefaultLayout,
        element: PlaceOrder
    },
    {
        path: "/submit-order",
        exact: true,
        layout: DefaultLayout,
        element: SubmitOrder
    },
    {
        path: "/submit-order/:_id",
        exact: true,
        layout: DefaultLayout,
        element: SubmitOrder
    },
    {
        path: "/checkout",
        exact: true,
        layout: Nof,
        element: Checkout
    },
    {
        path: "/:_id",
        exact: true,
        layout: DefaultLayout,
        element: Page
    },
    {
        path: '/:_firstCategory/:_product_slug/',
        layout: DefaultLayout,
        exact: true,
        element: Product,
    },
];
