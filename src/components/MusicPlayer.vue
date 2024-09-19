<template>
  <div class="music-player">
    <!-- 视频元素，静音、循环、自动播放 -->
    <video ref="videoElement" src="http://120.55.181.121:8888/group1/M00/00/00/rBvcKmbpP5CAPQQ5PsmMPQWU2OU226.mp4" muted loop autoplay></video>

    <div class="shell">
      <!-- 音量控制 -->
      <div class="volume-box">
        <span class="volume-down" @click="handleVolumeDown"><i class="material-icons">remove</i></span>
        <input type="range" class="volume-range" step="1" v-model="volume" min="0" max="100" @input="updateVolume">
        <span class="volume-up" @click="handleVolumeUp"><i class="material-icons">add</i></span>
      </div>

      <!-- 按钮控制盒 -->
      <div class="btn-box">
        <i class="material-icons prev" @click="handlePrevious">skip_previous</i>
        <i class="material-icons repeat" @click="handleRepeat">{{ isLooping ? 'repeat_on' : 'repeat' }}</i>
        <img :src="require('@/assets/ev.png')" alt="Description" class="center-image">
        <i class="material-icons volume" @click="toggleMute">{{ isMuted ? 'volume_off' : 'volume_up' }}</i>
        <i class="material-icons next" @click="handleNext">skip_next</i>
      </div>

      <!-- 音乐控制盒 -->
      <div class="music-box">
        <input type="range" class="seekbar" step="1" v-model="currentTime" :max="duration" @input="handleSeekBar">
        <audio ref="music" class="music-element" @timeupdate="updateProgress" @loadedmetadata="loadMetadata" @ended="handleSongEnd">
          <source :src="currentSongSrc">
        </audio>
        <span class="current-time">{{ formattedCurrentTime }}</span><span class="duration">{{ formattedDuration }}</span>
        <span class="play" @click="handlePlay">
          <i class="material-icons">{{ isPlaying ? 'pause' : 'play_arrow' }}</i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MusicPlayer',
  data() {
    return {
      isPlaying: false,
      isMuted: false,
      isLooping: false, // 控制是否循环播放
      volume: 80, // 音量初始化为80%
      currentTime: 0,
      duration: 0,
      currentSongIndex: 0, // 当前播放的歌曲索引
      songs: [
        "http://120.55.181.121:8888/group1/M00/00/00/rBvcKmbpQ1mAc_kVADliyMjg9_o026.mp3",
        "http://120.55.181.121:8888/group1/M00/00/00/rBvcKmbpQwKAaQQvADTJpD6LqrQ775.mp3",
        "http://120.55.181.121:8888/group1/M00/00/00/rBvcKmbpQ6qAX2XkABdSyIYKXCU750.mp3"
      ]
    };
  },
  computed: {
    currentSongSrc() {
      return this.songs[this.currentSongIndex];
    },
    formattedCurrentTime() {
      const minutes = Math.floor(this.currentTime / 60);
      const seconds = Math.floor(this.currentTime % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    },
    formattedDuration() {
      const minutes = Math.floor(this.duration / 60);
      const seconds = Math.floor(this.duration % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    }
  },
  methods: {
    handlePlay() {
      const music = this.$refs.music;
      if (music.paused) {
        music.play();
        this.isPlaying = true;
      } else {
        music.pause();
        this.isPlaying = false;
      }
    },
    handlePrevious() {
      // 切换到上一首歌
      if (this.currentSongIndex > 0) {
        this.currentSongIndex--;
      } else {
        this.currentSongIndex = this.songs.length - 1; // 循环到最后一首
      }
      this.loadNewSong();
    },
    handleNext() {
      // 切换到下一首歌
      if (this.currentSongIndex < this.songs.length - 1) {
        this.currentSongIndex++;
      } else {
        this.currentSongIndex = 0; // 循环到第一首
      }
      this.loadNewSong();
    },
    loadNewSong() {
      const music = this.$refs.music;
      if (music) {
        music.pause(); // 停止当前歌曲
        music.src = this.currentSongSrc; // 更新 src
        music.load(); // 加载新歌曲
        if (this.isPlaying) {
          music.play(); // 如果之前在播放，则自动播放新歌曲
        }
      }
    },
    handleRepeat() {
      this.isLooping = !this.isLooping; // 切换循环播放状态
      const music = this.$refs.music;
      music.loop = this.isLooping;
    },
    handleSongEnd() {
      // 如果不循环播放，则自动切换到下一首歌
      if (!this.isLooping) {
        this.handleNext();
      }
    },
    toggleMute() {
      const video = this.$refs.videoElement;
      this.isMuted = !this.isMuted;
      video.muted = this.isMuted;
    },
    handleVolumeDown() {
      this.volume = Math.max(0, this.volume - 10);
      this.updateVolume();
    },
    handleVolumeUp() {
      this.volume = Math.min(100, this.volume + 10);
      this.updateVolume();
    },
    updateVolume() {
      const music = this.$refs.music;
      music.volume = this.volume / 100;
    },
    handleSeekBar() {
      const music = this.$refs.music;
      music.currentTime = this.currentTime;
    },
    updateProgress() {
      const music = this.$refs.music;
      if (music) {
        this.currentTime = music.currentTime;
      }
    },
    loadMetadata() {
      const music = this.$refs.music;
      if (music) {
        this.duration = music.duration;
      }
    }
  },
  mounted() {
    this.updateVolume(); // 初始化音量
  }
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  font-family: "优设标题黑";
  -webkit-user-select:none;
}

.music-player {
  height: 100%;
  display: flex;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  background-color: #ffc0cb;
}


video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: 100vh;
}

