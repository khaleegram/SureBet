
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useBalance } from '@/hooks/use-balance';
import { PlayingCard, CardBack } from '@/components/PlayingCard';

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
  bet: number;
  showHand?: boolean;
};

const suits: CardType['suit'][] = ['H', 'D', 'C', 'S'];
const values: CardType['value'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

const createDeck = (): CardType[] => {
  return suits.flatMap(suit => values.map(value => ({ suit, value })));
};

const shuffleDeck = (deck: CardType[]): CardType[] => {
  return deck.sort(() => Math.random() - 0.5);
};

const PlayerCard = ({ name, balance, hand, isTurn, status, bet, showHand }: { name: string; balance: number; hand: CardType[]; isTurn?: boolean; status?: string; bet?: number; showHand?: boolean }) => (
    <div className={`p-4 rounded-lg border-2 ${isTurn ? 'border-primary shadow-lg shadow-primary/50' : 'border-border'} bg-card/80 relative transition-all duration-300 w-48`}>
        <div className="flex items-center justify-between">
             <p className="font-bold text-lg truncate">{name}</p>
             {status && <Badge variant={status === 'Folded' ? 'destructive' : 'secondary'} className={isTurn ? 'animate-pulse' : ''}>{status}</Badge>}
        </div>
       
        <p className="font-mono text-primary">${balance.toLocaleString()}</p>
        {bet > 0 && <p className="text-xs text-amber-400">Bet: ${bet}</p>}
         <div className="flex gap-2 mt-2 h-28">
            {hand.map((card, index) => (
                showHand ? 
                <PlayingCard key={index} suit={card.suit} value={card.value} className="w-1/2" /> :
                <CardBack key={index} className="w-1/2" />
            ))}
        </div>
    </div>
)

const CommunityCard = ({ card }: { card: CardType }) => (
    <PlayingCard suit={card.suit} value={card.value} className="w-20 h-28" />
)

const SMALL_BLIND = 25;
const BIG_BLIND = 50;

export default function PokerPage() {
    const { toast } = useToast();
    const { balance, addToBalance, subtractFromBalance } = useBalance();
    const [deck, setDeck] = useState<CardType[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [communityCards, setCommunityCards] = useState<CardType[]>([]);
    const [pot, setPot] = useState(0);
    const [gameState, setGameState] = useState<'pre-deal' | 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown'>('pre-deal');
    const [betAmount, setBetAmount] = useState(BIG_BLIND);
    const [currentBet, setCurrentBet] = useState(BIG_BLIND);


    const startNewHand = useCallback(() => {
        if (!subtractFromBalance(BIG_BLIND)) {
            toast({ title: "Not enough balance", description: "You need at least the big blind to play.", variant: 'destructive'});
            setGameState('pre-deal'); // Stay in pre-deal if not enough balance
            return;
        }

        const newDeck = shuffleDeck(createDeck());
        const initialPlayers: Player[] = [
            { name: 'You', balance: balance - BIG_BLIND, hand: [newDeck.pop()!, newDeck.pop()!], isTurn: true, status: 'Thinking...', isUser: true, bet: BIG_BLIND, showHand: true },
            { name: 'Player 2', balance: 9975, hand: [newDeck.pop()!, newDeck.pop()!], isTurn: false, status: '', isUser: false, bet: SMALL_BLIND },
            { name: 'Player 3', balance: 18500, hand: [newDeck.pop()!, newDeck.pop()!], isTurn: false, status: '', isUser: false, bet: 0 },
            { name: 'Player 4', balance: 25000, hand: [newDeck.pop()!, newDeck.pop()!], isTurn: false, status: '', isUser: false, bet: 0 },
        ];

        setPlayers(initialPlayers);
        setDeck(newDeck);
        setCommunityCards([]);
        setPot(SMALL_BLIND + BIG_BLIND);
        setCurrentBet(BIG_BLIND);
        setGameState('pre-flop');
        toast({ title: "New Hand", description: "The cards have been dealt." });
    }, [toast, subtractFromBalance, balance]);

    useEffect(() => {
        if (gameState === 'pre-deal') {
            startNewHand();
        }
    }, [gameState, startNewHand]);

    const handlePlayerAction = (action: 'check' | 'call' | 'bet' | 'raise' | 'fold') => {
        const user = players.find(p => p.isUser);
        if (!user || !user.isTurn) return;

        let newPot = pot;
        const newPlayers = [...players];
        const userIndex = newPlayers.findIndex(p => p.isUser);
        const userBet = newPlayers[userIndex].bet;

        switch(action) {
            case 'fold':
                newPlayers[userIndex].status = 'Folded';
                toast({ title: "You Folded", variant: 'destructive'});
                endHand();
                return;
            case 'check':
                 if (currentBet > userBet) {
                    toast({ title: "Cannot Check", description: "You must call or raise.", variant: 'destructive' });
                    return;
                }
                newPlayers[userIndex].status = 'Checked';
                toast({ title: "You Checked" });
                break;
            case 'call':
                const callAmount = currentBet - userBet;
                if (!subtractFromBalance(callAmount)) {
                    toast({ title: "Not enough balance to call", variant: "destructive" });
                    return;
                }
                newPot += callAmount;
                newPlayers[userIndex].bet += callAmount;
                newPlayers[userIndex].status = 'Called';
                toast({ title: `You Called $${callAmount}` });
                break;
            case 'bet':
            case 'raise':
                 if (betAmount <= currentBet) {
                    toast({ title: "Invalid Bet", description: "Raise amount must be higher than the current bet.", variant: 'destructive'});
                    return;
                }
                 const raiseAmount = betAmount - userBet;
                 if (!subtractFromBalance(raiseAmount)) {
                    toast({ title: "Not enough balance to raise", variant: "destructive" });
                    return;
                }
                newPot += raiseAmount;
                newPlayers[userIndex].bet += raiseAmount;
                setCurrentBet(betAmount);
                newPlayers[userIndex].status = action === 'bet' ? 'Bet' : 'Raised';
                toast({ title: `You ${newPlayers[userIndex].status} to $${betAmount}` });
                break;
        }

        newPlayers[userIndex].isTurn = false;
        setPot(newPot);
        setPlayers(newPlayers);
        
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
        setCurrentBet(0);
        
        setPlayers(players.map(p => p.isUser ? {...p, isTurn: true, status: 'Thinking...'} : p));
        toast({ title: `--- ${gameState.toUpperCase()} ---`})
    }

    const endHand = () => {
         const user = players.find(p => p.isUser);
         setPlayers(players.map(p => ({...p, showHand: true})));

        if (user && user.status !== 'Folded') {
            const didWin = Math.random() > 0.5; // Simplified win logic
            if (didWin) {
                toast({ title: "You win the pot!", description: `You won $${pot}`});
                addToBalance(pot);
            } else {
                 toast({ title: "Dealer wins the pot."});
            }
        } else {
             toast({ title: "Dealer wins the pot."});
        }
        
        setTimeout(() => {
            setGameState('pre-deal');
        }, 5000);
    }

    const userPlayer = players.find(p => p.isUser);
    const otherPlayers = players.filter(p => !p.isUser);


    if(gameState === 'pre-deal' || !userPlayer) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="text-center space-y-4">
                    <p className="text-xl">Your balance: ${balance.toFixed(2)}</p>
                    <Button onClick={startNewHand}>Start New Hand (Buy-in: ${BIG_BLIND})</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[80vh] flex flex-col justify-between p-4 bg-background">
            <div className="flex justify-center gap-8 items-end">
                {otherPlayers.map(player => (
                    <PlayerCard 
                        key={player.name}
                        name={player.name} 
                        balance={player.balance} 
                        hand={player.hand}
                        status={player.status}
                        bet={player.bet}
                        showHand={player.showHand || gameState === 'showdown'}
                    />
                ))}
            </div>

            <div className="my-8">
                <Card className="w-fit mx-auto bg-transparent border-none shadow-none">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold font-headline text-white">Texas Hold'em</CardTitle>
                        <CardDescription className="text-2xl font-mono text-primary">Pot: ${pot.toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center gap-4 min-h-[120px]">
                        {communityCards.map((card, index) => (
                            <CommunityCard key={`${card.value}${card.suit}-${index}`} card={card} />
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center items-start">
                <div className="flex flex-col gap-4 items-center">
                    <PlayerCard 
                        name={userPlayer.name} 
                        balance={balance} 
                        hand={userPlayer.hand} 
                        isTurn={userPlayer.isTurn}
                        status={userPlayer.status}
                        bet={userPlayer.bet}
                        showHand={userPlayer.showHand}
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
                                <Button variant="outline" onClick={() => handlePlayerAction('check')} disabled={!userPlayer.isTurn || currentBet > userPlayer.bet}>Check</Button>
                                <Button variant="outline" onClick={() => handlePlayerAction('call')} disabled={!userPlayer.isTurn || currentBet === userPlayer.bet}>Call ${currentBet > userPlayer.bet ? currentBet - userPlayer.bet : 0}</Button>
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
