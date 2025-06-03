import { NextResponse } from 'next/server'

export async function GET() {
  const tips = [
    "Remember to stay hydrated! Drink at least 8 glasses of water daily.",
    "Get at least 7–9 hours of sleep every night for optimal health.",
    "Take a short walk every hour to improve circulation and posture.",
    "Eat a variety of fruits and vegetables to boost your immune system.",
    "Take deep breaths regularly to reduce stress and increase focus."
  ]

  const randomIndex = Math.floor(Math.random() * tips.length)
  const selectedTip = tips[randomIndex]

  return NextResponse.json({ tip: selectedTip })
}