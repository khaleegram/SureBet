
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const Hand = ({ title, cards, score }: { title: string; cards: {card: string, hidden?: boolean}[]; score: number; }) => (
    <div>
        <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
        <div className="flex justify-center items-center gap-4 min-h-[160px]">
            {cards.map(({card, hidden}, index) => (
                <div key={index} className="w-28 h-40 rounded-lg bg-white relative overflow-hidden shadow-lg transition-transform hover:scale-105">
                     <Image src={`/cards/${hidden ? 'back' : card}.svg`} alt={card} layout="fill" />
                </div>
            ))}
        </div>
        <div className="text-center mt-2">
            <Badge className="text-lg font-bold">{score > 0 ? `Score: ${score}` : ''}</Badge>
             {score > 21 && <Badge variant="destructive" className="text-lg font-bold ml-2">BUST</Badge>}
        </div>
    </div>
);


export default function BlackjackPage() {
  const [playerHand, setPlayerHand] = useState([{card: 'AS'}, {card: '8D'}]);
  const [dealerHand, setDealerHand] = useState([{card: '7C'}, {card: 'back', hidden: true}]);
  const [playerScore, setPlayerScore] = useState(19);
  const [dealerScore, setDealerScore] = useState(7);
  const [bet, setBet] = useState(50);
  const [balance, setBalance] = useState(950);
  const [gameState, setGameState] = useState('player-turn'); // player-turn, dealer-turn, finished

  const handleHit = () => {
    // This is where you'd have real deck logic
    // For now, simple random card
    setPlayerHand([...playerHand, {card: '3H'}])
    setPlayerScore(22);
    setGameState('finished');
  }

  const handleStand = () => {
     setDealerHand([{card: '7C'}, {card: 'KS'}]);
     setDealerScore(17);
     setGameState('finished');
  }

  const handleNewGame = () => {
    setPlayerHand([{card: 'AC'}, {card: 'JS'}]);
    setDealerHand([{card: 'KH'}, {card: 'back', hidden: true}]);
    setPlayerScore(21);
    setDealerScore(10);
    setGameState('player-turn');
    setBalance(balance - bet + 100);
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold tracking-tight font-headline text-center mb-2">Blackjack</h1>
        <p className="text-muted-foreground text-center mb-8">Get as close to 21 as possible without going over.</p>

        <Card className="w-full max-w-4xl bg-green-900/40 border-green-700 p-6">
            <CardContent>
                <Hand title="Dealer's Hand" cards={dealerHand} score={gameState === 'player-turn' ? dealerScore : 17} />

                <div className="my-8 text-center">
                    {gameState === 'finished' && (
                        <div className="flex flex-col items-center gap-2 mb-4">
                           <p className="text-3xl font-bold text-amber-300">
                                {playerScore > 21 ? 'Player Busts!' : playerScore > (dealerScore > 21 ? 0 : 17) ? 'You Win!' : 'Dealer Wins!'}
                           </p>
                            <Button onClick={handleNewGame}>Play Again</Button>
                        </div>
                    )}
                    <Badge variant="secondary" className="text-lg">Bet: ${bet}</Badge>
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
                    <Button size="lg" variant="secondary" disabled={gameState !== 'player-turn'}>Double Down</Button>
                </div>
            </CardContent>
        </Card>

    </div>
  );
}
