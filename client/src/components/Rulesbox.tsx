function Rulesbox() {
  return (
    <div className='pop-up-box'>
      <>
        <h3>Rules:</h3>
        Dealer hits on 16 and stands on 17
        <br />
        Blackjack pays 2.5x your bet
        <br />
        Win pays 2x your bet
        <br />
        Draw returns your bet
        <br />
        You can double down on any two cards
        <br />
        You can split your hand once
        <br />
        True count is used for betting
        <br />({'>'}4 = 10%, 5-8 = 20%, 9-12 = 30%,
        <br />
        13-16 = 40%, 17-20 = 50%, 21 = 60%)
      </>
    </div>
  );
}

export default Rulesbox;
