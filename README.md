# Chess Game

A modern chess game built with Next.js where you can play against a simple AI opponent. The game features a responsive design, piece movement validation, and game state tracking including check and checkmate detection.

## Features

- Interactive chessboard with drag-and-drop piece movement
- Valid move highlighting and validation
- Check and checkmate detection
- Simple AI opponent
- Responsive design for mobile and desktop
- Beautiful chess piece Unicode symbols

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14.0 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Getting Started

1. Clone the repository:
```bash
git clone [your-repository-url]
cd chess_game
```

2. Install the dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to start playing!

## How to Play

1. You play as White (bottom pieces)
2. Click on a piece to select it
3. Click on a valid destination square to move the piece
4. The AI (Black) will automatically make its move
5. Try to checkmate the AI's king while protecting your own!

## Game Rules

- Standard chess rules apply
- Pawns can move forward one square (or two on their first move)
- Pawns capture diagonally
- Knights move in L-shapes
- Bishops move diagonally
- Rooks move horizontally and vertically
- Queens can move in any direction
- Kings move one square in any direction
- The game ends when either king is checkmated

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- React Hooks for state management
- CSS Modules for styling
- Unicode chess symbols for pieces

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
