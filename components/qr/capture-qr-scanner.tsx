"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

type QrServerResponse = Array<{
  symbol?: Array<{
    data?: string | null
  }>
}>

type CaptureQrScannerProps = {
  onScanSuccess: (decodedText: string) => void
  onScanError: (message: string) => void
}

export default function CaptureQrScanner({
  onScanSuccess,
  onScanError,
}: CaptureQrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })

        const video = videoRef.current
        if (!video) {
          throw new Error("Video element is not available")
        }

        video.srcObject = stream
        await video.play()
        setCameraReady(true)
      } catch {
        stream?.getTracks().forEach((track) => track.stop())
        onScanError("No se pudo acceder a la cámara. Revisa los permisos.")
      }
    }

    void startCamera()

    return () => {
      stream?.getTracks().forEach((track) => track.stop())
      setCameraReady(false)
    }
  }, [onScanError])

  const captureQr = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!cameraReady || isCapturing || !video || !canvas) {
      return
    }

    const context = canvas.getContext("2d")
    if (!context || !video.videoWidth || !video.videoHeight) {
      onScanError("Error al decodificar el código QR")
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    setIsCapturing(true)

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsCapturing(false)
        onScanError("Error al decodificar el código QR")
        return
      }

      try {
        const formData = new FormData()
        formData.append("file", blob, "qr-capture.jpg")

        const response = await fetch(
          "https://api.qrserver.com/v1/read-qr-code/",
          {
            method: "POST",
            body: formData,
          },
        )

        if (!response.ok) {
          throw new Error("QR Server request failed")
        }

        const data = (await response.json()) as QrServerResponse
        const decodedText = data[0]?.symbol?.[0]?.data

        if (decodedText) {
          onScanSuccess(decodedText)
        } else {
          onScanError(
            "No se encontró un código QR en la imagen. Intenta de nuevo.",
          )
        }
      } catch {
        onScanError("Error al decodificar el código QR")
      } finally {
        setIsCapturing(false)
      }
    }, "image/jpeg", 0.8)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-xl bg-black shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-64 w-64 rounded-lg border-4 border-white/40" />
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <Button
        type="button"
        size="lg"
        onClick={captureQr}
        disabled={!cameraReady || isCapturing}
      >
        {isCapturing ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Camera />
        )}
        {isCapturing ? "Procesando..." : "Capturar QR"}
      </Button>
    </div>
  )
}