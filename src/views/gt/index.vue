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
          <h3 class="title font-effect-anaglyph font-effect-3d-float">
            Hey girl
          </h3>
          <h4 class="total">今天是我们在一起的第{{ totalDay }}天</h4>
          <h4 class="birth" v-if="isBirthDay">生日快乐！贝贝</h4>
          <h4 class="birth" v-else>距离你生日还剩{{ youBirthDay }}天</h4>
          <h4>未来三天天气</h4>
          <h5 v-for="(item, index) in weatherInfo" :key="index">
            <span>{{ dayText(index) }}</span>
            <span
              >白天:{{ item.textDay
              }}<i style="margin-left: 4px" :class="`qi-${item.iconDay}`"></i>
            </span>
            <span style="margin-left: 8px"
              >晚间:{{ item.textNight
              }}<i style="margin-left: 4px" :class="`qi-${item.iconNight}`"></i>
            </span>
            <span style="margin-left: 8px">{{ item.tempMin }}℃</span>至<span
              >{{ item.tempMax }}℃</span
            >
          </h5>
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
      weatherInfo: [],
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
    dayText() {
      return function (index) {
        if (index == 0) {
          return '今天';
        } else if (index == 1) {
          return '明天';
        } else {
          return '后天';
        }
      };
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 获取天气
      this.getWeather();

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
      let currDate = formatDate(this.currDate, 'yyyy-MM-dd');
      let birth_day = `${formatDate(new Date(), 'yyyy')}-${BIRTH_DAY}`;
      this.youBirthDay = this.getDay(birth_day, currDate);
      // 判断今年生日是否已经过了
      let birthTime = new Date(birth_day).getTime();
      let currTime = new Date(currDate).getTime();
      // 当前日期大于生日 过完
      if (currTime > birthTime) {
        birth_day = `${+formatDate(new Date(), 'yyyy') + 1}-${BIRTH_DAY}`;
      }
      this.totalDay = this.getDay(MEMORIAL_DAY, currDate);
      // let currDate
    },
    getWeather() {
      let currDate = formatDate(new Date(), 'yyyy-MM-dd');
      let weather = localStorage.getItem('weather')
        ? JSON.parse(localStorage.getItem('weather'))
        : '';
      if (weather && weather.date == currDate) {
        this.weatherInfo = weather.data;
      } else {
        localStorage.removeItem('weather');
        fetch(
          'https://devapi.qweather.com/v7/weather/3d?location=101200101&key=5fc9b4616e49495ba1f0df243df11482'
        )
          .then((response) => response.json())
          .then((res) => {
            if (res.code == 200) {
              this.weatherInfo = res.daily;
              localStorage.setItem(
                'weather',
                JSON.stringify({
                  data: this.weatherInfo,
                  date: currDate,
                })
              );
            }
          })
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
      let h4Arr = document.querySelectorAll('h4');
      for (let i = 0; i < h4Arr.length; i++) {
        h4Arr[i].style.fontSize = width / 20 + 'px';
      }
      let h5Arr = document.querySelectorAll('h5');
      for (let i = 0; i < h5Arr.length; i++) {
        h5Arr[i].style.fontSize = width / 25 + 'px';
      }
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
  transform: translate(-50%, -70%);
}
.info-bg {
  text-align: center;
  color: #fff;
  /* background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(6px); */
}
.info-bg .title {
  font-family: Rancho;
}
h1,
h2,
h3,
h4,
h5,
h6 {
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
