/** 
File: Conlang.cs 
Date: 6/9/17
Author: @crosscripter
Description: A simple translator for my personal constructed language.
usage: $ conlang "<phrase|file>"

Copyright (C) @crosscripter 2017-2018.
All Rights Reserved (R).
*/

using System;
using System.IO;
using System.Linq;
using static System.Console;
using System.Collections.Generic;
using System.Text.RegularExpressions;


class Conlang
{
    static class Translator
    {
        static Dictionary<string,string> VowelMap = new Dictionary<string,string>
        {
            {"A", "I"},
            {"E", "O"},
            {"I", "A"},
            {"O", "E"},
            {"U", "Ey"}
        };

        static Dictionary<string,string> ConsonantMap = new Dictionary<string,string>
        {
            {"B", "Y"},
            {"D", "T"},
            {"F", "Ts"},
            {"G", "D"},
            {"H", "R"},
            {"J", "S"},
            {"K", "L"},
            {"L", "K"},
            {"M", "Z"},
            {"P", "G"},
            {"R", "V"},
            {"S", "M"},
            {"T", "Sh"},
            {"V", "F"},
            {"W", "'H"},
            {"Y", "'"},
            {"Z", "H"}
        };

        static bool IsVowel(string letter) => VowelMap.ContainsKey(letter.ToUpper());
        
        static bool IsConsonant(string letter) => ConsonantMap.ContainsKey(letter.ToUpper());

        enum Case { Upper, Lower }

        static Case GetCase(string letter) => letter.ToUpper() == letter ? Case.Upper : Case.Lower;

        static string SetCase(string text, Case @case)
        {
            switch (@case) 
            {
                case Case.Upper: return text.ToUpper();
                case Case.Lower: return text.ToLower();
                default: return text;
            }
        }

        static string ReplaceCase(string text, string pattern, string replacement)
        {
            var casing = GetCase(text);
            replacement = SetCase(replacement, casing);
            return Regex.Replace(text, pattern, replacement, RegexOptions.IgnoreCase);
        }

        public static string TranslateLetter(string letter)
        {
            var map = IsVowel(letter) ? VowelMap 
                    : IsConsonant(letter) ? ConsonantMap 
                    : null;

            if (map == null) return letter;
            var casing = GetCase(letter);
            var newLetter = map[letter.ToUpper()];
            return SetCase(newLetter, casing);
        }

        public static string TransformKSounds(string text) => ReplaceCase(text, "[CQX]", "K");

        public static string TranslateWord(string word)
        {   
            WriteLine("TranslateWord");
            word = TransformKSounds(word);
            var letters = word.ToCharArray();
            WriteLine($"TranslateWord: letters = {string.Join(",", letters)}");
            letters = letters.Select(l => TranslateLetter(l.ToString())).ToArray();
            return string.Join(string.Empty, letters);
        }

        public static string Translate(string text)
        {
            WriteLine("Translate");
            var words = text.Split(' ');
            WriteLine($"Translate: words = {string.Join(",", words)}");
            words = words.Select(TranslateWord).ToArray();
            WriteLine($"Translate: words translated = {string.Join(",", words)}");
            return string.Join(" ", words);
        }
    }

    static void Main(string[] args)
    {
        // Read the commandline arguments.
        // If we have none display usage and exit
        if (args.Length == 0)
        {
            WriteLine(@"Usage: conlang ""<phrase|file>""");
            return;
        }

        // Check the type of the argument passed
        var arg = args[0];

        // Argument is a file, text comes from file content
        var isFile = File.Exists(arg);
        var text = isFile ? File.ReadAllText(arg) : arg;

        // Translate text and display
        var translation = Translator.Translate(text);
        WriteLine($"translation: {translation}, from file? {isFile}");
    }
}