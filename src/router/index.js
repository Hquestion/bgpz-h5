import Home from '../pages/Home';
import Test from '../pages/Test';
import Frame from '../Frame';
import Login from '../pages/Login';

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
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    }
];

export default routerCfg;
