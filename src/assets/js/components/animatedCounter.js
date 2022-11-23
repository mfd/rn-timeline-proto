"use strict";

/**
 * Число анимируется в виде адометра
 * Используется odometer.js
 * Для блока с числом нужен класс odometer.
 * В data-init-num пишем число,
 * которое должно первым появится в блоке (можно управлять через админку)
 */

import Odometer from 'odometer';

class AnimatedCounter {
    constructor() {
      this.dataName = {
        initNum: 'init-num'
      }

      this.className = {
        odometer: 'odometer'
      }
      this.init(document.querySelector('.history'));
    }

    init($container){
        let numbersElements = $container.getElementsByClassName(`${this.className.odometer}`);
        if (!numbersElements.length) return false;
        Array.from(numbersElements).forEach((number) => {
          const initNum = number.getAttribute(`data-${this.dataName.initNum}`);
          let odometer = new Odometer({
            el: number,
          });
          odometer.options = {
            format: 'd'
          };
          odometer.update(initNum);
        })
    };
};

export default AnimatedCounter;
