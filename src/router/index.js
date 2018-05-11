import Home from '../pages/Home';
import Test from '../pages/Test';
import Frame from '../Frame';
import Login from '../pages/Login';
import RestaurantList from '../pages/RestaurantList';
import FoodCart from '../pages/FoodCart';
import Activity from '../pages/Activity';
import Party from '../pages/Party';
import PartyDetail from '../pages/PartyDetail';
import JoinParty from '../pages/JoinParty';
import Pay from '../pages/Pay';
import PaySuccess from '../pages/PaySuccess';
import CreateParty from '../pages/CreateParty';
import AddressList from '../pages/AddressList';
import EditAddress from '../pages/EditAddress';
import ShareParty from '../pages/ShareParty';

const routerCfg = [
    {
        path: '/',
        component: Frame,
        children: [{
            path: '',
            name: 'Home',
            component: Home,
            meta: {
                routeName: '首页'
            }
        }, {
            path: '/party',
            name: 'Party',
            component: Party,
            meta: {
                routeName: '聚会'
            }
        }, {
            path: '/shop',
            name: 'Shop',
            component: Test,
            meta: {
                routeName: '商城'
            }
        }]
    }, {
        path: '/login',
        name: 'Login',
        component: Login
    }, {
        path: '/restaurant-list',
        name: 'RestaurantList',
        component: RestaurantList
    }, {
        path: '/food-cart',
        name: 'FoodCart',
        component: FoodCart
    }, {
        path: '/activity',
        name: 'Activity',
        component: Activity
    }, {
        path: '/party-detail/:id',
        name: 'PartyDetail',
        component: PartyDetail
    }, {
        path: '/join-party/:id',
        name: 'JoinParty',
        component: JoinParty
    }, {
        //:type 由支付项目类型和id组成，用@符号连接。如：'party@123'
        path: '/pay/:type/:id/:money',
        name: 'Pay',
        component: Pay
    }, {
        //:type 由支付项目类型和id组成，用@符号连接。如：'party@123'
        path: '/pay-success/:type/:id',
        name: 'PaySuccess',
        component: PaySuccess
    }, {
        path: '/create-party',
        name: 'CreateParty',
        component: CreateParty
    }, {
        path: '/address-list',
        name: 'AddressList',
        component: AddressList
    }, {
        path: '/edit-address',
        name: 'EditAddress',
        component: EditAddress
    }, {
        path: '/share-party/:id',
        name: 'ShareParty',
        component: ShareParty
    }
];

export default routerCfg;
