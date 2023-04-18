'use strict';

const billInput = document.getElementById('bill');
const peoplesInput = document.getElementById('number');
const customTipField = document.getElementById('custom-tip');
const tipAmountField = document.querySelector('[data-output="amount"]');
const totalField = document.querySelector('[data-output="total"]');
const tipsWrapper = document.querySelector('.tips-wrapper');
const tips = document.querySelectorAll('[data-id="tip"]');
const resetBtn = document.getElementById('reset');

let tipAmount = 0;
let total = 0;
let tipPercentage = 0;
let bill = 0;
let people = 1;

document.querySelectorAll('.input-field').forEach((elem) => {
	elem.addEventListener('keypress', (event) => {
		const key = event.key;
		const reg = /^\d+(\.?\d{0,2})?$/;
		const value = event.currentTarget.value + key;
		if (!reg.test(value)) {
			event.preventDefault();
		}
	});
});

billInput.addEventListener('input', (e) => {
	let set = e.target.closest('.form__set');
	if (!e.target.value || parseFloat(e.target.value) === 0) {
		set.classList.add('invalid');
	} else {
		set.classList.remove('invalid');
	}
	bill = parseFloat(e.target.value);

	recalculate();
});

tipsWrapper.addEventListener('click', (e) => {
	e.preventDefault();
	if (!e.target.classList.contains('tip')) return;
	tipPercentage = e.target.dataset.value;
	setSelection(e.target);
	resetBtn.removeAttribute('disabled');
	recalculate();
});

customTipField.addEventListener('focus', (e) => {
	setSelection(e.currentTarget);
});

customTipField.addEventListener('input', (e) => {
	if (e.target.value !== '') tipPercentage = parseFloat(e.target.value);
	else tipPercentage = 0;
	recalculate();
});

peoplesInput.addEventListener('input', (e) => {
	let set = e.target.closest('.form__set');
	if (!e.target.value || parseFloat(e.target.value) === 0) {
		set.classList.add('invalid');
	} else {
		set.classList.remove('invalid');
	}
	people = parseFloat(e.target.value);

	recalculate();
});

resetBtn.addEventListener('click', reset);

function reset() {
	people = 1;
	tipPercentage = 0;
	bill = 0;
	billInput.value = '';
	peoplesInput.value = '';
	setSelection(null);
	recalculate();
}

function setSelection(target) {
	tips.forEach((tip) => {
		if (tip === target) {
			tip.setAttribute('aria-selected', true);
		} else {
			tip.setAttribute('aria-selected', false);
		}
	});
}

function updateOutput() {
	tipAmountField.value = `$${tipAmount}`;
	totalField.value = `$${total}`;
	if (
		billInput.value != '' ||
		peoplesInput.value != '' ||
		![...tips].every((tip) => tip.getAttribute('aria-selected') === 'false')
	)
		resetBtn.removeAttribute('disabled');
	else resetBtn.setAttribute('disabled', '');
}

function recalculate() {
	tipAmount = roundingTwo((bill * tipPercentage) / 100 / people);
	total = roundingTwo(bill / people + tipAmount);
	updateOutput();
}

function roundingTwo(num) {
	return Math.round((num + Number.EPSILON) * 100) / 100;
}

recalculate();
