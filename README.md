# Asita's Match

A card matching game you can play in the browser on phones, tablets, laptops and desktop computers.

All the cards lie face down on the table. Turn over two at a time to find the matching pairs. A timer measures how fast you clear the table.

## How to play

- **Board size:** 4 × 4, 5 × 5, 6 × 6, 7 × 7 or 8 × 8. Custom lets you choose any number of rows and columns from 2 to 8.
- **Odd boards:** when the board has an odd number of spaces (for example 5 × 5 = 25), the middle space is a free ★ space, so every card still has a partner.
- **Turning cards:** tap a card, then a second one. A matching pair stays face up. Two cards that don't match turn back over after a moment. Tap another card to turn them back at once and play faster.
- **Timer:** starts on your first tap and stops when you find the last pair. It shows minutes, seconds and tenths. Each try at a pair counts as one move.
- **Pause:** the board is hidden while the game is paused, and the game pauses itself if you switch to another app or tab.
- **Objects:** pictures (emoji), coloured shapes, numbers, letters and playing cards. You choose which kinds to include. Each round deals objects you didn't have in the previous round where possible.
- **Results:** after each round you see your time, moves, misses and accuracy, plus a table of every round you've played this visit. Your best time and fewest moves for each board size are saved on your device.

## Devices

- The board is sized to fit the whole screen without scrolling. On a phone held sideways, a rectangular board turns to fit.
- Cards are buttons, so the game works with touch, a mouse or a keyboard. Arrow keys move between cards, and Enter or Space turns one over.
- The page respects iPhone notches and safe areas, supports light and dark mode, and can be added to the home screen.

## Running locally

The site is plain HTML, CSS and JavaScript with no build step. Open `index.html` in a browser, or serve the folder:

```sh
npx serve .
```

## Deploying

Import the repository into Vercel. No framework or build settings are needed: Vercel serves the files as a static site.