.shell {
  margin-top: 5px;
  z-index: 99;
  width: 330px;
  height: 180px;
  border-radius: 15px;
  /* background-color: #fff6e7; */
  box-shadow: 0 10px 30px #00000085;
  /* 设置上高光和左高光，使其看起来更加逼真 */
  border-top: 1px solid rgba(255, 255, 255, .9);
  border-left: 1px solid rgba(255, 255, 255, .9);
  background: linear-gradient(to right bottom,
  rgba(255, 255, 255, .6),
  rgba(255, 255, 255, .3),
  rgba(255, 255, 255, .2));
  /* 重点：使元素背景模糊化 */
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.shell input[type=range] {
  -webkit-appearance: none !important;
  margin: 0px;
  padding: 0px;
  background: rgb(255, 255, 255);
  height: 5px;
  width: 150px;
  outline: none;
  cursor: pointer;
  overflow: hidden;
  border-radius: 5px;
}

.shell input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none !important;
  background: #ff3677;
  height: 5px;
  width: 5px;
  border-radius: 50%;
  box-shadow: -100vw 0 0 100vw rgb(160, 200, 250);
}

.shell input[type=range]::-moz-range-thumb {
  background: #ff3677;
  height: 8px;
  width: 8px;
  border-radius: 100%;
}

.shell input[type=range]::-ms-thumb {
  -webkit-appearance: none !important;
  background: #ff3677;
  height: 8px;
  width: 8px;
  border-radius: 100%;
}

.title {
  font-size: 35px;
  color: rgb(40, 45, 100);
}

.singer {
  font-size: 20px;
  color: #6e7cf5;
}

.btn-box {
  position: absolute;
  top: 35px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.material-icons {
  /* 鼠标指针变为手型 */
  cursor: pointer;
  /* 设置图标大小 */
  font-size: 24px;
  /* 设置图标颜色 */
  color: rgb(40, 45, 100);
  /* 设置图标之间的间距 */
  margin: 0 10px;
}

/* 可以为特定的按钮添加更多的样式或类 */
.prev, .next {
  /* 可以设置不同的大小 */
  font-size: 30px;
}

.center-image {
  /* 根据实际需要调整 */
  max-width: 50px;
  /* 根据实际需要调整 */
  max-height: 50px;
}

.btn-box i {
  font-size: 24px;
  color: rgb(40, 45, 100);
  margin: 0 30px;
  cursor: pointer;
}

.btn-box i.active {
  color: #ff3677;
}

.volume-box {
  display: none;
  position: absolute;
  top: 10px;
  z-index: 1;
  padding: 0 20px;
}

.volume-box .volume-down {
  position: absolute;
  left: -15px;
  cursor: pointer;
  color: rgb(40, 45, 100);
}

.volume-box .volume-up {
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: rgb(40, 45, 100);
}

.volume-box .volume-up::selection {
  background-color: unset;
}

.volume-box input[type=range] {
  height: 5px;
  width: 150px;
  margin: 0 0 15px 0;
}

.volume-box.active {
  display: block;
}

.music-box {
  position: absolute;
  top: 80px;
}

.music-box input[type=range] {
  height: 5px;
  width: 230px;
  margin: 0 0 10px 0;
}

.music-box input[type=range]::-webkit-slider-thumb {
  height: 5px;
  width: 7px;
}

.music-box .current-time {
  position: absolute;
  left: -35px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #252525;
}

.music-box .duration {
  position: absolute;
  right: -35px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: rgb(40, 45, 100);
}

.music-box .play,
.music-box .pause {
  position: absolute;
  left: 50%;
  top: 30px;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: rgb(160, 200, 250);
  cursor: pointer;
  transition: all 0.4s;
}

.music-box .play i,
.music-box .pause i {
  font-size: 36px;
  color: rgb(40, 45, 100);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.music-box .pause i {
  font-size: 32px;
  transform: translate(-50%, -50%);
}
video{
  position: absolute;
  width: 100%;
}
</style>