'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jackie Duong',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-05-27T17:01:17.194Z',
    '2023-07-11T23:36:17.929Z',
    '2023-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jonas Schmedtmann',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2,

  movementsDates: [
    '2022-11-04T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-11-05T18:49:59.371Z',
    '2023-11-06T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
//Event handler
let currentAccount;
//set now time
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth()}`.padStart(2, 0);
const year = now.getFullYear();
const hour = `${now.getHours()}`.padStart(2, 0);
const min = `${now.getMinutes()}`.padStart(2, 0);

//create Usernames
const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// display Movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const calcDaysPassed = (date1, date2) => {
      const days = Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
      console.log(days);
      if (days === 0) {
        const hour = `${date1.getHours()}`.padStart(2, 0);
        const min = `${date1.getMinutes()}`.padStart(2, 0);
        return `Today ${hour}:${min}`;
      } else if (days === 1) {
        const hour = `${date1.getHours()}`.padStart(2, 0);
        const min = `${date1.getMinutes()}`.padStart(2, 0);
        return `Yesterday ${hour}:${min}`;
      } else {
        return `${days} days ago`;
      }
    };

    const displayDate = calcDaysPassed(new Date(acc.movementsDates[i]), now);
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayBalance
const displayBalance = function (acc) {
  const balance = acc.movements.reduce((sum, acc) => sum + acc, 0);
  acc.balance = balance;
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

//calSummary
const calSummary = function (acc) {
  const sumIn = acc.movements
    .filter(accs => accs > 0)
    .reduce((sum, accs) => sum + accs, 0);
  labelSumIn.textContent = `${sumIn.toFixed(2)}€`;

  const sumOut = acc.movements
    .filter(accs => accs < 0)
    .reduce((sum, accs) => sum + accs, 0);
  labelSumOut.textContent = `${-sumOut.toFixed(2)}€`;

  const interest = acc.movements
    .filter(accs => accs > 0)
    .map(accs => (accs * acc.interestRate) / 100)
    .reduce((sum, accs) => sum + accs, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

//Login click
btnLogin.addEventListener('click', function (e) {
  // Prevent form form submitting
  e.preventDefault();

  currentAccount = accounts.find(acc => {
    return (
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
    );
  });

  if (currentAccount) {
    // display UI and Message
    document.querySelector('.app').classList.add('active');
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    // display Date
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    //clear input
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);
  }
});
const updateUI = function (acc) {
  // display movements
  displayMovements(acc);
  // display balance
  displayBalance(acc);
  //display summary
  calSummary(acc);
};

// Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
    currentAccount.movements.push(Math.abs(amount));
    currentAccount.movementsDates.push(now.toISOString());
    updateUI(currentAccount);
    console.log(`Loan complete`);
    inputLoanAmount.value = '';
  } else {
    console.log(`Loan error`);
    inputLoanAmount.value = '';
  }
});

//Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    receiverAcc &&
    receiverAcc?.username !== currentAccount?.username &&
    amount > 0 &&
    currentAccount.balance >= amount
  ) {
    //transfer
    currentAccount.movements.push(-Math.abs(amount));
    receiverAcc.movements.push(Math.abs(amount));
    //date update
    currentAccount.movementsDates.push(now.toISOString());
    receiverAcc.movementsDates.push(now.toISOString());
    //clear input
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    inputTransferTo.blur();

    //update UI
    updateUI(currentAccount);
    console.log('Transfer complete');
  } else {
    //clear input
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    inputTransferTo.blur();
    console.log('Transfer error');
  }
});

// Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    inputCloseUsername.value = inputClosePin.value = '';
    document.querySelector('.app').classList.remove('active');
  }
});

// Sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// document.querySelector('.app').classList.add('active');

// const movements = [430, 5000, -1000, 700, -50, 90, 1000];

///////////////////////////////////////////////
///////////////////////////////////////////////

// LECTURES;

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// //1
// dogs.forEach(function (dog) {
//   dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
// });
// //2

// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(
//   `Sarah's dog is eating ${
//     dogSarah.curFood >= dogSarah.recommendedFood ? `too much` : `to little`
//   }`
// );

// //3
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recommendedFood)
//   .flatMap(dog => dog.owners);
// console.log(ownersEatTooMuch);
// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recommendedFood)
//   .flatMap(dog => dog.owners);
// console.log(ownersEatTooLittle);

// //4
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);

// //5
// console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// //6
// const OKAY = dog =>
//   dog.curFood < dog.recommendedFood + dog.recommendedFood * 0.1 &&
//   dog.curFood > dog.recommendedFood - dog.recommendedFood * 0.1;
// console.log(dogs.some(OKAY));

// //7
// const dogOkey = dogs.filter(OKAY);
// console.log(dogOkey);

// //8
// const dogCopy = dogs
//   .slice()
//   .sort((a, b) => a.recommendedFood - b.recommendedFood);
// console.log(dogCopy);

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// //Map
// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });
// //Set
// const currenciesUnique = new Set([
//   'USD',
//   'EUR',
//   'GBP',
//   'USD',
//   'EUR',
//   'GBP',
//   'USD',
//   'EUR',
//   'GBP',
// ]);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${key} ${value}`);
// });

// //////////////////////////////////////

// for (const n of movements) {
//   if (n < 0) {
//     console.log(`you withdrew ${Math.abs(n)}`);
//   } else {
//     console.log(`you deposited ${n}`);
//   }
// }
// console.log(`-----------------------------`);
// movements.forEach(function (n, index, array) {
//   if (n < 0) {
//     console.log(`Movement ${index + 1}: you withdrew ${Math.abs(n)}`);
//   } else {
//     console.log(`Movement ${index + 1}: you deposited ${n}`);
//   }
// });

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];
// let arr2 = [534, 65, 43, 2, 3, 5, 5, 8];

// console.log(arr2.at(0));

// //getting last array element
// console.log(arr.at(-1));
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);

// //.at for string
// console.log('duong'.at(-1));

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE
// console.log(arr.slice(3));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2, 5));

// // SLICE shallow copy
// console.log(arr.slice());
// console.log([...arr]);

// // SPLICE like cut in windows
// console.log(arr.splice(-1));
// console.log(arr);

// // REVERSE
// console.log(arr.reverse());

// // CONCAT
// const letter = arr.concat(arr2);
// console.log(letter);
// console.log([...arr, ...arr2]);

// // JOIN
// console.log(letter.join('-'));
