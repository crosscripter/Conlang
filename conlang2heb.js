var vowels = ['A', 'E', 'I', 'O', 'U'];

var charMap = {
	'A' : 'I',
	'B' : 'Y',
	'D' : 'T',
	'E' : 'O',
	'F' : 'TS',
	'G' : 'D',
	'H' : 'R',
	'I' : 'A',
	'J' : 'S',
	'K' : 'L',
	'L' : 'K',
	'M' : 'Z',
	'N' : 'N',
	'O' : 'E',
	'P' : 'G',
	'Q' : 'P',
	'R' : 'V',
	'S' : 'M',
	'T' : 'SH',
	'U' : 'EI',
	'V' : 'F',
	'W' : 'KH',
	'Y' : 'H'
};

var hebMap = {
	'I' : 'יִ', 
	'Y' : 'י', 
	'TS' : 'צ',
	'T' : 'ת',
	'O' : 'ׄו',
	'U' : 'ּו',
	'D' : 'ד',
	'R' : 'ר',
	'A' : 'ַ',
	'H' : 'ה',
	'SH' : 'ש',
	'S' : 'ס',
	'L' : 'ל',
	'KH' : 'ח',
	'K' : 'ק',
	'Z' : 'ז',
	'N' : 'נ',
	'EI' : 'ֵ',
	'E' : 'ֶ', // 'ע',
	'G' : 'ג',
	'P' : 'פ',
	'V' : 'ב',
	'M' : 'מ',
	'F' : 'פ'
};

function getCase(letter) {
	var casing = letter === letter.toUpperCase() ? "upper" : "lower";
	return casing;
}

function recase(letter, casing) {
	return casing === "upper" ? letter[0].toUpperCase() + letter.substring(1).toLowerCase() 
							  : letter[0].toLowerCase() + letter.substring(1).toLowerCase();
}

function translateLetter(letter) {
	var casing = getCase(letter);
	letter = letter.toUpperCase();
	letter = ['C', 'X'].indexOf(letter) !== -1 ? 'K' : letter;
	letter = letter === 'Z' ? 'S' : letter;
	var zletter = charMap[letter] || letter;
	zletter = recase(zletter, casing);
	return zletter;
}

function replaceDoubleConsonants(word) {
	var lastLetter = '';
	var letters = [];

	for (var i = 0, z = word.length; i < z; i++) {
		var letter = word[i];
		var casing = getCase(letter);
		letter = letter.toUpperCase();

		if (letter === lastLetter && vowels.indexOf(letter) === -1) {
		} else {
			letters.push(recase(letter, casing));
		}

		lastLetter = letter;
	}

	return letters.join('');
}

function addEndingA(word) {	
	if (/[^AEIOU]{2}$/i.test(word) && !/[AEIOU](NT|SH|TS)$/i.test(word)) {
		word += 'ah';
	}
	return word;
}

function replaceEndingOwithA(word) {
	if (/O$/i.test(word)) {
		word = word.substring(0, word.length - 1) + 'ah';
	}
	return word;
}

function replaceOsWithU(word) {
	return word.replace(/O{2}/gi, 'u');
}

function replaceEsWithEi(word) {
	return word.replace(/E{2}/gi, 'ei');
}

function replaceEiis(word) {
	return word.replace(/EII/gi, 'ei');
}

function translateWord(word, firstWord) {
	firstWord = firstWord || false;
	if (!firstWord && word[0] && getCase(word[0]) === "upper") return word;
	word = replaceDoubleConsonants(word);
	var letters = word.split('');	
	var zword = letters.map(translateLetter).join('');
	zword = addEndingA(zword);
	zword = replaceEndingOwithA(zword);
	zword = replaceOsWithU(zword);
	zword = replaceEsWithEi(zword);
	zword = replaceEiis(zword);
	zword = replaceDoubleConsonants(zword);	
	return zword;
}

function translate(phrase) {
	var words = phrase.split(' ');
	var fw = true;
	return phrase = words.map(function(w) {
		return w.replace(/(\W*)([\w]*)(\W*)/g, function(_, $1, $2, $3) {
			return $1 + translateWord($2, fw) + $3;
		});
		fw = false;
	}).join(' ');
}

function toHebrew(phrase) {
	var words = phrase.toUpperCase().split(' ');
	words = words.map(toHebrewWord);
	var hphrase = "";
	for (var i = words.length - 1; i >= 0; i--) {
		hphrase += words[i] + ' ';
	}
	return hphrase.replace(/^\s*|\s*$/g, "");
}

function toHebrewWord(word) {
	var letters = [];

	for (var i = 0; i < word.length; i++) {
		var letter = word[i];
		var nextLetter = word[i + 1];
		var hebLetter = hebMap[letter + nextLetter] || null;

		if (hebLetter) {
			if (i === 0) {
				if (hebLetter === 'ײ') {
					hebLetter = 'ײע';
				}
			}
			i++;
		} else { 
			hebLetter = hebMap[letter];

			if (/[^a-z]/i.test(letter)) {
				hebLetter = letter;
			}

			if (i === 0) {
				if (['A', 'I', 'O', 'U'].indexOf(letter) !== -1) {
					hebLetter = hebMap[letter] + 'א' ;
				} else if (letter === 'E') {
					hebLetter = 'ע';
				}
			}
		}

		if (i === word.length - 1) {
			if (hebLetter === 'מ') {
				hebLetter = 'ם';
			} else if (hebLetter === 'צ') {
				hebLetter = 'ץ';
			} else if (hebLetter === 'פ') {
				hebLetter = 'ף';
			} else if (hebLetter === 'נ') {
				hebLetter = 'ן';
			} else if (letter === 'E' && nextLetter === 'I') {
				hebLetter = 'ײ'
			} else if (letter === 'E') {
				hebLetter = 'ה';
			}
		}

		letters.unshift(hebLetter);
	}

	return letters.join('');
}

function toHebrewLetter(letter) {
	letter = letter.toUpperCase();
	return hebMap[letter] || letter;
}
