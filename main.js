// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "DAT COI";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  // (1/2) Uncomment the line below to use localStorage
  // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path:"./asset/music/Lemon-Tree-Remix-DJ.mp3",
      image: "./asset/img/1139710.jpg"
    },
    {
      name: "Tu Phir Se Aana",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "./asset/music/My-Love-Westlife.mp3",
      image:
        "./asset/img/1200px-Family_room_in_Camarillo,_California,_USA.jpg"
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path:
      "./asset/music/Reality-Feat-Janieck-Devy-Lost-Frequencies.mp3",
      image: "./asset/img/co-hai-tac-kaido.jpg"
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "./asset/music/Summertime-K-391.mp3",
      image:
      "./asset/img/hinh-nen-sasuke-ngau.webp"
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path:"./asset/music/TheFatRat-feat-Laura-Brehm-The-Calling.mp3",
      image:
        "./asset/img/kaido-la-ai.jpg"
    },
    {
        name: "airblade",
        singer: "Honda",
        path: "./asset/music/Vicetone-Nevada-Remix.mp3",
        image:
          "./asset/img/na3-16323909480871378844596.webp"
      }
    
  ],
  setconfig:function (key, value) {
    this.config[key] = value
    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config))
  },
  render:function() {
    const htmls = this.songs.map((song, index) => {
        return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `
    })
    playlist.innerHTML = htmls.join('')
  },
  defineProperties:function() {
    Object.defineProperty(this,'currentSong', {
        get:function(){
            return this.songs[this.currentIndex]
            
        }
    })
    
  },

  handleEvents:function() {
    const cdwidth = cd.offsetWidth
    const animatecd = cdThumb.animate(
      [{ transform: 'rotate(360deg)' }],
       {
        duration: 10000,
        iterations: Infinity,
      }
    )
    animatecd.pause()
    
    document.onscroll = function() {
        const crollwidth =  window.scrollY || document.documentElement.scrollTop
        const newWidth = cdwidth - crollwidth
        cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
        cd.style.opacity = newWidth/cdwidth
    }
    playBtn.onclick = function() {
      if(app.isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
    }
    audio.onplay = function() {
      animatecd.play()
      app.isPlaying=true
      player.classList.add('playing')
    }
    audio.onpause = function() {
      animatecd.pause()
      app.isPlaying=false
      player.classList.remove('playing')
      
    }
    audio.ontimeupdate = function() {
      if(audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
        progress.value = progressPercent
      }
    }
    progress.onchange = function(e) {
      const seekTime = audio.duration * e.target.value / 100
      audio.currentTime = seekTime
    }
    nextBtn.onclick = function() {
      app.isRandom ? app.ramdomSong() :app.nextSong()
      audio.play()
      app.render()
    }
    prevBtn.onclick = function() {
      app.isRandom ? app.ramdomSong() :app.prevSong()
      audio.play()
      app.render()

    }
    randomBtn.onclick = function() {
      app.isRandom = !app.isRandom
      app.setconfig('isRandom', app.isRandom)
      randomBtn.classList.toggle('active',app.isRandom)
    }
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat
      app.setconfig('isRepeat', app.isRepeat)
      repeatBtn.classList.toggle('active', app.isRepeat)
    }
    audio.onended = function() {
      app.isRepeat ? audio.play() : nextBtn.click()
    }
    playlist.onclick = function(e) {
      const songNode = e.target.closest('.song:not(.active)')
      if(songNode || e.target.closest('.option')) {
        if(songNode) {
          app.currentIndex = Number(songNode.dataset.index)
          app.loadcurrentSong()
          audio.play()
          app.render()
        }
      }
    }
  },
  loadcurrentSong:function() {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },
  loadConfig:function() {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat

  },
  nextSong:function() {
     this.currentIndex ++
     if(this.currentIndex > this.songs.length - 1) {
      this.currentIndex = 0
     }
     this.loadcurrentSong()
     this.activeSong()
  },
  prevSong:function() {
    this.currentIndex --
     if(this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1
     }
     this.loadcurrentSong()
     this.activeSong()
  },
  ramdomSong:function() {
    let newIndex
    do {newIndex = Math.floor(Math.random()* app.songs.length)}
    while (newIndex === app.currentIndex)
    this.currentIndex = newIndex
    app.loadcurrentSong()
    app.activeSong()
  },
  activeSong:function () {
    setTimeout(() => {
      ($('.song.active').scrollIntoView({
        behavior: "smooth",
        block: "end",
        
      }))
    }, 300);
  },
  start:function() {
    this.loadConfig()
    this.defineProperties()
    
    
    this.handleEvents()
   
    this.loadcurrentSong()

    this.render()
    randomBtn.classList.toggle('active',app.isRandom)
    repeatBtn.classList.toggle('active', app.isRepeat)
  }
}
app.start()


