// Переключиние кнопки актив в педагогах
$(document).ready(function() {
    function activateItem($item) {
        // Убираем класс активности со всех фото и прячем всех педагогов
        $('.foto').removeClass('activ');
        $('.pd').hide();

        // Добавляем класс активности к выбранному фото
        $item.addClass('activ');

        // Получаем id педагога из атрибута href ссылки внутри фото (убираем #)
        let targetId = $item.find('a.ft').attr('href').substring(1);

        // Показываем блок педагога с классом, соответствующим targetId
        $('.' + targetId).show();

        // Скроллим страницу к блоку педагога при клике (без анимации)
        $('html, body').scrollTop($('.' + targetId).offset().top);
    }

    // Клик по фото
    $('.foto').click(function(e) {
        e.preventDefault();
        activateItem($(this));
    });

    // Клик по заголовку — активируем соседнее фото
    $('.zag').click(function() {
        let $foto = $(this).siblings('.foto');
        if ($foto.length) {
            activateItem($foto);
        }
    });

    // При загрузке страницы показываем первого активного педагога
    let firstActive = $('.foto.activ');
    if (firstActive.length) {
        let targetId = firstActive.find('a.ft').attr('href').substring(1);
        $('.pd').hide();
        $('.' + targetId).show();
        // Не скроллим при загрузке
    }
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





// Якорь
const topButton = document.getElementById('top');
const footer = document.querySelector('footer');

if (footer && topButton) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const isMobile = window.innerWidth <= 767;

            if (entry.isIntersecting) {
                if (isMobile) {
                    topButton.style.display = 'none'; // Прячем кнопку на телефоне
                } else {
                    topButton.classList.add('in-footer'); // Меняем цвет на десктопе
                }
            } else {
                if (isMobile) {
                    // Но только если прокрутка больше порога
                    if (window.scrollY > 800) {
                        topButton.style.display = 'block';
                    }
                } else {
                    topButton.classList.remove('in-footer');
                }
            }
        });
    }, {
        root: null,
        threshold: 0.1
    });

    observer.observe(footer);
}

// Отдельная логика появления кнопки при скролле
window.addEventListener('scroll', function () {
    const scrollThreshold = 800;
    const isMobile = window.innerWidth <= 767;

    // Если футер не в зоне видимости и скролл больше порога — показываем
    if (window.scrollY > scrollThreshold) {
        // Только если футер не виден (проверим вручную)
        const footerRect = footer?.getBoundingClientRect();
        const footerVisible = footerRect && footerRect.top < window.innerHeight;

        if (!isMobile || !footerVisible) {
            topButton.style.display = 'block';
        }
    } else {
        topButton.style.display = 'none';
    }
}, { passive: true });











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







// Аккордеон
// Находим все заголовки аккордеона по классу .accordion-name
const items = document.querySelectorAll(".accordion-name");

// Функция переключения аккордеона при клике
function toggleAccordion() {
    // Сначала убираем активные классы у всех заголовков и их контента
    items.forEach(item => {
        item.classList.remove('activ');             // Убираем подсветку заголовка
        item.nextElementSibling.classList.remove('activ');  // Скрываем контент (следующий за заголовком элемент)
    });

    // Добавляем активные классы к тому заголовку, на который кликнули, и его контенту
    this.classList.add('activ');
    this.nextElementSibling.classList.add('activ');

    // Задержка перед скроллом нужна, чтобы анимация раскрытия контента успела сработать
    setTimeout(() => {
        // Плавно скроллим страницу так, чтобы выбранный заголовок оказался вверху окна
        this.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);  // Время задержки в миллисекундах (можно подкорректировать)
}

// Назначаем обработчик клика для каждого заголовка аккордеона
items.forEach(item => item.addEventListener('click', toggleAccordion));









document.querySelectorAll('.block').forEach(block => {
    const img = block.querySelector('.zag img');
    const originalSrc = img.getAttribute('src');
    const hoverSrc = img.dataset.hover;

    if (hoverSrc) {
        block.addEventListener('mouseenter', () => {
            img.setAttribute('src', hoverSrc);
        });

        block.addEventListener('mouseleave', () => {
            img.setAttribute('src', originalSrc);
        });
    }
});





// переключение актив на мобильной шапке
  document.querySelectorAll('.nav-mobile .icons a').forEach(link => {
    const img = link.querySelector('img');
    const activeSrc = img.dataset.active;
    const defaultSrc = img.getAttribute('src');

    if (link.classList.contains('active') && activeSrc) {
      img.setAttribute('src', activeSrc);
    } else {
      img.setAttribute('src', defaultSrc);
    }
  });










ymaps.ready(init);

let map, placemark;

function isMobile() {
  return window.innerWidth < 768;
}

function getCenterCoords() {
  return isMobile() ? [55.106800, 61.619700] : [55.107000, 61.621500];
}

function getPlacemarkCoords() {
  return isMobile() ? [55.106900, 61.619400] : [55.106920, 61.619370];
}

function getZoomLevel() {
  return isMobile() ? 16 : 17; // Зум 16 для мобильных, 17 для десктопа
}

function init() {
  map = new ymaps.Map('map', {
    center: getCenterCoords(),
    zoom: getZoomLevel(),
    controls: ['zoomControl', 'fullscreenControl']
  });

  placemark = new ymaps.Placemark(
    getPlacemarkCoords(),
    {},
    {
      balloonVisible: false,
      openBalloonOnClick: false,
      hasHint: false,
      iconLayout: 'default#image',
      iconImageHref: '/img/contacts/map.png',
      iconImageSize: [60, 60],
      iconImageOffset: [-20, -40]
    }
  );

  map.geoObjects.add(placemark);
}

// При изменении размера — пересчитываем центр, метку и ЗУМ
window.addEventListener('resize', function () {
  if (map && placemark) {
    const newCenter = getCenterCoords();
    const newPlacemarkCoords = getPlacemarkCoords();
    const newZoom = getZoomLevel();

    map.setCenter(newCenter);
    placemark.geometry.setCoordinates(newPlacemarkCoords);
    map.setZoom(newZoom);
  }
});


