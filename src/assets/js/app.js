import svg4everybody from 'svg4everybody';

import sayHello from "./utils/say-hello";

import GalSlider from './components/galsSlider';
import AnimatedCounter from './components/animatedCounter';

sayHello();

class App {
    constructor() {
        
    }
    ready() {
        svg4everybody();
    }
}

new App();

new GalSlider();
new AnimatedCounter();

