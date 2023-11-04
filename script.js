'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jackie Duong',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 333, 1121, 3343],
  interestRate: 1.1, // %
  pin: 1,
};

const account2 = {
  owner: 'Jessica New',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2,
};

const account3 = {
  owner: 'Steven Thomas',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4,
};

const accounts = [account1, account2, account3, account4];

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

// display Movements
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}</div>
        <div class="movements__value">${mov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayBalance
const displayBalance = function (acc) {
  const balance = acc.movements.reduce((sum, acc) => sum + acc, 0);
  acc.balance = balance;
  labelBalance.textContent = `${acc.balance} EUR`;
};
console.log(accounts);

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

//calSummary
const calSummary = function (acc) {
  const sumIn = acc.movements
    .filter(accs => accs > 0)
    .reduce((sum, accs) => sum + accs, 0);
  labelSumIn.textContent = `${sumIn} EUR`;

  const sumOut = acc.movements
    .filter(accs => accs < 0)
    .reduce((sum, accs) => sum + accs, 0);
  labelSumOut.textContent = `${Math.abs(sumOut)} EUR`;

  const interest = acc.movements
    .filter(accs => accs > 0)
    .map(accs => (accs * acc.interestRate) / 100)
    .reduce((sum, accs) => sum + accs, 0);
  labelSumInterest.textContent = `${Math.trunc(interest)} EUR`;
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
    //clear input
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);
  }
});
const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);
  // display balance
  displayBalance(acc);
  //display summary
  calSummary(acc);
};

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

//
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(acc => {
    return (
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
    );
  });
});

// const movements = [430, 5000, -1000, 700, -50, 90, 1000];

///////////////////////////////////////////////
///////////////////////////////////////////////
// LECTURES;

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
