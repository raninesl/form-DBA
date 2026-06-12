import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const application = await prisma.application.findUnique({
      where: { id },
    })
    if (!application) {
      return NextResponse.json({ error: 'Candidature non trouvée' }, { status: 404 })
    }
    return NextResponse.json({ application })
  } catch (error) {
    console.error('Error fetching application:', error)
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const { status } = await request.json()
    const application = await prisma.application.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json({ application })
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    await prisma.application.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting application:', error)
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 })
  }
}
