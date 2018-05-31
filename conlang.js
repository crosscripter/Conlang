var fs = require('fs');

var vowels = ['A', 'E', 'I', 'O', 'U'];

function isVowel(letter) { 
	return vowels.indexOf(letter.toUpperCase()) !== -1; 
}

var consonants = [
	'B', 'C', 'D', 'F', 'G', 'H', 'J', 
	'K', 'L', 'M', 'N', 'O', 'P', 'Q', 
	'R', 'S', 'T', 'V', 'W', 'X', 'Y', 
	'Z'
];

function isConsonant(letter) {
	return !isVowel(letter);
}

var letterMap = {
	'A': 'I', 
	'I': 'A',
	'E': 'O', 
	'O': 'E',
	'U': 'E',
	'B': 'Y',
	'D': 'T',
	'F': 'TS',
	'G': 'D',
	'H': 'R',
	'J': 'S',
	'K': 'L',
	'L': 'K',
	'M': 'Z',
	'P': 'G',
	'Q': 'P',
	'R': 'V',
	'S': 'M',
	'T': 'SH',
	'V': 'F',
	'W': 'KH',
	'Y': "'A",
	'Z': 'H'
};

function getCase(letter) {
	return letter.toUpperCase() === letter ? "upper" : "lower";
}

function setCase(letter, casing) {
	return casing === "upper" ? letter.toUpperCase() : letter.toLowerCase();
}

function mapLetter(letter) {
	var originalLetter = letter;
	letter = letter.toUpperCase();

	switch (letter) {
		case 'C':
		case 'X':
			letter = 'K';
		default:
			var newLetter = letterMap[letter] || letter;
			break;
	}

	var casing = getCase(originalLetter);
	return setCase(newLetter, casing);
}

function doubleLetters(word) {
	return word.replace(/([^AEIOU]{1,2})\1/ig, function(s, $1) { 
		return s.substring(0, $1.length); 
	});
}

function replaceCase(source, letter) {
	var casing = getCase(source);
	letter = setCase(letter, casing);
	return letter;
}

function tripleConsonant(word) {
	return word.replace(/([^AEIOUHY]{3})/gi, function(s) {
		return s.substring(0, 2) + replaceCase(s, 'a') + s[s.length - 1];
	});
}

function endingConsonant(word) {
	if (!/(SH|TS|KH|NT)$/i.test(word)) {	
		word = word.replace(/([^AEIOU\W]{2})$/i, '$1' + replaceCase(word, 'a'));
	}
	return word;
}

function doubleO(word) {
	return word.replace(/OO/i, replaceCase(word, 'u'));
}

function doubleE(word) {
	return word.replace(/EE/i, replaceCase(word, "ey"));
}

function endingO(word) {
	return word.replace(/([A-Z]+)O$/i, '$1' + replaceCase(word, 'a'));
}

function mapWord(word) {
	var newWord = word.split('').map(mapLetter).join('');
	var transforms = [doubleLetters, tripleConsonant, endingConsonant, doubleO, doubleE, endingO];
	transforms.forEach(function(transform) { newWord = transform(newWord); });
	return newWord;
}

function translate(phrase) {
	return phrase.replace(/(\w+)\b/g, mapWord);
}

function random(items) {
	return items[Math.floor(Math.random() * items.length)];
}

var text = fs.readFileSync("C:/users/mikes/dropbox/docs/kjv.txt", "utf-8");
fs.writeFileSync("C:/users/mikes/dropbox/docs/kjv.conlang.txt", translate(text), "utf-8");
