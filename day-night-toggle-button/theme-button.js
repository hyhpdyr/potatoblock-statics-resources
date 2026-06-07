/* theme-button.js */
(function (global) {
  /**
   * 创建一个主题切换按钮，填满传入的容器元素
   * @param {HTMLElement} container 放置按钮的容器元素
   * @param {Object} [options] 配置项
   * @param {string} [options.initialTheme='light'] 初始主题 'dark' | 'light'
   * @param {function} [options.onChange] 主题变化时的回调，参数为新主题字符串
   * @returns {{ getTheme: () => string, setTheme: (t: string) => void, destroy: () => void, container: HTMLElement }}
   */
  function createThemeButton(container, options = {}) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('必须提供一个有效的 DOM 容器元素');
    }

    // 配置
    const initialTheme = options.initialTheme === 'dark' ? 'dark' : 'light';
    const onChange = options.onChange || null;

    // 容器标记
    container.classList.add('theme-button-container');

    // 内部 HTML
    container.innerHTML = `
      <div class="container">
        <div class="components">
          <div class="main-button">
            <div class="moon"></div>
            <div class="moon"></div>
            <div class="moon"></div>
          </div>
          <div class="daytime-background"></div>
          <div class="daytime-background"></div>
          <div class="daytime-background"></div>
          <div class="cloud">
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
          </div>
          <div class="cloud-light">
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
            <div class="cloud-son"></div>
          </div>
          <div class="stars">
            <div class="star big"><div class="star-son"></div><div class="star-son"></div><div class="star-son"></div><div class="star-son"></div></div>
            <div class="star big"><div class="star-son"></div><div class="star-son"></div><div class="star-son"></div><div class="star-son"></div></div>
            <div class="star medium"><div class="star-son"></div><div class="star-son"></div><div class="star-son"></div><div class="star-son"></div></div>
            <div class="star medium"><div class="star-son"></div><div class="star-son"></div><div class="star-son"></div><div class="star-son"></div></div>
            <div class="star small"><div class="star-son"></div><div class="star-son"></div><div class="star-son"></div><div class="star-son"></div></div>
            <div class="star small"><div class="star-son"></div><div class="star-son"></div><div class="star-son"></div><div class="star-son"></div></div>
          </div>
        </div>
      </div>
    `;

    // 内部元素引用
    const $ = (selector) => {
      const dom = container.querySelectorAll(selector);
      return dom.length === 1 ? dom[0] : dom;
    };

    const mainButton = $('.main-button');
    const daytimeBackground = $('.daytime-background');
    const components = $('.components');
    const cloud = $('.cloud');
    const cloudLight = $('.cloud-light');
    const cloudList = $('.cloud-son');
    const moon = $('.moon');
    const stars = $('.stars');
    const star = $('.star');

    // 状态
    let isMoved = false;         // true 表示当前为暗黑模式
    let isClicked = false;

    // 主题字符串
    let currentTheme = initialTheme === 'dark' ? 'dark' : 'light';

    // 通知外部主题变化
    function dispatchThemeChange(theme) {
      if (currentTheme === theme) return; // 避免重复通知
      currentTheme = theme;

      // 1. 派发自定义事件
      const event = new CustomEvent('change', { detail: theme });
      container.dispatchEvent(event);

      // 2. 调用用户回调
      if (typeof onChange === 'function') {
        onChange(theme);
      }
    }

    // 切换主题的具体逻辑
    function toggleTheme() {
      if (isMoved) {
        // 切换为亮色
        mainButton.style.transform = 'translateX(0)';
        mainButton.style.backgroundColor = 'rgba(255, 195, 35, 1)';
        mainButton.style.boxShadow =
          '3em 3em 5em rgba(0, 0, 0, 0.5), inset -3em -5em 3em -3em rgba(0, 0, 0, 0.5), inset 4em 5em 2em -2em rgba(255, 230, 80, 1)';

        daytimeBackground[0].style.transform = 'translateX(0)';
        daytimeBackground[1].style.transform = 'translateX(0)';
        daytimeBackground[2].style.transform = 'translateX(0)';

        cloud.style.transform = 'translateY(10em)';
        cloudLight.style.transform = 'translateY(10em)';
        components.style.backgroundColor = 'rgba(70, 133, 192, 1)';

        moon[0].style.opacity = '0';
        moon[1].style.opacity = '0';
        moon[2].style.opacity = '0';

        stars.style.transform = 'translateY(-125em)';
        stars.style.opacity = '0';

        dispatchThemeChange('light');
      } else {
        // 切换为暗色
        mainButton.style.transform = 'translateX(110em)';
        mainButton.style.backgroundColor = 'rgba(195, 200, 210, 1)';
        mainButton.style.boxShadow =
          '3em 3em 5em rgba(0, 0, 0, 0.5), inset -3em -5em 3em -3em rgba(0, 0, 0, 0.5), inset 4em 5em 2em -2em rgba(255, 255, 210, 1)';

        daytimeBackground[0].style.transform = 'translateX(110em)';
        daytimeBackground[1].style.transform = 'translateX(80em)';
        daytimeBackground[2].style.transform = 'translateX(50em)';

        cloud.style.transform = 'translateY(80em)';
        cloudLight.style.transform = 'translateY(80em)';
        components.style.backgroundColor = 'rgba(25, 30, 50, 1)';

        moon[0].style.opacity = '1';
        moon[1].style.opacity = '1';
        moon[2].style.opacity = '1';

        stars.style.transform = 'translateY(-62.5em)';
        stars.style.opacity = '1';

        dispatchThemeChange('dark');
      }

      isClicked = true;
      setTimeout(() => {
        isClicked = false;
      }, 500);
      isMoved = !isMoved;
    }

    // 绑定点击事件
    components.addEventListener('click', toggleTheme);

    // 鼠标悬浮微动效果
    mainButton.addEventListener('mousemove', () => {
      if (isClicked) return;
      if (isMoved) {
        mainButton.style.transform = 'translateX(100em)';
        daytimeBackground[0].style.transform = 'translateX(100em)';
        daytimeBackground[1].style.transform = 'translateX(73em)';
        daytimeBackground[2].style.transform = 'translateX(46em)';

        star[0].style.top = '10em';
        star[0].style.left = '36em';
        star[1].style.top = '40em';
        star[1].style.left = '87em';
        star[2].style.top = '26em';
        star[2].style.left = '16em';
        star[3].style.top = '38em';
        star[3].style.left = '63em';
        star[4].style.top = '20.5em';
        star[4].style.left = '72em';
        star[5].style.top = '51.5em';
        star[5].style.left = '35em';
      } else {
        mainButton.style.transform = 'translateX(10em)';
        daytimeBackground[0].style.transform = 'translateX(10em)';
        daytimeBackground[1].style.transform = 'translateX(7em)';
        daytimeBackground[2].style.transform = 'translateX(4em)';

        cloudList[0].style.right = '-24em';
        cloudList[0].style.bottom = '10em';
        cloudList[1].style.right = '-12em';
        cloudList[1].style.bottom = '-27em';
        cloudList[2].style.right = '17em';
        cloudList[2].style.bottom = '-43em';
        cloudList[3].style.right = '46em';
        cloudList[3].style.bottom = '-39em';
        cloudList[4].style.right = '70em';
        cloudList[4].style.bottom = '-65em';
        cloudList[5].style.right = '109em';
        cloudList[5].style.bottom = '-54em';
        cloudList[6].style.right = '-23em';
        cloudList[6].style.bottom = '10em';
        cloudList[7].style.right = '-11em';
        cloudList[7].style.bottom = '-26em';
        cloudList[8].style.right = '18em';
        cloudList[8].style.bottom = '-42em';
        cloudList[9].style.right = '47em';
        cloudList[9].style.bottom = '-38em';
        cloudList[10].style.right = '74em';
        cloudList[10].style.bottom = '-64em';
        cloudList[11].style.right = '110em';
        cloudList[11].style.bottom = '-55em';
      }
    });

    mainButton.addEventListener('mouseout', () => {
      if (isClicked) return;
      if (isMoved) {
        mainButton.style.transform = 'translateX(110em)';
        daytimeBackground[0].style.transform = 'translateX(110em)';
        daytimeBackground[1].style.transform = 'translateX(80em)';
        daytimeBackground[2].style.transform = 'translateX(50em)';

        star[0].style.top = '11em';
        star[0].style.left = '39em';
        star[1].style.top = '39em';
        star[1].style.left = '91em';
        star[2].style.top = '26em';
        star[2].style.left = '19em';
        star[3].style.top = '37em';
        star[3].style.left = '66em';
        star[4].style.top = '21em';
        star[4].style.left = '75em';
        star[5].style.top = '51em';
        star[5].style.left = '38em';
      } else {
        mainButton.style.transform = 'translateX(0em)';
        daytimeBackground[0].style.transform = 'translateX(0em)';
        daytimeBackground[1].style.transform = 'translateX(0em)';
        daytimeBackground[2].style.transform = 'translateX(0em)';

        cloudList[0].style.right = '-20em';
        cloudList[0].style.bottom = '10em';
        cloudList[1].style.right = '-10em';
        cloudList[1].style.bottom = '-25em';
        cloudList[2].style.right = '20em';
        cloudList[2].style.bottom = '-40em';
        cloudList[3].style.right = '50em';
        cloudList[3].style.bottom = '-35em';
        cloudList[4].style.right = '75em';
        cloudList[4].style.bottom = '-60em';
        cloudList[5].style.right = '110em';
        cloudList[5].style.bottom = '-50em';
        cloudList[6].style.right = '-20em';
        cloudList[6].style.bottom = '10em';
        cloudList[7].style.right = '-10em';
        cloudList[7].style.bottom = '-25em';
        cloudList[8].style.right = '20em';
        cloudList[8].style.bottom = '-40em';
        cloudList[9].style.right = '50em';
        cloudList[9].style.bottom = '-35em';
        cloudList[10].style.right = '75em';
        cloudList[10].style.bottom = '-60em';
        cloudList[11].style.right = '110em';
        cloudList[11].style.bottom = '-50em';
      }
    });

    // 云朵随机漂浮
    const getRandomDirection = () => {
      const directions = ['2em', '-2em'];
      return directions[Math.floor(Math.random() * directions.length)];
    };

    const cloudSons = container.querySelectorAll('.cloud-son');
    const floatInterval = setInterval(() => {
      cloudSons.forEach((el) => {
        el.style.transform = `translate(${getRandomDirection()}, ${getRandomDirection()})`;
      });
    }, 1000);

    // ========== 自适应大小 ==========
    function resize() {
      const width = container.clientWidth;
      if (width <= 0) return;
      // 按钮设计基准：宽 180em，高 70em
      const fontSize = width / 180;
      container.style.fontSize = fontSize + 'px';
      container.style.height = (fontSize * 70) + 'px';
    }

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);
    resize(); // 初始调用

    // 根据初始主题决定是否需要首次切换
    if (initialTheme === 'dark') {
      // 模拟点击切换到暗色
      components.click();
    }

    // 返回对外控制的 API
    return {
      /** 获取当前主题 */
      getTheme: () => currentTheme,
      /** 设置主题（'dark' 或 'light'），若与当前不同则自动切换 */
      setTheme: (theme) => {
        const target = theme === 'dark' ? 'dark' : 'light';
        if (target !== currentTheme) {
          components.click();
        }
      },
      /** 销毁按钮，移除事件监听和观察器，清空容器 */
      destroy: () => {
        components.removeEventListener('click', toggleTheme);
        clearInterval(floatInterval);
        resizeObserver.disconnect();
        container.innerHTML = '';
        container.classList.remove('theme-button-container');
        container.style.fontSize = '';
        container.style.height = '';
      },
      /** 容器元素引用 */
      container: container
    };
  }

  // 暴露到全局
  global.createThemeButton = createThemeButton;
})(window);
