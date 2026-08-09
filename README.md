# Word Search Puzzle Generator 🧩

A tool for generating word search puzzles instamagically.

![Word Search Puzzle Example](./example.png)

## About

Generates a specific size square word search puzzle with the given words.

The algorithm makes sure that each word given is used once in the puzzle.

If the puzzle with the given constraints is not able to be created, it will stop the program and alert the user.

## Features

Answer key for the puzzle with colored, highlighted letters generated as well.

Puzzle has a chance of containing diagonal or overlapping words.

Prevents the user from making palindrome words to avoid player confusion.

## Algorithm

Uses the Monte Carlo method and encourages overlap of words by natural selection.

Has a limited number of iterations before the current configuration is given up and a new one is attempted.

Every time the algorithm decides to place a word into the puzzle, it cannot move it unless the algorithm is reinstantiated.
