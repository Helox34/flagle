/* BAZA DANYCH: PRICE-DLE */
const itemsDB = [
    { name: "Ferrari F40", val: 2500000, img: "ferrari.jpg" },
    { name: "Rolex Daytona", val: 17800000, img: "rolex.jpg" },
    { name: "Big Mac (USA)", val: 5, img: "burger.jpg" },
    { name: "iPhone 15 Pro Max", val: 1199, img: "iphone.jpg" },
    { name: "PlayStation 5", val: 499, img: "ps5.jpg" },
    { name: "Odrzutowiec G650", val: 65000000, img: "jet.jpg" },
    { name: "Torebka Birkin", val: 450000, img: "birkin.jpg" },
    { name: "Lamborghini Aventador", val: 500000, img: "lambo.jpg" },
    { name: "Netflix (1 rok)", val: 186, img: "netflix.jpg" },
    { name: "Spotify (1 rok)", val: 132, img: "spotify.jpg" },
    { name: "Tesla Model S", val: 108000, img: "tesla.jpg" },
    { name: "Woda Acqua di Cristallo", val: 60000, img: "water.jpg" },
    { name: "Obraz da Vinci", val: 450000000, img: "art.jpg" },
    { name: "Jacht History Supreme", val: 4800000000, img: "yacht.jpg" },
    { name: "Nike Air Mag", val: 50000, img: "nike.jpg" },
    { name: "Bitcoin (1 BTC)", val: 73000, img: "bitcoin.jpg" },
    { name: "Noc w Burj Al Arab", val: 24000, img: "hotel.jpg" },
    { name: "Fortepian Steinway", val: 180000, img: "piano.jpg" },
    { name: "Diament Pink Star", val: 71200000, img: "diamond.jpg" },
    { name: "Prywatna Wyspa", val: 15000000, img: "island.jpg" }
];

const game = {
    state: { left: null, right: null, score: 0, isAnimating: false },
    ui: {
        left: { img: document.getElementById('img-left'), name: document.getElementById('name-left'), val: document.getElementById('val-left') },
        right: { img: document.getElementById('img-right'), name: document.getElementById('name-right'), val: document.getElementById('val-right'), btns: document.getElementById('buttons-area'), res: document.getElementById('result-area') },
        score: document.getElementById('current-score'),
        best: document.getElementById('best-score'),
        modal: document.getElementById('game-over'),
        msg: document.getElementById('loss-msg'),
        final: document.getElementById('final-score-val')
    },

    init() {
        this.ui.best.textContent = localStorage.getItem('price_highscore') || 0;
        this.state.left = this.getRandom();
        this.state.right = this.getRandom(this.state.left);
        this.render();
    },

    getRandom(exclude) {
        let item;
        do { item = itemsDB[Math.floor(Math.random() * itemsDB.length)]; } while (exclude && item.name === exclude.name);
        return item;
    },

    formatMoney(num) {
        return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },

    render() {
        const { left, right } = this.state;
        this.ui.left.img.src = `img/${left.img}`;
        this.ui.left.name.textContent = left.name;
        this.ui.left.val.textContent = this.formatMoney(left.val);

        this.ui.right.img.src = `img/${right.img}`;
        this.ui.right.name.textContent = right.name;
        this.ui.right.val.textContent = "???";
        
        this.ui.right.btns.classList.remove('hidden');
        this.ui.right.res.classList.add('hidden');
        this.ui.right.val.style.color = "#FFD700";
    },

    guess(dir) {
        if (this.state.isAnimating) return;
        this.state.isAnimating = true;
        const correct = (dir === 'higher' && this.state.right.val >= this.state.left.val) ||
                        (dir === 'lower' && this.state.right.val <= this.state.left.val);
        this.reveal(correct);
    },

    reveal(correct) {
        this.ui.right.btns.classList.add('hidden');
        this.ui.right.res.classList.remove('hidden');
        this.animateValue(this.ui.right.val, 0, this.state.right.val, 1000, () => {
            if (correct) {
                this.ui.right.val.style.color = "#10b981";
                setTimeout(() => this.next(), 1200);
            } else {
                this.ui.right.val.style.color = "#ef4444";
                setTimeout(() => this.over(), 1500);
            }
        });
    },

    next() {
        this.state.score++;
        this.ui.score.textContent = this.state.score;
        this.state.left = this.state.right;
        this.state.right = this.getRandom(this.state.left);
        this.render();
        this.state.isAnimating = false;
    },

    over() {
        const best = parseInt(localStorage.getItem('price_highscore') || 0);
        if (this.state.score > best) {
            localStorage.setItem('price_highscore', this.state.score);
            this.ui.msg.textContent = `Nowy rekord! Poprawna cena: ${this.formatMoney(this.state.right.val)}`;
        } else {
            this.ui.msg.textContent = `Błąd! Cena to ${this.formatMoney(this.state.right.val)}`;
        }
        this.ui.final.textContent = this.state.score;
        this.ui.modal.classList.remove('hidden');
    },

    restart() {
        this.state.score = 0;
        this.ui.score.textContent = "0";
        this.ui.best.textContent = localStorage.getItem('price_highscore') || 0;
        this.ui.modal.classList.add('hidden');
        this.state.left = this.getRandom();
        this.state.right = this.getRandom(this.state.left);
        this.render();
        this.state.isAnimating = false;
    },

    animateValue(obj, start, end, duration, cb) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOut * (end - start) + start);
            obj.innerHTML = this.formatMoney(currentVal);
            if (progress < 1) window.requestAnimationFrame(step);
            else if (cb) cb();
        };
        window.requestAnimationFrame(step);
    }
};
game.init();