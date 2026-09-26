'use client'

import dynamic from 'next/dynamic';
import { QrCode } from 'lucide-react';

const PollarApp = dynamic(() => import('./pollar-app'), { ssr: false });
import QrReader from '@/components/qr/qr-reader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-start gap-6 p-8">
      <PollarApp />
      <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">
              <QrCode />
              Escanear QR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Escanear código QR</DialogTitle>
            </DialogHeader>
            <QrReader />
          </DialogContent>
        </Dialog>
    </main>
  );
}
