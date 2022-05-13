<template>
  <div class="container">
    <div>
      <svg id="sky">
        <template v-for="(x, y) in num">
          <circle
            :cx="getRandomX()"
            :cy="getRandomY()"
            :r="randomRadius()"
            stroke="none"
            strokeWidth="0"
            fill="white"
            :key="y"
            class="star"
          />
        </template>
      </svg>
      <div id="shootingstars">
        <template v-for="(x, y) in 60">
          <div
            :key="y"
            class="wish"
            :style="{
              left: `${getRandomY()}px`,
              top: `${getRandomX()}px`,
            }"
          />
        </template>
      </div>
    </div>
    <div class="info">
      <a-row type="flex" justify="center">
        <a-col class="info-bg" :xs="18" :sm="18" :md="16" :lg="16" :xl="14">
          <h3 class="title">Hey girl!</h3>
          <h4 class="total">今天是我们在一起的第{{ totalDay }}天</h4>
          <h4 class="birth" v-if="isBirthDay">生日快乐！贝贝</h4>
          <h4 class="birth" v-else>距离你生日还剩{{ youBirthDay }}天</h4>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import anime from 'animejs';
import formatDate from '../../utils/formatDate';
const MEMORIAL_DAY = '2022-04-16';
const BIRTH_DAY = '10-11';
// const BIRTH_DAY = '05-13';
export default {
  data() {
    return {
      weatherInfo: {},
      youBirthDay: 0,
      totalDay: 0,
      currDate: new Date(),

      // bg
      num: 60,
      vw: Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      ),
      vh: Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      ),
    };
  },
  computed: {
    isBirthDay() {
      return this.youBirthDay == 0;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 获取天气
      // this.getWeather()

      this.getStatistics();

      this.setFontSize();

      // 动画
      this.starryNight();
      this.shootingStars();

      window.onresize = () => {
        this.setFontSize();
      };
    },
    // 统计日期数据
    getStatistics() {
      let birth_day = `${formatDate(new Date(), 'yyyy')}-${BIRTH_DAY}`;
      this.youBirthDay = this.getDay(birth_day, this.currDate);
      // 判断今年生日是否已经过了
      let birthTime = new Date(birth_day).getTime();
      let currTime = new Date(this.currDate).getTime();
      // 当前日期大于生日 过完
      if (currTime > birthTime) {
        birth_day = `${+formatDate(new Date(), 'yyyy') + 1}-${BIRTH_DAY}`;
      }
      this.totalDay = this.getDay(MEMORIAL_DAY, this.currDate);
      // let currDate
    },
    getWeather() {
      let currDate = formatDate(new Date(), 'yyyy-MM-dd');
      let weather = localStorage.getItem('weather');
      if (weather && weather.date == currDate) {
        this.weatherInfo = weather.data;
      } else {
        fetch(
          'http://apis.juhe.cn/simpleWeather/query?city=%E6%AD%A6%E6%B1%89&key=452193ecad3162772f34fd24c3f42a96'
        )
          .then((response) => response.json())
          .then((json) => console.log(json))
          .catch((err) => console.log('Request Failed', err));
      }
    },
    getDay(date1, date2) {
      let time1 = new Date(date1).getTime();
      let time2 = new Date(date2).getTime();
      let diff = Math.abs(time1 - time2);
      return (diff / 1000 / 60 / 60 / 24).toFixed(0);
    },
    setFontSize() {
      let width = document
        .querySelector('.info-bg')
        .getBoundingClientRect().width;
      document.querySelector('.title').style.fontSize = width / 10 + 'px';
      document.querySelector('.total').style.fontSize = width / 20 + 'px';
      document.querySelector('.birth').style.fontSize = width / 20 + 'px';
    },
    // bg
    randomRadius() {
      return Math.random() * 0.7 + 0.6;
    },
    getRandomX() {
      return Math.floor(Math.random() * Math.floor(this.vw)).toString();
    },
    getRandomY() {
      return Math.floor(Math.random() * Math.floor(this.vh)).toString();
    },
    starryNight() {
      anime({
        targets: ['#sky .star'],
        opacity: [
          {
            duration: 700,
            value: '0',
          },
          {
            duration: 700,
            value: '1',
          },
        ],
        easing: 'linear',
        loop: true,
        delay: (el, i) => 50 * i,
      });
    },
    shootingStars() {
      anime({
        targets: ['#shootingstars .wish'],
        easing: 'linear',
        loop: true,
        delay: (el, i) => 1000 * i,
        opacity: [
          {
            duration: 700,
            value: '1',
          },
        ],
        width: [
          {
            value: '150px',
          },
          {
            value: '0px',
          },
        ],
        translateX: 350,
      });
    },
  },
};
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #ff47a1 0%, #ff9f4d 100%);
  overflow: hidden;
}
.info {
  position: absolute;
  width: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.info-bg {
  text-align: center;
  color: #fff;
  /* background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(6px); */
}
h3,
h4 {
  font-size: 30px;
  color: #fff;
}
#sky {
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

#shootingstars {
  margin: 0;
  padding: 0;
  width: 150vh;
  height: 100vw;
  position: fixed;
  overflow: hidden;
  transform: translatex(calc(50vw - 50%)) translatey(calc(50vh - 50%))
    rotate(120deg);
}

.wish {
  height: 2px;
  top: 300px;
  width: 100px;
  margin: 0;
  opacity: 0;
  padding: 0;
  background-color: white;
  position: absolute;
  background: linear-gradient(-45deg, white, rgba(0, 0, 255, 0));
  filter: drop-shadow(0 0 6px white);
  overflow: hidden;
}
</style>
