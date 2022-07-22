const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playlist = $('.playlist')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Bắt cóc con tim',
            singer: 'Lou Hoàng',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpeg'
        },
        {
            name: 'There\'s No One At All',
            singer: 'Sơn Tùng M-TP',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpeg'
        },
        {
            name: 'Chạy khỏi thế giới này',
            singer: 'Da LAB',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpeg'
        },
        {
            name: 'Độ Tộc 2',
            singer: 'Độ Mixi',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpeg'
        },
        {
            name: 'từ chối nhẹ nhàng thôi',
            singer: 'Bích Phương & Phúc Du',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpeg'
        },
        {
            name: 'Chìm Sâu',
            singer: 'MCK',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpeg'
        },
        {
            name: '2AM',
            singer: 'JustaTee ft.BigDaddy',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpeg'
        },
        {
            name: 'Lối Nhỏ',
            singer: 'Đen ft.Phương Anh Đào',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpeg'
        },
        {
            name: 'Cao Ốc 20',
            singer: 'B Ray ft.Đạt G',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpeg'
        },
        {
            name: 'Thiêu Thân',
            singer: 'B Ray & SOFIA & Châu Đăng Khoa',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpeg'
        },
        {
            name: 'Ex\'s Hate Me',
            singer: 'B Ray & AMEE',
            path: './assets/music/song11.mp3',
            image: './assets/img/song11.jpeg'
        },
        {
            name: 'Mượn Rượu Tỏ Tình',
            singer: 'BigDaddy x Emily',
            path: './assets/music/song12.mp3',
            image: './assets/img/song12.jpeg'
        },
        
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
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
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử ký CD quay / dừng
        const cdThumbanimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        })
        cdThumbanimate.pause()
        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // Xử lý khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbanimate.play()
        }
        // Khi song tạm dừng
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbanimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua xong
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next xong
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong() 
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev xong
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý random bật / tắt random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý lặp lại 1 bài hát
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // Xử lý next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()

            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(
                songNode || 
                e.target.closest('.option')
                ) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // Xử lý khi click vào option
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300)
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },
    loadCurrentSong: function() {
        
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // Gán cấu hình vào config vào ứng dụng
        this.loadConfig()
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe và xử lý các sự kiện (DOM events)
        this.handleEvents();
        
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        // Render playlist
        this.render();

        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)

    }
}
app.start()