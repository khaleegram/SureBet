
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

type CardType = {
  suit: 'H' | 'D' | 'C' | 'S';
  value: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K';
};

type Player = {
  name: string;
  balance: number;
  hand: CardType[];
  isTurn: boolean;
  status: string; // 'Thinking...', 'Folded', 'Checked', 'Called', 'Raised', 'All In', ''
  isUser: boolean;
};

const suits: CardType['suit'][] = ['H', 'D', 'C', 'S'];
const values: CardType['value'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

const createDeck = (): CardType[] => {
  return suits.flatMap(suit => values.map(value => ({ suit, value })));
};

const shuffleDeck = (deck: CardType[]): CardType[] => {
  return deck.sort(() => Math.random() - 0.5);
};

const PlayerCard = ({ name, balance, cards, isTurn, status }: { name: string; balance: number; cards?: (CardType | 'back')[]; isTurn?: boolean; status?: string; }) => (
    <div className={`p-4 rounded-lg border-2 ${isTurn ? 'border-primary shadow-lg shadow-primary/50' : 'border-border'} bg-card/80 relative transition-all duration-300`}>
        <div className="flex items-center justify-between">
             <p className="font-bold text-lg">{name}</p>
             {status && <Badge variant={status === 'Folded' ? 'destructive' : 'secondary'} className={isTurn ? 'animate-pulse' : ''}>{status}</Badge>}
        </div>
       
        <p className="font-mono text-green-400">${balance.toLocaleString()}</p>
         <div className="flex gap-2 mt-2 h-24">
            {cards ? cards.map((card, index) => (
                 <div key={`${typeof card === 'string' ? card : card.value + card.suit}-${index}`} className="w-16 h-24 rounded-md bg-white flex items-center justify-center relative overflow-hidden">
                    <Image src={`/cards/${typeof card === 'string' ? card : `${card.value}${card.suit}`}.svg`} alt={typeof card === 'string' ? card : `${card.value} of ${card.suit}`} layout="fill" />
                 </div>
            )) : (
                 <div className="w-16 h-24 rounded-md bg-card-foreground/10 flex items-center justify-center"></div>
            )}
        </div>
    </div>
)

const CommunityCard = ({ card }: { card: CardType }) => (
    <div className="w-20 h-28 rounded-md bg-white flex items-center justify-center relative overflow-hidden shadow-lg">
         <Image src={`/cards/${card.value}${card.suit}.svg`} alt={`${card.value} of ${card.suit}`} layout="fill" />
    </div>
)

export default function PokerPage() {
    const { toast } = useToast();
    const [deck, setDeck] = useState<CardType[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [communityCards, setCommunityCards] = useState<CardType[]>([]);
    const [pot, setPot] = useState(0);
    const [gameState, setGameState] = useState<'pre-deal' | 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown'>('pre-deal');
    const [betAmount, setBetAmount] = useState(50);
    const [currentBet, setCurrentBet] = useState(50);


    const startNewHand = useCallback(() => {
        const newDeck = shuffleDeck(createDeck());
        const initialPlayers: Player[] = [
            { name: 'You', balance: 10000, hand: [newDeck.pop()!, newDeck.pop()!], isTurn: true, status: 'Thinking...', isUser: true },
            { name: 'Player 2', balance: 9800, hand: [newDeck.pop()!, newDeck.pop()!], isTurn: false, status: '', isUser: false },
            { name: 'Player 3', balance: 18500, hand: [newDeck.pop()!, newDeck.pop()!], isTurn: false, status: '', isUser: false },
            { name: 'Player 4', balance: 25000, hand: [newDeck.pop()!, newDeck.pop()!], isTurn: false, status: '', isUser: false },
        ];

        setPlayers(initialPlayers);
        setDeck(newDeck);
        setCommunityCards([]);
        setPot(75); // Blinds
        setCurrentBet(50);
        setGameState('pre-flop');
        toast({ title: "New Hand", description: "The cards have been dealt." });
    }, [toast]);

    useEffect(() => {
        if (gameState === 'pre-deal') {
            startNewHand();
        }
    }, [gameState, startNewHand]);

    const handlePlayerAction = (action: 'check' | 'call' | 'bet' | 'raise' | 'fold') => {
        // This is a simplified simulation. A real game would have complex turn logic.
        const user = players.find(p => p.isUser);
        if (!user || !user.isTurn) return;

        let newPot = pot;
        const newPlayers = [...players];
        const userIndex = newPlayers.findIndex(p => p.isUser);

        switch(action) {
            case 'fold':
                newPlayers[userIndex].status = 'Folded';
                toast({ title: "You Folded", variant: 'destructive'});
                endHand();
                return;
            case 'check':
                 if (currentBet > 0) {
                    toast({ title: "Cannot Check", description: "You must call or raise.", variant: 'destructive' });
                    return;
                }
                newPlayers[userIndex].status = 'Checked';
                toast({ title: "You Checked" });
                break;
            case 'call':
                newPot += currentBet;
                newPlayers[userIndex].balance -= currentBet;
                newPlayers[userIndex].status = 'Called';
                toast({ title: `You Called $${currentBet}` });
                break;
            case 'bet':
            case 'raise':
                 if (betAmount <= currentBet) {
                    toast({ title: "Invalid Bet", description: "Raise amount must be higher than the current bet.", variant: 'destructive'});
                    return;
                }
                newPot += betAmount;
                newPlayers[userIndex].balance -= betAmount;
                setCurrentBet(betAmount);
                newPlayers[userIndex].status = action === 'bet' ? 'Bet' : 'Raised';
                toast({ title: `You ${newPlayers[userIndex].status} to $${betAmount}` });
                break;
        }

        newPlayers[userIndex].isTurn = false;
        setPot(newPot);
        setPlayers(newPlayers);
        
        // Simulate other player actions and advance game state
        setTimeout(advanceGameState, 1000);
    };
    
    const advanceGameState = () => {
        let newCommunityCards = [...communityCards];
        const newDeck = [...deck];

        if (gameState === 'pre-flop') {
            newCommunityCards.push(newDeck.pop()!, newDeck.pop()!, newDeck.pop()!); // Flop
            setGameState('flop');
        } else if (gameState === 'flop') {
            newCommunityCards.push(newDeck.pop()!); // Turn
            setGameState('turn');
        } else if (gameState === 'turn') {
            newCommunityCards.push(newDeck.pop()!); // River
            setGameState('river');
        } else if (gameState === 'river') {
             setGameState('showdown');
             endHand();
             return;
        }
        
        setCommunityCards(newCommunityCards);
        setDeck(newDeck);
        setCurrentBet(0); // Reset bet for new round
        
        // Give turn back to player (in a real game, this would cycle)
        setPlayers(players.map(p => p.isUser ? {...p, isTurn: true, status: 'Thinking...'} : p));
        toast({ title: `--- ${gameState.toUpperCase()} ---`})
    }

    const endHand = () => {
         // Simplified showdown: assume player wins if not folded
        const user = players.find(p => p.isUser);
        if (user && user.status !== 'Folded') {
            toast({ title: "You win the pot!", description: `You won $${pot}`});
            setPlayers(players.map(p => p.isUser ? {...p, balance: p.balance + pot} : p));
        } else {
             toast({ title: "Dealer wins the pot."});
        }
        
        setTimeout(() => {
            setGameState('pre-deal');
        }, 3000);
    }

    const userPlayer = players.find(p => p.isUser);
    const otherPlayers = players.filter(p => !p.isUser);


    if(gameState === 'pre-deal' || !userPlayer) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <Button onClick={startNewHand}>Start New Hand</Button>
            </div>
        )
    }

    return (
        <div className="min-h-[80vh] flex flex-col justify-between p-4">
            {/* Opponents */}
            <div className="flex justify-center gap-8 items-end">
                {otherPlayers.map(player => (
                    <PlayerCard 
                        key={player.name}
                        name={player.name} 
                        balance={player.balance} 
                        cards={gameState === 'showdown' ? player.hand : ['back', 'back']}
                        status={player.status}
                    />
                ))}
            </div>

            {/* Community Cards & Pot */}
            <div className="my-8">
                <Card className="w-fit mx-auto bg-transparent border-none shadow-none">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold font-headline">Texas Hold'em</CardTitle>
                        <CardDescription className="text-2xl font-mono text-amber-300">Pot: ${pot.toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center gap-4 min-h-[120px]">
                        {communityCards.map((card, index) => (
                            <CommunityCard key={`${card.value}${card.suit}-${index}`} card={card} />
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* User Player and Actions */}
            <div className="flex justify-center items-start">
                <div className="flex flex-col gap-4 items-center">
                    <PlayerCard 
                        name={userPlayer.name} 
                        balance={userPlayer.balance} 
                        cards={userPlayer.hand} 
                        isTurn={userPlayer.isTurn}
                        status={userPlayer.status}
                    />
                     <Card className="w-full max-w-sm">
                        <CardContent className="p-4 flex flex-col gap-2">
                             <div className="flex gap-2 items-center">
                                <Label htmlFor="bet-amount" className="sr-only">Bet</Label>
                                <Input 
                                    id="bet-amount" 
                                    type="number" 
                                    value={betAmount} 
                                    onChange={(e) => setBetAmount(Number(e.target.value))}
                                    className="w-24"
                                    min="0"
                                    disabled={!userPlayer.isTurn}
                                />
                                <Button className="flex-1" variant="secondary" onClick={() => handlePlayerAction('bet')} disabled={!userPlayer.isTurn}>Bet</Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" onClick={() => handlePlayerAction('check')} disabled={!userPlayer.isTurn || currentBet > 0}>Check</Button>
                                <Button variant="outline" onClick={() => handlePlayerAction('call')} disabled={!userPlayer.isTurn || currentBet === 0}>Call ${currentBet}</Button>
                                <Button variant="destructive" onClick={() => handlePlayerAction('fold')} disabled={!userPlayer.isTurn}>Fold</Button>
                                <Button onClick={() => handlePlayerAction('raise')} disabled={!userPlayer.isTurn}>Raise</Button>
                            </div>
                             {gameState !== 'pre-deal' && (
                                <Button variant="link" onClick={() => setGameState('pre-deal')}>
                                    Start New Hand
                                </Button>
                             )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

    