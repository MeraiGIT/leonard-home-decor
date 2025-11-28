import { google } from 'googleapis'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local first, then .env
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
} else {
  dotenv.config() // Fall back to .env
}

// Environment variables
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID
const GOOGLE_CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS_JSON
const GOOGLE_CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
if (!GOOGLE_SHEET_ID) {
  throw new Error('GOOGLE_SHEET_ID environment variable is required')
}
if (!GOOGLE_CREDENTIALS_JSON && !GOOGLE_CREDENTIALS_PATH) {
  throw new Error('Either GOOGLE_CREDENTIALS_JSON or GOOGLE_CREDENTIALS_PATH environment variable is required')
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
async function initializeSheetsAPI() {
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
async function readSheetData(sheets: any) {
  console.log('📖 Reading data from Google Sheets...')
  console.log(`   Sheet ID: ${GOOGLE_SHEET_ID}`)
  console.log(`   Range: A2:J100`)
  
  // Get cell values
  const valuesResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: 'A2:J100',
  })

  // Get hyperlinks (for columns I and J which contain image URLs)
  // Note: We need to get the sheet ID first
  const spreadsheetResponse = await sheets.spreadsheets.get({
    spreadsheetId: GOOGLE_SHEET_ID,
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
      // Example: "₽27,000.00" -> 27000.00
      let price: number | null = null
      if (row[5] !== undefined && row[5] !== null && row[5] !== '') {
        let priceValue = row[5]
        
        // If it's already a number, use it directly
        if (typeof priceValue === 'number') {
          price = priceValue
        } else {
          // Convert to string and clean it
          const priceStr = String(priceValue).trim()
          if (priceStr) {
            // Remove ruble symbol (₽ or ₽ in different encodings), currency symbols, spaces, and commas
            // Match: ₽, руб, RUB, or any non-digit characters except decimal point
            const cleanedPrice = priceStr
              .replace(/[₽рубRUB]/gi, '') // Remove currency symbols
              .replace(/\s+/g, '') // Remove all whitespace
              .replace(/,/g, '') // Remove commas
              .trim()
            
            const parsedPrice = parseFloat(cleanedPrice)
            if (!isNaN(parsedPrice) && isFinite(parsedPrice)) {
              price = parsedPrice
            }
          }
        }
      }
      
      // Handle image URLs: try to get from hyperlinks first, then fall back to cell value
      function extractUrl(rowIndex: number, colIndex: number, cellValue: any): string | null {
        // First, check if there's a hyperlink in the hyperlinks map
        const hyperlinkKey = `${rowIndex}_${colIndex}`
        if (hyperlinks[hyperlinkKey]) {
          return hyperlinks[hyperlinkKey]
        }
        
        // Fall back to cell value
        if (!cellValue) return null
        
        const str = String(cellValue).trim()
        if (!str || str.length === 0) return null
        
        // If it's already a valid URL (starts with http), return it
        if (str.startsWith('http://') || str.startsWith('https://')) {
          return str
        }
        
        // If it's a Google Sheets hyperlink formula, try to extract the URL
        // HYPERLINK("url", "text") or just "url"
        const urlMatch = str.match(/(https?:\/\/[^\s"')]+)/)
        if (urlMatch) {
          return urlMatch[1]
        }
        
        // If we can't extract a valid URL, return null
        return null
      }
      
      // Note: row index in hyperlinks map is relative to A2 (so row 0 = A2, row 1 = A3, etc.)
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
  
  // Log sample of parsed products for debugging
  if (products.length > 0) {
    console.log('\n   Sample parsed product (first one):')
    const sample = products[0]
    console.log(`   - Name: ${sample.name}`)
    console.log(`   - Brand: ${sample.brand || '(null)'}`)
    console.log(`   - Stock: ${sample.stock}`)
    console.log(`   - Price: ${sample.price !== null ? sample.price : '(null)'}`)
    console.log(`   - Image 1: ${sample.image_url_1 || '(null)'}`)
    console.log(`   - Image 2: ${sample.image_url_2 || '(null)'}`)
    
    // Also log the raw row data for columns G and H for debugging
    if (rows.length > 0) {
      console.log(`   - Raw column G (index 6): ${rows[0][6] || '(empty)'}`)
      console.log(`   - Raw column H (index 7): ${rows[0][7] || '(empty)'}`)
    }
  }
  
  return products
}

// Delete all existing products
async function deleteAllProducts() {
  console.log('🗑️  Deleting all existing products...')
  
  // First, fetch all product IDs
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
  
  // Delete all products by ID
  const { error } = await supabase
    .from('products')
    .delete()
    .in('id', products.map(p => p.id))
  
  if (error) {
    throw new Error(`Failed to delete products: ${error.message}`)
  }
  
  console.log('   ✅ All products deleted')
}

// Insert products into Supabase
async function insertProducts(products: any[]) {
  if (products.length === 0) {
    console.log('⚠️  No products to insert')
    return
  }

  console.log(`📦 Inserting ${products.length} products into Supabase...`)
  
  // Log what we're about to insert for debugging
  const sampleProduct = products[0]
  console.log(`   Sample data being inserted:`)
  console.log(`   - Price type: ${typeof sampleProduct.price}, value: ${sampleProduct.price}`)
  console.log(`   - Image 1 type: ${typeof sampleProduct.image_url_1}, value: ${sampleProduct.image_url_1 ? sampleProduct.image_url_1.substring(0, 50) + '...' : 'null'}`)
  
  // Insert in batches of 100 to avoid payload size limits
  const batchSize = 100
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize)
    const { data, error } = await supabase
      .from('products')
      .insert(batch)
      .select()
    
    if (error) {
      console.error(`   ❌ Error details:`, error)
      throw new Error(`Failed to insert products batch ${Math.floor(i / batchSize) + 1}: ${error.message}`)
    }
    
    console.log(`   ✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)} (${batch.length} products)`)
  }
  
  console.log(`   ✅ Successfully inserted ${products.length} products`)
}

// Main sync function
async function sync() {
  try {
    console.log('🚀 Starting Google Sheets to Supabase sync...\n')
    
    // Initialize Google Sheets API
    const sheets = await initializeSheetsAPI()
    console.log('✅ Google Sheets API initialized\n')
    
    // Read data from Google Sheets
    const { rows, hyperlinks } = await readSheetData(sheets)
    console.log(`   Found ${Object.keys(hyperlinks).length} hyperlinks in image columns`)
    console.log('')
    
    // Process products
    const products = processProducts(rows, hyperlinks)
    console.log('')
    
    // Delete all existing products
    await deleteAllProducts()
    console.log('')
    
    // Insert new products
    await insertProducts(products)
    console.log('')
    
    console.log('🎉 Sync completed successfully!')
  } catch (error) {
    console.error('❌ Sync failed:', error)
    process.exit(1)
  }
}

// Run the sync
sync()

