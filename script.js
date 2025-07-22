$(document).ready(function () {
$(".c1,.r1,.g1,.n1,.l1").hide();
    $(".k").click(function () {
        $(".c1,.r1,.g1,.n1,.l1").hide();
        $(".k1").show()
    });
    $(".c").click(function () {
        $(".k1,.r1,.g1,.n1,.l1").hide();
        $(".c1").show()
    });
    $(".r").click(function () {
        $(".k1,.c1,.g1,.n1,.l1").hide();
        $(".r1").show()
    });
    $(".g").click(function () {
        $(".k1,.c1,.r1,.n1,.l1").hide();
        $(".g1").show()
    });
    $(".n").click(function () {
        $(".k1,.c1,.r1,.g1,.l1").hide();
        $(".n1").show()
    });
    $(".l").click(function () {
        $(".k1,.c1,.r1,.g1,.n1").hide();
        $(".l1").show()
    });
});


// Получить кнопку
var mybutton = document.getElementById("top");

// Когда пользователь прокручивает вниз от верхней части документа, покажите кнопку
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 800 || document.documentElement.scrollTop > 800) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}



// Dom
const video = document.querySelector('.video'),
    playBtn = document.querySelector('.controls_play'),
    stopBtn = document.querySelector('.controls_stop'),
    playBtnImg = document.querySelector('.play_btn'),
    progress = document.querySelector('.progress'),
    time = document.querySelector('.controls_time')


// Плей и Пауза
function toggleVideoStatus() {
    if (video.paused) {
        video.play()
        playBtnImg.src = './Img/Player/Pause.png'
    } else {    
        video.pause()
        playBtnImg.src = './Img/Player/Play.png'
    }
}

playBtn.addEventListener('click', toggleVideoStatus)
video.addEventListener('click', toggleVideoStatus)

// Стоп видео
function stopVideo() {  
    video.currentTime = 0
    video.pause()
    playBtnImg.src = './Img/Player/Play.png'
}

stopBtn.addEventListener('click', stopVideo)

// Время
function updateProgress() {  
    progress.value = (video.currentTime / video.duration) * 100

    //Минуты
    let minutes = Math.floor(video.currentTime / 60)
    if (minutes < 10) {
        minutes = '0' + String(minutes)
    }

    //Секунды
    let seconds = Math.floor(video.currentTime % 60)
    if (seconds < 10) {
            seconds = '0' + String(seconds)
    }


    time.innerHTML = '${minutes}: ${seconds}'
}
video.addEventListener('timeupdate', updateProgress)

//Прогресс
function setProgress() {
    video.currentTime = (progress.value * video.duration) / 100
}
progress.addEventListener('change', setProgress)













// Находим контейнер со слайдами
$(document).ready(function () {
    const slides = document.querySelector('.slides');
    const slideCount = document.querySelectorAll('.slide').length; // Количество слайдов
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const slider = document.querySelector('.slider');

    let currentIndex = 0; // Текущий индекс слайда
    let autoPlayInterval; // Интервал для автопрокрутки

    /**
     * Функция смены слайда.
     * @param {number} index - Индекс слайда, на который нужно перейти.
     */
    function goToSlide(index) {
        if (index < 0) {
            index = slideCount - 1; // Если нажали "Назад" на первом слайде, переходим к последнему
        } else if (index >= slideCount) {
            index = 0; // Если нажали "Вперед" на последнем слайде, переходим к первому
        }
        currentIndex = index;
        slides.style.transform = `translateX(${-index * 100}%)`; // Смещение слайдов
    }

    // Обработчики кликов для кнопок
    prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));

    /**
     * Запускает автоматическую прокрутку слайдов.
     */
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 3000);
    }

    /**
     * Останавливает автоматическую прокрутку.
     */
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    startAutoPlay(); // Запускаем автопрокрутку
    slider.addEventListener('mouseenter', stopAutoPlay); // Остановка при наведении мыши
    slider.addEventListener('mouseleave', startAutoPlay); // Возобновление при уходе мыши
    });

    // Добавьте активный класс к текущей кнопке (выделите его)
$(document).ready(function () {
    var header = document.getElementById("pd");
    var btns = header.getElementsByClassName("ft");
    for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("activ");
    current[0].className = current[0].className.replace(" activ", "");
    this.className += " activ";
    });
}})








