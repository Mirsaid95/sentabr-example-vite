
let currentSlide = 0;
let slides, dots, slideInterval;
let slidesWrapper;

function initializeSlider() {
    slides = document.querySelectorAll('.slide');
    slidesWrapper = document.querySelector('.slides-wrapper');
    const dotsContainer = document.querySelector('.dots-container');

    // Set background images
    slides.forEach(slide => {
        const imageUrl = slide.getAttribute('data-image');
        slide.style.backgroundImage = `url(${imageUrl})`;
    });

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    dots = document.querySelectorAll('.dot');

    // Set up navigation buttons
    document.querySelector('.prev').addEventListener('click', () => changeSlide(-1));
    document.querySelector('.next').addEventListener('click', () => changeSlide(1));

    updateSlider();
    startSlideShow();
}

function updateSlider() {
    slidesWrapper.style.transform = `translateX(-${currentSlide * 33.333}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function changeSlide(step) {
    currentSlide = (currentSlide + step + slides.length) % slides.length;
    updateSlider();
    resetSlideShow();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    resetSlideShow();
}

function startSlideShow() {
    slideInterval = setInterval(() => changeSlide(1), 5000);
}

function resetSlideShow() {
    clearInterval(slideInterval);
    startSlideShow();
}

document.addEventListener('DOMContentLoaded', initializeSlider);


import { getData } from './local.js';
const bestSellerCategories = document.querySelector('.bestSeller__categories');
const bestSellerProductsCards = document.querySelector('.bestSeller__products-cards');

  

bestSellerCategories.innerHTML=`
<button data-path="products" class="bestSeller__btn">All</button>
`
getData('products').then((data) => {
    data.map((item) => {
        bestSellerProductsCards.innerHTML += `
        <div class="bestSeller__product-card">
            <div class="bestSeller__product-card-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
                <div class="bestSeller__product-card-info">
                    <h3 class="bestSeller__product-card-title">${item.title}</h3>
                    <div class="bestSeller__product-card-price">
                        <span class="bestSeller__price">${item.price}$</span>
                        <span class="bestSeller__sale">-24% Off</span>
                        <span class="bestSeller__sale-price">${(item.price - (item.price / 100) * 24).toFixed(2)}$</span>
                    </div>
                    <div class="bestSeller__product-card-rating">
                        <span class="bestSeller__rating-count">${item.rating.count}<i class="fa-solid fa-eye"></i></span>
                        <span class="bestSeller__rating-rate">${item.rating.rate}<i class="fa-solid fa-star"></i></span>
                    </div>
                </div>
                <button data-path="products/${item.id}" class="bestSeller__product-card-btn">Add to cart <i class="fa-solid fa-cart-shopping"></i></button>
            </div>
        `
    })
})

getData('products/categories').then((data) => {
    data.map((item) => {
        bestSellerCategories.innerHTML += `
        <button data-path="products/category/${item}" class="bestSeller__btn">${item}</button>
        `
    })
})

bestSellerCategories.addEventListener('click', (e) => {
    if(e.target.classList.contains('bestSeller__btn')){
        const path = e.target.getAttribute('data-path');
        if(path){
            getData(path).then((data) => {

                bestSellerProductsCards.innerHTML = '';
                data.map((item) => {
                    bestSellerProductsCards.innerHTML += `
                    <div class="bestSeller__product-card">
                        <div class="bestSeller__product-card-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="bestSeller__product-card-info">
                            <h3>${item.title}</h3>
                            <div class="bestSeller__product-card-price">
                                <span>${item.price}</span>
                                <span>${(item.price - (item.price / 100) * 24).toFixed(2)}</span>
                                <span>-24% Off</span>
                            </div>
                            <div class="bestSeller__product-card-rating">
                                <span>${item.rating.count}</span>
                                <span>${item.rating.rate}</span>
                            </div>
                        </div>
                        <button data-path="products/${item.id}" class="bestSeller__product-card-btn">Add to cart</button>
                    </div>
                    `
                })

            })
        }
    }

})

bestSellerProductsCards.addEventListener('click', (e) => {
    const path = e.target.dataset.path;
    if(path){
        getData(path).then((data) => {
            saveLocal(data);
            renderLocal();
        })
    }
})

function saveLocal(data) {
    const localData = JSON.parse(localStorage.getItem('data')) || [];
    const newData = localData.filter((item) => item.id !== data.id);
    localStorage.setItem('data', JSON.stringify([data, ...newData]));
}
const shopping = document.querySelector('.shopping')
const drower = document.querySelector('.drower')

function renderLocal(){
    const localData = JSON.parse(localStorage.getItem('data'));
    if(localData){
        drower.innerHTML = '';
        localData.map(item =>{
            drower.innerHTML += `
            <div class="bestSeller__product-card">
                        <div class="bestSeller__product-card-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="bestSeller__product-card-info">
                            <h3 class="bestSeller__text">${item.title}</h3>
                            <div class="bestSeller__product-card-price">
                                <span>${item.price}</span>
                                <span>${(item.price - (item.price / 100) * 24).toFixed(2)}</span>
                                <span>-24% Off</span>
                            </div>
                            <div class="bestSeller__product-card-rating">
                                <span>${item.rating.count}</span>
                                <span>${item.rating.rate}</span>
                            </div>
                        </div>
                        <button data-delete="${item.id}" class="bestSeller__product-card-btn">Delete</button>
                    </div>
            `
        })
    }
}

shopping.addEventListener('click', (e) => {
            drower.classList.toggle('active');
        renderLocal();
    
})

drower.addEventListener('click', (e) => {
    const deleteid = e.target.dataset.delete;
    if(deleteid){
        deleteLocal(deleteid);
        renderLocal();
    }

})
function deleteLocal(id){
    let newId = Number(id);
    const localData = JSON.parse(localStorage.getItem('data'));
    const newData = localData.filter((item) => item.id !== newId);
    localStorage.setItem('data', JSON.stringify(newData));
    renderLocal();
}


setInterval(() => {
let localData = JSON.parse(localStorage.getItem('data'));
if(localData){
    shopping.innerHTML = `
    <span class="show__count-wrapper">
    <i class="fa-solid fa-cart-shopping"></i>
    </span>
    <span class="show__count">${localData.length}</span>
    `
}
},3000)
