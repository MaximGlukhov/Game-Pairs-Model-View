(() => {
  let container = document.querySelector('.container');
  let form = document.createElement('form');
  form.classList.add('form');
  container.append(form);
  let titleForm = document.createElement('p');
  titleForm.textContent = "Количество карточек по горизонтали и вертикали:";
  titleForm.classList.add('title-form');
  form.append(titleForm);
  let input = document.createElement('input');
  input.classList.add('input');
  input.type = 'number';
  input.placeholder = "Введите число:";
  let btnInput = document.createElement('button');
  btnInput.textContent = 'Старт';
  btnInput.classList.add('start-btn');
  form.append(input);
  form.append(btnInput);
  let timer;
  let time = document.createElement('div');
  time.textContent = "Время:";
  time.classList.add('none', 'desc-time');
  form.append(time);
  let displayTimer = document.createElement('div');
  displayTimer.classList.add('display-timer');
  form.append(displayTimer);
  let list = document.createElement('ul');
  list.classList.add('table');
  container.append(list);

  let btnRestart = document.createElement('button');
  btnRestart.classList.add('btn-restart');
  btnRestart.textContent = "Сыграть ещё раз";

  let firstCard = null;
  let secondCard = null;
  let firstCardView;
  let secondCardView;
  let GameStepState = {
    NoCardOpen: 'no_card_open',
    OneCardOpen: 'one_card_open'
  };
  let currentGameStepState = GameStepState.NoCardOpen;

  function getFromLocalStorage() {
    let fromLocalStorage = localStorage.getItem('key');
    return fromLocalStorage && JSON.parse(fromLocalStorage);
  }

  let cards = [] || getFromLocalStorage();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    startGame();
    startTimer();
    btnInput.classList.add('none');
    time.classList.remove('none');
  });

  function getBoardSize(size) {
    size = input.value;
    if (size > 10 || size < 2 || size % 2 !== 0) {
      size = 4;
    };
    input.value = size;
    return size;
  };

  function generateCard(size) {
    size = input.value;
    let currentID = 0;
    for (let i = 1; i <= (size ** 2) / 2; i++) {
      cards.push({ id: ++currentID, value: i, isOpen: false });
      cards.push({ id: ++currentID, value: i, isOpen: false });
      localStorage.setItem('key', JSON.stringify(cards));
    }
    return cards;
  }

  function shuffle(arr) {
    let j, temp;
    for (let i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
  }

  function createCard({ value, isOpen }) {
    let item = document.createElement('li');
    item.classList.add('card');
    let backImg = document.createElement('div');
    let frontImg = document.createElement('div');
    item.append(backImg);
    item.append(frontImg);
    frontImg.classList.add('front');
    backImg.classList.add('back');
    if (value == 1) frontImg.classList.add('goro');
    if (value == 2) frontImg.classList.add('kabal');
    if (value == 3) frontImg.classList.add('kano');
    if (value == 4) frontImg.classList.add('lu');
    if (value == 5) frontImg.classList.add('nub');
    if (value == 6) frontImg.classList.add('scorpion');
    if (value == 7) frontImg.classList.add('shao');
    if (value == 8) frontImg.classList.add('zero');
    if (isOpen == false) item.classList.remove('rotate')
    return item;
  }


  function updateGameBoard() {
    for (let card of cards) {
      let cardView = createCard(card);
      cardView.id = card.id;
      list.append(cardView);
      cardView.addEventListener('click', flipCard);
      function flipCard() {
        switch (currentGameStepState) {
          case GameStepState.NoCardOpen:
            firstCard = card;
            firstCardView = document.getElementById(firstCard.id);
            firstCardView.classList.add('rotate');
            currentGameStepState = GameStepState.OneCardOpen;
            break;
          case GameStepState.OneCardOpen:
            secondCard = card;
            secondCardView = document.getElementById(secondCard.id);
            secondCardView.classList.add('rotate');
            if (firstCard.value !== secondCard.value) {
              setTimeout(() => {
                firstCardView.classList.remove('rotate');
                secondCardView.classList.remove('rotate');
              }, 300);
            }
            else {
              firstCard.isOpen = true;
              secondCard.isOpen = true;
              if (document.querySelectorAll('.card').length == document.querySelectorAll('.card.rotate').length) {
                container.append(btnRestart);
                for (let card of cards) {
                  card.isOpen = false;
                  if (card.isOpen == false) {
                    cardView.classList.remove('rotate');
                  }
                }
                startTimer();
              }
              secondCard = null;
              firstCard = null;
              localStorage.setItem('key', JSON.stringify(cards));
            }
            currentGameStepState = GameStepState.NoCardOpen;
            break;
        }
      }
    };
    return list;
  };

  btnRestart.addEventListener('click', () => {
    location.reload();
  });

  function countSec() {
    if (seconds === 0) {
      clearInterval(timer);
      document.querySelectorAll('.card.rotate').forEach(c => c.classList.remove('rotate'));
      for (let card of cards) {
        card.isOpen = false;
        localStorage.setItem('key', JSON.stringify(cards));
      }
      container.append(btnRestart);
    }
    displayTimer.textContent = seconds--;
  }

  function startTimer() {
    clearInterval(timer);
    seconds = 120;
    timer = setInterval(countSec, 1000);
  }

  function startGame() {
    cards.splice(0, cards.length);
    localStorage.setItem('key', JSON.stringify(cards));
    const boardSize = getBoardSize(Number.parseInt(input.value));
    cards = shuffle(generateCard(boardSize));
    localStorage.setItem('key', JSON.stringify(cards));
    updateGameBoard();
  }

})();

