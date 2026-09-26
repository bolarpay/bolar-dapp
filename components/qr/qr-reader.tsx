"use client"

import { useCallback, useState } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CaptureQrScanner from "@/components/qr/capture-qr-scanner"

type Remittance = {
  type: "remittance"
  transactionId: string
  amount: number
  currency: string
  recipientId: string
}

function isRemittance(value: unknown): value is Remittance {
  if (!value || typeof value !== "object") {
    return false
  }

  const remittance = value as Record<string, unknown>
  return (
    remittance.type === "remittance" &&
    typeof remittance.transactionId === "string" &&
    typeof remittance.amount === "number" &&
    typeof remittance.currency === "string" &&
    typeof remittance.recipientId === "string"
  )
}

export default function QrReader() {
  const [result, setResult] = useState<Remittance | null>(null)
  const [rawResult, setRawResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScanSuccess = useCallback((decodedText: string) => {
    setError(null)

    try {
      const parsed: unknown = JSON.parse(decodedText)
      if (isRemittance(parsed)) {
        setResult(parsed)
        setRawResult(null)
      } else {
        setResult(null)
        setRawResult(decodedText)
      }
    } catch {
      setResult(null)
      setRawResult(decodedText)
    }
  }, [])

  const handleScanError = useCallback((message: string) => {
    setError(message)
  }, [])

  return (
    <div className="flex flex-col gap-5">
      <CaptureQrScanner
        onScanSuccess={handleScanSuccess}
        onScanError={handleScanError}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 />
              Remesa detectada
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <p>
              <strong>Transacción:</strong> {result.transactionId}
            </p>
            <p>
              <strong>Monto:</strong> {result.amount} {result.currency}
            </p>
            <p>
              <strong>Destinatario:</strong> {result.recipientId}
            </p>
          </CardContent>
        </Card>
      )}

      {rawResult && (
        <div className="grid gap-2">
          <p>El QR no tiene el formato BOLAR-PAY esperado</p>
          <pre className="max-h-40 overflow-auto rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap">
            {rawResult}
          </pre>
        </div>
      )}
    </div>
  )
}