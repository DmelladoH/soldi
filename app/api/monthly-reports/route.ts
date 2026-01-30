import { NextRequest, NextResponse } from 'next/server'
import { MonthlyReportsRepository } from '@/server/db/repositories'

const repository = new MonthlyReportsRepository()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startMonth = searchParams.get('startMonth')
    const startYear = searchParams.get('startYear')
    const endMonth = searchParams.get('endMonth')
    const endYear = searchParams.get('endYear')
    const orderBy = searchParams.get('orderBy') as "asc" | "desc" || "asc"
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    const reports = await repository.findWithRelations({
      startMonth: startMonth ? parseInt(startMonth) : undefined,
      startYear: startYear ? parseInt(startYear) : undefined,
      endMonth: endMonth ? parseInt(endMonth) : undefined,
      endYear: endYear ? parseInt(endYear) : undefined,
      orderBy,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching monthly reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch monthly reports' },
      { status: 500 }
    )
  }
}