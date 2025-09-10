
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useBalance } from '@/hooks/use-balance';
import { PlayingCard, CardBack } from '@/components/PlayingCard';

type CardType = {
    suit: 'H' | 'D' | 'C' | 'S';
    value: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
};

type HandCard = {
    card: CardType;
    hidden?: boolean;
};

const suits: CardType['suit'][] = ['H', 'D', 'C', 'S'];
const values: CardType['value'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const createDeck = (): CardType[] => {
    return suits.flatMap(suit => values.map(value => ({ suit, value })));
};

const shuffleDeck = (deck: CardType[]): CardType[] => {
    return deck.sort(() => Math.random() - 0.5);
};

const getCardValue = (card: CardType): number => {
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    if (card.value === 'A') return 11;
    return parseInt(card.value);
};

const calculateScore = (hand: HandCard[]): number => {
    let score = hand.reduce((acc, handCard) => acc + (handCard.hidden ? 0 : getCardValue(handCard.card)), 0);
    let numAces = hand.filter(handCard => !handCard.hidden && handCard.card.value === 'A').length;

    while (score > 21 && numAces > 0) {
        score -= 10;
        numAces--;
    }
    return score;
};


const Hand = ({ title, cards, score }: { title: string; cards: HandCard[]; score: number; }) => (
    <div>
        <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
        <div className="flex justify-center items-center gap-4 min-h-[160px] h-40">
            {cards.map(({card, hidden}, index) => (
               hidden ? <CardBack key={index} /> : <PlayingCard key={index} suit={card.suit} value={card.value} />
            ))}
        </div>
        <div className="text-center mt-2">
            <Badge className="text-lg font-bold">{score > 0 ? `Score: ${score}` : ''}</Badge>
             {score > 21 && <Badge variant="destructive" className="text-lg font-bold ml-2">BUST</Badge>}
        </div>
    </div>
);


export default function BlackjackPage() {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerHand, setPlayerHand] = useState<HandCard[]>([]);
  const [dealerHand, setDealerHand] = useState<HandCard[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [bet, setBet] = useState(50);
  const { balance, addToBalance, subtractFromBalance } = useBalance();
  const [gameState, setGameState] = useState<'betting' | 'player-turn' | 'dealer-turn' | 'finished'>('betting');
  const [resultMessage, setResultMessage] = useState('');
  const { toast } = useToast();

  const startNewGame = () => {
    if (!subtractFromBalance(bet)) {
        toast({ title: "Not enough balance to bet", variant: 'destructive' });
        return;
    }

    const newDeck = shuffleDeck(createDeck());

    const playerInitialHand: HandCard[] = [{ card: newDeck.pop()! }, { card: newDeck.pop()! }];
    const dealerInitialHand: HandCard[] = [{ card: newDeck.pop()! }, { card: newDeck.pop()!, hidden: true }];
    
    setDeck(newDeck);
    setPlayerHand(playerInitialHand);
    setDealerHand(dealerInitialHand);
    setPlayerScore(calculateScore(playerInitialHand));
    setDealerScore(calculateScore(dealerInitialHand));
    setGameState('player-turn');
    setResultMessage('');
  };
  
  useEffect(() => {
    if (gameState === 'player-turn' && playerScore === 21 && playerHand.length === 2) {
      setTimeout(() => finishGame(dealerScore, true), 500);
    }
  }, [playerScore, playerHand, gameState, dealerScore]);


  const handleHit = () => {
    if (gameState !== 'player-turn' || !deck.length) return;
    const newDeck = [...deck];
    const newPlayerHand = [...playerHand, { card: newDeck.pop()! }];
    const newPlayerScore = calculateScore(newPlayerHand);
    
    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setPlayerScore(newPlayerScore);

    if (newPlayerScore > 21) {
      setResultMessage('Player Busts! Dealer Wins.');
      setGameState('finished');
    }
  };

  const handleStand = () => {
    setGameState('dealer-turn');
  };

  useEffect(() => {
    if (gameState === 'dealer-turn') {
      let currentDealerHand = dealerHand.map(h => ({...h, hidden: false}));
      let currentDealerScore = calculateScore(currentDealerHand);
      let currentDeck = [...deck];

      const dealDealerCard = () => {
        if (currentDealerScore < 17 && currentDeck.length > 0) {
            currentDealerHand.push({ card: currentDeck.pop()! });
            currentDealerScore = calculateScore(currentDealerHand);
            setDealerHand([...currentDealerHand]);
            setDealerScore(currentDealerScore);
            setDeck([...currentDeck]);
            setTimeout(dealDealerCard, 800); 
        } else {
            finishGame(currentDealerScore);
        }
      }

      setTimeout(dealDealerCard, 500);
    }
  }, [gameState, dealerHand, deck]);


  const finishGame = (finalDealerScore?: number, isBlackjack = false) => {
    const pScore = calculateScore(playerHand);
    const dScore = finalDealerScore ?? calculateScore(dealerHand.map(h => ({...h, hidden: false})));

    if (pScore > 21) {
      setResultMessage('Player Busts! Dealer Wins.');
    } else if (isBlackjack) {
        setResultMessage('Blackjack! You Win!');
        addToBalance(bet * 2.5);
    }
    else if (dScore > 21) {
      setResultMessage('Dealer Busts! You Win!');
      addToBalance(bet * 2);
    } else if (pScore > dScore) {
      setResultMessage('You Win!');
      addToBalance(bet * 2);
    } else if (dScore > pScore) {
      setResultMessage('Dealer Wins.');
    } else {
      setResultMessage('Push! It\'s a tie.');
      addToBalance(bet);
    }
    setGameState('finished');
  }


  return (
    <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold tracking-tight font-headline text-center mb-2">Blackjack</h1>
        <p className="text-muted-foreground text-center mb-8">Get as close to 21 as possible without going over.</p>

        <Card className="w-full max-w-4xl bg-green-900/40 border-green-700 p-6">
            <CardContent>
                <Hand title="Dealer's Hand" cards={dealerHand} score={gameState === 'player-turn' ? dealerScore : calculateScore(dealerHand.map(c => ({...c, hidden: false})))} />

                <div className="my-8 text-center">
                    {gameState === 'finished' && (
                        <div className="flex flex-col items-center gap-2 mb-4">
                           <p className="text-3xl font-bold text-amber-300">
                                {resultMessage}
                           </p>
                            <Button onClick={() => setGameState('betting')}>Play Again</Button>
                        </div>
                    )}
                    {gameState === 'betting' && (
                        <div className="flex flex-col items-center gap-4">
                             <p className="text-xl font-bold text-white">Place Your Bet</p>
                             <div className="flex gap-2">
                                <Button variant={bet === 25 ? 'secondary' : 'outline'} onClick={() => setBet(25)}>$25</Button>
                                <Button variant={bet === 50 ? 'secondary' : 'outline'} onClick={() => setBet(50)}>$50</Button>
                                <Button variant={bet === 100 ? 'secondary' : 'outline'} onClick={() => setBet(100)}>$100</Button>
                             </div>
                             <Button onClick={startNewGame}>Deal Cards</Button>
                        </div>
                    )}
                     {gameState !== 'betting' && <Badge variant="secondary" className="text-lg">Bet: ${bet}</Badge>}
                </div>
                
                <Hand title="Your Hand" cards={playerHand} score={playerScore} />
            </CardContent>
        </Card>
        
        <Card className="w-full max-w-4xl mt-4">
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                     <p className="font-semibold">Your Balance</p>
                     <p className="text-2xl font-bold text-green-400">${balance.toFixed(2)}</p>
                </div>
                <div className="flex gap-4">
                    <Button size="lg" onClick={handleHit} disabled={gameState !== 'player-turn'}>Hit</Button>
                    <Button size="lg" onClick={handleStand} disabled={gameState !== 'player-turn'}>Stand</Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
