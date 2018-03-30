import Home from '../pages/Home';
import Test from '../pages/Test';

const routerCfg = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/test',
        name: 'Test',
        component: Test
    }
];

export default routerCfg;
