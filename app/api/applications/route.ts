import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import prisma from '@/lib/prisma'
import nodemailer from 'nodemailer'

async function saveFile(file: File, folder: string) {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  const filename = uniqueSuffix + '-' + file.name
  const filepath = join(process.cwd(), 'public', 'uploads', filename)
  
  await writeFile(filepath, buffer)
  return `/uploads/${filename}`
}

function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePhone(phone: string) {
  const re = /^[\d\s\-\+\(\)]{6,}$/
  return re.test(phone)
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    const honeypot = formData.get('honeypot') as string
    if (honeypot) {
      return NextResponse.json({ success: true })
    }

    const errors: Record<string, string> = {}

    const firstName = (formData.get('firstName') as string)?.trim()
    const lastName = (formData.get('lastName') as string)?.trim()
    const email = (formData.get('email') as string)?.trim()
    const phoneCode = formData.get('phoneCode') as string
    const phone = (formData.get('phone') as string)?.trim()
    const birthDate = formData.get('birthDate') as string
    const country = (formData.get('country') as string)?.trim()
    const city = (formData.get('city') as string)?.trim()
    const studyLevel = formData.get('studyLevel') as string
    const desiredProgram = formData.get('desiredProgram') as string
    const message = (formData.get('message') as string)?.trim() || null
    const rgpd = formData.get('rgpd') as string

    if (!firstName) errors.firstName = 'Prénom requis'
    if (!lastName) errors.lastName = 'Nom requis'
    if (!email) {
      errors.email = 'Email requis'
    } else if (!validateEmail(email)) {
      errors.email = 'Email invalide'
    }
    if (!phone) {
      errors.phone = 'Téléphone requis'
    } else if (!validatePhone(phone)) {
      errors.phone = 'Téléphone invalide'
    }
    if (!birthDate) errors.birthDate = 'Date de naissance requise'
    if (!country) errors.country = 'Pays requis'
    if (!city) errors.city = 'Ville requise'
    if (!studyLevel) errors.studyLevel = 'Niveau d\'études requis'
    if (!desiredProgram) errors.desiredProgram = 'Formation souhaitée requise'
    if (!rgpd) errors.rgpd = 'Vous devez accepter la politique de confidentialité'

    const cvFile = formData.get('cv') as File | null
    const diplomaFile = formData.get('diploma') as File | null

    if (!cvFile || cvFile.size === 0) {
      errors.cv = 'CV requis'
    } else {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(cvFile.type)) {
        errors.cv = 'Type de fichier non accepté pour le CV'
      }
      if (cvFile.size > 5 * 1024 * 1024) {
        errors.cv = 'Taille du CV trop importante (max 5Mo)'
      }
    }

    if (diplomaFile && diplomaFile.size > 0) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(diplomaFile.type)) {
        errors.diploma = 'Type de fichier non accepté pour le diplôme'
      }
      if (diplomaFile.size > 5 * 1024 * 1024) {
        errors.diploma = 'Taille du diplôme trop importante (max 5Mo)'
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    let cvUrl = null
    let diplomaUrl = null

    if (cvFile) {
      cvUrl = await saveFile(cvFile, 'uploads')
    }

    if (diplomaFile && diplomaFile.size > 0) {
      diplomaUrl = await saveFile(diplomaFile, 'uploads')
    }

    const application = await prisma.application.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phoneCode + ' ' + phone,
        birthDate: new Date(birthDate),
        country,
        city,
        studyLevel,
        desiredProgram,
        message,
        cvUrl,
        diplomaUrl,
      },
    })

    // Tentative d'envoi d'email - ne pas bloquer le flux principal si ça échoue
    try {
      if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
        const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER)

        const candidateEmailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B0000;">Bonjour ${firstName} ${lastName},</h2>
            <p>Nous confirmons la bonne réception de votre candidature.</p>
            
            <h3 style="color: #8B0000;">Récapitulatif de votre candidature :</h3>
            <ul>
              <li><strong>Nom :</strong> ${lastName}</li>
              <li><strong>Prénom :</strong> ${firstName}</li>
              <li><strong>Email :</strong> ${email}</li>
              <li><strong>Téléphone :</strong> ${phoneCode} ${phone}</li>
              <li><strong>Formation souhaitée :</strong> ${desiredProgram}</li>
              <li><strong>Niveau d'études :</strong> ${studyLevel}</li>
              <li><strong>Pays :</strong> ${country}</li>
              <li><strong>Ville :</strong> ${city}</li>
              ${message ? `<li><strong>Message :</strong> ${message}</li>` : ''}
            </ul>

            <h3 style="color: #8B0000;">Présentation de notre école :</h3>
            <p>DBA Genève Global Institute est une institution d'enseignement supérieur renommée, spécialisée dans les programmes doctoraux en administration des affaires (DBA). Notre mission est de former les leaders et chercheurs de demain grâce à des programmes académiques d'excellence et une approche pédagogique innovante.</p>

            <h3 style="color: #8B0000;">Nos formations :</h3>
            <ul>
              <li>DBA en Management, Innovation et Transformation des Organisations</li>
              <li>DBA en Finance et Gouvernance Stratégique</li>
              <li>DBA en Science Politique et Diplomatie Économique</li>
              <li>DBA en Droit International et Droit des Affaires</li>
              <li>DBA en Ingénierie Informatique et Business IA</li>
            </ul>

            <p>Notre équipe étudiera votre dossier et reviendra vers vous dans les meilleurs délais.</p>
            
            <p>Cordialement,<br>L'équipe admissions</p>
          </div>
        `

        const directorEmailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B0000;">Bonjour,</h2>
            <p>Une nouvelle candidature vient d'être envoyée depuis le formulaire en ligne.</p>
            
            <h3 style="color: #8B0000;">Informations du candidat :</h3>
            <ul>
              <li><strong>Nom :</strong> ${lastName}</li>
              <li><strong>Prénom :</strong> ${firstName}</li>
              <li><strong>Email :</strong> ${email}</li>
              <li><strong>Téléphone :</strong> ${phoneCode} ${phone}</li>
              <li><strong>Date de naissance :</strong> ${new Date(birthDate).toLocaleDateString('fr-FR')}</li>
              <li><strong>Pays :</strong> ${country}</li>
              <li><strong>Ville :</strong> ${city}</li>
              <li><strong>Niveau d'études :</strong> ${studyLevel}</li>
              <li><strong>Formation souhaitée :</strong> ${desiredProgram}</li>
              ${message ? `<li><strong>Message :</strong> ${message}</li>` : ''}
            </ul>

            <p>Cordialement,<br>Système automatique de candidature</p>
          </div>
        `

        const attachments = []
        if (cvUrl) {
          attachments.push({
            path: join(process.cwd(), 'public', cvUrl),
            filename: cvFile?.name,
          })
        }
        if (diplomaUrl) {
          attachments.push({
            path: join(process.cwd(), 'public', diplomaUrl),
            filename: diplomaFile?.name,
          })
        }

        await transporter.sendMail({
          from: '"DBA Genève Global Institute" <no-reply@dbageneve.com>',
          to: email,
          subject: 'Confirmation de réception de votre candidature',
          html: candidateEmailHtml,
        })

        if (process.env.DIRECTRICE_EMAIL) {
          await transporter.sendMail({
            from: '"DBA Genève Global Institute" <no-reply@dbageneve.com>',
            to: process.env.DIRECTRICE_EMAIL,
            subject: `Nouvelle candidature reçue - ${firstName} ${lastName}`,
            html: directorEmailHtml,
            attachments,
          })
        }
      }
    } catch (emailError) {
      console.warn('Email sending failed, but application was saved:', emailError)
    }

    return NextResponse.json({ success: true, application })
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(applications)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 })
  }
}
