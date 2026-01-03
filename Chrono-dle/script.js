/* BAZA DANYCH: CHRONO-DLE */
const itemsDB = [
    { name: "Premiera iPhone'a", val: 2007, img: "iphone.jpg" },
    { name: "Start YouTube", val: 2005, img: "youtube.jpg" },
    { name: "Upadek Muru Berlińskiego", val: 1989, img: "berlin.jpg" },
    { name: "Pierwszy lot w kosmos", val: 1961, img: "gagarin.jpg" },
    { name: "Film 'Titanic'", val: 1997, img: "titanic.jpg" },
    { name: "Start Google", val: 1998, img: "google.jpg" },
    { name: "Serial 'Przyjaciele'", val: 1994, img: "friends.jpg" },
    { name: "Wynalezienie WWW", val: 1989, img: "www.jpg" },
    { name: "Gra Minecraft", val: 2011, img: "minecraft.jpg" },
    { name: "Start Instagrama", val: 2010, img: "instagram.jpg" },
    { name: "Koniec II Wojny Światowej", val: 1945, img: "ww2.jpg" },
    { name: "Lądowanie na Księżycu", val: 1969, img: "moon.jpg" },
    { name: "Gwiezdne Wojny (Nowa Nadzieja)", val: 1977, img: "starwars.jpg" },
    { name: "Śmierć Michaela Jacksona", val: 2009, img: "mj.jpg" },
    { name: "Żarówka Edisona", val: 1879, img: "bulb.jpg" },
    { name: "Otwarcie Wieży Eiffla", val: 1889, img: "eiffel.jpg" },
    { name: "Rozpad ZSRR", val: 1991, img: "ussr.jpg" },
    { name: "Film 'Shrek'", val: 2001, img: "shrek.jpg" },
    { name: "Powstanie Bitcoina", val: 2009, img: "bitcoin.jpg" },
    { name: "Katastrofa w Czarnobylu", val: 1986, img: "chernobyl.jpg" }
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
        this.ui.best.textContent = localStorage.getItem('chrono_highscore') || 0;
        this.state.left = this.getRandom();
        this.state.right = this.getRandom(this.state.left);
        this.render();
    },

    getRandom(exclude) {
        let item;
        do { item = itemsDB[Math.floor(Math.random() * itemsDB.length)]; } while (exclude && item.name === exclude.name);
        return item;
    },

    render() {
        const { left, right } = this.state;
        this.ui.left.img.src = `img/${left.img}`;
        this.ui.left.name.textContent = left.name;
        this.ui.left.val.textContent = left.val;

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
        // PÓŹNIEJ = Higher, WCZEŚNIEJ = Lower
        const correct = (dir === 'higher' && this.state.right.val >= this.state.left.val) ||
                        (dir === 'lower' && this.state.right.val <= this.state.left.val);
        this.reveal(correct);
    },

    reveal(correct) {
        this.ui.right.btns.classList.add('hidden');
        this.ui.right.res.classList.remove('hidden');
        this.ui.right.val.textContent = this.state.right.val; // Brak animacji liczenia dla dat, lepiej od razu pokazać
        
        if (correct) {
            this.ui.right.val.style.color = "#3b82f6"; // Niebieski sukces
            setTimeout(() => this.next(), 1200);
        } else {
            this.ui.right.val.style.color = "#ef4444";
            setTimeout(() => this.over(), 1500);
        }
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
        const best = parseInt(localStorage.getItem('chrono_highscore') || 0);
        if (this.state.score > best) {
            localStorage.setItem('chrono_highscore', this.state.score);
            this.ui.msg.textContent = `Nowy rekord! Poprawny rok: ${this.state.right.val}`;
        } else {
            this.ui.msg.textContent = `Błąd! To było w roku ${this.state.right.val}`;
        }
        this.ui.final.textContent = this.state.score;
        this.ui.modal.classList.remove('hidden');
    },

    restart() {
        this.state.score = 0;
        this.ui.score.textContent = "0";
        this.ui.best.textContent = localStorage.getItem('chrono_highscore') || 0;
        this.ui.modal.classList.add('hidden');
        this.state.left = this.getRandom();
        this.state.right = this.getRandom(this.state.left);
        this.render();
        this.state.isAnimating = false;
    }
};
game.init();