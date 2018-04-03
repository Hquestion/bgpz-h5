import Home from '../pages/Home';
import Test from '../pages/Test';
import Frame from '../Frame';
import Login from '../pages/Login';
import RestaurantList from '../pages/RestaurantList';
import FoodCart from '../pages/FoodCart';

const routerCfg = [
    {
        path: '/',
        name: 'Frame',
        component: Frame,
        children: [{
            path: '',
            name: 'Home',
            component: Home
        }, {
            path: '/test',
            name: 'Test',
            component: Test
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
    }
];

export default routerCfg;
