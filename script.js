document.addEventListener('DOMContentLoaded', () => {
    const totalPriceElement = document.querySelector('.total');
    const productCards = document.querySelectorAll('.card-body');
  
    const cart = new ShoppingCart();
  
    function updateTotalPrice() {
      const totalPrice = cart.getTotalPrice();
      totalPriceElement.textContent = `${totalPrice.toFixed(2)} $`;
    }
  
    function handleQuantityChange(event) {
      const cardBody = event.target.closest('.card-body');
      const productId = parseInt(cardBody.dataset.id);
      const productName = cardBody.dataset.name;
      const productPrice = parseFloat(cardBody.dataset.price);
  
      const product = new Product(productId, productName, productPrice);
      const quantityElement = cardBody.querySelector('.quantity');
      let quantity = parseInt(quantityElement.textContent);
  
      if (event.target.classList.contains('fa-plus-circle')) {
        quantity += 1;
        cart.addItem(product, 1);
      } else if (event.target.classList.contains('fa-minus-circle') && quantity > 0) {
        quantity -= 1;
        cart.addItem(product, -1);
      }
  
      quantityElement.textContent = quantity;
      updateTotalPrice();
    }
  
    function handleItemDeletion(event) {
      const cardBody = event.target.closest('.card-body');
      const productId = parseInt(cardBody.dataset.id);
      cart.removeItem(productId);
      cardBody.querySelector('.quantity').textContent = '0';
      updateTotalPrice();
    }
  
    function handleItemLike(event) {
      event.target.classList.toggle('liked');
      if (event.target.classList.contains('liked')) {
        event.target.style.color = 'red';
      } else {
        event.target.style.color = 'black';
      }
    }
  
    productCards.forEach(cardBody => {
      cardBody.querySelector('.fa-plus-circle').addEventListener('click', handleQuantityChange);
      cardBody.querySelector('.fa-minus-circle').addEventListener('click', handleQuantityChange);
      cardBody.querySelector('.fa-trash-alt').addEventListener('click', handleItemDeletion);
      cardBody.querySelector('.fa-heart').addEventListener('click', handleItemLike);
    });
  });
  
  class ShoppingCart {
    constructor() {
      this.items = [];
    }
  
    addItem(product, quantity) {
      const existingItem = this.items.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push(new ShoppingCartItem(product, quantity));
      }
      if (existingItem && existingItem.quantity <= 0) {
        this.removeItem(product.id);
      }
    }
  
    removeItem(productId) {
      this.items = this.items.filter(item => item.product.id !== productId);
    }
  
    getTotalPrice() {
      return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }
  }
  
  class ShoppingCartItem {
    constructor(product, quantity) {
      this.product = product;
      this.quantity = quantity;
    }
  }
  
  class Product {
    constructor(id, name, price) {
      this.id = id;
      this.name = name;
      this.price = price;
    }
  }
  