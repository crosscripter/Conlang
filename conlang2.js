var letterMap = {
	'A' : 'I',
	'B' : 'Y',
	'C' : 'L',
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
	'W' : 'CH',
	'X' : 'LL',
	'Y' : "'",
	'Z' : 'H'
};

var charMap = {
    'Y' : 'י',
    'L' : 'ל',
    'TS' : 'צ',
    'T' : 'ת',
    'D' : 'ד',
    'R' : 'ר',
    'SH' : 'ש',
    'S' : 'ס',
    'K' : 'כ',
    'Z' : 'ז',
    'N' : 'נ',
    'G' : 'ג',
    'P' : 'פ',
    'V' : 'ב',
    'M' : 'מ',
    'F' : 'פ',
    'CH' : 'ח',
    'H' : 'ה'
};

var phrase = "Take it with a grain of salt";
phrase = phrase.toUpperCase();
var words = phrase.split(/\b/);
var newPhrase = "";

for (var word in words) {
    word = words[word];
    var newWord = "";
    
    for (var char in word) {
	    char = word[char];
	    var newChar = letterMap[char] || char;
	    newWord += newChar;
    }
    
    // If the word contains double E (=> OO)
    // replace with long U sound:
    newWord = newWord.replace(/O{2}/, 'U');
    
    // If the ending letter is an E (=> O)
    // replace with an AH
    newWord = newWord.replace(/O$/, 'AH');

    // Merge OU together to one sound (EI)
    newWord = newWord.replace(/EEI/g, 'EI');
    
    // If the word ends in ' change to 'A sound
    newWord = newWord.replace(/'$/, "'A");
    
    // If the ending letters are both consonants
    // then add an ending 'A'
    newWord = newWord.replace(/([^AEIOU']{2})$/, function($1) {
        if ($1 !== 'TS' && $1 !== 'NT' && $1 !== 'CH') { // && $1 !== 'SH') {
            return $1 + 'A';
        } else {
            return $1;
        }
    });

    newPhrase += newWord;
}

var hPhrase = "";

// Translate newPhrase into Hebrew characters
var newWords = newPhrase.split(/\b/);

for (var newWord in newWords) {
    newWord = newWords[newWord];
    var hWord = "";
    
    for (var i=0,m=newWord.length;i<m;i++) {
        var char = newWord[i];
        var nextChar = newWord[i+1];
        var hchar = '';
        
        if (charMap[char + nextChar]) {
            hchar = charMap[char + nextChar];
            i++;
            hWord += hchar;
            continue;
        } else {
            hchar = charMap[char] || '';
        }
        
        if (i === 0 && /[AEIOU]/.test(char)
        || /[AEIOU]/.test(char) && /[AEIOU]/.test(nextChar)) hchar = 'א';
        else if (i == m - 1 && /[AEIOU]/.test(char)) hchar = 'ה';
        if (/[\W]/.test(char)) hchar = char;
        hWord += hchar;
    }
    
    hPhrase += hWord;
}

console.log(phrase, '=', hPhrase, '(', newPhrase, ')');
