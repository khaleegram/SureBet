import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserCheck, UserX, Eye } from 'lucide-react';

const reviewQueue = [
    { id: 'usr_1', user: 'John Doe', flaggedReason: 'Name mismatch on ID', date: '2025-10-26' },
    { id: 'usr_2', user: 'Jane Smith', flaggedReason: 'Low facial scan similarity', date: '2025-10-26' },
    { id: 'usr_3', user: 'Mike Johnson', flaggedReason: 'Age estimation discrepancy', date: '2025-10-25' },
    { id: 'usr_4', user: 'Emily White', flaggedReason: 'Low facial scan similarity', date: '2025-10-24' },
    { id: 'usr_5', user: 'Chris Brown', flaggedReason: 'Name mismatch on ID', date: '2025-10-23' },
];

export default function ReviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Manual Review Queue</h1>
        <p className="text-muted-foreground">
          Review and process user verifications that require manual attention.
        </p>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Pending Verifications</CardTitle>
            <CardDescription>
                {reviewQueue.length} users are waiting for manual review.
            </CardDescription>
        </CardHeader>
        <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Flagged Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewQueue.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.user}</TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="bg-yellow-500/10 text-yellow-300 border-yellow-500/30">
                            {item.flaggedReason}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4"/>Review</Button>
                        <Button variant="ghost" size="icon" className="text-green-400 hover:bg-green-500/10 hover:text-green-400"><UserCheck className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10 hover:text-red-400"><UserX className="h-4 w-4"/></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
        </CardContent>
      </Card>
    </div>
  );
}
