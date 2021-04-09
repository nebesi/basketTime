'use strict'
/**
 * @property {Object} goods Объект с данными карточки.
 * @property {Array} goods.src здесь лежат src, которые в будущем понадобятся для переключения картинок галлереи
 * @property {string} goods.srcMain src, который использован для лого карточки. В будущем, исходя из этого параметра будет показана превью картинка в галлерее
 */
const catalog = {
    catalogField: null,

    goods: [
        {
            id: 1,
            name: 'мышка',
            price: 3400,
            src: ['images/mouse.png', 'images/000076585.jpg'],
            srcMain: 'images/mouse.png',
        },
        {
            id: 2,
            name: 'клавиатура',
            price: 2000,
            src: ['images/1200px-IBM_Model_M_1395622_keyboard.jpg', 'images/hyperx1.jpg', 'images/mouse.png'],
            srcMain: 'images/1200px-IBM_Model_M_1395622_keyboard.jpg',
        }
    ],

    init(catalogF, cart) {
        this.catalogField = document.querySelector(`#${catalogF}`)
        this.cart = cart;
        this.render(this.goods);
        this.addListener();
    },

    render(goods) {
        goods.forEach(element => {
            this.catalogField.insertAdjacentHTML('afterbegin', this.createItem(element))
        });
    },

    addListener() {
        this.catalogField.addEventListener('click', event => { this.addToBusket(event) })
    },

    addToBusket(event) {
        if (!event.target.classList.contains('buy')) return;
        const id_product = +event.target.dataset.id;
        this.cart.addToBusket(id_product);
    },

    createItem(el) {
        let imgs = new Image();
        imgs = el.srcMain;
        return (
            `<div class="item-catalog">
            <img src="${imgs}" class="logo" alt="${el.name}" data-id="${el.id}">
            <div>${el.name}</div>
            <div>${el.price}</div>
            <button class="buy" data-id="${el.id}">купить</button>
            </div>`
        )
    },
};

const cart = {
    cartField: null,
    cartClearBtn: null,
    busket: [],
    goods: [],

    init(cartBlock, btnClear, catalogGoods) {
        this.cartField = document.querySelector(`#${cartBlock}`);
        this.cartClearBtn = document.querySelector(`.${btnClear}`);
        this.goods = catalogGoods;
        this.render();
        this.clearBusket(this.cartClearBtn);

    },

    addToBusket(id) {
        const product = this.FindProductInCatalog(id);

        if (product) {
            const findInBusket = this.busket.find((product) => product.id === id);
            if (findInBusket) {
                findInBusket.quantity++;
            } else {
                this.busket.push({ ...product, quantity: 1 })
            }
            this.render()
        } else {
            alert('ошибка');
        }
    },

    FindProductInCatalog(id) {
        return this.goods.find(product => product.id === id)
    },

    render() {
        if (this.busket.length) {
            this.cartField.innerHTML = '';
            this.busket.forEach(element => { this.renderBusket(element) })
            this.cartField.insertAdjacentHTML('beforeend', this.showTotalPrice())
        }
        else {
            this.cartField.innerHTML = '';
            this.cartField.insertAdjacentHTML('beforeend', '<div>корзина пуста</div>')
        }

    },

    showTotalPrice() {
        let sum = 0;
        let count = 0;
        if (!this.busket.length) return sum;
        this.busket.forEach(element => {
            sum += element.price * element.quantity;
            count += element.quantity;

        })
        return (`<div>
        в корзине ${count} товаров на сумму ${sum}
        </div>`);
    },

    renderBusket(el) {
        this.cartField.insertAdjacentHTML('afterbegin', this.renderCart(el))
    },

    renderCart(el) {
        return (
            `<div class="item">
            <div>${el.name}</div>
            <div>${el.price}</div>
            <div>${el.quantity}</div>
            </div>`
        )
    },

    clearBusket(btn) {
        const BtnClear = btn;
        BtnClear.addEventListener('click', this.deleteItems.bind(this))
    },

    deleteItems() {
        this.busket = [];
        this.render();
    }

};


//галлерея (тут у меня начался гемор с попыткой сделать все как нужно)

/**
 * @property {Object} settings Объект с настройками галлереи.
 * @property {string} settings.findObjWithSrc по клику на карточку сюда подбирается соответсвующий ей объект из (массива каталога) со всеми src, которые будут участвовать в слайдере
 * @property {string} settings.srcMain src, главным образом он меняется по клику на кнопку next. находится его позиция в @property {string} settings.findObjWithSrc и меняется на следующую
 */

const gallery = {
    catalog,

    settings: {
        imageArea: '#catalog',
        findObjWithSrc: null,
        openedImageClass: 'openedImg',
        screenContainer: null,
        btnClose: null,
        btnNext: null,
        srcMain: null
    },

    init() {
        document.querySelector(this.settings.imageArea).addEventListener('click', e => this.clickHandler(e))
    },

    clickHandler(e) {
        if (e.target.tagName !== 'IMG') return;

        this.settings.findObjWithSrc = this.catalog.goods.find(el => el.id === +e.target.dataset.id);
        this.settings.srcMain = this.settings.findObjWithSrc.srcMain;

        this.openImage()
    },

    openImage() {
        this.createScreenContainer().querySelector(`.${this.settings.openedImageClass}`).src = this.settings.srcMain;
    },

    createScreenContainer() {
        let screen = document.createElement('div');
        screen.classList.add('image-area');

        let imageArea = new Image();
        imageArea.classList.add(this.settings.openedImageClass);
        screen.appendChild(imageArea);

        let closeBtn = document.createElement('div');
        closeBtn.classList.add('close');
        closeBtn.addEventListener('click', this.close)
        screen.appendChild(closeBtn);

        let nextBtn = document.createElement('div');
        nextBtn.classList.add('next');
        nextBtn.addEventListener('click', this.nextImg.bind(this));
        screen.appendChild(nextBtn);

        document.body.appendChild(screen);

        return screen;
    },

    nextImg() {
        let numberOfSrc = this.settings.findObjWithSrc.src.indexOf(this.settings.srcMain);


        if (numberOfSrc >= this.settings.findObjWithSrc.src.length - 1) {
            numberOfSrc = 0;
            this.settings.srcMain = this.settings.findObjWithSrc.src[numberOfSrc];
            document.querySelector('.openedImg').src = this.settings.srcMain;
            return;
        }


        this.settings.srcMain = this.settings.findObjWithSrc.src[++numberOfSrc];

        document.querySelector('.openedImg').src = this.settings.srcMain;

    },

    close() {

        document.querySelector('.image-area').remove();
    }
};

catalog.init('catalog', cart);
cart.init('cart', 'btn-clear', catalog.goods);

gallery.init();

