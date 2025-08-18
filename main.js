// Переключиние кнопки актив в педагогах
$(document).ready(function () {
    var header = document.getElementById("nap");
    var btns = header.getElementsByClassName("foto");
    for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("activ");
    current[0].className = current[0].className.replace(" activ", "");
    this.className += " activ";
    });
}})






// Блок с переключением информации о педегогах
$(document).ready(function () {
$(".cc,.rr,.gg,.nn,.ll").hide();
    $(".k").click(function () {
        $(".cc,.rr,.gg,.nn,.ll").hide();
        $(".kk").show()
    });
    $(".c").click(function () {
        $(".kk,.rr,.gg,.nn,.ll").hide();
        $(".cc").show()
    });
    $(".r").click(function () {
        $(".kk,.cc,.rr,.nn,.ll").hide();
        $(".rr").show()
    });
    $(".g").click(function () {
        $(".kk,.cc,.rr,.nn,.ll").hide();
        $(".gg").show()
    });
    $(".n").click(function () {
        $(".kk,.cc,.rr,.gg,.ll").hide();
        $(".nn").show()
    });
    $(".l").click(function () {
        $(".kk,.cc,.rr,.gg,.nn").hide();
        $(".ll").show()
    });
});


// Слайдер
$(document).ready(function () {
    const slides = document.querySelector('.slides');
    const slideCount = document.querySelectorAll('.slide').length;
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const slider = document.querySelector('.slider');

    let currentIndex = 0;
    let autoPlayInterval;

    function goToSlide(index) {
        if (index < 0) {
            index = slideCount - 1; 
        } else if (index >= slideCount) {
            index = 0;
        }
        currentIndex = index;
        slides.style.transform = `translateX(${-index * 100}%)`;
    }

    prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 3000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    startAutoPlay();
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    });


// Загрузка заголовка и подвала...
$("#header").load("header.html");
$("#footer").load("footer.html");




// Якорь
window.addEventListener('scroll', function() {
    const topButton = document.getElementById('top');
    
    // Установите значение для точки, после которой появляется кнопка
    const scrollThreshold = 800; // Например, 300 пикселей

    if (window.scrollY > scrollThreshold) {
        topButton.style.display = 'block'; // Показать кнопку
    } else {
        topButton.style.display = 'none'; // Скрыть кнопку
    }
});








// Плеер {
const videoContainers = document.querySelectorAll('.video-container');
let currentPlayer = null; // Переменная для хранения текущего плеера

videoContainers.forEach(container => {
    const video = container.querySelector('.video');
    const playBtn = container.querySelector('.controls_play');
    const stopBtn = container.querySelector('.controls_stop');
    const playBtnImg = container.querySelector('.play_btn');
    const progress = container.querySelector('.progress');
    const time = container.querySelector('.controls_time');
    const playOverlay = container.querySelector('.play-overlay');

    function toggleVideoStatus() {
        if (video.paused) {
            if (currentPlayer && currentPlayer !== video) {
                currentPlayer.pause(); // Останавливаем текущий плеер, если он не равен новому
                const currentPlayBtnImg = currentPlayer.closest('.video-container').querySelector('.play_btn');
                currentPlayBtnImg.src = './img/player/play.png';
                const currentPlayOverlay = currentPlayer.closest('.video-container').querySelector('.play-overlay');
                currentPlayOverlay.style.display = 'block'; // Показываем изображение при паузе
            }

            video.play();
            playBtnImg.src = './img/player/pause.png';
            playOverlay.style.display = 'none'; // Скрываем изображение при воспроизведении
            currentPlayer = video; // Установим текущий плеер
        } else {    
            video.pause();
            playBtnImg.src = './img/player/play.png';
            playOverlay.style.display = 'block'; // Показываем изображение при паузе
            
            if (currentPlayer === video) {
                currentPlayer = null; // Сбрасываем текущий плеер, если он на паузе
            }
        }
    }

    playBtn.addEventListener('click', toggleVideoStatus);
    playOverlay.addEventListener('click', toggleVideoStatus);
    video.addEventListener('click', toggleVideoStatus);


    function stopVideo() {
    video.pause();
    video.currentTime = 0;
    progress.value = 0; // Сбрасываем ползунок прогресса на 0
    playBtnImg.src = './img/player/play.png';
    playOverlay.style.display = 'block'; // Показываем изображение после остановки

    // Устанавливаем постер, чтобы отобразить предпросмотр
    video.load(); // Перезагружаем видео, чтобы установить постер
    
    if (currentPlayer === video) {
        currentPlayer = null; // Сбрасываем текущий плеер при остановке
    }
}


    stopBtn.addEventListener('click', stopVideo);

    function updateProgress() {
        if (video.duration) {
            progress.value = (video.currentTime / video.duration) * 100;
        }

        let minutes = Math.floor(video.currentTime / 60);
        let seconds = Math.floor(video.currentTime % 60);

        if (minutes < 10) {
            minutes = '0' + String(minutes);
        }

        if (seconds < 10) {
            seconds = '0' + String(seconds);
        }

        time.innerHTML = `${minutes}:${seconds}`;
    }

    video.addEventListener('timeupdate', updateProgress);

    function setProgress() {
        video.currentTime = (progress.value * video.duration) / 100;
    }

    progress.value = 0;
    progress.addEventListener('input', setProgress);
});





const items = document.querySelectorAll(".accordion-header");

// Функция для активации вкладки
function toggleAccordion() {
    // Убираем активное состояние у всех элементов
    items.forEach(item => {
        item.classList.remove('activ');
        item.nextElementSibling.classList.remove('activ');
    });

    // Устанавливаем активное состояние только на текущем элементе
    this.classList.add('activ');
    this.nextElementSibling.classList.add('activ');
}

// Добавляем слушатель событий на все элементы аккордеона
items.forEach(item => item.addEventListener('click', toggleAccordion));