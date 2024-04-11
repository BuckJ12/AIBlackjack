interface BetProps {
  nextBet: number;
  setNextBet: (bet: number) => void;
  playerTurn: boolean;
  money: number;
  placeBet: (bet: number) => void;
  newGame: () => void;
}

function Bet({
  nextBet,
  setNextBet,
  playerTurn,
  money,
  placeBet,
  newGame,
}: BetProps) {
  return (
    <>
      {!playerTurn && (
        <div>
          <input
            type='number'
            value={nextBet}
            onChange={(e) => {
              const betValue = parseInt(e.target.value);
              setNextBet(isNaN(betValue) ? 0 : betValue);
            }}
            min='0'
          />
          {money > 0 ? (
            <button onClick={() => placeBet(nextBet)}>Place Next Bet</button>
          ) : (
            <div>
              Game Over. You ran out of money.
              <button onClick={newGame}>Play Again</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Bet;
