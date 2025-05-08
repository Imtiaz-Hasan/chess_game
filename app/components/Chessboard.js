'use client';

import { useState, useEffect } from 'react';
import styles from './Chessboard.module.css';

// Game status messages
const STATUS = {
  CHECK: 'Check!',
  CHECKMATE: 'Checkmate! Game Over!',
  STALEMATE: 'Stalemate! Game Over!'
};

const initialBoard = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

export default function Chessboard() {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState('');

  const isKingInCheck = (board, isWhiteKing) => {
    // Find the king's position
    let kingRow, kingCol;
    const kingSymbol = isWhiteKing ? 'K' : 'k';
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === kingSymbol) {
          kingRow = row;
          kingCol = col;
          break;
        }
      }
      if (kingRow !== undefined) break;
    }

    // Check if any opponent's piece can capture the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (!piece) continue;
        
        const isPieceWhite = piece === piece.toUpperCase();
        if (isPieceWhite === isWhiteKing) continue; // Skip pieces of the same color
        
        if (isValidMove(row, col, kingRow, kingCol)) {
          return true;
        }
      }
    }
    return false;
  };

  const isCheckmate = (board, isWhiteKing) => {
    if (!isKingInCheck(board, isWhiteKing)) return false;

    // Try all possible moves for the king's side
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];
        if (!piece) continue;
        
        const isPieceWhite = piece === piece.toUpperCase();
        if (isPieceWhite !== isWhiteKing) continue; // Skip opponent's pieces

        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(fromRow, fromCol, toRow, toCol)) {
              // Try the move
              const newBoard = board.map(row => [...row]);
              newBoard[toRow][toCol] = board[fromRow][fromCol];
              newBoard[fromRow][fromCol] = null;
              
              // If this move gets out of check, it's not checkmate
              if (!isKingInCheck(newBoard, isWhiteKing)) {
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  };

  const getPieceSymbol = (piece) => {
    const symbols = {
      'k': '♔', 'q': '♕', 'r': '♖', 'b': '♗', 'n': '♘', 'p': '♙',
      'K': '♚', 'Q': '♛', 'R': '♜', 'B': '♝', 'N': '♞', 'P': '♟'
    };
    return symbols[piece] || '';
  };

  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    const piece = board[fromRow][fromCol];
    if (!piece) return false; // Return false if there's no piece at the source
    const isWhitePiece = piece === piece.toUpperCase();
    
    // Basic validation: can't capture your own pieces
    const targetPiece = board[toRow][toCol];
    if (targetPiece) {
      const isTargetWhite = targetPiece === targetPiece.toUpperCase();
      if (isWhitePiece === isTargetWhite) return false;
    }

    // Validate move is within board boundaries
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    switch (piece.toLowerCase()) {
      case 'p': // Pawn
        const direction = isWhitePiece ? -1 : 1;
        const startRow = isWhitePiece ? 6 : 1;
        
        // Moving forward
        if (colDiff === 0 && !targetPiece) {
          if (fromRow === startRow && toRow === fromRow + 2 * direction) return true;
          return toRow === fromRow + direction;
        }
        // Capturing
        if (colDiff === 1 && toRow === fromRow + direction && targetPiece) return true;
        return false;

      case 'r': // Rook
        return (rowDiff === 0 || colDiff === 0);

      case 'n': // Knight
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

      case 'b': // Bishop
        return rowDiff === colDiff;

      case 'q': // Queen
        return rowDiff === colDiff || rowDiff === 0 || colDiff === 0;

      case 'k': // King
        return rowDiff <= 1 && colDiff <= 1;

      default:
        return false;
    }
  };

  const makeAIMove = () => {
    // Simple AI: Find all possible moves and choose a random one
    const possibleMoves = [];
    
    // Find all black pieces and their possible moves
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];
        if (!piece || piece === piece.toUpperCase()) continue; // Skip empty squares and white pieces
        
        // Check all possible destinations
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(fromRow, fromCol, toRow, toCol)) {
              possibleMoves.push({ fromRow, fromCol, toRow, toCol });
            }
          }
        }
      }
    }

    if (possibleMoves.length > 0) {
      const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      const newBoard = board.map(row => [...row]);
      newBoard[move.toRow][move.toCol] = board[move.fromRow][move.fromCol];
      newBoard[move.fromRow][move.fromCol] = null;
      setBoard(newBoard);
      
      // Check for checkmate after AI's move
      if (isKingInCheck(newBoard, true)) { // Check white king
        if (isCheckmate(newBoard, true)) {
          setGameStatus(STATUS.CHECKMATE);
          setGameOver(true);
        } else {
          setGameStatus(STATUS.CHECK);
        }
      } else {
        setGameStatus('');
      }
      
      setIsWhiteTurn(true);
    }
  };

  useEffect(() => {
    if (!isWhiteTurn && !gameOver) {
      // Add a small delay to make the AI move feel more natural
      const timer = setTimeout(makeAIMove, 500);
      return () => clearTimeout(timer);
    }
  }, [isWhiteTurn, gameOver]);

  const handleSquareClick = (row, col) => {
    if (gameOver || !isWhiteTurn) return; // Only allow moves during player's turn

    if (!selectedPiece) {
      // Select piece
      const piece = board[row][col];
      if (piece && piece === piece.toUpperCase()) { // Only select white pieces
        setSelectedPiece({ row, col });
      }
    } else {
      // Attempt to move piece
      if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        const newBoard = board.map(row => [...row]);
        newBoard[row][col] = board[selectedPiece.row][selectedPiece.col];
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        setBoard(newBoard);
        
        // Check for checkmate after player's move
        if (isKingInCheck(newBoard, false)) { // Check black king
          if (isCheckmate(newBoard, false)) {
            setGameStatus(STATUS.CHECKMATE);
            setGameOver(true);
          } else {
            setGameStatus(STATUS.CHECK);
          }
        } else {
          setGameStatus('');
        }
        
        setIsWhiteTurn(false); // Switch to AI's turn
      }
      setSelectedPiece(null);
    }
  };

  return (
    <div className={styles.container}>
      {gameStatus && <div className={styles.status}>{gameStatus}</div>}
      <div className={styles.chessboard}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((piece, colIndex) => {
            const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
            const squareColor = (rowIndex + colIndex) % 2 === 0 ? styles.light : styles.dark;
            return (
              <div
                key={colIndex}
                className={`${styles.square} ${squareColor} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                <span className={styles.piece}>{getPieceSymbol(piece)}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
    </div>
  );
}