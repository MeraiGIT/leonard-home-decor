import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Initialize Google Sheets API
async function initializeSheetsAPI() {
  const GOOGLE_CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS_JSON
  const GOOGLE_CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH
  let credentials: any

  // Check if GOOGLE_CREDENTIALS_JSON is provided (for Vercel/deployed environments)
  if (GOOGLE_CREDENTIALS_JSON) {
    try {
      // Decode from base64 and parse as JSON
      const decoded = Buffer.from(GOOGLE_CREDENTIALS_JSON, 'base64').toString('utf8')
      credentials = JSON.parse(decoded)
      console.log('✅ Using credentials from GOOGLE_CREDENTIALS_JSON environment variable')
    } catch (error) {
      throw new Error(`Failed to parse GOOGLE_CREDENTIALS_JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  } 
  // Fall back to file path (for local development)
  else if (GOOGLE_CREDENTIALS_PATH) {
    const credentialsPath = path.resolve(GOOGLE_CREDENTIALS_PATH)
    
    if (!fs.existsSync(credentialsPath)) {
      throw new Error(`Credentials file not found at: ${credentialsPath}`)
    }

    credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
    console.log(`✅ Using credentials from file: ${credentialsPath}`)
  } else {
    throw new Error('No credentials provided. Set either GOOGLE_CREDENTIALS_JSON or GOOGLE_CREDENTIALS_PATH')
  }
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  })

  const authClient = await auth.getClient()
  const sheets = google.sheets({ version: 'v4', auth: authClient as any })
  
  return sheets
}

// Read data from Google Sheets
async function readSheetData(sheets: any, sheetId: string) {
  console.log('📖 Reading data from Google Sheets...')
  console.log(`   Sheet ID: ${sheetId}`)
  console.log(`   Range: A2:J100`)
  
  // Get cell values
  const valuesResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'A2:J100',
  })

  // Get hyperlinks (for columns G and H which contain image URLs)
  const spreadsheetResponse = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    ranges: ['A2:J100'],
    includeGridData: true,
  })

  const rows = valuesResponse.data.values || []
  console.log(`   Found ${rows.length} rows`)
  
  // Extract hyperlinks from the grid data
  const hyperlinks: { [key: string]: string } = {}
  if (spreadsheetResponse.data.sheets && spreadsheetResponse.data.sheets[0]?.data) {
    const gridData = spreadsheetResponse.data.sheets[0].data[0]
    if (gridData?.rowData) {
      gridData.rowData.forEach((row: any, rowIndex: number) => {
        if (row.values) {
          row.values.forEach((cell: any, colIndex: number) => {
            // Columns G (index 6) and H (index 7) contain image URLs
            if ((colIndex === 6 || colIndex === 7) && cell.hyperlink) {
              const key = `${rowIndex}_${colIndex}`
              hyperlinks[key] = cell.hyperlink
            }
          })
        }
      })
    }
  }

  return { rows, hyperlinks }
}

// Map and filter products
function processProducts(rows: any[][], hyperlinks: { [key: string]: string } = {}) {
  console.log('🔄 Processing products...')
  
  const products = rows
    .map((row, index) => {
      // Column mapping: A=name, B=brand, E=stock, F=price, G=image_url_1, H=image_url_2
      // Array indices: A=0, B=1, E=4, F=5, G=6, H=7
      const name = row[0]?.trim() || null
      const brand = row[1]?.trim() || null
      const stock = parseInt(row[4]) || 0
      
      // Parse price: handle ruble format "₽27,000.00" or plain numbers
      let price: number | null = null
      if (row[5] !== undefined && row[5] !== null && row[5] !== '') {
        let priceValue = row[5]
        
        if (typeof priceValue === 'number') {
          price = priceValue
        } else {
          const priceStr = String(priceValue).trim()
          if (priceStr) {
            const cleanedPrice = priceStr
              .replace(/[₽рубRUB]/gi, '')
              .replace(/\s+/g, '')
              .replace(/,/g, '')
              .trim()
            
            const parsedPrice = parseFloat(cleanedPrice)
            if (!isNaN(parsedPrice) && isFinite(parsedPrice)) {
              price = parsedPrice
            }
          }
        }
      }
      
      // Handle image URLs
      function extractUrl(rowIndex: number, colIndex: number, cellValue: any): string | null {
        const hyperlinkKey = `${rowIndex}_${colIndex}`
        if (hyperlinks[hyperlinkKey]) {
          return hyperlinks[hyperlinkKey]
        }
        
        if (!cellValue) return null
        
        const str = String(cellValue).trim()
        if (!str || str.length === 0) return null
        
        if (str.startsWith('http://') || str.startsWith('https://')) {
          return str
        }
        
        const urlMatch = str.match(/(https?:\/\/[^\s"')]+)/)
        if (urlMatch) {
          return urlMatch[1]
        }
        
        return null
      }
      
      const image_url_1 = extractUrl(index, 6, row[6])
      const image_url_2 = extractUrl(index, 7, row[7])

      // Only include products with valid name and stock > 0
      if (!name || stock <= 0) {
        return null
      }

      return {
        name,
        brand,
        stock,
        price,
        image_url_1,
        image_url_2,
      }
    })
    .filter((product) => product !== null)

  console.log(`   Filtered to ${products.length} products with stock > 0`)
  
  return products
}

// Delete all existing products
async function deleteAllProducts(supabase: any) {
  console.log('🗑️  Deleting all existing products...')
  
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id')
  
  if (fetchError) {
    throw new Error(`Failed to fetch products: ${fetchError.message}`)
  }
  
  if (!products || products.length === 0) {
    console.log('   ℹ️  No products to delete')
    return
  }
  
  console.log(`   Found ${products.length} products to delete`)
  
  const { error } = await supabase
    .from('products')
    .delete()
    .in('id', products.map((p: any) => p.id))
  
  if (error) {
    throw new Error(`Failed to delete products: ${error.message}`)
  }
  
  console.log('   ✅ All products deleted')
}

// Insert products into Supabase
async function insertProducts(supabase: any, products: any[]) {
  if (products.length === 0) {
    console.log('⚠️  No products to insert')
    return
  }

  console.log(`📦 Inserting ${products.length} products into Supabase...`)
  
  // Insert in batches of 100
  const batchSize = 100
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize)
    const { error } = await supabase
      .from('products')
      .insert(batch)
    
    if (error) {
      console.error(`   ❌ Error details:`, error)
      throw new Error(`Failed to insert products batch ${Math.floor(i / batchSize) + 1}: ${error.message}`)
    }
    
    console.log(`   ✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)} (${batch.length} products)`)
  }
  
  console.log(`   ✅ Successfully inserted ${products.length} products`)
}

export async function POST(request: NextRequest) {
  try {
    // Check Authorization header
    const authHeader = request.headers.get('authorization')
    const SYNC_SECRET_KEY = process.env.SYNC_SECRET_KEY

    if (!SYNC_SECRET_KEY) {
      console.error('❌ SYNC_SECRET_KEY environment variable is not set')
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ Missing or invalid Authorization header')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    if (token !== SYNC_SECRET_KEY) {
      console.error('❌ Invalid authorization token')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🚀 Starting Google Sheets to Supabase sync...\n')

    // Validate required environment variables
    const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!GOOGLE_SHEET_ID) {
      throw new Error('GOOGLE_SHEET_ID environment variable is required')
    }
    if (!SUPABASE_URL) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required')
    }
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Initialize Google Sheets API
    const sheets = await initializeSheetsAPI()
    console.log('✅ Google Sheets API initialized\n')

    // Read data from Google Sheets
    const { rows, hyperlinks } = await readSheetData(sheets, GOOGLE_SHEET_ID)
    console.log(`   Found ${Object.keys(hyperlinks).length} hyperlinks in image columns`)
    console.log('')

    // Process products
    const products = processProducts(rows, hyperlinks)
    console.log('')

    // Delete all existing products
    await deleteAllProducts(supabase)
    console.log('')

    // Insert new products
    await insertProducts(supabase, products)
    console.log('')

    console.log('🎉 Sync completed successfully!')

    return NextResponse.json({
      success: true,
      count: products.length
    })

  } catch (error) {
    console.error('❌ Sync failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

